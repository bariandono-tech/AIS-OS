# PRD: Ultimate Brain Lite
**Versi:** 1.0  
**Tanggal:** 2026-06-01  
**Status:** Draft

---

## 1. Latar Belakang

Sebuah template Notion berbayar populer dijual (~$150) yang mengintegrasikan task management, note-taking, project tracking, dan second brain dalam satu sistem. Ia juga mendistribusikan tiga template gratis terpisah:

| Template | Fungsi | Suffix DB |
|---|---|---|
| Ultimate Tasks for Notion | Task & project manager | `[UT]` |
| Ultimate Notes for Notion | Catatan berbasis Tags | `[UN]` |
| PARA Dashboard | Sistem PARA (Projects/Areas/Resources/Archive) | `[PT]` |

**Ultimate Brain Lite** adalah versi yang dibangun sendiri dengan mengintegrasikan ketiga template gratis tersebut — mendekati fungsionalitas Ultimate Brain berbayar tanpa biaya tambahan.

---

## 2. Tujuan

Membangun satu sistem produktivitas terpadu di atas PARA Dashboard yang sudah ada, di mana:

- Semua **Tasks** saling terhubung ke Notes dan Projects
- Semua **Notes** bisa diklasifikasikan dengan Tags (topik) *dan* dikaitkan ke PARA (Project/Area/Resource)
- Semua **Projects** punya Area induk, task progress, dan notes terkait
- **Areas/Resources** jadi backbone hierarki seluruh sistem
- **PARA Dashboard** jadi hub utama untuk melihat gambaran besar

---

## 3. Kondisi Saat Ini

### 3.1 Database yang Ada

#### Ultimate Tasks [UT]
**Tasks [UT]** — database task paling lengkap:
- `Status`: To Do / Doing / Done
- `Priority`: Low / Medium / High
- `Due`: tanggal jatuh tempo
- `Project`: relasi → Projects [UT]
- `Parent Task` / `Sub-Tasks`: self-relation (support sub-task)
- `Smart List`: Someday
- `Recur Interval` + `Recur Unit` + `Days`: recurring task
- Formulas: Meta Labels, Next Due, Due Timestamp, Project Active

**Projects [UT]** — database project terlengkap:
- `Status`: Planned / On Hold / Doing / Ongoing / Done
- `Tasks`: relasi → Tasks [UT]
- `Archived`: checkbox
- Formulas: Progress (% task selesai), Meta (jumlah task aktif), Latest Activity

#### Ultimate Notes [UN]
**Notes [UN]**:
- `Tag`: relasi → Tags [UN]
- `Type`: Reference / Article / Seminar / Idea / Lecture / Book / Plan
- `Favorite` / `Archived`: checkbox
- `URL`: link sumber
- `AI Cost` + `Duration (Seconds)`: metadata audio/AI

**Tags [UN]**:
- `Notes`: relasi → Notes [UN]
- `Favorite` / `Archived`
- Formulas: Latest Note, Latest Note Date, Note Count

#### PARA Dashboard [PT]
**Notes [PT]**:
- `Project`: relasi → Projects [PT]
- `Area/Resource`: relasi → Areas/Resources [PT]
- `Tags`: multi_select (kosong)
- `Root Area`: rollup

**Projects [PT]**:
- `Status`: Not started / In progress / Done
- `Area`: relasi → Areas/Resources [PT]
- `Notes`: relasi → Notes [PT]
- `Tasks`: relasi → Tasks [PT] (database tasks terpisah, lebih sederhana)

**Areas/Resources [PT]**:
- `Type`: Area / Resource
- `Projects`: relasi → Projects [PT]
- `Notes`: relasi → Notes [PT]
- `Resources`: self-relation (resource di bawah area)
- `Root Area`: self-relation

### 3.2 Gap yang Ada

| Gap | Dampak |
|---|---|
| Tasks [UT] tidak terhubung ke Areas/Resources [PT] | Tidak bisa lihat tasks per area |
| Tasks [UT] tidak terhubung ke Notes [UN] | Task dan catatan tidak bisa dikaitkan |
| Projects [UT] tidak terhubung ke Areas/Resources [PT] | Project tidak punya hierarki PARA |
| Projects [UT] tidak punya relasi ke Notes [UN] | Tidak bisa lihat notes per project |
| Notes [UN] tidak terhubung ke Projects atau Areas | Catatan hanya terorganisir by Tags, bukan PARA |
| Ada dua Tasks DB (Tasks [UT] dan Tasks [PT]) | Duplikasi, tidak efisien |
| Ada dua Projects DB (Projects [UT] dan Projects [PT]) | Duplikasi, tidak efisien |
| PARA Dashboard tidak punya Task views | Hub utama tidak mencerminkan task activity |

---

## 4. Arsitektur Target

### 4.1 Database Canonical (yang dipakai)

Dari enam database yang ada, dikonsolidasi menjadi **empat database canonical**:

| Database Canonical | Sumber | Alasan |
|---|---|---|
| **Tasks** (pakai Tasks [UT]) | Ultimate Tasks | Lebih kaya: recurring, sub-task, priority, smart list |
| **Projects** (pakai Projects [UT]) | Ultimate Tasks | Lebih kaya: Progress formula, Latest Activity, 5 status |
| **Notes** (pakai Notes [UN]) | Ultimate Notes | Lebih kaya: Tags relasi, Type, AI metadata |
| **Areas/Resources** (pakai [PT]) | PARA Dashboard | Satu-satunya, sudah jadi backbone hierarki |

Tasks [PT] dan Projects [PT] **tidak dihapus** (bisa diarsipkan), tetapi tidak lagi digunakan sebagai sumber utama.

### 4.2 Relasi yang Perlu Ditambahkan

