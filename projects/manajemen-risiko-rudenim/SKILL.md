---
name: manajemen-risiko-rudenim
description: >
  Skill DAG Pipeline untuk mengevaluasi dan merancang implementasi Manajemen Risiko
  berdasarkan Pedoman Kementerian Imigrasi dan Pemasyarakatan untuk Rudenim Pontianak.
  Gunakan skill ini ketika user meminta audit pedoman MR atau rancangan implementasinya.
---

# Pipeline Manajemen Risiko Rudenim Pontianak

Pipeline ini memfungsikan arsitektur DAG (Directed Acyclic Graph) untuk mengaudit Pedoman Penerapan Manajemen Risiko (MIP-OT.02.02-47 TAHUN 2025) dan menyusun rancangan implementasi spesifik di Rudenim Pontianak.

## Arsitektur Eksekusi (DAG Lokal)

1. **Persiapan Ekstraksi (Stage 1):** 
   - Menjalankan `workflows/stages/01-ekstraksi-pedoman.md`
   - Agent mengekstrak dokumen PDF Pedoman Manajemen Risiko ke format teks terstruktur.
   
2. **Audit Struktur dan Isi (Stage 2):**
   - Menjalankan `workflows/stages/02-analisis-struktur.md`
   - Menganalisis struktur dokumen, mendata poin-poin penting di setiap bab dan bagian sesuai pedoman.

3. **Perumusan Rencana Implementasi (Stage 3):**
   - Menjalankan `workflows/stages/03-plan-implementasi.md`
   - Mengadaptasi temuan dari Stage 2 menjadi panduan praktis dan langkah-langkah implementasi di Satker Rudenim Pontianak.

## Instruksi Orkestrator
- Panggil setiap instruksi di folder `workflows/stages/` secara berurutan sesuai DAG di atas.
- Fokus pada dokumen lokal yang diunggah.
- Tuliskan semua file output ke dalam direktori kerja saat ini.
