# Stage 9: Writing / Revisi Per-Bab

## Tujuan
Mengeksekusi revisi setiap bab skripsi berdasarkan temuan audit dari Stage 2-7. Agen Writing adalah REVISOR — memperbaiki draf asli, bukan menulis dari nol.

## Input
- `.tmp/01-raw-extraction.txt` — draf mentah asli (Single Source of Truth)
- `.tmp/02-audit-puebi.md` s.d. `.tmp/07-audit-koherensi.md` — seluruh file audit
- `outputs/{topik}/revisi-{versi}/catatan-dosen.md` — catatan dosen (opsional, untuk v2+)

## Instruksi Eksekusi
1. Baca draf mentah dan SEMUA file audit secara menyeluruh.
2. Untuk setiap bab (Bab 1, 2, 3), jalankan `tools/revisi_bab.py` secara **berurutan**.
3. Setelah ketiga bab selesai, jalankan revisi Daftar Pustaka.
4. Simpan output ke `outputs/{topik}/revisi-{versi}/05-revisi-bab*.md`.

## Guardrails
- **DILARANG** menulis dari nol — mulai dari draf asli, terapkan perubahan.
- **DILARANG** menambahkan teori/variabel/referensi baru kecuali audit memintanya.
- **DILARANG** menggunakan frasa AI generik.
- **WAJIB** cetak miring istilah asing.
- **WAJIB** pertahankan gaya bahasa asli mahasiswa.

## Tool
`tools/revisi_bab.py` (dipanggil oleh `tools/main_writing.py`)
