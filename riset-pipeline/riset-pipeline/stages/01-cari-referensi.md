# Stage 1 — Cari Referensi Akademik

## Tujuan
Dapatkan list kandidat referensi akademik untuk topik yang dikonfirmasi user,
dengan metadata cukup untuk diaudit di Stage 2.

## Langkah

1. Konfirmasi parameter sudah jelas: topik, jumlah target, konteks tambahan.
2. Panggil sub-agent `agents/deep-research.md` lewat Task tool (Claude Code),
   kirim parameter di atas.
3. Terima output sub-agent, tulis ke `outputs/{topik-slug}/00-kandidat-referensi.md`
   TANPA diedit isinya — orchestrator hanya menyimpan, audit baru di Stage 2.
4. Tambahkan header tracking di atas file:

```markdown
# Kandidat Referensi — {topik}
Stage: 1/7 (Cari Referensi)
Tanggal run: {tanggal}
Jumlah kandidat: {n}
Status: siap untuk audit (Stage 2)

---

{isi dari sub-agent}
```

## Jika Sub-Agent Tidak Tersedia

Kalau Task tool/sub-agent tidak bisa dipanggil di environment saat ini, jalankan
langkah yang sama secara inline (langsung web_search + web_fetch di context
utama) — tapi beri tahu user bahwa ini akan lebih boros token dibanding lewat
sub-agent terisolasi.

## Output
`outputs/{topik-slug}/00-kandidat-referensi.md` — siap dibaca Stage 2.
