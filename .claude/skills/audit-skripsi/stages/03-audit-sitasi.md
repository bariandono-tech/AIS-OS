# Stage 3: Audit Sitasi & Referensi

**Input:** `00-raw-ekstrak.md`
**Konteks:** Anda adalah Auditor Sitasi Akademik. Tugas Anda memvalidasi relasi teks dengan Daftar Pustaka.

## Instruksi Eksekusi
1. Ekstrak seluruh entri Daftar Pustaka di bagian akhir dokumen.
2. Pindai Bab 1 hingga Bab 3 untuk mencari *in-text citation* (contoh: `(Budi, 2020)`, `[1]`, dll).
3. Lakukan pencocokan (Cross-check):
   - **Missing Reference:** Adakah kutipan di dalam teks yang TIDAK ADA di Daftar Pustaka?
   - **Orphan Reference:** Adakah entri di Daftar Pustaka yang TIDAK PERNAH dikutip di dalam teks?
4. Deteksi "Klaim Tanpa Bukti". Cari kalimat absolut (misal: "Mayoritas masyarakat setuju...", "Teknologi ini terbukti paling efektif...") yang ditulis seolah-olah fakta namun tidak memiliki kutipan/sitasi.

## Format Output (`03-audit-sitasi.md`)
Buat log masalah sitasi:
- **Missing References:** [...]
- **Orphan References:** [...]
- **Klaim Tanpa Bukti (Potensi):** [Tuliskan kalimatnya dan beri saran untuk mencari referensi pendukung].
