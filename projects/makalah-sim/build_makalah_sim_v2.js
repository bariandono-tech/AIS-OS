'use strict';
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, Header, Footer,
  PositionalTab, PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader,
  TabStopType, TabStopPosition, NumberFormat, ImageRun,
  TableOfContents, SequentialIdentifier
} = require('docx');
const fs = require('fs');
const path = require('path');

// ── LAYOUT CONSTANTS ──────────────────────────────────────────────────
const PAGE_W = 11906;
const PAGE_H = 16838;
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
const borderNone = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };

const bordersHeader = { top: borderSingle, bottom: borderSingle, left: borderNone, right: borderNone };
const bordersMiddle = { top: borderNone, bottom: borderNone, left: borderNone, right: borderNone };
const bordersBottom = { top: borderNone, bottom: borderSingle, left: borderNone, right: borderNone };

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

// Helper for dynamic Heading 1 for chapters (two lines visually but one entry in TOC)
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

// Helper for dynamic Heading 1 for front matter (e.g. KATA PENGANTAR, DAFTAR ISI)
function frontMatterHeader(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 480, after: 240, line: 480 },
    keepNext: true,
    children: [new TextRun({ text: title, bold: true, size: 24, font: 'Times New Roman' })]
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

let currentListRef = 'arabic-numbering';
let currentListRefId = 1;

function resetList() {
  currentListRef = `num-${currentListRefId++}`;
  return [];
}

function numberedItemRuns(runs) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 0, before: 0, line: 480 },
    numbering: { reference: currentListRef, level: 0 },
    children: runs
  });
}

function getPngDimensions(imageName) {
  const filePath = path.join(__dirname, imageName);
  const buffer = fs.readFileSync(filePath);
  const width = buffer.readInt32BE(16);
  const height = buffer.readInt32BE(20);
  return { width, height };
}

function getScaledDimensions(imageName, targetWidth) {
  const { width, height } = getPngDimensions(imageName);
  const scale = targetWidth / width;
  return {
    width: targetWidth,
    height: Math.round(height * scale)
  };
}

function cellPara(text, { width, bold = false, center = false, italic = false, borders = bordersAll, vAlign = VerticalAlign.CENTER } = {}) {
  return new TableCell({
    borders: borders,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    verticalAlign: vAlign,
    children: [new Paragraph({
      alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { after: 0, before: 0, line: 360 },
      children: [new TextRun({ text, font: 'Times New Roman', size: 18, bold, italics: italic })]
    })]
  });
}

function createMutuBakuTable(rowsData) {
  const headerRow = new TableRow({
    children: [
      cellPara('No', { width: 400, bold: true, center: true, borders: bordersHeader }),
      cellPara('Kegiatan', { width: 2100, bold: true, center: true, borders: bordersHeader }),
      cellPara('Pelaksana', { width: 1100, bold: true, center: true, borders: bordersHeader }),
      cellPara('Mutu Baku: Kelengkapan', { width: 1500, bold: true, center: true, borders: bordersHeader }),
      cellPara('Waktu', { width: 600, bold: true, center: true, borders: bordersHeader }),
      cellPara('Output', { width: 1100, bold: true, center: true, borders: bordersHeader }),
      cellPara('Keterangan / Catatan', { width: 1100, bold: true, center: true, borders: bordersHeader }),
    ]
  });

  const tableRows = [headerRow];
  for (let i = 0; i < rowsData.length; i++) {
    const row = rowsData[i];
    const isLast = (i === rowsData.length - 1);
    const rowBorders = isLast ? bordersBottom : bordersMiddle;
    tableRows.push(new TableRow({
      children: [
        cellPara(row.no, { width: 400, center: true, borders: rowBorders }),
        cellPara(row.kegiatan, { width: 2100, borders: rowBorders }),
        cellPara(row.pelaksana, { width: 1100, borders: rowBorders }),
        cellPara(row.kelengkapan, { width: 1500, borders: rowBorders }),
        cellPara(row.waktu, { width: 600, center: true, borders: rowBorders }),
        cellPara(row.output, { width: 1100, borders: rowBorders }),
        cellPara(row.keterangan, { width: 1100, borders: rowBorders }),
      ]
    }));
  }

  return new Table({
    alignment: AlignmentType.CENTER,
    rows: tableRows,
    width: { size: 7900, type: WidthType.DXA }
  });
}

function insertFlowchartImage(imageName, title, targetWidth = 300, isFirst = false) {
  const dims = getScaledDimensions(imageName, targetWidth);
  const childSeq = isFirst ? "GambarChild \\r 3" : "GambarChild";
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80, before: 80, line: 480 },
      children: [
        new ImageRun({
          data: fs.readFileSync(path.join(__dirname, imageName)),
          type: 'png',
          transformation: { width: dims.width, height: dims.height },
        }),
      ]
    }),
    new Paragraph({
      style: 'CaptionFigure',
      children: [
        new TextRun({ text: "Gambar ", bold: true, font: 'Times New Roman', size: 24 }),
        new SequentialIdentifier("Gambar \\r 2"),
        new TextRun({ text: ".", bold: true, font: 'Times New Roman', size: 24 }),
        new SequentialIdentifier(childSeq),
        new TextRun({ text: `\t${title}`, bold: true, font: 'Times New Roman', size: 24 })
      ]
    }),
    tableSource('Sumber: Perdirjen Imigrasi No. IMI.1917-OT.02.01/2013, diolah peneliti (2026).'),
  ];
}

