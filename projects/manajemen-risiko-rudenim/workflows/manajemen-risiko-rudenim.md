---
name: manajemen-risiko-rudenim
description: >
  Pipeline untuk mengevaluasi dan merancang implementasi Manajemen Risiko
  berdasarkan Pedoman Kementerian Imigrasi dan Pemasyarakatan (MIP-OT.02.02-47 TAHUN 2025)
  khusus untuk Satker Rudenim Pontianak.
---

# Pipeline Manajemen Risiko Rudenim Pontianak

## Arsitektur Eksekusi (DAG Lokal)

1. **Persiapan Ekstraksi (Stage 1):** 
   - File eksekusi: `stages/01-ekstraksi-pedoman.md`
   - Fokus: Mengubah PDF pedoman menjadi teks yang bisa dianalisis (atau memastikan teks siap jika user sudah memberikan).
   
2. **Audit Struktur (Stage 2):**
   - File eksekusi: `stages/02-analisis-struktur.md`
   - Fokus: Audit isi, membedah struktur bab, dan poin-poin di setiap bagian pedoman.

3. **Perumusan Implementasi (Stage 3):**
   - File eksekusi: `stages/03-plan-implementasi.md`
   - Fokus: Menerjemahkan pedoman ke langkah konkret untuk Rudenim Pontianak (Satuan Kerja).

## Instruksi Orkestrator
- Panggil setiap instruksi di folder `stages/` secara berurutan sesuai DAG di atas.
- Tuliskan semua file output ke dalam folder ini.
