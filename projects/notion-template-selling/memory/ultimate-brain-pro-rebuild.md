---
name: ultimate-brain-pro-rebuild
description: State of the Ultimate Brain Pro Notion rebuild — new data source IDs, what's done, what's left
metadata:
  type: project
---

Rebuilding the user's "Ultimate Brain Pro" Notion template to match the reference Ultimate Brain spec (`ultimate-brain-reference-transcript.md`). Original methodology is GTD + PARA (public) — building ORIGINAL structure, not copying/reselling any purchased template.

**Root cause of "dashboard kacau":** the old home page "Ultimate Brain Pro Max" (`37678c4c-e388-80ba-87c5-d878ea10038a`) is ARCHIVED/in-trash, and all its child databases went with it (Goals, People, Books, Recipes, Meal Plan, Reading Log, Task History, Journal & Reviews — the `37678c4c-…` collection family is inaccessible / object_not_found). The live home the user actually opens is "Ultimate Brain Pro" (`37278c4c-e388-81b5-b100-ca36bee9d6ba`), which was just a vertical link list, not a 3-column dashboard.

**New foundation databases — DONE, all under live home `37278c4c…`:**
- Tasks — `collection://e41b7fab-cc33-47f3-a414-e02bb4fa6653` (GTD List, Context, Priority, Cold checkbox, Quick Capture, Due Date, Snooze Until, Delegated To, Archive)
- Areas & Resources — `collection://f53d37f1-a7d3-4238-a253-b01ce8ea8e39` (Type: Area/Resource)
- All Notes — `collection://7c4205e4-4d25-4757-9ff0-6ac268eb8d35` (Type: Note/Book/Recipe/Web Clip/Fleeting/Daily; unified reference architecture)
- Projects — `collection://ab7eeb0c-95df-421d-889d-03579e8008f3`
- Goals (OKR) — `collection://e4944875-9a7a-4a0c-ad7a-cbb56727548b` (Level Vision/Annual/Quarterly, Status, Target/Current, KR Progress formula = Current/Target, Parent Goal↔Sub-Goals self-relation)

**Relations wired:** Tasks↔Project, Notes↔Project, Area↔Projects, Notes↔(Area/Resource), Goal↔Projects, Goals↔Area, Goal Parent↔Sub.

**Catatan properti Notes asli (`collection://c2378c4c-e388-821c-a3b2-0756845e7238`):** 7 properti Flylighter/Voice Notes (URL, Audio File, Duration (Seconds), File Name + formula Duration, URL Base, URL Icon) sempat dihapus lalu DI-UNDO/dipulihkan (Juni 2026). CATATAN PENTING: formula Duration/URL Base/URL Icon hasil REKONSTRUKSI (bukan source asli — API tak bisa fetch ekspresi asli), jadi mungkin tidak 100% identik dgn template asli. Deskripsi properti kosong setelah restore. Untuk versi byte-identik, pakai Page History Notion.

