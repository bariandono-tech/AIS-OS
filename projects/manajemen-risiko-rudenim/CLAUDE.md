# Agent Instructions: Manajemen Risiko Rudenim Pontianak

You're working inside the **WAT framework** (Workflows, Agents, Tools). This architecture separates concerns so that probabilistic AI handles reasoning while deterministic code handles execution. That separation is what makes this system reliable.

## Objective
Proyek ini bertujuan untuk mengaudit Pedoman Penerapan Manajemen Risiko Kementerian Imigrasi dan Pemasyarakatan (Nomor MIP-OT.02.02-47 TAHUN 2025) dan merancang **Plan Implementasi Manajemen Risiko** khusus untuk satuan kerja (Satker) **Rudenim Pontianak**.
Tugas utama:
1. Audit isi Pedoman Manajemen Risiko (struktur, poin setiap bagian).
2. Merumuskan cara pengimplementasian pedoman tersebut secara spesifik di Rudenim Pontianak.

## The WAT Architecture

**Layer 1: Workflows (The Instructions)**
- Markdown SOPs stored in `workflows/`
- Each workflow defines the objective, required inputs, which tools to use, expected outputs, and how to handle edge cases
- Written in plain language, the same way you'd brief someone on your team

**Layer 2: Agents (The Decision-Maker)**
- This is your role. You're responsible for intelligent coordination.
- Read the relevant workflow, run tools in the correct sequence, handle failures gracefully, and ask clarifying questions when needed
- You connect intent to execution without trying to do everything yourself

**Layer 3: Tools (The Execution)**
- Python scripts in `tools/` that do the actual work
- API calls, data transformations, file operations, database queries
- Credentials and API keys are stored in `.env`
- These scripts are consistent, testable, and fast

## How to Operate

**1. Look for existing tools first**
Before building anything new, check `tools/` based on what your workflow requires. Only create new scripts when nothing exists for that task.

**2. Learn and adapt when things fail**
When you hit an error:
- Read the full error message and trace
- Fix the script and retest (if it uses paid API calls or credits, check with me before running again)
- Document what you learned in the workflow (rate limits, timing quirks, unexpected behavior)

**3. Keep workflows current**
Workflows should evolve as you learn. When you find better methods, discover constraints, or encounter recurring issues, update the workflow. That said, don't create or overwrite workflows without asking unless I explicitly tell you to.

## File Structure

**What goes where:**
- **Deliverables**: Final outputs go to cloud services or final report documents
- **Intermediates**: Temporary processing files that can be regenerated

**Directory layout:**
```
.tmp/           # Temporary files (extracted PDF text, intermediate data)
tools/          # Python scripts for deterministic execution (PDF extractors, parsers)
workflows/      # Markdown SOPs defining what to do and how
.env            # API keys and environment variables
```

Stay pragmatic. Stay reliable. Keep learning.
