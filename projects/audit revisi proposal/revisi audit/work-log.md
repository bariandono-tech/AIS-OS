# Work Log — Revisi-Audit Proposal

## 2026-06-30 — Finalisasi & generalisasi pipeline

Audit + reshape agar pipeline bisa dipakai ulang untuk thesis lain tanpa bongkar kode.

**Fase 0 — Bersih-bersih (tanpa ubah perilaku):**
- Arsipkan ke `archives/cleanup-audit-revisi-2026-06-30/`: stub root lama `audit revisi proposal/`,
  `workflows/stages/` (copy lama), `skripsi/drafts/build_revisi.js` (builder duplikat).
- Builder resmi ditetapkan: `build_revisi.js` self-contained di folder ini.
- Tulis `README.md` = peta tunggal (alur 11 stage yang benar). Samakan klaim "7 agen" → 6 agen
  di `main.py`, `SKILL.md`, workflow, stage 11.

**Fase 1 — Cabut identitas penulis → `config.thesis.json`:**
- Semua front-matter (cover, lembar persetujuan, kata pengantar, daftar isi) yang dulu hardcoded
  di `build_revisi.js` sekarang dibaca dari `config.thesis.json` (per-thesis, di folder output).
- Regresi: build Ajie = **identik byte** dengan versi lama (document.xml diff = kosong).
- Generalisasi: config dummy (nama/NIM/kampus beda) → front-matter ikut berubah tanpa sentuh kode.

**Fase 2 — Cabut aturan format kampus → `pedoman/upb.json`:**
- Konstanta layout (ukuran A4, margin 4-3-4-3) dibaca dari `pedoman/upb.json`. Schema lengkap
  (font, spasi, sitasi APA, italic, heading, tabel/gambar) didokumentasikan di JSON sebagai
  rujukan; field `page` dipakai langsung builder. Kampus baru = `pedoman/<kampus>.json` + env `PEDOMAN`.
- Regresi identik; uji swap margin → dokumen berubah (builder benar-benar baca JSON).

**Pakai sekarang:**
- Thesis baru (kampus sama): isi `config.thesis.json` → taruh `05-revisi-bab*.md` → `node build_revisi.js <dir>`.
- Kampus baru: buat `pedoman/<kampus>.json` → `PEDOMAN=<kampus> node build_revisi.js <dir>`.

**Belum dikerjakan (sengaja, sesuai keputusan):** pengecek format .docx;
konsolidasi engine audit Python vs skill (baru rekomendasi).

## 2026-06-30 (lanjutan) — Daftar Isi auto + format tabel terbuka

Mengikuti gaya `projects/makalah-sim` (referensi yang sudah bagus menurut user).

**Daftar Isi otomatis (field TOC native Word):**
- BAB kini Heading 1 (`chapterHeader`: dua baris, satu entri TOC); KATA PENGANTAR/DAFTAR ISI/
  DAFTAR PUSTAKA pakai `frontMatterHeader` (Heading 1) sehingga ikut masuk Daftar Isi.
- Daftar Isi = `new TableOfContents` dengan `headingStyleRange: "1-<kedalaman>"`. `Document` diberi
  `features.updateFields:true` → Word mengisi nomor halaman otomatis saat dibuka.
- `config.thesis.json` → `daftarIsi: { kedalaman: 2 }` = sampai sub-bab x.x saja, **tanpa x.x.x**
  (sesuai permintaan khusus thesis ini). Ganti ke 3 kalau mau sub-sub-bab.

**Format tabel terbuka (3 garis):** `bordersHeader` (atas+bawah), `bordersMiddle` (kosong),
`bordersBottom` (bawah). Tabel data dari markdown otomatis terbuka; tabel Lembar Konsultasi
front-matter tetap berkotak (memang form tanda tangan).

**Verifikasi:** smoke test 7/7 hijau (ditambah cek field TOC + Heading 1). Inspeksi document.xml:
field `TOC \h \o "1-2"` ada, BAB pakai Heading1, header tabel terbuka, baris akhir bergaris bawah.

**Catatan pakai di Word:** nomor halaman Daftar Isi BARU muncul setelah dokumen dibuka di Word
(otomatis via updateFields; kalau masih kosong: klik Daftar Isi → F9 → "Update entire table").
File contoh hasil: `outputs/analisis-anggaran-rudenim/revisi-v1/Makalah_Revisi_DaftarIsiAuto.docx`.

## 2026-07-01 — Perbaikan render dari review user + hapus 1.5/1.6

