---
name: second-brain
description: >
  Build and maintain a self-improving personal knowledge base ("second brain") using the
  Andrej Karpathy LLM Wiki pattern — plain folders and markdown files only, no databases,
  no plugins, no code. Use when the user wants to create a second brain, knowledge base,
  or personal wiki; or wants to INGEST a source ("add this"), QUERY the brain ("what do I
  know about X"), run a DREAM SEQUENCE / lint / health check, or SAVE a session.
  Activate on: "build my second brain", "add this", "what do I know about", "save this
  session", "dream sequence", "save that", or any mention of personal wiki / knowledge base.
---

# Second Brain — Karpathy LLM Wiki Pattern

Build and maintain a self-improving personal knowledge base as plain folders and markdown
files. The LLM writes and maintains everything. The user reads, curates, and asks questions.

---

## Core Philosophy (read before doing anything)

This is NOT RAG. RAG re-derives answers from scratch on every query. This system
**compiles knowledge once and keeps it current** — a persistent wiki that gets richer
with every source added and every question asked. Cross-references are already there.
Contradictions are already flagged. Synthesis already reflects everything ingested.

Three layers:
- **Raw sources** — immutable source of truth. LLM reads but never modifies.
- **Wiki** — LLM-generated markdown pages. LLM owns this entirely.
- **Schema (CLAUDE.md)** — operating manual at workspace root. Makes LLM a disciplined
  wiki maintainer, not a generic chatbot.

---

## Before Building: Tell the Plan First

Do NOT build immediately. In plain English, tell the user:
1. **WHERE** you'll build it — exact folder path (default: `knowledge-base/` in current
   directory; CLAUDE.md goes one level ABOVE in the workspace root)
2. **WHAT** you'll create — folders and files (list them)
3. **DEFAULTS** you're assuming — purpose: everything in their life; fed mostly by
   pasting links/URLs; Dream Sequence runs weekly

Keep it to a few plain lines. Ask user to confirm with "go" (tell them they can change
folder name or any default in their reply). **Only build AFTER confirmation.**

---

## Architecture

```
{workspace-root}/
├── CLAUDE.md                    ← schema / operating manual (ROOT level, NOT inside knowledge-base/)
└── knowledge-base/
    ├── raw/                     ← junk drawer, immutable, source of truth
    │   ├── session-notes/       ← takeaways saved from chats
    │   └── pages/               ← ALL content pages (topic, entity, synthesis, source summaries)
    ├── wiki/                    ← navigation + bookkeeping ONLY (exactly 3 files, nothing else)
    │   ├── index.md             ← table of contents, points to raw/pages/
    │   ├── log.md               ← dated history, append-only
    │   └── processed.md         ← registry of ingested raw files
    └── outputs/                 ← finished briefings, reports, answers
```

**HARD RULE:** `wiki/` contains ONLY `index.md`, `log.md`, and `processed.md`.
Every other markdown file — every topic, synthesis, entity, source-summary page —
lives in `raw/pages/`. No exceptions.

`raw/` stays a flat dump. To know what's NEW, compare `raw/` against `wiki/processed.md`.
Never re-ingest anything already listed there.

---

## The 5 Operations

### 1. INGEST — user says "add this" (or drops a link/file/text)

Steps in order:
1. Save raw source untouched into `raw/` (use slug filename, e.g. `2026-06-10-article-title.md`)
2. Extract key points and insights
3. Write or update relevant page(s) in `raw/pages/`
4. Update `wiki/index.md` (add new pages, update summaries)
5. Append a line to `wiki/log.md`: `## [YYYY-MM-DD] ingest - {title}`
6. Record in `wiki/processed.md`: `- {filename} | {YYYY-MM-DD} | {one-line summary}`

CRITICAL: processed.md is the guard. Automated passes only ever process what's NEW.
Never re-ingest anything already in processed.md.

### 2. QUERY — user asks "what do I know about X?"

Steps:
1. Read `wiki/index.md` to find relevant pages
2. Read those pages in `raw/pages/`
3. Synthesize answer WITH citations (link to source pages)
4. If the answer is valuable, file it back as a new page in `raw/pages/`
   — this is what makes the brain self-improving

### 3. DREAM SEQUENCE — lint / health check

Run on user's command OR on schedule (default: weekly).

Check for and fix/flag:
- Contradictions between pages
- Stale/outdated claims superseded by newer sources
- Duplicate pages covering the same topic
- Orphan pages with no inbound links
- Important concepts mentioned but lacking their own page
- Missing cross-references
- Data gaps worth filling

Log a summary line: `## [YYYY-MM-DD] dream - health check complete, {N} issues found/fixed`

