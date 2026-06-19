'use strict';
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  PageNumber, PageBreak, Header, Footer,
  PositionalTab, PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader,
  TabStopType, NumberFormat, ImageRun,
  TableOfContents, SequentialIdentifier
} = require('docx');
const fs = require('fs');
const path = require('path');

// ── LAYOUT CONSTANTS ──────────────────────────────────────────────────
const PAGE_W = 11906; // A4 Width in twips
const PAGE_H = 16838; // A4 Height in twips
const M_TOP = 2268;      // 4cm
const M_BOTTOM = 1701;   // 3cm
const M_LEFT = 2268;     // 4cm
const M_RIGHT = 1701;    // 3cm
const CONTENT_W = PAGE_W - M_LEFT - M_RIGHT;

// ── HELPERS ────────────────────────────────────────────────────────────
const border0 = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const borders0 = { top: border0, bottom: border0, left: border0, right: border0 };
const borderSingle = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
const bordersAll = { top: borderSingle, bottom: borderSingle, left: borderSingle, right: borderSingle };

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

// Chapter Heading: Two lines visually, single entry in TOC
function chapterHeader(num, title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 480, after: 240, line: 480 },
    keepNext: true,
    children: [
      new TextRun({ text: num, bold: true, size: 24, font: 'Times New Roman' }),
      new TextRun({ text: title, bold: true, size: 24, font: 'Times New Roman', break: 1 })
    ]
  });
}

// Front Matter Heading (Kata Pengantar, Daftar Isi, etc.)
function frontMatterHeader(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 480, after: 240, line: 480 },
    keepNext: true,
    children: [new TextRun({ text: title, bold: true, size: 24, font: 'Times New Roman' })]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.LEFT,
    spacing: { after: 160, before: 240, line: 480 },
    children: [new TextRun({ text, bold: true, size: 24, font: 'Times New Roman' })]
  });
}

function cellPara(text, { width, bold = false, center = false } = {}) {
  return new TableCell({
    borders: bordersAll,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { after: 0, before: 0, line: 360 },
      children: [new TextRun({ text, font: 'Times New Roman', size: 24, bold })]
    })]
  });
}

function figureCaption(text) {
  return new Paragraph({
    style: 'CaptionFigure',
    children: [
      new TextRun({ text: "Gambar ", bold: true, font: 'Times New Roman', size: 22 }),
      new SequentialIdentifier("Gambar"),
      new TextRun({ text: `.\t${text}`, bold: true, font: 'Times New Roman', size: 22 })
    ]
  });
}

function tableCaption(text) {
  return new Paragraph({
    style: 'CaptionTable',
    children: [
      new TextRun({ text: "Tabel ", bold: true, font: 'Times New Roman', size: 24 }),
      new SequentialIdentifier("Tabel"),
      new TextRun({ text: `.\t${text}`, bold: true, font: 'Times New Roman', size: 24 })
    ]
  });
}

