# MAX Brain (1) — Task Plan
> Status: **SIAP EKSEKUSI** ✅
> Dibuat: 2026-06-10 | Konfirmasi user: selesai

---

## Keputusan Arsitektur (Final)

| Keputusan | Pilihan |
|---|---|
| Master Notes DB | `Notes [PT]` diperkaya dengan schema Ultimate Notes |
| Master Tasks DB | `Tasks [UT]` (Ultimate Tasks — fitur lengkap) |
| Master Projects DB | `Projects [UT]` (Ultimate Tasks — Progress, Meta formula) |
| Areas DB | `Areas/Resources [PT]` tetap |
| Tags DB | `Tags` (Ultimate Notes) tetap, relasi diarahkan ke Notes [PT] |
| Homepage | Command Center penuh (Opsi A) |
| Relasi | Notes ↔ Projects ↔ Tasks ↔ Areas — fully connected |

---

## FASE 1 — Database Enrichment
> Tujuan: Perkaya Notes [PT] dan Projects [UT] tanpa merusak data yang ada

### T1.1 — Enrichment Notes [PT]
Tambahkan property berikut ke `collection://37b78c4c-e388-81de-8816-000bf8f8c872`:
- `Type` → select: Book, Idea, Journal, Lecture, Meeting, Plan, Recipe, Reference, Voice Note, Web Clip, Article, Note
- `Favorite` → checkbox
- `Tag` → relation ke Tags DB (`collection://37b78c4c-e388-8184-ad58-000b82a159e8`)
- `Note Date` → date
- `Audio File` → file
- `File Name` → text
- `Duration (Seconds)` → number
- `URL` → url (jika belum ada)

**Catatan:** Property `Tags` (multi-select) yang sudah ada DIPERTAHANKAN — ini berbeda dari `Tag` (relation). Tidak ada yang dihapus.

**Status:** ⬜ Pending

---

### T1.2 — Enrichment Projects [UT]
Tambahkan property berikut ke `collection://37b78c4c-e388-81f4-836c-000bebfc9b81`:
- `Area` → relation ke Areas/Resources [PT] (`collection://37b78c4c-e388-81c6-ac4b-000b70cbdb57`)
- `Notes` → relation ke Notes [PT] (`collection://37b78c4c-e388-81de-8816-000bf8f8c872`)

**Status:** ⬜ Pending

---

### T1.3 — Update relasi Notes [PT]: Projects [PT] → Projects [UT]
- Ganti property `Project` di Notes [PT] dari `Projects [PT]` ke `Projects [UT]`
- Collection ID lama: `collection://37b78c4c-e388-81e0-af96-000b7901ce71`
- Collection ID baru: `collection://37b78c4c-e388-81f4-836c-000bebfc9b81`

**⚠️ Catatan migrasi:** Jika Notes [PT] sudah ada isi yang punya relasi ke Projects [PT], relasi tersebut akan terputus dan perlu di-reassign manual ke Projects [UT].

**Status:** ⬜ Pending

---

### T1.4 — Update relasi Areas [PT]: Projects [PT] → Projects [UT]
- Ganti property `Projects` di Areas/Resources [PT] dari `Projects [PT]` ke `Projects [UT]`

**Status:** ⬜ Pending

---

### T1.5 — Update Tags DB: tambah relasi ke Notes [PT]
- Tags DB saat ini hanya relasi ke Notes (Ultimate): `collection://37b78c4c-e388-81f1-be3d-000b4b1c3009`
- Tambahkan/update relasi `Notes` di Tags DB agar mengarah ke Notes [PT]: `collection://37b78c4c-e388-81de-8816-000bf8f8c872`

**Status:** ⬜ Pending

---

## FASE 2 — Reroute Views Pro Notes
> Tujuan: Semua halaman Pro Notes menampilkan Notes [PT] bukan Notes (Ultimate)

### T2.1 — Reroute view: Inbox (Pro Notes)
- Halaman: `https://app.notion.com/p/37b78c4ce388815787c4cb60e48d3176`
- Ganti inline DB dari Notes (Ultimate) view Inbox → Notes [PT] view Inbox (filter: Archived = false, no Project/Area)

**Status:** ⬜ Pending

### T2.2 — Reroute view: Favorites
- Halaman: `https://app.notion.com/p/37b78c4ce388816a802dc5c2258f59c3`
- Ganti inline DB → Notes [PT] filter: Favorite = true

**Status:** ⬜ Pending

### T2.3 — Reroute view: All Notes
- Halaman: `https://app.notion.com/p/37b78c4ce388810ca33ed394fe476c47`
- Ganti inline DB → Notes [PT] semua (non-archived)

**Status:** ⬜ Pending

