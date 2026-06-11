# 🗺️ Roadmap & Task Board — Template Second Brain (Orisinal)

> Produk: template Notion second brain ORISINAL (pengganti Brain Pro MAX yang ilegal).
> Acuan fitur: lihat `BRAIN-PRO-MAX-REFERENCE.md`.
> Tiap task diberi label **[SEQ]** (harus berurutan / ada dependensi) atau **[PAR]** (boleh paralel / agen berbeda).

## Legenda
- **Dep:** = task yang harus selesai dulu (dependency).
- **[PAR]** = bisa dikerjakan bersamaan oleh agen lain.
- **[SEQ]** = harus menunggu dependensinya.
- Status: `[ ]` belum · `[~]` jalan · `[x]` selesai.

---

# 🟢 VERSI 1 — Fondasi (MVP yang sah dijual)
**Target skor fitur: ~45–50/100 · Tujuan: produk minimum yang bisa dirilis.**

## Fase 1.0 — Pondasi (WAJIB duluan, semua lain bergantung di sini)
- [ ] **T1.1 [SEQ]** Tetapkan brand: nama produk, ikon, palet warna, gaya cover. *Dep: —*
- [ ] **T1.2 [SEQ]** Buat 4 database kosong: `Catatan`, `Tugas`, `Proyek`, `Wadah`. *Dep: T1.1*

## Fase 1.1 — Skema database (PARALEL setelah T1.2)
> Keempat task ini menyentuh database berbeda → aman dikerjakan 4 agen sekaligus.
- [ ] **T1.3 [PAR]** Properti DB `Wadah`: Nama, Tipe(Area/Resource), Deskripsi, Arsip. *Dep: T1.2*
- [ ] **T1.4 [PAR]** Properti DB `Proyek`: Nama, Status, Arsip. *Dep: T1.2*
- [ ] **T1.5 [PAR]** Properti DB `Tugas`: Nama, Status, Prioritas, Tenggat, Ulangi(Select). *Dep: T1.2*
- [ ] **T1.6 [PAR]** Properti DB `Catatan`: Judul, Jenis, Tanggal, Favorit, Arsip. *Dep: T1.2*

## Fase 1.2 — Relasi antar-database (SEQ — butuh semua skema siap)
> Relasi mengikat 2 DB sekaligus, jadi tidak boleh paralel dengan Fase 1.1.
- [ ] **T1.7 [SEQ]** Relasi Tugas ↔ Proyek. *Dep: T1.4, T1.5*
- [ ] **T1.8 [SEQ]** Relasi Tugas ↔ Sub-tugas (self). *Dep: T1.5*
- [ ] **T1.9 [SEQ]** Relasi Catatan ↔ Proyek. *Dep: T1.4, T1.6*
- [ ] **T1.10 [SEQ]** Relasi Wadah ↔ (Tugas, Catatan, Proyek). *Dep: T1.3, T1.4, T1.5, T1.6*

## Fase 1.3 — Formula (PARALEL — formula independen)
- [ ] **T1.11 [PAR]** Formula `Status Visual` di Tugas (🔴telat/🟡hari ini/🟢aman). *Dep: T1.5*
- [ ] **T1.12 [PAR]** Formula/Rollup `Progres` di Proyek (% tugas selesai). *Dep: T1.7*

## Fase 1.4 — Views & Dashboard (SEQ — butuh data & relasi final)
- [ ] **T1.13 [SEQ]** View Tugas: Hari Ini, 7 Hari, Inbox, Per Proyek. *Dep: T1.11*
- [ ] **T1.14 [SEQ]** View Catatan: Inbox, Per Jenis, Favorit. *Dep: T1.9*
- [ ] **T1.15 [SEQ]** View Wadah: dikelompok per Tipe (PARA). *Dep: T1.10*
- [ ] **T1.16 [SEQ]** Rakit halaman Dashboard utama (link + database inline). *Dep: T1.13, T1.14, T1.15*

## Fase 1.5 — Konten jual (PARALEL — tidak sentuh database)
- [ ] **T1.17 [PAR]** Halaman "🚀 Mulai di Sini" (onboarding 3 langkah, Indonesia). *Dep: T1.16*
- [ ] **T1.18 [PAR]** Template halaman: Catatan Rapat, Jurnal Harian. *Dep: T1.6*
- [ ] **T1.19 [PAR]** Isi contoh use-case lokal (Skripsi, Freelance, Keuangan). *Dep: T1.16*
- [ ] **T1.20 [PAR]** Halaman Lisensi + Changelog. *Dep: —*