```
Areas/Resources [PT]
    ├── Projects [UT]        ← BARU: tambah relasi "Area" di Projects [UT]
    │       ├── Tasks [UT]   (sudah ada)
    │       └── Notes [UN]   ← BARU: tambah relasi "Notes" di Projects [UT]
    └── Notes [UN]           ← BARU: tambah relasi "Area/Resource" di Notes [UN]
            └── Tags [UN]    (sudah ada)

Tasks [UT]
    └── Notes [UN]           ← BARU: tambah relasi "Notes" di Tasks [UT]
```

#### Rincian properti baru yang ditambahkan:

**Ke Tasks [UT]:**
- `Notes` → relasi ke Notes [UN]

**Ke Projects [UT]:**
- `Area` → relasi ke Areas/Resources [PT] (limit 1)
- `Notes` → relasi ke Notes [UN]

**Ke Notes [UN]:**
- `Project` → relasi ke Projects [UT] (limit 1)
- `Area/Resource` → relasi ke Areas/Resources [PT] (limit 1)

---

## 5. Hub Utama: PARA Dashboard (Diperluas)

PARA Dashboard direstrukturisasi menjadi **command center** dengan section:

### Section 1 — Today's Focus
- Linked view: Tasks [UT] filter `Due = Today` + `Status != Done`
- Linked view: Tasks [UT] filter `Status = Doing`

### Section 2 — Inbox
- Linked view: Tasks [UT] filter `Project = empty` + `Smart List != Someday`
- Linked view: Notes [UN] filter `Tag = empty` + `Project = empty`

### Section 3 — Active Projects
- Linked view: Projects [UT] filter `Status = Doing OR Ongoing` + `Archived = false`
- Tampil: Name, Status, Progress, Area

### Section 4 — Areas & Resources
- Linked view: Areas/Resources [PT] filter `Archive = false`, group by Type

### Section 5 — This Week
- Linked view: Tasks [UT] filter `Due = Next 7 Days` sorted by Due

---

## 6. Views yang Dipertahankan / Dibuat

### Dari Ultimate Tasks (tetap ada):
- **Inbox** — tasks tanpa project
- **Today** — due today
- **Next 7 Days** — due dalam seminggu
- **All Tasks** — semua tasks
- **Priority View** — digroup by priority
- **Someday** — smart list = Someday
- **Recurring Tasks** — tasks dengan recur interval

### Dari Ultimate Notes (tetap ada):
- **Inbox** — notes tanpa tag
- **Favorites** — favorited notes
- **Recent Notes** — sorted by last edited
- **Tags** — gallery/list semua tags
- **Note Board** — board view by type

### Baru di PARA Dashboard:
- **Notes by Project** — notes difilter per project aktif
- **Notes by Area** — notes digroup by area/resource

---

## 7. Alur Kerja (User Flow)

### Capture Task Baru
1. Buka PARA Dashboard → Task Inbox
2. Tambah task → otomatis masuk Inbox (tanpa project)
3. Saat review: assign ke Project + set Due + Priority

### Capture Note Baru
1. Buka PARA Dashboard → Note Inbox
2. Tambah note → isi Name + (opsional) URL
3. Saat review: assign Tag topik + Project atau Area/Resource

### Buat Project Baru
1. Dari PARA Dashboard → Active Projects → New
2. Isi: Name, Status = Planned, Area (wajib)
3. Tambah tasks dan notes langsung dari dalam halaman project

### Review Harian
1. Buka PARA Dashboard
2. Cek Today's Focus → tasks hari ini
3. Cek Inbox → proses task/note yang belum diassign

---

## 8. Scope & Out of Scope

### In Scope (Ultimate Brain Lite)
- Integrasi Tasks [UT] ↔ Projects [UT] ↔ Areas/Resources [PT] ↔ Notes [UN]
- Tambah properti relasi yang hilang di setiap database
- Restrukturisasi PARA Dashboard sebagai hub utama
- Linked views baru di PARA Dashboard

### Out of Scope (fitur Ultimate Brain berbayar yang tidak direplikasi)
- My Day dashboard (focused daily planning dengan time blocking)
- People / CRM database
- Book tracker + Reading Log
- Recipe tracker + Meal Planner
- Task History untuk recurring tasks
- Goal tracker

---

## 9. Rencana Implementasi

### Fase 1 — Koneksi Database (5 properti baru)
1. Tambah `Area` di Projects [UT] → relasi ke Areas/Resources [PT]
2. Tambah `Notes` di Projects [UT] → relasi ke Notes [UN]
3. Tambah `Project` di Notes [UN] → relasi ke Projects [UT]
4. Tambah `Area/Resource` di Notes [UN] → relasi ke Areas/Resources [PT]
5. Tambah `Notes` di Tasks [UT] → relasi ke Notes [UN]

### Fase 2 — Restrukturisasi PARA Dashboard
6. Tambah section Today's Focus
7. Restrukturisasi Inbox section (task + note)
8. Update Active Projects view dengan properti baru
9. Tambah This Week section
10. Tambah Notes by Project view

### Fase 3 — Verifikasi
11. Tes koneksi: buat 1 project → assign area → buat task → buat note → pastikan semua terhubung
12. Cek semua views menampilkan data dengan benar

---

## 10. Risiko

| Risiko | Mitigasi |
|---|---|
| Tasks [PT] dan Projects [PT] masih dipakai di views lama | Arsipkan / hide views lama setelah fase 1 selesai |
| Relasi circular antar database | Batasi Notes [UN] → Project hanya limit 1 |
| Formula Projects [UT] tidak hitung Notes | Terima sebagai limitasi; Notes tidak masuk progress |

---

*PRD ini adalah dokumen hidup — akan diupdate setelah implementasi fase 1 selesai.*
