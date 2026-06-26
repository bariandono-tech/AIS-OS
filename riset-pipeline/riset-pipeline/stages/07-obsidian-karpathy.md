# Stage 7 — Update Obsidian (Second-Brain) + Refleksi Karpathy Lens

## Tujuan
Dua langkah berurutan, pakai dua skill yang sudah ada — bukan menulis ulang
logikanya di sini:
1. **INGEST** ke second-brain (skill `second-brain`) — simpan tiap sumber
   sebagai entry permanen di knowledge base Obsidian-style milik Barynd.
2. **Refleksi** pakai `karpathy-lens` — bukan audit teknis ulang, tapi evaluasi
   arah riset: apakah topik ini "in-distribution" (well-covered, banyak
   literatur, mudah diverifikasi) atau butuh judgment manusia lebih (gap,
   kontroversial, atau sumbernya tipis).

## Input
`outputs/{topik-slug}/04-markdown-siap-pakai.md` +
`outputs/{topik-slug}/02-audit-struktur.md`

## Langkah 1 — INGEST ke Second-Brain

Ikuti operasi INGEST dari `/mnt/skills/user/second-brain/SKILL.md` SECARA PERSIS
(jangan duplikat logikanya di sini — baca file itu langsung):

1. Simpan tiap sumber mentah (dari Stage 5, sudah dalam bentuk paraphrase) ke
   `raw/` dengan slug filename `{tanggal}-{judul-slug}.md`
2. Tulis/update page di `raw/pages/` per sumber atau per klaster tema
3. Update `wiki/index.md`
4. Append baris ke `wiki/log.md`: `## [{tanggal}] ingest - riset-pipeline: {topik}`
5. Catat di `wiki/processed.md`

**Penting**: ini INGEST ke knowledge base second-brain Barynd YANG SUDAH ADA,
bukan bikin folder knowledge-base baru. Kalau second-brain belum pernah dibuat
di workspace ini, beri tahu user dan tanya apakah mau dibuat dulu (ikuti alur
"Before Building: Tell the Plan First" dari skill second-brain) sebelum lanjut.

## Langkah 2 — Refleksi Karpathy Lens

Setelah ingest selesai, jalankan `karpathy-lens` (baca
`/mnt/skills/user/karpathy-lens/SKILL.md`) terhadap KESELURUHAN topik riset
(bukan per-sumber individual). Framework yang paling relevan di sini:

- **Verifiability as Tractability** — seberapa mudah klaim-klaim di topik ini
  diverifikasi? Banyak sumber yang sepakat = lebih tractable.
- **Jagged Intelligence** — apakah topik ini di sirkuit yang well-trodden
  (banyak data pretraining) atau di pinggir (sedikit sumber, perlu hati-hati)?

Tulis hasil refleksi (ikuti format output karpathy-lens: Snapshot + Breakdown +
Rekomendasi, tapi diringkas — tidak perlu 3-5 framework lengkap, cukup 2 yang
paling relevan untuk konteks "evaluasi arah riset").

Simpan refleksi ini sebagai page baru di `raw/pages/` juga (bukan file
terpisah di luar second-brain) — supaya jadi bagian permanen dari knowledge
base, sesuai prinsip "self-improving" dari skill second-brain.

## Format Log Output

```markdown
# Obsidian Update Log — {topik}
Stage: 7/7 (Update Obsidian + Karpathy Lens)

## Ingest
- File raw baru: {n}
- Page baru/update di raw/pages/: {daftar}
- Log entry: {kutipan baris log.md yang ditambahkan}

## Refleksi Karpathy Lens
{ringkasan singkat — in-distribution atau out-of-distribution, rekomendasi}

Page refleksi disimpan di: {path raw/pages/...}
```

## Output
`outputs/{topik-slug}/06-obsidian-update-log.md`

---

Setelah stage ini selesai, kembali ke `SKILL.md` utama untuk langkah penutup
(ringkasan ke user + tulis `RETRO.md`).
