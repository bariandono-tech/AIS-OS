---
name: daily-sync
description: Synchronizes daily work logs from active projects (e.g., Studios, Jasa PPT, Thesis) to Notion (Mythos Brain), runs a workspace audit, and keeps the local knowledge graphs updated.
---

# /daily-sync

This skill automates the daily synchronization of your local work logs and brain changes to Notion (Mythos Brain) and updates the local repositories.

## Usage

```bash
daily-sync
# or
/daily-sync
```

---

## Workflow Steps

### Step 1: Detect Active Project and Today's Date
1. Identify today's date in `YYYY-MM-DD` format (e.g., `2026-06-17`).
2. Scan the `projects/` directory or look at `git status` to see which projects were modified today (e.g., `studios`, `jasa-ppt-akuntansi`, or `thesis-brain`).

### Step 2: Update the Sync Script Target Date
The AI must automatically update the `TARGET_DATE` and `TARGET_DATE_LABEL` variables in the `scripts/notion/sync_to_tasks.js` script before running it:

*   Target script: `scripts/notion/sync_to_tasks.js`
*   Change `TARGET_DATE` to today's date (e.g., `'2026-06-17'`) and `TARGET_DATE_LABEL` (e.g., `'17 Juni 2026'`).

### Step 3: Run the Sync Script (Target: Tasks Database)
Execute the script using Node.js to create a task page under the `daily-sync` project:

```bash
node scripts/notion/sync_to_tasks.js
```

Ensure that your `scripts/notion/.env` contains a valid `NOTION_TOKEN` (which is gitignored but present locally).

### Step 4: Keep the Local Graph Current (Graphify)
If `graphify-out/graph.json` exists in the workspace, run the update command to parse changed files:

```bash
graphify update .
```

### Step 5: Update the Local Activity Logs
Append a dated log entry to the corresponding brain's log file:
*   For **Skripsi/Thesis:** `thesis-brain/log.md`
*   For **Business:** `business-brain/log.md`
*   For **Personal:** `personal-brain/log.md`

Format:
`## [YYYY-MM-DD] ingest - synced worklog to Notion Mythos Brain`

---

## Error Handling & Fallbacks
*   **Missing .env or Notion Token:** If the client fails with auth errors, print a clear message: *"Notion Token is missing or expired in scripts/notion/.env. Please verify your token."*
*   **Missing Entry in work-log.md:** If there is no section for today's date in the project's `work-log.md`, prompt the user to write today's work log entry first before running the sync.
