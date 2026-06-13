---
name: notion-homepage-redesign
description: >
  Generates a complete, ready-to-paste Notion homepage redesign prompt that transforms any
  Notion workspace homepage into the Thomas Frank "Ultimate Brain" three-column style —
  with dark theme, green callout section headers, and structured navigation. Also renders
  a live visual preview of what the redesigned page will look like before the user applies it.

  ALWAYS use this skill when the user mentions any of the following:
  - Changing or redesigning their Notion homepage layout
  - Making Notion look like Thomas Frank's template / Ultimate Brain
  - Reorganizing Notion pages into columns (Dashboards / Productivity Views / Special Views)
  - Updating the appearance or tampilan of their Notion second brain
  - Creating a V2, V3, or new version of their Notion workspace homepage
  - Phrases like "ubah tampilan Notion", "bikin seperti Thomas Frank", "redesign homepage Notion",
    "buat prompt Notion baru", or "update layout Ultimate Brain"
---

# Notion Homepage Redesign — Thomas Frank Style

## What this skill produces

Two deliverables for every run:

1. **A ready-to-paste Notion prompt** — detailed, block-by-block instructions the user can follow (or give to Notion AI) to rebuild their homepage in the Thomas Frank three-column layout.
2. **A visual preview widget** — an inline HTML mockup showing exactly what the redesigned page will look like, rendered in the conversation via `show_widget`.

---

## Understanding the target layout

Thomas Frank's "Ultimate Brain" homepage uses this structure:

```
🧠  Ultimate Brain for Notion
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ Dashboards ]        [ Productivity Views ]      [ Special Views ]
──────────────        ─────────────────────        ────────────────
📊 Dashboard          ✅ Task Manager              ⚡ Quick Links
🌅 My Day             ♟️  Project Hub              📖 Book Tracker
⚡ Quick Capture      📝 Notes                     🍳 Recipe Book
⚙️  Process           🗂️  Areas & Resources
🚀 Plan               🏆 Goals
                      🔩 Archive
```

Each column header is a **Notion callout block** with dark green background and white text (no icon).  
Each item in the list is a **linked page** (using Notion's `@Page` mention or `/Link to page`), displayed as a bullet with an emoji prefix.

---

## How to generate the prompt

When the user asks for a redesign prompt, output the full Notion instruction block below, customized if the user has different pages or a different workspace name.

If the user has already shared their page list (e.g. from a sidebar screenshot), use their actual page names and emojis. Otherwise use the Thomas Frank defaults shown above.

### Prompt template to output

````
=== NOTION HOMEPAGE REDESIGN — THOMAS FRANK STYLE ===

1. HALAMAN UTAMA
   - Tambahkan cover image: pilih gambar gelap/abstract dari Unsplash gallery Notion
   - Ubah icon halaman menjadi: 🧠
   - Judul halaman: "Ultimate Brain for Notion" (biarkan sebagai plain text H1)

2. HAPUS SEMUA KONTEN LAMA di halaman utama (kecuali judul)

3. BUAT TIGA KOLOM SEJAJAR
   Klik di bawah judul → ketik /columns → pilih "3 columns"

4. KOLOM 1 — DASHBOARDS
   Di kolom pertama:
   a. Ketik /callout → pilih warna background: Green (dark) → hapus emoji default
   b. Ketik "Dashboards" di dalam callout → ubah text color: White
   c. Di bawah callout (masih dalam kolom 1), tambahkan bullet list:
      - Ketik /link → cari "Dashboard" → pilih halaman → tambahkan emoji 📊 di depan
      - Ulangi untuk:
        🌅 My Day
        ⚡ Quick Capture
        ⚙️ Process
        🚀 Plan

5. KOLOM 2 — PRODUCTIVITY VIEWS
   Di kolom kedua:
   a. Ketik /callout → Green (dark) background → hapus emoji → ketik "Productivity Views" → White text
   b. Tambahkan bullet list linked pages:
      ✅ Task Manager
      ♟️ Project Hub
      📝 Notes
      🗂️ Areas & Resources
      🏆 Goals
      🔩 Archive

6. KOLOM 3 — SPECIAL VIEWS
   Di kolom ketiga:
   a. Ketik /callout → Green (dark) background → hapus emoji → ketik "Special Views" → White text
   b. Tambahkan bullet list linked pages:
      ⚡ Quick Links
      📖 Book Tracker
      🍳 Recipe Book

7. SIDEBAR — URUTKAN HALAMAN
   Di sidebar Notion, drag & drop halaman agar urutannya:
   🧠 Ultimate Brain (root)
   ├── 📊 Dashboard
   ├── 🌅 My Day
   ├── ⚡ Quick Capture
   ├── ⚙️ Process
   ├── 🚀 Plan
   ├── ✅ Task Manager
   ├── ♟️ Project Hub
   ├── 📝 Notes
   ├── 🗂️ Areas & Resources
   ├── 🏆 Goals
   ├── 🔩 Archive
   ├── ⚡ Quick Links
   ├── 📖 Book Tracker
   └── 🍳 Recipe Book

8. TIPS FINAL
   - Aktifkan "Full width" di pengaturan halaman (... menu → Full width: ON)
   - Aktifkan dark mode di Notion untuk tampilan terbaik
   - Pin halaman utama di sidebar Favorites
````

---

## How to render the visual preview

After outputting the prompt, immediately call `show_widget` with an HTML mockup. The mockup must show:

- Dark background (`#1a1a2e` or similar deep dark)
- A two-panel layout: sidebar on the left (narrow) + homepage on the right
- Sidebar shows the page hierarchy with emoji icons and a highlighted "active" item
- Homepage shows the three columns, each with a dark green callout header and bullet items below
- Small metadata badges at the bottom (cover image style, icon, layout type)
- A label "Preview — setelah prompt diterapkan" or similar

Keep the widget self-contained (no external fetches). Use inline `<style>` for all styling. Respect CSS variables for text and border colors so it works in both light and dark mode, but use hardcoded dark hex for the Notion-like background since that's intentional design.

---

## Customization rules

If the user's workspace differs from the Thomas Frank defaults:

| Situation | What to do |
|-----------|-----------|
| User has extra pages (e.g. Habit Tracker, Journal) | Add them to the most logical column; mention which column you chose |
| User has fewer pages | Remove the missing ones from the prompt; don't leave broken references |
| User wants a different language (e.g. Indonesian) | Translate column header names; keep emoji as-is |
| User wants light theme instead of dark | Change callout background to Light Green; adjust cover image recommendation |
| User is building V2, V3, etc. | Note the version in the widget label; preserve any pages added since V1 |

---

## Output order

Always output in this order:
1. One short sentence: what you're about to generate
2. The formatted prompt block (in a code block for easy copying)
3. `show_widget` call with the visual preview
4. One short closing note (e.g. tips, what to do next)

Do not pad the response with lengthy explanations. The prompt block and the preview together are the deliverable.
