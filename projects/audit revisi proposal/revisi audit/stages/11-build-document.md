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

`build_revisi.js` (**self-contained, di folder ini** — bukan lagi di `skripsi/drafts/`) berisi semua formatting rules (heading, paragraf, tabel, daftar pustaka) sendiri. Konstanta format dibaca dari `pedoman/upb.json` dan identitas dokumen dari `config.thesis.json`.

Langkah internal:
1. Membaca setiap file `.md` revisi secara langsung (line-based parser).
2. Mendeteksi block types: heading, paragraf, tabel, caption, sumber, gambar, daftar pustaka.
3. Mengkonversi setiap block menjadi objek docx.js (`Paragraph`, `Table`, `TextRun`).
4. Menggabungkan dengan front-matter hardcoded (Cover, Kata Pengantar, Daftar Isi).
5. Menghasilkan `.docx` final.

## Output
- `outputs/{topik}/revisi-{versi}/Makalah_Revisi.docx`

## Tool
- `tools/convert_to_word.py` → memanggil `build_revisi.js` (self-contained, di folder ini)
- `config.thesis.json` — identitas dokumen (cover, penulis, dosen, Kata Pengantar, Daftar Isi)
- `pedoman/upb.json` — aturan format kampus (margin, font, spasi)
- `templates/build_schema.md` — format rules yang di-inject ke prompt LLM
