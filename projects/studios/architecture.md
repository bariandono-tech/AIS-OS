# System Architecture: StudiOS

**Status:** Approved | **Version:** 1.0 (MVP) | **Last Updated:** 2026-06-15

---

## 1. System Topology

Aplikasi StudiOS dirancang dengan arsitektur **Jamstack** modern yang memisahkan frontend (presentation layer) dari database dan API (data layer) untuk memaksimalkan performa, keamanan, dan portabilitas.

```text
┌──────────────────────────────────────────────────────────┐
│                   USER BROWSER CLIENT                    │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │                 Vite + React App                   │  │
│  │                                                    │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │  │
│  │  │  Dashboard   │  │  Stack Page  │  │ Content  │  │  │
│  │  │  (Stack List)│  │  (Tabs Filter)│  │ Viewer   │  │  │
│  │  └──────┬───────┘  └──────┬───────┘  └────┬─────┘  │  │
│  └─────────┼─────────────────┼───────────────┼────────┘  │
└────────────┼─────────────────┼───────────────┼───────────┘
             │                 │               │
             │           Supabase JS SDK       │
             └─────────────────┼───────────────┘
                               ▼
┌──────────────────────────────────────────────────────────┐
│                    SUPABASE PLATFORM                     │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │                 PostgreSQL Database                │  │
│  │  ┌───────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │  stacks   │  │content_items │  │ flashcards  │  │  │
│  │  └───────────┘  └──────────────┘  └─────────────┘  │  │
│  │  ┌───────────┐  ┌──────────────┐                   │  │
│  │  │ references│  │  purchases   │                   │  │
│  │  └───────────┘  └──────────────┘                   │  │
│  └──────────────────────────▲─────────────────────────┘  │
└─────────────────────────────┼────────────────────────────┘
                              │
                      Notion Sync Webhook
                              │
┌─────────────────────────────┴────────────────────────────┐
│                    NOTION WORKSPACE                      │
│                                                          │
│   ┌──────────────────────────────────────────────────┐   │
│   │               Notion Databases                   │   │
│   │   [Stacks] ───relates───► [Content Items]        │   │
│   └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend Core** | React 19 + Vite | Fast compilation (esbuild), component-driven, great ecosystem. |
| **Styling** | Vanilla CSS (Variables & Utility) | Full layout control, zero compile-time CSS overhead, matches dark premium aesthetics perfectly. |
| **Backend & DB** | Supabase (PostgreSQL) | Instant REST APIs, Built-in Auth, Row-Level Security (RLS) policies, generous free tier. |
| **Data Source** | Notion API | The user (creator) writes content naturally inside Notion; API sync eliminates duplicate entries. |
| **Hosting** | Vercel | Automatic deployments from GitHub, edge network, fast page load speeds. |

---

## 3. Database Schema (PostgreSQL DDL)

Berikut adalah skema relasional tabel yang digunakan untuk menyimpan data terstruktur di Supabase:

### 1. Table: `stacks`
Menyimpan data mata kuliah atau modul materi utama.
```sql
CREATE TABLE public.stacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT '📚',
    color VARCHAR(7) DEFAULT '#6c5ce7', -- Hex color (e.g. #00cec9)
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Table: `content_items`
Menyimpan item isi dari stack. Satu stack memiliki banyak `content_items`.
```sql
CREATE TYPE content_type AS ENUM ('brainstorm', 'resume', 'notes', 'ebook', 'flashcard', 'reference');

CREATE TABLE public.content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stack_id UUID NOT NULL REFERENCES public.stacks(id) ON DELETE CASCADE,
    type content_type NOT NULL,
    title TEXT NOT NULL,
    body JSONB, -- Fleksibel: Menampung struktur sections/markdown per tipe konten
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Table: `flashcards`
Menyimpan butir kartu hafalan terikat pada content_item bertipe `flashcard`.
```sql
CREATE TABLE public.flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
    front TEXT NOT NULL, -- Pertanyaan
    back TEXT NOT NULL,  -- Jawaban
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Table: `references`
Menyimpan daftar tautan referensi terikat pada content_item bertipe `reference`.
```sql
CREATE TYPE ref_category AS ENUM ('paper', 'video', 'article', 'book');

CREATE TABLE public.references (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    ref_type ref_category DEFAULT 'article',
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. Table: `purchases`
Menyimpan log kepemilikan stack berbayar oleh user.
```sql
CREATE TABLE public.purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Terhubung ke auth.users Supabase
    stack_id UUID NOT NULL REFERENCES public.stacks(id) ON DELETE CASCADE,
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, stack_id)
);
```

---

## 4. Security & Access Control (Supabase RLS)

Untuk melindungi materi berbayar, fitur Row-Level Security (RLS) di PostgreSQL diaktifkan:
*   Materi gratis (`stacks.is_published = true` dan akses tidak dikunci) dapat dibaca publik tanpa login.
*   Materi berbayar hanya dapat diakses jika pengguna memiliki baris relasi di tabel `purchases`.

```sql
-- Mengaktifkan RLS pada content_items
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

-- Policy: Izinkan baca jika stack bersifat publik/gratis ATAU pengguna telah membeli stack tersebut
CREATE POLICY "Allow read for purchased or free stacks"
ON public.content_items
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.stacks s
        WHERE s.id = content_items.stack_id
        AND (
            s.color = '#free' -- Penanda stack gratis (contoh)
            OR EXISTS (
                SELECT 1 FROM public.purchases p
                WHERE p.stack_id = s.id
                AND p.user_id = auth.uid()
            )
        )
    )
);
```

---

## 5. Notion Synchronization Pipeline

1.  **Notion Setup**: Creator menulis materi di Notion menggunakan dua database utama yang saling berelasi: `Stacks Database` dan `Content Items Database`.
2.  **Sync Trigger**: Pengguna menjalankan CLI script `npm run sync` (atau dipicu webhook GitHub Actions secara terjadwal).
3.  **Sync Logic (`sync_to_supabase.js`)**:
    *   Mengambil entri dari Notion API.
    *   Melakukan sanitasi teks Markdown dan parsing tabel.
    *   Melakukan operasi **UPSERT** ke database Supabase (mencocokkan berdasarkan UUID kustom/slug).
    *   Mengunggah berkas gambar/media dari Notion ke Supabase Storage.
