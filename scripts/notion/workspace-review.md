# MAX Brain (1) — Workspace Review
> Dibuat: 2026-06-10 | Status: **FINAL — Audit lengkap selesai**

---

## 1. Peta Struktur Lengkap

```
MAX Brain (1)
├── Pro Notes
│   ├── [Nav] Inbox | Favorites | All Notes | Tags
│   ├── Main Pages
│   │   ├── Inbox          → DB: Notes (Ultimate) — view: Inbox
│   │   ├── Favorites      → DB: Notes (Ultimate) — view: Favorites
│   │   ├── All Notes      → DB: Notes (Ultimate) — view: All Notes
│   │   └── Tags           → DB: Tags (Ultimate)
│   └── Special Pages
│       ├── Journal        → DB: Notes (Ultimate) — view: filtered Type=Journal
│       ├── Meeting Notes  → DB: Notes (Ultimate) — view: filtered Type=Meeting
│       ├── Note Board     → DB: Notes (Ultimate) — view: Board/Kanban
│       └── Databases      → referensi ke Notes + Tags DB
│
├── Pro Tasks
│   ├── [Nav] Inbox | Today | Week | Projects
│   ├── Main Pages
│   │   ├── Inbox          → DB: Tasks [UT] — view: Inbox
│   │   ├── Today          → DB: Tasks [UT] — view: Today
│   │   ├── Next 7 Days    → DB: Tasks [UT] — view: 7 Days
│   │   ├── All Tasks      → DB: Tasks [UT] — view: All
│   │   └── Projects       → DB: Projects [UT] — view: Projects
│   └── Other Pages
│       ├── Task Journal   → DB: Tasks [UT] — view: Task Journal
│       ├── Someday        → DB: Tasks [UT] — view: Someday
│       ├── Priority View  → DB: Tasks [UT] — view: Priority
│       ├── Recurring Tasks → DB: Tasks [UT] — view: Recurring
│       └── Databases      → referensi ke Tasks [UT] + Projects [UT]
│
└── PARA
    ├── Task Inbox         → DB: Tasks [PT] ⚠️ AKAN DIGANTI ke Tasks [UT]
    ├── Note Inbox         → DB: Notes [PT] ✅ MASTER BARU
    ├── Projects           → DB: Projects [PT] ⚠️ AKAN DIGANTI ke Projects [UT]
    ├── Areas & Resources  → DB: Areas/Resources [PT] ✅ TETAP
    ├── Archive            → 4 DB arsip (Tasks, Notes, Projects, Areas)
    ├── Databases          → Tasks [PT], Notes [PT], Projects [PT], Areas [PT]
    └── PARA Dashboard     → Tasks + Notes + Projects + Areas (semua via [PT])
```

---

## 2. Database Inventory — Status Setelah Audit

### Master Database (SETELAH merge)

| DB | Collection ID | Peran | Relasi Final |
|---|---|---|---|
| **Notes [PT]** ✅ MASTER | `81de-8816` | Semua catatan | → Projects [UT], → Areas [PT], → Tags |
| **Tasks [UT]** ✅ MASTER | `8105-a5b2` | Semua task | → Projects [UT], self sub-tasks |
| **Projects [UT]** ✅ MASTER | `81f4-836c` | Semua project | → Tasks [UT], → Notes [PT], → Areas [PT] |
| **Areas/Resources [PT]** ✅ TETAP | `81c6-ac4b` | Area & Resource | → Projects [UT], → Notes [PT] |
| **Tags** (Ultimate) ✅ TETAP | `8184-ad58` | Tag hierarchy | → Notes [PT] |

### Database yang Di-retire

| DB | Collection ID | Alasan |
|---|---|---|
| **Notes** (Ultimate) | `81f1-be3d` | Digantikan Notes [PT] yang diperkaya |
| **Projects [PT]** | `81e0-af96` | Digantikan Projects [UT] yang lebih kaya |
| **Tasks [PT]** | `81aa-95cd` | Digantikan Tasks [UT] yang jauh lebih lengkap |

---

## 3. Schema Notes [PT] Setelah Enrichment

Property yang ditambahkan dari Ultimate Notes:

| Property | Type | Dari |
|---|---|---|
| Type | Select | Ultimate Notes (Journal/Meeting/Book/Idea/Lecture/Plan/Recipe/Reference/Voice Note/Web Clip/Article/Note) |
| Favorite | Checkbox | Ultimate Notes |
| Tag | Relation → Tags DB | Ultimate Notes |
| Note Date | Date | Ultimate Notes |
| Audio File | File | Ultimate Notes |
| File Name | Text | Ultimate Notes |
| Duration (Seconds) | Number | Ultimate Notes |
| Updated (Short) | Formula | Ultimate Notes |
| URL | URL | Ultimate Notes |

Property yang sudah ada (dipertahankan):

| Property | Type | Keterangan |
|---|---|---|
| Name | Title | ✅ |
| Project | Relation → Projects [UT] | ✅ Diupdate dari Projects [PT] |
| Area/Resource | Relation → Areas [PT] | ✅ |
| Tags | Multi-select | ✅ Tetap (Meeting/Reference/Journal) |
| Archive | Checkbox | ✅ |
| URL | URL | ✅ |

---

## 4. Schema Projects [UT] Setelah Enrichment

Property yang ditambahkan dari Projects [PT]:

| Property | Type | Dari |
|---|---|---|
| Area | Relation → Areas/Resources [PT] | Projects [PT] |
| Notes | Relation → Notes [PT] | Projects [PT] |

Property yang sudah ada (dipertahankan):

| Property | Type | Keterangan |
|---|---|---|
| Name | Title | ✅ |
| Status | Status (Planned/On Hold/Doing/Ongoing/Done) | ✅ Lebih rich dari Projects [PT] |
| Tasks | Relation → Tasks [UT] | ✅ |
| Progress | Formula (% task selesai) | ✅ |
| Meta | Formula (active + overdue tasks) | ✅ |
| Archived | Checkbox | ✅ |

---

## 5. Relasi Final Antar Database

```
Tags ←──────────────── Notes [PT] ──────────────→ Projects [UT]
                            │                            │
                            └──────────────→ Areas [PT] ←┘
                                                 │
                                    Projects [UT] ←┘
                                         │
                                    Tasks [UT]
                                    (sub-tasks, recurring, priority)
```

**Full relation map:**
- `Notes [PT]` → Project (Projects [UT]), Area (Areas [PT]), Tag (Tags)
- `Tasks [UT]` → Project (Projects [UT]), Parent Task (self)
- `Projects [UT]` → Tasks (Tasks [UT]), Notes (Notes [PT]), Area (Areas [PT])
- `Areas [PT]` → Projects (Projects [UT]), Notes (Notes [PT]), Resources (self)
- `Tags` → Notes (Notes [PT]), Parent Tag (self)

---

## 6. Gap Analysis — Status Resolusi

| ID | Masalah | Status |
|---|---|---|
| G1 | Homepage MAX Brain (1) kosong | 🔄 Akan dikerjakan (Command Center) |
| G2 | Fragmentasi Notes DB | ✅ Resolved — Notes [PT] jadi master |
| G3 | Tidak ada relasi Notes↔Tasks↔Projects | ✅ Resolved — relasi lengkap dibangun |
| G4 | Nav Pro Tasks tidak konsisten | 🔄 Akan dikerjakan |
| G5 | PARA Quick Links tidak berguna | 🔄 Akan dikerjakan |
| G6 | PARA Dashboard perlu update | 🔄 Akan dikerjakan |
| G7 | Duplikasi Task Inbox | ✅ Resolved — PARA akan pakai Tasks [UT] |
