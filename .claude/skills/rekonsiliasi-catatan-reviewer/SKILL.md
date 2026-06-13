---
name: rekonsiliasi-catatan-reviewer
description: >-
  Rekonsiliasi catatan tangan reviewer (dosen, penguji, atasan, editor) pada PDF hasil scan
  terhadap dokumen asli, lalu audit apakah dokumen revisi sudah menjawab semua catatan.
  GUNAKAN SKILL INI setiap kali pengguna meng-upload PDF scan berisi coretan/catatan tangan
  di atas dokumen (skripsi, makalah, laporan, naskah dinas) dan ingin: memahami maksud
  coretan reviewer, mencocokkan catatan dengan dokumen asli (.docx/.md/.pdf), mengaudit
  draft revisi terhadap catatan, atau membuat daftar perbaikan. Aktifkan pada kata kunci:
  "catatan dosen", "coretan penguji", "revisi dari pembimbing", "apa maksud catatan ini",
  "audit revisi saya", "rekonsiliasi catatan", "cek apakah revisi sudah sesuai", atau ketika
  pengguna menyerahkan pasangan dokumen-asli + PDF-bercoretan, dengan atau tanpa draft revisi.
---

# Rekonsiliasi Catatan Reviewer & Audit Revisi

Mengubah coretan tangan reviewer di PDF scan menjadi daftar instruksi yang jelas, lalu
(jika ada draft revisi) mengaudit apakah setiap instruksi sudah dijawab.

## Input yang dibutuhkan

1. **PDF scan bercoretan** — wajib.
2. **Dokumen asli** (.docx/.md/.pdf) — sangat disarankan; tanpa ini interpretasi catatan kehilangan konteks.
3. **Draft revisi** — opsional; jika ada, lakukan audit (Tahap 3).

Jika pengguna hanya memberi PDF bercoretan, kerjakan Tahap 1–2 saja dan tawarkan audit
ketika draft revisi tersedia.

## Tahap 1 — Baca semua halaman scan

Tool Read dengan parameter `pages` sering gagal pada PDF scan (pdftoppm tidak tersedia di
jalur itu). Konversi lewat shell, lalu baca PNG-nya:

```bash
pdftoppm -png -r 110 "<file>.pdf" page     # overview semua halaman
```

Baca setiap halaman overview dulu untuk menemukan DI MANA coretan berada. Tulisan tangan
biasanya kecil dan berada di margin kanan/kiri, bawah halaman, atau di atas gambar — pada
110 dpi sering tidak terbaca. Untuk setiap area coretan, render ulang halaman itu pada
200 dpi dan crop area tersebut (PIL `im.crop()`), baru baca crop-nya. Jangan menebak
tulisan tangan dari gambar buram — kualitas seluruh laporan bergantung pada akurasi
pembacaan ini. Jika setelah zoom tetap tidak terbaca, tanyakan ke pengguna; mereka sering
bisa mengetik ulang tulisan reviewer (dan ketikan pengguna di dalam dokumen — biasanya
huruf kapital di bawah tulisan tangan — adalah transkripsi yang bisa dipercaya).

## Tahap 2 — Interpretasi dan rekonsiliasi

Ekstrak teks dokumen asli (python-docx untuk .docx) dan cari paragraf yang persis
ditandai setiap coretan — jangan menempelkan catatan ke paragraf yang salah; nomor halaman
pada scan merujuk halaman dokumen asli.

Konvensi umum coretan reviewer (konfirmasi ke pengguna bila ada simbol tak lazim):

| Tanda | Maksud |
|---|---|
| X besar pada paragraf | Hapus paragraf itu |
| Garis/kurung kurawal di margin + catatan | Catatan berlaku untuk blok yang dilingkupi |
| Catatan di bawah halaman tanpa penunjuk | Umpan balik untuk keseluruhan bagian/bab di halaman itu |
| Tulisan nomor sub-bab baru (mis. "3.3.2 ...") | Sisipkan sub-bab baru di posisi itu |
| Pertanyaan pada gambar/tabel ("sumber?", "punya siapa?") | Atribusi sumber hilang — wajib dicantumkan |
| "Tidak di sini / tidak di bab ini" | Konten dipindah, bukan dihapus — cari ke mana seharusnya |

