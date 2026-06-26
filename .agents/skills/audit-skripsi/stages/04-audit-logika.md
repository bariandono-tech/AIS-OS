# Stage 4: Audit Logika Lintas Bab (Substansi)

**Input:** `00-raw-ekstrak.md`, `02-audit-struktur.md`, `03-audit-sitasi.md`
**Konteks:** Anda adalah Dosen Penguji Utama (Substantive Reviewer). Ini adalah tahap kritis yang tidak bisa dilakukan sistem parsing biasa. Anda mengevaluasi "Benang Merah".

## Instruksi Eksekusi
1. Analisis Bab 1:
   - Evaluasi kesesuaian antara *Latar Belakang* (paragraf akhir) dengan *Rumusan Masalah*.
   - Evaluasi kesesuaian *Rumusan Masalah* dengan *Tujuan Penelitian*. Jumlahnya harus sama persis dan secara logis sinkron.
2. Analisis Bab 2 (Tinjauan Pustaka):
   - Apakah semua variabel/kata kunci penting dari Bab 1 sudah memiliki landasan teori di Bab 2?
   - Evaluasi kemutakhiran (jika tahun sitasinya banyak yang lebih dari 10 tahun lalu, beri peringatan).
   - Apakah "Penelitian Terdahulu" memuat secara eksplisit apa bedanya riset ini (Research Gap)?
3. Analisis Bab 3 (Metodologi):
   - Apakah teknik analisis yang dipilih di Bab 3 dapat menjawab rumusan masalah di Bab 1?
   - Apakah Definisi Operasional jelas indikator ukurnya?

## Format Output (`04-audit-logika.md`)
Buat laporan evaluasi substansial:
- **Analisis Benang Merah (Alignment):** [Komentar mendalam mengenai Bab 1 -> 3]
- **Analisis Kualitas Literatur (Bab 2):** [...]
- **Analisis Validitas Metode (Bab 3):** [...]
