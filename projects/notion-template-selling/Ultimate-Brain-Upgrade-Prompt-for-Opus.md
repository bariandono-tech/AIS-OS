<role>
You are a world-class Notion systems architect and senior product manager. You have personally rebuilt comparable second-brain systems from scratch multiple times, you know the exact schema, formulas, relations, and dashboards it ships with, and you know Notion's real capabilities cold (the current formula language, relations & rollups, buttons, database automations, synced/linked views, Layouts, and free-plan limits). You write production-grade PRDs and build guides that an engineer — or an AI agent with Notion API/MCP access — can execute step by step with zero guesswork.
</role>

<mission>
Transform the attached "Ultimate Brain Lite" PRD into TWO deliverables, in one response:

PART A — an upgraded, production-grade PRD ("Ultimate Brain Pro v2.0").
PART B — a step-by-step Notion build guide that implements that PRD exactly.

The target is to MATCH every capability of the leading paid second-brain template (Ultimate Brain 3.0 class), and then EXCEED it with a clearly-labeled set of innovations. The result must be dramatically more powerful, complete, and rigorous than the attached Lite PRD — not a light edit. Treat the attached PRD only as the source of truth for the user's CURRENT Notion workspace state; treat everything else as open to redesign.

Write everything in English. The attached PRD is in Indonesian — use it for facts about the existing databases, then produce all output in clear, professional English.
</mission>

<context>
The user has a real Notion workspace assembled from three FREE reference templates, with these existing databases (database-name suffixes shown in brackets):

- Ultimate Tasks: `Tasks [UT]`, `Projects [UT]`
- Ultimate Notes: `Notes [UN]`, `Tags [UN]`
- PARA Dashboard: `Notes [PT]`, `Projects [PT]`, `Areas/Resources [PT]`

Full current-state details (schema, gaps, current plan) are in the attached PRD below. The user wants to evolve THIS workspace — preserving existing data wherever possible — into a system on par with (and beyond) the paid Ultimate Brain. Do not assume a clean slate; design the migration from what they already have.
</context>

<current_prd_indonesian>
# PRD: Ultimate Brain Lite
Versi: 1.0 | Tanggal: 2026-06-01 | Status: Draft

## 1. Latar Belakang
Sebuah template Notion berbayar populer dijual (~$150) yang mengintegrasikan task management, note-taking, project tracking, dan second brain dalam satu sistem. Ia juga mendistribusikan tiga template gratis terpisah:
- Ultimate Tasks for Notion — Task & project manager — suffix DB [UT]
- Ultimate Notes for Notion — Catatan berbasis Tags — suffix DB [UN]
- PARA Dashboard — Sistem PARA (Projects/Areas/Resources/Archive) — suffix DB [PT]
Ultimate Brain Lite adalah versi yang dibangun sendiri dengan mengintegrasikan ketiga template gratis tersebut.

## 2. Tujuan
Membangun satu sistem produktivitas terpadu di atas PARA Dashboard yang sudah ada, di mana: semua Tasks terhubung ke Notes dan Projects; semua Notes bisa diklasifikasikan dengan Tags dan dikaitkan ke PARA; semua Projects punya Area induk, task progress, dan notes terkait; Areas/Resources jadi backbone hierarki; PARA Dashboard jadi hub utama.

## 3. Kondisi Saat Ini
### 3.1 Database yang Ada
Ultimate Tasks [UT]:
- Tasks [UT] — Status (To Do/Doing/Done), Priority (Low/Medium/High), Due, Project (relasi → Projects [UT]), Parent Task / Sub-Tasks (self-relation), Smart List (Someday), Recur Interval + Recur Unit + Days (recurring), Formulas: Meta Labels, Next Due, Due Timestamp, Project Active.
- Projects [UT] — Status (Planned/On Hold/Doing/Ongoing/Done), Tasks (relasi → Tasks [UT]), Archived (checkbox), Formulas: Progress (% task selesai), Meta (jumlah task aktif), Latest Activity.
Ultimate Notes [UN]:
- Notes [UN] — Tag (relasi → Tags [UN]), Type (Reference/Article/Seminar/Idea/Lecture/Book/Plan), Favorite/Archived (checkbox), URL, AI Cost + Duration (Seconds).
- Tags [UN] — Notes (relasi → Notes [UN]), Favorite/Archived, Formulas: Latest Note, Latest Note Date, Note Count.
PARA Dashboard [PT]:
- Notes [PT] — Project (relasi → Projects [PT]), Area/Resource (relasi → Areas/Resources [PT]), Tags (multi_select kosong), Root Area (rollup).
- Projects [PT] — Status (Not started/In progress/Done), Area (relasi → Areas/Resources [PT]), Notes (relasi → Notes [PT]), Tasks (relasi → Tasks [PT]).
- Areas/Resources [PT] — Type (Area/Resource), Projects (relasi → Projects [PT]), Notes (relasi → Notes [PT]), Resources (self-relation), Root Area (self-relation).

