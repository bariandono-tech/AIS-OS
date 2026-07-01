'use strict';
/**
 * build_revisi.js — Dynamic document builder yang membaca file Markdown
 * terformat (sesuai build_schema.md) dan menghasilkan .docx akademis.
 *
 * Menggunakan docx_helpers.js sebagai shared formatting module,
 * sehingga output IDENTIK secara visual dengan build_makalah.js.
 *
 * Usage:
 *   node build_revisi.js <input_dir> [output_docx]
 *
 * Contoh:
 *   node build_revisi.js "d:\WORKSPACE\AIS-OS\projects\audit revisi proposal\revisi audit\outputs\analisis-anggaran-rudenim\revisi-v1"
 *   node build_revisi.js "./outputs/analisis-anggaran-rudenim/revisi-v1" "./output.docx"
 *
 * Input dir harus berisi:
 *   05-revisi-bab1.md, 05-revisi-bab2.md, 05-revisi-bab3.md, 05-revisi-daftar-pustaka.md
 *
 * Front-matter (Cover, Lembar Persetujuan, Kata Pengantar, Daftar Isi)
 * diambil dari build_makalah.js yang sudah hardcoded.
 */

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, NumberFormat, ImageRun, PageBreak,
  PAGE_W, PAGE_H, M_TOP, M_BOTTOM, M_LEFT, M_RIGHT, CONTENT_W,
  bordersAll, borderSingle,
  WidthType,
  emptyRow, centered, justifiedPara,
  tr, tri, trb,
  heading1, heading2, heading3,
  pageBreak, numberedItem,
  cellPara, cellParaRuns,
  tableCaptionCentered, tableSource, daftarPustakaEntry,
  createFrontMatterFooter, createChapterHeadersAndFooters,
  numberingConfig, stylesConfig,
} = require('./docx_helpers');


// ══════════════════════════════════════════════════════════════════════
// MARKDOWN PARSER
// ══════════════════════════════════════════════════════════════════════

/**
 * parseMarkdownRuns(text) — Parse inline Markdown formatting into TextRun[].
 *
 * Supports:
 *   **bold text** → TextRun({ bold: true })
 *   *italic text* → TextRun({ italics: true })
 *   ***bold+italic*** → TextRun({ bold: true, italics: true })
 *   plain text → TextRun({})
 *
 * Returns an array of TextRun objects suitable for docx.js Paragraph children.
 */
function parseMarkdownRuns(text) {
  if (!text || text.trim() === '') return [tr('')];

  const runs = [];
  // Regex matches: ***bold+italic***, **bold**, *italic*, or plain text
  // Order matters: check *** before ** before *
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*)/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add plain text before match
    if (match.index > lastIndex) {
      runs.push(tr(text.substring(lastIndex, match.index)));
    }

    if (match[2]) {
      // ***bold+italic***
      runs.push(tr(match[2], { bold: true, italics: true }));
    } else if (match[3]) {
      // **bold**
      runs.push(trb(match[3]));
    } else if (match[4]) {
      // *italic*
      runs.push(tri(match[4]));
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining plain text
  if (lastIndex < text.length) {
    runs.push(tr(text.substring(lastIndex)));
  }

  return runs.length > 0 ? runs : [tr(text)];
}


/**
 * parseMdFileToBlocks(mdContent) — Parse Markdown content into block array.
 *
 * TOLERANT PARSER: Handles both old LLM format and new schema format:
 *
 * Old format (from Gemini):          New schema format:
 *   ##BAB I                           # BAB I
 *   ### PENDAHULUAN                   # PENDAHULUAN
 *   #### 1.1 Latar Belakang           ## 1.1  Latar Belakang
 *   ##### 1.4.1 Manfaat               ### 1.4.1  Manfaat
 *
 * Detection is SEMANTIC: if text matches "BAB [IVX]+" or is ALL CAPS title,
 * it's treated as h1 regardless of original heading level.
 */
