'use strict';
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, Header, Footer,
  PositionalTab, PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader,
  TabStopType, TabStopPosition, NumberFormat, TableOfContents, ImageRun
} = require('docx');
const fs = require('fs');

// ── LAYOUT CONSTANTS ──────────────────────────────────────────────────
// A4: 11906 x 16838 DXA
// Margins: top/bottom 1440 (1"), left 1800 (1.25"), right 1440 (1")
// Margins: top 4cm (2268 dxa), bottom 3cm (1701 dxa), left 4cm (2268 dxa), right 3cm (1701 dxa)
const PAGE_W = 11906;
const PAGE_H = 16838;
const M_TOP = 2268;
const M_BOTTOM = 1701;
const M_LEFT = 2268;
const M_RIGHT = 1701;
const CONTENT_W = PAGE_W - M_LEFT - M_RIGHT; // 7937


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

function tr(text, opts = {}) {
  return new TextRun({ text, font: 'Times New Roman', size: 24, ...opts });
}
function tri(text) { return tr(text, { italics: true }); }
function trb(text) { return tr(text, { bold: true }); }

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { after: 160, before: 480, line: 480 },
    children: [new TextRun({ text, bold: true, size: 24, font: 'Times New Roman', allCaps: true })]
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

function numberedItem(runs, num) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 0, before: 0, line: 480 },
    indent: { left: 720, hanging: 360 },
    numbering: { reference: 'arabic-numbering', level: 0 },
    children: Array.isArray(runs) ? runs : [tr(runs)]
  });
}

function numberedItemRuns(runs) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 0, before: 0, line: 480 },
    numbering: { reference: 'arabic-numbering', level: 0 },
    children: runs
  });
}

function cell(children, { width, shading, bold = false, center = false } = {}) {
  const parasChildren = Array.isArray(children) ? children : [
    new Paragraph({
      alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { after: 0, before: 0, line: 360 },
      children: [new TextRun({ text: children, font: 'Times New Roman', size: 22, bold })]
    })
  ];
  return new TableCell({
    borders: bordersAll,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    ...(shading ? { shading: { fill: shading, type: ShadingType.CLEAR } } : {}),
    children: parasChildren
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

function createFrontMatterFooter() {
  return {
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
            children: [
              new TextRun({ children: [PageNumber.CURRENT], font: 'Times New Roman', size: 24 })
            ]
          })
        ]
      }),
      first: new Header({
        children: []
      })
    },
    footers: {
      default: new Footer({
        children: []
      }),
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
    }
  };
}

// ── TOC ENTRY HELPER ────────────────────────────────────────────────────
function tocEntry(label, pageNum, level = 0, bold = false) {
  const indent = level === 0 ? 0 : 360;
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 0, before: level === 0 ? 120 : 0, line: 360 },
    indent: { left: indent },
    children: [
      new TextRun({ text: label, bold: bold, font: 'Times New Roman', size: 24 }),
      new TextRun({
        children: [
          new PositionalTab({
            alignment: PositionalTabAlignment.RIGHT,
            relativeTo: PositionalTabRelativeTo.MARGIN,
            leader: PositionalTabLeader.DOT,
          }),
          pageNum,
        ],
        bold: bold,
        font: 'Times New Roman', size: 24,
      }),
    ],
  });
}

// ══════════════════════════════════════════════════════════════════════
// DOCUMENT BUILD
// ══════════════════════════════════════════════════════════════════════

const chapterPageSetup = createChapterHeadersAndFooters();
const frontMatterFooter = createFrontMatterFooter();

