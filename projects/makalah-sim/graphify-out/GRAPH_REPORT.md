# Graph Report - makalah-sim  (2026-06-19)

## Corpus Check
- 31 files · ~66,088 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 246 nodes · 249 edges · 30 communities (26 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a4cea3f8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 29|Community 29]]

## God Nodes (most connected - your core abstractions)
1. `render_flowchart()` - 9 edges
2. `ANALISIS PENERAPAN SISTEM INFORMASI MANAJEMEN KEIMIGRASIAN (SIMKIM) DALAM PENGELOLAAN ADMINISTRASI DETENSI PADA RUMAH DETENSI IMIGRASI PONTIANAK` - 8 edges
3. `3.5 Deskripsi Alur Operasional 7 SOP dan Integrasi SIMKIM` - 8 edges
4. `BAB III: METODE PENELITIAN & DESKRIPSI OPERASIONAL` - 6 edges
5. `BAB I: PENDAHULUAN` - 5 edges
6. `BAB II: TINJAUAN PUSTAKA` - 5 edges
7. `2.1 Landasan Teori` - 5 edges
8. `📝 Product Requirements Document (PRD) — Makalah SIM` - 5 edges
9. `tr()` - 4 edges
10. `insertFlowchartImage()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `draw_flowchart()` --calls--> `draw_arrow()`  [INFERRED]
  draw_flowcharts.py → draw_individual_flowcharts.py

## Import Cycles
- None detected.

## Communities (30 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (25): border0, borderNone, borders0, bordersAll, bordersBottom, bordersHeader, borderSingle, bordersMiddle (+17 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (22): border0, borders0, bordersAll, borderSingle, cellPara(), centered(), chapterPageSetup, createMutuBakuTable() (+14 more)

### Community 2 - "Community 2"
Cohesion: 0.17
Nodes (15): D(), draw_arrowhead(), draw_diamond(), draw_document(), draw_oval(), draw_process(), harrow(), _hh() (+7 more)

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (15): 3.1.1 Sejarah Kantor dan Profil Instansi, 3.1.2 Struktur Organisasi dan Tata Kerja, 3.1 Gambaran Umum Objek Penelitian, 3.2 Bentuk dan Subjek Penelitian, 3.3 Teknik Pengumpulan Data, 3.4 Teknik Pengolahan dan Analisis Data, 3.5.1 SOP Penerimaan Calon Deteni, 3.5.2 SOP Registrasi Deteni (SIMKIM) (+7 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (21): 1.1 Latar Belakang, 1.2 Rumusan Masalah, 1.3 Tujuan Penelitian, 1.4 Manfaat Penelitian, 2.1.1 Sistem Informasi Manajemen (SIM), 2.1.2 Sistem Informasi Manajemen Keimigrasian (SIMKIM), 2.1.3 Model Kesuksesan Sistem Informasi DeLone & McLean, 2.1.4 Konsep Detensi dan Struktur UPT Rumah Detensi Imigrasi (+13 more)

### Community 5 - "Community 5"
Cohesion: 0.18
Nodes (10): end, fs, image1RelMatch, index, path, rels, relsPath, start (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.20
Nodes (8): endIdx, fs, index, matches, path, startIdx, xml, xmlPath

### Community 7 - "Community 7"
Cohesion: 0.50
Nodes (3): doc, docx, fs

### Community 8 - "Community 8"
Cohesion: 0.22
Nodes (8): dependencies, docx, description, main, name, scripts, build, version

### Community 9 - "Community 9"
Cohesion: 0.22
Nodes (8): 🛠️ Aturan Layout dan Kompilasi, Dasar Hukum, 📊 Data Objek Penelitian, 📌 Metadata Projek, 📝 Product Requirements Document (PRD) — Makalah SIM, 🏛️ Sistematika Penulisan Makalah (3 Bab), SOP Utama Keimigrasian Rudenim, Struktur Organisasi Rudenim Pontianak

### Community 10 - "Community 10"
Cohesion: 0.25
Nodes (8): copyTexts, extractText(), fs, newItems, normalize(), originalSet, originalTexts, path

### Community 11 - "Community 11"
Cohesion: 0.33
Nodes (6): copyTexts, extractText(), fs, normalize(), originalTexts, path

### Community 12 - "Community 12"
Cohesion: 0.29
Nodes (6): fs, outputPath, paragraphs, path, xml, xmlPath

### Community 13 - "Community 13"
Cohesion: 0.47
Nodes (4): draw_flowchart(), draw_arrow(), generate_sop_flowchart(), wrap_text()

### Community 29 - "Community 29"
Cohesion: 0.11
Nodes (8): border0, borders0, bordersAll, borderSingle, doc, {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  PageNumber, PageBreak, Header, Footer,
  PositionalTab, PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader,
  TabStopType, NumberFormat, ImageRun,
  TableOfContents, SequentialIdentifier
}, fs, path

## Knowledge Gaps
- **115 isolated node(s):** `{
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  PageNumber, PageBreak, Header, Footer,
  PositionalTab, PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader,
  TabStopType, NumberFormat, ImageRun,
  TableOfContents, SequentialIdentifier
}`, `fs`, `path`, `border0`, `borders0` (+110 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ANALISIS PENERAPAN SISTEM INFORMASI MANAJEMEN KEIMIGRASIAN (SIMKIM) DALAM PENGELOLAAN ADMINISTRASI DETENSI PADA RUMAH DETENSI IMIGRASI PONTIANAK` connect `Community 4` to `Community 3`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `BAB III: METODE PENELITIAN & DESKRIPSI OPERASIONAL` connect `Community 3` to `Community 4`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `{
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  PageNumber, PageBreak, Header, Footer,
  PositionalTab, PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader,
  TabStopType, NumberFormat, ImageRun,
  TableOfContents, SequentialIdentifier
}`, `fs`, `path` to the rest of the system?**
  _120 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05897435897435897 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07308377896613191 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._