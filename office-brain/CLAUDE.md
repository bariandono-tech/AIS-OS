# CLAUDE.md — LLM Wiki Agent Rules (Office & Employment)

This document defines the instructions, formatting rules, and workflows for the AI Agent managing this `office-brain` personal knowledge base.

---

## 🏛️ 1. Core Architecture

The vault is divided into two primary folders:
1. **`raw/`**: Immutable source files (office procedures, assignment briefs, reference guidelines, internal templates).
2. **`wiki/`**: Flat compiled markdown database. **NO nested folders allowed**. Every file is directly under `wiki/` to ensure simple link resolution (e.g. `[[Standard_Operating_Procedure]]`).

---

## 📂 2. Categories in index.md

The root `index.md` acts as the main portal for the office Obsidian vault and must categorize wiki links under:
1. **📋 Prosedur & Aturan (Procedures & Rules)**: e.g. `[[SOP_Laporan_Keuangan]]`
2. **🔨 Tugas & Projek (Tasks & Projects)**: e.g. `[[Penyusunan_DIPA_2026]]`
3. **🏢 Informasi Kantor (Office Info)**: e.g. `[[Struktur_Organisasi]]`
