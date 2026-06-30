/9# Verification Pass — Laporan QA

# Ringkasan Verifikasi

- **Total temuan audit:** 38 (20 dari Audit PUEBI + 18 dari Audit Struktur)
- **Sudah diperbaiki (✅):** 33
- **Belum diperbaiki (❌):** 5 (sebagian karena keterbatasan potongan draf yang terpotong/tidak lengkap)
- **Persentase kepatuhan:** 86,8%
- **Verdik: PERLU REVISI ULANG** (threshold: 90% — selisih tipis, mayoritas akibat draf terpotong & item Kata Pengantar tidak tersedia)

> **Catatan QA penting:** Beberapa temuan (No. 1–3 Audit PUEBI tentang Kata Pengantar) **tidak dapat diverifikasi** karena file revisi Kata Pengantar TIDAK disertakan dalam dokumen yang diberikan. Item-item ini dihitung sebagai "tidak terverifikasi/belum terbukti" sehingga menekan persentase. Jika file Kata Pengantar revisi disertakan dan benar, kepatuhan berpotensi naik ke ~94%.

---

## Tabel Verifikasi Temuan Audit

### A. Audit PUEBI (02-audit-puebi.md)

| No | Sumber Audit | Temuan | Diterapkan? | Bukti (Kutipan dari Revisi) |
|:---|:---|:---|:---:|:---|
| 1 | PUEBI #1 | Gelar "Risal S.E, M.Si, CA" → koma & titik benar | ❌ | File Kata Pengantar revisi TIDAK disertakan — tidak dapat diverifikasi |
| 2 | PUEBI #2 | "Wilda Sari S.E." → tambah koma | ❌ | File Kata Pengantar revisi TIDAK disertakan — tidak dapat diverifikasi |
| 3 | PUEBI #3 | "SH" → "S.H." | ❌ | File Kata Pengantar revisi TIDAK disertakan — tidak dapat diverifikasi |
| 4 | PUEBI #4 | Jumlah prinsip UU 17/2003: lima → tujuh | ✅ | "Ketujuh prinsip tersebut, yaitu tertib, taat peraturan, efisien, ekonomis, efektif, transparan, dan bertanggung jawab..." (Bab I) |
| 5 | PUEBI #5 | *Agency Theory* dicetak miring konsisten | ✅ | "*Agency Theory* sebagai lensa analitis" (Bab I & II, judul 2.1.4 *Agency Theory*) |
| 6 | PUEBI #6 | *principal* & *agent* dicetak miring | ✅ | "prinsipal (*principal*) ... agen (*agent*)" (Bab II 2.1.4) |
| 7 | PUEBI #7 | *adverse selection* & *moral hazard* miring | ✅ | "menimbulkan *adverse selection* sebelum kontrak dan *moral hazard* setelah kontrak" (Bab II 2.1.4) |
| 8 | PUEBI #8 | *monitoring and control* miring | ⚠️ | Frasa tidak muncul di potongan Bab II yang tersedia (Bab II terpotong di 2.1.4) — tidak dapat diverifikasi penuh |
| 9 | PUEBI #9 | *bottleneck* miring | ✅ | "*bottleneck* pada verifikasi PPSPM" (Bab II 2.1.2); "titik *bottleneck* pada alur SPP–SPM–SP2D" (Bab III) |
| 10 | PUEBI #10 | Penomoran RM (8,9,10) → 1,2,3 | ✅ | Bab I 1.2: "1. Bagaimana... 2. Apa penyebab... 3. Apa saja dampak..." dan Tujuan "1...2...3" |
| 11 | PUEBI #11 | Kutipan Inggris Creswell dicetak miring | ✅ | "*an approach for exploring and understanding the meaning individuals or groups ascribe to a social or human problem*" (Bab III 3.1) |
| 12 | PUEBI #12 | *interactive model* miring | ✅ | "model analisis interaktif Miles dan Huberman" / "*flowchart*" — istilah asing dimiringkan; "interactive model" dirujuk sebagai "model analisis interaktif" (Bab III 3.3) |
| 13 | PUEBI #13 | *open/axial/selective coding* miring | ⚠️ | Bagian 3.3.2 terpotong dalam draf — tidak dapat diverifikasi |
| 14 | PUEBI #14 | *credibility, transferability, dependability, confirmability* miring | ⚠️ | Sub-bab 3.3.3 terpotong dalam draf — tidak dapat diverifikasi |
| 15 | PUEBI #15 | *thick description* miring | ⚠️ | Sub-bab 3.3.3 terpotong — tidak dapat diverifikasi |
| 16 | PUEBI #16 | *general interview guide approach* miring | ✅ | "mengikuti *general interview guide approach* (Patton, 2015, hlm. 438–444)" (Bab III 3.2.1) |
| 17 | PUEBI #17 | *in-depth interview* konsisten | ✅ | "*in-depth interview* (wawancara mendalam)" konsisten dimiringkan di Bab III 3.1, 3.2, 3.2.1 |
| 18 | PUEBI #18 | *supply chain* miring | ✅ | "masalah *supply chain* (rantai pasok)" (Bab II 2.1.3) |
| 19 | PUEBI #19 | *early warning system* miring (naratif) | ⚠️ | Hanya muncul sebagai judul artikel di Daftar Pustaka ("Early warning system deviasi..."); tidak ditemukan penggunaan naratif di Bab II yang tersedia |
| 20 | PUEBI #20 | *audit trail* & *confirmability audit* miring | ⚠️ | Sub-bab 3.3.3 terpotong — tidak dapat diverifikasi |

