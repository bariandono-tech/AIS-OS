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

## Arsitektur Eksekusi

> **Peta lengkap & resmi ada di `README.md`.** Bagian ini hanya ringkasan.
> Folder `stages/` berisi 11 file bernomor (01–11) yang merupakan urutan sebenarnya.

- **Fase A — Audit** → `python tools/main.py audits/<nama-job> --pedoman <kampus>`
  1 folder job = 1 dokumen (`audits/<nama-job>/input/*.pdf` → hasil di folder yang sama).
  Ekstraksi (`01`) + **6 agen audit**: PUEBI (`02`), Register (`03`), Sitasi (`04`),
  Struktur (`05`), Metodologi (`06`), Koherensi (`07`) → konsolidasi `08-combined-report` →
  `Final_Audit_Report.pdf`. File perantara di `<job>/work/` (BUKAN `.tmp/` global lagi).
  `--pedoman <kampus>` memuat aturan format dari `pedoman/<kampus>.json` ke tiap prompt.
  Panduan lengkap: `audits/README.md`. Mode legacy `main.py <file.pdf>` (→ `.tmp/`) masih ada
  untuk uji cepat. **Audit lama tidak pernah ketiban karena tiap job punya `work/` sendiri.**
- **[SESSION HANDOFF]** — bersihkan konteks chat sebelum fase berikut (cegah *context rot*).
- **Fase B — Writing** → `python tools/main_writing.py <topik> <versi>`
  Writing ulang Bab 1–3 + Daftar Pustaka (`09`) → Verification pass (`10`,
  verdik LULUS / PERLU REVISI ULANG). Output di `outputs/{topik}/revisi-{versi}/`.
- **Fase C — Build** → `node build_revisi.js <input_dir>` (stage `11`, lewat `tools/convert_to_word.py`)
  `05-revisi-bab*.md` → `.docx` format UPB. Builder resmi = `build_revisi.js` **self-contained**
  di folder ini.

## Instruksi Orkestrator
- Jangan libatkan *sub-agent* eksternal untuk *web search* (Deep Research dinonaktifkan). Fokus hanya pada dokumen lokal yang diunggah.
- File output audit → `.tmp/`; file output final → `outputs/{topik}/`.
- Gunakan subfolder `revisi-v1/`, `revisi-v2/`, dst. untuk versioning. **Tidak ada file yang boleh ditimpa.**
- Identitas dokumen di `config.thesis.json`; aturan format kampus di `pedoman/upb.json`. Builder membaca keduanya.
