# Stage 5 — Markdown Siap Pakai

## Tujuan
Konversi sumber yang lolos audit jadi format yang bisa langsung ditempel ke
draft tulisan (artikel, bahan ajar, dokumentasi) — lengkap dengan sitasi APA
dan catatan kapan/di mana sumber ini relevan dipakai.

## Input
`outputs/{topik-slug}/01-audit-konten.md` (sumber lolos) +
`outputs/{topik-slug}/02-audit-struktur.md` (klaster, untuk pengelompokan)

## ATURAN HAK CIPTA — WAJIB DIPATUHI

- Paraphrase, jangan kutip verbatim kecuali benar-benar perlu
- Kalau ada kutipan langsung: maksimal <15 kata, dan MAKSIMAL 1 kutipan per
  sumber di seluruh file ini
- Ringkasan tetap harus berupa rewrite penuh dengan kata sendiri, bukan
  "menghilangkan tanda kutip" dari teks asli — itu tetap reproduksi

## Format Output

Kelompokkan per klaster tema (dari Stage 3), bukan urutan sembarang:

```markdown
# Referensi Siap Pakai — {topik}
Stage: 5/7 (Format Markdown)
Sumber lolos: {n}

## Klaster: {nama tema 1}

### {Judul Sumber}
**Sitasi APA**: {Penulis}. ({Tahun}). {Judul}. {Venue}.

**Ringkasan** (kata sendiri, 3-4 kalimat): ...

**Kapan dipakai**: {konteks penggunaan — misal "relevan untuk bagian definisi
agentic workflow" atau "cocok sebagai contoh kontras terhadap pendekatan X"}

**Kutipan kunci** (opsional, <15 kata): "..." — gunakan HANYA jika ada satu
frasa yang benar-benar penting secara persis kata-katanya (misal terminologi
teknis spesifik)

---

### {Sumber berikutnya di klaster ini}
...

## Klaster: {nama tema 2}
...
```

## Output
`outputs/{topik-slug}/04-markdown-siap-pakai.md` — siap untuk dibaca manusia
langsung, dan jadi bahan untuk Stage 6 (Notion) + Stage 7 (Obsidian).
