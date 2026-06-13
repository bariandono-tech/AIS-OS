---
name: EPA
description: >
  Skill untuk Evaluasi Pelaksanaan Anggaran (EPA) — monitoring dan analisis anggaran APBN/APBD
  berdasarkan PMK 62/2023 dan PP 8/2006.

  GUNAKAN SKILL INI SETIAP KALI pengguna meminta:
  - Evaluasi/monitoring pelaksanaan atau penyerapan anggaran
  - Analisis realisasi, variance, atau deviasi pagu vs realisasi
  - Perhitungan Nilai Kinerja Anggaran (NKA) sesuai PMK 62/2023
  - Dashboard/visualisasi penyerapan anggaran satker/K-L
  - Laporan evaluasi anggaran bulanan/triwulanan/tahunan
  - Identifikasi under-spending, over-commitment, atau risiko penyerapan rendah
  - Analisis kinerja satker berdasarkan DIPA
  - Review kepatuhan PMK 62/2023 atau regulasi anggaran
  - Rekomendasi percepatan penyerapan anggaran
  - File Excel/CSV berisi data DIPA, RKA-KL, realisasi anggaran
  - Kata kunci: anggaran, DIPA, realisasi, penyerapan, satker, NKA, RKA, APBN, APBD
---

# EPA — Evaluasi Pelaksanaan Anggaran

Skill komprehensif untuk monitoring dan evaluasi pelaksanaan anggaran APBN/APBD, dirancang untuk
pengelola keuangan negara, auditor internal, dan pengawas anggaran. Mengacu pada PMK 62/2023,
PP 8/2006, dan OECD Performance Budgeting Framework.

---

## LANGKAH KERJA UTAMA

### 1. Pahami Konteks & Input Pengguna
- Identifikasi: periode evaluasi (bulan/triwulan/tahun), jenis output yang diminta, level agregasi (satker/eselon I/K-L)
- Jika ada file data (Excel/CSV): baca dengan pandas, validasi struktur kolom
- Jika tidak ada file: minta pengguna upload atau buat simulasi dengan data contoh

### 2. Pilih Mode Output
Berdasarkan permintaan, pilih satu atau beberapa mode:
- **Mode A – Dashboard Interaktif**: React/HTML dengan chart dan filter dinamis
- **Mode B – Laporan Evaluasi**: Word/PDF/Markdown naratif
- **Mode C – File Excel Analisis**: workbook multi-sheet dengan formula
- **Mode D – Analisis Cepat**: jawaban teks langsung dengan tabel markdown
- **Mode E – Presentasi**: PowerPoint/slide deck

### 3. Lakukan Analisis
Ikuti panduan di `references/analisis-formula.md` untuk formula dan metodologi yang tepat.

### 4. Hasilkan Output
Ikuti panduan teknis di `references/output-guide.md` untuk format dan standar output.

---

## REFERENSI REGULASI UTAMA

### PMK 62/2023 — Kerangka Evaluasi Kinerja Anggaran

**Pasal 248 — Indikator Kinerja Pelaksanaan Anggaran (3 Aspek):**
1. **Kualitas Perencanaan Pelaksanaan Anggaran** — kesesuaian antara pelaksanaan anggaran dan alokasi/rencana penarikan dana dalam DIPA
2. **Kualitas Implementasi Pelaksanaan Anggaran** — kemampuan Satker merealisasikan anggaran yang ditetapkan dalam DIPA
3. **Kualitas Hasil Pelaksanaan Anggaran** — kemampuan Satker mencapai Keluaran sebagaimana ditetapkan dalam DIPA

**Pasal 249 — Nilai Kinerja Anggaran (NKA):**
```
NKA = (50% × Nilai Kinerja Perencanaan) + (50% × Nilai Kinerja Pelaksanaan)
```

**Kategorisasi NKA (Pasal 249 ayat 8):**
| Nilai | Kategori |
|-------|----------|
| > 90  | Sangat Baik |
| > 80 s.d. 90 | Baik |
| > 60 s.d. 80 | Cukup |
| > 50 s.d. 60 | Kurang |
| ≤ 50  | Sangat Kurang |

**Pasal 247 — Mekanisme Monitoring dan Evaluasi:**
- Penilaian kinerja pelaksanaan anggaran (kuantitatif)
- Reviu belanja pemerintah (analisis value for money)
- Telaah makro belanja pemerintah

**Pasal 244-249 — Fungsi Evaluasi Kinerja Anggaran:**
- **Fungsi Akuntabilitas**: membuktikan pertanggungjawaban penggunaan anggaran K/L
- **Fungsi Peningkatan Kualitas**: mengukur efektivitas dan efisiensi, mengidentifikasi faktor pendukung/kendala

**Pasal 36 — Prinsip Belanja Berkualitas:**
Efisiensi, Efektivitas, Prioritas, Transparansi, Akuntabilitas

### PP 8/2006 — Pelaporan Keuangan & Kinerja
- **Pasal 17**: Laporan Kinerja memuat ringkasan keluaran setiap kegiatan dan hasil setiap program
- **Pasal 27**: Laporan Keuangan dan Kinerja interim sekurang-kurangnya setiap triwulan
- **Pasal 20**: Sistem akuntabilitas kinerja terintegrasi dengan sistem perencanaan, penganggaran, perbendaharaan

