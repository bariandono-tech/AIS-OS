# Product Requirement Document (PRD): StudiOS

**Status:** Draft | **Target Version:** 1.0 (MVP) | **Last Updated:** 2026-06-15

---

## 1. Executive Summary & Vision

### Vision
**StudiOS** adalah platform personal/pocket knowledge base premium yang mengubah konten belajar pasif (PDF statis, catatan teks) menjadi modul belajar interaktif berbasis database (*database-driven interactive study companion*). Platform ini dirancang khusus untuk mahasiswa S1/S2, peneliti, dan profesional berkinerja tinggi (*high-achievers*) yang membutuhkan sistem belajar terorganisir, terintegrasi, dan mudah diakses di mana saja.

### Core Value Proposition
> *"Semua materi kuliah dan riset kamu — dirangkum, diorganisir, dan dibuat interaktif dalam satu aplikasi web saku premium."*

---

## 2. Target Audience & User Personas

### 1. The High-Achieving Student (Mahasiswa Berprestasi)
*   **Profil:** Mahasiswa jurusan padat materi (Kedokteran, Akuntansi, Hukum, Statistika) yang mengelola puluhan materi kuliah per semester.
*   **Kebutuhan:** Rangkuman cepat yang terorganisir per mata kuliah (*Stack*), alat bantu latihan mengingat (flashcard), dan visualisasi keterkaitan bab materi.
*   **Pain Point:** Materi kuliah tercebar di WhatsApp group, PDF acak, Google Drive, dan catatan kertas.

### 2. The Researcher / Postgrad (Peneliti & Mahasiswa S2)
*   **Profil:** Peneliti yang mengumpulkan puluhan jurnal ilmiah dan referensi metodologi.
*   **Kebutuhan:** Akses cepat ke link referensi, pemetaan kerangka berpikir (*mind map*), dan integrasi catatan riset dengan tools personal knowledge management (Obsidian/Notion).

### 3. The Knowledge Creator / Seller (Penjual Ringkasan Materi)
*   **Profil:** Mahasiswa atau praktisi yang memproduksi ringkasan materi berkualitas tinggi dan ingin memonetisasinya secara digital.
*   **Kebutuhan:** Platform untuk mempublikasikan materi secara aman, membatasi akses (hanya untuk pembeli), dan menerima pembayaran otomatis.

---

## 3. Product Functional Requirements

### 1. Dashboard (Library of Stacks)
*   **Deskripsi:** Halaman utama yang menampilkan daftar seluruh mata kuliah/topik (*Stacks*) yang dimiliki atau tersedia untuk dibeli oleh pengguna.
*   **Persyaratan:**
    *   Grid card dinamis dengan warna aksen unik, deskripsi, icon, dan jumlah konten.
    *   Search bar instan untuk memfilter stack berdasarkan judul/deskripsi.
    *   Indikator status kepemilikan (Free vs Premium/Locked).

### 2. Stack Page & Content Filtering
*   **Deskripsi:** Halaman detail untuk satu Stack materi tertentu.
*   **Persyaratan:**
    *   Header stack yang menampilkan judul, deskripsi lengkap, dan statistik konten.
    *   Navigation tab untuk memfilter tipe konten: **Semua | Brainstorm (Mind Map) | Resume | Notes (Markdown) | Flashcard | Referensi**.
    *   Card grid dari item konten yang disortir berdasarkan indeks urutan belajar (`order_index`).

### 3. Interactive Content Renderers (5 Tipe Konten)
Aplikasi harus dapat merender 5 tipe konten belajar dengan UI/UX premium:
*   **Resume**: Artikel terstruktur dengan pemformatan teks kaya (bold, inline code), sub-bab, serta parser otomatis tabel Markdown (contoh: tabel tarif pajak).
*   **Notes (Markdown)**: Penampil berkas Markdown terformat rapi dengan blockquote khusus, bullet list, dan sintaks kode terisolasi.
*   **Brainstorm (Mind Map)**: Visualisasi pohon hierarkis terindentasi dengan warna simpul (*node*) yang dinamis dan fungsi ekspansi (buka-tutup) simpul anak.
*   **Flashcard**: Dek kartu latihan terpaginasi (satu kartu per tampilan). Dilengkapi dengan indikator kemajuan (`Kartu X dari Y`), progress bar horizontal, animasi flip 3D kartu saat diklik, tombol "Sebelumnya"/"Selanjutnya", dan fitur "Reset Deck".
*   **Referensi**: Grid kartu eksternal link (jurnal, video tutorial, undang-undang) yang menampilkan deskripsi singkat, kategori (paper, video, web), dan tautan langsung.

### 4. Monetization & Access Control
*   **Deskripsi:** Sistem pembatasan konten berbayar.
*   **Persyaratan:**
    *   Pengguna dapat membaca materi gratis secara bebas.
    *   Materi premium/berbayar dibatasi menggunakan otorisasi database (Supabase RLS).
    *   Halaman landing pemasaran (*sales page*) khusus untuk pembelian akses per-stack (*per-stack purchase*).

### 5. Notion Sync Engine (Admin/Infrastruktur)
*   **Deskripsi:** Proses otomatisasi untuk mengimpor dan memperbarui materi belajar.
*   **Persyaratan:**
    *   Penulisan materi tetap dilakukan di Notion (ruang kerja penulis).
    *   Script sinkronisasi (API) menarik data dari basis data Notion dan memperbarui baris data di PostgreSQL Supabase secara berkala.

---

## 4. Non-Functional Requirements

*   **Aesthetics & UI:** Menggunakan gaya *Premium Dark Glassmorphism* (skema warna HSL gelap, batas subtle semi-transparan, blur latar belakang, font modern Inter).
*   **Performance:** Halaman harus termuat cepat (<1.5 detik pertama) dengan client-side routing state yang instan tanpa memicu reload halaman penuh.
*   **Mobile-First Response:** Layout harus responsif penuh dan optimal digunakan pada layar smartphone (saku).

---

## 5. Future Scope (Tahap Lanjut)
*   Integrasi ekspor catatan ke format Obsidian Vault (.md dengan Wikilinks).
*   Spaced Repetition System (SRS) otomatis untuk Flashcard berbasis algoritma SuperMemo.
*   Integrasi AI Tutor (mirip NotebookLM) menggunakan API Gemini untuk tanya jawab per-stack.