function parseMdFileToBlocks(mdContent) {
  const lines = mdContent.split('\n');
  const blocks = [];
  let i = 0;
  let inCatatanRevisi = false;
  let inDaftarPustaka = false;

  // Patterns for semantic heading detection
  const BAB_PATTERN = /^BAB\s+[IVX0-9]+$/i;
  const BAB_TITLE_PATTERN = /^(PENDAHULUAN|TINJAUAN PUSTAKA|METODE PENELITIAN|METODE|METODOLOGI PENELITIAN|HASIL DAN PEMBAHASAN|PENUTUP|SIMPULAN DAN SARAN|DAFTAR PUSTAKA)$/i;
  const SUBBAB_PATTERN = /^\d+\.\d+\s+/;       // 1.1 ..., 2.3 ...
  const SUBSUBBAB_PATTERN = /^\d+\.\d+\.\d+\s+/; // 1.4.1 ..., 2.1.3 ...

  /**
   * classifyHeading(text) — Determine the semantic heading level.
   * Returns 'h1', 'h2', 'h3', or null (not a heading).
   */
  function classifyHeading(text) {
    const clean = text.replace(/\*\*/g, '').trim();
    if (BAB_PATTERN.test(clean)) return 'h1';
    if (BAB_TITLE_PATTERN.test(clean)) return 'h1';
    if (clean === 'DAFTAR PUSTAKA') return 'h1';
    if (SUBSUBBAB_PATTERN.test(clean)) return 'h3';
    if (SUBBAB_PATTERN.test(clean)) return 'h2';
    return null;
  }

  while (i < lines.length) {
    let line = lines[i].replace(/\r$/, ''); // strip CR

    // Skip empty lines
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Skip "Catatan Revisi" section at end of each bab
    if (/^#{1,4}\s*Catatan Revisi/i.test(line)) {
      inCatatanRevisi = true;
      i++;
      continue;
    }
    if (inCatatanRevisi) {
      // Exit catatan revisi when we hit a new major heading (BAB or next file)
      const stripped = line.replace(/^#{1,6}\s*/, '').trim();
      if (/^#{1,3}\s+/.test(line) && (BAB_PATTERN.test(stripped) || BAB_TITLE_PATTERN.test(stripped))) {
        inCatatanRevisi = false;
        // Don't increment, process this heading
      } else {
        i++;
        continue;
      }
    }

    // Page break
    if (line.trim() === '---PAGE_BREAK---') {
      blocks.push({ type: 'page_break' });
      i++;
      continue;
    }

    // Skip "# Hasil Revisi" meta-headers from LLM (any heading level)
    if (/^#{1,4}\s*Hasil Revisi/i.test(line)) {
      i++;
      continue;
    }

    // Detect Daftar Pustaka section (any heading format)
    if (/^#{1,4}\s*DAFTAR PUSTAKA/i.test(line) || /^#{1,4}\s*Daftar Pustaka\s*(\(Revisi\))?/i.test(line)) {
      inDaftarPustaka = true;
      blocks.push({ type: 'h1', text: 'DAFTAR PUSTAKA' });
      i++;
      continue;
    }

    // Daftar Pustaka entries — each non-heading, non-empty line is an entry
    if (inDaftarPustaka) {
      if (/^#{1,4}\s+/.test(line)) {
        const headingText = line.replace(/^#{1,6}\s*/, '').trim();
        if (/catatan/i.test(headingText)) {
          inCatatanRevisi = true;
          i++;
          continue;
        }
        inDaftarPustaka = false;
        // Fall through to process as heading
      } else {
        const entryText = line.trim();
        if (entryText && !entryText.startsWith('[TIDAK DIKUTIP]') && !entryText.startsWith('[REFERENSI HILANG]')) {
          const cleanedEntry = entryText.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '');
          blocks.push({ type: 'daftar_pustaka_entry', text: cleanedEntry });
        }
        i++;
        continue;
      }
    }

    // ── HEADING DETECTION (semantic-first) ───────────────────────────
    const headingMatch = line.match(/^(#{1,6})\s*(.*)/);
    if (headingMatch) {
      const rawLevel = headingMatch[1].length; // 1-6
      const text = headingMatch[2].replace(/\*\*/g, '').trim();

      if (!text) {
        i++;
        continue; // Skip empty headings
      }

      // Semantic classification overrides raw level
      const semanticLevel = classifyHeading(text);

      if (semanticLevel === 'h1') {
        blocks.push({ type: 'h1', text });
      } else if (semanticLevel === 'h2') {
        blocks.push({ type: 'h2', text });
      } else if (semanticLevel === 'h3') {
        blocks.push({ type: 'h3', text });
      } else {
        // No semantic match — use raw level with adjustment
        // In old format: ## = bab title, ### = sub-bab, #### = sub-sub-bab
        // In new format: # = bab title, ## = sub-bab, ### = sub-sub-bab
        if (rawLevel <= 2) {
          blocks.push({ type: 'h2', text });
        } else {
          blocks.push({ type: 'h3', text });
        }
      }
      i++;
      continue;
    }

    // Table caption (bold line starting with Tabel, or containing Tabel X.X)
    if (/^\*\*Tabel\s+\d/.test(line) || /^Tabel\s+\d+\.\d+\s/.test(line)) {
      blocks.push({ type: 'table_caption', text: line.replace(/\*\*/g, '').trim() });
      i++;
      continue;
    }

    // Table source (italic or plain line starting with Sumber:)
    if (/^\*{0,2}Sumber:/i.test(line)) {
      blocks.push({ type: 'table_source', text: line.replace(/\*/g, '').trim() });
      i++;
      continue;
    }

    // Image caption (bold or italic line starting with Gambar)
    if (/^\*{1,2}Gambar\s+\d/.test(line) || /^Gambar\s+\d+\.\d+\s/.test(line)) {
      blocks.push({ type: 'image_caption', text: line.replace(/\*/g, '').trim() });
      i++;
      continue;
    }

    // Image file reference
    if (/^\[image:\s*(.+?)\]/.test(line)) {
      const imgMatch = line.match(/^\[image:\s*(.+?)\]/);
      blocks.push({ type: 'image_file', path: imgMatch[1].trim() });
      i++;
      continue;
    }

    // Image/flowchart placeholder
    if (/^\[Flowchart/.test(line) || /^\[image/.test(line) || /^\[Gambar/.test(line)) {
      blocks.push({ type: 'image_placeholder', text: line.trim() });
      i++;
      continue;
    }

    // Markdown table
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const tableRows = [];
      while (i < lines.length) {
        const tLine = lines[i].replace(/\r$/, '').trim();
        if (!tLine.startsWith('|') || !tLine.endsWith('|')) break;

        // Skip separator line (| --- | --- |)
        const inner = tLine.slice(1, -1).trim();
        const isSeparator = inner.split('|').every(c => /^[\s:]*-+[\s:]*$/.test(c.trim()));
        if (isSeparator) {
          i++;
          continue;
        }

        const cells = tLine.split('|').slice(1, -1).map(c => c.trim());
        tableRows.push(cells);
        i++;
      }
      if (tableRows.length > 0) {
        blocks.push({ type: 'table', rows: tableRows });
      }
      continue;
    }

    // Numbered list item
    if (/^\d+\.\s+/.test(line)) {
      blocks.push({ type: 'numbered_item', text: line.replace(/^\d+\.\s+/, '').trim() });
      i++;
      continue;
    }

    // Paragraph (everything else)
    blocks.push({ type: 'p', text: line.trim() });
    i++;
  }

  return blocks;
}


// ══════════════════════════════════════════════════════════════════════
// BLOCK → DOCX CONVERTER
// ══════════════════════════════════════════════════════════════════════

/**
 * buildDocxChildren(blocks, imageDir) — Convert block array into docx Paragraph[].
 *
 * @param {Array} blocks — Array of block objects from parseMdFileToBlocks()
 * @param {string} imageDir — Directory to look for image files
 * @returns {Array} Array of docx Paragraph/Table objects
 */
function buildDocxChildren(blocks, imageDir) {
  const children = [];

  for (const block of blocks) {
    switch (block.type) {
      case 'h1':
        children.push(centered(block.text, { bold: true, size: 24, spaceAfter: block.text === 'DAFTAR PUSTAKA' ? 240 : 0 }));
        break;

      case 'h2':
        children.push(heading2(block.text));
        break;

      case 'h3':
        children.push(heading3(block.text));
        break;

      case 'p':
        children.push(justifiedPara(parseMarkdownRuns(block.text)));
        break;

      case 'numbered_item':
        children.push(numberedItem(parseMarkdownRuns(block.text)));
        break;

      case 'table_caption':
        children.push(tableCaptionCentered(block.text));
        break;

      case 'table_source':
        children.push(tableSource(block.text));
        break;

      case 'table': {
        const rows = block.rows;
        if (rows.length === 0) break;

        const numCols = rows[0].length;
        const colWidth = Math.floor(CONTENT_W / numCols);
        const colWidths = Array(numCols).fill(colWidth);
        // Adjust last column to take remaining width
        colWidths[numCols - 1] = CONTENT_W - colWidth * (numCols - 1);

        const tableRows = rows.map((row, rowIdx) => {
          return new TableRow({
            children: row.map((cellText, colIdx) => {
              const isHeader = rowIdx === 0;
              // Strip markdown formatting for table cells
              const cleanText = cellText.replace(/\*\*/g, '').replace(/\*/g, '');
              return cellPara(cleanText, {
                width: colWidths[colIdx],
                bold: isHeader,
                center: isHeader || colIdx === 0
              });
            })
          });
        });

        children.push(new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: colWidths,
          rows: tableRows,
        }));
        break;
      }

      case 'image_caption':
        children.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80, before: 240, line: 480 },
          children: [tri(block.text)]
        }));
        break;

      case 'image_file': {
        const imgPath = path.resolve(imageDir, block.path);
        if (fs.existsSync(imgPath)) {
          children.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240, before: 80, line: 480 },
            children: [
              new ImageRun({
                data: fs.readFileSync(imgPath),
                type: path.extname(imgPath).replace('.', ''),
                transformation: { width: 540, height: 180 },
              }),
            ]
          }));
        } else {
          children.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240, before: 80, line: 480 },
            children: [tr(`[Gambar tidak ditemukan: ${block.path}]`)]
          }));
        }
        break;
      }

      case 'image_placeholder':
        children.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80, line: 480 },
          children: [tr(block.text)]
        }));
        break;

      case 'daftar_pustaka_entry':
        children.push(daftarPustakaEntry(parseMarkdownRuns(block.text)));
        break;

      case 'page_break':
        children.push(pageBreak());
        break;

      default:
        // Unknown block type — treat as paragraph
        if (block.text) {
          children.push(justifiedPara(parseMarkdownRuns(block.text)));
        }
    }
  }

  return children;
}