### T2.4 — Reroute view: Journal
- Halaman: `https://app.notion.com/p/37b78c4ce38881ab903fd2834edc0d5e`
- Ganti inline DB → Notes [PT] filter: Type = Journal

**Status:** ⬜ Pending

### T2.5 — Reroute view: Meeting Notes
- Halaman: `https://app.notion.com/p/37b78c4ce38881118890ca3226f05953`
- Ganti inline DB → Notes [PT] filter: Type = Meeting

**Status:** ⬜ Pending

### T2.6 — Reroute view: Note Board
- Halaman: `https://app.notion.com/p/37b78c4ce3888136ba7ed706b3405759`
- Ganti inline DB → Notes [PT] board view

**Status:** ⬜ Pending

---

## FASE 3 — Reroute Views PARA
> Tujuan: PARA pakai Tasks [UT] dan Projects [UT] sebagai sumber

### T3.1 — Update PARA: Task Inbox → Tasks [UT]
- Halaman PARA menampilkan Task Inbox dari Tasks [PT]
- Ganti ke Tasks [UT] dengan filter yang setara

**Status:** ⬜ Pending

### T3.2 — Update PARA: Projects → Projects [UT]
- Ganti view Projects di PARA dari Projects [PT] ke Projects [UT]

**Status:** ⬜ Pending

### T3.3 — Update PARA Dashboard
- Ganti semua inline DB di PARA Dashboard:
  - Tasks → Tasks [UT]
  - Projects → Projects [UT]
  - Notes → Notes [PT] (sudah benar)
  - Areas → Areas [PT] (sudah benar)

**Status:** ⬜ Pending

### T3.4 — Update PARA Quick Links
- Ganti Table of Contents dengan shortcut fungsional:
  - PARA Dashboard | Task Inbox | Note Inbox | Projects | Areas | Archive

**Status:** ⬜ Pending

---

## FASE 4 — Homepage Command Center
> Tujuan: MAX Brain (1) jadi entry point yang bermakna

### T4.1 — Redesign homepage MAX Brain (1)
Struktur baru:
```
[Header] Icon + Judul "MAX Brain"
[Quick Capture] Button: New Note | New Task | New Project

[3 Kolom]
Kolom 1 — 📝 NOTES
  → Inbox (Notes [PT], filter: no project, no area)
  → Recent (Notes [PT], sort: updated desc, limit 5)

Kolom 2 — ✅ TASKS
  → Today (Tasks [UT], filter: due = today)
  → Overdue (Tasks [UT], filter: due < today, status ≠ Done)

Kolom 3 — 🗂 PARA
  → Active Projects (Projects [UT], filter: status = Doing/Ongoing)
  → Link ke PARA Dashboard

[Footer] → Pro Notes | Pro Tasks | PARA | PARA Dashboard
```

**Status:** ⬜ Pending

---

## FASE 5 — Polish
> Perbaikan kecil yang menghalangi konsistensi

### T5.1 — Fix nav Recurring Tasks (Pro Tasks)
- Halaman: `https://app.notion.com/p/37b78c4ce388811dbd7be7a5fd8c67f3`
- Pindahkan dari Main Pages ke Other Pages di nav toggle

**Status:** ⬜ Pending

---

## FASE 6 — Review Final
### T6.1 — Verifikasi semua DB linkage
- Buka setiap halaman, konfirmasi DB yang ditampilkan adalah master DB yang benar

### T6.2 — Verifikasi relasi antar DB
- Buat satu test note di Notes [PT], assign ke Project dan Area — pastikan muncul di kedua sisi relasi

### T6.3 — Verifikasi homepage
- Pastikan semua inline DB di homepage menampilkan data yang benar

**Status:** ⬜ Pending

---

## ⚠️ Yang Perlu Dilakukan Manual oleh User

1. **Jika Projects [PT] sudah ada isi:** Pindahkan manual setiap project ke Projects [UT] sebelum Fase 2
2. **Jika Tasks [PT] sudah ada isi:** Pindahkan manual setiap task ke Tasks [UT] sebelum Fase 3
3. **Jika Notes sudah ada isi di Notes (Ultimate):** Pindahkan manual atau biarkan di sana (tidak akan hilang, hanya tidak muncul di views baru)

---

## Urutan Eksekusi

```
T1.1 → T1.2 → T1.3 → T1.4 → T1.5
    ↓
T2.1 → T2.2 → T2.3 → T2.4 → T2.5 → T2.6
    ↓
T3.1 → T3.2 → T3.3 → T3.4
    ↓
T4.1
    ↓
T5.1
    ↓
T6.1 → T6.2 → T6.3
```

Total estimasi: ~3–4 jam pengerjaan
