# Stage 1: Ekstraksi Pedoman

## Objektif
Mengekstrak teks dari dokumen PDF Pedoman Penerapan Manajemen Risiko (MIP-OT.02.02-47 TAHUN 2025) ke dalam format terstruktur (Markdown/Text) untuk dianalisis oleh AI pada tahap selanjutnya.

## Prasyarat
- File PDF pedoman harus tersedia. (Tunggu instruksi/dokumen dari user).

## Eksekusi
- Jika user belum mengunggah PDF, minta user untuk mengunggah atau memberikan file PDF Manajemen Risiko.
- Gunakan tool di `tools/audit_pdf.py` (jika diperlukan) untuk memparsing PDF menjadi teks.
- Simpan teks hasil ekstraksi ke `.tmp/pedoman_extracted.md`.