### 3.2 Gap yang Ada
- Tasks [UT] tidak terhubung ke Areas/Resources [PT] → tidak bisa lihat tasks per area.
- Tasks [UT] tidak terhubung ke Notes [UN] → task & catatan tidak bisa dikaitkan.
- Projects [UT] tidak terhubung ke Areas/Resources [PT] → project tidak punya hierarki PARA.
- Projects [UT] tidak punya relasi ke Notes [UN] → tidak bisa lihat notes per project.
- Notes [UN] tidak terhubung ke Projects atau Areas → hanya terorganisir by Tags.
- Ada dua Tasks DB (Tasks [UT] dan Tasks [PT]) → duplikasi.
- Ada dua Projects DB (Projects [UT] dan Projects [PT]) → duplikasi.
- PARA Dashboard tidak punya Task views → hub utama tidak mencerminkan task activity.

## 4. Arsitektur Target (rencana Lite saat ini)
Konsolidasi enam database menjadi empat database canonical:
- Tasks (pakai Tasks [UT]) — alasan: lebih kaya (recurring, sub-task, priority, smart list).
- Projects (pakai Projects [UT]) — alasan: lebih kaya (Progress formula, Latest Activity, 5 status).
- Notes (pakai Notes [UN]) — alasan: lebih kaya (Tags relasi, Type, AI metadata).
- Areas/Resources (pakai [PT]) — backbone hierarki.
Tasks [PT] dan Projects [PT] tidak dihapus (diarsipkan), tetapi tidak lagi jadi sumber utama.
Relasi baru yang direncanakan: Notes di Tasks [UT]; Area + Notes di Projects [UT]; Project + Area/Resource di Notes [UN].

## 5. Hub Utama: PARA Dashboard (rencana Lite)
Sections: Today's Focus, Inbox (task+note), Active Projects, Areas & Resources, This Week.

## 8. Out of Scope (di PRD Lite — fitur UB berbayar yang BELUM direplikasi)
My Day dashboard (time blocking), People / CRM, Book tracker + Reading Log, Recipe tracker + Meal Planner, Task History untuk recurring tasks, Goal tracker.

## 9. Rencana Implementasi Lite
Fase 1: 5 properti relasi baru. Fase 2: restrukturisasi PARA Dashboard. Fase 3: verifikasi koneksi & views.

## 10. Risiko
Dual Tasks/Projects DB; relasi circular; formula Projects tidak menghitung Notes.
</current_prd_indonesian>

<ultimate_brain_3_reference>
This is the authoritative feature set of the PAID Ultimate Brain 3.0 (current as of 2026). Use it as the parity checklist — the upgraded system must equal or surpass every item.

Core databases: Tasks, Projects, Notes, Goals, Tags (the Tags database is what powers Areas & Resources in the PARA model), People, Books, Recipes.

Task management: sub-tasks, recurring tasks (supporting specific times AND date ranges, processed automatically), priority levels, and advanced GTD-style processing with Smart Lists — Do Next, Delegated, Snoozed, Someday.

Notes: fast capture, favoriting, type classification, organize-by-PARA.

Projects: each project is a hub that collects both its Tasks and its Notes in one place.

PARA organization (Tiago Forte): Projects, Areas, Resources, Archives — built in, with Areas/Resources implemented via the Tags database so an Area can contain Projects, Resources, Notes, and more.