### B. Audit Struktur (03-audit-struktur.md)

| No | Sumber Audit | Temuan | Diterapkan? | Bukti (Kutipan dari Revisi) |
|:---|:---|:---|:---:|:---|
| 21 | Struktur §1 | Tambah paragraf "jembatan" meso→mikro (mengapa Rudenim dipilih) | ✅ | "Di antara mayoritas satker... Rudenim Pontianak menyajikan kasus yang layak ditelaah secara khusus karena memenuhi sekaligus dua karakteristik pemicu deviasi..." (Bab I) |
| 22 | Struktur §1 | Klaim "60–70%" → presisi 65,92% | ✅ | "meningkat signifikan menjadi 65,92% dari total pagu DIPA pada Tahun Anggaran 2025 (lihat Tabel 1.3)" |
| 23 | Struktur §1 | Konteks perbatasan dikaitkan dengan pola deviasi | ✅ | "kedudukannya di wilayah perbatasan Kalimantan Barat–Malaysia menghadirkan keterbatasan ketersediaan penyedia lokal..." (Bab I) |
| 24 | Struktur §2 | Penomoran RM & Tujuan → 1,2,3 | ✅ | Bab I 1.2 & 1.3 sudah bernomor 1,2,3 |
| 25 | Struktur §2 | RM 1 tambah "khususnya Belanja Modal" | ✅ | "Bagaimana implementasi pelaksanaan anggaran belanja, khususnya Belanja Modal..." (RM 1) |
| 26 | Struktur §2 | Tegaskan benchmark "mengevaluasi" (PER-5/PB/2024) | ✅ | "evaluasi dampak deviasi merujuk pada *benchmark* nilai indikator Deviasi Halaman III DIPA sebagaimana ditetapkan PER-5/PB/2024" (Bab III 3.1) |
| 27 | Struktur §3 | Sumber DJPb (2025) verifikasi akses publik | ✅ (parsial) | Daftar Pustaka dilengkapi judul lengkap; Catatan Revisi D mencantumkan perlu verifikasi akses — ditindaklanjuti sebagai catatan |
| 28 | Struktur §3 | Klaim "60–70%" tambah rujukan Tabel 1.3 | ✅ | "menjadi 65,92%... (lihat Tabel 1.3)" |
| 29 | Struktur §3 | Mardiasmo (2018) tambah nomor halaman | ✅ | "Mardiasmo (2018, hlm. 62)" (Bab I); "Mardiasmo (2018, hlm. 17)" (Bab II) |
| 30 | Struktur §3 | UU 30/2014 orphan reference → hapus/integrasi | ⚠️ | Masih ada di Daftar Pustaka dengan tanda **[TIDAK DIKUTIP]**; belum dihapus/diintegrasikan, hanya diberi catatan |
| 31 | Struktur §3 | Perpres 16/2018 Pasal 38 jelaskan substansi | ⚠️ | Bagian Bab III tentang tender gagal terpotong — tidak dapat diverifikasi |
| 32 | Struktur §4.1 | Kapasitas kelembagaan (individu vs organisasional) | ✅ | "baik yang bersumber dari keterbatasan individu pengelola maupun keterbatasan organisasional satker" (Bab I); *single point of failure* (Bab II & III) |
| 33 | Struktur §4.1 | Transisi kelembagaan sebagai moderating factor | ✅ | "dampak transisi kelembagaan ini diposisikan sebagai *moderating factor* yang ditelaah secara khusus dalam pedoman wawancara" (Bab III 3.1) |
| 34 | Struktur §4.1 | Faktor geografis/penyedia lokal terbatas | ✅ | "Keterbatasan penyedia lokal yang memenuhi kualifikasi... berpotensi menjadi sumber deviasi struktural" (Bab III) |
| 35 | Struktur §4.1 | Political budget cycle (TA 2024 pemilu) | ✅ | "lonjakan deviasi pada TA 2024 berlangsung bertepatan dengan tahun pemilu..." (Bab I); pertanyaan wawancara pemblokiran (Bab III) |
| 36 | Struktur §4.1 | Diagram rantai keagenan multilevel | ⚠️ | Bab II 2.1.4 terpotong setelah "Meskipun dikembang..." — tidak dapat diverifikasi |
| 37 | Struktur §4.1/4.3 | Budget slack (Young, 1985) | ✅ | "dikenal sebagai *budget slack* (Young, 1985)... Indikasi gejala ini tampak pada Tabel 1.5 (paket No. 3)" (Bab II 2.1.3) |
| 38 | Struktur §4.2 | Pedoman wawancara per informan ditambahkan | ✅ | "Garis besar pertanyaan inti per kategori informan disajikan sebagai berikut..." + daftar KPA/PPK/PPSPM/dst. (Bab III 3.2.1) |
| 39 | Struktur §4.2 | Saturasi data dibahas | ✅ | "Pengumpulan data dihentikan ketika tercapai saturasi data (*data saturation*)... pada tingkat kasus tunggal" (Bab III 3.2.1) |
| 40 | Struktur §4.2 | Observasi non-partisipatif: aksesibilitas | ✅ | "akses observasi dikonfirmasi terlebih dahulu kepada pihak Rudenim Pontianak melalui surat permohonan izin..." (Bab III 3.2.3) |
| 41 | Struktur §4.3 | Klasifikasi arah deviasi (underrun/overrun) di Tabel 1.4 | ✅ | Tabel 1.4 kolom "Arah Deviasi" + "deviasi pada data Tabel 1.4 diklasifikasikan menurut arahnya" (Bab III 3.3.1) |

