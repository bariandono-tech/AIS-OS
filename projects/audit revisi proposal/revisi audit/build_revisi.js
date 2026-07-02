'use strict';
/**
 * build_revisi.js — Self-contained document builder.
 *
 * Membaca file Markdown terformat (sesuai templates/build_schema.md)
 * dan menghasilkan .docx akademis UPB format.
 *
 * Self-contained: tidak bergantung ke skripsi/drafts/docx_helpers.js
 *
 * Usage:
 *   node build_revisi.js <input_dir> [output_docx]
 *
 * Contoh:
 *   node build_revisi.js "outputs/analisis-anggaran-rudenim/revisi-v1"
 *   node build_revisi.js "outputs/analisis-anggaran-rudenim/revisi-v1" "output.docx"
 *
 * Input dir harus berisi:
 *   05-revisi-bab1.md, 05-revisi-bab2.md, 05-revisi-bab3.md, 05-revisi-daftar-pustaka.md
 */

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  PageNumber, PageBreak, Header, Footer,
  PositionalTab, PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader,
  NumberFormat, ImageRun, TableOfContents,
} = require('docx');


// ══════════════════════════════════════════════════════════════════════
// LAYOUT CONSTANTS — dibaca dari pedoman/<kampus>.json (default: upb)
// ══════════════════════════════════════════════════════════════════════
// Kampus baru = buat pedoman/<kampus>.json lalu set env PEDOMAN=<kampus>.
function loadPedoman() {
  const name = process.env.PEDOMAN || 'upb';
  const p = path.join(__dirname, 'pedoman', name + '.json');
  if (!fs.existsSync(p)) {
    console.error(`❌ Pedoman tidak ditemukan: ${p}`);
    console.error(`   Buat file pedoman/${name}.json (aturan format kampus) lalu jalankan lagi.`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}
const PEDOMAN = loadPedoman();
// A4 margins UPB: top 4cm, bottom 3cm, left 4cm, right 3cm
const PAGE_W = PEDOMAN.page.width;
const PAGE_H = PEDOMAN.page.height;
const M_TOP = PEDOMAN.page.margin.top;
const M_BOTTOM = PEDOMAN.page.margin.bottom;
const M_LEFT = PEDOMAN.page.margin.left;
const M_RIGHT = PEDOMAN.page.margin.right;
const CONTENT_W = PAGE_W - M_LEFT - M_RIGHT;


// ══════════════════════════════════════════════════════════════════════
// BORDERS
// ══════════════════════════════════════════════════════════════════════
const border0 = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const borders0 = { top: border0, bottom: border0, left: border0, right: border0 };
const borderSingle = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
const bordersAll = { top: borderSingle, bottom: borderSingle, left: borderSingle, right: borderSingle };
// Tabel akademis "terbuka" (3 garis): header bergaris atas+bawah, baris tengah tanpa garis,
// baris terakhir bergaris bawah. Tidak ada garis vertikal. (Sesuai pedoman + gaya makalah-sim.)
const bordersHeader = { top: borderSingle, bottom: borderSingle, left: border0, right: border0 };
const bordersMiddle = { top: border0, bottom: border0, left: border0, right: border0 };
const bordersBottom = { top: border0, bottom: borderSingle, left: border0, right: border0 };


// ══════════════════════════════════════════════════════════════════════
// FORMATTING HELPERS
// ══════════════════════════════════════════════════════════════════════

function emptyRow() {
  return new Paragraph({ spacing: { after: 0, before: 0, line: 360 }, children: [new TextRun('')] });
}

function centered(text, { bold = false, size = 24, font = 'Times New Roman', spaceAfter = 0, spaceBefore = 0, allCaps = false } = {}) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: spaceAfter, before: spaceBefore, line: 480 },
    children: [new TextRun({ text, bold, size, font, allCaps })]
  });
}

