# Arsip pembersihan — 2026-06-30

Dipindahkan ke sini saat finalisasi pipeline `projects/audit revisi proposal/revisi audit/`.
**Tidak dihapus** (sesuai aturan repo), tapi **tidak dipakai lagi.**

| Item | Asal | Alasan diarsipkan |
|---|---|---|
| `stub-root-lama/` | `audit revisi proposal/` (root) | Versi stub lama 4-stage; sudah digantikan folder kanonik di `projects/`. |
| `workflows-stages-lama/` | `projects/.../revisi audit/workflows/stages/` | Copy lama stage 01–04; `stages/` (01–11) adalah satu-satunya sumber. |
| `skripsi-drafts-build_revisi.js` | `skripsi/drafts/build_revisi.js` | Builder duplikat yang bergantung `docx_helpers.js`. Builder resmi = `build_revisi.js` self-contained di folder kanonik (dipanggil `tools/convert_to_word.py`). |

Builder resmi sekarang: `projects/audit revisi proposal/revisi audit/build_revisi.js`.
Peta resmi pipeline: `projects/audit revisi proposal/revisi audit/README.md`.
