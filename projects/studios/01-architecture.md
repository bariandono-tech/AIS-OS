# Architecture: StudiOS — Database-Driven Knowledge Viewer

> **Karpathy Method — Phase 2: ARCHITECT**
> Generated: 2026-06-15
> Status: 🟡 AWAITING DIRECTOR REVIEW

---

## Konsep Produk

**Apa ini?**
Aplikasi web (Vite + React) yang menampilkan konten belajar dari database (Supabase). Konten diorganisir per "Stack" (mata kuliah/topik). User membeli akses ke satu atau beberapa Stack.

**Analogi sederhana:**
> Bayangkan Netflix, tapi isinya bukan film — melainkan **interactive study content** per mata kuliah.
> Kamu pilih "Pajak", dan tampil semua: resume, brainstorming, flashcard, referensi, ebook interaktif.

---

## Deliverables (MVP — 1 Stack Contoh)

- [ ] **Landing page** — Sales page untuk satu Stack contoh
- [ ] **App dashboard** — Tampilkan semua Stack yang tersedia
- [ ] **Stack viewer** — Halaman per Stack dengan semua konten di dalamnya
- [ ] **Content renderer** — 6 tipe konten bisa di-render:
  - [ ] Brainstorming / mind map
  - [ ] Resume / ringkasan materi
  - [ ] Catatan belajar
  - [ ] Ebook interaktif
  - [ ] Flashcard / quiz
  - [ ] Link & referensi
- [ ] **Database schema** — Supabase tables untuk semua konten
- [ ] **Filter & search** — Filter per Stack, search per keyword

---

## Target Audience

**Who**: Mahasiswa S1/S2 yang serius belajar — jurusan apapun (akuntansi, kedokteran, hukum, teknik, dll)
**Pain**: Materi kuliah tersebar di banyak tempat (WhatsApp group, foto papan tulis, PDF random, catatan teman). Tidak ada satu tempat yang rapi, interactive, dan bisa di-browse.
**Current alternatives**: Google Drive + Notion + catatan manual. Berantakan.

---

## Value Proposition

> **"Semua materi kuliah kamu — dirangkum, diorganisir, dan dibuat interaktif dalam satu aplikasi."**

---

## Arsitektur Teknis

```
┌─────────────────────────────────────────────────┐
│                   USER BROWSER                   │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │         Vite + React Frontend              │  │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────┐  │  │
│  │  │Dashboard │ │Stack View│ │Content    │  │  │
│  │  │(all      │ │(filtered │ │Renderer   │  │  │
│  │  │ stacks)  │ │ content) │ │(6 types)  │  │  │
│  │  └──────────┘ └──────────┘ └───────────┘  │  │
│  └────────────────────────────────────────────┘  │
│                      │                           │
│                      │ Supabase JS Client        │
│                      ▼                           │
│  ┌────────────────────────────────────────────┐  │
│  │           Supabase (Backend)               │  │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────┐  │  │
│  │  │PostgreSQL│ │Auth      │ │Storage    │  │  │
│  │  │(content  │ │(optional │ │(images,   │  │  │
│  │  │ data)    │ │ for paid)│ │ files)    │  │  │
│  │  └──────────┘ └──────────┘ └───────────┘  │  │
│  └────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘

Deployment: Vercel (free tier) or GitHub Pages
Content Input: Supabase Dashboard / Notion → Supabase sync
```

---

## Database Schema (Supabase PostgreSQL)

### Table: `stacks`
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Stack ID |
| slug | text (unique) | URL-friendly name, e.g. "akuntansi-pajak" |
| title | text | Display name, e.g. "Akuntansi Pajak" |
| description | text | Short description |
| icon | text | Emoji or icon URL |
| color | text | Theme color hex |
| is_published | boolean | Apakah sudah live |
| created_at | timestamptz | Created timestamp |

### Table: `content_items`
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Content ID |
| stack_id | uuid (FK → stacks) | Belongs to which Stack |
| type | enum | `brainstorm`, `resume`, `notes`, `ebook`, `flashcard`, `reference` |
| title | text | Content title |
| body | jsonb | Content body (flexible, per type) |
| metadata | jsonb | Extra data (tags, difficulty, etc.) |
| order_index | integer | Sort order within stack |
| is_published | boolean | Apakah sudah live |
| created_at | timestamptz | Created timestamp |

