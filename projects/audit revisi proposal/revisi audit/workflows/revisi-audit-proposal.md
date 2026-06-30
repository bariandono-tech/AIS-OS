---
name: revisi-audit-proposal
description: >
  Skill DAG Pipeline untuk mengevaluasi, mengaudit, dan merevisi dokumen proposal skripsi/tesis.
  Workflow ini menggunakan pendekatan orchestrator-based DAG yang berfokus pada bedah
  dokumen lokal (Word/PDF). Pipeline terdiri dari 6 stage: Ekstraksi → Audit Paralel →
  Final Report → [Session Handoff] → Writing/Revisi → Verification Pass.
  Gunakan skill ini ketika user meminta audit, review, cek revisi, atau penulisan ulang proposal.
---

# Pipeline Revisi Audit Proposal

Pipeline ini menggunakan arsitektur DAG (Directed Acyclic Graph) untuk mempercepat dan memfokuskan audit serta revisi proposal secara mendalam (PUEBI, Struktur, Logika, Sitasi, Writing, Verification).

## Arsitektur Eksekusi (DAG 6 Stage)

### Fase Audit (Stage 1–4) — `python tools/main.py <path-to-pdf>`

1. **Persiapan Ekstraksi (Stage 1):**
   - File mentah: `01-raw-extraction.txt`
   - Agent harus memastikan bahwa user sudah mengunggah dokumen proposal (Word/PDF) atau mengekstraknya ke format teks. Output disimpan sebagai data mentah siap proses.
   
2. **Tahap Paralel (Stage 2 & 3):**
   - Mengambil input DARI hasil ekstraksi Stage 1.
   - Layer 1 (Gemini/Gratis): Audit PUEBI, Register, Sitasi.
   - Layer 2 (Claude/Berbayar): Audit Struktur, Metodologi, Koherensi.

3. **Tahap Konsolidasi (Stage 4):**
   - Menggabungkan temuan dari semua agen audit menjadi `Final_Audit_Report.pdf`.

### [SESSION HANDOFF] — Bersihkan konteks, paste handoff, lanjut di sesi baru.

### Fase Writing (Stage 5–6) — `python tools/main_writing.py <topik> <versi>`

4. **Tahap Writing / Revisi (Stage 5):**
   - Menjalankan `stages/05-writing-revisi.md`.
   - Input: draf mentah + seluruh file audit + catatan dosen (opsional).
   - Merevisi Bab 1, 2, 3, dan Daftar Pustaka secara berurutan.
   - Output: `outputs/{topik}/revisi-{versi}/05-revisi-bab*.md`.

5. **Tahap Verifikasi (Stage 6):**
   - Menjalankan `stages/06-verification-pass.md`.
   - Cross-check seluruh temuan audit vs draf revisi.
   - Output: `outputs/{topik}/revisi-{versi}/06-verification-pass.md`.
   - Verdik: **LULUS** (≥90% kepatuhan) atau **PERLU REVISI ULANG**.

## Instruksi Orkestrator
- **Fase Audit:** `python tools/main.py <path-to-pdf>` — menjalankan 7 agen audit secara berurutan.
- **Fase Writing:** `python tools/main_writing.py <topik> <versi>` — menjalankan revisi + verification.
- Jangan libatkan *sub-agent* eksternal untuk *web search*. Fokus hanya pada dokumen lokal.
- File intermediate audit disimpan di `.tmp/`.
- File output final disimpan di `outputs/{topik}/`.
- Gunakan subfolder `revisi-v1/`, `revisi-v2/` untuk versioning. Tidak ada file yang boleh ditimpa.

## Siklus Revisi (Versioning)
```
v1: Audit → Writing → Verification → Serahkan ke Dosen
    ↓ (Dosen beri catatan)
v2: Tulis catatan-dosen.md → Writing ulang → Verification → Serahkan lagi
    ↓ (Dosen beri catatan lagi)
v3: ...dst
```