### Milestone Target Penyerapan (Umum)
| Periode | Target Minimum |
|---------|---------------|
| Triwulan I (s.d. Maret) | 15% |
| Triwulan II (s.d. Juni) | 40% |
| Triwulan III (s.d. September) | 65% |
| Triwulan IV (s.d. Desember) | 95-100% |

---

## KAPABILITAS ANALISIS

### A. Analisis Realisasi Anggaran
- Variance analysis: pagu vs realisasi, deviasi nominal dan persentase
- Tren penyerapan: bulanan, triwulanan, YoY (Year-on-Year), MoM (Month-on-Month)
- Proyeksi penyerapan akhir tahun berdasarkan tren linear/eksponensial
- Identifikasi under-spending (realisasi < target) dan over-commitment
- Analisis per dimensi: program, kegiatan, output/KRO, jenis belanja, satker

### B. Evaluasi Kinerja (NKA)
- Hitung NKA komponen perencanaan dan pelaksanaan
- Kategorisasi otomatis berdasarkan PMK 62/2023
- Ranking satker berdasarkan NKA
- Identifikasi best performer dan laggard

### C. Analisis Rasio Keuangan
- Rasio Penyerapan = (Realisasi / Pagu) × 100%
- Rasio Efisiensi = Output Aktual / Anggaran Terserap
- Rasio Kepatuhan = Transaksi Sesuai Aturan / Total Transaksi
- Rasio Belanja Modal vs Operasional
- Rasio Belanja Langsung vs Tidak Langsung

### D. Early Warning System
- Alert penyerapan di bawah target milestone per triwulan
- Flag anomali: lonjakan realisasi akhir tahun (window dressing)
- Warning compliance: potensi pelanggaran batasan DIPA
- Identifikasi program dengan risiko under-spending

### E. Benchmark & Comparison
- Perbandingan antar satker dalam K/L yang sama
- Perbandingan YoY (tahun ini vs tahun sebelumnya)
- Ranking dan scoring relatif

---

## FORMAT INPUT DATA

### Format Excel/CSV Minimum:
```
Kolom Wajib:
- kode_satker / nama_satker
- kode_program / nama_program
- kode_kegiatan / nama_kegiatan (opsional)
- pagu_anggaran (numerik, dalam rupiah)
- realisasi (numerik, dalam rupiah)
- periode (bulan ke-N atau tanggal)

Kolom Opsional:
- jenis_belanja (Pegawai/Barang/Modal/Bansos)
- target_output / capaian_output
- kode_kro / nama_kro
- unit_eselon_i
```

### Validasi Otomatis yang Dilakukan:
1. Cek missing values pada kolom kritis
2. Cek logical error: realisasi > pagu (over-commitment)
3. Cek format angka (string vs numerik)
4. Cek duplikasi baris
5. Cek konsistensi kode satker/program

---

## PANDUAN PEMILIHAN OUTPUT

| Permintaan Pengguna | Mode Output |
|---------------------|-------------|
| "Buat dashboard monitoring" | Mode A (React/HTML interaktif) |
| "Buat laporan evaluasi" | Mode B (Word/PDF) |
| "Analisis file Excel ini" | Mode C (Excel output) + Mode D (analisis teks) |
| "Evaluasi penyerapan satker X" | Mode D (analisis cepat dengan tabel) |
| "Presentasi ke pimpinan" | Mode E (PowerPoint) |
| "Bandingkan kinerja satker" | Mode D + chart visualisasi |
| "Hitung NKA" | Mode D dengan formula lengkap |

---

## REFERENSI TAMBAHAN

Untuk detail lebih lanjut, baca file berikut sesuai kebutuhan:

- **`references/analisis-formula.md`** — Formula lengkap, metodologi NKA, rasio keuangan, proyeksi
- **`references/output-guide.md`** — Panduan teknis pembuatan dashboard, laporan, Excel
- **`references/template-narasi.md`** — Template narasi laporan evaluasi standar
- **`templates/`** — Template data input Excel dan format laporan

---

## CONTOH PENGGUNAAN

**Use Case 1**: "Evaluasi penyerapan anggaran Kementerian X semester I 2026"
→ Baca file Excel → Validasi data → Hitung NKA + variance analysis → Dashboard HTML + Laporan Word

**Use Case 2**: "Bandingkan kinerja 10 satker berdasarkan NKA PMK 62/2023"
→ Baca data → Hitung NKA per satker → Ranking table + bar chart → Identifikasi top/bottom performer

**Use Case 3**: "Identifikasi program dengan risiko under-spending"
→ Analisis penyerapan vs milestone target → Flag program < threshold → Rekomendasi tindak lanjut

**Use Case 4**: "Buat dashboard monitoring anggaran interaktif"
→ Generate React/HTML dashboard dengan filter satker, periode, jenis belanja, drill-down capability

---

## PRINSIP KERJA

1. **Akurasi regulasi**: selalu gunakan formula dan kategori sesuai PMK 62/2023 dan PP 8/2006
2. **Actionable**: rekomendasi harus spesifik dan dapat ditindaklanjuti, bukan hanya deskriptif
3. **User-friendly**: visualisasi dan laporan mudah dipahami non-teknis
4. **Compliance-first**: tandai potensi pelanggaran sebelum memberikan analisis lain
5. **Kontekstual**: pertimbangkan faktor musiman (DIPA baru, akhir tahun anggaran) dalam interpretasi
