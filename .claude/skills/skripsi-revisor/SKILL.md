---
name: skripsi-revisor
description: >
  Skill untuk merevisi dan menyempurnakan skripsi mahasiswa secara menyeluruh (BAB I–IV) 
  dengan mengintegrasikan data terbaru, transcript wawancara final, dan memastikan 
  kesesuaian dengan Pedoman Skripsi kampus — tanpa mengubah struktur secara masif.

  GUNAKAN SKILL INI setiap kali pengguna:
  - Ingin merevisi atau menyempurnakan draft skripsi (BAB I, II, III, IV)
  - Ingin mengintegrasikan transcript wawancara atau data riil ke dalam skripsi
  - Ingin mencocokkan skripsi dengan pedoman/panduan kampus
  - Menyebutkan kata kunci: "revisi skripsi", "sempurnakan BAB", "update data skripsi",
    "transcript wawancara", "pedoman skripsi", "PRD skripsi", atau kombinasinya
  - Meng-upload file .docx BAB skripsi + PDF pedoman + transcript/data pendukung
---

# Skripsi Revisor

Skill ini membantu merevisi skripsi secara **targeted** — mengintegrasikan data terbaru 
dan transcript wawancara ke dalam draft yang sudah ada, sesuai Pedoman Skripsi kampus, 
tanpa merombak struktur bab.

---

## Konteks Penggunaan

Mahasiswa biasanya datang dengan kondisi:
- Draft BAB I–IV sudah ada (versi dummy/placeholder)
- Pedoman Skripsi kampus tersedia (sebagai PDF)
- Data terbaru / transcript wawancara final sudah siap
- PRD (Product Requirements Document) per BAB mungkin tersedia sebagai panduan konten
- Tujuan: **revisi minimal tapi tepat** — ganti data lama dengan data riil, 
  perkuat argumen dengan kutipan wawancara, pastikan format sesuai pedoman

---

## Alur Kerja (Workflow)

### LANGKAH 1 — Inventarisasi Input

Sebelum mulai merevisi, identifikasi semua file yang tersedia:

```
□ Pedoman Skripsi (PDF)           → sumber aturan format & struktur
□ BAB I .docx                     → Pendahuluan (latar belakang, rumusan masalah, dst)
□ BAB II .docx                    → Tinjauan Pustaka
□ BAB III .docx                   → Metode Penelitian
□ BAB IV .docx                    → Analisis Data & Pembahasan
□ Transcript wawancara            → data kualitatif primer
□ PRD BAB I–IV (opsional)         → panduan konten yang diinginkan
□ Data pendukung lain (tabel, dll) → jika ada
```

Jika ada file yang belum di-upload, **tanyakan dulu** sebelum lanjut.

---

### LANGKAH 2 — Baca & Pahami Pedoman Skripsi

Baca PDF Pedoman Skripsi dan ekstrak aturan-aturan kunci:

**Format teknis yang harus dicek:**
- Font, ukuran, spasi (Times New Roman 12, spasi 2, dst)
- Margin (atas 4cm, bawah 3cm, kiri 4cm, kanan 3cm)
- Penomoran halaman (romawi kecil untuk bagian awal, arab untuk isi)
- Format tabel dan gambar
- Format Daftar Pustaka (APA style)
- Struktur tiap BAB yang disyaratkan

Simpan aturan-aturan ini sebagai **referensi aktif** selama proses revisi.

---

### LANGKAH 3 — Analisis Gap per BAB

Baca seluruh draft BAB I–IV dan bandingkan dengan:
1. Pedoman Skripsi (apakah struktur dan format sudah sesuai?)
2. PRD per BAB jika tersedia (apakah konten sudah sesuai rencana?)
3. Transcript wawancara (mana bagian yang perlu data riil dari wawancara?)

Buat **Daftar Revisi** singkat per BAB:

```
BAB I  → [daftar perubahan yang diperlukan]
BAB II → [daftar perubahan yang diperlukan]
BAB III→ [daftar perubahan yang diperlukan]
BAB IV → [daftar perubahan yang diperlukan]
```

**Tampilkan daftar ini ke pengguna dan minta konfirmasi** sebelum mulai menulis revisi.

---

### LANGKAH 4 — Revisi Targeted per BAB

