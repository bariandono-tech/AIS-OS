# 📋 Brain Pro MAX — Dokumen Referensi Struktur

> **Status:** Referensi konteks SAJA. Jangan menyalin formula / implementasi mentah dari sini.
> Dokumen ini merekam *apa yang dilakukan* tiap bagian (konsep & tujuan), bukan *bagaimana kodenya*,
> supaya saat membangun template ORISINAL kita tidak kehilangan gambaran fitur.
>
> ⚠️ **Catatan legal:** Brain Pro MAX = gabungan produk template berbayar pihak ketiga
> (Ultimate Brain / Ultimate Tasks / Ultimate Notes). TIDAK boleh dijual ulang.
> Kita pakai ini hanya untuk memahami *cakupan fitur* yang perlu ditandingi versi orisinal.

---

## 1. Peta Halaman (Page Tree)

```
Brain Pro MAX (home)
├─ Dashboards
│  ├─ Ultimate Notes  (dashboard catatan)
│  ├─ Ultimate Tasks  (dashboard tugas)
│  └─ PARA Dashboard
├─ Quick Views
│  ├─ Today
│  ├─ Next 7 Days
│  └─ Projects
└─ Capture
   ├─ Notes Inbox
   ├─ Tags
   └─ Areas & Resources
```

Home memuat 3 database inline: Tasks (Today/7 days), Projects (aktif), Notes (terbaru).

---

## 2. Database Inti & Perannya

| Database | Kode internal | Peran |
|----------|---------------|-------|
| Tasks | `[UT]` | Manajemen tugas + sub-tugas + recurring |
| Projects | `[UT]` | Wadah tugas, progress tracking |
| Notes | `[UN]` | Catatan, jurnal, rapat, web clip, voice note |
| Areas & Resources | — | Lapisan PARA (Area = tanggung jawab, Resource = referensi) |
| Tags | — | Taksonomi catatan (punya parent tag) |
| Goals | — | Target yang ditautkan ke Area |

> Catatan: nama database masih mengandung label dev `[UT]`/`[UN]` (= Ultimate Tasks/Notes).

---

## 3. Fitur per Database (level konsep)

### Tasks
- **Status**: To Do / Doing / Done (checkbox alt-click untuk Doing).
- **Priority**: Low / Medium / High (hanya tampil di Priority View).
- **Sub-tasks**: relasi self (Parent Task ↔ Sub-Tasks).
- **Recurring**: kombinasi `Recur Interval` + `Recur Unit` (Day/Week/Month/Year/Nth-weekday/last-day) + `Days` (M/W/F).
  - Formula `Next Due` menghitung tanggal berikutnya dari Due + hari ini + interval.
- **Smart List**: tag "Someday" → sembunyi dari Inbox.
- **Relasi**: Project, Area/Resource.
- **Formula pendukung sorting**: Due Timestamp, Due Stamp (Parent), Sub-Task Sorter, Meta Labels, Project Active.
- **Localization Key**: formula agar opsi bisa diterjemahkan tanpa merusak filter.

### Projects
- **Status**: Planned / On Hold / Doing / Ongoing / Done.
- **Progress**: % tugas selesai.
- **Meta**: jumlah tugas aktif + overdue.
- **Latest Activity**: timestamp aktivitas terbaru (project/task/note).
- **Archived**: checkbox → keluar dari view utama.
- **Relasi**: Tasks, Notes, Area.

### Notes
- **Type**: Book, Idea, Journal, Lecture, Meeting, Plan, Recipe, Reference, Voice Note, Web Clip.
- **Note Date**: tanggal manual (terpisah dari Created).
- **Favorite / Archived**: checkbox.
- **Web clip**: properti URL + formula URL Base / URL Icon.
- **Voice note**: Audio File + Duration (Seconds) → formula Duration HH:MM:SS.
  - ⚠️ butuh tool eksternal berbayar (Flylighter, Voice Notes automation).
- **Relasi**: Project, Tag, Area/Resource. Rollup Root Tag.
- **Template halaman**: "Journal: @Today", "Meeting: @Today".

### Areas & Resources (PARA)
- **Type**: Area / Resource.
- **Rollup**: Jumlah Note, Jumlah Task.
- **Relasi**: Tasks, Notes, Projects, Goals.
- ⚠️ Punya relasi GANDA (ke DB lama tak terpakai `Notes`, `Projects`, `Goals` + ke DB aktif `[UT]`/`[UN]`) → sumber kerancuan.

### Tags
- Hierarki: punya Parent Tag → Root Tag (rollup di Notes).

---

## 4. Daftar Celah / Hutang Teknis (yang TIDAK boleh diwariskan ke V1)

1. Label dev `[UT]`/`[UN]` bocor di nama database.
2. Database hantu kosong (PARA bawaan "disimpan jaga-jaga").
3. Relasi ganda/orphan di Areas (Notes vs Notes[UN], Projects vs Projects[UT], Goals).
4. Dua PARA Dashboard bersarang.
5. Bahasa campur (UI Indonesia, isi Inggris).
6. Ketergantungan tool berbayar (Flylighter / Voice Notes).
7. Tidak ada halaman onboarding "Mulai di Sini".
8. Jejak atribusi template asal di deskripsi properti.

---

## 5. Cakupan fitur yang harus DITANDINGI versi orisinal

Checklist target paritas (untuk menilai kelengkapan V1/V2/V3):

- [ ] Tugas + status + prioritas + tenggat
- [ ] Sub-tugas
- [ ] Tugas berulang (recurring) — versi sederhana di V1, canggih di V2
- [ ] Proyek + progress + status
- [ ] Catatan + tipe + tanggal manual + favorit/arsip
- [ ] Sistem PARA (Area/Resource)
- [ ] Quick views: Hari Ini / 7 Hari / Inbox
- [ ] Tags (V2)
- [ ] Goals (V2)
- [ ] Habit / Review mingguan (V3)
- [ ] Onboarding (V1 — keunggulan kita)
