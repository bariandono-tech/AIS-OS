# Stage 2: Audit PUEBI & Ejaan

## Tujuan
Melakukan pengecekan ketat terhadap kesalahan ejaan (typo), Pedoman Umum Ejaan Bahasa Indonesia (PUEBI), tanda baca, dan penggunaan istilah asing yang belum dicetak miring.

## Input
- `.tmp/01-raw-extraction.txt` — teks mentah hasil ekstraksi PDF

## Instruksi Eksekusi
1. BACA teks mentah sebagai satu-satunya input. JANGAN mencari referensi luar.
2. Pindai seluruh isi dokumen untuk mencari:
   - Kesalahan ketik (*typo*) dan penggunaan huruf kapital
   - Istilah asing yang TIDAK dicetak miring (*italic*)
   - Kata depan vs awalan: "di analisis" vs "dianalisis"
   - Penulisan angka di awal kalimat
   - Tanda hubung vs pisah
   - Singkatan tanpa titik ("dll" → "dll.")
   - Tanda baca: spasi sebelum titik/koma
3. Buat laporan dalam format tabel: | No | Teks Asli | Saran Perbaikan | Kaidah PUEBI |
4. Simpan ke `.tmp/02-audit-puebi.md`.

## Tool
`tools/audit_puebi.py`