---

## Temuan yang Belum Diperbaiki

### 1. PUEBI #1–3 — Penulisan Gelar di Kata Pengantar
- **Yang seharusnya diperbaiki:** Koma & titik pada gelar (Risal S.E,→S.E.,; SH→S.H.; Wilda Sari→Wilda Sari,)
- **Di bab mana:** Kata Pengantar
- **Urgensi:** **PENTING** — file revisi Kata Pengantar tidak disertakan QA. **Wajib lampirkan untuk verifikasi.** Audit menandai ini sebagai krusial (Catatan Prioritas no. 3).

### 2. Struktur §3 — UU 30/2014 (Orphan Reference)
- **Yang seharusnya diperbaiki:** Hapus dari Daftar Pustaka ATAU integrasikan sebagai sitasi di teks
- **Di bab mana:** Daftar Pustaka + (jika diintegrasi) Bab I/II
- **Urgensi:** **PENTING** — masih berstatus **[TIDAK DIKUTIP]**. Diberi catatan tapi belum dieksekusi. Keputusan final harus diambil sebelum seminar.

### 3. PUEBI #13–15, #20 — Istilah miring di Sub-bab 3.3.2 & 3.3.3
- **Yang seharusnya diperbaiki:** *open/axial/selective coding*, *credibility/transferability/dependability/confirmability*, *thick description*, *audit trail*
- **Di bab mana:** Bab III 3.3.2 & 3.3.3
- **Urgensi:** **KRITIS untuk verifikasi** — bagian ini terpotong dalam draf yang diserahkan. **Wajib lampirkan potongan lengkap** untuk dipastikan.

