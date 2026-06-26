# Stage 1: Ekstraksi Dokumen Mentah (Raw Extraction)

## Tujuan
Memastikan seluruh teks dari dokumen proposal (Word/PDF) yang diunggah *user* terekstrak bersih ke dalam satu file *markdown* sebagai bahan bakar utama (Single Source of Truth) untuk *stage* audit selanjutnya.

## Instruksi Eksekusi
1. Pastikan Anda (Agent Orkestrator) telah menerima dokumen Word (.docx) atau PDF dari user. Jika belum ada, MINTA user untuk menyediakan dokumen proposal tersebut.
2. Gunakan `python` script, pandoc, atau tool ekstraksi dokumen apa pun yang tersedia (misalnya pypdf/docx2txt) untuk menarik seluruh teks dari dokumen.
3. Bersihkan *noise* seperti nomor halaman atau *header/footer* yang berantakan jika ada.
4. Tulis hasil ekstraksi teks bersih ini ke file `outputs/{topik-proposal}/01-raw-extraction.md`.
5. Tuliskan ringkasan singkat (contoh: "Berhasil mengekstrak 15 halaman dari Bab 1-3") pada terminal untuk memberi tahu user sebelum melanjutkan ke tahap paralel.