Lakukan revisi **secara berurutan** BAB I → II → III → IV.

Untuk setiap BAB, prinsip revisi adalah:

#### ✅ Yang BOLEH diubah:
- Data/angka placeholder → data riil
- Kutipan [xxx] atau [data belum ada] → kutipan dari transcript wawancara
- Nama informan/responden dummy → nama/inisial riil
- Tanggal, periode, lokasi placeholder → data aktual
- Kalimat yang tidak natural/janggal → perbaikan bahasa Indonesia baku
- Format yang tidak sesuai pedoman → sesuaikan

#### ❌ Yang TIDAK boleh diubah tanpa izin eksplisit:
- Struktur heading/sub-heading utama
- Alur argumentasi dan logika penelitian
- Variabel penelitian dan hipotesis
- Metodologi yang sudah dirancang

---

### LANGKAH 5 — Integrasi Transcript Wawancara

Saat mengintegrasikan kutipan dari transcript:

1. **Identifikasi** bagian di BAB yang memerlukan data wawancara
2. **Cari** pernyataan relevan dari transcript
3. **Format kutipan** sesuai pedoman kampus:
   - Kutipan langsung pendek (< 5 baris): dalam tanda petik, dalam teks
   - Kutipan langsung panjang (≥ 5 baris): paragraf terpisah, indentasi
4. **Sertakan atribusi**: nama/inisial informan, jabatan, tanggal wawancara
5. **Sambungkan** kutipan dengan analisis — jangan biarkan kutipan berdiri sendiri

---

### LANGKAH 6 — Validasi Format Akhir

Setelah seluruh revisi selesai, lakukan pengecekan akhir:

**Checklist format (sesuai Pedoman Skripsi FEB UPB):**
- [ ] Font Times New Roman 12 di seluruh naskah
- [ ] Spasi 2 untuk isi, spasi 1 untuk kutipan panjang & daftar pustaka
- [ ] Margin: atas 4cm, bawah 3cm, kiri 4cm, kanan 3cm
- [ ] Heading BAB: rata tengah, huruf kapital, bold
- [ ] Sub-heading: bold, penomoran sesuai (1.1, 1.2, dst)
- [ ] Tabel: judul di atas, sumber di bawah
- [ ] Gambar: nomor & judul di bawah
- [ ] Daftar Pustaka: APA style, alfabetis, spasi 1 per entri, antar entri 1,5 spasi
- [ ] Penomoran halaman: romawi kecil (bagian awal) / arab (isi & akhir)

---

### LANGKAH 7 — Output

Hasilkan file .docx untuk setiap BAB yang direvisi menggunakan **docx skill**.

> ⚠️ Sebelum membuat file .docx, baca `/mnt/skills/public/docx/SKILL.md` terlebih dahulu.

Penamaan file output:
```
BAB_I_[NamaTopik]_Revised.docx
BAB_II_[NamaTopik]_Revised.docx
BAB_III_[NamaTopik]_Revised.docx
BAB_IV_[NamaTopik]_Revised.docx
```

---

## Panduan Bahasa

Skripsi menggunakan **Bahasa Indonesia baku** sesuai TBBI (Tata Bahasa Baku Bahasa Indonesia):
- Hindari kata tidak baku (e.g., "nggak" → "tidak", "udah" → "sudah")
- Kalimat pasif untuk metode ("dilakukan", "diperoleh", "digunakan")
- Kata ganti orang ketiga untuk peneliti ("peneliti", bukan "saya" atau "penulis") 
- Bilangan desimal dengan koma bukan titik (53,20 bukan 53.20)
- Singkatan dieja lengkap pada kemunculan pertama

---

## Catatan Penting

- Selalu **tampilkan daftar revisi** dan minta konfirmasi pengguna sebelum menulis ulang
- Jika transcript wawancara panjang, **ekstrak dulu poin-poin kunci** sebelum diintegrasikan
- Jika ada **konflik** antara draft dan pedoman (misal format berbeda), ikuti **pedoman kampus**
- Untuk data kuantitatif yang berubah, pastikan **semua tabel dan angka terkait** juga diperbarui secara konsisten
- Jika pengguna hanya ingin revisi **satu BAB saja**, tetap baca BAB lain untuk memastikan **konsistensi antar-BAB**
