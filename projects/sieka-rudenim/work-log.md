# Work Log — Skripsi Deviasi Anggaran

---

## 2026-06-13

### Analisis Dampak Deviasi — Tabel Penyebab Pergeseran

**Dikerjakan:**
- Analisis mekanisme amplifikasi efek proporsi B53 terhadap % deviasi tertimbang dan rata-rata kumulatif Deviasi Hal. III DIPA (kasus Juni TA 2025)
- Pengisian kolom Dampak ke Deviasi/IKPA untuk 2 baris tabel penyebab pergeseran:
  - Baris 1: Pelaksanaan konstruksi mundur dari estimasi awal (target Agustus, aktual mendekati akhir kontrak September)
  - Baris 2: Swakelola rapat/perjadin koordinasi administrasi pembangunan tidak optimal

**Koreksi penting:**
- Swakelola rapat/perjadin koordinasi pembangunan = **B53**, bukan B52. Masuk belanja modal karena bagian dari pengelolaan proyek konstruksi gedung/bangunan.

**Output:**
- Note Notion dibuat dan di-link ke project Skripsi Deviasi Anggaran: [Analisis Dampak Deviasi — Efek Amplifikasi Proporsi B53](https://app.notion.com/p/37e78c4ce3888147878bec7be03968c4)
- Template kalimat dampak tersedia di note tersebut untuk baris-baris tabel berikutnya

**Insight kunci untuk skripsi:**
- Proporsi pagu B53 60–70% → setiap 1% deviasi B53 = ±0,6–0,7% kenaikan dev tertimbang
- Deviasi nominal kecil ≠ dampak IKPA kecil jika B53 yang menyimpang
- Swakelola dalam proyek konstruksi tetap B53 selama tujuannya mendukung kegiatan belanja modal

---

## 2026-06-14

### Pembenaran Spasi, Daftar Isi Statis, & Diagram Kerangka Penelitian (Agency Theory)

**Dikerjakan:**
- **Penyesuaian Spasi Paragraf (Spacing After = 0 pt)**: Mengubah default `spaceAfter` di helper `justifiedPara`, `numberedItem`, dan `numberedItemRuns` pada `build_makalah.js` menjadi `0` (0 pt) agar spasi baris ganda (2.0) benar-benar seragam tanpa gap vertikal tambahan antar-paragraf.
- **Perbaikan Dropdown Spasi MS Word (Double & 1.5)**: Menghapus properti `lineRule: 'exact'` di seluruh file `build_makalah.js` agar Word membaca spasi secara relatif sebagai **Double/Ganda** (untuk spasi 2.0) dan **1.5 lines/1,5 spasi** (untuk spasi 1.5), bukan *Exactly/Persis* (yang sebelumnya merusak dropdown opsi paragraf Word).
- **Perbaikan Dokumen Corrupt (Unreadable Content)**: Menambahkan opsi `type: 'png'` pada properti `ImageRun` untuk pemuatan gambar `kerangka_penelitian.png` agar extension-nya tidak terdeteksi `.undefined` dalam kemasan `.docx`, yang sebelumnya memicu error corrupt saat dibuka di Word.
- **Daftar Isi Statis & Spasi 1.5**: Mengganti dynamic `TableOfContents` bawaan Word dengan entri manual `tocEntry` berspasi 1.5 sesuai pedoman dosen agar bagian awal (Kata Pengantar, Daftar Tabel, Gambar) dapat tampil secara presisi dengan *dot leader* rata kanan.
- **Diagram Kerangka Penelitian (Gambar 2.1)**: Menggambar ulang diagram kerangka penelitian formal menggunakan program Python (Pillow) dengan tambahan 1 shape/box di bagian atas untuk **Landasan Teori: Agency Theory (Jensen & Meckling, 1976)** yang menunjuk ke bawah menuju alur pelaksanaan anggaran.
- **Pembaruan Skill Akademis**: Mengubah nama dan folder skill dari `pedomanskrps-upb` menjadi `pedomanmakalahakuntansi` dan memperinci aturan spasi di dalamnya.

**Output:**
- Berkas `makalah_seminar_AJIE_BARIANDONO_2110426823.docx` dan versi ALL CAPS-nya sukses di-generate secara sinkron dengan format spasi dan diagram yang valid.
- Berkas `kerangka_penelitian.png` berhasil di-generate dan ditanam secara utuh di dokumen Word.
- Skill `pedomanmakalahakuntansi` aktif menggantikan skill lama.

**Filosofi Kerangka Penelitian:**
- *Agency Theory* berada di paling atas sebagai *grand theory* (kacamata analisis) hubungan keagenan antara DJPb (Prinsipal) dan Rudenim (Agen).
- *Faktor Internal Satker* (SDM, RPD, Komitmen) bertindak sebagai input yang mendorong proses *Pelaksanaan Anggaran Belanja Modal* (Proses) di bagian tengah.
- Proses tersebut melahirkan *Deviasi Anggaran* (sebagai *Agency Problem* akibat asimetri informasi) yang selanjutnya memengaruhi *Kinerja IKPA* & *Akuntabilitas Keagenan* (Hasil & Dampak) di bagian kanan.

