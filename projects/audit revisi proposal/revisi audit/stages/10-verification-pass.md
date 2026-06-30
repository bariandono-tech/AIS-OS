# Stage 10: Verification Pass (Quality Assurance)

## Tujuan
Memastikan SELURUH temuan audit dari Stage 2-7 telah diterapkan di draf revisi Stage 9. Agen Verification adalah AUDITOR, bukan editor.

## Input
- `.tmp/02-audit-puebi.md` s.d. `.tmp/07-audit-koherensi.md` — file audit
- `outputs/{topik}/revisi-{versi}/05-revisi-*.md` — file revisi

## Instruksi Eksekusi
1. Baca SEMUA file audit → ekstrak setiap temuan individual.
2. Baca SEMUA file revisi.
3. Cross-check: untuk setiap temuan audit, cari bukti perbaikan di draf revisi.
4. Buat tabel: | No | Sumber Audit | Temuan | Diterapkan? | Bukti |
5. Hitung persentase kepatuhan.
6. Jika < 90% → **PERLU REVISI ULANG**. Jika ≥ 90% → **LULUS**.
7. Cek tambahan: istilah asing belum italic, frasa AI generik, paragraf tidak natural.
8. Simpan ke `outputs/{topik}/revisi-{versi}/06-verification-pass.md`.

## Tool
`tools/verification_pass.py` (dipanggil oleh `tools/main_writing.py`)
