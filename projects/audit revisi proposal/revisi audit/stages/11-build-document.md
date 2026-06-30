# Stage 11: Build Final Document

## Tujuan
Tahap akhir otomatis di mana file-file draf revisi per-bab (`.md`) dikonversi menjadi dokumen Word (`.docx`) dengan format akademis yang identik dengan `build_makalah.js`.

Arsitektur "Build-First": file `.md` revisi **sudah mengikuti schema yang presisi** (didefinisikan di `templates/build_schema.md`), sehingga `build_revisi.js` (Node.js) dapat langsung membacanya dan menghasilkan docx tanpa parsing HTML atau konversi perantara.

## Input
- `outputs/{topik}/revisi-{versi}/05-revisi-bab1.md`
- `outputs/{topik}/revisi-{versi}/05-revisi-bab2.md`
- `outputs/{topik}/revisi-{versi}/05-revisi-bab3.md`
- `outputs/{topik}/revisi-{versi}/05-revisi-daftar-pustaka.md`

## Instruksi Eksekusi
Tahap ini dieksekusi oleh `tools/convert_to_word.py` yang memanggil:

```
node build_revisi.js <input_dir> <output_docx>
```

`build_revisi.js` (di `skripsi/drafts/`) menggunakan `docx_helpers.js` — modul *shared* yang berisi semua formatting rules (heading, paragraf, tabel, daftar pustaka) yang identik dengan `build_makalah.js`.

Langkah internal:
1. Membaca setiap file `.md` revisi secara langsung (line-based parser).
2. Mendeteksi block types: heading, paragraf, tabel, caption, sumber, gambar, daftar pustaka.
3. Mengkonversi setiap block menjadi objek docx.js (`Paragraph`, `Table`, `TextRun`).
4. Menggabungkan dengan front-matter hardcoded (Cover, Kata Pengantar, Daftar Isi).
5. Menghasilkan `.docx` final.

## Output
- `outputs/{topik}/revisi-{versi}/Makalah_Revisi.docx`

## Tool
- `tools/convert_to_word.py` → memanggil `skripsi/drafts/build_revisi.js`
- `skripsi/drafts/docx_helpers.js` — shared formatting module
- `templates/build_schema.md` — format rules yang di-inject ke prompt LLM
