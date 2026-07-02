# PRD & Arsitektur: Dashboard Anggaran

## 1. Deliverables
- [ ] Folder proyek Web App.
- [ ] UI Landing Page (Dashboard Anggaran).
- [ ] UI Halaman IKPA Penyerapan Anggaran.
- [ ] Logika integrasi dua arah antara Web dan Google Sheets.

## 2. Target Audience
**Who**: Pejabat Pengelola Keuangan (KPA, PPK, Bendahara) dan Staf Pengelola Anggaran di Instansi.
**Pain**: Ingin melihat dashboard visual yang interaktif (cantik/wow) tanpa harus meninggalkan kebiasaan menginput data di Google Sheets.
**Current alternatives**: Dashboard Excel statis, manual chart update.

## 3. Value Proposition
> Memantau dan mengelola kinerja penyerapan anggaran dengan UI interaktif super premium, sambil tetap menjaga kemudahan input data harian via Google Sheets.

## 4. Scope (v1)
### In v1
- Integrasi ke 1 Spreadsheet Google (dengan 2 Sheet: Dashboard & IKPA Penyerapan).
- Landing page dengan indikator visual dan grafik (Chart).
- Halaman IKPA Penyerapan.
- Fungsi Update: Mengedit data dari Web yang langsung tersimpan di Google Sheet.

### NOT in v1 (parked)
- Multi-tenant (banyak instansi, banyak Spreadsheet).
- Login dan Autentikasi multi-level (Admin, Viewer, Editor) yang kompleks.

---

## 5. Sidang Arsitektur & Rekomendasi (Roast & Karpathy)

Anda bertanya: **"Apakah pakai Supabase atau apa? Coba direkomendasikan dulu."**

Berdasarkan analisis "Dewan Roast", menggunakan Google Sheets murni sebagai **Database Utama (Single Source of Truth) untuk aplikasi Dua Arah (Two-way)** adalah hal yang sangat **RAPUH**. 
Google Sheets API memiliki kuota limit, delay/latensi, dan jika dua orang menyimpan data bersamaan, akan terjadi "Race Condition" (data tertimpa/corrupt).

### Opsi A: "Google Sheets sebagai Database Langsung" (TIDAK DIREKOMENDASIKAN UNTUK JANGKA PANJANG)
- **Cara Kerja**: Web App menembak langsung Google Sheets API. Setiap klik 'Simpan' di web mengirim update ke sel Sheet.
- **Kelebihan**: Arsitektur sederhana, tidak butuh database tambahan.
- **Kelemahan**: Lambat, rawan gagal, jika data banyak akan *timeout*, tidak bisa melacak *history* perubahan dengan baik dari sisi aplikasi.

### Opsi B: "Supabase sebagai Database Utama + Google Sheets sebagai Exporter/Sinkronisasi" (DIREKOMENDASIKAN ✅)
- **Cara Kerja**: Kita menggunakan **Supabase (PostgreSQL)** untuk menyimpan semua data agar cepat dan aman. Ketika user mengisi di Web, data masuk ke Supabase, lalu sebuah trigger/webhook akan **memperbarui** Google Sheets di latar belakang. Begitu juga sebaliknya (menggunakan Google Apps Script di Sheet untuk menembak API Supabase jika ada sel yang diubah dari Sheet).
- **Kelebihan**: Aplikasi Web akan sangat cepat (tidak menunggu API Google Sheet), data aman (tidak rawan bentrok), dan fitur "dua arah" tetap tercapai.

### Stack / Tools yang Digunakan:
- **Framework Web**: Next.js (React) - Cepat, modern, dan mendukung pembuatan API internal (API Routes).
- **Styling**: Vanilla CSS (sesuai best practice kustomisasi) agar mencapai efek UI yang "Premium & Wow" tanpa batasan kelas utility.
- **Database / Backend**: **Supabase** (PostgreSQL) - Untuk Opsi B. (Atau tanpa DB untuk Opsi A jika Anda bersikeras).
- **Data Fetching**: SWR atau React Query.
- **Visualisasi**: Recharts atau Chart.js untuk grafik anggaran.

## 6. Keputusan (Quality Gate)
Silakan Bapak/Ibu memberikan arahan:
1. Apakah kita sepakat menggunakan **Opsi B (Supabase + Sinkronisasi Sheet)** agar aplikasi stabil?
2. Apakah Bapak/Ibu sudah memiliki file Google Sheet awal yang bisa dijadikan referensi format kolomnya? (Jika belum, kita akan buatkan format standarnya).