Dua prinsip interpretasi yang sering menentukan:

- **Penghapusan biasanya menyiratkan penggantian.** Reviewer yang mencoret "gap analysis"
  sambil menulis "tetapi case/kasus pada objek" tidak hanya minta hapus — ia minta ganti.
  Audit harus mengecek keduanya: yang lama hilang DAN penggantinya ada.
- **Yang tidak dicoret berarti dipertahankan.** Catat eksplisit paragraf bersebelahan yang
  selamat dari coretan, supaya pengguna tidak menghapus berlebihan.

Hasil tahap ini: **inventaris bernomor** — setiap catatan berisi lokasi (halaman dokumen
asli), kutipan teks yang ditandai, bunyi coretan, dan interpretasi maksud reviewer dalam
satu kalimat instruksi yang bisa dieksekusi.

## Tahap 3 — Audit draft revisi (jika ada)

Bandingkan setiap butir inventaris dengan draft revisi. Status per butir:

- ✅ **Selesai** — instruksi dijawab penuh
- ⚠️ **Belum tuntas** — dikerjakan sebagian, atau bentuknya belum persis seperti yang diminta
- ❌ **Belum dikerjakan** — termasuk kasus "yang lama dihapus tapi pengganti belum ada"

Periksa substansi, bukan sekadar keberadaan: paragraf yang dipindah harus utuh di lokasi
baru; tabel yang diminta harus berisi data yang dimaksud; sumber gambar harus benar-benar
menjawab pertanyaan reviewer.

## Format laporan

Simpan sebagai file markdown di folder kerja pengguna (ikuti struktur folder yang ada,
mis. `skripsi/revisi/`), nama file `audit-catatan-<reviewer/dokumen>-<tanggal>.md`:

```markdown
# Audit Rekonsiliasi Catatan <Reviewer> — <Nama Dokumen>
**Tanggal** · **Dokumen sumber** · **Dokumen diaudit**

## A. Inventaris Catatan (hasil rekonsiliasi)
### Catatan 1 — hlm. N: "<bunyi coretan>"
<lokasi + kutipan yang ditandai>
**Maksud:** <instruksi satu kalimat>
... (semua catatan, bernomor)

## B. Hasil Audit          <- hanya jika ada draft revisi
| # | Catatan reviewer | Status | Temuan |
**Skor: X selesai · Y perlu penyempurnaan · Z belum dikerjakan**

## C. Perbaikan Prioritas
<urutkan dari yang paling substantif; sertakan draft konkret/contoh
 struktur yang bisa langsung dipakai, bukan sekadar "perbaiki X">
```

Tutup ringkasan chat dengan satu temuan paling penting (biasanya butir ❌) dan tawaran
mengerjakan prioritas #1 — jangan hanya menyerahkan laporan.

## Hal yang mudah terlewat

- Periksa SEMUA halaman scan, termasuk yang tampak kosong — coretan kecil di pojok sering lolos.
  Coretan terkecil (strikethrough satu frasa, centang kecil) justru paling sering terlewat;
  sapu margin DAN badan teks. Sebaliknya, jangan render ulang 200 dpi halaman yang di
  overview jelas tidak bercoretan — zoom hanya area yang perlu.
- Laporkan **temuan samping** di bagian terpisah: masalah yang bukan coretan reviewer tetapi
  terkait langsung dengan catatannya (mis. konten yang dicoret di satu bab ternyata duplikat
  di bab lain, rujukan lampiran yang menggantung, penomoran yang jadi tidak sinkron setelah
  perubahan). Reviewer mencoret apa yang ia lihat — konsistensi sisanya tanggung jawab kita.
  Tandai jelas bahwa ini di luar coretan, dan sarankan konfirmasi bila perlu.
- Satu catatan bisa menjangkau lebih dari satu halaman (coretan menyambung).
- Bedakan tulisan reviewer dengan ketikan transkripsi pengguna; gunakan transkripsi sebagai
  bantuan baca, tapi tetap laporkan bunyi asli tulisan tangan.
- Istilah teknis domain (mis. nama indikator, nomor regulasi) harus dikutip persis; salah
  satu digit nomor peraturan membuat laporan tidak kredibel.
