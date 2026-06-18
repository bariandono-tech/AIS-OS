# AIOS Memory — Persistent Context & Lessons Learned

Buku catatan memori jangka panjang untuk merekam state proyek, pelajaran penting (*gotchas*), dan keputusan penting agar AIOS tidak lupa lintas sesi chat.

---

## 👤 0. Profil Pengguna (User Profile)
* **Tingkat Pengalaman:** Pemula *Vibe Coding* (belajar sekitar 2 bulan).
* **Pendekatan Interaksi:** Butuh penjelasan konsep dasar yang sederhana dan bertahap. Hindari pemindahan file kode sumber, modifikasi konfigurasi, atau tindakan teknis berisiko tinggi tanpa persetujuan eksplisit dan penjelasan yang mudah dipahami terlebih dahulu.

---

## 1. Gotchas & Solusi Teknis (Pelajaran Penting)

### Pembuatan Dokumen Word (`build_makalah.js`)
* **Masalah Paragraf Corrupt (Unreadable Content):** Saat memasukkan gambar ke dokumen `.docx` menggunakan library `docx`, selalu tentukan properti `type: 'png'` di dalam konfigurasi `ImageRun`. Jika diabaikan, ekstensi gambar dikemas sebagai `.undefined` di XML Word, yang memicu error corrupt saat berkas dibuka di MS Word.
* **Dropdown Spasi Rusak di MS Word:** Jangan gunakan properti `lineRule: 'exact'` di helper paragraf. Menghapus properti ini membiarkan MS Word mendeteksi spasi secara relatif (Double/Ganda untuk spasi 2.0, dan 1.5 lines untuk spasi 1.5) sehingga dropdown spasi di Word tidak macet.
* **Gap Antar-Paragraf:** Untuk membuat spasi ganda (2.0) benar-benar seragam tanpa ada jarak vertikal tambahan antar-paragraf, atur properti `spaceAfter` menjadi `0` (0 pt) di helper `justifiedPara` dan `numberedItem`.
* **Daftar Isi (Table of Contents):** TOC bawaan dari library `docx` sering tidak kompatibel dengan spasi rapat dan dot leader yang ketat sesuai pedoman dosen. Gunakan entri manual (`tocEntry`) dengan spasi 1.5 untuk kontrol presisi tata letak.

### Integrasi Notion API (Mythos Brain)
* **ID Database Asli vs View ID:**
  * **Notes Database ID (asli):** `37c78c4c-e388-81b0-bf1f-dca07fba6f3f` (Pro Max Notes). Jangan gunakan ID data source view `37c78c4c-e388-8179-932c-000b55abc9b1` saat membuat halaman via API, karena akan memicu error `object_not_found`.
  * **Projects Database ID:** `37c78c4c-e388-81a6-bbae-fd09329c9804`.
* **Halaman Penting:**
  * Project Page: **Skripsi Deviasi Anggaran** (ID: `37c78c4c-e388-8149-ba66-fbd0ea94aaf8`).
  * Area Page: **Metodologi Penelitian** (ID: `37c78c4c-e388-8162-814b-ef33783d7ab3`).
* **Konfigurasi Lokal:** Kunci API (`NOTION_TOKEN`) disimpan aman di `.env` lokal di dalam folder `scripts/notion/` dan di-ignore dari git commit.
* **Aturan Pengarsipan Worklog:** Ketika menyinkronkan/menyimpan worklog di database Pro Max Notes Notion (Mythos Brain):
  * Hubungkan relation `Area/Resource` ke Halaman **"AiS OS"** (ID: `37c78c4c-e388-81f1-99a3-d9e3b16d3d86`).
  * Hubungkan relation `Project` ke Halaman **"Twitter Digital"** (ID: `37f78c4c-e388-8064-abbc-d4df85b7eda0`) di bagian task.

### Desain Visual & Layout Flowchart (Readability & Sizing)
* **Rasio Canvas & Ukuran Font (Word Scaling Gotcha):** Untuk diagram yang akan di-scale ke area cetak Word (lebar target ~450px), hindari canvas yang terlalu lebar (>1000px). Gunakan lebar canvas antara `800px` - `920px` dengan font detail `13pt` - `16pt` agar teks tidak menyusut terlalu kecil saat di-scale di Word.
* **Kerapatan Vertikal & Margins:** Batasi vertical gap (`VGAP`) di kisaran `45px` agar diagram panjang muat di satu halaman A4 tanpa terpotong (*overflow*).
* **Pemberian Ukuran Shape & Teks:**
  * Potong baris teks secara manual (`\n`) dengan lebar maksimal 15-18 karakter untuk font `13pt`-`15pt`.
  * Diamond keputusan harus berukuran minimal lebar `320px` dan tinggi `120px` agar teks tidak menabrak batas tepi.
* **Layout Sumbu Simetris (Centering):** Center koordinat utama (`CX`) dan cabang (`BRANCH_CX`) wajib diposisikan agar bounding box diagram berada tepat di tengah-tengah canvas (misal: untuk canvas `920px`, gunakan `CX=300`, `BRANCH_CX=660` sehingga menyisakan margin kiri-kanan seimbang `140px`).
* **Routing Garis Kembali (Loop-back):** Aliran panah kembali (*loop-back*) harus diarahkan masuk ke garis penghubung vertikal di atas/sebelum diamond atau masuk ke proses awal, bukan memotong/menabrak kotak proses atau diamond di tengah jalan.

---

## 2. Struktur Teoretis Skripsi

* **Grand Theory:** *Agency Theory* (Jensen & Meckling, 1976). Menganalisis hubungan keagenan antara DJPb (Prinsipal) dan Rudenim (Agen).
* **Faktor Internal Satker (Input):** Kompetensi SDM Pengelola Keuangan, Kualitas Rencana Penarikan Dana (RPD), Komitmen Manajemen.
* **Proses:** Pelaksanaan Anggaran Belanja Modal (B53) yang bersifat kontraktual dan melibatkan pihak ketiga.
* **Agency Problem (Output):** *Deviasi Anggaran* (penyimpangan antara RPD Halaman III DIPA dengan realisasi bulanan) akibat asimetri informasi dan ketidakpastian lapangan.
* **Impact (Outcome):** Penurunan nilai IKPA (Indikator Kinerja Pelaksanaan Anggaran) dan penurunan akuntabilitas keagenan satker.

---

## 3. Progress State (Terakhir Diperbarui: 2026-06-15)

* **Git Branch:** `chore/notion-relations-and-projects-2026-06-13` (sudah di-push ke origin).
* **Dokumen Terakhir:** Materi digital baru "Mastery Kit Pajak Dasar" selesai disusun beserta visual flowchart dan slide presentasi Word.
* **Log Terakhir:** Catatan kerja tanggal 15 Juni 2026 dan pembersihan folder root telah berhasil disinkronkan ke Notion.
* **Otomasi & Asisten Baru:**
  - Skill **`latarbelakang-deduktif`** aktif untuk memandu penulisan Bab I secara deduktif dengan Jembatan Fenomena.
  - Agent **`ceo-digital-selling`** aktif untuk menyusun draf promosi dan taktik penjualan jasa/produk akuntansi di Twitter/X.
  - Script **`sync_worklog_today.js`** aktif untuk mempermudah sinkronisasi catatan harian ke Mythos Brain (AiS OS / Twitter Digital).
