# Stage 3 — Audit Struktur

## Tujuan
Lihat sumber-sumber yang lolos Stage 2 sebagai SATU KESATUAN — cek apakah
mereka membentuk argumen yang koheren, ada gap, ada redundansi, atau ada sudut
pandang yang hilang (misal semua sumber pro satu pendekatan, tidak ada
counter-argumen).

Ini beda dari Stage 2: Stage 2 menilai SATU sumber berdiri sendiri. Stage 3
menilai HUBUNGAN antar sumber.

## Input
`outputs/{topik-slug}/01-audit-konten.md` (hanya bagian "Lolos")

## Yang Dicek

1. **Redundansi** — ada beberapa sumber yang bilang hal yang sama persis?
   Tidak perlu dibuang, tapi ditandai supaya nanti di peta (Stage 4) mereka
   dikelompokkan, bukan ditampilkan sebagai temuan terpisah.
2. **Gap** — ada sub-topik penting yang disebut di salah satu sumber tapi tidak
   ada sumber lain yang membahasnya lebih dalam? Tandai sebagai potensi
   pencarian tambahan.
3. **Bias arah** — apakah kumpulan sumber ini condong satu pendapat? (Relevan
   untuk evaluasi nanti di karpathy-lens Stage 7 — apakah riset ini
   "in-distribution"/well-covered atau "out-of-distribution"/butuh judgment.)
4. **Urutan logis** — kalau dipetakan, mana yang foundational/definisional vs
   mana yang build-on/aplikasi vs mana yang counter-argumen?

## Format Output

```markdown
# Audit Struktur — {topik}
Stage: 3/7 (Audit Struktur)
Input: 01-audit-konten.md ({n} sumber lolos)

## Klaster Tema
### Klaster 1: {nama tema}
Sumber: {judul1}, {judul2}, ...
Catatan: {kenapa diklaster bersama}

### Klaster 2: ...

## Gap Teridentifikasi
- {gap 1}: {sub-topik apa, kenapa penting, belum dibahas mendalam}

## Redundansi
- {sumber A dan B membahas hal sama: ...}

## Bias Arah (opsional, hanya jika jelas ada)
- {catatan kalau kumpulan sumber condong satu sisi}

## Urutan untuk Peta (Stage 4)
1. Foundational: {daftar}
2. Aplikasi/build-on: {daftar}
3. Counter-argumen/kritik: {daftar, kalau ada}
```

## Output
`outputs/{topik-slug}/02-audit-struktur.md` — jadi basis relasi node-edge untuk
Stage 4.
