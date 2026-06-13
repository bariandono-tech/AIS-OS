---
name: grill-me-skripsi
description: >
  Interview the user relentlessly to extract their vision, thinking, and research direction for their skripsi (undergraduate thesis).
  Use when the user wants to stress-test their thesis idea, clarify their research direction, explore their conceptual framework,
  or extract what's in their head into a structured thesis vision document.
  Activate when user says "grill me skripsi", "gali visi skripsi", "bantu saya pikirkan skripsi", or similar.
---

# Grill Me — Skripsi Vision

Relentlessly interview the user to extract their full thesis vision — from the core problem they see, to the theory they want to use, to the contribution they want to make. The goal is NOT to write the thesis yet. The goal is to **capture the researcher's voice and thinking into a durable markdown file** before any drafting begins.

This is a discovery session, not a writing session.

## The capture file is the whole point

Long interviews fill up context. So you **checkpoint to disk after every single answer**. The file, not your context, is the source of truth. Never make the user ask you to save progress.

## Setup (do this BEFORE the first question)

1. **Create the capture file** at `brainstorms/{YYYY-MM-DD}-visi-skripsi.md`
   - Get today's date with `date +%F` (Bash) if you don't already know it.
   - Create the `brainstorms/` folder if it doesn't exist.
2. **Create the file immediately** with this header:

```
# Visi Skripsi — Discovery Notes
Date: {date}
Goal: Menggali dan mendokumentasikan visi penelitian sebelum penulisan dimulai

## Ringkasan Visi (diisi bertahap)
(kosong dulu, diisi saat sesi berjalan)

## Log Tanya-Jawab
(dimulai dari Q1)

## Bendera Terbuka (belum terjawab)
(diisi jika ada yang masih menggantung)
```

3. **Beritahu user di mana file disimpan**, dalam satu kalimat. Lalu langsung mulai Q1.

---

## Checkpoint Rule (non-negotiable)

Setelah SETIAP jawaban user, SEBELUM pertanyaan berikutnya:
- Append ke capture file: topik pertanyaan, poin-poin kunci dari jawaban, dan flag jika ada yang belum jelas.
- Update "Ringkasan Visi" di bagian atas jika jawaban mengubah atau memperjelas gambaran besar.
- Baru tanya pertanyaan berikutnya.

Jangan batch. Satu jawaban = satu checkpoint.

---

## Interview Method

- Tanya **satu pertanyaan sekaligus**.
- Untuk setiap pertanyaan, berikan **dugaan jawaban terbaik kamu** berdasarkan konteks yang sudah ada — user tinggal konfirmasi, koreksi, atau redirect.
- Selesaikan dependensi dari atas ke bawah: jangan tanya "apa teorinya" sebelum "apa masalahnya" terjawab.
- Jika sesuatu bisa dijawab dengan **membaca file yang sudah ada** (draft BAB, data, proposal), lakukan itu — jangan tanya hal yang sudah ada jawabannya.
- Jika user **tidak bisa menjawab**, catat sebagai flag dan lanjut. Jangan stall.
- Di akhir sesi, tawarkan backstop: *"Ada aspek visi penelitian yang belum kita sentuh?"*

---

## Urutan Pertanyaan (ikuti alur ini, tapi fleksibel)

### Blok 1 — Masalah & Motivasi
1. **Apa fenomena konkret** yang kamu lihat dan ingin jelaskan? (bukan judul skripsi — kejadian nyata yang kamu amati)
2. **Mengapa ini penting** sekarang, di konteks ini, di satker/lokasi ini?
3. **Siapa yang akan terdampak** jika masalah ini tidak diteliti?

### Blok 2 — Pertanyaan Penelitian
4. Kalau kamu harus meringkas penelitianmu dalam **satu kalimat tanya**, apa itu?
5. Ada sub-pertanyaan turunan yang perlu dijawab untuk menjawab pertanyaan utama?

### Blok 3 — Teori & Konsep
6. **Teori apa** yang paling pas menjelaskan fenomena ini? Kenapa teori itu, bukan yang lain?
7. Ada **konsep kunci** yang kamu rasa belum punya nama di literatur tapi kamu alami sendiri di lapangan?
8. Penelitian terdahulu mana yang paling dekat dengan topikmu — dan di mana **gap**-nya?

### Blok 4 — Metode & Data
9. Pendekatan apa yang kamu bayangkan — kualitatif, kuantitatif, atau mixed? Kenapa?
10. **Siapa informan** yang bisa menjawab pertanyaan penelitianmu? Kenapa mereka?
11. Data apa yang sudah kamu punya, dan data apa yang masih perlu dikumpulkan?

### Blok 5 — Kontribusi & Batasan
12. Kalau skripsi ini selesai dan bagus, **apa yang berubah** — untuk praktisi, untuk akademisi, atau keduanya?
13. Apa yang secara sadar **kamu batasi** dalam penelitian ini dan kenapa?
14. Ada **risiko atau kelemahan** yang kamu sendiri sudah antisipasi?

---

## Struktur Capture File

```
# Visi Skripsi — Discovery Notes
Date: {date} · Goal: Menggali visi penelitian sebelum penulisan

## Ringkasan Visi (running synthesis)
- Masalah inti: ...
- Pertanyaan penelitian: ...
- Teori utama: ...
- Metode: ...
- Kontribusi yang diharapkan: ...

## Log Tanya-Jawab
### Q1 — {topik}
- Ditanya: {pertanyaan}
- Dicatat: {poin-poin kunci, dalam kata-kata user jika penting}
- Flag: {item yang menggantung → siapa yang bisa jawab}
...

## Bendera Terbuka
- {item} → {tindak lanjut}
```

---

## Di Akhir Sesi

1. Baca ulang capture file — cari kontradiksi atau gap, rekonsiliasi di tempat.
2. Update "Ringkasan Visi" menjadi versi final yang koheren.
3. Berikan user **recap singkat**:
   - Apa yang sudah terdokumentasi dengan baik
   - Apa yang masih open / perlu dipikirkan lebih lanjut
   - Langkah selanjutnya yang disarankan (misalnya: "visi cukup kuat untuk mulai draft BAB I")

---

## Yang Tidak Boleh Dilakukan

- ❌ Jangan langsung nulis BAB — ini sesi penggalian, bukan penulisan
- ❌ Jangan tanya lebih dari satu pertanyaan sekaligus
- ❌ Jangan skip checkpoint meskipun jawaban pendek
- ❌ Jangan pakai bahasa akademik kaku saat bertanya — ini percakapan, bukan sidang
- ❌ Jangan asumsikan visi user sama dengan topik yang sudah ditulis sebelumnya — gali ulang dari nol