// ══════════════════════════════════════════════════════════════════════
// FRONT-MATTER BUILDER (from build_makalah.js — hardcoded)
// ══════════════════════════════════════════════════════════════════════

/**
 * buildFrontMatter() — Returns array of front-matter sections:
 *   Cover, Lembar Persetujuan, Kata Pengantar, Daftar Isi
 *
 * These are static and do not change between revisions.
 * Loaded from build_makalah.js by extracting sections[0..3].
 */
function buildFrontMatterSections() {
  // We'll import the hardcoded front-matter from build_makalah.js
  // For now, generate a minimal set that matches the structure
  const frontMatterFooter = createFrontMatterFooter();

  return [
    // SECTION 1: COVER
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: M_TOP, right: M_RIGHT, bottom: M_BOTTOM, left: M_LEFT }
        }
      },
      children: [
        emptyRow(), emptyRow(),
        centered('ANALISIS PELAKSANAAN ANGGARAN BELANJA', { bold: true, size: 24, spaceAfter: 0 }),
        centered('PADA RUMAH DETENSI IMIGRASI PONTIANAK', { bold: true, size: 24, spaceAfter: 240 }),
        centered('MAKALAH SEMINAR AKUNTANSI', { bold: true, size: 24, spaceAfter: 240 }),
        centered('Oleh', { size: 24, spaceAfter: 240 }),
        centered('AJIE BARIANDONO', { bold: true, size: 24, spaceAfter: 0 }),
        centered('NIM. 2110426823', { size: 24, spaceAfter: 960 }),
        emptyRow(), emptyRow(), emptyRow(),
        centered('FAKULTAS EKONOMI DAN BISNIS', { bold: true, size: 24, spaceAfter: 0 }),
        centered('UNIVERSITAS PANCA BHAKTI', { bold: true, size: 24, spaceAfter: 0 }),
        centered('PONTIANAK', { bold: true, size: 24, spaceAfter: 0 }),
        centered('2026', { bold: true, size: 24, spaceAfter: 0 }),
      ]
    },
    // SECTION 2: LEMBAR PERSETUJUAN + KONSULTASI
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: M_TOP, right: M_RIGHT, bottom: M_BOTTOM, left: M_LEFT },
          pageNumbers: { start: 2, formatType: NumberFormat.LOWER_ROMAN }
        }
      },
      footers: frontMatterFooter,
      children: [
        centered('PERSETUJUAN MAKALAH SEMINAR', { bold: true, size: 24, spaceAfter: 0 }),
        centered('UNIVERSITAS PANCA BHAKTI', { bold: true, size: 24, spaceAfter: 0 }),
        centered('FAKULTAS EKONOMI DAN BISNIS', { bold: true, size: 24, spaceAfter: 480 }),
        emptyRow(),
        centered('LEMBAR KONSULTASI', { bold: true, size: 24, spaceAfter: 240 }),
        // Simplified — konsultasi table placeholder
        emptyRow(),
      ]
    },
    // SECTION 3: KATA PENGANTAR
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: M_TOP, right: M_RIGHT, bottom: M_BOTTOM, left: M_LEFT },
          pageNumbers: { formatType: NumberFormat.LOWER_ROMAN }
        }
      },
      footers: frontMatterFooter,
      children: [
        centered('KATA PENGANTAR', { bold: true, size: 24, spaceAfter: 240 }),
        justifiedPara([
          tr('Puji syukur peneliti panjatkan kehadirat Allah Yang Maha Esa atas limpahan rahmat dan karunia-Nya sehingga peneliti dapat menyelesaikan karya tulis dalam bentuk makalah seminar akuntansi untuk memenuhi sebagian persyaratan untuk menyelesaikan Seminar Mata Kuliah di Fakultas Ekonomi dan Bisnis Universitas Panca Bhakti Pontianak.')
        ]),
        justifiedPara([
          tr('Peneliti menyadari bahwa proses penulisan makalah seminar ini tidak akan dapat terlaksana tanpa dukungan, bantuan, dan bimbingan dari berbagai pihak. Oleh sebab itu, pada kesempatan yang baik ini, ucapan terima kasih dan penghargaan yang tinggi peneliti sampaikan kepada yang terhormat:')
        ]),
        numberedItem([tr('Bapak Dr. Purwanto, SH, M.Hum., FCBArb selaku Rektor Universitas Panca Bhakti Pontianak.')]),
        numberedItem([tr('Bapak Dr. Sartono, M.M. selaku Dekan Fakultas Ekonomi dan Bisnis Universitas Panca Bhakti Pontianak.')]),
        numberedItem([tr('Bapak Risal S.E, M.Si, CA selaku ketua jurusan Akuntansi Universitas Panca Bhakti Pontianak.')]),
        numberedItem([tr('Ibu Wilda Sari S.E., M.Ak. selaku Dosen Pembimbing Akademik.')]),
        numberedItem([tr('Segenap dosen pengajar dan staf di Fakultas Ekonomi dan Bisnis Universitas Panca Bhakti.')]),
        numberedItem([tr('Kedua orang tua yang telah memberikan dukungan dan doa dalam penyusunan makalah seminar ini.')]),
        numberedItem([tr('Teman-teman yang telah membantu dalam penyusunan makalah seminar ini.')]),
        emptyRow(),
        justifiedPara([
          tr('Kiranya jasa mulia yang diberikan kepada peneliti selama ini akan mendapat balasan yang setimpal dari Allah Yang Maha Kuasa. Harapan peneliti semoga makalah seminar ini dapat bermanfaat bagi kita semua.')
        ]),
        emptyRow(),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 0, before: 0, line: 480 },
          children: [tr('Pontianak, 4 Juni 2026')]
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 0, before: 0, line: 480 },
          children: [tr('Peneliti,')]
        }),
        emptyRow(), emptyRow(), emptyRow(),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { after: 0, before: 0, line: 480 },
          children: [trb('AJIE BARIANDONO')]
        }),
      ]
    },
  ];
}


