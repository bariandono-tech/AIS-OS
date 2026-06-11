# Decisions Log

Append-only record of meaningful decisions and why they were made. `/level-up` Phase 2 (Method interview) writes scoped automation specs here. You can also append manually whenever you decide something worth remembering.

**Format per entry:**

```
## YYYY-MM-DD — Short title

**Decision:** what was decided.

**Why:** the reasoning, constraints, and what would change your mind.

**Alternatives considered:** what else was on the table.

**Owner:** who's accountable.
```

Keep it terse. Future-you will thank present-you for capturing the *why*, not just the *what*.

---

## 2026-06-11 — Produk: Jasa PPT Seminar/Skripsi Akuntansi via Twitter

**Decision:** Pivot dari template CALK ke jasa pembuatan PPT seminar proposal dan skripsi (BAB 1–3) untuk mahasiswa akuntansi. Dikerjakan pakai AI, klien terima hasil jadi. Harga Rp 2.000–8.000/slide, target 20 slide/order = Rp 40rb–160rb per klien. Target: 1 klien/hari → Rp 50rb/hari minimum.

**Why:** CALK pasarnya terlalu sempit (instansi pemerintah, procurement panjang). PPT seminar/skripsi pasarnya nyata, kebutuhan berulang tiap semester, pain-nya jelas. Bottleneck sekarang di demand (produksi sudah bisa pakai AI), bukan di kapabilitas.

**Jalur akuisisi:** Twitter — feed diisi konten show-your-work (PPT, flowchart, visual menarik) + CTA jasa. Tone: campuran santai dan profesional. Sambil Twitter tumbuh, jalur cepat: teman kampus dan grup WA mahasiswa.

**Automation yang dibangun:** Prompt template harian Twitter — paste sample kerja → Claude draft 3 opsi tweet (edukatif / show-work / CTA) → pilih satu → posting. Target: 10 menit/hari.

**Autonomy level:** L2 — AI draft, Bariandono yang posting dan putuskan.

**KPI:** More customers. Metrik: 1 klien pertama dalam 30 hari dari Twitter atau jalur WA.

**Alternatives considered:** Template CALK (pasar terlalu sempit), joki PPT umum (crowded) — akuntansi sebagai niche spesifik memberikan edge.

**Owner:** Bariandono.

---

## 2026-06-10 — Weekly AI Opportunity Scan (Prompt Template)

**Decision:** Build a morning prompt template. Paste Notion clippings → Claude filter dan suggest 1 kandidat AI profit + angle Twitter-nya.

**Why:** Clippings sudah ada di Notion (DB Notes, no tag) tapi tidak ada proses yang mengubahnya jadi action. Pertanyaan "produk AI apa yang realistis di Indo?" tidak akan terjawab sendiri — perlu ritual harian yang memaksa satu output konkret.

**Alternatives considered:** Skill dengan Notion MCP (belum bisa — Notion belum konek), autonomous agent (terlalu dini — belum tahu output yang cocok).

**Autonomy level:** L2 — Drafted. AI suggest, Bariandono yang mutusin.

**KPI:** 1 peluang AI profit ter-identifikasi per minggu → minimal 1 di-test dalam Q3 2026. Bucket: More customers (dari 0 ke 1).

**Owner:** Bariandono.

---

## 2026-06-10 — Produk pertama: Template CALK dari Kemenkeu diupgrade

**Decision:** Ambil template Excel CALK dari Kemenkeu (public domain), upgrade berdasarkan gap yang ditemukan saat dipakai untuk data Rudenim Pontianak, lalu jual.

**Why:** Template asli generik dan belum battle-tested. Kamu punya keunggulan nyata — PNS Kemenkum HAM, paham SAKTI dan SAP akrual. Itu value yang bisa dikemas jadi produk spesifik.

**Alternatives considered:** Joki PPT/makalah (crowded, margin tipis), jual jasa (pilih produk dulu).

**Langkah selanjutnya:** Download template → pakai untuk data Rudenim → catat gap → upgrade → validasi ada yang mau beli → baru sempurnain.

**Owner:** Bariandono.
