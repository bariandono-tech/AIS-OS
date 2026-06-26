---
name: revisi-audit-proposal
description: >
  Skill DAG Pipeline untuk mengevaluasi dan mengaudit revisi dokumen proposal skripsi/tesis.
  Workflow ini menggunakan pendekatan orchestrator-based DAG yang berfokus pada bedah
  dokumen lokal (Word/PDF) dan mengecualikan modul pencarian web (web research).
  Gunakan skill ini ketika user meminta audit, review, atau cek revisi proposal.
---

# Pipeline Revisi Audit Proposal

Pipeline ini merupakan adaptasi dari evaluasi `Opus` yang memfungsikan arsitektur DAG (Directed Acyclic Graph) untuk mempercepat dan memfokuskan audit pada dokumen proposal secara mendalam (PUEBI, Struktur, Logika, Sitasi) tanpa campur tangan pencarian referensi eksternal.

## Arsitektur Eksekusi (DAG Lokal)

1. **Persiapan Ekstraksi (Stage 1):** 
   - File mentah: `01-raw-extraction.md`
   - Agent harus memastikan bahwa user sudah mengunggah dokumen proposal (Word/PDF) atau mengekstraknya ke format teks. Output disimpan sebagai data mentah siap proses.
   
2. **Tahap Paralel (Stage 2 & 3):**
   - Mengambil input DARI hasil ekstraksi Stage 1.
   - Menjalankan `stages/02-audit-puebi.md` (Pengecekan ejaan, format, dan tata bahasa).
   - Menjalankan `stages/03-audit-struktur-dan-sitasi.md` (Pengecekan alur bab, logika argumen, dan kesesuaian sitasi proposal).
   - Kedua stage ini bersifat *independent* satu sama lain dan dijalankan paralel jika memungkinkan.

3. **Tahap Konsolidasi (Stage 4):**
   - Menjalankan `stages/04-final-report.md`.
   - Menggabungkan temuan dari Stage 2 dan Stage 3 menjadi satu laporan akhir komprehensif (PDF/HTML) yang siap diserahkan ke Dosen Pembimbing.

## Instruksi Orkestrator
- Panggil setiap instruksi di folder `stages/` secara berurutan sesuai DAG di atas.
- Jangan libatkan *sub-agent* eksternal untuk *web search* (Deep Research dinonaktifkan). Fokus hanya pada dokumen lokal yang diunggah.
- Tuliskan semua file output *stage* ke dalam `outputs/{nama-topik-proposal}/`.