Dashboards & modules:
- Home / single-page layout: Tasks, Notes, Projects, Tags accessible from one home page; uses Side Peek so opening an item doesn't navigate away.
- Quick Capture: capture tasks and notes instantly from anywhere.
- My Day: distraction-free daily planning. A "My Day" checkbox on any task surfaces it in an "Execute" section so you focus only on what you planned today.
- My Week: weekly review and look-ahead planning.
- Archive: smart archive with Cold Tasks, Snoozed Tasks, and Someday — keeps the system from bloating.
- People: full personal CRM / contact tracker; create Meeting Notes directly from a contact record; associate contacts with Projects, Tasks, and Tags; never miss birthdays.
- Books: book tracker + Reading Log; notes can be associated with books.
- Recipes: recipe collection + Meal Planning.
- Goals: goals connected to projects/tasks.
- Task History: an advanced (free-plan-compatible) automation that logs every completion of a recurring task so you can see each time you did it.
- Full support for Notion's Layouts feature.
- Recurring tasks work out-of-the-box via a built-in automation that runs on Notion's FREE plan (set a recurring task to Done → it auto-updates Next Due and resets Status to To Do).
- World-class onboarding: in-product tutorials, demo content, and a help/docs hub.

Important: everything in Ultimate Brain runs on Notion's free plan, including its automations. Preserve that constraint.
</ultimate_brain_3_reference>

<beyond_ultimate_brain>
After reaching full parity, design and specify a clearly-labeled "Beyond Ultimate Brain" layer that makes this system measurably more powerful. Include (at minimum — improve on these and add your own):

1. AI layer (use Notion AI / AI blocks and AI-autofill properties): auto-summarize long notes; auto-extract action items from notes/meeting notes into Tasks; auto-suggest Tags/Area for new captures; one-click generation of daily and weekly review drafts; AI "ask your second brain" Q&A surface. For each AI feature, give the exact prompt text to embed.
2. Intelligence / analytics dashboard: task throughput, on-time completion rate, overdue trend, average time-in-status, project health score, area workload balance, stale-project detector, weekly velocity. Specify the formulas/rollups behind each metric.
3. Goal cascade (OKR-style): Vision → Annual goals → Quarterly objectives → Projects → Tasks, with progress rolling UP automatically. Specify the relations and rollup/formula chain.
4. Structured review system: Daily, Weekly, Monthly, and Quarterly review templates with reflective prompts, auto-populated linked views, and a rollover mechanism for unfinished items.
5. Smart prioritization: a computed "Priority Score" formula combining priority, due-date urgency, effort/energy, and project importance, plus a "What should I do now?" view that sorts by it.
6. GTD contexts & energy: add Context (e.g., @computer, @errand, @calls), Effort, and Energy properties, with views that filter by available time/energy.
7. Capture & scaffolding automation: buttons/templates for one-click task capture, project scaffolding (auto-create standard sub-tasks + a project note), and meeting-note creation from a Person.
8. Data-integrity guards: formulas/views that flag orphaned items (no Area, no Project), overdue recurring tasks, and projects with no next action.
9. Journaling / Daily Notes and a Habit tracker, integrated with My Day and the review system.

Label every item in this layer explicitly as "Beyond UB" so the user can see what exceeds the original. Where a feature needs a paid Notion plan or an external/free tool, say so and provide a free-plan alternative.
</beyond_ultimate_brain>

<constraints>
Honor all of these. Violating any one makes the deliverable unusable.

1. Real Notion only. Use only features that actually exist in Notion. No invented properties, blocks, or automation capabilities. If something requires a paid plan or an external tool (Make/Zapier/n8n/API/MCP), label it clearly and give a free-plan workaround.
2. Build on existing data. Design as an evolution of the user's current 6 databases, not a from-scratch rebuild. Explicitly resolve the duplicate databases (Tasks [UT] vs Tasks [PT]; Projects [UT] vs Projects [PT]) with a concrete consolidation + migration plan that preserves existing rows and relations.
3. Map old → new. For every existing database and property, state how it maps to the target canonical model (keep / rename / repurpose / migrate / archive).
4. Two-sided relations. Every relation must be specified on BOTH databases, with the exact property name shown on each side, and whether it's limited to 1 or many.
5. Valid formulas. Every formula must be written in Notion's CURRENT formula syntax and be copy-paste ready. Briefly explain what each returns. Avoid circular dependencies; if a rollup/formula can't compute something (e.g., progress across two databases), say so and give the workaround.
6. Free-plan compatibility. The core system must work on Notion's free plan. For each automation, give the native Notion automation/button setup AND a free-plan-safe method.
7. Exact specs. For every property: name, type, options/format, default, and purpose. For every view: database, view type (Table/Board/Calendar/Gallery/List/Timeline), filters, sorts, grouping, visible properties, and Layout settings where relevant.
8. No fabrication of the current state. If the attached PRD doesn't specify something you need, state your assumption explicitly rather than inventing a fact about the user's workspace.
</constraints>

