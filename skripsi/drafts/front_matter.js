'use strict';
/**
 * front_matter.js — Front-matter sections (Cover, Lembar Persetujuan,
 * Kata Pengantar, Daftar Isi/Tabel/Gambar) extracted verbatim from
 * build_makalah.js for reuse by build_revisi.js.
 *
 * build_makalah.js TIDAK DISENTUH — file ini standalone.
 */

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, Header, Footer,
  PositionalTab, PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader,
  NumberFormat, ImageRun,
  PAGE_W, PAGE_H, M_TOP, M_BOTTOM, M_LEFT, M_RIGHT, CONTENT_W,
  border0, borders0, borderSingle, bordersAll,
  emptyRow, centered, justifiedPara,
  tr, tri, trb,
  heading1, heading2, heading3,
  pageBreak, numberedItem,
  cellPara, cellParaRuns,
  tableCaptionCentered, tableSource, daftarPustakaEntry,
  createFrontMatterFooter, createChapterHeadersAndFooters,
  numberingConfig, stylesConfig,
} = require('./docx_helpers');


// ── EXTRA HELPERS (from build_makalah.js, not in docx_helpers) ────────

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

function numberedItemRuns(runs) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 0, before: 0, line: 480 },
    numbering: { reference: 'arabic-numbering', level: 0 },
    children: runs
  });
}


// ══════════════════════════════════════════════════════════════════════
// FRONT-MATTER SECTIONS
// ══════════════════════════════════════════════════════════════════════

function buildFrontMatterSections() {
  const frontMatterFooter = createFrontMatterFooter();

  return [
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
    // SECTION 4: DAFTAR ISI + DAFTAR TABEL + DAFTAR GAMBAR
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
  ];
}


module.exports = { buildFrontMatterSections, tocEntry };
