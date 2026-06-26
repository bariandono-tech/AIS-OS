---
name: audit-skripsi
description: >
  Skill DAG Pipeline untuk melakukan audit dokumen skripsi/tesis (Bab 1-3).
  Workflow ini tidak menggunakan banyak sub-agent otonom melainkan pendekatan
  file-based pipeline di mana 1 agent orkestrator menjalankan 5 stage secara
  paralel dan sekuensial. Gunakan skill ini ketika user meminta audit, review,
  atau koreksi dokumen akademik.
---

# Audit Skripsi Pipeline

Pipeline ini memecah tugas audit dokumen menjadi komponen modular (Directed Acyclic Graph/DAG) untuk mengurangi halusinasi LLM dan menghemat *context token*.

## Arsitektur Eksekusi (DAG)

1. **Persiapan:** User harus menyediakan file teks mentah ekstraksi skripsi (`00-raw-ekstrak.md`). Jika belum ada, agent harus meminta user untuk mengunggah atau mengekstraknya terlebih dahulu.
2. **Tahap Paralel (Stage 1, 2, 3):**
   - Jalankan `stages/01-audit-puebi.md`
   - Jalankan `stages/02-audit-struktur.md`
   - Jalankan `stages/03-audit-sitasi.md`
   Ketiga tahap ini HANYA bergantung pada `00-raw-ekstrak.md`. Jika kapabilitas sistem memungkinkan pemanggilan asinkron/paralel, jalankan bersamaan. Jika tidak, jalankan sekuensial secara cepat dengan mem-flush context sebelumnya.
3. **Tahap Sekuensial Inti (Stage 4):**
   - Jalankan `stages/04-audit-logika.md`
   Hanya jalankan ini JIKA Stage 2 dan Stage 3 sudah selesai. Tahap ini adalah pembedahan substansi lintas bab (Bab 1, 2, 3).
4. **Tahap Final (Stage 5):**
   - Jalankan `stages/05-final-report.md`
   Menggabungkan semua laporan dari Stage 1-4 menjadi satu PDF/HTML *report* yang komprehensif.

## Instruksi Orkestrator
- Panggil setiap file di dalam folder `stages/` sesuai urutan DAG.
- Output dari masing-masing stage harus disimpan di direktori `outputs/{nama-mahasiswa}/` (contoh: `outputs/ajie/01-audit-puebi.md`).
- **Hard Rule**: Saat menjalankan stage baru, BACA output file yang relevan, JANGAN membawa riwayat percakapan dari stage lain agar token tetap ringan.