<approach>
Before writing the deliverables, think step by step (you may show a brief "Design Decisions" preamble, max ~300 words):
1. Audit the current 6 databases and list exactly what exists.
2. Build the parity gap analysis vs Ultimate Brain 3.0.
3. Decide the canonical target schema (which DBs survive, which merge, which are new).
4. Resolve the duplicate-database problem and the migration path.
5. Only then write Part A and Part B in full.
Be exhaustive. Do not truncate, summarize, or write "etc." in place of real specs. If the response is long, that is expected and correct.
</approach>

<output_format>
Produce ONE response, in English, with exactly this structure.

PART A — PRD: ULTIMATE BRAIN PRO v2.0
A1. Executive Summary & Product Vision
A2. Goals, Non-Goals, and Success Metrics (measurable)
A3. Personas & Jobs-to-be-Done / Core Use Cases
A4. Current-State Audit (the 6 existing databases, factual, from the attached PRD)
A5. Ultimate Brain 3.0 Parity Matrix — a table: Feature | UB 3.0 | This System | Notes/How. Cover every UB feature.
A6. Target Architecture — the canonical databases. For EACH database, a full schema table: Property | Type | Options/Format | Relation target (both sides) | Formula | Default | Purpose.
A7. Entity-Relationship Model — describe all relations and provide a schema diagram (Mermaid `erDiagram` or a clear ASCII map).
A8. Module Specifications — one subsection each: Home, Quick Capture, Tasks/GTD, Projects, Notes, PARA & Tags (Areas/Resources), Goals (+ cascade), My Day, My Week, Reviews (Daily/Weekly/Monthly/Quarterly), People/CRM, Books + Reading Log, Recipes + Meal Plan, Archive (Cold/Snoozed/Someday), Task History, Analytics/Intelligence, AI Layer. Each module: purpose, the databases/properties it relies on, the views it shows, and the workflow.
A9. Formula Library — every formula used, in current Notion syntax, copy-paste ready, each with a one-line explanation.
A10. Automations & AI — native Notion automations, buttons, templates, plus free-plan workarounds; and the exact AI prompt text for each AI feature.
A11. Views Catalog — every view in every database with full filter/sort/group/layout specs.
A12. User Flows — capture, inbox processing, plan-my-day, weekly review, full project lifecycle, meeting-note-from-person.
A13. Beyond Ultimate Brain — the labeled innovation layer (see the mandate above).
A14. Migration & Consolidation Plan — resolve duplicate DBs, preserve data, exact move/merge steps.
A15. Risks & Mitigations.
A16. Rollout Roadmap — phased (Phase 1…n) with what ships in each and the dependency order.
A17. Acceptance Criteria & Test Plan — concrete checks proving the system works.
A18. Glossary.

PART B — NOTION BUILD GUIDE (EXECUTION)
An ordered, numbered, do-this-then-that guide that implements Part A. Group steps by phase (matching A16). Every step must be concrete enough to execute by hand OR by an AI agent with Notion API/MCP access, and must state:
- The exact action (create database / add property X of type Y with options Z / paste this formula / configure this relation on both sides / create this view with these filters / create this button with these actions / set up this automation / build this template).
- A verification check ("Done when…").
End Part B with a final end-to-end smoke test: create one Goal → Project → Task → Note → Person → assign Area → run a daily plan → complete a recurring task → confirm Task History logs it → confirm analytics update.
</output_format>

<quality_bar>
- Senior, precise, dense with real specifications; no marketing fluff, no vague "you could…" hand-waving.
- Prefer tables for schemas, parity, and views.
- Exact names, exact types, exact filter logic, real formula syntax.
- Self-contained: a competent builder needs nothing beyond this document.
- Dramatically more capable than the attached Lite PRD, and at least at parity with Ultimate Brain 3.0 on every line of the parity matrix.
</quality_bar>

<self_verification>
Before you finish, silently verify and then fix any failures:
1. The parity matrix includes EVERY Ultimate Brain 3.0 feature from the reference, and none is left at "not covered."
2. Every relation is specified on both databases with named properties and 1-vs-many noted.
3. Every formula is valid current Notion syntax and copy-paste ready.
4. Every property has type + options + default + purpose.
5. The duplicate Tasks/Projects databases are explicitly consolidated with a data-preserving migration.
6. Free-plan compatibility is addressed for every automation.
7. The "Beyond UB" layer is present and clearly labeled.
8. Part B steps each have a verification check, and the final smoke test is present.
9. Everything is in English.
Only output the final, corrected deliverable.
</self_verification>
