'use strict';
/**
 * docx_helpers.js — Modul shared yang berisi semua formatting rules
 * untuk dokumen akademis UPB (Universitas Panca Bhakti).
 * 
 * Diekstrak dari build_makalah.js agar bisa dipakai ulang oleh:
 * - build_makalah.js (dokumen asli, hardcoded)
 * - build_revisi.js (dokumen revisi, baca dari MD)
 */
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, Header, Footer,
  PositionalTab, PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader,
  TabStopType, TabStopPosition, NumberFormat, TableOfContents, ImageRun
} = require('docx');

// ── LAYOUT CONSTANTS ──────────────────────────────────────────────────
const PAGE_W = 11906;
const PAGE_H = 16838;
const M_TOP = 2268;
const M_BOTTOM = 1701;
const M_LEFT = 2268;
const M_RIGHT = 1701;
const CONTENT_W = PAGE_W - M_LEFT - M_RIGHT; // 7937

// ── BORDERS ───────────────────────────────────────────────────────────
const border0 = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const borders0 = { top: border0, bottom: border0, left: border0, right: border0 };
const borderSingle = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
const bordersAll = { top: borderSingle, bottom: borderSingle, left: borderSingle, right: borderSingle };

// ── HELPERS ───────────────────────────────────────────────────────────
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

// ── HEADERS & FOOTERS ─────────────────────────────────────────────────
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
      first: new Header({ children: [] })
    },
    footers: {
      default: new Footer({ children: [] }),
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

// ── DOCUMENT CONFIG ───────────────────────────────────────────────────
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

// ── EXPORTS ───────────────────────────────────────────────────────────
module.exports = {
  // docx re-exports
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, Header, Footer,
  PositionalTab, PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader,
  NumberFormat, ImageRun,
  // constants
  PAGE_W, PAGE_H, M_TOP, M_BOTTOM, M_LEFT, M_RIGHT, CONTENT_W,
  border0, borders0, borderSingle, bordersAll,
  // helpers
  emptyRow, centered, justifiedPara,
  tr, tri, trb,
  heading1, heading2, heading3,
  pageBreak, numberedItem,
  cellPara, cellParaRuns,
  tableCaptionCentered, tableSource, daftarPustakaEntry,
  // structure
  createFrontMatterFooter, createChapterHeadersAndFooters,
  numberingConfig, stylesConfig,
};