**Scheduling (Claude Code / local environment):**
Create `.claude/skills/dream-sequence/SKILL.md` or a cron entry. Default cadence: weekly.
Tell user: "To change cadence, say 'make the Dream Sequence run daily'" and update the
schedule accordingly.

**Claude.ai chat:** No scheduling possible. Tell user to run "dream sequence" manually.
(Difference in one line: Claude Code can write files and run scheduled tasks; Claude.ai
chat only persists what you save before the window closes.)

### 4. INDEX + LOG — always keep current

- `wiki/index.md` — clean table of contents, organized by category, one-line summary
  per page, updated on every ingest
- `wiki/log.md` — append-only, format: `## [YYYY-MM-DD] ingest|query|dream|session - title`
  (parseable with `grep "^## \[" wiki/log.md | tail -5`)

### 5. SESSION CAPTURE — user says "save this session"

Append key takeaways to `raw/session-notes/YYYY-MM-DD-{topic-slug}.md`.
Update relevant pages in `raw/pages/` if the session surfaced new knowledge.
Log it: `## [YYYY-MM-DD] session - {title}`

---

## The Self-Improving Rule (mandatory)

Every INGEST and every valuable QUERY **MUST**:
1. Update or create a page in `raw/pages/`
2. Append to `wiki/log.md`

This automatic write-back is what makes the brain self-improving, not just a file dump.

---

## What to Put in CLAUDE.md (workspace root)

Write CLAUDE.md as a clear operating manual covering:
- The 5 building blocks and architecture (with folder map)
- The 5 operations explained simply
- Log format and processed.md format
- The self-improving rule
- The hard rule: wiki/ holds only index/log/processed; all content in raw/pages/
- How to run the Dream Sequence (and how to change the cadence)

---

## Seeding the System (after build)

Seed these files with structure but empty content:

**wiki/index.md:**
```markdown
# Knowledge Base Index
Last updated: {date}

## Concepts
(none yet)

## Entities
(none yet)

## Sources
(none yet)

## Syntheses
(none yet)
```

**wiki/processed.md:**
```markdown
# Processed Sources Registry
Format: - {filename} | {date} | {one-line summary}

(empty — no sources ingested yet)
```

**wiki/log.md:**
```markdown
# Knowledge Base Log
Format: ## [YYYY-MM-DD] ingest|query|dream|session - title

## [{date}] session - knowledge base initialized
```

---

## Teaching the User (3 things only)

After building, explain in plain simple English — like to a smart non-technical friend:

**1. FEED IT**
Paste a link (or file or text) and say **"add this"** — the brain ingests it automatically.
At the end of a good conversation, say **"save this session"** and the takeaways get saved.
*Example: paste a URL to an article about budget deviations and say "add this" — the brain
saves the raw article, extracts the key points, and updates or creates the relevant pages.*
Optional: Obsidian Web Clipper (browser extension) converts web pages to markdown
one-click into `raw/`.

**2. ASK IT**
Ask **"what do I know about X?"** and the brain answers from everything you've fed it,
with sources. Say **"save that"** and the answer becomes a new page — brain gets smarter.
*Example: "what do I know about deviasi Belanja Modal?" → answer with citations, then
"save that" → new synthesis page in raw/pages/.*

**3. DREAM SEQUENCE**
The brain tidies itself on a schedule (weekly by default). It ingests anything new you
dropped in, synthesizes it, cleans up contradictions, duplicates, and orphan pages.
*Example: you dropped 5 articles over the week — Dream Sequence ingests all 5, updates
cross-references, flags one contradiction between two pages, and logs a summary.*

**Day-to-day commands:**
- `add this` — feed a source
- `save this session` — save chat takeaways
- `what do I know about ___` — query the brain
- `save that` — file a good answer back as a page
- `dream sequence` — run the lint / health check

---

## Refinement Questions (ask AFTER building)

Only after the system is built and Dream Sequence is scheduled:

1. What is the main **topic / focus** for this wiki? (Default: "everything in my life" —
   confirm or narrow it, e.g. a business, a subject, content research.)
2. Want me to **pull in knowledge from the internet** on that topic as a second step —
   proactively research and seed starter wiki pages so the brain isn't empty on day one?
   (yes / no — and if yes, which topics?)

---

## Hard Rules Checklist

- [ ] CLAUDE.md lives at workspace ROOT, not inside knowledge-base/
- [ ] wiki/ contains EXACTLY 3 files: index.md, log.md, processed.md
- [ ] All content pages live in raw/pages/
- [ ] raw/ is never edited — immutable source of truth
- [ ] processed.md is checked before every ingest — never re-process old files
- [ ] Every ingest and valuable query updates raw/pages/ AND appends to log.md
- [ ] Tell the plan FIRST, build only after "go" confirmation
