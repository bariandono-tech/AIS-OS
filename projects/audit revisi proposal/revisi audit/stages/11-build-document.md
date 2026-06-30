# Stage 11: Build Final Document

## Tujuan
Tahap akhir otomatis di mana semua file draf revisi per-bab yang berserakan dikompilasi menjadi satu file Markdown bersih (`makalah_seminar_final.md`), yang kemudian langsung dikonversi ke format Word (`makalah_seminar_final.docx`). 
Tahap ini mengotomatiskan proses konversi agar user tidak perlu lagi memberikan perintah (*prompt*) secara manual di akhir alur revisi.

## Input
- `outputs/{topik}/revisi-{versi}/05-revisi-bab1.md`
- `outputs/{topik}/revisi-{versi}/05-revisi-bab2.md`
- `outputs/{topik}/revisi-{versi}/05-revisi-bab3.md`
- `outputs/{topik}/revisi-{versi}/05-revisi-daftar-pustaka.md`

## Instruksi Eksekusi
Tahap ini dieksekusi secara terprogram di dalam `tools/main_writing.py` pada akhir *pipeline* (sebagai Stage 7 internal skrip), sehingga tidak membutuhkan intervensi AI orkestrator (Agent) untuk menjalankan perintah eksternal tambahan.

Langkah internal skrip:
1. Membaca setiap file revisi bab.
2. Membersihkan teks *metadata* atau teks pengantar dari LLM (contoh: `# Hasil Revisi Bab 1`).
3. Menggabungkan teks ke dalam satu file `makalah_seminar_final.md`.
4. Menggunakan _library_ `python-docx` untuk memindahkan struktur Markdown (Heading 1, 2, 3, teks tebal, miring, dan list) ke dalam format dokumen Word.

## Output
- `outputs/{topik}/revisi-{versi}/makalah_seminar_final.md`
- `outputs/{topik}/revisi-{versi}/makalah_seminar_final.docx`

## Tool
`tools/convert_to_word.py` (dipanggil otomatis oleh `tools/main_writing.py`)
