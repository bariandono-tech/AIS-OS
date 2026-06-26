# Stage 4 — Peta HTML Interaktif (Mind-Map + Citation Network)

## Tujuan
Satu file HTML yang menggabungkan dua jenis peta dalam satu kanvas interaktif:
- **Mind-map**: relasi antar KONSEP/TEMA (dari klaster Stage 3)
- **Citation network**: relasi antar SUMBER (siapa membangun di atas siapa,
  siapa counter-argumen siapa, dari urutan foundational → aplikasi → kritik)

Ini adalah deliverable visual untuk evaluasi "apakah fitur ini layak masuk
StudiOS" — jadi kualitas desain penting, bukan cuma fungsi.

## WAJIB: Baca Skill Frontend-Design Dulu

Sebelum menulis HTML, view `/mnt/skills/public/frontend-design/SKILL.md` kalau
belum dibaca di sesi ini. Jangan pakai default template (background krem +
serif, atau dark mode + accent neon generik). Subject di sini adalah riset
akademik dan jaringan ide — turunkan palet/tipografi dari situ, bukan dari
default AI-generated.

## Input
- `outputs/{topik-slug}/01-audit-konten.md` (sumber lolos, metadata)
- `outputs/{topik-slug}/02-audit-struktur.md` (klaster, urutan, gap)

## Struktur Teknis

Single HTML file, CSS+JS inline, gunakan library dari CDN (boleh `d3.js` untuk
force-directed graph, atau `vis-network` — pilih satu, jangan keduanya).

Dua mode tampilan dalam satu file, bisa toggle:
1. **Mode Konsep** — node = tema/klaster dari Stage 3, edge = "mendukung" /
   "bertentangan dengan" / "memperluas"
2. **Mode Sitasi** — node = sumber individual, edge = foundational → build-on →
   kritik (arah edge menunjukkan arah pengaruh)

Klik node → panel detail muncul (judul, penulis, tahun, ringkasan, link).
Toggle antar mode harus terasa sebagai transisi yang disengaja, bukan sekadar
ganti dataset secara instan — tapi jangan berlebihan animasinya.

## Konten yang Disertakan

- Judul peta = topik riset
- Legenda warna/bentuk node sesuai tag (foundational/recent/survey/counter-argumen
  dari Stage 1, atau klaster tema dari Stage 3)
- Sumber gap dari Stage 3 ditampilkan sebagai node "kosong"/dashed — visual cue
  bahwa ini area yang belum terisi referensi

## Proses Desain (ikuti pola frontend-design skill)

1. Brainstorm token system dulu (warna 4-6 hex, tipografi 2+ role, layout
   concept, signature element) — tulis sebagai komentar di awal file atau di
   percakapan sebelum coding.
2. Review terhadap brief: apakah ini default template atau pilihan sadar untuk
   subject "peta riset akademik"? Signature element yang masuk akal di sini:
   transisi antar mode konsep/sitasi, atau cara node "gap" divisualisasikan.
3. Baru tulis kode.

## Output
`outputs/{topik-slug}/03-peta.html` — file standalone, bisa dibuka langsung di
browser atau di-embed di Notion (Stage 6) sebagai link/file attachment.
