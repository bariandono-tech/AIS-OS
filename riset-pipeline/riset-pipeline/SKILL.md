---
name: riset-pipeline
description: >
  Internal dev tool: pipeline riset akademik end-to-end dari cari referensi sampai
  inject ke Notion dan update Obsidian second-brain. Dipakai untuk PROTOTYPING fitur
  StudiOS (bukan untuk skripsi pribadi) — hasil belajar dari sini nanti jadi spec
  backend produk. Tujuh stage berurutan: (1) cari referensi akademik, (2) audit
  konten/kredibilitas, (3) audit struktur argumen, (4) bikin peta HTML interaktif
  (mind-map + citation-network gabung), (5) format markdown siap-kutip, (6) auto-inject
  ke Notion PARA Dashboard, (7) update Obsidian second-brain + refleksi karpathy-lens.
  GUNAKAN SKILL INI ketika user minta "riset pipeline", "cari referensi lalu petakan",
  "test workflow StudiOS", "jalankan riset-ke-notion", atau menyebut kombinasi:
  cari jurnal + audit + peta + inject Notion + Obsidian dalam satu permintaan.
---

# Riset Pipeline — Internal StudiOS Dev Tool

Pipeline linear 7-stage, file-based. **Bukan 7 agent otonom** — workflows beat agents
(prinsip Machine, 3Ms framework AIS-OS). Tiap stage menulis file, stage berikutnya
membaca file itu. Hanya Stage 1 yang dilempar ke sub-agent terisolasi (riset web berat).

Tujuan: validasi alur + parameter prompt, sebelum dijadikan spec backend StudiOS.
Output disimpan di `outputs/{topik-slug}/`, lalu Stage 6-7 mendistribusikan ke
Notion PARA Dashboard dan Obsidian second-brain milik Barynd sendiri (bukan user akhir).

---

## Sebelum Mulai: Konfirmasi Topik

Tanya/clarify dengan user:
1. **Topik riset** — jadi slug folder, contoh: `prompt-engineering-for-agents`
2. **Untuk BAB/konteks apa** — opsional, kalau ada tujuan kutip spesifik
3. **Berapa referensi target** — default 5-8 sumber per run (cukup buat tes alur,
   jangan kebanyakan biar gak boros token di stage audit)

Jangan langsung mulai stage 1 sebelum topik dikonfirmasi.

---

## Arsitektur File

```
outputs/{topik-slug}/
├── 00-kandidat-referensi.md     ← Stage 1: list sumber + metadata
├── 01-audit-konten.md           ← Stage 2: pass/fail tiap sumber + alasan
├── 02-audit-struktur.md         ← Stage 3: gap & redundansi argumen
├── 03-peta.html                 ← Stage 4: mind-map + citation-network interaktif
├── 04-markdown-siap-pakai.md    ← Stage 5: ringkasan + sitasi APA siap tempel
├── 05-notion-inject-log.md      ← Stage 6: record apa yang berhasil di-push
└── 06-obsidian-update-log.md    ← Stage 7: record ingest + refleksi karpathy-lens
```

**Hard rule:** tiap stage WAJIB baca file output stage sebelumnya, bukan mengulang dari
context percakapan. Ini yang membuat pipeline murah token — tiap stage context-nya kecil.

---

## Stage 1 — Cari Referensi Akademik

Baca `stages/01-cari-referensi.md` untuk instruksi detail.

Panggil sub-agent `agents/deep-research.md` lewat Task tool dengan topik yang sudah
dikonfirmasi. Sub-agent mengembalikan list kandidat — kamu (orchestrator) yang menulis
hasilnya ke `00-kandidat-referensi.md`.

Kenapa sub-agent: riset web (banyak web_search + web_fetch) boros context kalau
dicampur ke percakapan utama. Isolasi di sini, bukan di stage lain.

## Stage 2 — Audit Konten/Kredibilitas

Baca `stages/02-audit-konten.md`. Input: `00-kandidat-referensi.md`. Tidak perlu
sub-agent — ini cuma evaluasi terhadap data yang sudah ada, bukan riset baru.

## Stage 3 — Audit Struktur

Baca `stages/03-audit-struktur.md`. Input: sumber yang lolos dari Stage 2.

## Stage 4 — Peta HTML Interaktif

Baca `stages/04-peta-html.md`. Input: sumber lolos + relasi tema dari Stage 2-3.
**Sebelum membuat file ini, view `/mnt/skills/public/frontend-design/SKILL.md`** —
ini bukan opsional, file HTML ini adalah deliverable visual yang harus didesain dengan
intent, bukan default template.

## Stage 5 — Markdown Siap Pakai

Baca `stages/05-markdown-format.md`. Output format kutip-siap-tempel per sumber.
**Patuhi aturan hak cipta**: paraphrase, kutipan langsung maksimal <15 kata, 1 kutipan
per sumber.

## Stage 6 — Auto-inject Notion

Baca `stages/06-notion-inject.md`. Pakai Notion MCP tools (`notion-create-pages`,
dst — load lewat `tool_search` dulu kalau belum ter-load). Push ke PARA Dashboard
yang SUDAH ADA — field `Type: reference`, jangan bikin database baru.

## Stage 7 — Update Obsidian + Karpathy Lens

Baca `stages/07-obsidian-karpathy.md`. Jalankan operasi INGEST dari skill
`second-brain` yang sudah ada, lalu jalankan `karpathy-lens` sebagai refleksi
penutup (bukan audit teknis) terhadap arah riset secara keseluruhan.

---

## Setelah Selesai

Tampilkan ringkasan singkat: berapa sumber masuk, berapa lolos audit, link ke
`03-peta.html`, dan apakah inject Notion + Obsidian berhasil semua. Tanya user
apakah mau lanjut topik baru atau cukup.

Karena ini internal dev tool, di akhir run **tulis 1 catatan retrospektif** (3-5
kalimat) di `outputs/{topik-slug}/RETRO.md`: bagian mana yang lancar, bagian mana
yang kalau jadi produk StudiOS perlu jadi parameter yang user-configurable (misal:
jumlah sumber, gaya sitasi, target platform selain Notion/Obsidian). Ini yang nanti
jadi bahan spec backend.
