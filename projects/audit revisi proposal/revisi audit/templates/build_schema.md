# Build Schema — Format Rules untuk Output Writing LLM

> **Tujuan**: Dokumen ini mendefinisikan aturan format Markdown yang WAJIB dipatuhi oleh LLM Writing Agent agar output `.md` dapat langsung diproses oleh `build_makalah.js` menjadi dokumen Word akademis yang rapi.

---

## 1. Heading Hierarchy

| Level Markdown | Fungsi di Makalah | Contoh |
|---|---|---|
| `# BAB I` | Judul BAB (centered, bold, ALL CAPS) | `# BAB I` diikuti baris baru `# PENDAHULUAN` |
| `## 1.1  Latar Belakang` | Sub-bab (left-aligned, bold) | `## 1.1  Latar Belakang` |
| `### 1.4.1  Manfaat Teoritis` | Sub-sub-bab (left-aligned, bold) | `### 1.4.1  Manfaat Teoritis` |

**Aturan:**
- Heading `#` (h1) HANYA digunakan untuk judul BAB. Formatnya SELALU dua baris:
  ```
  # BAB I
  # PENDAHULUAN
  ```
- Heading `##` (h2) untuk sub-bab: `## 1.1  Latar Belakang`
- Heading `###` (h3) untuk sub-sub-bab: `### 1.4.1  Manfaat Teoritis`
- JANGAN gunakan heading `####` (h4) — tidak didukung oleh builder.
- Gunakan **dua spasi** antara nomor dan judul sub-bab: `## 1.1  Latar Belakang` (bukan `## 1.1 Latar Belakang`)

---

## 2. Paragraf

- Setiap paragraf ditulis sebagai **satu baris utuh** (tidak di-wrap manual).
- Paragraf dipisahkan oleh **satu baris kosong**.
- Paragraf otomatis di-justify dan mendapat first-line indent 1.25cm di docx.
- JANGAN mulai paragraf dengan tab atau spasi.

---

## 3. Inline Formatting

| Markdown | Hasil di Docx | Contoh |
|---|---|---|
| `**text**` | Bold | `**ketujuh prinsip tersebut**` |
| `*text*` | Italic | `*Agency Theory*` |
| Plain text | Normal | `Pengelolaan keuangan negara...` |

**Aturan Italic:**
- WAJIB cetak miring (*italic*) setiap istilah asing (Bahasa Inggris, Latin, dsb): `*agency theory*`, `*adverse selection*`, `*moral hazard*`, `*supply chain*`, `*e-purchasing*`
- Judul jurnal dan buku dalam daftar pustaka: `*Jurnal Administrasi dan Kebijakan Publik*`
- Singkatan Latin: `*et al.*`
- JANGAN italic untuk akronim Indonesia (APBN, DIPA, IKPA, dsb)

---

## 4. Tabel

### 4.1 Caption Tabel
Caption ditulis pada **baris terpisah** sebelum tabel, format:
```
**Tabel 1.1 Judul Tabel Lengkap**
```
- Gunakan `**bold**` untuk caption
- Prefix SELALU `Tabel X.Y` dengan nomor bab dan urutan

### 4.2 Isi Tabel
Gunakan format tabel Markdown standar:
```
| No. | Aspek | Indikator | Bobot |
| --- | --- | --- | --- |
| 1 | Kualitas Perencanaan | Revisi DIPA | 5% |
```
- Baris pemisah header (`| --- | --- |`) WAJIB ada
- JANGAN kosongkan cell — tulis minimal satu karakter atau spasi

### 4.3 Sumber Tabel
Sumber ditulis pada **baris terpisah** setelah tabel, format:
```
*Sumber: Peraturan Direktur Jenderal Perbendaharaan Nomor PER-5/PB/2024*
```
- Gunakan `*italic*` untuk sumber
- Prefix SELALU `Sumber:`

---

## 5. Gambar / Flowchart

### 5.1 Caption Gambar
```
**Gambar 2.1 Kerangka Penelitian**
```
- Gunakan `**bold**` dan italic prefix sesuai konvensi akademis