**Bug render diperbaiki (kode):**
- `parseMarkdownRuns` dibuat REKURSIF + terima `base` format → `*miring*` di dalam `**tebal**`
  kini terproses (dulu bintang muncul literal). Diterapkan juga ke judul sub-bab (`heading2/heading3`)
  dan caption tabel — jadi `*Agency Theory*` di judul/isi tebal kini benar-benar miring.
- Penomoran: satu referензi per-list (`list-1`,`list-2`,…, 200 disiapkan) + deteksi awal list baru di
  `buildDocxChildren` → tiap daftar bernomor MULAI dari 1 lagi (dulu Word menyambung: 8,9,10,…,27).

**Konten (05-revisi-bab1.md):**
- Hapus sub-bab **1.5 Batasan Masalah** & **1.6 Definisi Operasional** (ditambah audit, tidak diminta dosen).
- Tabel 1.3: penanda catatan kaki `*/**/***` (bentrok markdown) diganti `(a)(b)(c)`; baris Sumber dipisah.

**Verifikasi:** smoke test 7/7 hijau; document.xml: 0 bintang literal, 12/14 "Agency Theory" miring
(2 sisanya tidak dibungkus `*` di sumber — perlu sweep konten italik terpisah bila diinginkan),
numId list terpisah. File hasil: `Makalah_Revisi_FINAL.docx`.

**Terbuka (butuh keputusan user):** Tabel 3.2 item "RKA-K/L Ditjen Imigrasi" = sumber level Ditjen,
belum jelas dipakai di analisis (potensi *unused source*). LKjIP dipakai untuk RM3 (Dampak) → aman.

## 2026-07-01 (lanjutan) — Review user putaran 2 + propagasi aturan ke tool

**Konten (05-revisi-bab*.md):**
- Hapus placeholder `hlm. xx` (Mardiasmo) → `(Mardiasmo, 2018)`.
- Hapus SEMUA em-dash (—) & en-dash (–) di 4 file (perl: em-dash→koma, en-dash→tanda hubung).
  Rentang tahun kini `2023-2025`.
- Hapus Tabel 3.2 item "RKA-K/L Ditjen Imigrasi" (instruksi dosen) + renumber 6,7→5,6.
- Bab 3 §3.1: KPA & PPK ditetapkan **informan utama** (arahan dosen), 4 lainnya pendukung;
  ditandai juga di Tabel 3.1. Ditambahkan ke `catatan-dosen.md` §4.

**&/dan:** TIDAK diubah — sudah benar & konsisten menurut APA (`&` di dalam kurung,
`dan` di narasi). Ini dijelaskan ke user, bukan bug.

**"Nomor tiba-tiba 4":** sudah teratasi oleh perbaikan penomoran (per-list) putaran sebelumnya;
gambar user dari file lama. Kriteria informan kini list sendiri (mulai dari 1).

**Propagasi ke tool (agar tidak terulang):**
- `templates/build_schema.md` §11 (baru): aturan gaya — larang em/en-dash, larang placeholder,
  kaidah &/dan APA, istilah asing miring.
- `stages/09-writing-revisi.md` Guardrails: aturan sama ditambahkan.
- `stages/03-audit-register.md`: audit register kini menandai em/en-dash, placeholder, &/dan salah tempat.
- `pedoman/upb.json`: blok `gaya` (referensi).

**Verifikasi:** smoke 7/7; output: 0 em-dash, 0 en-dash, 0 "hlm. xx", 0 "RKA-K/L Ditjen",
"informan utama" muncul. File: `Makalah_Revisi_FINAL2.docx`.

## 2026-07-01 (finalisasi) — Restruktur 3.3.2 + audit kumpul

Konteks: user mau kumpulkan makalah. Ketahuan file `_arsip/.../KUMPUL DOSEN_...pdf` ternyata
**versi ASLI pra-revisi** (judul tanpa sub-judul, RM "belanja" generik, 3.3.2 Miles-Huberman) —
bukan file final. `CATATAN DOSEN.pdf` = coretan tangan 11 Juni (scan, tak ber-OCR).

**Kebingungan 3.3.2 diselesaikan (keputusan user: ikuti dosen persis).** Dosen menulis tangan
"3.3.2 Indepth Interview" (hlm 36), tapi draf menaruh wawancara di 3.2.1. Direstruktur di
`05-revisi-bab3.md`:
- In-depth Interview dipindah 3.2.1 → **3.3.2**; renumber 3.2.3→3.2.2, 3.3.2(Framework)→3.3.3,
  3.3.3(Keabsahan)→3.3.4. Intro 3.2 & 3.3 disesuaikan; rujuk-silang informan ke 3.1 (Tabel 3.1).
- Catatan Revisi bab3 +baris No.15.

**BAB I dicek:** Catatan 3 (corong) & 5 (kasus Rudenim) ternyata **sudah tuntas** di versi 1 Juli
(corong mulai UU 17/2003, Tabel 1.3 ada). Tidak perlu edit.

