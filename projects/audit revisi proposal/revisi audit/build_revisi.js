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
  NumberFormat, ImageRun,
} = require('docx');


// ══════════════════════════════════════════════════════════════════════
// LAYOUT CONSTANTS
// ══════════════════════════════════════════════════════════════════════
// A4 margins: top 4cm, bottom 3cm, left 4cm, right 3cm
const PAGE_W = 11906;
const PAGE_H = 16838;
const M_TOP = 2268;
const M_BOTTOM = 1701;
const M_LEFT = 2268;
const M_RIGHT = 1701;
const CONTENT_W = PAGE_W - M_LEFT - M_RIGHT; // 7937


// ══════════════════════════════════════════════════════════════════════
// BORDERS
// ══════════════════════════════════════════════════════════════════════
const border0 = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const borders0 = { top: border0, bottom: border0, left: border0, right: border0 };
const borderSingle = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
const bordersAll = { top: borderSingle, bottom: borderSingle, left: borderSingle, right: borderSingle };


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
    children: [new TextRun({ text, bold: true, size: 24, font: 'Times New Roman' })]
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    alignment: AlignmentType.LEFT,
    spacing: { after: 160, before: 240, line: 480 },
    children: [new TextRun({ text, bold: true, size: 24, font: 'Times New Roman' })]
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function numberedItem(runs) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 0, before: 0, line: 480 },
    indent: { left: 720, hanging: 360 },
    numbering: { reference: 'arabic-numbering', level: 0 },
    children: Array.isArray(runs) ? runs : [tr(runs)]
  });
}

function cellPara(text, { width, bold = false, center = false, italic = false } = {}) {
  return new TableCell({
    borders: bordersAll,
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
    children: [new TextRun({ text, bold: true, font: 'Times New Roman', size: 24 })]
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

const numberingConfig = [
  {
    reference: 'arabic-numbering',
    levels: [{
      level: 0,
      format: LevelFormat.DECIMAL,
      text: '%1.',
      alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } }
    }]
  }
];

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
  ]
};


// ══════════════════════════════════════════════════════════════════════
// MARKDOWN PARSER
// ══════════════════════════════════════════════════════════════════════

function parseMarkdownRuns(text) {
  if (!text || text.trim() === '') return [tr('')];

  const runs = [];
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push(tr(text.substring(lastIndex, match.index)));
    }
    if (match[2]) {
      runs.push(tr(match[2], { bold: true, italics: true }));
    } else if (match[3]) {
      runs.push(trb(match[3]));
    } else if (match[4]) {
      runs.push(tri(match[4]));
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    runs.push(tr(text.substring(lastIndex)));
  }

  return runs.length > 0 ? runs : [tr(text)];
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

