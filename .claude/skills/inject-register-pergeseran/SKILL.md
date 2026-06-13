---
name: inject-register-pergeseran
description: Generate satu baris Register Pergeseran Paket Belanja Modal dari input user. AI draft L2 — user review wajib sebelum pakai.
triggers:
  - "/inject-register"
  - "inject register"
  - "isi register pergeseran"
autonomy_level: L2
bike-method-phase: 1  # Phase 1 — Training wheels. Run manually first.
three-ms-attribution: |
  Adapted from The Three Ms of AI™ © 2026 Nate Herk.
---

# inject-register-pergeseran

Generate satu baris Register Pergeseran Paket Belanja Modal skripsi dari input yang user paste. Output siap masuk ke tabel BAB IV / `skripsi/revisi/format-data-kasus-rudenim.md`.

## Cara pakai

Jalankan skill ini, lalu paste data paket dengan format berikut (boleh tidak lengkap, AI akan flag kolom yang kosong):

```
Nama Paket      : [nama paket]
Kode RUP/SAKTI  : [kode]
Pagu            : Rp [nominal]
Nilai Kontrak   : Rp [nominal]
Metode Pengadaan: [metode]
Bulan RPD       : [bulan tahun]
TTD Kontrak     : [rencana] → [aktual]
BAST            : [rencana] → [aktual]
SP2D Aktual     : [tanggal]
Alasan Pergeseran: [dari ingatan / cek kontrak / inventaris]
Kode Informan   : [KPA/PPK/PPSPM/BPG/SRKA/PBJ]
```

## Yang AI lakukan

1. Parse input → petakan ke kolom Register Pergeseran
2. Hitung **Geser (bulan)** dari TTD/BAST rencana vs aktual
3. Tentukan **Fase Titik Kritis** (Perencanaan / Penyusunan / Pelaksanaan) berdasarkan kapan pergeseran terjadi
4. Suggest **Kategori Penyebab** dari 8 kategori (lihat di bawah)
5. Draft **Dampak ke Deviasi/IKPA** satu kalimat
6. Output baris tabel markdown siap paste + flag kolom yang masih kosong

## 8 Kategori Penyebab (dropdown skripsi)

1. Keterlambatan proses pengadaan
2. Revisi DIPA / pergeseran anggaran
3. Kendala teknis pelaksanaan
4. Keterlambatan penandatanganan kontrak
5. Force majeure / kondisi eksternal
6. Keterlambatan BAST / serah terima
7. Masalah administrasi pembayaran
8. Perencanaan RPD tidak realistis

## Output format

```markdown
| [Tahun] | [Nama Paket] | [Kode] | [Pagu] | [Nilai Kontrak] | [Metode] | [Bulan RPD] | [TTD rencana→aktual] | [BAST rencana→aktual] | [SP2D] | [Geser (bln)] | [Fase Titik Kritis] | [Kategori Penyebab] | [Dampak IKPA] | [Bukti Dok] | [Kode Informan] |
```

Flag setiap kolom kosong dengan `⚠️ perlu diisi`.

## Referensi format

Lihat `skripsi/revisi/format-data-kasus-rudenim.md` untuk struktur lengkap kolom dan contoh data yang sudah ada.

## Bike Method — Phase 1

**Jalankan manual dulu minimum 3 paket sebelum menganggap output AI akurat.**
Validasi: alasan pergeseran harus kamu konfirmasi dari dokumen asli — AI hanya draft dari input yang kamu berikan, tidak tahu fakta lapangan.

Untuk naik ke Phase 2 (supervised), edit frontmatter: `bike-method-phase: 2`.
