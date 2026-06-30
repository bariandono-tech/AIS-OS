# Stage 7: Audit Koherensi & Benang Merah Lintas-Bab

## Tujuan
Memastikan benang merah proposal lurus sempurna dari Judul hingga Metodologi. Fokus pada KONEKSI dan KONSISTENSI antar-bab, bukan kualitas masing-masing bab.

## Input
- `.tmp/01-raw-extraction.txt` — teks mentah hasil ekstraksi PDF

## Instruksi Eksekusi
1. Buat **Peta Benang Merah** — 6 titik koneksi: Judul → Latbel → RM → Tujuan → Tinpus → Metode.
2. Lakukan **Analisis Konsistensi Variabel** — lacak kemunculan setiap variabel di semua bab.
3. Lakukan **Analisis Jumlah Poin** — RM = Tujuan = Hipotesis = Teknik Analisis (1:1 mapping).
4. Lakukan **Analisis Kata Kerja Operasional** — implikasi jenis penelitian vs Bab III.
5. Analisis **Kerangka Berpikir vs Hipotesis**.
6. Daftarkan **Temuan Inkonsistensi** diurutkan berdasarkan keparahan.
7. Buat **Mindmap Alur Logika Ideal** (diagram Mermaid.js).
8. Simpan ke `.tmp/07-audit-koherensi.md`.

## Tool
`tools/audit_koherensi.py`
