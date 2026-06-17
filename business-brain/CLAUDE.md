# CLAUDE.md — LLM Wiki Agent Rules (Business & Digital Products)

This document defines the instructions, formatting rules, and workflows for the AI Agent managing this `business-brain` personal knowledge base.

---

## 🏛️ 1. Core Architecture

The vault is divided into two primary folders:
1. **`raw/`**: Immutable source files (financial reports, marketing assets, copywriting drafts, Notion layouts, customer feedback).
2. **`wiki/`**: Flat compiled markdown database. **NO nested folders allowed**. Every file is directly under `wiki/` to ensure simple link resolution (e.g. `[[Product_Mastery_Kit]]` instead of `[[products/Product_Mastery_Kit]]`).

---

## 🏷️ 2. File & Page Naming Conventions

* **Filenames inside `wiki/`**: Use `Capitalized_With_Underscores.md` (e.g. `Jasa_PPT_Akuntansi.md`, `Marketing_Strategy.md`, `Notion_Template_Selling.md`).
* **Wiki Links**: Link between pages using standard Obsidian double-brackets `[[Page_Name]]`.
* **Page Structure**: Every wiki page must begin with YAML frontmatter:
  ```yaml
  title: "Nama Project / Strategi / Produk"
  type: "product | marketing | operation | finance"
  tags: [bisnis, ppt, notion, digital-product]
  sources: [jurnal_harian, roadmap_tasks]
  ---
  ```

---

## 📂 3. Categories in index.md

The root `index.md` acts as the main portal for the business Obsidian vault and must categorize wiki links under:
1. **🚀 Produk Digital & Jasa (Products & Services)**: e.g. `[[Jasa_PPT_Akuntansi]]`, `[[Mastery_Kit_Pajak_Dasar]]`
2. **📢 Pemasaran & Konten (Marketing & Content)**: e.g. `[[Twitter_Marketing_Strategy]]`, `[[Landing_Page_Copywriting]]`
3. **⚙️ Operasional & Sistem (Operations & Systems)**: e.g. `[[Notion_Template_Design_System]]`, `[[Product_Delivery_Automation]]`
4. **📊 Keuangan & Administrasi (Finance & Admin)**: e.g. `[[Monthly_Revenue_Tracker]]`

---

## ⚙️ 4. Agent Workflows & Prompts

### 📥 INGEST (Mengimpor data mentah dari `raw/`)
Ketika pengguna memerintahkan: *"Ingest raw/{filename}"*:
1. Baca file mentah tersebut secara menyeluruh.
2. Identifikasi produk, rencana pemasaran, operasional, atau data keuangan baru.
3. Buat berkas baru di `wiki/` atau sunting berkas yang sudah ada, lalu hubungkan halaman-halaman terkait menggunakan `[[Backlinks]]`.
4. Perbarui `index.md` dengan menautkan halaman baru tersebut ke kategori yang sesuai.
5. Catat aktivitas di `log.md`.

### 🔍 LINT & AUDIT (Pembersihan & Konsistensi Data)
Ketika pengguna memerintahkan: *"Lint wiki"*:
1. Periksa semua berkas di `wiki/` untuk mendeteksi *broken links*.
2. Temukan halaman yatim-piatu (*orphan pages*).
3. Cari informasi yang tumpang tindih atau kontradiktif antar berkas wiki.
4. Pastikan semua berkas memiliki YAML frontmatter yang lengkap.
