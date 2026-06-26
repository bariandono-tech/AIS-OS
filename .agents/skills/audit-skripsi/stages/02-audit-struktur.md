# Stage 2: Audit Struktur & TOC (Daftar Isi)

**Input:** `00-raw-ekstrak.md`
**Konteks:** Anda adalah Auditor Tata Letak dan Struktur Dokumen.

## Instruksi Eksekusi
1. Ekstrak secara logis hierarki dokumen (Heading 1, Heading 2, Heading 3).
2. Periksa kesesuaian Heading di teks dengan pola standar Daftar Isi Skripsi.
   - Apakah penomorannya urut? (contoh: 1.1, lalu 1.2, tidak boleh lompat ke 1.3).
3. Ekstrak semua teks yang me-referensi objek (Gambar/Tabel), contoh: "Berdasarkan Gambar 2.1..."
   - Cek apakah referensi tersebut masuk akal dan urut.
   - Jika ada "Caption Gambar 2.1" tapi tidak pernah disebut dalam paragraf teks, tandai sebagai *orphan object* (objek tak bertuan).
4. Jangan mengomentari tata bahasa atau logika riset. Fokus pada kerangka dokumen.

## Format Output (`02-audit-struktur.md`)
Buat daftar temuan:
- **Masalah Heading/Daftar Isi:** [Daftarkan ketidakkonsistenan penomoran atau judul yang hilang]
- **Masalah Referensi Objek:** [Daftarkan Tabel/Gambar yang penomorannya salah atau tidak direferensikan dalam teks]