function justifiedPara(runs, { spaceAfter = 0, spaceBefore = 0, indent = true, firstLine = 709 } = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: spaceAfter, before: spaceBefore, line: 480 },
    indent: indent ? { firstLine } : undefined,
    children: Array.isArray(runs) ? runs : [new TextRun({ text: runs, font: 'Times New Roman', size: 24 })]
  });
}

function tr(text, opts = {}) {
  return new TextRun({ text, font: 'Times New Roman', size: 24, ...opts });
}
function tri(text) { return tr(text, { italics: true }); }
function trb(text) { return tr(text, { bold: true }); }

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.LEFT,
    spacing: { after: 160, before: 240, line: 480 },
    children: parseMarkdownRuns(text, { bold: true })
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    alignment: AlignmentType.LEFT,
    spacing: { after: 160, before: 240, line: 480 },
    children: parseMarkdownRuns(text, { bold: true })
  });
}

// Heading 1 untuk judul BAB: tampil DUA baris ("BAB I" lalu judul) tapi SATU entri di Daftar Isi.
function chapterHeader(num, title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 480, after: 240, line: 480 },
    keepNext: true,
    children: [
      new TextRun({ text: num, bold: true, size: 24, font: 'Times New Roman' }),
      new TextRun({ text: title, bold: true, size: 24, font: 'Times New Roman', break: 1 }),
    ],
  });
}

// Heading 1 untuk judul satu baris (KATA PENGANTAR, DAFTAR ISI, DAFTAR PUSTAKA) — masuk Daftar Isi.
function frontMatterHeader(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 480, after: 240, line: 480 },
    keepNext: true,
    children: [new TextRun({ text: title, bold: true, size: 24, font: 'Times New Roman' })],
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function numberedItem(runs, reference = 'arabic-numbering') {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 0, before: 0, line: 480 },
    indent: { left: 720, hanging: 360 },
    numbering: { reference, level: 0 },
    children: Array.isArray(runs) ? runs : [tr(runs)]
  });
}

function cellPara(text, { width, bold = false, center = false, italic = false, borders = bordersAll } = {}) {
  return new TableCell({
    borders: borders,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { after: 0, before: 0, line: 360 },
      children: [new TextRun({ text, font: 'Times New Roman', size: 22, bold, italics: italic })]
    })]
  });
}

function cellParaRuns(runs, { width, center = false } = {}) {
  return new TableCell({
    borders: bordersAll,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { after: 0, before: 0, line: 360 },
      children: runs
    })]
  });
}

function tableCaptionCentered(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80, before: 240, line: 480 },
    children: parseMarkdownRuns(text, { bold: true })
  });
}

function tableSource(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 240, before: 80, line: 480 },
    children: [new TextRun({ text, italics: true, font: 'Times New Roman', size: 22 })]
  });
}

function daftarPustakaEntry(runs) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 360, before: 0, line: 240 },
    indent: { left: 709, hanging: 709 },
    children: Array.isArray(runs) ? runs : [tr(runs)]
  });
}

function tocEntry(label, pageNum, level = 0, bold = false) {
  const indent = level === 0 ? 0 : 360;
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 0, before: level === 0 ? 120 : 0, line: 360 },
    indent: { left: indent },
    children: [
      new TextRun({ text: label, bold, font: 'Times New Roman', size: 24 }),
      new TextRun({
        children: [
          new PositionalTab({
            alignment: PositionalTabAlignment.RIGHT,
            relativeTo: PositionalTabRelativeTo.MARGIN,
            leader: PositionalTabLeader.DOT,
          }),
          pageNum,
        ],
        bold,
        font: 'Times New Roman', size: 24,
      }),
    ],
  });
}

function createFrontMatterFooter() {
  return {
    default: new Footer({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 0, before: 0, line: 480 },
          children: [new TextRun({ children: [PageNumber.CURRENT], font: 'Times New Roman', size: 24 })]
        })
      ]
    })
  };
}

