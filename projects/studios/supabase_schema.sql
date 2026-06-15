-- ============================================
-- StudiOS Database Schema & Security (Phase 1)
-- ============================================

-- 1. CLEANUP (Optional, for fresh start)
-- DROP TABLE IF EXISTS public.purchases CASCADE;
-- DROP TABLE IF EXISTS public."references" CASCADE;
-- DROP TABLE IF EXISTS public.flashcards CASCADE;
-- DROP TABLE IF EXISTS public.content_items CASCADE;
-- DROP TABLE IF EXISTS public.stacks CASCADE;
-- DROP TYPE IF EXISTS public.content_type CASCADE;
-- DROP TYPE IF EXISTS public.ref_category CASCADE;

-- 2. CUSTOM TYPES
CREATE TYPE public.content_type AS ENUM (
    'brainstorm', 
    'resume', 
    'notes', 
    'ebook', 
    'flashcard', 
    'reference'
);

CREATE TYPE public.ref_category AS ENUM (
    'paper', 
    'video', 
    'article', 
    'book'
);

-- 3. TABLES DEFINITIONS
-- Stacks Table
CREATE TABLE public.stacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT '📚',
    color VARCHAR(7) DEFAULT '#6c5ce7',
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Items Table
CREATE TABLE public.content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stack_id UUID NOT NULL REFERENCES public.stacks(id) ON DELETE CASCADE,
    type public.content_type NOT NULL,
    title TEXT NOT NULL,
    body JSONB DEFAULT '{}'::jsonb,
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flashcards Table
CREATE TABLE public.flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- References Table
CREATE TABLE public."references" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    ref_type public.ref_category DEFAULT 'article',
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchases Table (Akses Pembelian Stack)
CREATE TABLE public.purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stack_id UUID NOT NULL REFERENCES public.stacks(id) ON DELETE CASCADE,
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, stack_id)
);

-- 4. ROW-LEVEL SECURITY (RLS) POLICIES
-- Enable RLS
ALTER TABLE public.stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."references" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Policy for Stacks (Siapapun boleh membaca stack yang dipublikasikan)
CREATE POLICY "Allow public read for published stacks" 
ON public.stacks
FOR SELECT 
USING (is_published = true);

-- Policy for Content Items
-- Izinkan baca jika stack gratis (misalnya ber-icon warna '#free') ATAU jika pengguna terdaftar membelinya di tabel purchases
CREATE POLICY "Allow read content items for purchased stacks or free content" 
ON public.content_items
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.stacks s
        WHERE s.id = content_items.stack_id
        AND (
            s.color = '#free' -- atau logika penentu stack gratis lainnya
            OR EXISTS (
                SELECT 1 FROM public.purchases p
                WHERE p.stack_id = s.id
                AND p.user_id = auth.uid()
            )
        )
    )
);

-- Policy for Flashcards (Mengikuti aturan keterbacaan content_item induknya)
CREATE POLICY "Allow read flashcards based on parent content item accessibility" 
ON public.flashcards
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.content_items c
        WHERE c.id = flashcards.content_item_id
    )
);

-- Policy for References (Mengikuti aturan keterbacaan content_item induknya)
CREATE POLICY "Allow read references based on parent content item accessibility" 
ON public."references"
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.content_items c
        WHERE c.id = "references".content_item_id
    )
);

-- Policy for Purchases (Hanya pengguna itu sendiri yang bisa melihat data pembeliannya)
CREATE POLICY "Allow users to view their own purchases" 
ON public.purchases
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own purchases" 
ON public.purchases
FOR INSERT 
WITH CHECK (auth.uid() = user_id);
