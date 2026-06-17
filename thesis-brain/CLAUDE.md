# CLAUDE.md — LLM Wiki Agent Rules (Thesis & Research)

This document defines the instructions, formatting rules, and workflows for the AI Agent (Antigravity/Claude) managing this `thesis-brain` personal knowledge base.

---

## 🏛️ 1. Core Architecture

The vault is divided into two primary folders:
1. **`raw/`**: Immutable source files (PDFs, transkrip wawancara, regulasi, draf mentah).
2. **`wiki/`**: Flat compiled markdown database. **NO nested folders allowed**. Every file is directly under `wiki/` to ensure simple link resolution (e.g. `[[Rudenim_Pontianak]]` instead of `[[entities/Rudenim_Pontianak]]`).

---

## 🏷️ 2. File & Page Naming Conventions

* **Filenames inside `wiki/`**: Use `Capitalized_With_Underscores.md` (e.g. `Rudenim_Pontianak.md`, `Deviasi_Anggaran.md`, `Core_Tax_System.md`).
* **Wiki Links**: Link between pages using standard Obsidian double-brackets `[[Page_Name]]` (e.g. `[[Rudenim_Pontianak]]`).
* **Page Structure**: Every wiki page must begin with YAML frontmatter:
  ```yaml
  title: "Nama Topik / Konsep"
  type: "concept | entity | source | regulation"
  tags: [skripsi, anggaran, rudenim, pajak]
  sources: [makalah_seminar, buku_saku_pajak_dasar]
  ---
  ```

---

## 📂 3. Categories in index.md

The root `index.md` acts as the main portal for the Obsidian vault and must categorize wiki links under:
1. **📚 Sumber Daya & Acuan (Sources)**: e.g. `[[Source_Makalah_Seminar]]`
2. **🏢 Entitas Utama (Entities)**: e.g. `[[Rudenim_Pontianak]]`, `[[Ditjen_Imigrasi]]`
3. **📊 Konsep & Teori (Concepts)**: e.g. `[[Deviasi_Anggaran]]`, `[[Anggaran_Sektoral]]`
4. **⚖️ Regulasi & Kebijakan (Regulations)**: e.g. `[[UU_Harmonisasi_Peraturan_Perpajakan]]`

---

## ⚙️ 4. Agent Workflows & Prompts

### 📥 INGEST (Mengimpor data mentah dari `raw/`)
Ketika pengguna memerintahkan: *"Ingest raw/{filename}"*:
1. Baca file mentah tersebut secara menyeluruh.
2. Identifikasi konsep baru, entitas, dan regulasi yang disebutkan.
3. Untuk setiap topik penting, buat berkas baru di `wiki/` (atau sunting berkas yang sudah ada jika topiknya sama) dan integrasikan informasi baru tersebut.
4. Tambahkan *backlinks* `[[Target_Page]]` di paragraf yang relevan untuk menghubungkannya dengan halaman lain.
5. Perbarui `index.md` dengan menautkan halaman baru tersebut ke kategori yang sesuai.
6. Catat aktivitas di `log.md`.

### 🔍 LINT & AUDIT (Pembersihan & Konsistensi Data)
Ketika pengguna memerintahkan: *"Lint wiki"*:
1. Periksa semua berkas di `wiki/` untuk mendeteksi *broken links* (tautan ke berkas yang tidak ada).
2. Temukan halaman yatim-piatu (*orphan pages* — halaman yang tidak memiliki tautan masuk).
3. Cari informasi yang tumpang tindih atau kontradiktif antar berkas wiki, kemudian gabungkan (*merge*) atau beri tanda peringatan.
4. Pastikan semua berkas memiliki YAML frontmatter yang lengkap.
