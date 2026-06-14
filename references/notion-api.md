# Notion — Reference Guide

**Mechanism:** Claude.ai Notion MCP (built-in, no API key needed) + Local scripts
**Connected:** 2026-06-11 (Updated: 2026-06-14)
**Workspace:** Bariandono personal (Mythos Brain)

---

## Root Page

| Page | URL | ID |
|---|---|---|
| Mythos Brain (Command Center) | https://app.notion.com/p/37c78c4ce388803eb0adf1e9cf36f580 | 37c78c4c-e388-803e-b0ad-f1e9cf36f580 |

---

## Struktur Mythos Brain

### Databases
| Database | Collection URL / ID |
|---|---|
| Tasks | collection://37c78c4c-e388-816b-8d84-cb529b390bfb |
| Notes | collection://37c78c4c-e388-8152-bbbf-f592d6961b4f |
| Projects | collection://37c78c4c-e388-81f8-9e45-d29e1b98cbe3 |

### Khusus
| Page | URL | ID |
|---|---|---|
| Skripsi Hub | https://app.notion.com/p/37c78c4ce3888196b36cfbb64af35a61 | 37c78c4c-e388-8196-b36c-fbb64af35a61 |
| Weekly Review | https://app.notion.com/p/37c78c4ce3888168b79dc913f95b5c04 | 37c78c4c-e388-8168-b79d-c913f95b5c04 |

---

## MCP Tools yang Tersedia (via Claude app)

| Tool | Fungsi |
|---|---|
| `notion-search` | Cari halaman/database di workspace |
| `notion-fetch` | Baca isi halaman atau database by URL/ID |
| `notion-create-pages` | Buat halaman baru |
| `notion-update-page` | Update isi/properti halaman |
| `notion-create-database` | Buat database baru |

---

## Otomasi Offline (Lokal)

Semua script integrasi Notion offline dipindahkan ke folder workspace utama di:
`d:\WORKSPACE\AIS-OS\scripts\notion\`

* **Instalasi:** `npm install` di dalam folder tersebut.
* **Konfigurasi:** File `.env` di dalam folder tersebut berisi `NOTION_TOKEN` dan `NOTION_PAGE_ID`.
* **Menjalankan Script:**
  ```powershell
  cd d:\WORKSPACE\AIS-OS\scripts\notion
  node scan_workspace.js
  ```