function buildDocxChildren(blocks, imageDir) {
  const children = [];

  for (const block of blocks) {
    switch (block.type) {
      case 'h1':
        children.push(centered(block.text, {
          bold: true, size: 24,
          spaceAfter: block.text === 'DAFTAR PUSTAKA' ? 240 : 0
        }));
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
        colWidths[numCols - 1] = CONTENT_W - colWidth * (numCols - 1);

        const tableRows = rows.map((row, rowIdx) =>
          new TableRow({
            children: row.map((cellText, colIdx) =>
              cellPara(cellText.replace(/\*\*/g, '').replace(/\*/g, ''), {
                width: colWidths[colIdx],
                bold: rowIdx === 0,
                center: rowIdx === 0 || colIdx === 0
              })
            )
          })
        );

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
          children.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240, before: 80, line: 480 },
            children: [
              new ImageRun({
                data: fs.readFileSync(imgPath),
                type: ext,
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
        if (block.text) children.push(justifiedPara(parseMarkdownRuns(block.text)));
    }
  }

  return children;
}


// ══════════════════════════════════════════════════════════════════════
// FRONT-MATTER SECTIONS (hardcoded)
// ══════════════════════════════════════════════════════════════════════

function buildFrontMatterSections() {
  const frontMatterFooter = createFrontMatterFooter();
  const half = Math.floor(CONTENT_W / 2);
  const halfR = CONTENT_W - half;

  return [
    // ── COVER ──
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

    // ── LEMBAR PERSETUJUAN ──
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
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [2800, 200, CONTENT_W - 3000],
          borders: { top: border0, bottom: border0, left: border0, right: border0, insideH: border0, insideV: border0 },
          rows: [
            new TableRow({ children: [
              new TableCell({ borders: borders0, width: { size: 2800, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 0, right: 0 }, children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('NAMA MAHASISWA')] })] }),
              new TableCell({ borders: borders0, width: { size: 200, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 0, right: 0 }, children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr(':')] })] }),
              new TableCell({ borders: borders0, width: { size: CONTENT_W - 3000, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 0, right: 0 }, children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('AJIE BARIANDONO')] })] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: borders0, width: { size: 2800, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 0, right: 0 }, children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('JUDUL PENELITIAN')] })] }),
              new TableCell({ borders: borders0, width: { size: 200, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 0, right: 0 }, children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr(':')] })] }),
              new TableCell({ borders: borders0, width: { size: CONTENT_W - 3000, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 0, right: 0 }, children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('Analisis Pelaksanaan Anggaran Belanja Pada Rumah Detensi Imigrasi Pontianak')] })] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: borders0, width: { size: 2800, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 0, right: 0 }, children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('TANGGAL SEMINAR')] })] }),
              new TableCell({ borders: borders0, width: { size: 200, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 0, right: 0 }, children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr(':')] })] }),
              new TableCell({ borders: borders0, width: { size: CONTENT_W - 3000, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 0, right: 0 }, children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('7 Juni 2026')] })] }),
            ]}),
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
            new TableRow({ children: [
              new TableCell({ borders: borders0, width: { size: half, type: WidthType.DXA }, children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('Mengetahui,')] })] }),
              new TableCell({ borders: borders0, width: { size: halfR, type: WidthType.DXA }, children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('Disetujui Oleh,')] })] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: borders0, width: { size: half, type: WidthType.DXA }, children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('Ketua Jurusan Akuntansi,')] })] }),
              new TableCell({ borders: borders0, width: { size: halfR, type: WidthType.DXA }, children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('Narasumber,')] })] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: borders0, width: { size: half, type: WidthType.DXA }, children: [emptyRow(), emptyRow(), emptyRow()] }),
              new TableCell({ borders: borders0, width: { size: halfR, type: WidthType.DXA }, children: [emptyRow(), emptyRow(), emptyRow()] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: borders0, width: { size: half, type: WidthType.DXA }, children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [trb('Risal, S.E., M.Si., Ak.CA')] })] }),
              new TableCell({ borders: borders0, width: { size: halfR, type: WidthType.DXA }, children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [trb('Endang Kristiawati, S.E., Ak., M.Si')] })] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: borders0, width: { size: half, type: WidthType.DXA }, children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('NIDN: 1104068701')] })] }),
              new TableCell({ borders: borders0, width: { size: halfR, type: WidthType.DXA }, children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('NIDN: 1123108201')] })] }),
            ]}),
          ]
        }),
      ]
    },

    // ── KATA PENGANTAR ──
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
        justifiedPara([tr('Puji syukur peneliti panjatkan kehadirat Allah Yang Maha Esa atas limpahan rahmat dan karunia-Nya sehingga peneliti dapat menyelesaikan karya tulis dalam bentuk makalah seminar akuntansi untuk memenuhi sebagian persyaratan untuk menyelesaikan Seminar Mata Kuliah di Fakultas Ekonomi dan Bisnis Universitas Panca Bhakti Pontianak.')]),
        justifiedPara([tr('Peneliti menyadari bahwa proses penulisan makalah seminar ini tidak akan dapat terlaksana tanpa dukungan, bantuan, dan bimbingan dari berbagai pihak. Oleh sebab itu, pada kesempatan yang baik ini, ucapan terima kasih dan penghargaan yang tinggi peneliti sampaikan kepada yang terhormat:')]),
        numberedItem([tr('Bapak Dr. Purwanto, SH, M.Hum., FCBArb selaku Rektor Universitas Panca Bhakti Pontianak.')]),
        numberedItem([tr('Bapak Dr. Sartono, M.M. selaku Dekan Fakultas Ekonomi dan Bisnis Universitas Panca Bhakti Pontianak.')]),
        numberedItem([tr('Bapak Risal S.E, M.Si, CA selaku ketua jurusan Akuntansi Universitas Panca Bhakti Pontianak.')]),
        numberedItem([tr('Ibu Wilda Sari S.E., M.Ak. selaku Dosen Pembimbing Akademik.')]),
        numberedItem([tr('Segenap dosen pengajar dan staf di Fakultas Ekonomi dan Bisnis Universitas Panca Bhakti.')]),
        numberedItem([tr('Kedua orang tua yang telah memberikan dukungan dan doa dalam penyusunan makalah seminar ini.')]),
        numberedItem([tr('Teman-teman yang telah membantu dalam penyusunan makalah seminar ini.')]),
        emptyRow(),
        justifiedPara([tr('Kiranya jasa mulia yang diberikan kepada peneliti selama ini akan mendapat balasan yang setimpal dari Allah Yang Maha Kuasa. Harapan peneliti semoga makalah seminar ini dapat bermanfaat bagi kita semua.')]),
        emptyRow(),
        new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 0, before: 0, line: 480 }, children: [tr('Pontianak, 4 Juni 2026')] }),
        new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 0, before: 0, line: 480 }, children: [tr('Peneliti,')] }),
        emptyRow(), emptyRow(), emptyRow(),
        new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 0, before: 0, line: 480 }, children: [trb('AJIE BARIANDONO')] }),
      ]
    },

    // ── DAFTAR ISI ──
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
        centered('DAFTAR ISI', { bold: true, size: 24, spaceAfter: 240 }),
        tocEntry('KATA PENGANTAR', 'iv', 0, true),
        tocEntry('DAFTAR ISI', 'v', 0, true),
        tocEntry('DAFTAR TABEL', 'vi', 0, true),
        tocEntry('DAFTAR GAMBAR', 'vii', 0, true),
        tocEntry('BAB I PENDAHULUAN', '1', 0, true),
        tocEntry('1.1  Latar Belakang', '1', 1, false),
        tocEntry('1.2  Rumusan Masalah', '9', 1, false),
        tocEntry('1.3  Tujuan Penelitian', '10', 1, false),
        tocEntry('1.4  Manfaat Penelitian', '10', 1, false),
        tocEntry('BAB II TINJAUAN PUSTAKA', '13', 0, true),
        tocEntry('2.1  Landasan Teori', '13', 1, false),
        tocEntry('2.2  Ringkasan Penelitian Terdahulu', '24', 1, false),
        tocEntry('2.3  Proposisi Penelitian', '27', 1, false),
        tocEntry('2.4  Kerangka Penelitian', '28', 1, false),
        tocEntry('BAB III METODE PENELITIAN', '29', 0, true),
        tocEntry('3.1  Bentuk dan Subjek Penelitian', '29', 1, false),
        tocEntry('3.2  Sumber dan Teknik Pengumpulan Data', '29', 1, false),
        tocEntry('3.3  Teknik Analisis Data', '30', 1, false),
        tocEntry('DAFTAR PUSTAKA', '32', 0, true),
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

  const chapterPageSetup = createChapterHeadersAndFooters();
  const frontMatterSections = buildFrontMatterSections();

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