function createChapterHeadersAndFooters() {
  return {
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 0, before: 0, line: 480 },
            children: [new TextRun({ children: [PageNumber.CURRENT], font: 'Times New Roman', size: 24 })]
          })
        ]
      }),
      first: new Header({ children: [] })
    },
    footers: {
      default: new Footer({ children: [] }),
      first: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 0, before: 0, line: 480 },
            children: [new TextRun({ children: [PageNumber.CURRENT], font: 'Times New Roman', size: 24 })]
          })
        ]
      })
    }
  };
}

// Satu referensi penomoran per-list agar tiap daftar bernomor MULAI dari 1 lagi
// (mencegah Word menyambung nomor antar sub-bab: 8,9,10,...). 'arabic-numbering'
// dipakai front-matter (Kata Pengantar); 'list-1','list-2',... dipakai isi badan.
function _numLevel(reference) {
  return {
    reference,
    levels: [{
      level: 0,
      format: LevelFormat.DECIMAL,
      text: '%1.',
      alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } }
    }]
  };
}
const numberingConfig = [_numLevel('arabic-numbering')];
for (let i = 1; i <= 200; i++) numberingConfig.push(_numLevel(`list-${i}`));

const stylesConfig = {
  default: {
    document: { run: { font: 'Times New Roman', size: 24 } }
  },
  paragraphStyles: [
    {
      id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { size: 24, bold: true, font: 'Times New Roman' },
      paragraph: { spacing: { before: 480, after: 160 }, outlineLevel: 0, alignment: AlignmentType.CENTER }
    },
    {
      id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { size: 24, bold: true, font: 'Times New Roman' },
      paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 }
    },
    {
      id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { size: 24, bold: true, font: 'Times New Roman' },
      paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 2 }
    },
    // Style entri Daftar Isi level-1 (BAB, KATA PENGANTAR, DAFTAR ISI, DAFTAR PUSTAKA)
    // → dibuat TEBAL. Word memakai style "TOC1" saat mengisi field TOC untuk entri
    // Heading 1. Level-2 (sub-bab x.x) dibiarkan normal.
    {
      id: 'TOC1', name: 'toc 1', basedOn: 'Normal', next: 'Normal',
      run: { size: 24, bold: true, font: 'Times New Roman' }
    },
  ]
};


// ══════════════════════════════════════════════════════════════════════
// MARKDOWN PARSER
// ══════════════════════════════════════════════════════════════════════

// Parser inline Markdown REKURSIF + mewarisi format dasar (base).
// - **tebal** → di-parse ulang isinya agar *miring* di DALAM tebal ikut jadi miring.
// - *miring*  → di-parse ulang isinya (jaga-jaga ada **tebal** di dalam).
// - ***tebal+miring***
// `base` = format turunan (mis. { bold: true } untuk judul sub-bab yang seluruhnya tebal).
function parseMarkdownRuns(text, base = {}) {
  if (text === undefined || text === null) return [tr('', base)];
  if (text === '') return [tr('', base)];

  const runs = [];
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push(tr(text.substring(lastIndex, match.index), base));
    }
    if (match[2] !== undefined) {
      // ***tebal+miring***
      runs.push(tr(match[2], { ...base, bold: true, italics: true }));
    } else if (match[3] !== undefined) {
      // **tebal** → parse ulang isi untuk menangkap *miring* bersarang
      runs.push(...parseMarkdownRuns(match[3], { ...base, bold: true }));
    } else if (match[4] !== undefined) {
      // *miring* → parse ulang isi untuk menangkap **tebal** bersarang
      runs.push(...parseMarkdownRuns(match[4], { ...base, italics: true }));
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    runs.push(tr(text.substring(lastIndex), base));
  }

  return runs.length > 0 ? runs : [tr(text, base)];
}