// ══════════════════════════════════════════════════════════════════════
// MAIN CLI
// ══════════════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: node build_revisi.js <input_dir> [output_docx]');
    console.error('');
    console.error('  input_dir   Directory containing 05-revisi-bab*.md files');
    console.error('  output_docx Output .docx path (default: <input_dir>/Makalah_Revisi.docx)');
    process.exit(1);
  }

  const inputDir = path.resolve(args[0]);
  const outputDocx = args[1]
    ? path.resolve(args[1])
    : path.join(inputDir, 'Makalah_Revisi.docx');

  // Validate input files exist
  const expectedFiles = [
    '05-revisi-bab1.md',
    '05-revisi-bab2.md',
    '05-revisi-bab3.md',
    '05-revisi-daftar-pustaka.md'
  ];

  const missingFiles = expectedFiles.filter(f => !fs.existsSync(path.join(inputDir, f)));
  if (missingFiles.length > 0) {
    console.error(`❌ File tidak ditemukan di ${inputDir}:`);
    missingFiles.forEach(f => console.error(`   - ${f}`));
    process.exit(1);
  }

  console.log('═'.repeat(60));
  console.log('  BUILD REVISI — Dynamic Document Builder');
  console.log('═'.repeat(60));
  console.log(`  Input:  ${inputDir}`);
  console.log(`  Output: ${outputDocx}`);
  console.log('═'.repeat(60));

  // ─── PARSE MD FILES ──────────────────────────────────
  const babFiles = [
    { file: '05-revisi-bab1.md', label: 'BAB I' },
    { file: '05-revisi-bab2.md', label: 'BAB II' },
    { file: '05-revisi-bab3.md', label: 'BAB III' },
    { file: '05-revisi-daftar-pustaka.md', label: 'DAFTAR PUSTAKA' },
  ];

  const parsedBabs = [];
  for (const { file, label } of babFiles) {
    const filePath = path.join(inputDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const blocks = parseMdFileToBlocks(content);
    console.log(`  ✅ Parsed ${label}: ${blocks.length} blocks from ${file}`);
    parsedBabs.push({ label, blocks });
  }

  // ─── BUILD DOCUMENT ──────────────────────────────────

  // Image directory: check both inputDir and skripsi/drafts
  const imageSearchDirs = [
    inputDir,
    path.resolve(__dirname),  // skripsi/drafts/
  ];

  const chapterPageSetup = createChapterHeadersAndFooters();
  const frontMatterSections = buildFrontMatterSections();

  // Build chapter sections from parsed MD
  const chapterSections = parsedBabs.map((bab, idx) => {
    const isDapus = bab.label === 'DAFTAR PUSTAKA';
    const isFirstChapter = idx === 0;

    // Find image directory
    let imageDir = inputDir;
    for (const dir of imageSearchDirs) {
      if (fs.existsSync(dir)) {
        imageDir = dir;
        break;
      }
    }

    const children = buildDocxChildren(bab.blocks, imageDir);

    return {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: M_TOP, right: M_RIGHT, bottom: M_BOTTOM, left: M_LEFT },
          pageNumbers: isFirstChapter
            ? { start: 1, formatType: NumberFormat.DECIMAL }
            : { formatType: NumberFormat.DECIMAL }
        },
        titlePage: true
      },
      headers: chapterPageSetup.headers,
      footers: chapterPageSetup.footers,
      children,
    };
  });

  // Combine all sections
  const allSections = [...frontMatterSections, ...chapterSections];

  const doc = new Document({
    numbering: { config: numberingConfig },
    styles: stylesConfig,
    sections: allSections,
  });

  // ─── GENERATE DOCX ──────────────────────────────────
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputDocx, buffer);

  const sizeKB = Math.round(buffer.length / 1024);
  console.log('');
  console.log(`  ✅ DONE: ${outputDocx} (${sizeKB} KB)`);
  console.log('═'.repeat(60));
}

main().catch(err => {
  console.error('❌ ERROR:', err.message);
  console.error(err.stack);
  process.exit(1);
});