### Table: `flashcards` (optional, dedicated)
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Flashcard ID |
| content_item_id | uuid (FK) | Parent content item |
| front | text | Question / prompt |
| back | text | Answer |
| tags | text[] | Tags for filtering |

### Table: `references`  (optional, dedicated)
| Column | Type | Description |
|---|---|---|
| id | uuid (PK) | Reference ID |
| content_item_id | uuid (FK) | Parent content item |
| url | text | Link URL |
| ref_type | text | `paper`, `video`, `article`, `book` |
| description | text | Short description |

---

## Content Type Rendering

Setiap `type` di `content_items` di-render berbeda:

| Type | Render As | Body Format (JSONB) |
|---|---|---|
| `brainstorm` | Mind map / tree diagram interaktif | `{ nodes: [{id, label, parent_id, color}], ... }` |
| `resume` | Rich text article dengan section headings | `{ sections: [{title, content_html}] }` |
| `notes` | Markdown viewer dengan syntax highlighting | `{ markdown: "..." }` |
| `ebook` | Multi-page reader dengan navigation | `{ pages: [{title, content_html}] }` |
| `flashcard` | Flip card UI dengan swipe | Linked to `flashcards` table |
| `reference` | Card grid dengan links & previews | Linked to `references` table |

---

## Page Structure

### 1. Dashboard (`/`)
- Grid of all published Stacks
- Each Stack card shows: icon, title, description, content count
- Click → goes to Stack page
- Search bar to filter Stacks

### 2. Stack Page (`/stack/:slug`)
- Stack header (title, description, color theme)
- Tab bar / filter: All | Brainstorm | Resume | Notes | Ebook | Flashcard | References
- Content cards grid, filtered by type
- Click card → opens content viewer

### 3. Content Viewer (`/stack/:slug/:content-id`)
- Full-screen content renderer based on type
- Navigation: prev/next within stack
- Back to Stack button

---

## Scope

### ✅ In v1 (MVP)
- 1 Stack contoh (misalnya: "Akuntansi Pajak")
- Dashboard dengan Stack grid
- Stack page dengan filter per content type
- Content viewer untuk minimal 3 tipe: resume, notes, flashcard
- Supabase database dengan seed data contoh
- Deploy ke Vercel
- Responsive (mobile + desktop)

### 🚫 NOT in v1 (Parked)
- Authentication / payment (untuk sementara akses free)
- Notion sync (manual input dulu via Supabase dashboard)
- Obsidian integration
- Brainstorm mind map visualization (complex)
- Ebook multi-page reader (complex)
- User accounts & progress tracking
- AI features
- Offline mode / PWA

---

## Stack / Tools

| Tool | Purpose | Why |
|---|---|---|
| **Vite + React** | Frontend framework | Fast, modern, great DX |
| **Supabase** | Backend (DB + Auth + Storage) | PostgreSQL, free tier generous, open-source |
| **Vercel** | Deployment | Free, auto-deploy from GitHub |
| **GitHub** | Source control | Standard, free |
| **Vanilla CSS** | Styling | Maximum control, no framework dependency |

---

## Integrasi Notion & Obsidian (Future)

### Notion → Supabase (Phase 2+)
- Script `scripts/notion/` yang sudah ada bisa di-extend
- Notion database → sync ke Supabase `content_items`
- Scheduled sync via cron / manual trigger

### Obsidian ← Supabase (Phase 2+)
- Export content sebagai Markdown files ke Obsidian vault
- Wikilinks antar content items
- Graph view di Obsidian menampilkan knowledge connections

---

## Monetization Model

| Model | Description |
|---|---|
| **Per-Stack Purchase** | Beli akses ke satu Stack (e.g. "Akuntansi Pajak" = Rp 49.000) |
| **Bundle** | Beli beberapa Stack dengan diskon |
| **Subscription** | Akses semua Stack per bulan/tahun (future) |

---

## Verification Plan

### Automated
- `npm run build` — pastikan build berhasil tanpa error
- `npm run dev` — preview di browser

### Manual
- Dashboard menampilkan Stack cards
- Klik Stack → filter konten per tipe bekerja
- Content viewer render dengan benar untuk setiap tipe
- Responsive di mobile dan desktop
- Data dari Supabase tampil dengan benar

---

*Karpathy Method Phase 2 — If it takes more than 1-2 sessions, scope is too big. Cut.*
