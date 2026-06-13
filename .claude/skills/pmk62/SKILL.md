---
name: pmk62
description: >
  Skill referensi, analisis, dan produksi dokumen berbasis PMK Nomor 62 Tahun 2023
  tentang Perencanaan Anggaran, Pelaksanaan Anggaran, serta Akuntansi dan Pelaporan
  Keuangan. GUNAKAN SKILL INI setiap kali pengguna:
  - Bertanya tentang prosedur, regulasi, atau pasal dalam PMK 62/2023
  - Membutuhkan penjelasan siklus anggaran APBN (RKA, DIPA, revisi, SPP, SPM, SP2D)
  - Ingin menganalisis kondisi satker dan mencocokkannya dengan ketentuan PMK 62/2023
  - Meminta pembuatan dokumen kerja: checklist kesiapan satker, memo, ringkasan SOP, matriks RACI
  - Melakukan penelitian akademis tentang tata kelola keuangan negara, deviasi anggaran, NKA, EKA, IKPA
  - Menyebut kata kunci: PMK 62, siklus anggaran, RKA-K/L, DIPA, revisi anggaran, SPP/SPM/SP2D,
    NKA, EKA, IKPA, SAKTI, rekonsiliasi, pejabat perbendaharaan, KPA, PPK, PPSPM, bendahara,
    deviasi anggaran, penyerapan anggaran, belanja satker, Halaman III DIPA
---

# Skill: PMK 62/2023 — Referensi, Analisis & Produksi Dokumen

Skill ini membantu pengguna memahami, menganalisis, dan memproduksi dokumen
berbasis **PMK Nomor 62 Tahun 2023** — regulasi omnibus keuangan negara yang
mencakup perencanaan, pelaksanaan, dan pelaporan anggaran APBN.

**Pengguna utama skill ini:** Peneliti, mahasiswa, dan akademisi yang mengkaji
tata kelola keuangan negara, deviasi anggaran, atau kinerja satker — termasuk
staf satker dan pejabat perbendaharaan yang membutuhkan referensi operasional.

---

## Cara Menggunakan Skill Ini

### Langkah 1 — Muat referensi utama
Sebelum menjawab pertanyaan spesifik, baca file referensi berikut:

```
references/SOP-PMK62-2023.md
```

File ini berisi panduan implementasi operasional PMK 62/2023 secara lengkap:
5 fase siklus anggaran, workflow diagram, matriks RACI, checklist satker, dan glosarium.

### Langkah 2 — Identifikasi mode tugasnya

| Mode | Ciri Permintaan | Tindakan |
|------|----------------|----------|
| **Referensi & FAQ** | "Apa itu...", "Bagaimana prosedur...", "Siapa yang berwenang..." | Jawab langsung dari SOP, sertakan referensi pasal |
| **Analisis Kondisi Satker** | Ada data realisasi / kondisi nyata yang dibandingkan ke PMK | Jalankan gap analysis: kondisi aktual vs. ketentuan PMK |
| **Produksi Dokumen** | "Buat checklist...", "Buatkan memo...", "Ringkaskan SOP..." | Hasilkan dokumen dalam format yang diminta (Markdown/docx) |
| **Penelitian Akademis** | Kerangka teori, landasan regulasi, analisis kebijakan | Rangkum substansi regulasi dalam konteks akademis + kutip pasal |

---

## Panduan Menjawab per Mode

### Mode Referensi & FAQ

- Selalu sertakan **referensi pasal** (contoh: "Pasal 88 PMK 62/2023").
- Gunakan diagram alur dari SOP bila relevan — tampilkan sebagai blok kode `text`.
- Untuk pertanyaan tentang **pejabat perbendaharaan**, selalu sertakan larangan perangkapan jabatan (Pasal 180 dst).
- Untuk pertanyaan tentang **revisi anggaran**, sebutkan kewenangan berdasarkan jenis revisi (KPA / Eselon I / DJA / Menkeu).

**Contoh pertanyaan → struktur jawaban:**
```
Q: "Siapa yang boleh menerbitkan SPM?"
A: Berdasarkan PMK 62/2023, SPM diterbitkan oleh PPSPM (Pejabat Penandatangan
   Surat Perintah Membayar). PPSPM DILARANG merangkap jabatan PPK atau
   Bendahara dalam satker yang sama [Pasal 180 dst]. Alur dokumen:
   SPP (PPK) → SPM (PPSPM) → SP2D (KPPN).
```

