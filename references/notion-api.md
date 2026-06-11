# Notion — Reference Guide

**Mechanism:** Claude.ai Notion MCP (built-in, no API key needed)
**Connected:** 2026-06-11
**Workspace:** Bariandono personal

---

## Root Page

| Page | URL | ID |
|---|---|---|
| Pro MAX Brain (Command Center) | https://app.notion.com/p/37b78c4ce38880fca6c9e71935752566 | 37b78c4c-e388-80fc-a6c9-e71935752566 |

---

## Struktur Pro MAX Brain

### Notes
| View | URL |
|---|---|
| Inbox | https://app.notion.com/p/37b78c4ce388815787c4cb60e48d3176 |
| All Notes | https://app.notion.com/p/37b78c4ce388810ca33ed394fe476c47 |
| Journal | https://app.notion.com/p/37b78c4ce38881ab903fd2834edc0d5e |

### Tasks
| View | URL |
|---|---|
| Inbox | https://app.notion.com/p/37b78c4ce3888166aa07f671ecf09bd3 |
| Today | https://app.notion.com/p/37b78c4ce3888130aaf6ee8649e399e0 |
| All Tasks | https://app.notion.com/p/37b78c4ce38881e88575fd67fd54b3bf |
| Projects | https://app.notion.com/p/37b78c4ce388813e8b24ffa36dbea8da |

### PARA
| View | URL |
|---|---|
| PARA Home | https://app.notion.com/p/37b78c4ce388816c9350e7ade82553f9 |
| PARA Dashboard | https://app.notion.com/p/37b78c4ce38881d6a855df27060ac675 |
| Archive | https://app.notion.com/p/37b78c4ce388816aab8ede9e2e05e972 |

### Khusus
| Page | URL |
|---|---|
| Skripsi Hub | https://app.notion.com/p/37b78c4ce38881e6b1d6dd97616952bf |
| Goals | https://app.notion.com/p/3736837edc27490184c52b1bd10dd5c1 |
| Weekly Review | https://app.notion.com/p/37b78c4ce388813bb5c9e4161ed429bc |

---

## Database Collection IDs

| Database | Collection URL |
|---|---|
| Tasks | collection://37b78c4c-e388-8105-a5b2-000b5faa01a6 |
| Notes | collection://37b78c4c-e388-81de-8816-000bf8f8c872 |
| Projects | collection://37b78c4c-e388-81f4-836c-000bebfc9b81 |
| Goals | collection://b206c2cd-0fe2-44fc-b003-6d53818c5de0 |

---

## MCP Tools yang Tersedia

| Tool | Fungsi |
|---|---|
| `notion-search` | Cari halaman/database di workspace |
| `notion-fetch` | Baca isi halaman atau database by URL/ID |
| `notion-create-pages` | Buat halaman baru |
| `notion-update-page` | Update isi/properti halaman |
| `notion-create-database` | Buat database baru |

---

## Catatan

- MCP ini via claude.ai (bukan API key lokal) — aktif selama sesi Claude
- Untuk otomasi offline (tanpa Claude), perlu Notion API key + `scripts/notion_api.py`
- Skripsi Hub dan Tasks adalah dua entry point paling relevan untuk kerja harian