**Build:** `node build_revisi.js` → `Makalah_Revisi_KUMPUL_FINAL.docx` (64 KB). Verifikasi
document.xml: urutan 3.2.1 Dokumentasi → 3.2.2 Observasi → 3.3.1 Flowchart → **3.3.2 In-depth
Interview** → 3.3.3 Framework → 3.3.4 Keabsahan; "3.2.3" sudah hilang.

**Laporan:** `audit-finalisasi-2026-07-01.md` (diff asli vs final, status 10/10 catatan dosen).
**Sisa manual:** tempel gambar flowchart (Gambar 3.1 masih placeholder); F9 update TOC di Word.
Rekonsiliasi status: **10/10 catatan dosen selesai.**

## 2026-07-01 (fix) — Bug penomoran list "mulai dari 4"

User lapor list kriteria informan (3.1) & Pengkodean (3.3.3) mulai dari 4,5,6 di Word.
**Root cause:** `listCounter` di `build_revisi.js` dideklarasi LOKAL di dalam
`buildDocxChildren`, padahal fungsi itu dipanggil per-bab (loop line ~855). Counter reset tiap
bab → list BAB III pakai ulang referensi `list-2`/`list-3` yang sama dgn RM/Tujuan BAB I →
numId nabrak → satu list instance, Word nyambung nomornya (RM 1-3, kriteria lanjut 4-6).

**Fix:** `listCounter` dinaikkan ke **scope modul** (persist antar pemanggilan). Sekarang tiap
list dapat numId unik. Verifikasi document.xml: KP=numId2, RM=3, Tujuan=4, **kriteria=5,
Pengkodean=6**, Etika=7 — semua unik, tiap numId startOverride=1 & abstractNum start=1
(effectiveStart=1). Smoke 7/7 hijau. Rebuild `Makalah_Revisi_KUMPUL_FINAL.docx`.
Fix ada di builder reusable → berlaku untuk thesis lain juga.

## 2026-07-01 (poles) — Unbold badan teks + Daftar Isi bold

User risih semua "Belanja Modal" & emphasis kalimat di-bold (takut dosen nanya).
- **Unbold sumber markdown** (bab1/2/3 + daftar pustaka): buang `**...**` di teks paragraf,
  `***x***`→`*x*` (italic dipertahankan). DIPERTAHANKAN: judul tabel/gambar (`**Tabel/Gambar**`),
  sel tabel (builder strip sendiri), dan blok "Catatan Revisi" (log, tak masuk docx).
  Hitung marker: bab1 50→16, bab2 122→22, bab3 136→18.
- **Daftar Isi:** tambah paragraphStyle `TOC1` (bold) di `build_revisi.js` → entri level-1
  (KATA PENGANTAR, DAFTAR ISI, BAB, DAFTAR PUSTAKA) tebal; sub-bab x.x normal.
- Verifikasi docx: body "Belanja Modal" bold=false; caption Tabel 3.1 bold=true; style TOC1 bold=true;
  numId list tetap unik & start=1. File: `Makalah_Revisi_KUMPUL_FINAL.docx` (ditimpa).

## 2026-07-01 (koherensi) — Selaraskan kerangka & flowchart

Review diagram atas permintaan user (mau bikin sendiri di Word, shape sederhana).
- **Fix inkonsistensi 3 fase BAB II vs BAB III:** BAB II §2.4 tadinya Fase 2 = pengadaan
  (pemilihan penyedia/kontrak/termin); disamakan ke BAB III → Fase 1 Perencanaan (RKA-K/L,
  HPS/RAB), Fase 2 Penyusunan DIPA (DIPA + RPD Hal III), Fase 3 Pelaksanaan (pengadaan:
  tender/kontrak/BAST + pencairan SPP-SPM-SP2D).
- **Angka konsisten:** BAB II "60-70%" → "65,92%" (selaras Tabel 1.3 bab1).
- **Typo BAB II:** "Deviasi Halaman III DIPA IKPA"→"...dalam IKPA"; "fenomenon"→"fenomena";
  "DJ Pb"→"DJPb".
- **Sitasi BAB III:** "Perpres 16/2018 Pasal 38" (nomor pasal meragukan utk 'tender gagal')
  → digeneralkan "dalam Perpres 16/2018 jo. Perpres 12/2021". User cek pasal pastinya.
- Diberikan cetak biru shape Word (vertikal, kotak polos) utk Gambar 3.1 & Gambar 2.1.
- Verifikasi 8/8 di `_build_check.docx`; tinggal swap ke KUMPUL_FINAL (file kekunci Word).
