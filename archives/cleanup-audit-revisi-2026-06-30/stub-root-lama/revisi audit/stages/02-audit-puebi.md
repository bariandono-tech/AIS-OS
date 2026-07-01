# Stage 2: Audit PUEBI dan Tata Bahasa

## Tujuan
Melakukan pengecekan ketat terhadap kesalahan ejaan (typo), Pedoman Umum Ejaan Bahasa Indonesia (PUEBI), dan pemborosan kalimat pada naskah proposal.

## Instruksi Eksekusi
1. BACA `outputs/{topik-proposal}/01-raw-extraction.md` sebagai satu-satunya input Anda. JANGAN mencari referensi lain.
2. Pindai seluruh isi dokumen khusus untuk mencari tiga hal:
   - Kesalahan ketik (*Typo*) dan penggunaan huruf kapital.
   - Kalimat pasif yang berlebihan atau kalimat yang tidak memiliki subjek/predikat yang jelas.
   - Penggunaan istilah asing yang belum dicetak miring (*italic*).
3. Buat laporan perbaikan dalam format tabel yang berisi kolom: [Teks Asli], [Saran Perbaikan], [Alasan Kesalahan].
4. Tulis hasil audit ini ke dalam file `outputs/{topik-proposal}/02-audit-puebi.md`.