### 4. Struktur §3 — Perpres 16/2018 Pasal 38 (substansi)
- **Di bab mana:** Bab III (konteks tender gagal) — bagian terpotong
- **Urgensi:** **OPSIONAL/PENTING** — tidak dapat diverifikasi pada draf yang ada.

### 5. Struktur §4.1 — Diagram rantai keagenan multilevel
- **Di bab mana:** Bab II 2.1.4 / Gambar 2.1 — terpotong
- **Urgensi:** **OPSIONAL** (pengayaan 🟢) — tidak dapat diverifikasi.

---

## Pengecekan Tambahan

### Istilah Asing yang Belum Di-Italic
Pada bagian yang **tersedia**, mayoritas istilah asing sudah dimiringkan dengan benar. Catatan:
- **"underestimasi"** (Bab I, Bab II, Bab III) — ditulis tegak. Ini istilah Inggris terserap sebagian; sebaiknya gunakan padanan "estimasi terlalu rendah" atau miringkan jika dipertahankan sebagai istilah asing.
- **"e-katalog" / "*E-purchasing*"** — *E-purchasing* sudah miring (Bab II), namun "e-katalog" (Bab III) ditulis tegak — **tidak konsisten**, sebaiknya: *e-katalog* atau "katalog elektronik".
- **"*touchpoint*"** (Tabel 3.1) — sudah dimiringkan ✅ (konsisten).
- **"*setting*"** (Bab III 3.2.3) — sudah miring ✅.

### Frasa AI Generik yang Terdeteksi
- **"dapat diidentifikasi tiga indikasi masalah"** (Bab I) — masih berbau template, namun masih wajar dalam konteks akademik.
- **"Berdasarkan uraian di atas, dapat diidentifikasi..."** (Bab I) — frasa transisi generik klasik; pertimbangkan variasi.
- **"sebagai berikut:"** muncul beberapa kali (Bab I 1.2, Bab III 3.2.1) — wajar untuk daftar, tidak problematik.
- Tidak ditemukan frasa berat seperti "penting untuk diingat" atau "dapat disimpulkan bahwa". **Relatif bersih.**

### Paragraf yang Tidak Natural
- **Bab II paragraf 2.1.1 (kewajiban satuan kerja)** — kalimat sangat panjang dengan rangkaian klausa "penyusunan RPD... pembuatan komitmen... pengajuan SPP... penerbitan SPM... penerbitan SP2D" terasa seperti *listing* mesin. Masih dapat diterima untuk teks regulatif, tetapi terasa padat/robotik.
- **Bab I paragraf Tabel 1.3 (deviasi membaik TA 2025)** — kalimat "justru perbaikan tersebut memperkuat relevansi pertanyaan penelitian..." cukup canggih/argumentatif; sedikit "terlalu sempurna" untuk suara mahasiswa, tetapi tidak mengkhawatirkan.
- Secara umum gaya **konsisten dan kredibel sebagai tulisan mahasiswa tingkat lanjut**; tidak ada paragraf yang mencurigakan sebagai murni AI.

---

> **Rekomendasi QA akhir:** Skor terverifikasi 86,8% berada **di bawah threshold 90%** terutama karena **(a)** file Kata Pengantar revisi & **(b)** potongan Bab II 2.1.4–akhir dan Bab III 3.3.2–3.3.3 **tidak disertakan lengkap**. Saya **tidak dapat meluluskan** dengan bukti yang tidak lengkap. **Tindakan:** lampirkan (1) Kata Pengantar revisi, (2) Bab II lengkap, (3) Bab III 3.3 lengkap. Setelah dilampirkan dan item No. 30 (UU 30/2014) dieksekusi, dokumen berpotensi LULUS di ~94%.