# Stage 6 — Auto-Inject ke Notion (PARA Dashboard)

## Tujuan
Push tiap sumber yang lolos audit sebagai entry baru ke database PARA Dashboard
Barynd yang SUDAH ADA. Tidak membuat database/struktur baru — pakai schema yang
sudah dikonfigurasi (field `Type` Select dengan opsi termasuk `reference`,
`Color`, `StudiOS` checkbox, `Order Index`, dst).

## Input
`outputs/{topik-slug}/04-markdown-siap-pakai.md`

## Langkah

1. **Load Notion MCP tools dulu** kalau belum ter-load di sesi ini:
   panggil `tool_search` dengan query "notion create page" atau sejenisnya.
2. **Cari database PARA Dashboard yang tepat** — gunakan `notion-search` untuk
   menemukan database tujuan (kemungkinan database "Notes" atau "Resources"
   sesuai PARA method), JANGAN assume ID database, selalu cari dulu.
3. **Konfirmasi field yang tersedia** sebelum push — gunakan `notion-fetch` pada
   database untuk lihat schema aktual (field apa saja yang ada), supaya tidak
   menulis ke field yang tidak ada atau salah tipe.
4. **Untuk tiap sumber lolos**, buat page baru lewat `notion-create-pages` dengan:
   - Title: judul sumber
   - `Type`: pilih opsi yang paling cocok dari Select yang sudah ada (kemungkinan
     `reference`; JANGAN buat opsi Select baru tanpa konfirmasi user)
   - Body: isi dari ringkasan + sitasi APA dari Stage 5 (paraphrase, bukan
     copy-paste blok markdown mentah — sesuaikan ke format block Notion yang wajar)
   - Centang `StudiOS` checkbox jika field ini ada dan relevan menandai konten
     ini hasil dari pipeline riset StudiOS

## Jika Field/Database Tidak Ditemukan Sesuai Ekspektasi

JANGAN membuat database/field baru secara sepihak. Laporkan ke user: "Database
X tidak punya field Type dengan opsi reference" (atau temuan lain), tunggu
konfirmasi sebelum lanjut atau bikin penyesuaian.

## Format Log Output

```markdown
# Notion Inject Log — {topik}
Stage: 6/7 (Inject Notion)
Database tujuan: {nama database, page ID kalau ada}

## Berhasil ({n})
- {Judul sumber} → {link page Notion}

## Gagal ({n})
- {Judul sumber} → {alasan gagal}

## Catatan
{temuan tentang schema, field yang dipakai, dst — penting untuk RETRO.md}
```

## Output
`outputs/{topik-slug}/05-notion-inject-log.md`