### 5.2 Placeholder Gambar
Jika gambar belum tersedia, gunakan placeholder:
```
[image: kerangka_penelitian.png]
```
atau
```
[Flowchart dimasukkan manual]
```

---

## 6. List / Numbered Items

Gunakan format numbered list Markdown:
```
1. Item pertama
2. Item kedua
3. Item ketiga
```
- JANGAN gunakan bullet (`-`) untuk list akademis — selalu gunakan numbered (`1.`, `2.`, `3.`)
- Bullet (`-`) hanya untuk catatan revisi informal

---

## 7. Daftar Pustaka

Setiap entri ditulis sebagai **satu baris utuh** (satu paragraf):
```
Creswell, J. W. (2014). *Research design: Qualitative, quantitative, and mixed methods approaches* (4th ed.). SAGE Publications.
```
- Judul buku/jurnal dalam *italic*
- Volume jurnal dalam *italic*: `*8*(2), 502–518.`
- Format APA 7th Edition
- Urut alfabetis berdasarkan nama belakang penulis pertama

---

## 8. Page Break

Gunakan penanda eksplisit untuk page break antar BAB:
```
---PAGE_BREAK---
```
Builder akan otomatis memulai section baru dengan page setup yang sesuai.

---

## 9. Catatan Revisi

Section `## Catatan Revisi` di akhir setiap bab TIDAK akan masuk ke docx final. Section ini hanya untuk tracking internal. Gunakan format:
```
## Catatan Revisi
- Perubahan 1: ... (merujuk temuan audit X)
- Perubahan 2: ... (merujuk catatan dosen Y)
```

---

## 10. Contoh Output (Few-Shot)

Berikut contoh output yang benar untuk awal Bab 1:

```markdown
# BAB I
# PENDAHULUAN

## 1.1  Latar Belakang

Pengelolaan keuangan negara merupakan instrumen krusial dalam mewujudkan tujuan bernegara. Undang-Undang Nomor 17 Tahun 2003 tentang Keuangan Negara menegaskan bahwa keuangan negara harus dikelola secara tertib, taat pada peraturan perundang-undangan, efisien, ekonomis, efektif, transparan, dan bertanggung jawab dengan memperhatikan rasa keadilan dan kepatutan. **Ketujuh prinsip tersebut tidak bersifat opsional, melainkan merupakan standar minimum** yang harus dipenuhi oleh setiap entitas pemerintah dalam mengelola sumber daya publik yang dipercayakan kepadanya (Undang-Undang Nomor 17 Tahun 2003).

Instrumen utama dalam pengelolaan keuangan negara adalah Anggaran Pendapatan dan Belanja Negara (APBN). Sebagaimana diuraikan oleh Mardiasmo (2018), APBN berfungsi tidak hanya sebagai rencana keuangan tahunan pemerintah, tetapi juga sebagai instrumen fiskal multifungsi yang mencakup fungsi perencanaan, pengendalian, koordinasi, distribusi, dan stabilisasi ekonomi nasional.

**Tabel 1.1 Indikator dan Bobot Penilaian IKPA Berdasarkan PER-5/PB/2024**

| No. | Aspek | Indikator | Bobot |
| --- | --- | --- | --- |
| 1 | Kualitas Perencanaan | Revisi DIPA | 5% |
| 2 | Kualitas Perencanaan | Deviasi Halaman III DIPA | 15% |

*Sumber: Peraturan Direktur Jenderal Perbendaharaan Nomor PER-5/PB/2024*

Di antara tujuh indikator IKPA, Deviasi Halaman III DIPA mengukur selisih antara Rencana Penarikan Dana (RPD) bulanan yang telah disusun dalam Halaman III DIPA dengan realisasi anggaran aktual. Permasalahan ini terutama mengemuka pada Belanja Modal karena karakteristiknya yang kontraktual dan melibatkan *multi-pihak* dalam proses pengadaan barang/jasa pemerintah.
```
