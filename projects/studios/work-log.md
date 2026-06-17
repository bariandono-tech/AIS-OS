# Work Log — StudiOS

## 2026-06-15

### Inisialisasi Proyek StudiOS & Refinement UI

**Dikerjakan:**
- **Phase 1: IDEATE** — Menyusun draf ideasi dan mematangkan konsep produk "StudiOS", sebuah database-driven study companion/knowledge viewer untuk mahasiswa & peneliti berkinerja tinggi.
- **Phase 2: ARCHITECT** — Merancang arsitektur aplikasi (Dashboard, StackPage, ContentViewer), skema database Supabase PostgreSQL (tabel stacks, content_items, flashcards, references), serta model monetisasi per-stack.
- **Phase 3: BUILD** — Mengimplementasikan UI purwarupa lengkap dengan React + Vite + Vanilla CSS.
  - Membangun premium dark-mode design system di `index.css`.
  - Mengimplementasikan routing berbasis state.
  - Membuat dummy data akademik yang kaya (Akuntansi Pajak, Fiqh Muamalah, Metodologi Penelitian).
- **Refinement & UX Upgrade**:
  - Menambahkan sistem parsing tabel markdown di `ResumeRenderer` dan `NotesRenderer` sehingga tabel data tampil rapi dan responsif.
  - Mengubah layout flashcard dari list memanjang vertikal menjadi sistem deck interaktif (satu per satu) dengan tombol navigasi, progress bar, flip animation, dan reset deck.
- **Notion Integration**:
  - Membuat dan meregistrasikan project page "StudiOS" di database Projects Notion.
- **Penyusunan Dokumentasi Produk & Teknis**:
  - Menyusun Product Requirement Document (`prd.md`) untuk mematangkan cakupan fitur MVP.
  - Merancang arsitektur data, skema DDL Supabase, dan aturan keamanan RLS di `architecture.md`.
  - Membuat rencana pengerjaan teknis (`task.md`) dengan tabel prioritas serta ketergantungan tugas (dependency task).
- **Eksekusi Tahap 1 (Database & Security)**:
  - Membuat berkas DDL SQL `supabase_schema.sql` untuk membuat tabel, relasi, tipe kustom, dan kebijakan RLS (Row-Level Security) akses materi gratis/berbayar.
  - Membuat berkas data benih SQL `supabase_seed.sql` berisi data materi akademik Indonesia siap impor.
  - Memperbarui status T1.1 dan T1.2 di `task.md` menjadi selesai.

**Hasil:**
- Dashboard dan semua halaman konten viewer berjalan lancar tanpa error.
- Tampilan tabel dan flashcard lulus uji visual browser subagent dan terlihat sangat premium.
- Dokumen produk (`prd.md`), arsitektur (`01-architecture.md`), dan peta jalan tugas berurutan (`task.md`) berhasil dibuat sebagai acuan pengerjaan tahap selanjutnya.
- Berkas migrasi database (`supabase_schema.sql`) dan data benih (`supabase_seed.sql`) siap digunakan di Supabase SQL Editor.

### Tahap 2: Integrasi Frontend ke Supabase & Sistem Otorisasi Akses
**Dikerjakan:**
- **Integrasi Supabase SDK & Dual-Mode Config**: Menginstal `@supabase/supabase-js` dan mengonfigurasi `supabaseClient.js` dengan fallback otomatis (apabila API credentials tidak ditemukan di `.env`, aplikasi tetap berjalan mulus menggunakan data mock lokal).
- **Asynchronous Data Loading**: Merefaktor `App.jsx`, `StackPage.jsx`, dan `ContentViewer.jsx` untuk memuat data secara asinkron dari `dataService.js` (memuat Stacks, Content Items, Flashcards, dan References secara dinamis).
- **Halaman Login & Registrasi (Auth)**: Membuat `AuthPage.jsx` dengan gaya dark glassmorphism premium untuk autentikasi user (signIn/signUp) menggunakan Supabase Auth atau Mock Auth untuk mode demo.
- **Sistem Pembatasan Akses Premium (Lock Screen)**: Mengintegrasikan pengecekan transaksi di tabel `purchases` untuk membatasi konten premium secara real-time. Menampilkan halaman lock screen premium dengan tombol "Beli & Buka Akses Sekarang" (Simulator) untuk memudahkan proses pengujian bagi user.
- **Browser Automation Verification**: Menguji fungsionalitas visual, login/logout, dan simulator transaksi secara end-to-end menggunakan subagen browser, menjamin kualitas premium di semua halaman.

