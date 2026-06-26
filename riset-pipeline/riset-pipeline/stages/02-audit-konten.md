# Stage 2 — Audit Konten/Kredibilitas

## Tujuan
Validasi tiap kandidat dari Stage 1: kredibel, relevan, tidak predatory, recency
wajar. Ini gerbang kualitas sebelum sumber masuk ke peta dan Notion.

## Input
`outputs/{topik-slug}/00-kandidat-referensi.md`

## Kriteria Audit (per sumber)

1. **Kredibilitas venue** — peer-reviewed jurnal/konferensi resmi? Predatory
   journal flag (cek nama jurnal terhadap pola predatory yang diketahui umum,
   tanpa perlu searching list lengkap — gunakan judgment: nama generik
   berlebihan, scope terlalu luas, fee structure yang dicurigai)?
2. **Recency vs klaim** — kalau sumber membahas state-of-the-art tools/teknik,
   apakah masih relevan atau sudah digantikan perkembangan terbaru? (Untuk topik
   AI-related, cek apakah ada update besar setelah tanggal publikasi yang
   mengubah klaim inti.)
3. **Konsistensi internal** — apakah ringkasan dari Stage 1 cocok dengan apa
   yang benar-benar diklaim sumber (cek ulang lewat web_fetch kalau ragu)?
4. **Relevansi terhadap topik** — bukan cuma "menyebut" topik, tapi benar-benar
   membahas substansinya.

## Format Output

```markdown
# Audit Konten — {topik}
Stage: 2/7 (Audit Konten)
Input: 00-kandidat-referensi.md ({n} kandidat)

## Lolos ({n_lolos})
### {Judul}
- **Status**: LOLOS
- **Catatan**: {kenapa lolos, 1-2 kalimat}

## Tidak Lolos ({n_gagal})
### {Judul}
- **Status**: TIDAK LOLOS
- **Alasan**: {spesifik — venue predatory / outdated / tidak relevan / dst}

## Ringkasan
{n_lolos}/{n} sumber lolos. {catatan pola kalau ada, misal "3 sumber gagal
karena outdated, pertimbangkan persempit rentang tahun pencarian di run
berikutnya"}
```

## Output
`outputs/{topik-slug}/01-audit-konten.md` — hanya sumber LOLOS yang dibawa ke
Stage 3.
