# Stage 8: Konsolidasi Final Report

## Tujuan
Menggabungkan seluruh laporan dari 6 agen audit (Stage 2-7) ke dalam satu dokumen Final Report PDF.

## Input
- `.tmp/02-audit-puebi.md` s.d. `.tmp/07-audit-koherensi.md`

## Instruksi Eksekusi
1. BACA semua 6 file audit dari `.tmp/`.
2. Gabungkan menjadi satu file Markdown terkonsolidasi (`08-combined-report.md`).
3. Konversi menjadi PDF menggunakan `generate_pdf_report.py`.
4. Simpan ke `Final_Audit_Report.pdf` di root proyek.

## Tool
`tools/generate_pdf_report.py`
