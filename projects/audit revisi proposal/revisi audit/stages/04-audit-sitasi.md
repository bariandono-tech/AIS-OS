# Stage 4: Audit Sitasi & Daftar Pustaka

## Tujuan
Mengaudit kelengkapan dan konsistensi sitasi: ghost citations, orphan references, format APA, dan kebaruan referensi.

## Input
- `.tmp/01-raw-extraction.txt` — teks mentah hasil ekstraksi PDF

## Instruksi Eksekusi
1. Temukan **Ghost Citations** — dikutip di teks tapi tidak ada di Daftar Pustaka.
2. Temukan **Orphan References** — ada di Daftar Pustaka tapi tidak pernah dikutip.
3. Cek **Konsistensi Format** — APA/Harvard/campuran, "et al." vs "dkk.", "&" vs "dan".
4. Lakukan **Recency Check** — persentase referensi < 5 tahun, 5-10 tahun, > 10 tahun.
5. Temukan **Klaim Tanpa Sitasi** — kalimat klaim faktual tanpa rujukan.
6. Cek **Format Daftar Pustaka** — urutan alfabetis, kelengkapan, judul miring.
7. Simpan ke `.tmp/04-audit-sitasi.md`.

## Tool
`tools/audit_sitasi.py`