**Decision log:** User chose to NOT restore the trashed "Eks Pro Max" set (API can't fully un-trash; parent page deliberately marked "boleh dihapus", likely by a concurrent Claude cowork agent). Building fresh on "Pro" instead. Replicated the old Goals OKR schema into the new Goals DB.

**Still TODO:**
- (optional) Upgrade Tasks "Cold" checkbox → formula. The dateBetween version failed with "Type error"; simple formulas DO work. Retry a corrected Cold formula via update_data_source.
- Phase 3 pages: Quick Capture, My Day, Process/GTD, Plan, Archive, Notes dashboard; consolidate Books/Recipes into All Notes (Type filter)
- Phase 4: rebuild homepage as 3-column layout with LINKED views of these data sources (need enhanced-markdown-spec for linked-view syntax); merge duplicate homes + Quick Links
- User wants the "tampilan saat masuk" to look like the reference 3-column dashboard.

**Linked-view mechanism (LEARNED):**
- Markdown `<database data-source-url="collection://...">` FAILS with "Data source not found" — do NOT use for linked views.
- USE tool `notion-create-view` with `parent_page_id` + `data_source_id` (collection:// works). Appends a linked view to the END of the page. Supports `configure` DSL: FILTER, GROUP BY, SORT BY, CALENDAR BY, SHOW, CHART, etc. See `notion://docs/view-dsl-spec`.
- Limitation: create-view can't place a view inside a `<columns>` layout. For 3-column reference look, open question — may need to build columns in markdown with empty placeholders then move views in UI, or accept end-of-page stacked views.
- Created so far on home "Pro": GTD Board (board, grouped by GTD List) = `view://37878c4c-e388-8137-955c-000cbb82c856`.

**Current visible state of "Pro" home (messy, needs cleanup):** old plain link-list (top) + 5 child source databases (inline=false sub-pages) + 1 GTD Board linked view (bottom). Two failed insert_content attempts did NOT apply.

**⚠️ AGENT COLLISION DISCOVERED (2026-06-07):** A concurrent Claude cowork agent is ALSO rebuilding the same "Pro" home, in parallel with this session. Two overlapping builds now coexist on page `37278c4c`:
- COWORK's build: freshly re-created live DBs — Goals `802b9fc7-ba83-4708-a137-3469d2adab1e`, People `5d007327`, Books `55b8a391`, Reading Log `776e9467`, Recipes `9f6e0b2c`, Meal Plan `3eae425c`, Journal & Reviews `d856c6c1`, Task History `a0313142`; plus sub-pages Task Manager `37878c4c…2085`, Project Hub `…2285`, Notes Dashboard `…8de4`. BUT cowork's Task Manager/Project Hub views and its Goals relations still point to the TRASHED Tasks `a3278c4c` / Projects `a1578c4c` / Areas `2fc78c4c` → cowork's dashboards are BROKEN.
- MY build (this session): clean, fully-working interlinked core — Tasks `e41b7fab`, Projects `ab7eeb0c`, Areas `f53d37f1`, All Notes `7c4205e4`, Goals `e4944875`. No special-views or dashboards yet.
- DUPLICATES: two Goals DBs (cowork `802b9fc7` vs mine `e4944875`), and my Tasks/Projects/Areas/Notes overlap cowork's intended core.

**RESOLUTION (user chose):** "Saya yang lanjut, hentikan cowork" — user stops the cowork agent; I own the build using MY clean core and rebuild everything fresh (not reusing cowork's broken build).

**FRESH CLEAN BUILD — DONE (2026-06-07):**
- New home page: **🧠 Ultimate Brain Pro — Home** = `37878c4c-e388-812a-84ff-d8fc21b10616` (standalone, NOT under the messy old "Pro"). Has 3-column nav (Smart Dashboards / Productivity / Special) + snapshot views (Upcoming, Do Next, Priority Projects).
- My 5 source DBs MOVED under the new home (safe).
- Sub-pages created under new home (all id prefix 37878c4c-e388-…): My Day `81ee-91fb-f3c14d0e9d84`, Quick Capture `8121-b9d0-eb57335458ec`, Process `81ba-88aa-ebc558458250`, Plan `816d-9260-e99f2cca74d1`, Task Manager `8173-80eb-fc8cec7bbc45`, Project Hub `8113-9fb8-e27441bc161b`, Notes Dashboard `814e-b45f-d1efaefaccd9`, Archive `812d-945d-fd38e56d57b9`, Book Tracker `81ce-bc90-f46eac991332`, Recipe Book `8193-8bac-ec5a81335f02`, Quick Links `8188-95e2-f047d3b25b60`.
- ~29 filtered linked views created (create-view DSL): My Day (Upcoming/Do Next board by Context/Priority Projects), Quick Capture (Task Inbox/Note Inbox), Process (Intake/Do Next/Delegated/Snoozed/Someday), Task Manager (Calendar/Inbox/Cold Tasks/Completed), Project Hub (Pipeline board by Status), Notes (Inbox/Favorites/Recents/Fleeting), Plan (This Quarter/Annual Goals), Archive (Archived Notes/Projects/Completed Tasks), Book Tracker (Library gallery Type=Book), Recipe Book (Recipes gallery Type=Recipe).
- Seeded sample data: 6 tasks, 3 projects, 4 notes (incl. 1 Book, 1 Recipe, 1 Fleeting), 3 goals.

**CLEANUP (2026-06-07):** Trashed 8 cowork databases via update_data_source(in_trash=true): Goals 802b9fc7, People 5d007327, Books 55b8a391, Reading Log 776e9467, Recipes 9f6e0b2c, Meal Plan 3eae425c, Journal & Reviews d856c6c1, Task History a0313142. NOTE: only Goals was a true duplicate; People/Journal/Meal Plan/Reading Log/Task History were UNIQUE feature-rich DBs not replicated in my build — they're in trash (recoverable ~30 days) if user wants them back. Pages can't be trashed via MCP (no tool) — user must manually delete old "Ultimate Brain Pro" 37278c4c, "Eks Pro Max" (permanent-delete from trash), and cowork subpages Task Manager/Project Hub/Notes Dashboard in the Notion UI.

**HOME TIDIED + ONBOARDING (2026-06-07):** Home rebuilt via replace_content — clean 3-column nav using actual `<page>` child-page links (no more redundant flat list). Added container "🗄️ Databases" `37878c4c-e388-81c5-9fd0-d1d7b103d965` (moved the 5 source DBs into it) + "How to Get Started" `37878c4c-e388-8182-be1d-c03bfc39dd54` buyer onboarding page. Re-added 3 home snapshot views (Upcoming/Do Next/Priority Projects). Old "Pro" page renamed → "🗑️ OLD — Ultimate Brain Pro (BOLEH HAPUS)" so user can delete it without confusing it with the new home. NOTE: create-view CAN place views in columns is still false — but `<page>`/`<database>` blocks CAN be arranged in `<columns>` via replace_content (use allow_deleting_content=true to drop linked-view blocks, then recreate them with create-view afterward).

**LIFE DBs + PARA (2026-06-07):** API can't restore trashed DBs (move fails "in trash"), so rebuilt the 5 fresh under Databases container: People `8595c0dd-9f01-450a-98bb-e9769f6c7713`, Journal & Reviews `c7bd9a92-e7f5-4348-a5e7-889ebb489958`, Meal Plan `f2152e44-9e23-4c78-bf86-7495659f19bf`, Reading Log `16cbb698-18c8-4030-889e-36d5f13eb735`, Task History `928eb53e-06fc-4a01-bf2b-7376615c2573`. (Old trashed versions left for user to purge.) These are standalone (no relations to core yet — optional polish). Created **PARA Dashboard** page `37878c4c-e388-81c3-823d-c1d011399bad` with Areas + Resources gallery views. Home nav rebuilt to 4 columns: Smart Dashboards / Productivity (+ PARA Dashboard) / Special / 🌱 Life (mention-database links to the 5 Life DBs).

**API LIMITATION (relation filters / templates):** create-view DSL does NOT support filtering a view by a relation-to-a-specific-page (`FILTER "Area" CONTAINS "Health"` is silently dropped → empty filter). And there is NO API to create a Notion database template. So per-Area filtered tables and the dynamic "Area Layout" template are UI-only. WORKAROUND in place: the two-way relations mean each Area page auto-lists its linked Projects/Goals/Notes in its PROPERTIES panel (verified on Health). The Health area page now holds a callout + step-by-step UI recipe to build the reusable "Area Layout" database template (`/linked` view + filter "Area contains this template page"). PARA Dashboard fixed: Areas heading→Areas gallery, Resources heading→Resources gallery, seeded 3 Areas (Health/Business/Personal Growth) + 3 Resources (Productivity/Finance/Notion Tips). Health seeded with 1 linked Project/Goal/Note.

**STILL OPEN / TODO:**
- User already deleted OLD page + purged trash (done).
- (was) User to manually delete (UI) the renamed "🗑️ OLD — Ultimate Brain Pro (BOLEH HAPUS)" `37278c4c` — cascades cowork subpages Task Manager/Project Hub/Notes Dashboard. "Eks Pro Max" already permanently deleted. Also purge the old trashed Life DBs from Trash.
- DONE: Life DB relations wired — People→Tasks/Projects/Notes (+ Last Contact date), Task History→Tasks (DUAL 'History'), Meal Plan→All Notes (Recipe), Reading Log→All Notes (Book). People formulas added: "Days Since Contact" = dateBetween(now(), Last Contact, days); "Birthday (This Year)" = dateAdd(Birthday, year(now())-year(Birthday), years). NOTE: dateBetween DOES work in formula-via-DDL (earlier Cold failure was something else) — so Tasks "Cold" checkbox COULD now be upgraded to a formula, but left as checkbox to avoid breaking the existing "Cold Tasks" checkbox filter view.
- Sub-page filtered views still stacked vertically (not in columns) — user can drag in UI, or rebuild each sub-page like the home (replace_content with column scaffold) if desired.
- Relative-date views (Today/overdue, next-7-days) not done — DSL lacks relative dates; used "Upcoming = has due date, sorted" as approximation.
- Old messy "Pro" page `37278c4c-e388-81b5-b100-ca36bee9d6ba` + the trashed "Eks Pro Max" + cowork's duplicate DBs (Goals 802b9fc7, People 5d007327, Books 55b8a391, etc.) still exist — user to archive/delete after confirming the new home is good.
- Optional: upgrade Tasks "Cold" checkbox → formula; consolidate any real data from cowork's DBs if needed.
- Quick Links / Book Tracker / Recipe Book pages could use richer templates.

See [[notion-ub-pro-vs-spec-gaps]] if created.