const doc = new Document({
  numbering: {
    config: [
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
    ]
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
        id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Times New Roman' },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 2 }
      },
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
    // ═══════════════════════════════════════════════════════════════
    // SECTION 2: LEMBAR PERSETUJUAN + KONSULTASI
    // ═══════════════════════════════════════════════════════════════
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
        // Identitas table
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [2800, 200, CONTENT_W - 3000],
          borders: { top: border0, bottom: border0, left: border0, right: border0, insideH: border0, insideV: border0 },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: borders0, width: { size: 2800, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 0, right: 0 },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('NAMA MAHASISWA')] })]
                }),
                new TableCell({
                  borders: borders0, width: { size: 200, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 0, right: 0 },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr(':')] })]
                }),
                new TableCell({
                  borders: borders0, width: { size: CONTENT_W - 3000, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 0, right: 0 },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('AJIE BARIANDONO')] })]
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  borders: borders0, width: { size: 2800, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 0, right: 0 },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('JUDUL PENELITIAN')] })]
                }),
                new TableCell({
                  borders: borders0, width: { size: 200, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 0, right: 0 },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr(':')] })]
                }),
                new TableCell({
                  borders: borders0, width: { size: CONTENT_W - 3000, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 0, right: 0 },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('Analisis Pelaksanaan Anggaran Belanja Pada Rumah Detensi Imigrasi Pontianak')] })]
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  borders: borders0, width: { size: 2800, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 0, right: 0 },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('TANGGAL SEMINAR')] })]
                }),
                new TableCell({
                  borders: borders0, width: { size: 200, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 0, right: 0 },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr(':')] })]
                }),
                new TableCell({
                  borders: borders0, width: { size: CONTENT_W - 3000, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 0, right: 0 },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('7 Juni 2026')] })]
                }),
              ]
            }),
          ]
        }),
        emptyRow(),
        // Tabel konsultasi (tanggal, keterangan, paraf)
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [2000, 4866, 1800],
          rows: [
            new TableRow({
              children: [
                cellPara('TANGGAL', { width: 2000, bold: true, center: true }),
                cellPara('KETERANGAN', { width: 4866, bold: true, center: true }),
                cellPara('PARAF', { width: 1800, bold: true, center: true }),
              ]
            }),
            new TableRow({
              children: [
                cellPara('', { width: 2000 }),
                cellPara('', { width: 4866 }),
                cellPara('', { width: 1800 }),
              ]
            }),
            new TableRow({
              children: [
                cellPara('', { width: 2000 }),
                cellPara('', { width: 4866 }),
                cellPara('', { width: 1800 }),
              ]
            }),
          ]
        }),
        emptyRow(),
        emptyRow(),
        // Tanda tangan
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [Math.floor(CONTENT_W / 2), Math.ceil(CONTENT_W / 2)],
          borders: { top: border0, bottom: border0, left: border0, right: border0, insideH: border0, insideV: border0 },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: borders0, width: { size: Math.floor(CONTENT_W / 2), type: WidthType.DXA },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('Mengetahui,')] })]
                }),
                new TableCell({
                  borders: borders0, width: { size: Math.ceil(CONTENT_W / 2), type: WidthType.DXA },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('Disetujui Oleh,')] })]
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  borders: borders0, width: { size: Math.floor(CONTENT_W / 2), type: WidthType.DXA },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('Ketua Jurusan Akuntansi,')] })]
                }),
                new TableCell({
                  borders: borders0, width: { size: Math.ceil(CONTENT_W / 2), type: WidthType.DXA },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('Narasumber,')] })]
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  borders: borders0, width: { size: Math.floor(CONTENT_W / 2), type: WidthType.DXA },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('')] })]
                }),
                new TableCell({
                  borders: borders0, width: { size: Math.ceil(CONTENT_W / 2), type: WidthType.DXA },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('')] })]
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  borders: borders0, width: { size: Math.floor(CONTENT_W / 2), type: WidthType.DXA },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('')] })]
                }),
                new TableCell({
                  borders: borders0, width: { size: Math.ceil(CONTENT_W / 2), type: WidthType.DXA },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('')] })]
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  borders: borders0, width: { size: Math.floor(CONTENT_W / 2), type: WidthType.DXA },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [trb('Risal, S.E., M.Si., Ak.CA')] })]
                }),
                new TableCell({
                  borders: borders0, width: { size: Math.ceil(CONTENT_W / 2), type: WidthType.DXA },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [trb('Endang Kristiawati, S.E., Ak., M.Si')] })]
                }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  borders: borders0, width: { size: Math.floor(CONTENT_W / 2), type: WidthType.DXA },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('NIDN: 1104068701')] })]
                }),
                new TableCell({
                  borders: borders0, width: { size: Math.ceil(CONTENT_W / 2), type: WidthType.DXA },
                  children: [new Paragraph({ spacing: { after: 0, line: 480 }, children: [tr('NIDN: 1123108201')] })]
                }),
              ]
            }),
          ]
        }),
      ]
    },
    // ═══════════════════════════════════════════════════════════════
    // SECTION 3: KATA PENGANTAR
    // ═══════════════════════════════════════════════════════════════
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
        numberedItemRuns([tr('Bapak Dr. Purwanto, SH, M.Hum., FCBArb selaku Rektor Universitas Panca Bhakti Pontianak.')]),
        numberedItemRuns([tr('Bapak Dr. Sartono, M.M. selaku Dekan Fakultas Ekonomi dan Bisnis Universitas Panca Bhakti Pontianak.')]),
        numberedItemRuns([tr('Bapak Risal S.E, M.Si, CA selaku ketua jurusan Akuntansi Universitas Panca Bhakti Pontianak.')]),
        numberedItemRuns([tr('Ibu Wilda Sari S.E., M.Ak. selaku Dosen Pembimbing Akademik.')]),
        numberedItemRuns([tr('Segenap dosen pengajar dan staf di Fakultas Ekonomi dan Bisnis Universitas Panca Bhakti.')]),
        numberedItemRuns([tr('Kedua orang tua yang telah memberikan dukungan dan doa dalam penyusunan makalah seminar ini.')]),
        numberedItemRuns([tr('Teman-teman yang telah membantu dalam penyusunan makalah seminar ini.')]),
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
    // ═══════════════════════════════════════════════════════════════
    // SECTION 4: DAFTAR ISI
    // ═══════════════════════════════════════════════════════════════
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
        tocEntry('3.2  Teknik Pengumpulan Data', '31', 1, false),
        tocEntry('3.3  Teknik Pengolahan dan Analisis Data', '35', 1, false),
        tocEntry('DAFTAR PUSTAKA', '39', 0, true),
        pageBreak(),
        centered('DAFTAR TABEL', { bold: true, size: 24, spaceAfter: 240 }),
        new Paragraph({ spacing: { after: 80, line: 360 }, children: [tr('Tabel 1.1  Indikator dan Bobot Penilaian IKPA Berdasarkan PER-5/PB/2024')] }),
        new Paragraph({ spacing: { after: 80, line: 360 }, children: [tr('Tabel 1.2  Kategorisasi Nilai IKPA')] }),
        new Paragraph({ spacing: { after: 80, line: 360 }, children: [tr('Tabel 1.3  Deviasi Halaman III DIPA Belanja Modal Rudenim Pontianak TA 2023\u20132025')] }),
        new Paragraph({ spacing: { after: 80, line: 360 }, children: [tr('Tabel 1.4  Bulan Kritis Deviasi Belanja Modal Rudenim Pontianak TA 2023\u20132025')] }),
        new Paragraph({ spacing: { after: 80, line: 360 }, children: [tr('Tabel 1.5  Contoh Paket Belanja Modal yang Mengalami Pergeseran Realisasi TA 2023\u20132025')] }),
        new Paragraph({ spacing: { after: 80, line: 360 }, children: [tr('Tabel 2.1  Ringkasan Penelitian Terdahulu dan Relevansinya dengan Pelaksanaan Anggaran Belanja Modal')] }),
        new Paragraph({ spacing: { after: 80, line: 360 }, children: [tr('Tabel 3.1  Daftar Informan Target Penelitian')] }),
        new Paragraph({ spacing: { after: 80, line: 360 }, children: [tr('Tabel 3.2  Daftar Dokumen Studi Dokumentasi')] }),
        pageBreak(),
        centered('DAFTAR GAMBAR', { bold: true, size: 24, spaceAfter: 240 }),
        new Paragraph({
          spacing: { after: 80, line: 360 }, children: [
            tr('Gambar 2.1  Kerangka Penelitian '),
            new TextRun({ children: [new PositionalTab({ alignment: PositionalTabAlignment.RIGHT, relativeTo: PositionalTabRelativeTo.MARGIN, leader: PositionalTabLeader.DOT }), '28'], font: 'Times New Roman', size: 24 })
          ]
        }),
        new Paragraph({
          spacing: { after: 80, line: 360 }, children: [
            tr('Gambar 3.1  Alur Pelaksanaan Anggaran Belanja '),
            new TextRun({ children: [new PositionalTab({ alignment: PositionalTabAlignment.RIGHT, relativeTo: PositionalTabRelativeTo.MARGIN, leader: PositionalTabLeader.DOT }), '38'], font: 'Times New Roman', size: 24 })
          ]
        }),
      ]
    },
    // ═══════════════════════════════════════════════════════════════
    // SECTION 5: BAB I
    // ═══════════════════════════════════════════════════════════════
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: M_TOP, right: M_RIGHT, bottom: M_BOTTOM, left: M_LEFT },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL }
        },
        titlePage: true
      },
      headers: chapterPageSetup.headers,
      footers: chapterPageSetup.footers,
      children: [
        centered('BAB I', { bold: true, size: 24, spaceAfter: 0 }),
        centered('PENDAHULUAN', { bold: true, size: 24, spaceAfter: 240 }),
        heading2('1.1  Latar Belakang'),
        justifiedPara([tr('Pengelolaan keuangan negara merupakan instrumen krusial dalam mewujudkan tujuan bernegara. Undang-Undang Nomor 17 Tahun 2003 tentang Keuangan Negara menegaskan bahwa keuangan negara harus dikelola secara tertib, taat pada peraturan perundang-undangan, efisien, ekonomis, efektif, transparan, dan bertanggung jawab dengan memperhatikan rasa keadilan dan kepatutan. Kelima prinsip tersebut, yaitu efisiensi, efektivitas, transparansi, keadilan, dan kepatutan, tidak bersifat opsional, melainkan merupakan standar minimum yang harus dipenuhi oleh setiap entitas pemerintah dalam mengelola sumber daya publik yang dipercayakan kepadanya (Undang-Undang Nomor 17 Tahun 2003).')]),
        justifiedPara([tr('Instrumen utama dalam pengelolaan keuangan negara adalah Anggaran Pendapatan dan Belanja Negara (APBN). Sebagaimana diuraikan oleh Mardiasmo (2018), APBN berfungsi tidak hanya sebagai rencana keuangan tahunan pemerintah, tetapi juga sebagai instrumen fiskal multifungsi yang mencakup fungsi perencanaan, pengendalian, koordinasi, distribusi, dan stabilisasi ekonomi nasional. Dalam posisinya sebagai instrumen fiskal, APBN mencerminkan prioritas dan komitmen pemerintah terhadap program-program pembangunan yang telah ditetapkan. Oleh karena itu, kualitas pelaksanaan APBN, mulai dari perencanaan, pencairan, hingga pertanggungjawaban, memiliki konsekuensi langsung terhadap capaian tujuan pembangunan nasional.')]),
        justifiedPara([tr('Secara operasional, APBN dilaksanakan oleh K/L melalui mekanisme Daftar Isian Pelaksanaan Anggaran (DIPA). Tata cara pelaksanaan anggaran K/L diatur dalam Peraturan Pemerintah Nomor 45 Tahun 2013 jo. Peraturan Pemerintah Nomor 50 Tahun 2018, yang mengatur siklus mulai dari pencairan dana, penatausahaan, hingga pelaporan realisasi. Tata cara pelaksanaan anggaran ini diperjelas dan disempurnakan melalui Peraturan Menteri Keuangan Nomor 62 Tahun 2023 tentang Perencanaan Anggaran, Pelaksanaan Anggaran, serta Akuntansi dan Pelaporan Keuangan pada Kementerian Negara/Lembaga, yang mengatur tiga jenis belanja utama yakni Belanja Pegawai, Belanja Barang, dan Belanja Modal, dengan mekanisme khusus pada Belanja Modal yang mengacu pada Peraturan Presiden Nomor 16 Tahun 2018 sebagaimana telah diubah dengan Peraturan Presiden Nomor 12 Tahun 2021 tentang Pengadaan Barang/Jasa Pemerintah. Setiap satker yang menerima DIPA berkewajiban untuk menyusun Rencana Penarikan Dana (RPD) bulanan, yang tertuang dalam Halaman III DIPA, sebagai peta jalan pencairan anggaran sepanjang tahun. RPD bulanan ini bukan sekadar formalitas administratif; ia merupakan instrumen perencanaan kas yang memungkinkan pemerintah mengalokasikan likuiditas secara tepat waktu dan tepat jumlah kepada seluruh satker di seluruh Indonesia.')]),
        justifiedPara([tr('Rumah Detensi Imigrasi (Rudenim) Pontianak, sebagai Unit Pelaksana Teknis (UPT) di bawah Direktorat Jenderal Imigrasi, merupakan salah satu satker pengelola DIPA yang wajib menerapkan kelima prinsip pengelolaan keuangan negara tersebut. Berdasarkan Undang-Undang Nomor 6 Tahun 2011 tentang Keimigrasian dan Peraturan Menteri Hukum dan Hak Asasi Manusia Nomor M.HH-11.OT.01.01 Tahun 2009 tentang Organisasi dan Tata Kerja Rumah Detensi Imigrasi, Rudenim bertugas menampung sementara orang asing yang dikenai Tindakan Administratif Keimigrasian (TAK), seperti deportasi dan pengawasan keimigrasian. Rudenim Pontianak berkedudukan di Kalimantan Barat, provinsi yang berbatasan langsung dengan Malaysia, sehingga memiliki karakteristik dinamika kependudukan asing yang memengaruhi volume dan pola pengeluaran anggarannya secara signifikan. Secara kelembagaan, pada TA 2023 dan 2024 satker ini berada di bawah Kementerian Hukum dan Hak Asasi Manusia (kode satker 664650), kemudian beralih ke Kementerian Imigrasi dan Pemasyarakatan (kode satker 692965) pada TA 2025 seiring pembentukan kementerian baru berdasarkan Peraturan Presiden Nomor 139 Tahun 2024.')]),
        justifiedPara([tr('Untuk memastikan bahwa pelaksanaan APBN oleh seluruh K/L memenuhi standar kualitas yang ditetapkan, pemerintah mengembangkan Indikator Kinerja Pelaksanaan Anggaran (IKPA) sebagai instrumen evaluasi komprehensif. Berdasarkan Peraturan Menteri Keuangan Nomor 62 Tahun 2023 dan Peraturan Direktur Jenderal Perbendaharaan Nomor PER-5/PB/2024 sebagai petunjuk teknis terbaru, IKPA mengukur kinerja pelaksanaan anggaran K/L melalui tiga aspek utama, yaitu Kualitas Perencanaan, Kualitas Pelaksanaan, dan Kualitas Hasil, yang dijabarkan ke dalam tujuh indikator dengan bobot masing-masing sebagaimana disajikan pada Tabel 1.1.')]),

        // Tabel 1.1
        tableCaptionCentered('Tabel 1.1 Indikator dan Bobot Penilaian IKPA Berdasarkan PER-5/PB/2024'),
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [600, 2800, 4266, 1000],
          rows: [
            new TableRow({
              children: [
                cellPara('No.', { width: 600, bold: true, center: true }),
                cellPara('Aspek', { width: 2800, bold: true, center: true }),
                cellPara('Indikator', { width: 4266, bold: true, center: true }),
                cellPara('Bobot', { width: 1000, bold: true, center: true }),
              ]
            }),
            new TableRow({ children: [cellPara('1', { width: 600, center: true }), cellPara('Kualitas Perencanaan', { width: 2800 }), cellPara('Revisi DIPA', { width: 4266 }), cellPara('5%', { width: 1000, center: true })] }),
            new TableRow({ children: [cellPara('2', { width: 600, center: true }), cellPara('Kualitas Perencanaan', { width: 2800 }), cellPara('Deviasi Halaman III DIPA', { width: 4266 }), cellPara('15%', { width: 1000, center: true })] }),
            new TableRow({ children: [cellPara('3', { width: 600, center: true }), cellPara('Kualitas Pelaksanaan', { width: 2800 }), cellPara('Penyerapan Anggaran', { width: 4266 }), cellPara('30%', { width: 1000, center: true })] }),
            new TableRow({ children: [cellPara('4', { width: 600, center: true }), cellPara('Kualitas Pelaksanaan', { width: 2800 }), cellPara('Belanja Kontraktual', { width: 4266 }), cellPara('15%', { width: 1000, center: true })] }),
            new TableRow({ children: [cellPara('5', { width: 600, center: true }), cellPara('Kualitas Pelaksanaan', { width: 2800 }), cellPara('Penyelesaian Tagihan', { width: 4266 }), cellPara('15%', { width: 1000, center: true })] }),
            new TableRow({ children: [cellPara('6', { width: 600, center: true }), cellPara('Kualitas Pelaksanaan', { width: 2800 }), cellPara('Pengelolaan Uang Persediaan', { width: 4266 }), cellPara('5%', { width: 1000, center: true })] }),
            new TableRow({ children: [cellPara('7', { width: 600, center: true }), cellPara('Kualitas Hasil', { width: 2800 }), cellPara('Capaian Output', { width: 4266 }), cellPara('15%', { width: 1000, center: true })] }),
            new TableRow({ children: [cellPara('', { width: 600 }), cellPara('', { width: 2800 }), cellPara('Total', { width: 4266, bold: true, center: true }), cellPara('100%', { width: 1000, bold: true, center: true })] }),
          ]
        }),
        tableSource('Sumber: Peraturan Direktur Jenderal Perbendaharaan Nomor PER-5/PB/2024'),

        justifiedPara([tr('Kategorisasi nilai IKPA yang menjadi rujukan bagi KPPN dan Kanwil DJPb dalam pembinaan satker (PER-5/PB/2024) adalah sebagai berikut:')]),

        // Tabel 1.2
        tableCaptionCentered('Tabel 1.2 Kategorisasi Nilai IKPA'),
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [Math.floor(CONTENT_W / 2), Math.ceil(CONTENT_W / 2)],
          rows: [
            new TableRow({ children: [cellPara('Kategori', { width: Math.floor(CONTENT_W / 2), bold: true, center: true }), cellPara('Nilai IKPA', { width: Math.ceil(CONTENT_W / 2), bold: true, center: true })] }),
            new TableRow({ children: [cellPara('Sangat Baik', { width: Math.floor(CONTENT_W / 2) }), cellPara('\u2265 95', { width: Math.ceil(CONTENT_W / 2), center: true })] }),
            new TableRow({ children: [cellPara('Baik', { width: Math.floor(CONTENT_W / 2) }), cellPara('89 \u2013 94', { width: Math.ceil(CONTENT_W / 2), center: true })] }),
            new TableRow({ children: [cellPara('Cukup', { width: Math.floor(CONTENT_W / 2) }), cellPara('70 \u2013 88', { width: Math.ceil(CONTENT_W / 2), center: true })] }),
            new TableRow({ children: [cellPara('Kurang', { width: Math.floor(CONTENT_W / 2) }), cellPara('< 70', { width: Math.ceil(CONTENT_W / 2), center: true })] }),
          ]
        }),
        tableSource('Sumber: PER-5/PB/2024'),

        justifiedPara([tr('Lebih dari sekadar instrumen penilaian, IKPA berfungsi sebagai mekanisme akuntabilitas yang mendorong satker untuk meningkatkan kualitas perencanaan dan pelaksanaan anggaran secara berkelanjutan, selaras dengan prinsip-prinsip pengelolaan keuangan negara yang diamanatkan oleh Undang-Undang Nomor 17 Tahun 2003.')]),
        justifiedPara([tr('Di antara tujuh indikator IKPA, Deviasi Halaman III DIPA mengukur selisih antara Rencana Penarikan Dana (RPD) bulanan yang telah disusun dalam Halaman III DIPA dengan realisasi anggaran aktual pada bulan bersangkutan. Deviasi ini berdampak tidak hanya pada tingkat satker, tetapi juga pada manajemen kas Bendahara Umum Negara (BUN) secara makro, karena ketidakakuratan RPD dapat menciptakan penumpukan dana tidak terpakai atau kekurangan dana mendadak yang mengganggu kontinuitas pelaksanaan program pemerintah. Salah satu pola yang persisten bermasalah di berbagai satker K/L adalah deviasi antara rencana dan realisasi penarikan dana, dan permasalahan ini terutama mengemuka pada Belanja Modal karena karakteristiknya yang kontraktual dan melibatkan multi-pihak dalam proses pengadaan barang/jasa pemerintah.')]),
        justifiedPara([tr('Fakta empiris di lapangan mengonfirmasi bahwa deviasi Halaman III DIPA merupakan persoalan yang belum berhasil ditangani secara tuntas oleh mayoritas satker. Data yang diterbitkan oleh Direktorat Jenderal Perbendaharaan (2025) menunjukkan bahwa indikator deviasi Halaman III DIPA secara konsisten menjadi capaian terendah di antara indikator-indikator IKPA pada berbagai satker kementerian/lembaga. Pola ini berlangsung berulang dari tahun ke tahun, mengindikasikan bahwa akar permasalahannya bersifat struktural dan tidak dapat diselesaikan hanya melalui penyesuaian teknis semata.')]),
        justifiedPara([tr('Temuan serupa juga diperoleh di wilayah lain di Indonesia. Sholawatunnisa dan Supriyanto (2025) dalam kajian mereka terhadap satker-satker di Kanwil DJPb Nusa Tenggara Barat menemukan pola yang identik: indikator Deviasi Halaman III DIPA secara konsisten menempati posisi terbawah dibandingkan indikator IKPA lainnya. Konsistensi pola ini di berbagai wilayah yang berbeda mengindikasikan bahwa problematika deviasi RPD merupakan fenomena sistemik lintas K/L dan lintas wilayah, bukan permasalahan lokal yang berdiri sendiri. Lebih lanjut, Hanafi dan Wulandari (2023) mengidentifikasi bahwa satker-satker yang bergerak di bidang penegakan hukum cenderung menunjukkan kelemahan yang lebih menonjol pada indikator Deviasi Halaman III DIPA dibandingkan satker di bidang lain, sebuah temuan yang memiliki relevansi langsung dengan karakteristik Rudenim sebagai satker penegakan keimigrasian.')]),
        justifiedPara([tr('Komposisi Belanja Modal pada Rudenim Pontianak meningkat signifikan menjadi 60\u201370% dari total pagu DIPA pada Tahun Anggaran 2025, menjadikan Belanja Modal sebagai komponen dominan dan paling material dalam pelaksanaan anggaran satker pada periode tersebut. Pergeseran komposisi ini menuntut kapasitas perencanaan dan pelaksanaan yang berbeda dibanding Belanja Pegawai dan Belanja Barang, karena Belanja Modal melibatkan proses pengadaan kontraktual, pekerjaan fisik multi-termin, dan koordinasi dengan penyedia barang/jasa eksternal.')]),
        justifiedPara([tr('Fenomena deviasi tersebut nyata terjadi pada objek penelitian ini. Sebagaimana disajikan pada Tabel 1.3, rata-rata deviasi Belanja Modal Rudenim Pontianak mencapai 20,16% pada TA 2023 dan meningkat menjadi 28,77% pada TA 2024, sehingga nilai indikator Deviasi Halaman III DIPA satker turun ke kategori Cukup (88,31). Kondisi ini membaik signifikan pada TA 2025 dengan rata-rata deviasi 5,41%, namun justru perbaikan tersebut memperkuat relevansi pertanyaan penelitian: faktor apa yang menyebabkan deviasi pada periode sebelumnya dan mekanisme apa yang mengubahnya \u2014 pertanyaan yang masih belum optimal dijawab melalui data agregat semata dan memerlukan eksplorasi kualitatif.')]),

        // Tabel 1.3
        tableCaptionCentered('Tabel 1.3 Deviasi Halaman III DIPA Belanja Modal Rudenim Pontianak TA 2023\u20132025'),
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [800, 1700, 2200, 1600, 1766, 600],
          rows: [
            new TableRow({
              children: [
                cellPara('Tahun', { width: 800, bold: true, center: true }),
                cellPara('Proporsi Pagu Belanja Modal (%)*', { width: 1700, bold: true, center: true }),
                cellPara('Realisasi Belanja Modal (Rp)', { width: 2200, bold: true, center: true }),
                cellPara('Rata-rata Deviasi Bulanan (%)**', { width: 1600, bold: true, center: true }),
                cellPara('Nilai Indikator Deviasi Hal. III***', { width: 1766, bold: true, center: true }),
                cellPara('Kategori', { width: 600, bold: true, center: true }),
              ]
            }),
            new TableRow({ children: [cellPara('2023', { width: 800, center: true }), cellPara('11,50', { width: 1700, center: true }), cellPara('362.282.510', { width: 2200, center: true }), cellPara('20,16', { width: 1600, center: true }), cellPara('89,80', { width: 1766, center: true }), cellPara('Baik', { width: 600, center: true })] }),
            new TableRow({ children: [cellPara('2024', { width: 800, center: true }), cellPara('27,87', { width: 1700, center: true }), cellPara('3.372.224.900', { width: 2200, center: true }), cellPara('28,77', { width: 1600, center: true }), cellPara('88,31', { width: 1766, center: true }), cellPara('Cukup', { width: 600, center: true })] }),
            new TableRow({ children: [cellPara('2025', { width: 800, center: true }), cellPara('65,92', { width: 1700, center: true }), cellPara('6.567.577.362', { width: 2200, center: true }), cellPara('5,41', { width: 1600, center: true }), cellPara('100,00', { width: 1766, center: true }), cellPara('Sangat Baik', { width: 600, center: true })] }),
          ]
        }),
        tableSource('*Rata-rata proporsi pagu Belanja Modal terhadap total pagu DIPA. **Rata-rata deviasi bulanan |RPD \u2212 Realisasi|/RPD Belanja Modal, sesuai basis perhitungan PER-5/PB/2024 Pasal 7. ***Nilai akhir tahun, seluruh jenis belanja. Sumber: OM-SPAN/MEBE (Monitoring and Evaluation of Budget Execution), diolah peneliti (2026).'),

        justifiedPara([tr('Pola deviasi tersebut terkonsentrasi pada bulan-bulan kritis tertentu sebagaimana disajikan pada Tabel 1.4. Pada TA 2024, rencana penarikan dana Belanja Modal sebesar Rp700 juta pada bulan Maret, Rp1,79 miliar pada bulan Agustus, dan Rp194,5 juta pada bulan September sama sekali tidak terealisasi pada bulan bersangkutan (deviasi 100%), yang mengindikasikan adanya pergeseran jadwal pengadaan dan pembayaran ke bulan berikutnya.')]),

        // Tabel 1.4
        tableCaptionCentered('Tabel 1.4 Bulan Kritis Deviasi Belanja Modal Rudenim Pontianak TA 2023\u20132025'),
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [800, 1200, 2266, 2200, 1200],
          rows: [
            new TableRow({
              children: [
                cellPara('Tahun', { width: 800, bold: true, center: true }),
                cellPara('Bulan', { width: 1200, bold: true, center: true }),
                cellPara('RPD (Rp)', { width: 2266, bold: true, center: true }),
                cellPara('Realisasi (Rp)', { width: 2200, bold: true, center: true }),
                cellPara('Deviasi (%)', { width: 1200, bold: true, center: true }),
              ]
            }),
            new TableRow({ children: [cellPara('2023', { width: 800, center: true }), cellPara('Maret', { width: 1200 }), cellPara('222.000.000', { width: 2266, center: true }), cellPara('0', { width: 2200, center: true }), cellPara('100,00', { width: 1200, center: true })] }),
            new TableRow({ children: [cellPara('2023', { width: 800, center: true }), cellPara('November', { width: 1200 }), cellPara('274.778.000', { width: 2266, center: true }), cellPara('17.250.000', { width: 2200, center: true }), cellPara('93,72', { width: 1200, center: true })] }),
            new TableRow({ children: [cellPara('2024', { width: 800, center: true }), cellPara('Maret', { width: 1200 }), cellPara('700.000.000', { width: 2266, center: true }), cellPara('0', { width: 2200, center: true }), cellPara('100,00', { width: 1200, center: true })] }),
            new TableRow({ children: [cellPara('2024', { width: 800, center: true }), cellPara('Agustus', { width: 1200 }), cellPara('1.792.439.999', { width: 2266, center: true }), cellPara('0', { width: 2200, center: true }), cellPara('100,00', { width: 1200, center: true })] }),
            new TableRow({ children: [cellPara('2024', { width: 800, center: true }), cellPara('September', { width: 1200 }), cellPara('194.511.000', { width: 2266, center: true }), cellPara('0', { width: 2200, center: true }), cellPara('100,00', { width: 1200, center: true })] }),
            new TableRow({ children: [cellPara('2025', { width: 800, center: true }), cellPara('Juni', { width: 1200 }), cellPara('50.000.000', { width: 2266, center: true }), cellPara('35.587.371', { width: 2200, center: true }), cellPara('28,83', { width: 1200, center: true })] }),
            new TableRow({ children: [cellPara('2025', { width: 800, center: true }), cellPara('Agustus', { width: 1200 }), cellPara('697.466.021', { width: 2266, center: true }), cellPara('560.399.255', { width: 2200, center: true }), cellPara('19,65', { width: 1200, center: true })] }),
          ]
        }),
        tableSource('Sumber: OM-SPAN/MEBE (Monitoring and Evaluation of Budget Execution), diolah peneliti (2026).'),

        // Tabel 1.5
        tableCaptionCentered('Tabel 1.5 Contoh Paket Belanja Modal yang Mengalami Pergeseran Realisasi TA 2023\u20132025'),
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [400, 600, 2000, 1300, 800, 800, 700, 2066],
          rows: [
            new TableRow({
              children: [
                cellPara('No', { width: 400, bold: true, center: true }),
                cellPara('Tahun', { width: 600, bold: true, center: true }),
                cellPara('Nama Paket', { width: 2000, bold: true, center: true }),
                cellPara('Pagu (Rp)', { width: 1300, bold: true, center: true }),
                cellPara('Bulan RPD', { width: 800, bold: true, center: true }),
                cellPara('SP2D Aktual', { width: 800, bold: true, center: true }),
                cellPara('Geser (Bln)', { width: 700, bold: true, center: true }),
                cellPara('Penyebab Utama Pergeseran', { width: 2066, bold: true, center: true }),
              ]
            }),
            new TableRow({ children: [cellPara('1', { width: 400, center: true }), cellPara('2023', { width: 600, center: true }), cellPara('Pengadaan Perangkat Pengolah Data dan Komunikasi', { width: 2000 }), cellPara('223.980.000', { width: 1300, center: true }), cellPara('Maret', { width: 800, center: true }), cellPara('April', { width: 800, center: true }), cellPara('1', { width: 700, center: true }), cellPara('Masalah administrasi pembayaran tagihan', { width: 2066 })] }),
            new TableRow({ children: [cellPara('2', { width: 400, center: true }), cellPara('2023', { width: 600, center: true }), cellPara('Jasa Pekerjaan Konstruksi Fisik Renovasi Gedung', { width: 2000 }), cellPara('191.216.000', { width: 1300, center: true }), cellPara('November', { width: 800, center: true }), cellPara('Desember', { width: 800, center: true }), cellPara('1', { width: 700, center: true }), cellPara('Pekerjaan fisik belum selesai sehingga BAST mundur', { width: 2066 })] }),
            new TableRow({ children: [cellPara('3', { width: 400, center: true }), cellPara('2024', { width: 600, center: true }), cellPara('Pembelian Rumah Negara Tipe D (Termin I)', { width: 2000 }), cellPara('2.477.920.000', { width: 1300, center: true }), cellPara('Maret', { width: 800, center: true }), cellPara('April', { width: 800, center: true }), cellPara('1', { width: 700, center: true }), cellPara('Perencanaan RPD awal tidak realistis (diplot sebelum siap)', { width: 2066 })] }),
            new TableRow({ children: [cellPara('4', { width: 400, center: true }), cellPara('2024', { width: 600, center: true }), cellPara('Pembelian Rumah Negara Tipe D (Termin II)', { width: 2000 }), cellPara('2.477.920.000', { width: 1300, center: true }), cellPara('Agustus', { width: 800, center: true }), cellPara('September', { width: 800, center: true }), cellPara('1', { width: 700, center: true }), cellPara('Kondisi fisik objek belum siap serah terima', { width: 2066 })] }),
            new TableRow({ children: [cellPara('5', { width: 400, center: true }), cellPara('2024', { width: 600, center: true }), cellPara('Pengadaan Peralatan dan Fasilitas Perkantoran', { width: 2000 }), cellPara('199.274.900', { width: 1300, center: true }), cellPara('September', { width: 800, center: true }), cellPara('Oktober', { width: 800, center: true }), cellPara('1', { width: 700, center: true }), cellPara('Keterlambatan kesiapan penyedia untuk TTD kontrak', { width: 2066 })] }),
            new TableRow({ children: [cellPara('6', { width: 400, center: true }), cellPara('2025', { width: 600, center: true }), cellPara('Biaya Pengelolaan Gedung dan Bangunan (Swakelola B53)', { width: 2000 }), cellPara('294.944.000', { width: 1300, center: true }), cellPara('Juni', { width: 800, center: true }), cellPara('Juni', { width: 800, center: true }), cellPara('0', { width: 700, center: true }), cellPara('Estimasi volume/biaya swakelola terlalu tinggi (shortfall)', { width: 2066 })] }),
            new TableRow({ children: [cellPara('7', { width: 400, center: true }), cellPara('2025', { width: 600, center: true }), cellPara('Jasa Konsultan Manajemen Konstruksi', { width: 2000 }), cellPara('505.462.000', { width: 1300, center: true }), cellPara('Agustus', { width: 800, center: true }), cellPara('November', { width: 800, center: true }), cellPara('3', { width: 700, center: true }), cellPara('Output/deliverable belum lengkap sehingga termin tertahan', { width: 2066 })] }),
          ]
        }),
        tableSource('Sumber: OM-SPAN/SAKTI, diolah peneliti (2026).'),

        justifiedPara([tr('Di samping dominasi Belanja Modal, Rudenim Pontianak juga menghadapi fluktuasi Belanja Barang akibat ketidakpastian jumlah deteni di wilayah perbatasan, yang turut memengaruhi akurasi penyusunan RPD. Untuk memahami fenomena deviasi RPD ini secara lebih mendalam, penelitian ini menggunakan '), tri('Agency Theory'), tr(' sebagai lensa analitis sebagaimana diuraikan pada BAB II.')]),
        justifiedPara([tr('Berdasarkan uraian di atas, dapat diidentifikasi tiga indikasi masalah yang melatarbelakangi penelitian ini. Pertama, terjadinya deviasi antara rencana dan penyerapan anggaran belanja modal pada Rumah Detensi Imigrasi Pontianak tahun 2023\u20132025. Kedua, perlunya menelaah penyebab terjadinya deviasi pelaksanaan anggaran belanja modal tersebut. Ketiga, perlunya menganalisis dampak dari terjadinya deviasi pelaksanaan anggaran belanja modal bagi pengelolaan anggaran satker.')]),
        justifiedPara([tr('Penelitian ini berfokus pada pelaksanaan anggaran belanja Rudenim Pontianak periode Tahun Anggaran 2023\u20132025, dengan penekanan khusus pada Belanja Modal. Kerangka evaluasi merujuk pada PMK 62/2023 sebagai regulasi omnibus pelaksanaan anggaran dan PER-5/PB/2024 sebagai petunjuk teknis penilaian IKPA.')]),

        heading2('1.2  Rumusan Masalah'),
        justifiedPara([tr('Berdasarkan latar belakang dan indikasi masalah yang telah diuraikan, penelitian ini merumuskan tiga pertanyaan penelitian sebagai berikut:')]),
        numberedItemRuns([tr('Bagaimana implementasi pelaksanaan anggaran belanja pada Rumah Detensi Imigrasi Pontianak tahun 2023\u20132025?')]),
        numberedItemRuns([tr('Apa penyebab terjadinya deviasi pelaksanaan anggaran belanja pada Rumah Detensi Imigrasi Pontianak tahun 2023\u20132025?')]),
        numberedItemRuns([tr('Apa saja dampak dari terjadinya deviasi pelaksanaan anggaran belanja bagi Rumah Detensi Imigrasi Pontianak tahun 2023\u20132025?')]),

        heading2('1.3  Tujuan Penelitian'),
        justifiedPara([tr('Berdasarkan rumusan masalah di atas, tujuan penelitian ini adalah:')]),
        numberedItemRuns([tr('Mendeskripsikan implementasi pelaksanaan anggaran belanja, khususnya Belanja Modal, pada Rumah Detensi Imigrasi Pontianak tahun 2023\u20132025.')]),
        numberedItemRuns([tr('Menganalisis penyebab terjadinya deviasi pelaksanaan anggaran belanja pada Rumah Detensi Imigrasi Pontianak tahun 2023\u20132025.')]),
        numberedItemRuns([tr('Mengevaluasi dampak dari terjadinya deviasi pelaksanaan anggaran belanja bagi Rumah Detensi Imigrasi Pontianak tahun 2023\u20132025.')]),

        heading2('1.4  Manfaat Penelitian'),
        heading3('1.4.1  Manfaat Teoritis'),
        justifiedPara([tr('Penelitian ini diharapkan memberikan kontribusi pada pengembangan literatur Akuntansi Sektor Publik dan Akuntansi Pemerintahan, khususnya pada subbidang pelaksanaan anggaran belanja modal dan evaluasi kinerja melalui IKPA. Secara konseptual, penelitian ini memperkaya elaborasi penerapan '), tri('Agency Theory'), tr(' (Jensen & Meckling, 1976; Lane, 2003) yang dilengkapi dengan kerangka regulasi PMK 62/2023 dan mekanisme pengadaan barang/jasa pemerintah berdasarkan Perpres 16/2018 jo. Perpres 12/2021 dalam konteks satker UPT dengan dominasi Belanja Modal. Konteks ini belum dieksplorasi secara memadai dalam penelitian-penelitian terdahulu yang umumnya berfokus pada IKPA agregat tanpa membedakan per jenis belanja. Selain itu, penelitian ini dapat menjadi rujukan metodologis dan substantif bagi penelitian lanjutan pada satker sejenis, seperti Rumah Tahanan Negara (Rutan), Lembaga Pemasyarakatan (Lapas), atau UPT penegakan hukum lainnya yang memiliki karakteristik dominasi Belanja Modal serupa.')]),
        heading3('1.4.2  Manfaat Praktis'),
        justifiedPara([tr('Dari sisi praktis, penelitian ini memberikan manfaat bagi berbagai pemangku kepentingan. Bagi Rudenim Pontianak selaku objek penelitian, hasil kajian ini diharapkan menghasilkan rekomendasi konkret untuk meningkatkan kualitas perencanaan dan pelaksanaan anggaran Belanja Modal, memperkuat koordinasi antara Pejabat Pembuat Komitmen (PPK) dengan penyedia barang/jasa, serta menyempurnakan manajemen pengadaan agar lebih selaras dengan siklus kas aktual. Bagi Direktorat Jenderal Imigrasi, penelitian ini dapat menjadi masukan kebijakan dalam pembinaan tata kelola pelaksanaan anggaran Belanja Modal pada UPT detensi imigrasi se-Indonesia. Bagi KPPN Pontianak dan Kanwil DJPb, hasil penelitian ini menyediakan referensi dalam pembinaan satker yang memiliki dominasi Belanja Modal, sehingga pendekatan pembinaan dapat lebih kontekstual dan tepat sasaran. Bagi Direktorat Jenderal Perbendaharaan secara kelembagaan, temuan penelitian ini dapat menjadi bahan pertimbangan dalam penyempurnaan formula IKPA agar lebih mengakomodasi karakteristik pelaksanaan anggaran Belanja Modal yang bersifat kontraktual dan multi-termin.')]),

      ]
    },
    // ═══════════════════════════════════════════════════════════════
    // SECTION 6: BAB II
    // ═══════════════════════════════════════════════════════════════
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: M_TOP, right: M_RIGHT, bottom: M_BOTTOM, left: M_LEFT },
          pageNumbers: { formatType: NumberFormat.DECIMAL }
        },
        titlePage: true
      },
      headers: chapterPageSetup.headers,
      footers: chapterPageSetup.footers,
      children: [

        centered('BAB II', { bold: true, size: 24, spaceAfter: 0 }),
        centered('TINJAUAN PUSTAKA', { bold: true, size: 24, spaceAfter: 240 }),
        justifiedPara([tr('Berdasarkan latar belakang dan rumusan masalah yang telah diuraikan pada BAB I, bab ini menyajikan landasan teoretis dan empiris yang menopang penelitian mengenai pelaksanaan anggaran belanja, khususnya Belanja Modal, pada Rumah Detensi Imigrasi Pontianak. Pembahasan disusun secara berjenjang. Sub-bab 2.1 Landasan Teori menguraikan lima pokok bahasan yang saling melengkapi, yaitu pelaksanaan anggaran belanja negara, Belanja Modal beserta mekanisme pengadaan barang/jasa, konsep deviasi pelaksanaan anggaran, '), tri('Agency Theory'), tr(' sebagai lensa analitis, serta Indikator Kinerja Pelaksanaan Anggaran (IKPA) sebagai instrumen evaluasi. Sub-bab 2.2 memetakan ringkasan penelitian terdahulu yang relevan, Sub-bab 2.3 merumuskan proposisi penelitian, dan Sub-bab 2.4 menyajikan kerangka penelitian yang mengintegrasikan keseluruhan landasan tersebut ke dalam alur analisis yang menjawab ketiga rumusan masalah.')]),
        heading2('2.1  Landasan Teori'),
        heading3('2.1.1  Pelaksanaan Anggaran Belanja Negara'),
        justifiedPara([tr('Pelaksanaan anggaran belanja negara merupakan tahap operasional dari siklus pengelolaan keuangan negara yang menerjemahkan rencana keuangan tahunan ke dalam realisasi belanja yang konkret. Undang-Undang Nomor 17 Tahun 2003 tentang Keuangan Negara dan Undang-Undang Nomor 1 Tahun 2004 tentang Perbendaharaan Negara menempatkan Anggaran Pendapatan dan Belanja Negara (APBN) sebagai instrumen kebijakan fiskal yang pelaksanaannya harus tertib, taat pada peraturan, efisien, ekonomis, efektif, transparan, dan bertanggung jawab. Mardiasmo (2018) menegaskan bahwa dalam kerangka penganggaran berbasis kinerja, kualitas pelaksanaan anggaran tidak hanya diukur dari besarnya serapan, melainkan juga dari ketepatan antara rencana dan realisasi sebagai cerminan akuntabilitas atas penggunaan sumber daya publik.')]),
        justifiedPara([tr('Secara operasional, APBN dilaksanakan oleh kementerian dan lembaga melalui Daftar Isian Pelaksanaan Anggaran (DIPA). Tata cara pelaksanaannya diatur dalam Peraturan Pemerintah Nomor 45 Tahun 2013 sebagaimana diubah dengan Peraturan Pemerintah Nomor 50 Tahun 2018, dan disempurnakan secara menyeluruh melalui Peraturan Menteri Keuangan Nomor 62 Tahun 2023 sebagai regulasi omnibus yang menyatukan pengaturan perencanaan, pelaksanaan, serta akuntansi dan pelaporan keuangan. Mekanisme pelaksanaan anggaran mengikuti alur baku, yaitu penyusunan Rencana Penarikan Dana (RPD) bulanan pada Halaman III DIPA sebagai proyeksi kebutuhan kas, pembuatan komitmen oleh Pejabat Pembuat Komitmen (PPK), pengajuan Surat Permintaan Pembayaran (SPP), penerbitan Surat Perintah Membayar (SPM) oleh Pejabat Penandatangan SPM (PPSPM), serta penerbitan Surat Perintah Pencairan Dana (SP2D) oleh Kantor Pelayanan Perbendaharaan Negara (KPPN) selaku kuasa Bendahara Umum Negara. Setiap tahapan memiliki persyaratan administratif dan batas waktu, sehingga kegagalan pada satu tahap dapat menyebabkan pergeseran realisasi yang berkontribusi pada deviasi anggaran (PMK Nomor 62 Tahun 2023).')]),
        justifiedPara([tr('Dalam hierarki pelaksanaan APBN, kementerian dan lembaga berkedudukan sebagai Pengguna Anggaran yang menerima DIPA dari Menteri Keuangan, kemudian mendistribusikan kewenangan pelaksanaannya kepada satuan kerja. Satuan kerja merupakan unit pelaksana teknis yang secara langsung mengelola kegiatan dan anggaran, dipimpin oleh Kuasa Pengguna Anggaran (KPA) yang bertanggung jawab atas efisiensi dan efektivitas penggunaan anggaran. Kewajiban satuan kerja mencakup penyusunan RPD bulanan yang akurat, pelaksanaan kegiatan sesuai rencana, penatausahaan keuangan melalui sistem informasi terintegrasi, serta pelaporan secara periodik. Kemampuan satuan kerja memenuhi kewajiban tersebut, khususnya akurasi RPD, sangat dipengaruhi oleh kapasitas sumber daya manusia, kompleksitas operasional, dan stabilitas lingkungan eksternal.')]),
        justifiedPara([tr('Karakteristik tersebut menjadi semakin menonjol pada satuan kerja bidang penegakan hukum, yaitu unit pelaksana teknis yang menjalankan fungsi penegakan hukum, keamanan, dan ketertiban, termasuk satuan kerja di bawah Direktorat Jenderal Imigrasi. Satuan kerja jenis ini memiliki ciri khas berupa tugas pokok yang bersifat mandatori dan tidak dapat ditunda, volume pekerjaan yang bergantung pada faktor eksternal yang sulit dikendalikan, serta kebutuhan anggaran operasional yang variabel dan sulit diprediksi pada awal tahun. Rumah Detensi Imigrasi (Rudenim) Pontianak, sebagai objek penelitian ini, merupakan satuan kerja yang menjalankan penampungan sementara warga negara asing yang dikenai Tindakan Administratif Keimigrasian, dan berkedudukan di wilayah perbatasan Kalimantan Barat\u2013Malaysia yang menghadirkan dinamika mobilitas orang asing yang tinggi. Kondisi operasional yang dinamis ini menempatkan akurasi perencanaan dan pelaksanaan anggaran, terutama pada belanja yang bersifat kontraktual, sebagai tantangan struktural yang relevan untuk dikaji.')]),
        heading3('2.1.2  Belanja Modal: Konsep, Mekanisme, dan Pengadaan Barang/Jasa'),
        justifiedPara([tr('Belanja Modal merupakan pengeluaran anggaran untuk perolehan aset tetap dan/atau aset lainnya yang memberi manfaat lebih dari satu periode akuntansi. Dalam bagan akun standar pemerintah pusat, Belanja Modal diklasifikasikan ke dalam kode akun 53, yang dibagi lagi menjadi Belanja Modal Tanah (531), Peralatan dan Mesin (532), Gedung dan Bangunan (533), Jalan, Irigasi, dan Jaringan (534), serta Aset Tetap Lainnya (535). Karakteristik fundamental Belanja Modal yang membedakannya dari Belanja Pegawai (kode 51) dan Belanja Barang (kode 52) adalah sifatnya yang kontraktual, melibatkan pihak ketiga sebagai penyedia barang/jasa, dan umumnya direalisasikan dalam termin pembayaran yang mengikuti progres fisik pekerjaan. Sifat inilah yang menjadikan pelaksanaan Belanja Modal lebih kompleks dan lebih rentan terhadap pergeseran realisasi dibandingkan jenis belanja lainnya.')]),
        justifiedPara([tr('Peraturan Menteri Keuangan Nomor 62 Tahun 2023 mengatur mekanisme pelaksanaan anggaran secara komprehensif, mulai dari perencanaan melalui Rencana Kerja dan Anggaran Kementerian/Lembaga (RKA-K/L), penyusunan dokumen pelaksanaan berupa DIPA, Petunjuk Operasional Kegiatan (POK), dan RPD Halaman III, hingga pelaksanaan operasional yang mencakup pembuatan komitmen, Berita Acara Serah Terima (BAST), SPP, SPM, dan SP2D. Untuk Belanja Modal, mekanisme tersebut diperkaya dengan tahapan pemilihan penyedia yang mengikuti Peraturan Presiden Nomor 16 Tahun 2018 sebagaimana telah diubah dengan Peraturan Presiden Nomor 12 Tahun 2021 tentang Pengadaan Barang/Jasa Pemerintah. Dengan demikian, pelaksanaan Belanja Modal berada pada irisan dua kerangka regulasi sekaligus, yakni regulasi pelaksanaan anggaran dan regulasi pengadaan barang/jasa.')]),
        justifiedPara([tr('Peraturan Presiden Nomor 16 Tahun 2018 jo. Peraturan Presiden Nomor 12 Tahun 2021 mengatur metode pemilihan penyedia yang dipakai untuk merealisasikan Belanja Modal, antara lain Tender, Seleksi, Pengadaan Langsung, Penunjukan Langsung, dan '), tri('E-purchasing'), tr(' melalui katalog elektronik. Pemilihan metode bergantung pada nilai paket dan karakteristik pekerjaan; sebagai gambaran, paket dengan nilai relatif besar pada umumnya ditenderkan, sedangkan paket bernilai kecil dapat dilakukan melalui pengadaan langsung atau '), tri('e-purchasing'), tr('. Setiap kontrak yang dihasilkan ditandatangani oleh Pejabat Pembuat Komitmen (PPK) dan mengatur termin pembayaran, jadwal pelaksanaan, serta ketentuan Berita Acara Serah Terima (BAST). Tahapan pemilihan penyedia ini menambah panjang rantai aktivitas yang harus diselesaikan sebelum dana Belanja Modal dapat direalisasikan.')]),
        justifiedPara([tr('Pembayaran Belanja Modal pada umumnya dilakukan melalui mekanisme Pembayaran Langsung (LS) karena nilainya berada di atas batas penggunaan Uang Persediaan. PPK mengajukan Surat Permintaan Pembayaran (SPP) setelah BAST diterbitkan; Pejabat Penandatangan SPM (PPSPM) menguji dan menerbitkan Surat Perintah Membayar (SPM); selanjutnya KPPN menerbitkan Surat Perintah Pencairan Dana (SP2D) yang menjadi dasar transfer dana ke rekening penyedia. Rangkaian dokumen ini melekat pada setiap termin pembayaran Belanja Modal, sehingga keterlambatan pada salah satu mata rantai, misalnya kelengkapan dokumen tagihan atau hasil verifikasi, akan langsung menggeser waktu realisasi dari rencana yang tertuang pada Halaman III DIPA.')]),
        justifiedPara([tr('Karakteristik kontraktual dan multi-pihak menjadikan Belanja Modal rentan terhadap deviasi pelaksanaan. Sumber-sumber deviasi yang khas meliputi keterlambatan progres fisik akibat kondisi penyedia atau cuaca, tertundanya BAST karena pekerjaan belum mencapai spesifikasi, tidak lengkapnya dokumen tagihan, '), tri('bottleneck'), tr(' pada verifikasi PPSPM, serta pergeseran termin pembayaran. Oleh karena itu, pelaksanaan Belanja Modal memerlukan kapasitas perencanaan yang lebih matang dan koordinasi yang lebih intensif antara unit teknis, unit pengadaan, dan unit keuangan satuan kerja dibandingkan dengan Belanja Pegawai dan Belanja Barang.')]),
        heading3('2.1.3  Deviasi Pelaksanaan Anggaran: Konsep, Penyebab, dan Dampak'),
        justifiedPara([tr('Deviasi anggaran ('), tri('budget deviation'), tr(' atau '), tri('budget variance'), tr(') dalam literatur akuntansi sektor publik merujuk pada simpangan antara nilai yang direncanakan dengan nilai yang direalisasikan dari suatu pos anggaran pada periode tertentu. Dalam konteks pelaksanaan anggaran, deviasi secara spesifik mengacu pada ketidaksesuaian antara RPD bulanan yang tercantum pada Halaman III DIPA dengan realisasi anggaran yang sesungguhnya terjadi pada bulan bersangkutan.')]),
        justifiedPara([tr('Namun demikian, formulasi resmi penilaian IKPA berdasarkan PER-5/PB/2024 menggunakan nilai mutlak (absolut) dalam menghitung deviasi bulanan per jenis belanja. Formula deviasi bulanan tersebut secara eksplisit dirumuskan sebagai berikut: Deviasi Bulanan = (|RPD Bulanan - Realisasi Anggaran| / RPD Bulanan) * 100%. Melalui penggunaan nilai mutlak tersebut, formula IKPA tidak membedakan arah deviasi; baik terjadi '), tri('overrun'), tr(' maupun '), tri('underrun'), tr(', penyimpangan tersebut tetap dihitung sebagai deviasi yang akan mengurangi nilai IKPA satker secara simetris. Pada belanja yang bersifat kontraktual seperti Belanja Modal, deviasi positif ('), tri('underrun'), tr(' atau penyerapan di bawah rencana awal) lebih sering muncul karena pergeseran jadwal pengadaan, kontrak, dan pembayaran termin yang bergantung pada kesiapan pihak ketiga.')]),
        justifiedPara([tr('Literatur mengenai penyebab deviasi anggaran sektor publik mengidentifikasi beragam faktor yang, untuk keperluan penelitian ini, dikelompokkan ke dalam lima kategori yang relevan dengan pelaksanaan anggaran Belanja Modal.')]),
        justifiedPara([tr('Pertama, faktor perencanaan. Ratnasari (2022) menemukan bahwa kualitas perencanaan yang rendah, berupa ketidakakuratan estimasi kebutuhan kas dan kelemahan dalam menyusun RPD, merupakan prediktor utama deviasi. Pada Belanja Modal, akurasi perencanaan menjadi lebih sulit karena asumsi waktu pengadaan kerap terlalu optimistik. Kedua, faktor sumber daya manusia dan kapasitas pengadaan. Keterbatasan jumlah pejabat pengadaan bersertifikat, tingginya beban kerja staf inti, serta pergantian personel yang menyebabkan hilangnya '), tri('institutional knowledge'), tr(' berkontribusi signifikan terhadap deviasi, terlebih karena pelaksanaan Belanja Modal menuntut kompetensi teknis dalam menyusun spesifikasi, harga perkiraan sendiri, dan dokumen kontrak.')]),
        justifiedPara([tr('Manangin '), tri('et al.'), tr(' (2023) menegaskan bahwa kompetensi pengelola keuangan dan pejabat pengadaan merupakan faktor penentu kualitas pelaksanaan anggaran. Pada Belanja Modal, ketersediaan pejabat pengadaan bersertifikat dan PPK yang memahami regulasi pengadaan barang/jasa pemerintah (Perpres 16/2018 jo. Perpres 12/2021) menjadi prasyarat mutlak agar proses pemilihan penyedia, negosiasi, dan penandatanganan kontrak dapat berjalan tepat waktu sesuai jadwal RPD.')]),
        justifiedPara([tr('Ketiga, faktor administratif dan regulasi. Proses administratif yang panjang dalam mekanisme SPP-SPM-SP2D, pemblokiran anggaran, serta persyaratan dokumen pendukung yang tidak terpenuhi tepat waktu kerap menggeser realisasi dari bulan yang direncanakan; hambatan ini terutama dirasakan pada kegiatan kontraktual bernilai besar yang pencairannya bergantung pada kesiapan dokumen pihak ketiga (PP Nomor 50 Tahun 2018; PMK Nomor 62 Tahun 2023). Keempat, faktor operasional dan pihak ketiga. Manangin '), tri('et al.'), tr(' (2023) menekankan bahwa keterlambatan penyedia, perubahan prioritas kebijakan, dan fluktuasi permintaan layanan publik merupakan sumber deviasi yang bersifat struktural; pada Belanja Modal, ketergantungan pada progres fisik penyedia dan kondisi lapangan menjadikan jadwal termin pembayaran sangat rawan bergeser.')]),
        justifiedPara([tr('Pelaksanaan Belanja Modal sangat bergantung pada kinerja penyedia barang/jasa. Keterlambatan progres fisik akibat kondisi cuaca, keterbatasan material, masalah '), tri('supply chain'), tr(', atau kapasitas finansial kontraktor yang tidak memadai merupakan faktor-faktor yang seringkali di luar kendali satker (Sholawatunnisa & Supriyanto, 2025). Pada satker UPT seperti Rudenim Pontianak yang berlokasi di kawasan semi-perkotaan, keterbatasan penyedia lokal yang memenuhi kualifikasi turut mempersulit proses pemilihan penyedia.')]),
        justifiedPara([tr('Kelima, faktor teknis dan sistem informasi. Kendala pada sistem informasi pengelolaan keuangan negara, seperti SPAN dan SAKTI, dapat menimbulkan keterlambatan input data, kesalahan entri, dan ketidaksinkronan antarsistem. Sholawatunnisa dan Supriyanto (2025), melalui pemodelan SARIMA, menemukan bahwa pola deviasi anggaran memiliki komponen musiman yang dapat diidentifikasi, yang mengindikasikan adanya faktor struktural berulang yang dapat diantisipasi melalui perencanaan yang lebih adaptif.')]),
        justifiedPara([tr('Dampak deviasi pelaksanaan anggaran dapat ditelaah pada tiga tingkatan yang saling berkaitan. Pada tingkat satuan kerja (mikro), deviasi yang tinggi menurunkan nilai IKPA, khususnya indikator Deviasi Halaman III DIPA, yang berimplikasi pada penilaian kinerja yang kurang baik, intensifikasi pembinaan oleh KPPN, serta potensi pembatasan akses pencairan dana pada periode berikutnya (PER-5/PB/2024). Pada tingkat KPPN dan DJPb (meso), akumulasi deviasi menyulitkan peramalan kebutuhan kas dan menciptakan inefisiensi alokasi kas antarsatuan kerja. Pada tingkat fiskal nasional (makro), deviasi yang sistemik dapat mendistorsi pencapaian target fiskal dan melemahkan efektivitas kebijakan fiskal. Hanafi dan Wulandari (2023) menemukan bahwa satuan kerja rumpun penegakan hukum secara konsisten lebih lemah pada indikator deviasi, sehingga karakteristik strukturalnya perlu diakomodasi dalam desain kebijakan evaluasi kinerja anggaran.')]),
        heading3('2.1.4  Agency Theory sebagai Lensa Analitis'),
        justifiedPara([tri('Agency theory'), tr(' merupakan teori fundamental yang menjelaskan hubungan kontraktual antara prinsipal ('), tri('principal'), tr(') sebagai pihak yang mendelegasikan wewenang dan agen ('), tri('agent'), tr(') sebagai pihak yang menjalankannya. Jensen dan Meckling (1976) mendefinisikan hubungan keagenan sebagai kontrak di mana prinsipal melibatkan agen untuk melaksanakan pekerjaan atas namanya, disertai pendelegasian sebagian otoritas pengambilan keputusan. Permasalahan inti muncul akibat asimetri informasi, yaitu kondisi ketika agen memiliki akses informasi yang lebih lengkap dibandingkan prinsipal, yang berpotensi menimbulkan '), tri('adverse selection'), tr(' sebelum kontrak dan '), tri('moral hazard'), tr(' setelah kontrak berjalan, sehingga prinsipal menanggung '), tri('agency cost'), tr(' berupa biaya pengawasan, penjaminan, dan kerugian sisa (Jensen & Meckling, 1976).')]),
        justifiedPara([tr('Meskipun dikembangkan dalam konteks korporasi, '), tri('agency theory'), tr(' telah diadaptasi untuk menjelaskan tata kelola sektor publik. Lane (2003) menegaskan bahwa hubungan keagenan pada sektor publik bersifat berlapis ('), tri('multilevel agency chain'), tr('), melibatkan banyak aktor dengan kepentingan yang beragam. Dalam pengelolaan keuangan negara di Indonesia, rakyat selaku prinsipal utama mendelegasikan wewenang kepada Dewan Perwakilan Rakyat dan pemerintah; Kementerian Keuangan melalui Direktorat Jenderal Perbendaharaan bertindak selaku Bendahara Umum Negara yang mengawasi pelaksanaan anggaran oleh satuan kerja. Dalam kerangka ini, Rudenim Pontianak berkedudukan sebagai agen yang bertanggung jawab kepada prinsipal berlapis tersebut.')]),
        justifiedPara([tr('Dari perspektif '), tri('agency theory'), tr(', deviasi antara RPD dan realisasi dapat ditafsirkan sebagai sinyal adanya '), tri('agency problem'), tr(', baik berupa keterbatasan kapasitas agen maupun asimetri informasi mengenai kondisi operasional di lapangan. Pada pelaksanaan Belanja Modal, relasi keagenan menjadi lebih kompleks karena melibatkan pihak ketiga (penyedia barang/jasa) sebagai agen tambahan yang kinerjanya turut menentukan ketepatan realisasi. IKPA, dalam perspektif ini, berfungsi sebagai mekanisme '), tri('monitoring and control'), tr(' yang dirancang untuk memitigasi '), tri('agency problem'), tr(' dengan mendorong akurasi perencanaan dan transparansi pelaporan (Manangin '), tri('et al.'), tr(', 2023; Ratnasari, 2022).')]),
        heading3('2.1.5  Indikator Kinerja Pelaksanaan Anggaran (IKPA)'),
        justifiedPara([tr('Indikator Kinerja Pelaksanaan Anggaran (IKPA) merupakan instrumen evaluasi yang dikembangkan oleh Direktorat Jenderal Perbendaharaan untuk mengukur kualitas pelaksanaan anggaran kementerian dan lembaga. Berdasarkan Peraturan Direktur Jenderal Perbendaharaan Nomor PER-5/PB/2024, IKPA didefinisikan sebagai ukuran evaluasi kinerja pelaksanaan anggaran yang memuat indikator-indikator yang relevan, terukur, dan akuntabel sebagai alat kendali kualitas pelaksanaan anggaran. Keberadaan IKPA merupakan implementasi amanat Undang-Undang Nomor 1 Tahun 2004 tentang Perbendaharaan Negara dan Peraturan Pemerintah Nomor 50 Tahun 2018, dengan pengaturan teknis lebih lanjut dalam Peraturan Menteri Keuangan Nomor 62 Tahun 2023.')]),
        justifiedPara([tr('Penilaian IKPA mencakup tiga aspek, yaitu kualitas perencanaan, kualitas pelaksanaan, dan kualitas hasil, yang dioperasionalkan melalui tujuh indikator dengan bobot masing-masing: Revisi DIPA (5%), Deviasi Halaman III DIPA (15%), Penyerapan Anggaran (30%), Belanja Kontraktual (15%), Penyelesaian Tagihan (15%), Pengelolaan Uang Persediaan (5%), dan Capaian Output (15%) (PER-5/PB/2024). Indikator Deviasi Halaman III DIPA memiliki signifikansi khusus dalam penelitian ini karena mengukur akurasi perencanaan realisasi dana atas ketiga jenis belanja, termasuk Belanja Modal; deviasi dihitung sebagai persentase simpangan antara RPD dan realisasi aktual dengan formula: Deviasi = (|Realisasi - RPD| / RPD) * 100%, sesuai Peraturan Dirjen Perbendaharaan Nomor PER-5/PB/2024. Semakin besar simpangan, semakin rendah nilai indikatornya.')]),
        justifiedPara([tr('Nugroho '), tri('et al.'), tr(' (2023) menemukan bahwa akurasi RPD berkorelasi positif dan signifikan dengan nilai IKPA total, dan satuan kerja yang konsisten menjaga deviasi rendah cenderung menunjukkan kinerja pelaksanaan anggaran yang lebih baik secara keseluruhan. Sholawatunnisa dan Supriyanto (2025) menunjukkan bahwa Deviasi Halaman III DIPA secara konsisten menjadi indikator dengan nilai terendah dalam profil IKPA satuan kerja, sehingga membutuhkan perhatian khusus, terutama pada Belanja Modal yang termin realisasinya paling sering bergeser.')]),
        heading2('2.2  Ringkasan Penelitian Terdahulu'),
        justifiedPara([tr('Kajian terhadap pelaksanaan anggaran dan deviasi realisasi telah menarik perhatian sejumlah peneliti seiring menguatnya dorongan penganggaran berbasis kinerja di Indonesia. Bagian ini meringkas lima penelitian terdahulu yang relevan beserta kontribusinya, dengan penekanan pada keterkaitannya terhadap pelaksanaan anggaran Belanja Modal.')]),
        justifiedPara([tr('Ratnasari (2022) mengkaji faktor-faktor penyebab deviasi antara RPD dengan realisasi belanja satuan kerja melalui pendekatan kualitatif, dan menemukan bahwa kualitas sumber daya manusia pengelola keuangan, kematangan perencanaan, serta revisi DIPA yang tidak terarah merupakan penyebab utama deviasi. Temuan ini relevan bagi pelaksanaan anggaran Belanja Modal yang menuntut pejabat pengadaan bersertifikat dan estimasi harga yang akurat dalam menyusun rencana penarikan dana.')]),
        justifiedPara([tr('Manangin '), tri('et al.'), tr(' (2023) meneliti faktor-faktor yang memengaruhi nilai IKPA satuan kerja di wilayah KPPN Manado menggunakan pendekatan kuantitatif melalui survei dan analisis regresi, dan mengidentifikasi kompetensi sumber daya manusia, pemahaman regulasi penganggaran, serta komitmen pimpinan sebagai determinan utama. Faktor komitmen pimpinan dan kompetensi tersebut berpengaruh langsung terhadap efektivitas pelaksanaan Belanja Modal yang sarat pengambilan keputusan kontraktual.')]),
        justifiedPara([tr('Hanafi dan Wulandari (2023) melakukan analisis pengelompokan ('), tri('clustering'), tr(') terhadap profil IKPA satuan kerja menggunakan metode '), tri('Fuzzy C-Means'), tr(' terhadap data ratusan satuan kerja, dan menemukan bahwa satuan kerja rumpun penegakan hukum secara konsisten membentuk kluster dengan nilai rendah pada indikator deviasi. Temuan ini memberikan pijakan empiris bahwa Rudenim, sebagai satuan kerja penegakan keimigrasian, berisiko tinggi mengalami deviasi, termasuk pada pelaksanaan Belanja Modal.')]),
        justifiedPara([tr('Nugroho '), tri('et al.'), tr(' (2023) mengkaji hubungan antara akurasi RPD dengan nilai IKPA total melalui studi kasus pada 20 satuan kerja di Jawa Tengah dengan pendekatan kuantitatif-kualitatif, dan menemukan korelasi positif yang signifikan. Akurasi RPD untuk Belanja Modal yang bersifat kontraktual lebih sulit dicapai dibandingkan Belanja Pegawai dan Belanja Barang, sehingga temuan ini memotivasi penelaahan yang lebih mendalam pada belanja kontraktual.')]),
        justifiedPara([tr('Sholawatunnisa dan Supriyanto (2025) mengembangkan sistem peringatan dini ('), tri('early warning system'), tr(') deviasi anggaran menggunakan model SARIMA pada data deret waktu realisasi anggaran di lingkup Kanwil DJPb Nusa Tenggara Barat, dan menemukan bahwa deviasi memiliki komponen musiman yang dapat diidentifikasi dan dimodelkan. Pola musiman tersebut, terutama pada triwulan III\u2013IV, sangat khas pada Belanja Modal yang termin pembayarannya bergeser mengikuti progres fisik pekerjaan.')]),
        justifiedPara([tr('Dari kelima penelitian tersebut dapat diidentifikasi tiga kesenjangan yang menjadi justifikasi akademis penelitian ini. Pertama, dari sisi objek, belum terdapat studi yang secara khusus mengkaji pelaksanaan anggaran Belanja Modal pada Rudenim atau UPT detensi imigrasi mana pun. Kedua, dari sisi pendekatan, penelitian terdahulu dominan kuantitatif atau mengkaji lintas satuan kerja secara agregat, sehingga belum ada kajian kualitatif-deskriptif yang mendalami pelaksanaan anggaran satu satuan kerja tunggal secara komprehensif. Ketiga, dari sisi fokus, penelitian terdahulu mengkaji IKPA secara agregat tanpa memilah per jenis belanja, sehingga belum ada studi yang secara spesifik membedah pelaksanaan anggaran Belanja Modal sebagai jenis belanja yang paling kompleks dan kontraktual. Ringkasan kelima penelitian beserta relevansinya disajikan pada Tabel 2.1.')]),

        // Tabel 2.1
        tableCaptionCentered('Tabel 2.1 Ringkasan Penelitian Terdahulu dan Relevansinya dengan Pelaksanaan Anggaran Belanja Modal'),
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [500, 2000, 2000, 2166, 2000],
          rows: [
            new TableRow({
              children: [
                cellPara('No.', { width: 500, bold: true, center: true }),
                cellPara('Peneliti', { width: 2000, bold: true, center: true }),
                cellPara('Judul Penelitian', { width: 2000, bold: true, center: true }),
                cellPara('Hasil Penelitian', { width: 2166, bold: true, center: true }),
                cellPara('Relevansi dengan Penelitian Ini', { width: 2000, bold: true, center: true }),
              ]
            }),
            new TableRow({
              children: [
                cellPara('1', { width: 500, center: true }),
                cellPara('Ratnasari (2022)', { width: 2000 }),
                cellPara('Menilik Penyebab Deviasi antara Rencana dengan Realisasi Belanja Satuan Kerja Kementerian/Lembaga', { width: 2000 }),
                cellPara('Kualitas SDM, kematangan perencanaan, dan revisi DIPA menjadi penyebab utama deviasi RPD\u2013realisasi belanja satker.', { width: 2166 }),
                cellPara('Dasar teoritis penyebab deviasi; relevan untuk Belanja Modal yang menuntut kompetensi teknis tinggi.', { width: 2000 }),
              ]
            }),
            new TableRow({
              children: [
                cellPara('2', { width: 500, center: true }),
                cellPara('Manangin, Tinangon, & Gamaliel (2023)', { width: 2000 }),
                cellPara('Faktor-Faktor yang Memengaruhi Pencapaian Nilai IKPA Satuan Kerja di Lingkup KPPN Manado', { width: 2000 }),
                cellPara('Kompetensi SDM, pemahaman regulasi, dan komitmen pimpinan berpengaruh signifikan terhadap nilai IKPA satker.', { width: 2166 }),
                cellPara('Mendukung pentingnya kapasitas pejabat pengadaan dan PPK dalam pelaksanaan Belanja Modal.', { width: 2000 }),
              ]
            }),
            new TableRow({
              children: [
                cellPara('3', { width: 500, center: true }),
                cellPara('Hanafi & Wulandari (2023)', { width: 2000 }),
                cellPara('Pengelompokan Satuan Kerja Berdasarkan Delapan Indikator IKPA Reformulasi 2022', { width: 2000 }),
                cellPara('Satker rumpun penegakan hukum konsisten lemah pada indikator deviasi; Rudenim sebagai satker penegakan hukum berisiko tinggi.', { width: 2166 }),
                cellPara('Pijakan empiris bahwa Rudenim rentan deviasi Belanja Modal; justifikasi fokus penelitian.', { width: 2000 }),
              ]
            }),
            new TableRow({
              children: [
                cellPara('4', { width: 500, center: true }),
                cellPara('Nugroho et al. (2023)', { width: 2000 }),
                cellPara('Evaluasi Implementasi IKPA: Studi Kasus 20 Satuan Kerja di Jawa Tengah', { width: 2000 }),
                cellPara('Terdapat korelasi positif signifikan antara akurasi RPD dan nilai IKPA total; akurasi RPD Belanja Modal lebih sulit dicapai.', { width: 2166 }),
                cellPara('Memperkuat urgensi menganalisis deviasi RPD Belanja Modal secara spesifik.', { width: 2000 }),
              ]
            }),
            new TableRow({
              children: [
                cellPara('5', { width: 500, center: true }),
                cellPara('Sholawatunnisa & Supriyanto (2025)', { width: 2000 }),
                cellPara('Early Warning System Deviasi Anggaran Berbasis Model SARIMA pada IKPA Kanwil DJPb NTB', { width: 2000 }),
                cellPara('Deviasi anggaran memiliki pola musiman yang dapat dimodelkan secara statistik; pola triwulan III\u2013IV khas pada Belanja Modal.', { width: 2166 }),
                cellPara('Mengonfirmasi pola struktural deviasi Belanja Modal; mendorong eksplorasi kualitatif penyebabnya.', { width: 2000 }),
              ]
            }),
          ]
        }),
        tableSource('Sumber: Disusun peneliti berdasarkan kajian literatur (2026).'),

        heading2('2.3  Proposisi Penelitian'),
        justifiedPara([tr('Penelitian ini merupakan penelitian kualitatif-deskriptif yang tidak menguji hipotesis statistik. Namun, berdasarkan landasan teori dan penelitian terdahulu, dapat dirumuskan proposisi penelitian sebagai berikut.')]),
        justifiedPara([tr('Pertama, regulasi pelaksanaan anggaran yang diatur dalam PMK 62/2023 memiliki hubungan langsung dengan kualitas pelaksanaan Belanja Modal pada satuan kerja. Kepatuhan terhadap mekanisme perencanaan (RPD Halaman III DIPA), pelaksanaan (pengadaan, kontrak, BAST), dan pelaporan (SPP\u2013SPM\u2013SP2D) yang ditetapkan regulasi akan memengaruhi tingkat deviasi antara rencana dan realisasi anggaran.')]),
        justifiedPara([tr('Kedua, faktor-faktor internal satuan kerja\u2014meliputi kualitas SDM pengadaan, kematangan perencanaan RPD, dan komitmen pimpinan\u2014berhubungan dengan terjadinya deviasi pelaksanaan anggaran Belanja Modal. Semakin rendah kapasitas perencanaan dan kompetensi pengadaan, semakin besar potensi deviasi antara RPD dan realisasi.')]),
        justifiedPara([tr('Ketiga, deviasi pelaksanaan anggaran Belanja Modal berhubungan dengan penurunan nilai Indikator Kinerja Pelaksanaan Anggaran (IKPA) satuan kerja, yang selanjutnya memengaruhi akuntabilitas dan reputasi satuan kerja di hadapan Kementerian Keuangan selaku prinsipal dalam hubungan keagenan.')]),
        heading2('2.4  Kerangka Penelitian'),
        justifiedPara([tr('Adapun kerangka pemikiran pada penelitian ini yaitu:')]),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80, before: 240, line: 480 },
          children: [tri('Gambar 2.1 Kerangka Penelitian')]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240, before: 80, line: 480 },
          children: [
            new ImageRun({
              data: fs.readFileSync(__dirname + '/kerangka_penelitian.png'),
              type: 'png',
              transformation: {
                width: 540,
                height: 180,
              },
            }),
          ]
        }),

      ]
    },
    // ═══════════════════════════════════════════════════════════════
    // SECTION 7: BAB III
    // ═══════════════════════════════════════════════════════════════
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: M_TOP, right: M_RIGHT, bottom: M_BOTTOM, left: M_LEFT },
          pageNumbers: { formatType: NumberFormat.DECIMAL }
        },
        titlePage: true
      },
      headers: chapterPageSetup.headers,
      footers: chapterPageSetup.footers,
      children: [

        centered('BAB III', { bold: true, size: 24, spaceAfter: 0 }),
        centered('METODE PENELITIAN', { bold: true, size: 24, spaceAfter: 240 }),
        heading2('3.1  Bentuk dan Subjek Penelitian'),
        justifiedPara([tr('Metode yang digunakan dalam penelitian ini adalah pendekatan kualitatif dengan jenis penelitian deskriptif. Creswell (2014, hlm. 4) mendefinisikan penelitian kualitatif sebagai '), tri('an approach for exploring and understanding the meaning individuals or groups ascribe to a social or human problem'), tr(', yang menegaskan bahwa kekuatan pendekatan ini terletak pada kemampuannya menelusuri makna dan proses di balik suatu fenomena. Dalam konteks penelitian ini, pendekatan kualitatif deskriptif memungkinkan peneliti memahami secara mendalam bagaimana para pengelola anggaran Rudenim Pontianak melaksanakan anggaran belanja, khususnya Belanja Modal, mulai dari perencanaan hingga pencairan, apa yang terjadi saat rencana berbenturan dengan realitas operasional, dan mengapa deviasi pelaksanaan anggaran terjadi secara berulang.')]),
        justifiedPara([tr('Pemilihan pendekatan kualitatif didasarkan pada karakter ketiga rumusan masalah yang hendak dijawab. RM 1 mengarahkan pada pertanyaan deskriptif tentang bagaimana implementasi pelaksanaan anggaran belanja berlangsung, RM 2 bersifat eksplanatif tentang penyebab deviasi, dan RM 3 bersifat evaluatif tentang dampak deviasi; ketiganya menuntut pemahaman atas makna, proses, dan mekanisme yang tidak dapat ditangkap secara memadai melalui pengukuran variabel statistik semata. Rudenim Pontianak sebagai satu unit kasus tunggal tidak memungkinkan generalisasi statistik, dan pertanyaan mengenai penyebab deviasi bersifat eksploratif yang belum memiliki hipotesis mapan untuk diuji (Creswell, 2014, hlm. 14\u201317).')]),
        justifiedPara([tr('Penelitian ini dilaksanakan di Rumah Detensi Imigrasi (Rudenim) Pontianak, yang beralamat di Jalan Adi Sucipto KM. 15, Kabupaten Kubu Raya, Provinsi Kalimantan Barat. Rudenim Pontianak merupakan Unit Pelaksana Teknis (UPT) di bawah Direktorat Jenderal Imigrasi. Perlu dicatat bahwa selama periode penelitian, Rudenim Pontianak mengalami transisi kelembagaan: pada Tahun Anggaran 2023 dan 2024, satker ini berada di bawah Kementerian Hukum dan Hak Asasi Manusia (kode satker 664650), kemudian beralih ke Kementerian Imigrasi dan Pemasyarakatan (kode satker 692965) pada Tahun Anggaran 2025 seiring pembentukan kementerian baru berdasarkan Peraturan Presiden Nomor 139 Tahun 2024. Periode data yang dikaji mencakup Tahun Anggaran 2023, 2024, dan 2025, rentang tiga tahun yang memberikan variasi antar-tahun yang cukup untuk membedakan pola deviasi persisten dari anomali, serta mencakup periode transisi struktural kelembagaan. Data penelitian bersumber dari dua jenis: data primer yang diperoleh melalui '), tri('in-depth interview'), tr(' dengan para pejabat pengelola anggaran, dan data sekunder yang bersumber dari dokumen anggaran (DIPA, LRA, laporan IKPA, dokumen kontrak pengadaan Belanja Modal, dan peraturan terkait).')]),
        justifiedPara([tr('Pendekatan kualitatif secara khusus relevan dengan fokus penelitian pada pelaksanaan anggaran Belanja Modal yang melibatkan banyak aktor dan proses yang sulit ditangkap secara kuantitatif. Belanja Modal (kode akun 53) memiliki karakteristik kontraktual dan multi-pihak yang berbeda dari Belanja Pegawai (kode 51) maupun Belanja Barang (kode 52): pelaksanaannya melibatkan mekanisme pengadaan barang/jasa pemerintah (Perpres 16/2018 jo. Perpres 12/2021), kontrak dengan penyedia, tahapan progres fisik, dan serangkaian proses verifikasi dokumen dari SPP hingga SP2D. Kompleksitas interaksi antar-aktor, meliputi PPK, Pokja Pemilihan, penyedia, PPSPM, hingga KPPN, memerlukan eksplorasi kualitatif mendalam yang mampu menangkap dinamika proses, hambatan, dan konteks keputusan yang melatarbelakangi deviasi.')]),
        justifiedPara([tr('Untuk memperoleh data primer yang kredibel dan mendalam mengenai pelaksanaan anggaran Belanja Modal, peneliti menetapkan informan kunci yang terlibat langsung dalam siklus perencanaan dan pelaksanaan anggaran di Rumah Detensi Imigrasi Pontianak. Pemilihan informan dilakukan menggunakan teknik '), tri('purposive sampling'), tr(' (Patton, 2015) berdasarkan kriteria substantif sebagai berikut:')]),
        numberedItemRuns([tr('Memiliki posisi struktural atau fungsional yang terkait langsung dengan perencanaan dan/atau pelaksanaan anggaran Belanja Modal Rudenim Pontianak.')]),
        numberedItemRuns([tr('Memiliki masa kerja minimal satu tahun pada posisi tersebut selama periode Tahun Anggaran 2023\u20132025.')]),
        numberedItemRuns([tr('Bersedia diwawancara dan direkam sebagaimana dinyatakan dalam lembar '), tri('informed consent'), tr('.')]),
        justifiedPara([tr('Berdasarkan kriteria tersebut, teridentifikasi enam informan target yang disajikan pada Tabel 3.1.')]),

        // Tabel 3.1
        tableCaptionCentered('Tabel 3.1 Daftar Informan Target Penelitian'),
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [800, 2500, 5366],
          rows: [
            new TableRow({
              children: [
                cellPara('Kode', { width: 800, bold: true, center: true }),
                cellPara('Posisi/Jabatan', { width: 2500, bold: true, center: true }),
                cellPara('Justifikasi Keterlibatan', { width: 5366, bold: true, center: true }),
              ]
            }),
            new TableRow({ children: [cellPara('KPA', { width: 800 }), cellPara('Kuasa Pengguna Anggaran (Kepala Rudenim Pontianak)', { width: 2500 }), cellPara('Otoritas tertinggi pengelolaan anggaran satker; penetapan DIPA dan RPD; perspektif strategis pelaksanaan Belanja Modal', { width: 5366 })] }),
            new TableRow({ children: [cellPara('PPK', { width: 800 }), cellPara('Pejabat Pembuat Komitmen', { width: 2500 }), cellPara('Penanggung jawab komitmen pengadaan Belanja Modal; touchpoint utama kontrak, BAST, dan SPP-LS', { width: 5366 })] }),
            new TableRow({ children: [cellPara('PPSPM', { width: 800 }), cellPara('Pejabat Penandatangan SPM', { width: 2500 }), cellPara('Penanggung jawab pencairan dana; verifikasi SPM; touchpoint teknis SAKTI/OM-SPAN', { width: 5366 })] }),
            new TableRow({ children: [cellPara('BPG', { width: 800 }), cellPara('Bendahara Pengeluaran', { width: 2500 }), cellPara('Pelaksana operasional kas; akses penuh realisasi harian; perspektif teknis-operasional', { width: 5366 })] }),
            new TableRow({ children: [cellPara('SRKA', { width: 800 }), cellPara('Staf Penyusun Rencana Kerja dan Anggaran', { width: 2500 }), cellPara('Pelaksana teknis penyusunan RPD bulanan; touchpoint perencanaan anggaran', { width: 5366 })] }),
            new TableRow({ children: [cellPara('PBJ', { width: 800 }), cellPara('Pejabat Pengadaan/Pejabat Fungsional Pengadaan Barang/Jasa', { width: 2500 }), cellPara('Pelaksana pemilihan penyedia untuk paket Belanja Modal; perspektif operasional pengadaan', { width: 5366 })] }),
          ]
        }),
        tableSource('Sumber: Disusun berdasarkan struktur organisasi pengelola keuangan dan pengadaan Rudenim Pontianak.'),
        heading2('3.2  Teknik Pengumpulan Data'),
        justifiedPara([tr('Penelitian ini menggunakan dua teknik pengumpulan data utama, yaitu '), tri('in-depth interview'), tr(' (wawancara mendalam) dan studi dokumentasi, yang saling melengkapi untuk menjawab ketiga rumusan masalah. Kombinasi kedua teknik ini memungkinkan triangulasi sumber secara struktural: data primer dari wawancara memberikan kedalaman interpretatif dan eksplanatif, sementara data sekunder dari dokumen menyediakan landasan faktual yang terverifikasi sistem.')]),
        heading3('3.2.1  In-depth Interview (Wawancara Mendalam)'),
        justifiedPara([tri('In-depth interview'), tr(' (wawancara mendalam) semi-terstruktur dipilih sebagai teknik pengumpulan data primer utama. Sebagaimana dijelaskan Creswell (2014, hlm. 190\u2013192), wawancara memungkinkan peneliti memperoleh informasi yang tidak dapat diamati secara langsung, termasuk pandangan, perspektif, dan penjelasan atas kejadian masa lalu. Dalam konteks pelaksanaan anggaran Belanja Modal, proses pengambilan keputusan pengadaan, dinamika koordinasi antar-pejabat keuangan, dan hambatan yang menyebabkan deviasi merupakan informasi yang hanya dapat diperoleh melalui narasi para pelakunya. Format semi-terstruktur dipilih mengikuti '), tri('general interview guide approach'), tr(' (Patton, 2015, hlm. 438\u2013444): pedoman pertanyaan inti disiapkan untuk memastikan semua topik yang berkaitan dengan tiga RM terliputi, namun bersifat fleksibel untuk menggali tema yang muncul secara spontan.')]),
        justifiedPara([tr('Aspek etika penelitian dijamin melalui tiga mekanisme: pertama, izin institusional melalui surat pengantar dari institusi pendidikan kepada Kepala Rudenim Pontianak; kedua, '), tri('informed consent'), tr(' tertulis yang menjelaskan tujuan penelitian, prosedur, hak menolak menjawab, dan hak menarik diri; serta ketiga, anonimisasi identitas informan dalam laporan penelitian; seluruh kutipan menggunakan kode jabatan (KPA, PPK, PPSPM, BPG, SRKA, PBJ), bukan nama atau NIP.')]),
        justifiedPara([tr('Secara operasional, pelaksanaan wawancara mendalam dilakukan secara semi-terstruktur dengan durasi berkisar antara 60 hingga 90 menit per sesi. Wawancara diselenggarakan di ruang tertutup pada kantor Rudenim Pontianak atau lokasi alternatif lain demi kenyamanan informan. Seluruh proses wawancara direkam menggunakan alat perekam audio atas persetujuan tertulis dari informan. Rekaman audio tersebut kemudian ditranskripsikan secara verbatim dalam Bahasa Indonesia dengan tetap mempertahankan istilah-istilah teknis penganggaran. Sebagai bentuk verifikasi keabsahan data (Lincoln & Guba, 1985), transkrip hasil wawancara dikirimkan kembali kepada informan dalam waktu tujuh hari untuk dilakukan pengecekan ulang dan konfirmasi kebenarannya ('), tri('member check'), tr(').')]),
        heading3('3.2.2  Studi Dokumentasi'),
        justifiedPara([tr('Studi dokumentasi dilaksanakan sebagai teknik pengumpulan data sekunder yang berfungsi sebagai bukti objektif yang dapat diverifikasi secara sistem. Apabila narasi informan dalam wawancara berkesesuaian dengan data dalam dokumen, keyakinan atas temuan meningkat; apabila terdapat inkonsistensi, hal tersebut menjadi bahan klarifikasi pada wawancara lanjutan. Untuk memastikan keaslian dan kredibilitas, peneliti mengutamakan dokumen yang memiliki tanda tangan digital BSrE/BSSN atau dokumen yang ditarik langsung dari sistem OM-SPAN dan SAKTI yang teraudit. Daftar dokumen yang akan diakses disajikan pada Tabel 3.2.')]),

        // Tabel 3.1
        tableCaptionCentered('Tabel 3.2 Daftar Dokumen Studi Dokumentasi'),
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [800, CONTENT_W - 800],
          rows: [
            new TableRow({ children: [cellPara('No', { width: 800, bold: true, center: true }), cellPara('Dokumen', { width: CONTENT_W - 800, bold: true, center: true })] }),
            new TableRow({ children: [cellPara('1', { width: 800, center: true }), cellPara('DIPA Rudenim Pontianak TA 2023, 2024, 2025 (termasuk Halaman III RPD)', { width: CONTENT_W - 800 })] }),
            new TableRow({ children: [cellPara('2', { width: 800, center: true }), cellPara('Laporan Realisasi Anggaran (LRA) per jenis belanja', { width: CONTENT_W - 800 })] }),
            new TableRow({ children: [cellPara('3', { width: 800, center: true }), cellPara('Laporan IKPA per semester (OM-SPAN/MEBE - Monitoring and Evaluation of Budget Execution)', { width: CONTENT_W - 800 })] }),
            new TableRow({ children: [cellPara('4', { width: 800, center: true }), cellPara('Dokumen kontrak pengadaan Belanja Modal dan BAST', { width: CONTENT_W - 800 })] }),
            new TableRow({ children: [cellPara('5', { width: 800, center: true }), cellPara('Dokumen RKA-K/L Ditjen Imigrasi', { width: CONTENT_W - 800 })] }),
            new TableRow({ children: [cellPara('6', { width: 800, center: true }), cellPara('PMK 62/2023; Perpres 16/2018 jo. Perpres 12/2021; PER-5/PB/2024', { width: CONTENT_W - 800 })] }),
            new TableRow({ children: [cellPara('7', { width: 800, center: true }), cellPara('LKjIP Rudenim Pontianak TA 2023\u20132025', { width: CONTENT_W - 800 })] }),
          ]
        }),
        tableSource('Sumber: Disusun berdasarkan kebutuhan data untuk menjawab RM 1, RM 2, dan RM 3.'),

        heading3('3.2.3  Observasi Non-Partisipatif'),
        justifiedPara([tr('Sebagai teknik pelengkap, observasi non-partisipatif dilaksanakan untuk menangkap dimensi alur kerja unit keuangan Rudenim Pontianak yang tidak selalu terekam dalam dokumen maupun terungkap dalam wawancara. Peneliti berposisi sebagai pengamat eksternal, hadir di '), tri('setting'), tr(' organisasi tetapi tidak terlibat dalam proses pengambilan keputusan (Creswell, 2014, hlm. 188\u2013190). Objek observasi meliputi alur kerja penyusunan RPD, proses verifikasi SPP-SPM, dan koordinasi internal antar-pejabat pengelola anggaran khususnya terkait pengadaan Belanja Modal.')]),
        heading2('3.3  Teknik Pengolahan dan Analisis Data'),
        justifiedPara([tr('Sub-bab ini menguraikan tiga komponen teknik pengolahan dan analisis data: pertama, alur pelaksanaan anggaran Belanja Modal yang disajikan sebagai '), tri('flowchart'), tr(' kerangka analisis berbasis PMK 62/2023; kedua, model analisis interaktif Miles dan Huberman (1994) sebagai prosedur analisis data kualitatif; dan ketiga, uji keabsahan data berdasarkan kriteria Lincoln dan Guba (1985).')]),
        heading3('3.3.1  Alur Pelaksanaan Anggaran: Perencanaan, Penyusunan, dan Pelaksanaan (Flowchart)'),
        justifiedPara([tr('Untuk memberikan kerangka analisis yang sistematis terhadap pelaksanaan anggaran Belanja Modal, penelitian ini menggunakan '), tri('flowchart'), tr(' yang menggambarkan tiga fase utama berdasarkan PMK Nomor 62 Tahun 2023, yakni Perencanaan, Penyusunan, dan Pelaksanaan, dengan penyesuaian khusus untuk Belanja Modal yang melibatkan mekanisme pengadaan barang/jasa berdasarkan Perpres Nomor 16 Tahun 2018 sebagaimana diubah dengan Perpres Nomor 12 Tahun 2021. '), tri('Flowchart'), tr(' ini berfungsi sebagai peta analitis untuk mengidentifikasi titik-titik kritis pada setiap fase yang berpotensi menyebabkan deviasi antara rencana dan realisasi anggaran Belanja Modal.')]),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80, before: 240, line: 480 },
          children: [tri('Gambar 3.1 Alur Pelaksanaan Anggaran Belanja')]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80, line: 480 },
          children: [tr('[Flowchart dimasukkan manual]')]
        }),
        tableSource('Sumber: Diolah oleh peneliti berdasarkan PMK 62/2023 dan Perpres 16/2018 jo. Perpres 12/2021'),
        justifiedPara([tr('Pada Fase Perencanaan (T-1), titik kritis deviasi terutama bersumber dari ketidakakuratan estimasi harga: harga referensi e-katalog yang digunakan saat penyusunan RKA-K/L dapat berbeda signifikan dari harga pasar aktual pada saat pelaksanaan pengadaan, sehingga memaksa revisi atau bahkan pembatalan paket Belanja Modal. Selain itu, TOR dan RAB yang tidak cukup mendetail dalam spesifikasi teknis menimbulkan gap antara kebutuhan unit teknis dan penawaran penyedia pada tahap pengadaan. Asumsi waktu pengadaan yang terlalu optimistik, misalnya mengasumsikan kontrak sudah ditandatangani pada Q1 padahal proses tender memerlukan waktu minimal tiga bulan, juga berkontribusi pada ketidaksesuaian antara RPD dan realisasi.')]),
        justifiedPara([tr('Pada Fase Penyusunan Dokumen Pelaksanaan, titik kritis utama terletak pada penyusunan RPD Halaman III DIPA yang bersifat '), tri('overly optimistic'), tr('. Proyeksi kebutuhan kas bulanan untuk Belanja Modal sering kali mengasumsikan bahwa pengadaan dimulai sejak awal tahun anggaran, padahal pada kenyataannya proses tender, evaluasi, dan penetapan pemenang memerlukan waktu yang melampaui asumsi awal. Selain itu, RPD belum mempertimbangkan '), tri('slack'), tr(' waktu untuk kelengkapan dokumen pihak ketiga seperti akta perusahaan, perizinan, dan sertifikasi yang diperlukan dalam proses pengadaan Belanja Modal.')]),
        justifiedPara([tr('Pada Fase Pelaksanaan Anggaran Belanja Modal, fase yang memiliki titik kritis paling banyak, sumber deviasi meliputi: tender gagal atau diulang yang memaksa pergeseran '), tri('timeline'), tr(' realisasi (sebagaimana diatur Perpres 16/2018 Pasal 38); keterlambatan progres fisik akibat faktor cuaca, '), tri('supply chain'), tr(', atau kapasitas penyedia lokal; tertundanya BAST karena pekerjaan belum mencapai progres yang disyaratkan; ketidaklengkapan dokumen tagihan dari penyedia (faktur, kuitansi, dokumen pajak) yang mengakibatkan revisi SPP; ketatnya proses verifikasi PPSPM sebagai amanat akuntabilitas yang menjadi '), tri('bottleneck'), tr(' waktu; serta pemblokiran anggaran di tengah tahun yang menggagalkan rencana realisasi yang sudah dijadwalkan. Keseluruhan titik kritis ini menjadi fokus eksplorasi dalam wawancara mendalam, khususnya untuk menjawab RM 2 (penyebab deviasi) dan RM 3 (dampak deviasi).')]),
        heading3('3.3.2  Model Analisis Miles dan Huberman (1994)'),
        justifiedPara([tr('Analisis data dalam penelitian ini dilaksanakan menggunakan '), tri('interactive model'), tr(' yang dikembangkan Miles dan Huberman (1994, hlm. 10\u201312). Model ini dipilih karena sesuai dengan karakter penelitian kualitatif yang prosesnya bersifat iteratif dan simultan: pengumpulan data, reduksi data, penyajian data, dan penarikan kesimpulan berlangsung dalam siklus yang saling mengisi. Temuan awal mendorong pengumpulan data tambahan, reduksi yang sedang berjalan memengaruhi fokus pengumpulan berikutnya, dan kesimpulan tentatif selalu diuji ulang terhadap data baru.')]),
        justifiedPara([tr('Tahap pertama adalah reduksi data, yakni proses memilih, memfokuskan, menyederhanakan, mengabstraksi, dan mentransformasi data mentah menjadi satuan-satuan makna yang dapat dianalisis (Miles dan Huberman, 1994, hlm. 10\u201311). Reduksi dilaksanakan melalui transkripsi verbatim rekaman wawancara, kemudian pengkodean bertahap dari '), tri('open coding'), tr(' (label pada unit makna), '), tri('axial coding'), tr(' (pengelompokan ke kategori yang dipetakan ke faktor-faktor deviasi pada kerangka penelitian), hingga '), tri('selective coding'), tr(' (identifikasi kategori inti yang menjawab tiap RM).')]),
        justifiedPara([tr('Tahap kedua adalah penyajian data ('), tri('data display'), tr('), yakni mengorganisasikan informasi yang telah direduksi ke dalam bentuk matriks, tabel, dan diagram yang memungkinkan penarikan kesimpulan. Penelitian ini menggunakan matriks faktor-informan-bukti dokumen, matriks pola deviasi per tahun per bulan kritis, serta diagram hubungan antar-faktor yang memetakan kausalitas dari penyebab menuju deviasi dan dari deviasi menuju dampak.')]),
        justifiedPara([tr('Tahap ketiga adalah penarikan kesimpulan dan verifikasi. Penarikan kesimpulan bersifat iteratif, dimulai sejak pengkodean awal sebagai hipotesis kerja yang terus diuji melalui '), tri('pattern matching'), tr(' terhadap kerangka konseptual dan data baru. Verifikasi dilaksanakan melalui konfrontasi balik ke data mentah, '), tri('member check'), tr(' dengan informan, triangulasi lintas-sumber dan lintas-metode, serta '), tri('peer debriefing'), tr(' bersama dosen pembimbing.')]),
        heading3('3.3.3  Uji Keabsahan Data (Lincoln dan Guba, 1985)'),
        justifiedPara([tr('Kualitas penelitian kualitatif dinilai melalui empat kriteria yang diajukan Lincoln dan Guba (1985, hlm. 289\u2013331) sebagai alternatif dari kriteria positivistik: '), tri('credibility'), tr(', '), tri('transferability'), tr(', '), tri('dependability'), tr(', dan '), tri('confirmability'), tr('.')]),
        justifiedPara([tri('Credibility'), tr(' (kredibilitas) dijamin melalui dua strategi utama. Pertama, triangulasi sumber: setiap temuan substantif dikonfirmasi dari minimal tiga informan yang berbeda posisinya; misalnya, apakah kesimpulan mengenai faktor penyebab deviasi Belanja Modal dikonfirmasi oleh KPA, PPK, dan Pejabat Pengadaan secara independen. Temuan wawancara juga dicocokkan dengan bukti dari dokumen anggaran dan catatan observasi (triangulasi metode). Kedua, '), tri('member check'), tr(': transkrip wawancara dan ringkasan temuan per informan dikonfirmasi ulang kepada informan bersangkutan dalam tujuh hari setelah wawancara; koreksi yang diberikan diintegrasikan ke dalam analisis.')]),
        justifiedPara([tri('Transferability'), tr(' (keteralihan) dipenuhi melalui penyediaan '), tri('thick description'), tr(', deskripsi konteks yang cukup kaya dan terperinci mengenai karakteristik Rudenim Pontianak (geografis, struktural, anggaran, dan operasional), sehingga pembaca dapat menilai relevansi temuan untuk konteks lain yang memiliki karakteristik serupa, misalnya Rudenim lain di wilayah perbatasan atau satker UPT lain dengan tingkat ketidakpastian operasional tinggi.')]),
        justifiedPara([tri('Dependability'), tr(' (ketergantungan) dijamin melalui '), tri('audit trail'), tr(': pendokumentasian sistematis seluruh keputusan metodologis, meliputi alasan pemilihan informan, perubahan pedoman wawancara, evolusi tema dalam pengkodean, yang tersimpan dalam log metodologis dan dapat diakses oleh auditor eksternal. Dosen pembimbing berperan sebagai auditor primer.')]),
        justifiedPara([tri('Confirmability'), tr(' (kepastian) dipenuhi melalui '), tri('confirmability audit'), tr(': setiap pernyataan kesimpulan dalam laporan penelitian dapat dilacak ke data sumbernya, yaitu kutipan wawancara spesifik (dengan kode informan dan nomor baris transkrip) atau bukti dokumenter spesifik (dengan nama dokumen dan halaman).')]),

      ]
    },
    // ═══════════════════════════════════════════════════════════════
    // SECTION 8: DAFTAR PUSTAKA
    // ═══════════════════════════════════════════════════════════════
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: M_TOP, right: M_RIGHT, bottom: M_BOTTOM, left: M_LEFT },
          pageNumbers: { formatType: NumberFormat.DECIMAL }
        },
        titlePage: true
      },
      headers: chapterPageSetup.headers,
      footers: chapterPageSetup.footers,
      children: [

        centered('DAFTAR PUSTAKA', { bold: true, size: 24, spaceAfter: 240 }),
        daftarPustakaEntry([tr('Creswell, J. W. (2014). '), tri('Research design: Qualitative, quantitative, and mixed methods approaches'), tr(' (4th ed.). SAGE Publications.')]),
        daftarPustakaEntry([tr('Direktorat Jenderal Imigrasi. (2025). '), tri('Rencana kerja dan anggaran Kementerian/Lembaga Direktorat Jenderal Imigrasi Tahun Anggaran 2025'), tr('. Kementerian Imigrasi dan Pemasyarakatan Republik Indonesia.')]),
        daftarPustakaEntry([tr('Direktorat Jenderal Perbendaharaan. (2025). '), tri('Laporan pemantauan kinerja indikator pelaksanaan anggaran satuan kerja kementerian negara/lembaga tahun anggaran 2022\u20132024'), tr('. Kementerian Keuangan Republik Indonesia.')]),
        daftarPustakaEntry([tr('Hanafi, R., & Wulandari, S. (2023). Pengelompokan satuan kerja berdasarkan delapan indikator IKPA reformulasi 2022. '), tri('Jurnal Administrasi dan Kebijakan Publik'), tr(', '), tri('8'), tr('(2), 502\u2013518.')]),
        daftarPustakaEntry([tr('Jensen, M. C., & Meckling, W. H. (1976). Theory of the firm: Managerial behavior, agency costs and ownership structure. '), tri('Journal of Financial Economics'), tr(', '), tri('3'), tr('(4), 305\u2013360. https://doi.org/10.1016/0304-405X(76)90026-X')]),
        daftarPustakaEntry([tr('Lane, J.-E. (2003). '), tri('Management and public organisation: The principal-agent framework'), tr(' ['), tri('Working paper'), tr(']. University of Geneva.')]),
        daftarPustakaEntry([tr('Lincoln, Y. S., & Guba, E. G. (1985). '), tri('Naturalistic inquiry'), tr('. SAGE Publications.')]),
        daftarPustakaEntry([tr('Manangin, C., Tinangon, J. J., & Gamaliel, H. (2023). Faktor-faktor yang memengaruhi pencapaian nilai indikator kinerja pelaksanaan anggaran satuan kerja di lingkup KPPN Manado. '), tri('Jurnal Goodwill'), tr(', '), tri('14'), tr('(2), 535\u2013550.')]),
        daftarPustakaEntry([tr('Mardiasmo. (2018). '), tri('Akuntansi sektor publik'), tr(' (Edisi terbaru). Andi.')]),
        daftarPustakaEntry([tr('Miles, M. B., & Huberman, A. M. (1994). '), tri('Qualitative data analysis: An expanded sourcebook'), tr(' (2nd ed.). SAGE Publications.')]),
        daftarPustakaEntry([tr('Nugroho, B., Widodo, T., & Pratama, R. (2023). Evaluasi implementasi IKPA: Studi kasus 20 satuan kerja di Jawa Tengah. '), tri('Jurnal Keuangan dan Perbendaharaan Negara'), tr(', '), tri('27'), tr('(3), 112\u2013130.')]),
        daftarPustakaEntry([tr('Patton, M. Q. (2015). '), tri('Qualitative research & evaluation methods'), tr(' (4th ed.). SAGE Publications.')]),
        daftarPustakaEntry([tr('Peraturan Direktur Jenderal Perbendaharaan Nomor PER-5/PB/2024 tentang Petunjuk Teknis Penilaian Indikator Kinerja Pelaksanaan Anggaran Kementerian Negara/Lembaga. (2024). Direktorat Jenderal Perbendaharaan, Kementerian Keuangan Republik Indonesia.')]),
        daftarPustakaEntry([tr('Peraturan Menteri Hukum dan Hak Asasi Manusia Republik Indonesia Nomor M.HH-11.OT.01.01 Tahun 2009 tentang Organisasi dan Tata Kerja Rumah Detensi Imigrasi. (2009). Kementerian Hukum dan Hak Asasi Manusia Republik Indonesia.')]),
        daftarPustakaEntry([tr('Peraturan Menteri Keuangan Republik Indonesia Nomor 62 Tahun 2023 tentang Perencanaan Anggaran, Pelaksanaan Anggaran, serta Akuntansi dan Pelaporan Keuangan pada Kementerian Negara/Lembaga. (2023). '), tri('Berita Negara Republik Indonesia Tahun 2023 Nomor 559'), tr('.')]),
        daftarPustakaEntry([tr('Peraturan Pemerintah Nomor 50 Tahun 2018 tentang Perubahan atas Peraturan Pemerintah Nomor 45 Tahun 2013 tentang Tata Cara Pelaksanaan Anggaran Pendapatan dan Belanja Negara. (2018). '), tri('Lembaran Negara Republik Indonesia Tahun 2018 Nomor 229'), tr('.')]),
        daftarPustakaEntry([tr('Peraturan Presiden Republik Indonesia Nomor 12 Tahun 2021 tentang Perubahan atas Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah. (2021). '), tri('Lembaran Negara Republik Indonesia Tahun 2021 Nomor 63'), tr('.')]),
        daftarPustakaEntry([tr('Peraturan Presiden Republik Indonesia Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah. (2018). '), tri('Lembaran Negara Republik Indonesia Tahun 2018 Nomor 33'), tr('.')]),
        daftarPustakaEntry([tr('Peraturan Presiden Republik Indonesia Nomor 139 Tahun 2024 tentang Kementerian Imigrasi dan Pemasyarakatan. (2024). '), tri('Lembaran Negara Republik Indonesia Tahun 2024'), tr('.')]),
        daftarPustakaEntry([tr('Ratnasari, D. (2022). Menilik penyebab deviasi antara rencana dengan realisasi belanja satuan kerja kementerian/lembaga. '), tri('Jurnal Ilmiah Akuntansi dan Keuangan'), tr(', '), tri('11'), tr('(2), 91\u2013101.')]),
        daftarPustakaEntry([tr('Rumah Detensi Imigrasi Pontianak. (2025). '), tri('Database rencana penarikan dana dan realisasi anggaran TA 2023\u20132025'), tr('. Dokumen internal tidak dipublikasikan.')]),
        daftarPustakaEntry([tr('Rumah Detensi Imigrasi Pontianak. (2025). '), tri('Laporan Kinerja Instansi Pemerintah (LKjIP) Rudenim Pontianak Tahun Anggaran 2023, 2024, dan 2025'), tr('. Dokumen internal tidak dipublikasikan.')]),
        daftarPustakaEntry([tr('Sholawatunnisa, N., & Supriyanto, A. (2025). Early warning system deviasi anggaran berbasis model SARIMA pada IKPA Kantor Wilayah DJPb Nusa Tenggara Barat. '), tri('Jurnal Elastisitas'), tr(', '), tri('7'), tr('(1), 19\u201338.')]),
        daftarPustakaEntry([tr('Undang-Undang Republik Indonesia Nomor 1 Tahun 2004 tentang Perbendaharaan Negara. (2004). '), tri('Lembaran Negara Republik Indonesia Tahun 2004 Nomor 5'), tr('.')]),
        daftarPustakaEntry([tr('Undang-Undang Republik Indonesia Nomor 17 Tahun 2003 tentang Keuangan Negara. (2003). '), tri('Lembaran Negara Republik Indonesia Tahun 2003 Nomor 47'), tr('.')]),
        daftarPustakaEntry([tr('Undang-Undang Republik Indonesia Nomor 30 Tahun 2014 tentang Administrasi Pemerintahan. (2014). '), tri('Lembaran Negara Republik Indonesia Tahun 2014 Nomor 292'), tr('.')]),
        daftarPustakaEntry([tr('Undang-Undang Republik Indonesia Nomor 6 Tahun 2011 tentang Keimigrasian. (2011). '), tri('Lembaran Negara Republik Indonesia Tahun 2011 Nomor 52'), tr('.')]),

      ]
    },
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(__dirname + '/makalah_seminar_AJIE_BARIANDONO_2110426823.docx', buffer);
  fs.writeFileSync(__dirname + '/MAKALAH SEMINAR AKUNTANSI_AJIE BARIANDONO_2110426823.docx', buffer);
  console.log('DONE: files saved');
}).catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