## Fase 1.6 — Rilis (SEQ — gerbang akhir)
- [ ] **T1.21 [SEQ]** QA: duplikat template ke akun kosong, cek semua relasi/formula. *Dep: semua di atas*
- [ ] **T1.22 [SEQ]** Set "Duplicate template" + share publik + cover marketplace. *Dep: T1.21*

---

# 🟡 VERSI 2 — Pendalaman (naikkan skor fitur → ~70/100)
**Tujuan: tandingi kelengkapan Ultimate Brain di area inti. Upsell ke pembeli V1.**

## Fase 2.0 — DB baru (PARALEL)
- [ ] **T2.1 [PAR]** DB `Tags` + relasi ke Catatan + hierarki Parent/Root Tag. *Dep: V1 selesai*
- [ ] **T2.2 [PAR]** DB `Goals` + relasi ke Wadah & Proyek. *Dep: V1 selesai*

## Fase 2.1 — Recurring task canggih (SEQ)
- [ ] **T2.3 [SEQ]** Rancang ulang sistem berulang ORISINAL: formula `Berikutnya` (interval+unit) tanpa meniru Next Due TF. *Dep: T1.5*
- [ ] **T2.4 [SEQ]** Tombol/automation duplikat tugas berulang. *Dep: T2.3*

## Fase 2.2 — Dashboard lanjutan (PARALEL)
- [ ] **T2.5 [PAR]** Dashboard PARA penuh (rollup Jumlah Tugas/Catatan per Wadah). *Dep: T2.1*
- [ ] **T2.6 [PAR]** View Goals + progress per Area. *Dep: T2.2*
- [ ] **T2.7 [PAR]** Filter "Someday/Nanti" pada Tugas. *Dep: T1.5*

## Fase 2.3 — Rilis V2
- [ ] **T2.8 [SEQ]** QA + changelog V2 + notifikasi update ke pembeli. *Dep: semua V2*

---

# 🔴 VERSI 3 — Premium (skor fitur → ~85–90/100)
**Tujuan: positioning "Pro Max" yang sah. Harga tertinggi.**

## Fase 3.0 — Modul baru (PARALEL)
- [ ] **T3.1 [PAR]** Habit Tracker (DB + view mingguan + streak). *Dep: V2 selesai*
- [ ] **T3.2 [PAR]** Weekly Review (template + checklist refleksi). *Dep: V2 selesai*
- [ ] **T3.3 [PAR]** Modul Keuangan sederhana (opsional add-on). *Dep: V2 selesai*

## Fase 3.1 — Polish & ekosistem (PARALEL)
- [ ] **T3.4 [PAR]** Mode gelap/terang konsisten + ikon kustom. *Dep: —*
- [ ] **T3.5 [PAR]** Panduan video + GIF di onboarding. *Dep: T1.17*
- [ ] **T3.6 [PAR]** Versi mobile-friendly (view ringkas). *Dep: V2 selesai*

## Fase 3.2 — Rilis V3
- [ ] **T3.7 [SEQ]** QA penuh + bundling V1+V2+V3 + halaman penjualan final. *Dep: semua V3*

---

# ⚙️ Strategi Eksekusi Multi-Agen

| Fase | Bisa paralel? | Jumlah agen ideal | Catatan |
|------|---------------|-------------------|---------|
| 1.0 Pondasi | ❌ Sequential | 1 | Gerbang awal, semua bergantung |
| 1.1 Skema | ✅ Paralel | 4 | 1 agen per database |
| 1.2 Relasi | ❌ Sequential | 1 | Relasi mengikat 2 DB |
| 1.3 Formula | ✅ Paralel | 2 | Formula independen |
| 1.4 Views | ❌ Sequential | 1 | Butuh data final |
| 1.5 Konten | ✅ Paralel | 3–4 | Tidak sentuh database |
| 1.6 Rilis | ❌ Sequential | 1 | Gerbang akhir |

**Jalur kritis (critical path) V1:**
`T1.1 → T1.2 → [T1.3–T1.6] → T1.7/T1.10 → T1.11 → T1.13 → T1.16 → T1.21 → T1.22`

> Catatan teknis: pembuatan database & properti via MCP Notion sebagian besar **sequential**
> dalam praktik (satu workspace, dependensi relasi), tapi task KONTEN (onboarding, lisensi,
> use-case) benar-benar bisa diparalelkan ke agen terpisah.
