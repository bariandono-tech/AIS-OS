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
- **DILARANG** menulis dari nol; mulai dari draf asli, terapkan perubahan.
- **DILARANG** menambahkan teori/variabel/referensi baru kecuali audit memintanya.
- **DILARANG** menggunakan frasa AI generik.
- **DILARANG** tanda pisah panjang em-dash (—) dan en-dash (–). Gunakan koma, "yaitu", titik,
  atau tanda hubung biasa (-). Rentang angka/tahun: `2023-2025` (bukan `2023–2025`).
- **DILARANG** placeholder tertinggal (`hlm. xx`, `xx`, `[TBD]`). Nomor halaman belum ada = jangan tulis.
- **WAJIB** sitasi APA: `&` hanya di dalam kurung `(Jensen & Meckling, 1976)`; di narasi pakai
  `dan` — `Jensen dan Meckling (1976)`.
- **WAJIB** cetak miring istilah asing (tanpa meninggalkan tanda `*` terlihat).
- **WAJIB** pertahankan gaya bahasa asli mahasiswa.
- Aturan format lengkap: lihat `templates/build_schema.md` §11 (Aturan Gaya Penulisan).

## Tool
`tools/revisi_bab.py` (dipanggil oleh `tools/main_writing.py`)