function parseMdFileToBlocks(mdContent) {
  const lines = mdContent.split('\n');
  const blocks = [];
  let i = 0;
  let inCatatanRevisi = false;
  let inDaftarPustaka = false;

  const BAB_PATTERN = /^BAB\s+[IVX0-9]+$/i;
  const BAB_TITLE_PATTERN = /^(PENDAHULUAN|TINJAUAN PUSTAKA|METODE PENELITIAN|METODE|METODOLOGI PENELITIAN|HASIL DAN PEMBAHASAN|PENUTUP|SIMPULAN DAN SARAN|DAFTAR PUSTAKA)$/i;
  const SUBBAB_PATTERN = /^\d+\.\d+\s+/;
  const SUBSUBBAB_PATTERN = /^\d+\.\d+\.\d+\s+/;

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
    let line = lines[i].replace(/\r$/, '');

    if (line.trim() === '') { i++; continue; }

    if (/^#{1,4}\s*Catatan Revisi/i.test(line)) {
      inCatatanRevisi = true; i++; continue;
    }
    if (inCatatanRevisi) {
      const stripped = line.replace(/^#{1,6}\s*/, '').trim();
      if (/^#{1,3}\s+/.test(line) && (BAB_PATTERN.test(stripped) || BAB_TITLE_PATTERN.test(stripped))) {
        inCatatanRevisi = false;
      } else { i++; continue; }
    }

    if (line.trim() === '---PAGE_BREAK---') {
      blocks.push({ type: 'page_break' }); i++; continue;
    }

    // Skip bare horizontal-rule separators (---, --, ———) — bukan konten,
    // hanya pemisah seksi di Markdown. Tiap bab sudah section docx terpisah.
    if (/^[-—]{2,}$/.test(line.trim())) { i++; continue; }

    if (/^#{1,4}\s*Hasil Revisi/i.test(line)) { i++; continue; }

    if (/^#{1,4}\s*DAFTAR PUSTAKA/i.test(line) || /^#{1,4}\s*Daftar Pustaka\s*(\(Revisi\))?/i.test(line)) {
      inDaftarPustaka = true;
      blocks.push({ type: 'h1', text: 'DAFTAR PUSTAKA' });
      i++; continue;
    }

    if (inDaftarPustaka) {
      if (/^#{1,4}\s+/.test(line)) {
        const headingText = line.replace(/^#{1,6}\s*/, '').trim();
        if (/catatan/i.test(headingText)) { inCatatanRevisi = true; i++; continue; }
        inDaftarPustaka = false;
      } else {
        const entryText = line.trim();
        if (entryText && !entryText.startsWith('[TIDAK DIKUTIP]') && !entryText.startsWith('[REFERENSI HILANG]')) {
          const cleanedEntry = entryText.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '');
          blocks.push({ type: 'daftar_pustaka_entry', text: cleanedEntry });
        }
        i++; continue;
      }
    }

    const headingMatch = line.match(/^(#{1,6})\s*(.*)/);
    if (headingMatch) {
      const rawLevel = headingMatch[1].length;
      const text = headingMatch[2].replace(/\*\*/g, '').trim();
      if (!text) { i++; continue; }

      const semanticLevel = classifyHeading(text);
      if (semanticLevel === 'h1') {
        blocks.push({ type: 'h1', text });
      } else if (semanticLevel === 'h2') {
        blocks.push({ type: 'h2', text });
      } else if (semanticLevel === 'h3') {
        blocks.push({ type: 'h3', text });
      } else {
        blocks.push({ type: rawLevel <= 2 ? 'h2' : 'h3', text });
      }
      i++; continue;
    }

    if (/^\*\*Tabel\s+\d/.test(line) || /^Tabel\s+\d+\.\d+\s/.test(line)) {
      blocks.push({ type: 'table_caption', text: line.replace(/\*\*/g, '').trim() }); i++; continue;
    }

    if (/^\*{0,2}Sumber:/i.test(line)) {
      blocks.push({ type: 'table_source', text: line.replace(/\*/g, '').trim() }); i++; continue;
    }

    if (/^\*{1,2}Gambar\s+\d/.test(line) || /^Gambar\s+\d+\.\d+\s/.test(line)) {
      blocks.push({ type: 'image_caption', text: line.replace(/\*/g, '').trim() }); i++; continue;
    }

    if (/^\[image:\s*(.+?)\]/.test(line)) {
      const imgMatch = line.match(/^\[image:\s*(.+?)\]/);
      blocks.push({ type: 'image_file', path: imgMatch[1].trim() }); i++; continue;
    }

    if (/^\[Flowchart/.test(line) || /^\[image/.test(line) || /^\[Gambar/.test(line)) {
      blocks.push({ type: 'image_placeholder', text: line.trim() }); i++; continue;
    }

    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const tableRows = [];
      while (i < lines.length) {
        const tLine = lines[i].replace(/\r$/, '').trim();
        if (!tLine.startsWith('|') || !tLine.endsWith('|')) break;
        const inner = tLine.slice(1, -1).trim();
        const isSeparator = inner.split('|').every(c => /^[\s:]*-+[\s:]*$/.test(c.trim()));
        if (isSeparator) { i++; continue; }
        const cells = tLine.split('|').slice(1, -1).map(c => c.trim());
        tableRows.push(cells);
        i++;
      }
      if (tableRows.length > 0) blocks.push({ type: 'table', rows: tableRows });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      blocks.push({ type: 'numbered_item', text: line.replace(/^\d+\.\s+/, '').trim() }); i++; continue;
    }

    blocks.push({ type: 'p', text: line.trim() });
    i++;
  }

  return blocks;
}


// ══════════════════════════════════════════════════════════════════════
// BLOCK → DOCX CONVERTER
// ══════════════════════════════════════════════════════════════════════

// Counter list bernomor bersifat MODUL (bukan per-call) supaya tiap daftar di
// SELURUH dokumen dapat referensi numId unik. Kalau lokal, buildDocxChildren yang
// dipanggil per-bab akan me-reset counter → list BAB III pakai ulang numId list
// BAB I (RM/Tujuan) → Word menyambung nomornya jadi 4,5,6. Lihat catatan bug.
let listCounter = 0;

function buildDocxChildren(blocks, imageDir) {
  const children = [];
  let inNumberedList = false; // sedang di tengah satu list?

  for (let bi = 0; bi < blocks.length; bi++) {
    const block = blocks[bi];
    if (block.type !== 'numbered_item') inNumberedList = false;
    switch (block.type) {
      case 'h1': {
        const isBab = /^BAB\s+[IVX0-9]+$/i.test(block.text.trim());
        if (isBab && blocks[bi + 1] && blocks[bi + 1].type === 'h1') {
          // "BAB I" + judul → satu Heading 1 (dua baris, satu entri TOC)
          children.push(chapterHeader(block.text, blocks[bi + 1].text));
          bi++; // lewati baris judul yang sudah dipakai
        } else {
          // DAFTAR PUSTAKA / heading tunggal lain → Heading 1 satu baris
          children.push(frontMatterHeader(block.text));
        }
        break;
      }

      case 'h2':
        children.push(heading2(block.text));
        break;

      case 'h3':
        children.push(heading3(block.text));
        break;

      case 'p':
        children.push(justifiedPara(parseMarkdownRuns(block.text)));
        break;

      case 'numbered_item': {
        if (!inNumberedList) { listCounter++; inNumberedList = true; }
        const listRef = listCounter <= 200 ? `list-${listCounter}` : 'arabic-numbering';
        children.push(numberedItem(parseMarkdownRuns(block.text), listRef));
        break;
      }

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
        colWidths[numCols - 1] = CONTENT_W - colWidth * (numCols - 1);

        const tableRows = rows.map((row, rowIdx) => {
          const isHeader = rowIdx === 0;
          const isLast = rowIdx === rows.length - 1;
          const rowBorders = isHeader ? bordersHeader : (isLast ? bordersBottom : bordersMiddle);
          return new TableRow({
            children: row.map((cellText, colIdx) =>
              cellPara(cellText.replace(/\*\*/g, '').replace(/\*/g, ''), {
                width: colWidths[colIdx],
                bold: isHeader,
                center: isHeader || colIdx === 0,
                borders: rowBorders
              })
            )
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
          const ext = path.extname(imgPath).replace('.', '').toLowerCase();
          const imgData = fs.readFileSync(imgPath);
          // Read native dimensions from PNG IHDR chunk (bytes 16-23: width & height, big-endian uint32)
          let imgW = 540, imgH = 360; // fallback
          if (ext === 'png' && imgData.length > 24) {
            imgW = imgData.readUInt32BE(16);
            imgH = imgData.readUInt32BE(20);
          }
          // Scale to fit content width (CONTENT_W is in twips; 1 inch = 1440 twips, 96 dpi → 1 px ≈ 15 twips)
          const maxWidthPx = Math.round(CONTENT_W / 15);
          const scale = Math.min(1, maxWidthPx / imgW);
          const finalW = Math.round(imgW * scale);
          const finalH = Math.round(imgH * scale);
          children.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240, before: 80, line: 480 },
            children: [
              new ImageRun({
                data: imgData,
                type: ext,
                transformation: { width: finalW, height: finalH },
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
        if (block.text) children.push(justifiedPara(parseMarkdownRuns(block.text)));
    }
  }

  return children;
}


// ══════════════════════════════════════════════════════════════════════
// FRONT-MATTER SECTIONS (hardcoded)
// ══════════════════════════════════════════════════════════════════════

function buildFrontMatterSections(config) {
  const frontMatterFooter = createFrontMatterFooter();
  const half = Math.floor(CONTENT_W / 2);
  const halfR = CONTENT_W - half;
  const ins = config.institusi;
  const ps = config.persetujuan;
  const kp = config.kataPengantar;

  // Sel tabel borderless berisi satu paragraf (spacing after 0, line 480).
  // `margins` opsional — kalau diberikan, ikut ditambahkan (identik dengan kode lama).
  function plainCell(width, runs, margins) {
    const props = { borders: borders0, width: { size: width, type: WidthType.DXA } };
    if (margins) props.margins = margins;
    props.children = [new Paragraph({ spacing: { after: 0, line: 480 }, children: Array.isArray(runs) ? runs : [runs] })];
    return new TableCell(props);
  }
  const labelMargins = { top: 40, bottom: 40, left: 0, right: 0 };
  function konsultasiRow(label, value) {
    return new TableRow({ children: [
      plainCell(2800, tr(label), labelMargins),
      plainCell(200, tr(':'), labelMargins),
      plainCell(CONTENT_W - 3000, tr(value), labelMargins),
    ]});
  }

  // ── COVER ──
  const coverChildren = [emptyRow(), emptyRow()];
  config.judulBaris.forEach((t, i) => {
    coverChildren.push(centered(t, { bold: true, size: 24, spaceAfter: i === config.judulBaris.length - 1 ? 240 : 0 }));
  });
  coverChildren.push(
    centered(config.jenisDokumen, { bold: true, size: 24, spaceAfter: 240 }),
    centered('Oleh', { size: 24, spaceAfter: 240 }),
    centered(config.penulis.nama, { bold: true, size: 24, spaceAfter: 0 }),
    centered('NIM. ' + config.penulis.nim, { size: 24, spaceAfter: 960 }),
    emptyRow(), emptyRow(), emptyRow(),
    centered(ins.fakultas, { bold: true, size: 24, spaceAfter: 0 }),
    centered(ins.universitas, { bold: true, size: 24, spaceAfter: 0 }),
    centered(ins.kota, { bold: true, size: 24, spaceAfter: 0 }),
    centered(ins.tahun, { bold: true, size: 24, spaceAfter: 0 }),
  );

  // ── LEMBAR PERSETUJUAN ──
  const persetujuanChildren = [];
  ps.judulHalaman.forEach((t, i) => {
    persetujuanChildren.push(centered(t, { bold: true, size: 24, spaceAfter: i === ps.judulHalaman.length - 1 ? 480 : 0 }));
  });
  persetujuanChildren.push(
    emptyRow(),
    centered('LEMBAR KONSULTASI', { bold: true, size: 24, spaceAfter: 240 }),
    new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [2800, 200, CONTENT_W - 3000],
      borders: { top: border0, bottom: border0, left: border0, right: border0, insideH: border0, insideV: border0 },
      rows: [
        konsultasiRow('NAMA MAHASISWA', config.penulis.nama),
        konsultasiRow('JUDUL PENELITIAN', config.judulKalimat),
        konsultasiRow('TANGGAL SEMINAR', ps.tanggalSeminar),
      ]
    }),
    emptyRow(),
    new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [2000, 4866, 1800],
      rows: [
        new TableRow({ children: [cellPara('TANGGAL', { width: 2000, bold: true, center: true }), cellPara('KETERANGAN', { width: 4866, bold: true, center: true }), cellPara('PARAF', { width: 1800, bold: true, center: true })] }),
        new TableRow({ children: [cellPara('', { width: 2000 }), cellPara('', { width: 4866 }), cellPara('', { width: 1800 })] }),
        new TableRow({ children: [cellPara('', { width: 2000 }), cellPara('', { width: 4866 }), cellPara('', { width: 1800 })] }),
        new TableRow({ children: [cellPara('', { width: 2000 }), cellPara('', { width: 4866 }), cellPara('', { width: 1800 })] }),
      ]
    }),
    emptyRow(), emptyRow(),
    new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [half, halfR],
      borders: { top: border0, bottom: border0, left: border0, right: border0, insideH: border0, insideV: border0 },
      rows: [
        new TableRow({ children: [plainCell(half, tr(ps.penandatangan[0].kolomLabel)), plainCell(halfR, tr(ps.penandatangan[1].kolomLabel))] }),
        new TableRow({ children: [plainCell(half, tr(ps.penandatangan[0].peran)), plainCell(halfR, tr(ps.penandatangan[1].peran))] }),
        new TableRow({ children: [
          new TableCell({ borders: borders0, width: { size: half, type: WidthType.DXA }, children: [emptyRow(), emptyRow(), emptyRow()] }),
          new TableCell({ borders: borders0, width: { size: halfR, type: WidthType.DXA }, children: [emptyRow(), emptyRow(), emptyRow()] }),
        ]}),
        new TableRow({ children: [plainCell(half, trb(ps.penandatangan[0].nama)), plainCell(halfR, trb(ps.penandatangan[1].nama))] }),
        new TableRow({ children: [plainCell(half, tr('NIDN: ' + ps.penandatangan[0].nidn)), plainCell(halfR, tr('NIDN: ' + ps.penandatangan[1].nidn))] }),
      ]
    }),
  );

  // ── KATA PENGANTAR ──
  const kataPengantarChildren = [frontMatterHeader('KATA PENGANTAR')];
  kp.paragrafPembuka.forEach(p => kataPengantarChildren.push(justifiedPara([tr(p)])));
  kp.ucapanTerimaKasih.forEach(u => kataPengantarChildren.push(numberedItem([tr(u)])));
  kataPengantarChildren.push(emptyRow());
  kp.paragrafPenutup.forEach(p => kataPengantarChildren.push(justifiedPara([tr(p)])));
  kataPengantarChildren.push(
    emptyRow(),
    new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 0, before: 0, line: 480 }, children: [tr(kp.kota + ', ' + kp.tanggal)] }),
    new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 0, before: 0, line: 480 }, children: [tr(kp.penutupLabel)] }),
    emptyRow(), emptyRow(), emptyRow(),
    new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 0, before: 0, line: 480 }, children: [trb(config.penulis.nama)] }),
  );

  // ── DAFTAR ISI (auto via field TOC native Word; nomor halaman terisi saat dibuka/di-update) ──
  const kedalaman = (config.daftarIsi && config.daftarIsi.kedalaman) ? config.daftarIsi.kedalaman : 2;
  const daftarIsiChildren = [
    frontMatterHeader('DAFTAR ISI'),
    emptyRow(),
    new TableOfContents('Daftar Isi', { hyperlink: true, headingStyleRange: '1-' + kedalaman }),
  ];

  const pageMargin = { top: M_TOP, right: M_RIGHT, bottom: M_BOTTOM, left: M_LEFT };
  return [
    {
      properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: pageMargin } },
      children: coverChildren,
    },
    {
      properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: pageMargin, pageNumbers: { start: 2, formatType: NumberFormat.LOWER_ROMAN } } },
      footers: frontMatterFooter,
      children: persetujuanChildren,
    },
    {
      properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: pageMargin, pageNumbers: { formatType: NumberFormat.LOWER_ROMAN } } },
      footers: frontMatterFooter,
      children: kataPengantarChildren,
    },
    {
      properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: pageMargin, pageNumbers: { formatType: NumberFormat.LOWER_ROMAN } } },
      footers: frontMatterFooter,
      children: daftarIsiChildren,
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
  console.log('  BUILD REVISI — Audit Revisi Proposal');
  console.log('═'.repeat(60));
  console.log(`  Input:  ${inputDir}`);
  console.log(`  Output: ${outputDocx}`);
  console.log('═'.repeat(60));

  const babFiles = [
    { file: '05-revisi-bab1.md', label: 'BAB I' },
    { file: '05-revisi-bab2.md', label: 'BAB II' },
    { file: '05-revisi-bab3.md', label: 'BAB III' },
    { file: '05-revisi-daftar-pustaka.md', label: 'DAFTAR PUSTAKA' },
  ];

  const parsedBabs = [];
  for (const { file, label } of babFiles) {
    const content = fs.readFileSync(path.join(inputDir, file), 'utf-8');
    const blocks = parseMdFileToBlocks(content);
    console.log(`  ✅ Parsed ${label}: ${blocks.length} blocks`);
    parsedBabs.push({ label, blocks });
  }

  // Muat identitas dokumen (per-thesis): utamakan folder input, fallback ke folder builder.
  const configCandidates = [
    path.join(inputDir, 'config.thesis.json'),
    path.join(__dirname, 'config.thesis.json'),
  ];
  const configPath = configCandidates.find(p => fs.existsSync(p));
  if (!configPath) {
    console.error('❌ config.thesis.json tidak ditemukan. Dicari di:');
    configCandidates.forEach(p => console.error('   - ' + p));
    console.error('   Buat file config.thesis.json (identitas dokumen) lalu jalankan lagi.');
    process.exit(1);
  }
  const thesisConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  console.log(`  Config: ${configPath}`);

  const chapterPageSetup = createChapterHeadersAndFooters();
  const frontMatterSections = buildFrontMatterSections(thesisConfig);

  const chapterSections = parsedBabs.map((bab, idx) => {
    const children = buildDocxChildren(bab.blocks, inputDir);
    return {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: M_TOP, right: M_RIGHT, bottom: M_BOTTOM, left: M_LEFT },
          pageNumbers: idx === 0
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

  const doc = new Document({
    features: { updateFields: true },
    numbering: { config: numberingConfig },
    styles: stylesConfig,
    sections: [...frontMatterSections, ...chapterSections],
  });

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