function tableCaptionCentered(text) {
  return new Paragraph({
    style: 'CaptionTable',
    children: [
      new TextRun({ text: "Tabel 2.", bold: true, font: 'Times New Roman', size: 24 }),
      new SequentialIdentifier("Tabel"),
      new TextRun({ text: `\t${text}`, bold: true, font: 'Times New Roman', size: 24 })
    ]
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

function tocEntry(label, pageNum, level = 0, bold = false) {
  const indent = level === 0 ? 0 : level === 1 ? 360 : 720;
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
// DOCUMENT BUILD — STRUKTUR 3 BAB
// ══════════════════════════════════════════════════════════════════════

const chapterPageSetup = createChapterHeadersAndFooters();
const frontMatterFooter = createFrontMatterFooter();

const numberingConfigs = [
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
for (let i = 1; i <= 50; i++) {
  numberingConfigs.push({
    reference: `num-${i}`,
    levels: [{
      level: 0,
      format: LevelFormat.DECIMAL,
      text: '%1.',
      alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } }
    }]
  });
}

const doc = new Document({
  features: {
    updateFields: true
  },
  numbering: {
    config: numberingConfigs
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
        run: { size: 24, bold: true, font: 'Times New Roman' },
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
        centered('MAKALAH', { bold: true, size: 28, spaceAfter: 120 }),
        centered('ANALISIS STRUKTUR ORGANISASI, SISTEM INFORMASI', { bold: true, size: 24 }),
        centered('MANAJEMEN KEIMIGRASIAN (SIMKIM), DAN', { bold: true, size: 24 }),
        centered('STANDAR OPERASIONAL PROSEDUR (SOP)', { bold: true, size: 24 }),
        centered('PADA RUMAH DETENSI IMIGRASI PONTIANAK', { bold: true, size: 24, spaceAfter: 240 }),
        emptyRow(),
        centered('Disusun untuk Memenuhi Tugas Mata Kuliah', { size: 24, spaceAfter: 0 }),
        centered('Sistem Informasi Manajemen', { bold: true, size: 24, spaceAfter: 240 }),
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
    // SECTION 2: KATA PENGANTAR
    // ═══════════════════════════════════════════════════════════════
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: M_TOP, right: M_RIGHT, bottom: M_BOTTOM, left: M_LEFT },
          pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN }
        }
      },
      footers: frontMatterFooter,
      children: [
        frontMatterHeader('KATA PENGANTAR'),
        justifiedPara([
          tr('Segala puji dan syukur penulis panjatkan kehadirat Allah Subhanahu Wa Ta\'ala, yang atas rahmat dan karunia-Nya penulis dapat merampungkan makalah berjudul '),
          trb('"Analisis Struktur Organisasi, Sistem Informasi Manajemen Keimigrasian (SIMKIM), dan Standar Operasional Prosedur (SOP) pada Rumah Detensi Imigrasi Pontianak"'),
          tr('. Makalah ini disusun sebagai tugas mata kuliah Sistem Informasi Manajemen pada Program Studi Akuntansi, Fakultas Ekonomi dan Bisnis, Universitas Panca Bhakti Pontianak.')
        ]),
        justifiedPara([
          tr('Makalah ini tidak akan terwujud tanpa dukungan sejumlah pihak. Untuk itu, penulis menyampaikan terima kasih kepada:')
        ]),
        ...resetList(),
        numberedItemRuns([tr('Ibu Dr. Renny Wulandari, S.E., M.Si., Ak., CA selaku Dosen Pengampu mata kuliah Sistem Informasi Manajemen yang telah memberikan bimbingan dan arahan.')]),
        numberedItemRuns([tr('Kepala Rumah Detensi Imigrasi Pontianak beserta seluruh jajaran yang telah memberikan data dan informasi yang diperlukan.')]),
        emptyRow(),
        justifiedPara([
          tr('Penulis menyadari sepenuhnya bahwa makalah ini tentu masih menyimpan kekurangan. Kritik dan saran yang membangun sangat penulis nantikan sebagai bahan perbaikan. Semoga tulisan ini turut memberi manfaat bagi pembaca.')
        ]),
        emptyRow(),
        new Table({
          borders: borders0,
          indent: { size: 4673, type: WidthType.DXA },
          width: { size: 3254, type: WidthType.DXA },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: borders0,
                  width: { size: 3254, type: WidthType.DXA },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 0, before: 0, line: 480 },
                      children: [tr('Pontianak, 18 Juni 2026')]
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 0, before: 0, line: 480 },
                      children: [tr('Penulis')]
                    })
                  ]
                })
              ]
            })
          ]
        }),
      ]
    },
    // ═══════════════════════════════════════════════════════════════
    // SECTION 3: DAFTAR ISI
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
        frontMatterHeader('DAFTAR ISI'),
        emptyRow(),
        new TableOfContents("", {
          hyperlink: true,
          headingStyleRange: "1-3"
        }),
        pageBreak(),

        frontMatterHeader('DAFTAR TABEL'),
        emptyRow(),
        new TableOfContents("", {
          hyperlink: true,
          captionLabelIncludingNumbers: "Tabel"
        }),
        pageBreak(),

        frontMatterHeader('DAFTAR GAMBAR'),
        emptyRow(),
        new TableOfContents("", {
          hyperlink: true,
          captionLabelIncludingNumbers: "Gambar"
        })
      ]
    },
    // ═══════════════════════════════════════════════════════════════
    // SECTION 4: BAB I - PENDAHULUAN
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
        chapterHeader('BAB I', 'PENDAHULUAN'),

        // A. Latar Belakang
        heading2('A. Latar Belakang'),
        justifiedPara([
          tr('Organisasi publik masa kini nyaris mustahil beroperasi tanpa dukungan teknologi informasi. Laudon dan Laudon (2020) mendefinisikan Sistem Informasi Manajemen (SIM) sebagai sistem yang mengumpulkan, memproses, menyimpan, dan mendistribusikan informasi guna menopang pengambilan keputusan, koordinasi, serta pengendalian organisasi. Di sektor pemerintahan, kehadiran SIM bukan lagi pelengkap, melainkan kebutuhan pokok untuk mewujudkan tata kelola yang baik ('),
          tri('good governance'),
          tr('), terutama dalam meningkatkan efisiensi, transparansi, dan akuntabilitas pelayanan publik.')
        ]),
        justifiedPara([
          tr('Salah satu wujud nyata transformasi digital di sektor publik Indonesia terlihat pada bidang keimigrasian. Direktorat Jenderal Imigrasi mengembangkan Sistem Informasi Manajemen Keimigrasian (SIMKIM) sebagai tulang punggung digitalisasi pelayanan dan pengawasan keimigrasian. Mengacu pada Undang-Undang Nomor 6 Tahun 2011 tentang Keimigrasian, SIMKIM dirancang sebagai sistem terpusat yang mengintegrasikan seluruh data keimigrasian nasional, mulai dari data paspor Warga Negara Indonesia (WNI), visa dan izin tinggal Warga Negara Asing (WNA), perlintasan di Tempat Pemeriksaan Imigrasi (TPI), hingga pendataan deteni di Rumah Detensi Imigrasi (Rudenim) di seluruh Indonesia.')
        ]),
        justifiedPara([
          tr('Rumah Detensi Imigrasi (Rudenim) Pontianak merupakan Unit Pelaksana Teknis (UPT) keimigrasian yang mengemban peran strategis di Kalimantan Barat. Letak geografis provinsi ini, yang berbatasan darat langsung dengan Sarawak, Malaysia Timur, menjadikannya kawasan rawan perlintasan orang asing ilegal maupun pelanggaran izin tinggal. Rudenim Pontianak bertugas menampung sementara orang asing yang dikenai Tindakan Administratif Keimigrasian (TAK) berupa pendetensian sambil menunggu proses pendeportasian. Dalam praktiknya, kompleksitas operasional Rudenim tercermin dari tujuh Standar Operasional Prosedur (SOP) utama yang mengatur siklus pengelolaan deteni secara utuh, dari penerimaan, pemeriksaan kesehatan, registrasi, penempatan, pengamanan, pemindahan, hingga pendeportasian.')
        ]),
        justifiedPara([
          tr('Efektivitas Rudenim Pontianak bertumpu pada tiga komponen yang saling mengunci: (1) struktur organisasi yang membagi tugas dan wewenang, (2) SIMKIM sebagai sistem informasi pengelola data deteni, dan (3) SOP yang memandu seluruh kegiatan operasional. Untuk menganalisis ketiga komponen itu secara utuh, penulis menggunakan kerangka Leavitt\'s Diamond Model (1965), yang memandang organisasi sebagai sistem empat elemen yang saling mempengaruhi: Struktur ('),
          tri('Structure'),
          tr('), Tugas ('),
          tri('Task'),
          tr('), Teknologi ('),
          tri('Technology'),
          tr('), dan Sumber Daya Manusia ('),
          tri('People'),
          tr('). Inti model ini sederhana: mengubah satu elemen niscaya menggerakkan elemen lainnya.')
        ]),
        justifiedPara([
          tr('Bertolak dari latar belakang di atas, penulis bermaksud mengkaji bagaimana struktur organisasi, penerapan SIMKIM, dan pelaksanaan SOP di Rudenim Pontianak saling berintegrasi dalam menunjang efektivitas pengelolaan administrasi deteni. Hasil kajian tersebut dituangkan dalam makalah berjudul '),
          trb('"Analisis Struktur Organisasi, Sistem Informasi Manajemen Keimigrasian (SIMKIM), dan Standar Operasional Prosedur (SOP) pada Rumah Detensi Imigrasi Pontianak".'),
        ]),

        // B. Rumusan Masalah
        heading2('B. Rumusan Masalah'),
        justifiedPara([tr('Berdasarkan latar belakang di atas, rumusan masalah dalam makalah ini adalah:')], { indent: false }),
        ...resetList(),
        numberedItemRuns([tr('Bagaimana struktur organisasi Rumah Detensi Imigrasi Pontianak mendukung pelaksanaan tugas dan fungsi pengelolaan deteni?')]),
        numberedItemRuns([tr('Bagaimana penerapan Sistem Informasi Manajemen Keimigrasian (SIMKIM) dalam pengelolaan administrasi deteni di Rudenim Pontianak?')]),
        numberedItemRuns([tr('Bagaimana pelaksanaan Standar Operasional Prosedur (SOP) dalam operasional Rudenim Pontianak dan integrasinya dengan SIMKIM?')]),
        numberedItemRuns([tr('Bagaimana integrasi struktur organisasi, SIMKIM, dan SOP dapat dianalisis menggunakan Leavitt\'s Diamond Model?')]),

        // C. Tujuan Penulisan
        heading2('C. Tujuan Penulisan'),
        justifiedPara([tr('Tujuan penulisan makalah ini adalah:')], { indent: false }),
        ...resetList(),
        numberedItemRuns([tr('Mendeskripsikan struktur organisasi Rumah Detensi Imigrasi Pontianak beserta tugas dan fungsi masing-masing unit kerja.')]),
        numberedItemRuns([tr('Menganalisis penerapan SIMKIM dalam pengelolaan administrasi deteni di Rudenim Pontianak.')]),
        numberedItemRuns([tr('Menjelaskan pelaksanaan SOP operasional Rudenim Pontianak dan integrasinya dengan SIMKIM.')]),
        numberedItemRuns([tr('Menganalisis keterkaitan struktur organisasi, SIMKIM, dan SOP menggunakan kerangka Leavitt\'s Diamond Model.')]),
        pageBreak(),
      ]
    },
    // ═══════════════════════════════════════════════════════════════
    // SECTION 5: BAB II - PEMBAHASAN
    // ═══════════════════════════════════════════════════════════════
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: M_TOP, right: M_RIGHT, bottom: M_BOTTOM, left: M_LEFT }
        },
        titlePage: true
      },
      headers: chapterPageSetup.headers,
      footers: chapterPageSetup.footers,
      children: [
        chapterHeader('BAB II', 'PEMBAHASAN'),

        // ═════════════════════════════════════════════════════════════
        // A. Struktur Organisasi
        // ═════════════════════════════════════════════════════════════
        heading2('A. Struktur Organisasi Rumah Detensi Imigrasi Pontianak'),

        heading3('1. Profil Singkat Rudenim Pontianak'),
        justifiedPara([
          tr('Sebagai Unit Pelaksana Teknis (UPT) di bawah Direktorat Jenderal Imigrasi pada Kementerian Imigrasi dan Pemasyarakatan Republik Indonesia, Rumah Detensi Imigrasi (Rudenim) Pontianak memegang posisi strategis di Kalimantan Barat. Berkedudukan di Jalan Adi Sucipto KM. 15, Sungai Raya, Kabupaten Kubu Raya, kantor ini resmi beroperasi pasca diresmikan pada 26 Januari 2005 oleh Menteri Hukum dan Hak Asasi Manusia Republik Indonesia. Untuk cakupan kerjanya sendiri, Rudenim Pontianak bertanggung jawab atas pengawasan di seluruh wilayah Provinsi Kalimantan Barat yang membentang di 2 (dua) Kota dan 12 (dua belas) Kabupaten.')
        ]),
        justifiedPara([
          tr('Tugas utama yang diemban Rudenim Pontianak adalah mengeksekusi sebagian fungsi keimigrasian dalam hal pendetensian orang asing yang terbukti melanggar hukum keimigrasian. Agar roda organisasi berjalan selaras dengan kebijakan pusat, komando kepemimpinan berada di tangan Kepala Rudenim yang bertanggung jawab langsung kepada Direktur Jenderal Imigrasi melalui Kantor Wilayah Kementerian Hukum dan HAM Kalimantan Barat.')
        ]),

        heading3('2. Dasar Hukum Pembentukan'),
        justifiedPara([tr('Pembentukan dan organisasi Rumah Detensi Imigrasi didasarkan pada beberapa peraturan perundang-undangan, antara lain:')], { indent: false }),
        ...resetList(),
        numberedItemRuns([tr('Undang-Undang Nomor 6 Tahun 2011 tentang Keimigrasian.')]),
        numberedItemRuns([tr('Peraturan Pemerintah Nomor 31 Tahun 2013 tentang Peraturan Pelaksanaan UU Keimigrasian.')]),
        numberedItemRuns([tr('Keputusan Menteri Kehakiman Nomor M.01-PR.07.04 Tahun 2004 tentang Organisasi dan Tata Kerja Rumah Detensi Imigrasi.')]),
        numberedItemRuns([tr('Peraturan Presiden Nomor 139 Tahun 2024 tentang Kementerian Imigrasi dan Pemasyarakatan.')]),

        heading3('3. Susunan Organisasi'),
        justifiedPara([
          tr('Merujuk pada Keputusan Menteri Kehakiman Nomor M.01-PR.07.04 Tahun 2004, pembagian tata kerja dan hierarki internal Rumah Detensi Imigrasi Pontianak terstruktur sebagai berikut:')
        ]),
        // Gambar struktur organisasi
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80, before: 80, line: 480 },
          children: [
            new ImageRun({
              data: fs.readFileSync(path.join(__dirname, 'struktur_organisasi_rudenim.png')),
              type: 'png',
              transformation: getScaledDimensions('struktur_organisasi_rudenim.png', 450),
            }),
          ]
        }),
        new Paragraph({
          style: 'CaptionFigure',
          spacing: { after: 240, before: 80, line: 480 },
          children: [
            new TextRun({ text: "Gambar 2.", bold: true, font: 'Times New Roman', size: 24 }),
            new SequentialIdentifier("Gambar"),
            new TextRun({ text: "\tStruktur Organisasi Rudenim Pontianak", bold: true, font: 'Times New Roman', size: 24 })
          ]
        }),
        tableSource('Sumber: Website Resmi Rudenim Pontianak, rudenimpontianak.imigrasi.go.id (2026).'),

        heading3('4. Tugas dan Fungsi Masing-Masing Unit'),

        justifiedPara([
          trb('a) Kepala Rumah Detensi Imigrasi'),
        ], { indent: false }),
        justifiedPara([
          tr('Selaku pucuk pimpinan tertinggi di tingkat UPT, Kepala Rudenim memegang tanggung jawab penuh atas kendali operasional dan pengawasan deteni. Tanggung jawab ini mencakup koordinasi taktis seluruh kegiatan pendetensian, pengambilan keputusan krusial (seperti penempatan sel, mutasi deteni, hingga deportasi), legalisasi dokumen administrasi melalui penandatanganan Surat Keputusan Pengeluaran Deteni (SKPD), serta supervisi berkala terhadap kinerja pegawai. Saat ini, kepemimpinan Rudenim Pontianak diamanahkan kepada Suriansyah, S.Sos., M.M.')
        ]),

        justifiedPara([
          trb('b) Sub Bagian Tata Usaha'),
        ], { indent: false }),
        justifiedPara([
          tr('Urusan administrasi internal, manajemen kepegawaian, pengelolaan keuangan, pemeliharaan logistik, serta urusan rumah tangga kantor menjadi wilayah kerja Subbagian Tata Usaha. Unit ini berfungsi sebagai penyokong kelancaran operasional melalui pengelolaan persuratan dan kearsipan yang rapi, penyusunan draf anggaran tahunan, pembinaan karier pegawai, hingga perawatan seluruh aset serta sarana prasarana dinas.')
        ]),

        justifiedPara([
          trb('c) Seksi Registrasi, Administrasi, dan Pelaporan'),
        ], { indent: false }),
        justifiedPara([
          tr('Dapat dikatakan seksi ini adalah pintu gerbang sekaligus motor penggerak utama dalam rantai pengolahan data deteni. Fokus kerjanya meliputi pemeriksaan dan verifikasi dokumen administrasi dari UPT pengirim, perekaman data biometrik (sidik jari terintegrasi dan pasfoto digital) ke dalam SIMKIM, penerbitan Kartu Identitas Deteni, pembukuan berkas perkara keimigrasian, serta penyusunan laporan berkala mengenai dinamika populasi deteni.')
        ]),

        justifiedPara([
          trb('d) Seksi Keamanan dan Ketertiban'),
        ], { indent: false }),
        justifiedPara([
          tr('Seksi Keamanan dan Ketertiban (Kamtib) berdiri sebagai garda terdepan penegak kedisiplinan dan pencegah potensi gangguan keamanan di lingkungan UPT. Fungsi strategisnya di lapangan mencakup penjagaan pos-pos rawan selama 24 jam penuh, pelaksanaan apel harian guna memantau jumlah deteni secara riil, sterilisasi blok hunian melalui razia barang terlarang, penanggulangan situasi darurat (seperti percobaan melarikan diri atau ketegangan antar-deteni), serta pengawalan melekat selama proses mutasi atau pendeportasian.')
        ]),

        justifiedPara([
          trb('e) Seksi Perawatan dan Kesehatan'),
        ], { indent: false }),
        justifiedPara([
          tr('Menjamin terpenuhinya hak kemanusiaan dan kebutuhan dasar deteni merupakan komitmen utama Seksi Perawatan dan Kesehatan. Tanggung jawab kemanusiaan ini meliputi penyediaan makanan dan air bersih bernutrisi, pembagian perlengkapan mandi serta pakaian layak, penyediaan pertolongan pertama di klinik Rudenim, koordinasi rujukan medis ke rumah sakit umum jika deteni membutuhkan penanganan dokter spesialis, serta kolaborasi dengan Seksi Kamtib dalam menjaga deteni yang menjalani perawatan di luar kantor.')
        ]),

        pageBreak(),

        // ═════════════════════════════════════════════════════════════
        // B. SIMKIM
        // ═════════════════════════════════════════════════════════════
        heading2('B. Sistem Informasi Manajemen Keimigrasian (SIMKIM)'),

        heading3('1. Pengertian dan Dasar Hukum SIMKIM'),
        justifiedPara([
          tr('Sebagai tulang punggung digitalisasi keimigrasian di Indonesia, Sistem Informasi Manajemen Keimigrasian (SIMKIM) dikembangkan secara terpusat oleh Direktorat Jenderal Imigrasi. Sistem ini secara khusus diatur dalam Undang-Undang Nomor 6 Tahun 2011 tentang Keimigrasian pada Pasal 1 angka 31, yang menegaskan kedudukan SIMKIM sebagai infrastruktur teknologi informasi dan komunikasi untuk menghimpun, mengolah, serta menyajikan data demi mendukung pengambilan keputusan operasional maupun manajerial keimigrasian.')
        ]),
        justifiedPara([
          tr('Arsitektur yang menopang SIMKIM berbasis pada basis data terpusat ('),
          tri('centralized database'),
          tr('). Model desentralisasi akses ini memungkinkan data yang diinput oleh petugas di tingkat daerah, seperti di Rudenim Pontianak, dapat langsung diakses secara '),
          tri('real-time'),
          tr(' oleh Direktorat Jenderal Imigrasi di Jakarta. Seluruh proses standardisasi, pengembangan sistem, serta pemeliharaan keamanannya dikelola langsung oleh Pusat Data dan Teknologi Informasi (Pusdatin) Direktorat Jenderal Imigrasi.')
        ]),

        heading3('2. Modul-Modul SIMKIM yang Digunakan di Rudenim'),
        justifiedPara([tr('Untuk mendukung alur kerja yang cepat dan terdokumentasi, operasional Rudenim Pontianak memanfaatkan beberapa modul spesifik di dalam SIMKIM:')]),

        justifiedPara([
          trb('a) Modul Pendataan Deteni'),
        ], { indent: false }),
        justifiedPara([
          tr('Sebagai pintu awal pencatatan, modul ini berfungsi merekam identitas dasar deteni secara menyeluruh—mulai dari nama lengkap, kewarganegaraan, nomor paspor, hingga dasar hukum pendetensian (Surat Perintah Pendetensian). Di samping data tekstual, modul ini mengintegrasikan perekaman biometrik berupa sidik jari menggunakan perangkat '),
          tri('flatbed scanner'),
          tr(' serta pengambilan pasfoto digital deteni sebagai validasi visual.')
        ]),

        justifiedPara([
          trb('b) Modul Pengawasan dan Cekal'),
        ], { indent: false }),
        justifiedPara([
          tr('Integrasi data pencegahan dan penangkalan (cekal) nasional dapat diakses melalui modul ini. Petugas memanfaatkannya untuk mencocokkan profil deteni yang baru masuk dengan daftar cekal nasional guna memitigasi penggunaan identitas ganda ('),
          tri('double identity'),
          tr(') maupun mendeteksi jika deteni masuk dalam daftar pencarian orang (DPO) penegak hukum lain. Data biometrik yang direkam di Rudenim Pontianak secara otomatis terunggah ke server pusat untuk proses penyaringan.')
        ]),

        justifiedPara([
          trb('c) Modul Manifest dan Pelaporan'),
        ], { indent: false }),
        justifiedPara([
          tr('Modul ini menyediakan gambaran populasi deteni secara riil ('),
          tri('up-to-date'),
          tr(') di dalam Rudenim. Informasi yang disajikan mencakup klasifikasi kewarganegaraan, jenis kelamin, lokasi penempatan sel hunian, hingga status hukum yang sedang berjalan (seperti proses pendeportasian atau pemindahan). Data ini menjadi dasar utama penyusunan laporan periodik bagi Kantor Wilayah dan Ditjen Imigrasi.')
        ]),

        justifiedPara([
          trb('d) Modul Deportasi'),
        ], { indent: false }),
        justifiedPara([
          tr('Modul ini mencatat akhir dari siklus pendetensian orang asing. Petugas menggunakannya untuk mendokumentasikan proses pengeluaran deteni, baik karena pendeportasian, pemindahan antar-Rudenim, maupun pelepasan bersyarat. Di dalamnya terekam detail penting seperti nomor Surat Keputusan Pengeluaran Deteni (SKPD), tanggal keberangkatan, serta rute penerbangan pemulangan.')
        ]),

        heading3('3. Kendala Penerapan SIMKIM di Rudenim Pontianak'),
        justifiedPara([tr('Meskipun implementasi SIMKIM telah memangkas banyak prosedur manual, di lapangan petugas masih kerap menemui hambatan teknis yang memengaruhi kelancaran operasional:')]),
        ...resetList(),
        numberedItemRuns([
          trb('Stabilitas Jaringan Internet: '),
          tr('Sebagai sistem yang terpusat, kelancaran SIMKIM bergantung sepenuhnya pada kualitas jaringan. Di lapangan, koneksi internet yang menghubungkan Rudenim Pontianak dengan server pusat Ditjenim seringkali mengalami kelambatan ('),
          tri('latency'),
          tr(') atau gangguan transmisi data, terutama saat proses pencocokan biometrik berskala besar.')
        ]),
        numberedItemRuns([
          trb('Daya Dukung Perangkat Keras: '),
          tr('Beberapa perangkat pemindai biometrik ('),
          tri('fingerprint scanner'),
          tr(') dan kamera digital yang digunakan sudah berumur dan mengalami penurunan sensitivitas. Hal ini mengharuskan petugas mengulang proses pemindaian beberapa kali untuk mendapatkan kualitas sidik jari yang memenuhi standar.')
        ]),
        numberedItemRuns([
          trb('Tumpang Tindih Pencatatan (Double Entry): '),
          tr('Belum terhubungnya buku mutasi fisik yang dikelola oleh petugas penjagaan Kamtib dengan log digital SIMKIM menuntut adanya input data ganda. Petugas harus menyalin data secara manual ke buku laporan fisik sekaligus ke sistem elektronik, sehingga memicu risiko salah ketik ('),
          tri('human error'),
          tr(').')
        ]),
        numberedItemRuns([
          trb('Kesenjangan Literasi Sistem Akibat Rotasi: '),
          tr('Adanya perputaran atau rotasi personel rutin di lingkungan keimigrasian terkadang tidak diiringi dengan pelatihan teknis SIMKIM yang menyeluruh bagi petugas baru. Akibatnya, pemanfaatan modul-modul tertentu di lapangan seringkali belum optimal.')
        ]),

        pageBreak(),

        // ═════════════════════════════════════════════════════════════
        // C. SOP
        // ═════════════════════════════════════════════════════════════
        heading2('C. Standar Operasional Prosedur (SOP) Rudenim Pontianak'),

        justifiedPara([
          tr('Seluruh sendi operasional di Rumah Detensi Imigrasi Pontianak dipandu oleh 7 (tujuh) Standar Operasional Prosedur (SOP) utama yang saling bertaut membentuk siklus hidup ('),
          tri('lifecycle'),
          tr(') deteni secara utuh. Siklus ini diawali dari masa awal penerimaan hingga akhirnya deteni keluar dari fasilitas detensi. Hubungan interkoneksi di antara ketujuh SOP tersebut dipetakan dalam diagram alur ('),
          tri('flowchart'),
          tr(') di bawah ini:')
        ]),

        // Diagram Flowchart
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80, before: 80, line: 480 },
          children: [
            new ImageRun({
              data: fs.readFileSync(path.join(__dirname, 'flowchart_lifecycle_deteni.png')),
              type: 'png',
              transformation: getScaledDimensions('flowchart_lifecycle_deteni.png', 450),
            }),
          ]
        }),
        new Paragraph({
          style: 'CaptionFigure',
          spacing: { after: 240, before: 80, line: 480 },
          children: [
            new TextRun({ text: "Gambar 2.", bold: true, font: 'Times New Roman', size: 24 }),
            new SequentialIdentifier("Gambar"),
            new TextRun({ text: "\tFlowchart Siklus Hidup Deteni Terintegrasi dengan 7 SOP pada Rumah Detensi Imigrasi Pontianak", bold: true, font: 'Times New Roman', size: 24 })
          ]
        }),
        tableSource('Sumber: Perdirjen Imigrasi No. IMI.1917-OT.02.01/2013, diolah peneliti (2026).'),

        heading3('1. SOP Penerimaan Calon Deteni'),
        justifiedPara([
          tr('SOP Penerimaan Calon Deteni mendefinisikan langkah formal dalam menyambut orang asing yang akan ditempatkan di dalam fasilitas UPT. Alur kerja bergulir saat Kantor Imigrasi pengirim melayangkan surat pemberitahuan rencana penyerahan beserta kelengkapan berkas perkara deteni. Petugas dari Seksi Registrasi, Administrasi, dan Pelaporan berkewajiban memeriksa kelayakan dokumen, memverifikasi kesesuaian fisik deteni, serta menandatangani Berita Acara Serah Terima (BAST). Secara bersamaan, operator SIMKIM akan membuat entri kedatangan baru guna merekam riwayat awal deteni.')
        ]),
        ...insertFlowchartImage('sop_penerimaan_flowchart.png', 'Flowchart SOP Penerimaan Calon Deteni', 450, true),
        tableCaptionCentered('Mutu Baku SOP Penerimaan Calon Deteni'),
        createMutuBakuTable([
          { no: '1', kegiatan: 'Memberikan persetujuan/disposisi/arahan penerimaan calon Deteni', pelaksana: 'Kepala', kelengkapan: 'Dokumen pengantar / berkas usulan', waktu: '5 Menit', output: 'Disposisi persetujuan', keterangan: 'Mulai.' },
          { no: '2', kegiatan: 'Mempersiapkan/mengoordinasikan penerimaan calon Deteni berdasarkan disposisi', pelaksana: 'Kasi Reg', kelengkapan: 'a. Verifikasi penerimaan\nb. Disposisi surat pengantar\nc. Aplikasi SIMKIM', waktu: '5 Menit', output: 'Persetujuan elektronik / disposisi manual', keterangan: '' },
          { no: '3', kegiatan: 'Melakukan penggeledahan calon Deteni', pelaksana: 'Kasi Kamtib', kelengkapan: 'a. Metal detektor\nb. Kantong plastik\nc. Loker penyimpanan', waktu: '10 Menit', output: 'BA Penitipan Barang & Daftar Barang', keterangan: 'Mencegah penyelundupan barang berbahaya.' },
          { no: '4', kegiatan: 'Melakukan pemeriksaan kesehatan fisik awal deteni', pelaksana: 'Kasi Perkes', kelengkapan: 'a. Tensimeter, stetoskop\nb. Testpack narkoba/kehamilan\nc. Formulir medis', waktu: '30 Menit', output: 'Surat Keterangan Sehat', keterangan: 'Memastikan kelaikan fisik deteni.' },
          { no: '5', kegiatan: 'Menyusun konsep Surat Keputusan Pendetensian & Berita Acara (BAST)', pelaksana: 'Kasi Reg', kelengkapan: 'a. Surat Keterangan Sehat\nb. BA Penitipan Barang\nc. Draf SK/BAST', waktu: '10 Menit', output: 'Konsep SK & BAST', keterangan: 'Diusulkan ke Kepala Rudenim.' },
          { no: '6', kegiatan: 'Menerbitkan & menandatangani SK serta Surat Perintah Pendetensian', pelaksana: 'Kepala', kelengkapan: 'a. Konsep SK & SP\nb. Cap dinas', waktu: '5 Menit', output: '1. SK Pendetensian\n2. Surat Perintah Pendetensian', keterangan: 'Selesai.' }
        ]),
        emptyRow(),
        justifiedPara([trb('Langkah demi Langkah Prosedur Kerja:')], { indent: false }),
        ...resetList(),
        numberedItemRuns([trb('Langkah 1: '), tr('Petugas pengirim menyerahkan berkas pengantar & calon deteni. Kepala Rudenim memeriksa berkas & memberikan disposisi persetujuan.')]),
        numberedItemRuns([trb('Langkah 2: '), tr('Kasi Reg memverifikasi dokumen & mengoordinasikan jadwal pemeriksaan fisik dengan seksi Kamtib & Perkes.')]),
        numberedItemRuns([trb('Langkah 3: '), tr('Petugas Kamtib melakukan penggeledahan badan & barang menggunakan metal detektor, mengamankan barang berharga, & menerbitkan Berita Acara Penitipan Barang.')]),
        numberedItemRuns([trb('Langkah 4: '), tr('Nakes (Perkes) melakukan anamnesa medis dasar (tensi, nadi, suhu) & skrining khusus (tes urine/kehamilan) di klinik, lalu menerbitkan Surat Keterangan Sehat.')]),
        numberedItemRuns([trb('Langkah 5: '), tr('Operator Registrasi menyusun konsep Surat Keputusan Pendetensian, Surat Perintah, & BAST untuk divalidasi Kasi Reg.')]),
        numberedItemRuns([trb('Langkah 6: '), tr('Kepala Rudenim menandatangani SK & Surat Perintah Pendetensian, salinan diberikan kepada deteni, & ditembuskan ke Kedutaan terkait.')]),
        justifiedPara([trb('Alur Integrasi SIMKIM: '), tr('Data dokumen serah terima awal (surat pengantar & berkas usulan) diunggah dan status kedatangan deteni direkam ke dalam modul Pengawasan SIMKIM guna mengunci data awal deteni secara terpusat.')]),
        emptyRow(),

        heading3('2. SOP Pemeriksaan Kesehatan Deteni'),
        justifiedPara([
          tr('SOP Pemeriksaan Kesehatan Deteni menjamin bahwa setiap deteni memperoleh hak pelayanan kesehatan yang layak selama menjalani masa pendetensian. Lingkup prosedur ini meliputi skrining kesehatan awal begitu deteni tiba, pemeriksaan berkala oleh dokter atau perawat di poliklinik UPT, serta penanganan perawatan jalan maupun rawat inap lokal. Bila kondisi medis deteni memburuk dan memerlukan tindakan spesialis, petugas akan merujuknya ke Rumah Sakit Umum Daerah (RSUD) dengan pengawalan ketat personel Kamtib. Seluruh rekam medis dan pembaruan status deteni direkam ke dalam sistem untuk menjaga transparansi pengawasan.')
        ]),
        ...insertFlowchartImage('sop_kesehatan_flowchart.png', 'Flowchart SOP Pemeriksaan Kesehatan Deteni', 380),
        tableCaptionCentered('Mutu Baku SOP Pemeriksaan Kesehatan Deteni'),
        createMutuBakuTable([
          { no: '1', kegiatan: 'Petugas Jaga melaporkan adanya deteni mengeluh sakit kepada Seksi Perkes', pelaksana: 'Seksi Kamtib', kelengkapan: 'Laporan lisan / digital', waktu: '2 Menit', output: 'Laporan keluhan deteni', keterangan: 'Mulai.' },
          { no: '2', kegiatan: 'Pemeriksaan awal oleh Nakes untuk penentuan tingkat kedaruratan medis', pelaksana: 'Seksi Perkes', kelengkapan: 'Rekam medik, stetoskop, sphygmomanometer', waktu: '15 Menit', output: 'Pernyataan status medis deteni', keterangan: '' },
          { no: '3', kegiatan: 'Pengajuan surat izin keluar sementara deteni untuk dirujuk ke RS/Puskesmas', pelaksana: 'Seksi Reg', kelengkapan: 'Komputer, printer, data deteni', waktu: '10 Menit', output: 'Berkas usulan rujukan luar', keterangan: 'Jika terindikasi darurat.' },
          { no: '4', kegiatan: 'Persetujuan izin keluar sementara oleh Kepala Rudenim', pelaksana: 'Kepala', kelengkapan: 'Berkas usulan / tanda tangan', waktu: '5 Menit', output: 'Surat Izin Keluar Sementara', keterangan: '' },
          { no: '5', kegiatan: 'Persiapan akomodasi dan kendaraan operasional', pelaksana: 'Subbag TU', kelengkapan: 'Kendaraan dinas / Ambulans', waktu: '2 Menit', output: 'Kendaraan siap digunakan', keterangan: '' },
          { no: '6', kegiatan: 'Mempersiapkan petugas pengawalan keamanan', pelaksana: 'Seksi Kamtib', kelengkapan: 'Petugas, borgol, tongkat pengamanan', waktu: '5 Menit', output: 'Surat Perintah Pengawalan', keterangan: '' },
          { no: '7', kegiatan: 'Deteni dirawat di Rumah Sakit / Puskesmas mitra', pelaksana: 'Seksi Perkes', kelengkapan: 'Hasil lab, resep, keterangan dokter', waktu: '60 Menit', output: 'Surat Keterangan Medis Dokter / RS', keterangan: 'Perawatan medis di RS.' },
          { no: '8', kegiatan: ' membuat jadwal tugas jaga pengawalan deteni di RS/Puskesmas', pelaksana: 'Seksi Kamtib', kelengkapan: 'Form jadwal piket', waktu: '3 Hari', output: 'Jadwal piket jaga rumah sakit', keterangan: 'Pengamanan stasioner 24 jam.' },
          { no: '9', kegiatan: 'Pemulangan deteni yang dinyatakan membaik/sembuh oleh RS', pelaksana: 'Seksi Perkes', kelengkapan: 'Surat keterangan sembuh dokter', waktu: '60 Menit', output: 'Surat Rekomendasi Pemulangan', keterangan: '' },
          { no: '10', kegiatan: 'Deteni kembali masuk ke blok hunian Rudenim', pelaksana: 'Seksi Kamtib', kelengkapan: 'Kunci blok, catatan mutasi', waktu: '10 Menit', output: 'Penempatan deteni ke blok semula', keterangan: '' },
          { no: '11', kegiatan: 'Melaporkan kembalinya deteni kepada pimpinan', pelaksana: 'Seksi Reg', kelengkapan: 'Komputer, printer, data register', waktu: '5 Menit', output: 'Laporan Atensi Pimpinan', keterangan: 'Selesai.' }
        ]),
        emptyRow(),
        justifiedPara([trb('Langkah demi Langkah Prosedur Kerja:')], { indent: false }),
        ...resetList(),
        numberedItemRuns([trb('Langkah 1: '), tr('Deteni yang sakit melapor kepada petugas Kamtib, yang kemudian meneruskan keluhan secara lisan/digital ke piket medis (Perkes).')]),
        numberedItemRuns([trb('Langkah 2: '), tr('Nakes mendatangi deteni di blok atau poliklinik Rudenim untuk memeriksa tanda vital dan menentukan status kedaruratan.')]),
        numberedItemRuns([trb('Langkah 3: '), tr('Jika membutuhkan penanganan spesialis, Seksi Reg menyusun draf Surat Izin Keluar Sementara Deteni untuk pengobatan luar.')]),
        numberedItemRuns([trb('Langkah 4: '), tr('Kepala Rudenim menandatangani Surat Izin Keluar Sementara Deteni demi alasan kemanusiaan.')]),
        numberedItemRuns([trb('Langkah 5: '), tr('Subbag TU menyiapkan akomodasi berupa kendaraan dinas operasional atau ambulans untuk merujuk deteni.')]),
        numberedItemRuns([trb('Langkah 6: '), tr('Kasi Kamtib menunjuk personel pengamanan khusus dan menandatangani Surat Perintah Pengawalan.')]),
        numberedItemRuns([trb('Langkah 7: '), tr('Deteni dibawa ke RS rujukan didampingi nakes dan dikawal ketat petugas Kamtib untuk menjalani rawat inap/jalan.')]),
        numberedItemRuns([trb('Langkah 8: '), tr('Kasi Kamtib menyusun jadwal piket jaga bergilir stasioner 24 jam di RS guna menghindari upaya pelarian diri.')]),
        numberedItemRuns([trb('Langkah 9: '), tr('Setelah dokter RS menyatakan sembuh, nakes Rudenim meminta Surat Keterangan Sembuh dan memproses pemulangan.')]),
        numberedItemRuns([trb('Langkah 10: '), tr('Petugas pengawal membawa deteni kembali ke Rudenim Pontianak dan menempatkannya ke kamar hunian semula.')]),
        numberedItemRuns([trb('Langkah 11: '), tr('Seksi Reg menyusun Laporan Atensi Pimpinan tentang riwayat pemulangan deteni sakit kepada Kepala Rudenim dengan tembusan Kanwil.')]),
        justifiedPara([trb('Alur Integrasi SIMKIM: '), tr('Setiap pengeluaran deteni untuk keperluan berobat luar UPT dicatat dalam menu mutasi lokal SIMKIM. Rekam medis di-update pada database lokal agar status hukum dan riwayat pengawasan detensi tetap sinkron.')]),
        emptyRow(),

        heading3('3. SOP Registrasi Deteni'),
        justifiedPara([
          tr('Registrasi Deteni menjadi tahapan vital untuk mentransformasi data fisik deteni menjadi rekaman digital pada database nasional. Begitu proses administratif awal rampung, deteni diarahkan ke ruang registrasi. Di sini, operator memindai sidik jari menggunakan perangkat '),
          tri('flatbed scanner'),
          tr(', mengambil pasfoto terbaru, serta mengentri biodata lengkap ke dalam modul pendataan SIMKIM. Perekaman data biometrik ini terhubung langsung dengan server pusat untuk proses penyaringan daftar cekal nasional. Hasil akhir dari prosedur ini adalah terbitnya Nomor Registrasi Deteni dan pencetakan Kartu Identitas Deteni.')
        ]),
        ...insertFlowchartImage('sop_registrasi_flowchart.png', 'Flowchart SOP Registrasi Deteni', 450),
        tableCaptionCentered('Mutu Baku SOP Registrasi Deteni'),
        createMutuBakuTable([
          { no: '1', kegiatan: 'Menerbitkan perintah pendetensian resmi', pelaksana: 'Kepala', kelengkapan: 'Keputusan Pendetensian', waktu: '5 Menit', output: 'Dokumen administrasi lengkap', keterangan: 'Mulai.' },
          { no: '2', kegiatan: 'Memerintahkan proses registrasi deteni dan barang bawaan', pelaksana: 'Kasi Reg', kelengkapan: 'Disposisi Kepala', waktu: '5 Menit', output: 'Disposisi registrasi', keterangan: '' },
          { no: '3', kegiatan: 'Menginput data biometrik, biodata & menyusun konsep berita acara serah terima', pelaksana: 'Kasubseksi Registrasi', kelengkapan: 'Komputer, scanner biometrik, kamera, aplikasi SIMKIM, formulir barang', waktu: '10 Menit', output: 'Nomor register deteni & data barang', keterangan: 'Perekaman foto & sidik jari.' },
          { no: '4', kegiatan: 'Menyusun laporan proses perekaman data registrasi', pelaksana: 'Kasubseksi Admin', kelengkapan: 'Komputer, printer, data terinput', waktu: '5 Menit', output: 'Konsep BAST & konsep laporan', keterangan: '' },
          { no: '5', kegiatan: 'Melaporkan hasil registrasi, menyimpan barang & menyerahkan deteni ke Kamtib', pelaksana: 'Kasubseksi Registrasi', kelengkapan: 'BAST ditandatangani, brankas penyimpanan', waktu: '10 Menit', output: 'Berita acara serah terima deteni & laporan', keterangan: 'Selesai. Laporan dikirim ke Kanwil & Ditjenim.' }
        ]),
        emptyRow(),
        justifiedPara([trb('Langkah demi Langkah Prosedur Kerja:')], { indent: false }),
        ...resetList(),
        numberedItemRuns([trb('Langkah 1: '), tr('Kepala Rudenim menandatangani berkas keputusan pendetensian deteni baru.')]),
        numberedItemRuns([trb('Langkah 2: '), tr('Kasi Reg menerima berkas tersebut dan mendisposisikan kepada kasubseksi registrasi untuk memproses pendaftaran.')]),
        numberedItemRuns([trb('Langkah 3: '), tr('Kasubseksi Registrasi mendata identitas, memindai 10 sidik jari deteni, mengambil foto wajah berlatar belakang merah, & mencatat detail barang bawaan.')]),
        numberedItemRuns([trb('Langkah 4: '), tr('Kasubseksi Admin menyusun rekapitulasi data pendaftaran deteni serta draf laporan administrasi.')]),
        numberedItemRuns([trb('Langkah 5: '), tr('Kasubseksi Registrasi mencetak Kartu Identitas Deteni, menyimpan barang bawaan di loker khusus, & menyerahkan deteni secara fisik ke petugas Kamtib.')]),
        justifiedPara([trb('Alur Integrasi SIMKIM: '), tr('Seluruh data biodata & biometrik deteni diunggah secara real-time ke basis data terpusat Direktorat Jenderal Imigrasi di Jakarta guna proses pencocokan cekal terpusat dan mencegah identitas ganda.')]),
        emptyRow(),

        heading3('4. SOP Penempatan Deteni'),
        justifiedPara([
          tr('SOP Penempatan Deteni mengatur pembagian ruang sel hunian untuk meminimalisir gesekan sosial dan menjaga stabilitas keamanan di dalam UPT. Berbekal profil data dari SIMKIM, petugas Kamtib melakukan pengelompokan deteni berdasarkan parameter jenis kelamin, rentang usia, kewarganegaraan, riwayat kerawanan konflik negara asal, hingga kondisi rentan (seperti wanita hamil, anak-anak, lansia, atau penyandang disabilitas). Untuk menjaga akurasi manifest, nomor blok dan kamar hunian deteni diinput secara presisi ke dalam SIMKIM.')
        ]),
        ...insertFlowchartImage('sop_penempatan_flowchart.png', 'Flowchart SOP Penempatan Deteni Ke Blok Hunian', 450),
        tableCaptionCentered('Mutu Baku SOP Penempatan Deteni'),
        createMutuBakuTable([
          { no: '1', kegiatan: 'Menerima deteni dari Registrasi & memberikan disposisi penempatan', pelaksana: 'Kasi Kamtib', kelengkapan: 'Berita Acara Serah Terima Deteni', waktu: '5 Menit', output: 'Disposisi penempatan deteni', keterangan: 'Mulai.' },
          { no: '2', kegiatan: 'Memeriksa ketersediaan & kelayakan kamar serta menunjuk pengawal', pelaksana: 'Kasubseksi Ketertiban', kelengkapan: 'Form kesehatan, data kamar hunian', waktu: '10 Menit', output: 'Kartu Blok Deteni', keterangan: 'Profiling risiko deteni.' },
          { no: '3', kegiatan: 'Memberitahukan hak, kewajiban, & aturan tata tertib Rudenim', pelaksana: 'Kasi Kamtib', kelengkapan: 'Formulir tata tertib & informasi hak/kewajiban', waktu: '10 Menit', output: 'Formulir pernyataan dimengerti', keterangan: '' },
          { no: '4', kegiatan: 'Mengawal deteni ke kamar, mengunci blok, & membuat draf BA Penempatan', pelaksana: 'Fungsional', kelengkapan: 'Alat pengamanan, kunci blok, masker, sarung tangan', waktu: '10 Menit', output: 'Penempatan fisik deteni & draf BA', keterangan: '' },
          { no: '5', kegiatan: 'Memverifikasi laporan penempatan & draf Berita Acara', pelaksana: 'Kasubseksi Ketertiban', kelengkapan: 'Komputer, draf Berita Acara', waktu: '5 Menit', output: 'Konsep BA terverifikasi', keterangan: '' },
          { no: '6', kegiatan: 'Menerbitkan & menandatangani Berita Acara Penempatan resmi', pelaksana: 'Kasi Kamtib', kelengkapan: 'Komputer, printer, konsep BA', waktu: '5 Menit', output: 'Berita Acara Penempatan resmi', keterangan: '' },
          { no: '7', kegiatan: 'Menyusun laporan evaluasi penempatan deteni secara periodik', pelaksana: 'Kasi Kamtib', kelengkapan: 'Komputer, printer, data penempatan', waktu: '60 Menit', output: 'Laporan bulanan penempatan', keterangan: '' },
          { no: '8', kegiatan: 'Menandatangani & menyampaikan laporan evaluasi penempatan ke pimpinan', pelaksana: 'Kasubseksi Ketertiban', kelengkapan: 'Laporan fisik penempatan', waktu: '5 Menit', output: 'Laporan bertandatangan Kanwil', keterangan: 'Selesai.' }
        ]),
        emptyRow(),
        justifiedPara([trb('Langkah demi Langkah Prosedur Kerja:')], { indent: false }),
        ...resetList(),
        numberedItemRuns([trb('Langkah 1: '), tr('Kasi Kamtib menerima BAST fisik deteni dari Seksi Reg dan menerbitkan disposisi penempatan.')]),
        numberedItemRuns([trb('Langkah 2: '), tr('Kasubseksi Ketertiban menelaah ketersediaan sel hunian dan memprofiling risiko konflik (negara asal/kasus) deteni tersebut.')]),
        numberedItemRuns([trb('Langkah 3: '), tr('Kasi Kamtib mensosialisasikan aturan tata tertib, hak-hak, serta kewajiban deteni selama menghuni Rudenim Pontianak.')]),
        numberedItemRuns([trb('Langkah 4: '), tr('Petugas Jaga (Fungsional) mengawal deteni masuk ke blok sel, mengunci pintu kamar, & membuat draf Berita Acara Penempatan.')]),
        numberedItemRuns([trb('Langkah 5: '), tr('Kasubseksi Ketertiban memeriksa kesesuaian draf BA dengan nomor sel riil deteni.')]),
        numberedItemRuns([trb('Langkah 6: '), tr('Kasi Kamtib menandatangani Berita Acara Penempatan resmi sebagai bentuk legalitas penempatan deteni.')]),
        numberedItemRuns([trb('Langkah 7: '), tr('Kasi Kamtib menyusun laporan rekapitulasi data keterisian blok hunian UPT setiap akhir bulan.')]),
        numberedItemRuns([trb('Langkah 8: '), tr('Kasubseksi Ketertiban memfinalisasi laporan tersebut untuk diserahkan ke Kepala Rudenim dengan tembusan Kanwil.')]),
        justifiedPara([trb('Alur Integrasi SIMKIM: '), tr('Nomor blok dan nomor kamar yang tercantum dalam Berita Acara Penempatan diinput ke dalam modul Penempatan SIMKIM agar manifest digital detensi ter-update secara real-time.')]),
        emptyRow(),

        heading3('5. SOP Penjagaan dan Pengamanan Deteni'),
        justifiedPara([
          tr('SOP Penjagaan dan Pengamanan Deteni dirancang demi menjaga kondusivitas serta memitigasi risiko keamanan di lingkungan kerja Rudenim. Dalam pelaksanaannya, regu jaga melakukan patroli keliling berkala setiap dua jam, menggelar apel pagi dan sore untuk verifikasi fisik deteni, menguji kekokohan jeruji besi sel, serta melakukan razia berkala terhadap barang-barang terlarang. Petugas penjagaan juga secara rutin melakukan pemutakhiran data kehadiran harian deteni ke dalam sistem agar manifest pengawasan elektronik tetap akurat.')
        ]),
        ...insertFlowchartImage('sop_penjagaan_flowchart.png', 'Flowchart SOP Penjagaan & Pengamanan Rudenim', 450),
        tableCaptionCentered('Mutu Baku SOP Penjagaan & Pengamanan Deteni'),
        createMutuBakuTable([
          { no: '1', kegiatan: 'Memerintahkan pelaksanaan tugas pengamanan & penjagaan harian', pelaksana: 'Kasi Kamtib', kelengkapan: 'Jurnal harian, buku serah terima inventaris', waktu: '10 Menit', output: 'Perintah tertulis dalam jurnal', keterangan: 'Mulai.' },
          { no: '2', kegiatan: 'Memimpin apel serah terima tugas pergantian regu jaga', pelaksana: 'Kasubseksi Keamanan', kelengkapan: 'Alat pengeras suara, buku piket regu', waktu: '10 Menit', output: 'Laporan serah terima regu jaga', keterangan: 'Setiap pergantian regu.' },
          { no: '3', kegiatan: 'Memeriksa inventaris taktis pengamanan & menugaskan penghitungan', pelaksana: 'Danru', kelengkapan: 'Kunci blok, HT, borgol, tongkat T, senter', waktu: '10 Menit', output: 'Daftar inventaris terverifikasi', keterangan: '' },
          { no: '4', kegiatan: 'Melaksanakan penghitungan deteni langsung di tiap kamar sel', pelaksana: 'Penjaga', kelengkapan: 'ATK, daftar nominatif deteni', waktu: '60 Menit', output: 'Jurnal harian terisi lengkap', keterangan: 'Pencocokan fisik visual.' },
          { no: '5', kegiatan: 'Melakukan pembagian petugas penjaga di pos-pos pengamanan UPT', pelaksana: 'Danru', kelengkapan: 'Jurnal harian, buku instruksi', waktu: '10 Menit', output: 'Petugas standby di pos pengamanan', keterangan: 'Selesai.' }
        ]),
        emptyRow(),
        justifiedPara([trb('Langkah demi Langkah Prosedur Kerja:')], { indent: false }),
        ...resetList(),
        numberedItemRuns([trb('Langkah 1: '), tr('Kasi Kamtib memberikan instruksi pengamanan harian serta atensi keamanan berdasarkan kondisi internal UPT.')]),
        numberedItemRuns([trb('Langkah 2: '), tr('Kasubseksi Keamanan mengumpulkan regu jaga lama & baru di lapangan untuk memimpin apel serah terima tugas.')]),
        numberedItemRuns([trb('Langkah 3: '), tr('Danru baru melakukan cek fisik anak kunci, HT, borgol, & inventaris taktis lainnya bersama Danru lama.')]),
        numberedItemRuns([trb('Langkah 4: '), tr('Petugas Jaga baru menyisir blok kamar sel untuk menghitung jumlah fisik deteni langsung secara visual.')]),
        numberedItemRuns([trb('Langkah 5: '), tr('Danru membagi petugas jaga stasioner di pos-pos rawan (P2U, blok, menara) & memulai patroli keliling berkala.')]),
        justifiedPara([trb('Alur Integrasi SIMKIM: '), tr('Logbooks fisik apel & hasil patroli harian digunakan sebagai sumber verifikasi data bagi administrator untuk mencocokkan status kehadiran harian deteni di aplikasi SIMKIM lokal.')]),
        emptyRow(),

        heading3('6. SOP Pemindahan Deteni'),
        justifiedPara([
          tr('SOP Pemindahan Deteni menguraikan mekanisme mutasi deteni ke UPT Rudenim lain atau ke pusat akibat kendala kelebihan kapasitas ('),
          tri('overcapacity'),
          tr(') maupun alasan keamanan yang mendesak. Proses ini diinisiasi oleh Seksi Registrasi melalui koordinasi dengan Kantor Wilayah Kemenkumham serta Rudenim penerima. Pasca terbitnya persetujuan resmi dan Surat Perintah Pemindahan, regu Kamtib melaksanakan pengawalan melekat hingga bandara dan mengantarkannya sampai ke tujuan. Dari aspek sistem, administrator melakukan transfer kepemilikan data ('),
          tri('transfer ownership'),
          tr(') di SIMKIM untuk memastikan riwayat perjalanan deteni terdokumentasi secara nasional.')
        ]),
        ...insertFlowchartImage('sop_pemindahan_flowchart.png', 'Flowchart SOP Pemindahan Deteni Antar Rudenim', 380),
        tableCaptionCentered('Mutu Baku SOP Pemindahan Deteni'),
        createMutuBakuTable([
          { no: '1', kegiatan: 'Melaksanakan pembahasan terkait urgensi pemindahan Deteni', pelaksana: 'Kasi Reg', kelengkapan: 'Data identitas deteni, notula rapat', waktu: '1 Jam', output: 'Notula rapat urgensi', keterangan: 'Mulai.' },
          { no: '2', kegiatan: 'Menyiapkan konsep Surat Permohonan Pemindahan deteni', pelaksana: 'Kasi Reg', kelengkapan: 'Notula rapat, draf surat permohonan', waktu: '1 Jam', output: 'Konsep Surat Permohonan Pemindahan', keterangan: '' },
          { no: '3', kegiatan: 'Mengajukan permohonan pemindahan deteni kepada Kakanwil', pelaksana: 'Kepala', kelengkapan: 'Konsep surat permohonan resmi', waktu: '1 Jam', output: 'Surat Permohonan Pemindahan resmi', keterangan: '' },
          { no: '4', kegiatan: 'Menindaklanjuti permohonan pemindahan deteni ke Ditjenim', pelaksana: 'Kanwil', kelengkapan: 'Surat permohonan Rudenim', waktu: '1 Hari', output: 'Surat Permohonan dari Kanwil', keterangan: '' },
          { no: '5', kegiatan: 'Menerbitkan surat keputusan persetujuan pemindahan deteni', pelaksana: 'Ditjenim', kelengkapan: 'Berkas permohonan Kanwil', waktu: '3 Hari', output: 'Surat Keputusan Persetujuan Ditjenim', keterangan: '' },
          { no: '6', kegiatan: 'Meneruskan surat persetujuan pemindahan deteni kepada Rudenim', pelaksana: 'Kanwil', kelengkapan: 'Surat persetujuan Ditjenim', waktu: '1 Hari', output: 'Surat persetujuan & disposisi Kanwil', keterangan: '' },
          { no: '7', kegiatan: 'Menindaklanjuti surat persetujuan pemindahan deteni', pelaksana: 'Kepala', kelengkapan: 'Surat persetujuan, disposisi Kepala', waktu: '1 Jam', output: 'Disposisi pelaksanaan mutasi', keterangan: '' },
          { no: '8', kegiatan: 'Menyiapkan administrasi pemindahan deteni & koordinasi UPT tujuan', pelaksana: 'Kasi Reg', kelengkapan: 'Aplikasi SIMKIM/Sisumaker, draf SP pengawalan', waktu: '1 Jam', output: 'SP Pengawalan & SP Pengeluaran', keterangan: '' },
          { no: '9', kegiatan: 'Mengeluarkan deteni dari blok sel & serah terima berkas ke pengawal', pelaksana: 'Kasi Reg', kelengkapan: 'Kunci blok, portofolio deteni, barang bawaan', waktu: '1 Jam', output: 'Berita acara serah terima pengawal', keterangan: '' },
          { no: '10', kegiatan: 'Melaksanakan pengawalan fisik deteni ke Rudenim tujuan', pelaksana: 'Kasi Kamtib', kelengkapan: 'Borgol, HT, tiket, berkas administrasi', waktu: '3 Hari', output: 'Laporan pengawalan fisik', keterangan: 'Pengawalan udara/darat.' },
          { no: '11', kegiatan: 'Melakukan serah terima deteni kepada Rudenim penerima', pelaksana: 'Kasi Kamtib', kelengkapan: 'BAST tujuan, berkas deteni', waktu: '1 Jam', output: 'Berita acara serah terima UPT tujuan', keterangan: '' },
          { no: '12', kegiatan: 'Melaporkan pelaksanaan kegiatan kepada Kakanwil', pelaksana: 'Kepala', kelengkapan: 'BAST ditandatangani UPT tujuan', waktu: '1 Hari', output: 'Laporan pelaksanaan kegiatan resmi', keterangan: 'Selesai.' }
        ]),
        emptyRow(),
        justifiedPara([trb('Langkah demi Langkah Prosedur Kerja:')], { indent: false }),
        ...resetList(),
        numberedItemRuns([trb('Langkah 1: '), tr('Kasi Reg mengidentifikasi deteni yang memenuhi alasan pemindahan (overcapacity/keamanan) & mengadakan rapat koordinasi.')]),
        numberedItemRuns([trb('Langkah 2: '), tr('Operator Registrasi menyusun draf Surat Permohonan Pemindahan ke Kanwil Kemenkumham.')]),
        numberedItemRuns([trb('Langkah 3: '), tr('Kepala Rudenim menandatangani Surat Permohonan resmi dan mengirimkannya ke Kepala Divisi Keimigrasian Kanwil.')]),
        numberedItemRuns([trb('Langkah 4: '), tr('Kanwil memeriksa permohonan, menyusun rekomendasi pengantar, & mengirimkannya ke Direktorat Jenderal Imigrasi.')]),
        numberedItemRuns([trb('Langkah 5: '), tr('Ditjenim (Wasdakim) menelaah kelayakan & kapasitas nasional, lalu menerbitkan Surat Keputusan Persetujuan Pemindahan.')]),
        numberedItemRuns([trb('Langkah 6: '), tr('Ditjenim mendistribusikan surat persetujuan tersebut ke Kanwil untuk diteruskan kepada Kepala Rudenim Pontianak.')]),
        numberedItemRuns([trb('Langkah 7: '), tr('Kepala Rudenim menandatangani disposisi pelaksanaan mutasi deteni kepada Kasi Reg & Kasi Kamtib.')]),
        numberedItemRuns([trb('Langkah 8: '), tr('Seksi Reg menerbitkan Surat Perintah Pengeluaran Deteni, Surat Perintah Pengawalan, & berkoordinasi dengan Rudenim tujuan.')]),
        numberedItemRuns([trb('Langkah 9: '), tr('Petugas mengeluarkan deteni dari sel hunian, mengembalikan barang titipan, & menyerahkan berkas portofolio kasus kepada pengawal.')]),
        numberedItemRuns([trb('Langkah 10: '), tr('Petugas Kamtib melaksanakan pengawalan fisik melekat deteni selama perjalanan menggunakan transportasi publik/dinas.')]),
        numberedItemRuns([trb('Langkah 11: '), tr('Petugas menyerahkan deteni secara fisik beserta berkas portofolio & menandatangani BAST dengan pejabat Rudenim tujuan.')]),
        numberedItemRuns([trb('Langkah 12: '), tr('Kepala Rudenim menyusun Laporan Pelaksanaan Kegiatan Pemindahan Deteni untuk dikirimkan secara berkala ke Kanwil & Ditjenim.')]),
        justifiedPara([trb('Alur Integrasi SIMKIM: '), tr('Saat deteni dipindahkan, status kepemilikan data deteni (transfer ownership) ditransfer secara sistem di dalam database SIMKIM terpusat dari Rudenim Pontianak ke Rudenim tujuan.')]),
        emptyRow(),

        heading3('7. SOP Pendeportasian Deteni'),
        justifiedPara([
          tr('SOP Pendeportasian Deteni menjadi kulminasi dari seluruh rangkaian masa pendetensian orang asing. Tahap akhir ini diawali dengan verifikasi dokumen keimigrasian (paspor aktif atau SPLP dari perwakilan negara asing) serta konfirmasi tiket kepulangan yang valid. Selanjutnya, Seksi Registrasi menyiapkan berkas Surat Keputusan Pengeluaran Deteni (SKPD) dan Surat Perintah Pendeportasian (SPP) untuk disahkan oleh Kepala Rudenim. Petugas Kamtib kemudian mengawal deteni secara melekat dari kantor menuju Tempat Pemeriksaan Imigrasi (TPI) di bandara. Setelah proses keberangkatan selesai, status deteni diubah di SIMKIM menjadi "Sudah Dideportasi" sebagai tanda siklus pendetensiannya berakhir.')
        ]),
        ...insertFlowchartImage('sop_deportasi_flowchart.png', 'Flowchart SOP Pendeportasian Deteni Ke Negara Asal', 380),
        tableCaptionCentered('Mutu Baku SOP Pendeportasian Deteni'),
        createMutuBakuTable([
          { no: '1', kegiatan: 'Mengusulkan data deteni yang sudah siap dilakukan pendeportasian', pelaksana: 'Kasi Reg', kelengkapan: 'Paspor/SPLP, tiket penerbangan valid', waktu: '20 Menit', output: 'Nota Dinas usulan deportasi', keterangan: 'Mulai.' },
          { no: '2', kegiatan: 'Memimpin rapat koordinasi teknis pelaksanaan pemulangan paksa', pelaksana: 'Kepala', kelengkapan: 'Ruang rapat, nota dinas, absensi, kamera', waktu: '60 Menit', output: 'Notulen rapat persiapan', keterangan: '' },
          { no: '3', kegiatan: 'Menyusun konsep SK deportasi, SP pengawalan, & usulan penangkalan', pelaksana: 'Kasi Reg', kelengkapan: 'Notulensi rapat, aplikasi Sisumaker', waktu: '15 Menit', output: 'Draf SK deportasi & usulan cekal', keterangan: '' },
          { no: '4', kegiatan: 'Menyusun konsep Surat Perintah Pengeluaran Deteni (SPPD)', pelaksana: 'Kasubseksi Admin', kelengkapan: 'Notulensi rapat, aplikasi Sisumaker', waktu: '15 Menit', output: 'Draf SPPD', keterangan: '' },
          { no: '5', kegiatan: 'Menandatangani berkas keputusan deportasi & surat-surat perintah', pelaksana: 'Kepala', kelengkapan: 'Draf SK & SP, cap dinas', waktu: '30 Menit', output: 'SK Deportasi & SP Pengawalan ditandatangani', keterangan: '' },
          { no: '6', kegiatan: 'Menginput data rencana pendeportasian deteni ke modul SIMKIM', pelaksana: 'Kasubseksi Admin', kelengkapan: 'Komputer, jaringan, printer, scanner, SIMKIM', waktu: '60 Menit', output: 'Register pendeportasian SIMKIM', keterangan: '' },
          { no: '7', kegiatan: 'Menerakan cap stempel deportasi resmi pada paspor/SPLP deteni', pelaksana: 'Kasubseksi Admin', kelengkapan: 'Cap deportasi, paspor deteni', waktu: '5 Menit', output: 'Teraan cap deportasi di paspor', keterangan: '' },
          { no: '8', kegiatan: 'Pengajuan paspor tercap deportasi untuk disahkan', pelaksana: 'Kasi Reg', kelengkapan: 'Paspor tercap, berkas pendeportasian', waktu: '5 Menit', output: 'Paspor siap ditandatangani', keterangan: '' },
          { no: '9', kegiatan: 'Menandatangani cap deportasi di paspor & perintah pengeluaran', pelaksana: 'Kepala', kelengkapan: 'Paspor tercap, surat keputusan', waktu: '15 Menit', output: 'Penandatanganan cap deportasi', keterangan: '' },
          { no: '10', kegiatan: 'Mengeluarkan deteni dari sel & serah terima fisik/barang bawaan', pelaksana: 'Kasi Kamtib', kelengkapan: 'BAST deteni, kunci kamar, loker barang bawaan', waktu: '20 Menit', output: 'Berita Acara Serah Terima Deteni', keterangan: '' },
          { no: '11', kegiatan: 'Melaksanakan pengawalan fisik deteni ke bandara hingga boarding', pelaksana: 'Fungsional', kelengkapan: 'SK TAK, SP Pengawalan, dokumen paspor, tiket', waktu: '3 Hari', output: 'Pendeportasian deteni & cap keberangkatan', keterangan: 'Hingga deteni masuk pesawat.' },
          { no: '12', kegiatan: 'Menyusun & mengirimkan laporan pelaksanaan pendeportasian ke Kanwil', pelaksana: 'Kasi Reg', kelengkapan: 'Laporan tertulis, foto boarding, BAST bandara', waktu: '1 Hari', output: 'Laporan pelaksanaan deportasi resmi', keterangan: 'Selesai.' }
        ]),
        emptyRow(),
        justifiedPara([trb('Langkah demi Langkah Prosedur Kerja:')], { indent: false }),
        ...resetList(),
        numberedItemRuns([trb('Langkah 1: '), tr('Kasi Reg mengajukan Nota Dinas usulan deportasi deteni yang memiliki tiket penerbangan valid serta dokumen perjalanan (Paspor/SPLP).')]),
        numberedItemRuns([trb('Langkah 2: '), tr('Kepala Rudenim mengadakan rapat persiapan bersama seksi Registrasi, Kamtib, dan petugas intelijen keimigrasian.')]),
        numberedItemRuns([trb('Langkah 3: '), tr('Seksi Registrasi menyusun draf Keputusan TAK deportasi, Surat Perintah Pengawalan, & usulan pencegahan/penangkalan cekal terpusat.')]),
        numberedItemRuns([trb('Langkah 4: '), tr('Kasubseksi Admin menyusun draf Surat Perintah Pengeluaran Deteni (SPPD) untuk memproses pelepasan fisik.')]),
        numberedItemRuns([trb('Langkah 5: '), tr('Kepala Rudenim memeriksa dan menandatangani seluruh berkas keputusan pendeportasian & surat perintah secara serentak.')]),
        numberedItemRuns([trb('Langkah 6: '), tr('Kasubseksi Admin merekam data rencana pendeportasian & mengupload softcopy tiket/paspor ke aplikasi SIMKIM.')]),
        numberedItemRuns([trb('Langkah 7: '), tr('Kasubseksi Admin menerakan cap stempel deportasi resmi pada halaman paspor atau lembar SPLP deteni.')]),
        numberedItemRuns([trb('Langkah 8: '), tr('Kasi RAP memeriksa teraan cap deportasi pada paspor & mengajukannya kepada Kepala Rudenim.')]),
        numberedItemRuns([trb('Langkah 9: '), tr('Kepala Rudenim menandatangani langsung di atas teraan cap deportasi paspor deteni sebagai legalitas keberangkatan.')]),
        numberedItemRuns([trb('Langkah 10: '), tr('Kasi Kamtib mengeluarkan deteni dari blok sel, menyerahkan sisa barang bawaan yang dititipkan, & melakukan serah terima fisik ke pengawal.')]),
        numberedItemRuns([trb('Langkah 11: '), tr('Tim pengawal (Fungsional) membawa deteni ke bandara, mengawal melalui imigrasi bandara (cap exit), hingga deteni masuk pesawat (boarding).')]),
        numberedItemRuns([trb('Langkah 12: '), tr('Kasi Reg menyusun Laporan Pelaksanaan Deportasi untuk dikirimkan secara resmi ke Kanwil & Direktorat Jenderal Imigrasi.')]),
        justifiedPara([trb('Alur Integrasi SIMKIM: '), tr('Setelah pendeportasian selesai, operator mengubah status deteni menjadi "Telah Dideportasi" di modul SIMKIM. Sistem terpusat secara otomatis mengirimkan data biometrik usulan penangkalan ke server Ditjenim Jakarta untuk memblokir deteni masuk kembali ke wilayah Indonesia.')]),
        emptyRow(),

        pageBreak(),

        // ═════════════════════════════════════════════════════════════
        // D. Analisis Integrasi (Leavitt's Diamond)
        // ═════════════════════════════════════════════════════════════
        heading2('D. Analisis Integrasi Struktur Organisasi, SIMKIM, dan SOP'),
        heading3('   (Perspektif Leavitt\'s Diamond Model)'),

        justifiedPara([
          tr('Guna membedah interaksi lintas-komponen antara struktur organisasi, penerapan SIMKIM, dan kepatuhan SOP di Rudenim Pontianak secara holistik, penulis menerapkan kerangka analisis '),
          trb('Leavitt\'s Diamond Model'),
          tr(' (1965). Harold J. Leavitt merumuskan bahwa organisasi bukanlah sekadar tumpukan fungsi terpisah, melainkan suatu kesatuan dinamis yang ditopang oleh empat pilar utama: Struktur ('),
          tri('Structure'),
          tr('), Tugas ('),
          tri('Task'),
          tr('), Teknologi ('),
          tri('Technology'),
          tr('), dan Sumber Daya Manusia ('),
          tri('People'),
          tr('). Hubungan timbal balik ini bersifat interdependen, di mana dinamika pada satu pilar secara otomatis mendistribusikan pengaruh ke tiga pilar lainnya. Kerangka konseptual ini digambarkan secara visual pada Gambar 2.10.')
        ]),

        // Diagram Leavitt
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80, before: 80, line: 480 },
          children: [
            new ImageRun({
              data: fs.readFileSync(path.join(__dirname, 'leavitt_diamond_rudenim.png')),
              type: 'png',
              transformation: getScaledDimensions('leavitt_diamond_rudenim.png', 450),
            }),
          ]
        }),
        new Paragraph({
          style: 'CaptionFigure',
          spacing: { after: 240, before: 80, line: 480 },
          children: [
            new TextRun({ text: "Gambar 2.", bold: true, font: 'Times New Roman', size: 24 }),
            new SequentialIdentifier("Gambar \\r 10"),
            new TextRun({ text: "\tKerangka Analisis Leavitt's Diamond Model pada Rumah Detensi Imigrasi Pontianak", bold: true, font: 'Times New Roman', size: 24 })
          ]
        }),
        tableSource('Sumber: Diadaptasi dari Leavitt (1965), diolah peneliti (2026).'),

        justifiedPara([tr('Bersandarkan pada visualisasi model di atas, berikut dipaparkan hasil analisis keterkaitan antarpilar organisasi di Rudenim Pontianak:')]),

        heading3('1. Elemen Struktur (Structure)'),
        justifiedPara([
          tr('Pembagian peran di Rudenim Pontianak terpetakan secara formal ke dalam empat unit kerja utama yang memandu siklus hidup deteni dari awal hingga akhir. Adanya tata tingkat (hierarki) yang tegas dari level Kepala Rudenim hingga pelaksana teknis menjamin garis komando ('),
          tri('chain of command'),
          tr(') berjalan tanpa hambatan. Spesialisasi tugas yang memisahkan Seksi Registrasi (otoritas data digital), Seksi Kamtib (kontrol keamanan fisik), serta Seksi Perawatan (pemenuhan hak dasar) terbukti mendorong efisiensi kerja. Walau demikian, kekakuan struktural kerap memicu hambatan dalam situasi darurat di mana koordinasi lintas seksi dituntut berjalan instan tanpa harus tersangkut jalur birokrasi yang panjang.')
        ]),

        heading3('2. Elemen Tugas (Task)'),
        justifiedPara([
          tr('Seluruh mandat operasional UPT dikristalisasikan dalam bentuk tujuh SOP utama yang mengawal pergerakan deteni secara berurutan. Setiap SOP menjabarkan batasan wewenang, tahapan aktivitas, serta keluaran ('),
          tri('output'),
          tr(') dokumen yang harus dipenuhi. Keberadaan SOP ini memegang fungsi krusial sebagai jembatan yang menghubungkan kejelasan peran dalam struktur organisasi dengan fungsionalitas teknologi SIMKIM. Tanpa panduan prosedur yang mapan, pembagian tugas dalam struktur akan kehilangan arah, dan pemanfaatan sistem informasi keimigrasian akan berjalan tanpa orientasi yang jelas.')
        ]),

        heading3('3. Elemen Teknologi (Technology)'),
        justifiedPara([
          tr('Dalam lanskap modern Rudenim, SIMKIM bertindak sebagai simpul digital yang merekatkan seluruh lini operasional. Sistem ini mengeliminasi inefisiensi pencatatan manual lewat penyimpanan data terpusat, serta mempercepat pertukaran informasi antar-UPT keimigrasian secara nirkabel dan '),
          tri('real-time'),
          tr('. Kendati begitu, kinerja SIMKIM tidak berdiri di ruang hampa; kegunaannya disokong penuh oleh infrastruktur fisik (jaringan internet daerah dan perangkat keras) serta kesiapan operator di lapangan. Beberapa hambatan operasional seperti gangguan koneksi dan perangkat biometrik yang usang menjadi bukti bahwa teknologi tidak akan berjalan optimal tanpa keselarasan pilar lainnya.')
        ]),

        heading3('4. Elemen Sumber Daya Manusia (People)'),
        justifiedPara([
          tr('Sebagai penggerak utama seluruh sistem, unsur Sumber Daya Manusia (SDM) merupakan pilar paling dinamis di bawah kerangka model Leavitt. Komposisi personel di Rudenim Pontianak terdistribusi mulai dari unsur kepemimpinan strategis, manajer menengah (Kepala Seksi), hingga garda pelaksana (operator registrasi, pengawal Kamtib, dan nakes). Tingkat kemahiran pegawai dalam menavigasi aplikasi SIMKIM serta komitmen mematuhi SOP menjadi penentu keberhasilan integrasi sistem. Oleh karena itu, kebijakan rotasi staf yang dinamis harus dibarengi dengan transfer pengetahuan atau pelatihan sistem berkelanjutan demi mencegah penurunan performa pelayanan di lapangan.')
        ]),

        heading3('5. Analisis Keterkaitan Antar Elemen'),
        justifiedPara([
          tr('Melalui kacamata Leavitt\'s Diamond Model, dapat ditarik benang merah bahwa pilar-pilar organisasi di Rudenim Pontianak bertaut secara mutlak. Mengisolasi atau mengabaikan salah satu pilar saat mencoba merestrukturisasi pelayanan publik keimigrasian terbukti tidak efektif. Untuk mempermudah pemahaman mengenai interdependensi ini, matriks keterkaitan antarelemen dirangkum sebagai berikut:')
        ]),

        // Tabel Keterkaitan
        tableCaptionCentered('Matriks Keterkaitan Antar Elemen Leavitt\'s Diamond'),
        new Table({
          alignment: AlignmentType.CENTER,
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [2200, 2700, 3037],
          rows: [
            new TableRow({
              children: [
                cellPara('Hubungan Elemen', { width: 2200, bold: true, center: true, borders: bordersHeader }),
                cellPara('Bentuk Keterkaitan', { width: 2700, bold: true, center: true, borders: bordersHeader }),
                cellPara('Implikasi di Rudenim Pontianak', { width: 3037, bold: true, center: true, borders: bordersHeader }),
              ]
            }),
            new TableRow({
              children: [
                cellPara('Struktur ↔ Tugas (SOP)', { width: 2200, borders: bordersMiddle }),
                cellPara('Pembagian tugas dalam SOP mengikuti pembagian unit kerja dalam struktur organisasi.', { width: 2700, borders: bordersMiddle }),
                cellPara('Setiap SOP secara eksplisit menyebutkan seksi yang bertanggung jawab.', { width: 3037, borders: bordersMiddle }),
              ]
            }),
            new TableRow({
              children: [
                cellPara('Struktur ↔ Teknologi (SIMKIM)', { width: 2200, borders: bordersMiddle }),
                cellPara('Hak akses modul SIMKIM disesuaikan dengan posisi jabatan dalam struktur.', { width: 2700, borders: bordersMiddle }),
                cellPara('Operator registrasi memiliki akses input, Kasi memiliki akses supervisory.', { width: 3037, borders: bordersMiddle }),
              ]
            }),
            new TableRow({
              children: [
                cellPara('Tugas (SOP) ↔ Teknologi (SIMKIM)', { width: 2200, borders: bordersMiddle }),
                cellPara('Hampir seluruh SOP mensyaratkan penggunaan SIMKIM pada tahapannya.', { width: 2700, borders: bordersMiddle }),
                cellPara('SOP Registrasi wajib input biometrik, SOP Deportasi wajib update status.', { width: 3037, borders: bordersMiddle }),
              ]
            }),
            new TableRow({
              children: [
                cellPara('SDM ↔ Teknologi', { width: 2200, borders: bordersMiddle }),
                cellPara('Kompetensi SDM menentukan kualitas input data di SIMKIM.', { width: 2700, borders: bordersMiddle }),
                cellPara('Petugas terlatih menghasilkan data biometrik akurat; sebaliknya, human error meningkat.', { width: 3037, borders: bordersMiddle }),
              ]
            }),
            new TableRow({
              children: [
                cellPara('SDM ↔ Tugas (SOP)', { width: 2200, borders: bordersMiddle }),
                cellPara('SDM melaksanakan SOP; pemahaman SDM terhadap SOP menentukan kualitas layanan.', { width: 2700, borders: bordersMiddle }),
                cellPara('Pelatihan berkala diperlukan agar seluruh petugas memahami prosedur terbaru.', { width: 3037, borders: bordersMiddle }),
              ]
            }),
            new TableRow({
              children: [
                cellPara('SDM ↔ Struktur', { width: 2200, borders: bordersBottom }),
                cellPara('Penempatan SDM dalam struktur harus sesuai kompetensi.', { width: 2700, borders: bordersBottom }),
                cellPara('Rotasi pegawai tanpa pelatihan memadai menyebabkan penurunan kinerja unit.', { width: 3037, borders: bordersBottom }),
              ]
            }),
          ]
        }),
        tableSource('Sumber: Analisis peneliti berdasarkan Leavitt\'s Diamond Model (2026).'),

        justifiedPara([
          tr('Matriks di atas menegaskan kembali hukum interdependensi: disfungsi atau pembaharuan pada satu elemen dipastikan memicu efek domino pada elemen lain. Sebagai contoh konkrit, bila Direktorat Jenderal Imigrasi meluncurkan pembaruan perangkat lunak SIMKIM (pilar teknologi), maka Rudenim Pontianak wajib menyesuaikan instruksi teknis (pilar tugas), melatih ulang operator (pilar SDM), serta mengkalibrasi ulang otoritas akses berdasarkan jenjang jabatan (pilar struktur). Fenomena ini memperkuat argumentasi ilmiah mengenai pentingnya tata kelola perubahan yang terintegrasi dan menyeluruh.')
        ]),

        pageBreak(),
      ]
    },
    // ═══════════════════════════════════════════════════════════════
    // SECTION 6: BAB III - PENUTUP
    // ═══════════════════════════════════════════════════════════════
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: M_TOP, right: M_RIGHT, bottom: M_BOTTOM, left: M_LEFT }
        },
        titlePage: true
      },
      headers: chapterPageSetup.headers,
      footers: chapterPageSetup.footers,
      children: [
        chapterHeader('BAB III', 'PENUTUP'),

        // A. Kesimpulan
        heading2('A. Kesimpulan'),
        justifiedPara([tr('Berdasarkan pembahasan yang telah diuraikan, dapat ditarik beberapa kesimpulan sebagai berikut:')], { indent: false }),
        ...resetList(),
        numberedItemRuns([
          tr('Rantai birokrasi dan operasional Rudenim Pontianak secara formal terbagi ke dalam lima unit utama: Kepala Rudenim, Subbagian Tata Usaha, Seksi Registrasi, Seksi Keamanan dan Ketertiban, serta Seksi Perawatan dan Kesehatan. Pembagian ini cukup efektif dalam menciptakan spesialisasi fungsi kerja dan efisiensi harian. Kendati demikian, di lapangan sinergi koordinasi antar-seksi masih menghadapi celah hambatan, khususnya ketika dituntut merespons situasi darurat secara cepat.')
        ]),
        numberedItemRuns([
          tr('Sebagai basis teknologi pendukung, aplikasi SIMKIM berperan vital menyatukan pencatatan administratif deteni melalui empat modul utama (pendataan, pengawasan cekal, manifest pelaporan, dan pendeportasian). Implementasi sistem ini sayangnya masih dibayangi kendala klasik seperti jaringan internet yang lambat, kualitas fisik pemindai biometrik yang menurun, tuntutan pencatatan ganda manual-digital, serta belum meratanya literasi sistem bagi pegawai baru.')
        ]),
        numberedItemRuns([
          tr('Ketujuh SOP yang berlaku telah berhasil menyusun jalannya siklus hidup deteni dari proses penerimaan awal hingga pemulangan paksa ke negara asal. Mengingat hampir setiap fase kegiatan operasional di lapangan mewajibkan input data ke sistem komputer, dapat disimpulkan bahwa integrasi antara prosedur kerja standar dan sistem teknologi informasi keimigrasian di Rudenim Pontianak terjalin sangat erat.')
        ]),
        numberedItemRuns([
          tr('Berdasarkan analisis Leavitt\'s Diamond Model, keempat pilar organisasi (Struktur, Tugas, Teknologi, dan Manusia) di Rudenim Pontianak terikat dalam hubungan saling mempengaruhi secara dinamis. Mengakselerasi salah satu pilar secara sektoral tanpa membenahi pilar lainnya hanya akan memicu inefisiensi baru. Oleh karena itu, perbaikan manajemen deteni harus bertumpu pada pendekatan terpadu yang menyelaraskan keempat elemen tersebut.')
        ]),

        // B. Saran
        heading2('B. Saran'),
        justifiedPara([tr('Berdasarkan kesimpulan di atas, penulis memberikan beberapa saran sebagai berikut:')], { indent: false }),
        ...resetList(),
        numberedItemRuns([
          trb('Modernisasi Infrastruktur Jaringan: '),
          tr('Direktorat Jenderal Imigrasi perlu memberikan atensi lebih pada penyediaan kapasitas bandwidth yang memadai serta kestabilan jaringan internet pada UPT daerah. Langkah ini sangat krusial bagi Rudenim Pontianak agar akses ke database pusat SIMKIM tidak mengalami hambatan sinkronisasi data biometrik.')
        ]),
        numberedItemRuns([
          trb('Peremajaan Perangkat Keras Biometrik: '),
          tr('Perlu dilakukan inventarisasi dan penggantian unit pemindai sidik jari serta kamera digital yang telah usang di ruang pelayanan registrasi. Pengadaan alat baru akan mempercepat proses antrean pendaftaran deteni sekaligus menjamin akurasi data biometrik yang terekam.')
        ]),
        numberedItemRuns([
          trb('Penyatuan Buku Mutasi Digital: '),
          tr('Ditjen Imigrasi disarankan mengembangkan sub-modul pencatatan keamanan pada SIMKIM. Integrasi ini bertujuan menyatukan buku laporan fisik (logbook) regu jaga Kamtib dengan status digital di sistem, sehingga petugas tidak perlu lagi melakukan penginputan ganda ('),
          tri('double entry'),
          tr(') yang memicu risiko human error.')
        ]),
        numberedItemRuns([
          trb('Pelatihan Sistem Berkelanjutan: '),
          tr('Rudenim Pontianak sebaiknya merancang bimbingan teknis SIMKIM secara rutin bagi pegawai baru hasil rotasi jabatan. Pemanfaatan platform '),
          tri('e-learning'),
          tr(' internal kementerian dapat menjadi solusi efisien untuk menyamakan kompetensi teknis operasional sistem di kalangan petugas lapangan.')
        ]),
        numberedItemRuns([
          trb('Evaluasi Manajemen Holistik: '),
          tr('Manajemen Rudenim Pontianak disarankan mengadopsi instrumen evaluasi kinerja organisasi secara komprehensif, seperti menggunakan kerangka Leavitt\'s Diamond Model. Pemantauan berkala ini penting guna memastikan keselarasan antara restrukturisasi unit, pembaruan prosedur kerja (SOP), dan peningkatan kapasitas SDM seiring perkembangan zaman.')
        ]),

        pageBreak(),

        // DAFTAR PUSTAKA
        frontMatterHeader('DAFTAR PUSTAKA'),

        daftarPustakaEntry([
          tr('Leavitt, H. J. (1965). Applied organizational change in industry: Structural, technological, and humanistic approaches. Dalam J. G. March (Ed.), '),
          tri('Handbook of Organizations'),
          tr(' (pp. 1144–1170). Chicago: Rand McNally.')
        ]),
        daftarPustakaEntry([
          tr('Laudon, K. C., & Laudon, J. P. (2020). '),
          tri('Management Information Systems: Managing the Digital Firm'),
          tr(' (16th ed.). New York: Pearson Education.')
        ]),
        daftarPustakaEntry([
          tr('O\'Brien, J. A., & Marakas, G. M. (2018). '),
          tri('Management Information Systems'),
          tr(' (11th ed.). Boston: McGraw-Hill/Irwin.')
        ]),
        daftarPustakaEntry([
          tr('Republik Indonesia. (2011). '),
          tri('Undang-Undang Nomor 6 Tahun 2011 tentang Keimigrasian'),
          tr('. Lembaran Negara RI Tahun 2011 Nomor 52. Jakarta.')
        ]),
        daftarPustakaEntry([
          tr('Republik Indonesia. (2013). '),
          tri('Peraturan Pemerintah Nomor 31 Tahun 2013 tentang Peraturan Pelaksanaan Undang-Undang Nomor 6 Tahun 2011 tentang Keimigrasian'),
          tr('. Lembaran Negara RI Tahun 2013 Nomor 68. Jakarta.')
        ]),
        daftarPustakaEntry([
          tr('Keputusan Menteri Kehakiman dan Hak Asasi Manusia RI Nomor M.01-PR.07.04 Tahun 2004 tentang '),
          tri('Organisasi dan Tata Kerja Rumah Detensi Imigrasi'),
          tr('. Jakarta.')
        ]),
        daftarPustakaEntry([
          tr('Peraturan Direktur Jenderal Imigrasi Nomor IMI.1917-OT.02.01 Tahun 2013 tentang '),
          tri('Standar Operasional Prosedur Rumah Detensi Imigrasi'),
          tr('. Jakarta: Direktorat Jenderal Imigrasi.')
        ]),
        daftarPustakaEntry([
          tr('Peraturan Presiden Republik Indonesia Nomor 139 Tahun 2024 tentang '),
          tri('Kementerian Imigrasi dan Pemasyarakatan'),
          tr('. Jakarta.')
        ]),
        daftarPustakaEntry([
          tr('Robbins, S. P., & Judge, T. A. (2019). '),
          tri('Organizational Behavior'),
          tr(' (18th ed.). New York: Pearson Education.')
        ]),
        daftarPustakaEntry([
          tr('Rumah Detensi Imigrasi Pontianak. (2026). Profil dan Struktur Organisasi. Diperoleh dari '),
          tri('https://rudenimpontianak.imigrasi.go.id/'),
          tr('. Diakses pada tanggal 17 Juni 2026.')
        ]),
      ]
    }
  ]
});

