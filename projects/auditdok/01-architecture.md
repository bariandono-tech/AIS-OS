# Architecture: AuditDok Agentic Workflow

## Deliverables (v1 CLI)
- [ ] `src/parser.py` — Pengekstrak teks & tabel dari format `.docx` dan `.pdf` menggunakan `python-docx` dan `pdfplumber`.
- [ ] `src/agent.py` — Integrasi LLM (mendukung Claude API dan Gemini API) dengan penanganan tool calling dan streaming.
- [ ] `src/generator.py` — Pembuat laporan audit ringkas (PDF) dan penyusun berkas Markdown (Checklist & MiniMap).
- [ ] `src/workflow.py` — Orkestrator logika WAT (Workflows, Agent, Tools) yang memproses dokumen berdasarkan Tier (Basic/Plus/Pro/Ultra).
- [ ] `src/cli.py` — Antarmuka CLI utama untuk menjalankan proses audit dokumen lokal.
- [ ] `skills/` — Pustaka file Markdown instruksi khusus per jenis dokumen.

## Target Audience & Value Proposition
- **Who**: Mahasiswa, akademisi, profesional kantor, ASN, dan UMKM.
- **Pain**: Biaya langganan AI premium mahal dan tidak efisien jika jarang digunakan. Tidak tahu cara membuat prompt audit dokumen yang terstandar.
- **Value Prop**: *"Jasa audit dokumen per-berkas yang murah dengan kualitas setara konsultan profesional berkat optimalisasi workflow AI agent."*

## Scope v1 (CLI Teruji)
### In v1
- Parser teks dari DOCX dan PDF.
- Pustaka Skills dasar (misalnya untuk: `makalah.md`, `proposal_skripsi.md`, `laporan_keuangan.md`, dan `cv_resume.md`).
- Orkestrator WAT:
  - **Workflows (W)**: Menentukan fase audit (Pass 1: Review Umum, Pass 2: Fokus Detail).
  - **Agent (A)**: Interaksi LLM dengan system prompt dinamis berdasarkan Skill.
  - **Tools (T)**: Ekstraksi teks (Parser) dan pembuatan output (Generator).
- Output Deliverables per Tier:
  - **Basic**: File PDF Laporan Audit Ringkas.
  - **Plus**: Basic + File Markdown berisi Checklist Perbaikan (PRD).
  - **Pro**: Plus + Markdown MiniMap & diagram Mermaid.
  - **Ultra**: Pro + draf penulisan ulang (.docx baru dengan koreksi dasar).

### NOT in v1 (Parked)
- Integrasi bot WhatsApp otomatis.
- Web dashboard dan database relasional.
- Pembayaran QRIS otomatis.

## Directory Structure
```text
projects/auditdok/
├── skills/                     # Pustaka instruksi khusus (.md)
│   ├── makalah.md
│   ├── proposal_skripsi.md
│   ├── laporan_keuangan.md
│   └── cv_resume.md
├── src/                        # Kode sumber Python
│   ├── __init__.py
│   ├── parser.py               # Ekstraksi file
│   ├── agent.py                # Wrapper API LLM
│   ├── generator.py            # Pembuat laporan & markdown
│   ├── workflow.py             # Logika orkestrasi WAT
│   └── cli.py                  # Entry point CLI
├── .env.example                # Template API keys
├── requirements.txt            # Dependensi Python
├── 00-ideation.md              # Fase 1 Ideation
└── 01-architecture.md          # Fase 2 Blueprint
```

## Stack / Tools
- **Language**: Python 3.10+
- **Parsing**: `python-docx` (DOCX), `pdfplumber` (PDF)
- **Report Generation**: `reportlab` (untuk generate PDF laporan) atau Markdown-to-PDF converter.
- **LLM APIs**: `google-genai` (Gemini API) dan `anthropic` (Claude API)
- **Formatting**: `markdown` & `json`