### Mode Analisis Kondisi Satker

Gunakan kerangka ini saat ada data nyata dari pengguna:

1. **Identifikasi kondisi aktual** — apa yang terjadi di satker?
2. **Cocokkan ke ketentuan PMK** — pasal mana yang relevan?
3. **Temukan gap / potensi risiko** — apakah ada penyimpangan?
4. **Rekomendasikan tindakan** — langkah korektif sesuai SOP

Untuk analisis **deviasi anggaran / penyerapan rendah**, gunakan kerangka dari
Fase 5 (Pengendalian & EKA): eskalasi ke KPA jika deviasi >10%, respons
jika realisasi <80% target pada September.

**Konteks penelitian skripsi:** Jika pengguna membahas deviasi anggaran pada
Halaman III DIPA atau analisis IKPA/NKA untuk keperluan akademis, hubungkan
ke kerangka EKA (Pasal 245–250) dan sistem penghargaan/sanksi (Pasal 251–258).

### Mode Produksi Dokumen

Format output berdasarkan permintaan:
- **Checklist** → gunakan template dari Bagian 10 SOP (Awal Tahun / Sepanjang Tahun / Tutup Tahun)
- **Memo/Nota Dinas** → format formal dengan referensi pasal yang relevan
- **Ringkasan Regulasi** → struktur: Tujuan → Ruang Lingkup → Poin Kunci → Implikasi Praktis
- **Matriks RACI** → adaptasi dari Bagian 8 SOP, sesuaikan ke konteks yang diminta

Jika output berupa dokumen Word (.docx), baca skill `docx` terlebih dahulu.

### Mode Penelitian Akademis

Untuk keperluan penelitian (skripsi, jurnal, analisis kebijakan):

1. **Posisikan PMK 62/2023 dalam konteks regulasi** — regulasi omnibus pengganti 13 PMK sebelumnya
2. **Kaitkan ke teori yang relevan** — Agency Theory (PA/Agen: PA, KPA, PPK, PPSPM), stewardship, akuntabilitas publik
3. **Sediakan referensi pasal yang akurat** — penting untuk kutipan ilmiah
4. **Bedakan antara normatif (isi PMK) vs. empiris (realitas pelaksanaan)**

Ingatkan pengguna bahwa skill ini adalah **panduan operasional**, bukan pengganti
teks resmi PMK. Untuk kepastian hukum dan kutipan akademis, rujuk ke Berita Negara
atau teks asli PMK 62 Tahun 2023.

---

## Glosarium Cepat (Singkatan Paling Sering Muncul)

| Singkatan | Kepanjangan |
|-----------|-------------|
| DIPA | Daftar Isian Pelaksanaan Anggaran |
| EKA | Evaluasi Kinerja Anggaran |
| IKPA | Indikator Kinerja Pelaksanaan Anggaran |
| KPA | Kuasa Pengguna Anggaran |
| KPPN | Kantor Pelayanan Perbendaharaan Negara |
| NKA | Nilai Kinerja Anggaran |
| POK | Petunjuk Operasional Kegiatan |
| PPK | Pejabat Pembuat Komitmen |
| PPSPM | Pejabat Penandatangan Surat Perintah Membayar |
| RKA-K/L | Rencana Kerja dan Anggaran Kementerian/Lembaga |
| RPD | Rencana Penarikan Dana |
| SAKTI | Sistem Aplikasi Keuangan Tingkat Instansi |
| SP2D | Surat Perintah Pencairan Dana |
| SPM | Surat Perintah Membayar |
| SPP | Surat Permintaan Pembayaran |

> Glosarium lengkap ada di `references/SOP-PMK62-2023.md` Bagian 11.

---

## Batasan Skill Ini

- Skill ini berbasis SOP operasional, **bukan teks resmi PMK**. Nomor pasal yang
  disebut mengacu pada referensi SOP — selalu verifikasi ke PMK asli untuk
  kepastian hukum.
- Untuk isu yang belum tercakup SOP (misalnya PMK turunan, Perdirjen terbaru,
  atau perubahan setelah 2023), gunakan web search untuk melengkapi.
- Untuk produksi dokumen Word formal, baca skill `docx` sebelum generate file.