// Write document to file
Packer.toBuffer(doc).then((buffer) => {
  const outputPath = path.join(__dirname, 'MAKALAH_SIM_AJIE_BARIANDONO_2110426823_v2.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Document berhasil dibangun: ${outputPath}`);

  // Write JSON metadata
  const docMetadata = {
    title: "ANALISIS STRUKTUR ORGANISASI, SISTEM INFORMASI MANAJEMEN KEIMIGRASIAN (SIMKIM), DAN STANDAR OPERASIONAL PROSEDUR (SOP) PADA RUMAH DETENSI IMIGRASI PONTIANAK",
    author: "AJIE BARIANDONO",
    nim: "2110426823",
    university: "UNIVERSITAS PANCA BHAKTI",
    faculty: "FAKULTAS EKONOMI DAN BISNIS",
    department: "PROGRAM STUDI AKUNTANSI",
    year: "2026",
    table_of_contents: [
      { title: "KATA PENGANTAR", page: "i" },
      { title: "DAFTAR ISI", page: "ii" },
      { title: "DAFTAR TABEL", page: "iii" },
      { title: "DAFTAR GAMBAR", page: "iv" },
      { title: "BAB I PENDAHULUAN", page: "1" },
      { title: "A. Latar Belakang", page: "1" },
      { title: "B. Rumusan Masalah", page: "3" },
      { title: "C. Tujuan Penulisan", page: "3" },
      { title: "BAB II PEMBAHASAN", page: "4" },
      { title: "A. Struktur Organisasi Rumah Detensi Imigrasi Pontianak", page: "4" },
      { title: "B. Sistem Informasi Manajemen Keimigrasian (SIMKIM)", page: "6" },
      { title: "C. Standar Operasional Prosedur (SOP) Rudenim Pontianak", page: "8" },
      { title: "D. Analisis Integrasi Struktur, SIMKIM, dan SOP", page: "17" },
      { title: "BAB III PENUTUP", page: "19" },
      { title: "A. Kesimpulan", page: "19" },
      { title: "B. Saran", page: "19" },
      { title: "DAFTAR PUSTAKA", page: "20" }
    ],
    tables: [
      { num: "2.1", title: "Mutu Baku SOP Penerimaan Calon Deteni", page: "9" },
      { num: "2.2", title: "Mutu Baku SOP Pemeriksaan Kesehatan Deteni", page: "11" },
      { num: "2.3", title: "Mutu Baku SOP Registrasi Deteni", page: "12" },
      { num: "2.4", title: "Mutu Baku SOP Penempatan Deteni", page: "13" },
      { num: "2.5", title: "Mutu Baku SOP Penjagaan & Pengamanan Deteni", page: "14" },
      { num: "2.6", title: "Mutu Baku SOP Pemindahan Deteni", page: "15" },
      { num: "2.7", title: "Mutu Baku SOP Pendeportasian Deteni", page: "16" },
      { num: "2.8", title: "Matriks Keterkaitan Antar Elemen Leavitt's Diamond", page: "18" }
    ],
    figures: [
      { num: "2.1", title: "Struktur Organisasi Rudenim Pontianak", page: "4" },
      { num: "2.2", title: "Flowchart Siklus Hidup Deteni Terintegrasi dengan 7 SOP", page: "8" },
      { num: "2.3", title: "Flowchart SOP Penerimaan Calon Deteni", page: "8" },
      { num: "2.4", title: "Flowchart SOP Pemeriksaan Kesehatan Deteni", page: "10" },
      { num: "2.5", title: "Flowchart SOP Registrasi Deteni", page: "11" },
      { num: "2.6", title: "Flowchart SOP Penempatan Deteni Ke Blok Hunian", page: "12" },
      { num: "2.7", title: "Flowchart SOP Penjagaan & Pengamanan Rudenim", page: "13" },
      { num: "2.8", title: "Flowchart SOP Pemindahan Deteni Antar Rudenim", page: "14" },
      { num: "2.9", title: "Flowchart SOP Pendeportasian Deteni Ke Negara Asal", page: "15" },
      { num: "2.10", title: "Kerangka Analisis Leavitt's Diamond Model", page: "17" }
    ]
  };

  const jsonOutputPath = path.join(__dirname, 'makalah_sim_v2.json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(docMetadata, null, 2), 'utf8');
  console.log(`✅ JSON metadata berhasil ditulis: ${jsonOutputPath}`);

  console.log(`   Struktur: 3 BAB (Pendahuluan, Pembahasan, Penutup) + Daftar Tabel/Gambar`);
  console.log(`   Topik: Struktur Organisasi, SIMKIM, SOP - Rudenim Pontianak`);
  console.log(`   Kerangka Teori: Leavitt's Diamond Model (1965)`);
}).catch((err) => {
  console.error("Error building document:", err);
});
