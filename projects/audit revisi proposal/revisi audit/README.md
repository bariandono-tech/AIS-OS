# Revisi-Audit Proposal — Peta Tunggal (Source of Truth)

> File ini adalah **satu-satunya peta resmi** pipeline ini. Kalau ada dokumen lain
> (SKILL.md, komentar di kode) yang berbeda dari sini, **README ini yang benar.**
> Folder kanonik: `projects/audit revisi proposal/revisi audit/`.

## Apa ini

Pipeline untuk **audit → tulis ulang → build .docx** dokumen akademik (proposal/skripsi/makalah),
mengikuti format Universitas Panca Bhakti (UPB). Dipakai sekarang untuk makalah/skripsi deviasi
anggaran Rudenim Pontianak; dirancang agar bisa dipakai ulang untuk thesis lain (lihat
"Reusability" di bawah).

## Alur 3 fase (yang BENAR)

### Fase A — Audit  →  `python tools/main.py <path-to-pdf>`
Mengekstrak PDF lalu menjalankan **6 agen audit** (bukan 7), masing-masing memanggil LLM:
| # | Stage file | Agen | Lapis |
|---|---|---|---|
| 0 | `stages/01-raw-extraction.md` | Ekstraksi PDF → teks | — |
| 1 | `stages/02-audit-puebi.md` | PUEBI & ejaan | Permukaan |
| 2 | `stages/03-audit-register.md` | Register & bahasa akademik | Permukaan |
| 3 | `stages/04-audit-sitasi.md` | Sitasi & daftar pustaka | Permukaan |
| 4 | `stages/05-audit-struktur.md` | Struktur & research gap | Substansi |
| 5 | `stages/06-audit-metodologi.md` | Metodologi Bab III | Substansi |
| 6 | `stages/07-audit-koherensi.md` | Koherensi & benang merah | Substansi |
| — | `stages/08-final-report.md` | Konsolidasi → `Final_Audit_Report.pdf` | — |

File audit perantara → `.tmp/`. Laporan akhir → `Final_Audit_Report.pdf`.

### [SESSION HANDOFF] — bersihkan konteks chat sebelum fase berikut (cegah context rot).

### Fase B — Writing  →  `python tools/main_writing.py <topik> <versi>`
| # | Stage file | Fungsi |
|---|---|---|
| 9 | `stages/09-writing-revisi.md` | Tulis ulang Bab 1–3 + Daftar Pustaka → `05-revisi-bab*.md` |
| 10 | `stages/10-verification-pass.md` | Cross-check audit vs revisi → verdik LULUS / PERLU REVISI ULANG |

Output → `outputs/{topik}/revisi-{versi}/`. Pakai `revisi-v1/`, `revisi-v2/` untuk versioning;
**tidak ada file yang ditimpa.**

### Fase C — Build .docx  →  `node build_revisi.js <input_dir> [output_docx]`
Mengubah `05-revisi-bab*.md` (sesuai `templates/build_schema.md`) → `.docx` format UPB.
Dipanggil otomatis oleh `tools/convert_to_word.py` (stage `11-build-document`).

> **Builder resmi = `build_revisi.js` di folder ini (self-contained).**
> Versi lama yang bergantung `skripsi/drafts/docx_helpers.js` sudah **diarsipkan**
> (`archives/cleanup-audit-revisi-2026-06-30/`). Jangan dipakai lagi.

## Dua sumber config (untuk reusability)
- `config.thesis.json` — identitas dokumen (judul, penulis, NIM, dosen, dst). **Per thesis.**
- `pedoman/upb.json` — aturan format kampus (margin, font, spasi, sitasi). **Per kampus.**

Thesis baru = isi `config.thesis.json`. Kampus baru = tambah `pedoman/<kampus>.json`.
Builder **tidak perlu disentuh**.

## Dua jalur audit (catatan)
- **Python** (`tools/main.py`) — panggil API LLM eksternal; butuh `.env` + kuota.
- **Skill Claude Code** (`.claude/skills/audit-skripsi`) — audit serupa, gratis, tanpa API key.

Untuk audit harian sebaiknya pakai skill Claude Code (lebih hemat). Pipeline Python = mode batch.

## Jangan bingung lagi
- Penomoran stage yang benar = tabel di atas (01–11).
- `main.py` = 6 agen audit. Kalau ada teks yang bilang "7 agen", itu warisan nama lama.
