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

4. **[SESSION HANDOFF]** — Bersihkan konteks chat, paste handoff, lanjutkan di sesi baru. Ini mencegah *context rot* sebelum fase writing.

5. **Tahap Writing / Revisi (Stage 5):**
   - Menjalankan `stages/05-writing-revisi.md`.
   - Input: draf mentah + seluruh file audit.
   - Merevisi setiap bab (Bab 1, 2, 3) dan Daftar Pustaka secara berurutan.
   - Output disimpan di `outputs/{nama-topik-proposal}/revisi-{versi}/`.
   - Orkestrator: `tools/main_writing.py <topik> <versi>`.

6. **Tahap Verifikasi (Stage 6):**
   - Menjalankan `stages/06-verification-pass.md`.
   - Cross-check seluruh temuan audit vs draf revisi.
   - Menghasilkan tabel kepatuhan dan verdik LULUS / PERLU REVISI ULANG.

## Instruksi Orkestrator
- **Fase Audit (Stage 1-4):** Jalankan `python tools/main.py <path-to-pdf>`. Panggil setiap instruksi di folder `stages/` secara berurutan sesuai DAG.
- **Fase Writing (Stage 5-6):** Jalankan `python tools/main_writing.py <topik> <versi>`. Pastikan audit sudah selesai sebelum menjalankan writing.
- Jangan libatkan *sub-agent* eksternal untuk *web search* (Deep Research dinonaktifkan). Fokus hanya pada dokumen lokal yang diunggah.
- Tuliskan semua file output audit ke dalam `.tmp/` dan file output final ke `outputs/{nama-topik-proposal}/`.
- Gunakan subfolder `revisi-v1/`, `revisi-v2/`, dst. untuk versioning. Tidak ada file yang boleh ditimpa.
