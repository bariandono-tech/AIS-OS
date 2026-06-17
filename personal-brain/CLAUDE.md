# CLAUDE.md — LLM Wiki Agent Rules (Personal & Self-Development)

This document defines the instructions, formatting rules, and workflows for the AI Agent managing this `personal-brain` personal knowledge base.

---

## 🏛️ 1. Core Architecture

The vault is divided into two primary folders:
1. **`raw/`**: Immutable source files (personal notes, journal logs, self-assessment trackers, health logs).
2. **`wiki/`**: Flat compiled markdown database. **NO nested folders allowed**. Every file is directly under `wiki/` to ensure simple link resolution (e.g. `[[Profil_Saya_Dan_Evaluasi_Vibecoding]]`).

---

## 📂 2. Categories in index.md

The root `index.md` acts as the main portal for the personal Obsidian vault and must categorize wiki links under:
1. **👤 Profil & Evaluasi Diri (Profile & Self-Assessment)**: e.g. `[[Profil_Saya_Dan_Evaluasi_Vibecoding]]`
2. **🌱 Pengembangan Diri & Hobi (Self-Growth & Hobbies)**: e.g. `[[Vibe_Coding_Learning_Path]]`
3. **📓 Catatan Harian (Journal & Thoughts)**: e.g. `[[Catatan_Refleksi_Harian]]`