const doc = new Document({
  features: {
    updateFields: true
  },
  styles: {
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
        id: 'TableofFigures', name: 'Table of Figures', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, font: 'Times New Roman' },
        paragraph: {
          spacing: { before: 60, after: 60, line: 360 },
          indent: { left: 1440, hanging: 1440 }
        }
      },
      {
        id: 'CaptionTable', name: 'Caption Table', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Times New Roman' },
        paragraph: {
          alignment: AlignmentType.LEFT,
          spacing: { before: 240, after: 80, line: 480 },
          indent: { left: 1440, hanging: 1440 },
          tabStops: [
            {
              type: TabStopType.LEFT,
              position: 1440
            }
          ]
        }
      },
      {
        id: 'CaptionFigure', name: 'Caption Figure', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 22, bold: true, font: 'Times New Roman' },
        paragraph: {
          alignment: AlignmentType.LEFT,
          spacing: { before: 80, after: 80, line: 480 },
          indent: { left: 1440, hanging: 1440 },
          tabStops: [
            {
              type: TabStopType.LEFT,
              position: 1440
            }
          ]
        }
      }
    ]
  },
  sections: [
    // ═══════════════════════════════════════════════════════════════
    // SECTION 1: COVER
    // ═══════════════════════════════════════════════════════════════
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: M_TOP, right: M_RIGHT, bottom: M_BOTTOM, left: M_LEFT }
        }
      },
      children: [
        emptyRow(), emptyRow(),
        centered('MAKALAH DUMMY', { bold: true, size: 28, spaceAfter: 120 }),
        centered('ANALISIS IMPLEMENTASI BLOCKCHAIN DALAM SISTEM KEAMANAN', { bold: true, size: 24 }),
        centered('TRANSAKSI PERBANKAN DIGITAL DI INDONESIA', { bold: true, size: 24, spaceAfter: 240 }),
        emptyRow(),
        centered('Disusun untuk Memenuhi Tugas Mata Kuliah', { size: 24, spaceAfter: 0 }),
        centered('Teknologi Finansial dan Keamanan Sistem', { bold: true, size: 24, spaceAfter: 240 }),
        emptyRow(),
        centered('Oleh:', { size: 24, spaceAfter: 120 }),
        centered('AJIE BARIANDONO', { bold: true, size: 24, spaceAfter: 0 }),
        centered('NIM. 2110426823', { size: 24, spaceAfter: 480 }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240, before: 240, line: 360 },
          children: [
            new ImageRun({
              data: fs.readFileSync(path.join(__dirname, 'logo_upb.jpg')),
              type: 'jpg',
              transformation: { width: 140, height: 133 },
            }),
          ]
        }),
        centered('PROGRAM STUDI AKUNTANSI', { bold: true, size: 24, spaceAfter: 0 }),
        centered('FAKULTAS EKONOMI DAN BISNIS', { bold: true, size: 24, spaceAfter: 0 }),
        centered('UNIVERSITAS PANCA BHAKTI', { bold: true, size: 24, spaceAfter: 0 }),
        centered('PONTIANAK', { bold: true, size: 24, spaceAfter: 0 }),
        centered('2026', { bold: true, size: 24, spaceAfter: 0 }),
      ]
    },
    // ═══════════════════════════════════════════════════════════════
    // SECTION 2: KATA PENGANTAR, DAFTAR ISI, DAFTAR TABEL, DAFTAR GAMBAR
    // ═══════════════════════════════════════════════════════════════
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: M_TOP, right: M_RIGHT, bottom: M_BOTTOM, left: M_LEFT },
          pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN }
        }
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 0, before: 0, line: 480 },
              children: [
                new TextRun({ children: [PageNumber.CURRENT], font: 'Times New Roman', size: 24 })
              ]
            })
          ]
        })
      },
      children: [
        frontMatterHeader('KATA PENGANTAR'),
        justifiedPara([
          new TextRun({
            text: 'Puji syukur penulis panjatkan kehadirat Tuhan Yang Maha Esa atas rahmat-Nya sehingga penulis dapat menyelesaikan makalah dummy yang berjudul '
          }),
          new TextRun({
            text: '"Analisis Implementasi Blockchain dalam Sistem Keamanan Transaksi Perbankan Digital di Indonesia"',
            bold: true
          }),
          new TextRun({
            text: '. Makalah ini dibuat sebagai contoh implementasi struktur dokumen dinamis menggunakan Word Fields.'
          })
        ]),
        emptyRow(),
        justifiedPara('Pontianak, Juni 2026', { indent: false }),
        emptyRow(),
        justifiedPara('Penulis', { indent: false }),

        new Paragraph({ children: [new PageBreak()] }),

        frontMatterHeader('DAFTAR ISI'),
        new TableOfContents("", { hyperlink: true, headingStyleRange: "1-3" }),

        new Paragraph({ children: [new PageBreak()] }),

        frontMatterHeader('DAFTAR TABEL'),
        new TableOfContents("", { hyperlink: true, captionLabelIncludingNumbers: "Tabel" }),

        new Paragraph({ children: [new PageBreak()] }),

        frontMatterHeader('DAFTAR GAMBAR'),
        new TableOfContents("", { hyperlink: true, captionLabelIncludingNumbers: "Gambar" }),
      ]
    },
    // ═══════════════════════════════════════════════════════════════
    // SECTION 3: ISI DOKUMEN (BAB I & II DUMMY UNTUK TESTING FIELD)
    // ═══════════════════════════════════════════════════════════════
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: M_TOP, right: M_RIGHT, bottom: M_BOTTOM, left: M_LEFT },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL }
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { after: 0, before: 0, line: 480 },
              children: [
                new TextRun({ children: [PageNumber.CURRENT], font: 'Times New Roman', size: 24 })
              ]
            })
          ]
        }),
        first: new Header({ children: [] })
      },
      footers: {
        first: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 0, before: 0, line: 480 },
              children: [
                new TextRun({ children: [PageNumber.CURRENT], font: 'Times New Roman', size: 24 })
              ]
            })
          ]
        })
      },
      children: [
        chapterHeader('BAB I', 'PENDAHULUAN'),
        heading2('1.1. Latar Belakang'),
        justifiedPara([
          new TextRun({
            text: 'Perkembangan perbankan digital di era teknologi finansial menuntut tingkat keamanan transaksi yang sangat tinggi. Sistem perbankan tradisional rentan terhadap serangan terpusat (single point of failure). Blockchain menawarkan solusi desentralisasi yang mampu meningkatkan integritas data dan keamanan transaksi perbankan digital.'
          })
        ]),
        heading2('1.2. Rumusan Masalah'),
        justifiedPara([
          new TextRun({
            text: 'Bagaimanakah efektivitas implementasi teknologi blockchain dalam mengatasi isu keamanan siber pada transaksi perbankan digital di Indonesia?'
          })
        ]),

        new Paragraph({ children: [new PageBreak()] }),

        chapterHeader('BAB II', 'LANDASAN TEORI'),
        heading2('2.1. Konsep Dasar Blockchain'),
        justifiedPara([
          new TextRun({
            text: 'Blockchain adalah buku besar terdistribusi yang mencatat transaksi di jaringan komputer secara transparan dan tidak dapat diubah (immutable). Setiap blok dalam rantai berisi hash kriptografi dari blok sebelumnya.'
          })
        ]),

        emptyRow(),

        // Dummy Table
        tableCaption('Kelebihan Blockchain vs Sistem Terpusat'),
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          rows: [
            new TableRow({
              children: [
                cellPara('Parameter', { width: 2500, bold: true, center: true }),
                cellPara('Sistem Perbankan Terpusat', { width: 2700, bold: true, center: true }),
                cellPara('Sistem Blockchain', { width: 2700, bold: true, center: true }),
              ]
            }),
            new TableRow({
              children: [
                cellPara('Kerawanan Titik Kegagalan', { width: 2500 }),
                cellPara('Tinggi (Server tunggal/kluster pusat)', { width: 2700 }),
                cellPara('Sangat Rendah (Terdistribusi di semua node)', { width: 2700 }),
              ]
            }),
            new TableRow({
              children: [
                cellPara('Integritas Data', { width: 2500 }),
                cellPara('Tergantung administrator database', { width: 2700 }),
                cellPara('Mutlak (Konsensus enkripsi kriptografi)', { width: 2700 }),
              ]
            })
          ]
        }),

        emptyRow(),

        // Dummy Figure
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80, before: 80, line: 480 },
          children: [
            new ImageRun({
              data: fs.readFileSync(path.join(__dirname, 'logo_upb.jpg')),
              type: 'jpg',
              transformation: { width: 150, height: 143 },
            }),
          ]
        }),
        figureCaption('Arsitektur Sederhana Node dalam Jaringan Blockchain Perbankan'),

        emptyRow(),
        justifiedPara([
          new TextRun({
            text: 'Gambar di atas menjelaskan bagaimana setiap node saling berinteraksi secara peer-to-peer tanpa adanya otoritas tunggal di tengah-tengah transaksi.'
          })
        ])
      ]
    }
  ]
});

Packer.toBuffer(doc).then((buffer) => {
  const outputPath = path.join(__dirname, 'MAKALAH_DUMMY_BLOCKCHAIN.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Document berhasil dibangun: ${outputPath}`);
}).catch((error) => {
  console.error("Error building document:", error);
});