### Tahap 3: Notion Sync Engine (Otomatisasi Sinkronisasi Konten)
**Dikerjakan:**
- **Instalasi Dependensi**: Menginstal `@notionhq/client` dan `dotenv` di direktori `projects/studios/app/` untuk interaksi API Notion.
- **Konfigurasi Environment**: Memperbarui template `.env` dengan variabel `NOTION_TOKEN`, `NOTION_STACKS_DB_ID`, `NOTION_CONTENT_DB_ID`, dan `SUPABASE_SERVICE_ROLE_KEY`.
- **Modul Parser Blok Notion (`notionParser.js`)**: Menulis kode parser untuk menerjemahkan blok Notion menjadi data bersih untuk Supabase:
  - Mengubah halaman `notes` menjadi Markdown terstruktur.
  - Memotong halaman `resume` menjadi objek JSONB sections terbagi.
  - Memetakan daftar bullet tersarang (`brainstorm`) menjadi nodes pohon visual (Mind Map).
  - Mengekstrak blok **Toggle** menjadi deck **Flashcard** beserta tag otomatis.
  - Memindai tautan dan blok bookmark menjadi entri **Referensi**.
- **Sync Script Controller (`sync.js`)**: Membuat modul entri sync yang memicu penarikan seluruh data Notion, memetakan relasi Stack-Content, dan melakukan **UPSERT** aman di PostgreSQL.
- **Uji Coba Simulator (Mock Tests)**: Menulis scratch test script unit di `test_sync_engine.js` untuk memvalidasi parser secara offline dengan hasil pengujian **100% lulus (PASS)**.
- **GitHub Actions Automation**: Membuat berkas workflow `.github/workflows/notion-sync.yml` untuk memicu sinkronisasi otomatis menggunakan cron job harian.
- **Koneksi Real & Validasi E2E**: Mengatasi keterbatasan method SDK pada versi `@notionhq/client@5.22.0` dengan migrasi ke raw `request` berbasis API `2022-06-28`. Berhasil menghubungkan integrasi Notion secara langsung dengan database nyata user, sukses menarik data Stacks ("Studion Landing") dan Content Items ("StudyOS notes"), lalu menyimpannya ke database Supabase PostgreSQL. Status Phase 3 ditandai sebagai **Selesai (Completed)**.

## 2026-06-16

### Optimasi WebGL & Sinkronisasi Kurikulum Medis (Phase 3 - Anatomi Dasar)

**Dikerjakan:**
- **Optimasi Performa 3D Brain Anatomy (`index.html`):**
  - Mereduksi jumlah tabung (*tubes*) pembentuk korteks kranial sebesar 50% (dari 57 tabung kranial menjadi 29 tabung).
  - Menyederhanakan segmen geometri tabung dari 40 segmen menjadi 16 segmen, dan sisi radial dari 6 menjadi 4 (diamond profile).
  - Menonaktifkan fitur bayangan WebGL berat (`shadowMap.enabled = false`) dan membatasi pixel ratio maksimal di `1.5` untuk meminimalkan beban GPU pada laptop standard.
  - Hasil: Waktu muat inisialisasi 3D berkurang drastis dari lambat/lagging menjadi instan (<30ms) dan berjalan mulus.
- **Penyusunan Konten Medis Semester 1 (Anatomi Dasar):**
  - Menyusun 3 materi utama di Notion:
    - **1.1 Anatomi & Lobus Otak Manusia** (Tipe: `notes` dengan sematan kode HTML model 3D Otak).
    - **1.2 Rangka Tengkorak (Cranium)** (Tipe: `flashcard` dengan 4 kartu istilah latin).
    - **1.3: Sistem Saraf Pusat vs Tepi** (Tipe: `brainstorm` dengan struktur outline mind map).
- **Eksekusi & Validasi Sync Engine:**
  - Menjalankan `npm run sync` dan berhasil menarik data *Stacks* ("Anatomi Dasar") dan *Content Items* ("1.1", "1.2", "1.3") dari Notion langsung ke Supabase dengan status **100% SUCCESS**.

**Hasil:**
- Halaman "Anatomi Dasar" beserta konten interaktifnya telah aktif di database produksi Supabase dan siap ditampilkan di web app lokal.

