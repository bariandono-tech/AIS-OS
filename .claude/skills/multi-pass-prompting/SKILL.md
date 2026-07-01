---
name: multi-pass-prompting
description: "Playbook untuk panduan prompting bertahap (multi-pass) secara manual di Web LLM (Claude, Gemini Web, ChatGPT) ketika kuota API habis. Panduan ini memecah audit dokumen menjadi 3 tahap berurutan untuk menjamin ketajaman analisis, format cetak miring (italic) istilah asing yang konsisten, dan kompilasi sukses ke PDF."
---

# Multi-Pass Prompting Playbook (HITL Manual Audit)

Playbook ini dirancang untuk mendampingi pengguna (editor/pakar) dalam melaksanakan audit dokumen akademik atau keuangan secara **berurutan (multi-pass)** pada Web LLM (seperti [claude.ai](https://claude.ai) atau [gemini.google.com](https://gemini.google.com)) secara manual tanpa menggunakan kunci API.

## Mengapa Multi-Pass Lebih Unggul?

Mengirimkan satu prompt raksasa (*single-shot*) yang menyuruh AI melakukan segalanya sekaligus sering menyebabkan AI **kehilangan fokus di tengah dokumen (Lost in the Middle)**, melewatkan aturan format kecil (seperti lupa mencetak miring istilah asing), atau memberikan analisis yang dangkal.

Dengan memecah tugas menjadi **3 giliran percakapan bertahap**, AI akan fokus pada satu masalah di satu waktu, sehingga menghasilkan analisis yang jauh lebih tajam dan ketaatan format yang sempurna.

---

## Alur Kerja Multi-Pass Manual (3 Langkah)

### Tahap 1: Lakukan Persiapan Dokumen
Sebelum memulai chat baru di Web LLM, siapkan dua hal:
1.  **Isi Dokumen**: Salin seluruh teks dari berkas dokumen Anda.
2.  **SOP/Panduan Skill**: Gunakan isi berkas panduan dari folder `projects/auditdok/skills/` (misalnya [makalah.md](file:///d:/WORKSPACE/AIS-OS/projects/auditdok/skills/makalah.md) atau [laporan_keuangan.md](file:///d:/WORKSPACE/AIS-OS/projects/auditdok/skills/laporan_keuangan.md)) sebagai sistem instruksi.

---

### Tahap 2: Eksekusi Pass 1 — Review Struktur & Bahasa Umum
Buka percakapan baru di Web LLM, salin teks berikut, ganti placeholder `{{...}}`, dan kirimkan.

```markdown
# INSTRUKSI SISTEM (SOP AUDIT)
{{SALIN_ISI_FILE_SKILL_DISINI}}

---

# DOKUMEN YANG DIAUDIT
{{SALIN_TEKS_DOKUMEN_ANDA_DISINI}}

---

# TUGAS: PASS 1 - REVIEW UMUM & SKOR
Lakukan peninjauan awal terhadap dokumen di atas berdasarkan panduan SOP. Berikan output dengan format berikut:

1. Skor Evaluasi Umum (skala 1-10) beserta alasan ringkasnya.
2. Tinjauan singkat mengenai kelengkapan struktur dokumen (apakah ada bab/bagian penting yang hilang?).
3. Tinjauan tata bahasa umum dan ejaan.

PENTING: Jangan membuat temuan detail per-baris atau checklist dulu pada tahap ini. Cukup berikan gambaran umum.
```

---

### Tahap 3: Eksekusi Pass 2 — Analisis Temuan Detail
Setelah LLM memberikan respon untuk Pass 1, kirimkan perintah berikut pada giliran percakapan kedua:

```markdown
# TUGAS: PASS 2 - ANALISIS TEMUAN DETAIL
Terima kasih atas tinjauan umumnya. Sekarang, lakukan analisis mendalam terhadap dokumen tersebut untuk menemukan kesalahan secara spesifik per-bagian. 

Untuk setiap masalah yang Anda temukan, wajib ditulis dengan struktur berikut:
1. **Lokasi/Bagian**: (misalnya: Bab I Latar Belakang - Halaman 2)
2. **Jenis Masalah**: (Struktur / Bahasa / Logika)
3. **Tingkat Keparahan**: (Kritis / Penting / Opsional)
4. **Deskripsi**: Penjelasan mengapa bagian tersebut salah atau kurang tepat.
5. **Sebelum**: Kutipan teks asli yang bermasalah.
6. **Sesudah**: Rekomendasi teks perbaikan yang benar.

⚠️ PENTING (ATURAN CETAK MIRING):
Pada bagian "Sesudah" (rekomendasi perbaikan), setiap istilah asing atau kata serapan bahasa Inggris (seperti online, database, interface, good governance, download, dsb.) WAJIB dibungkus dengan tanda bintang tunggal agar tercetak miring (*italic*), contoh: *online*, *database*. Pastikan tidak ada istilah asing di kolom "Sesudah" yang ditulis tegak tanpa tanda bintang!
```

---

### Tahap 4: Eksekusi Pass 3 — Checklist Tindakan & Visualisasi
Setelah LLM menyajikan daftar temuan detail di Pass 2, kirimkan perintah final berikut pada giliran percakapan ketiga:

```markdown
# TUGAS: PASS 3 - CHECKLIST TINDAKAN & VISUALISASI
Bagus sekali, analisis temuan detail sangat tajam. Sekarang, kompilasi seluruh temuan tersebut menjadi berkas deliverables akhir dengan format sebagai berikut:

## CHECKLIST TINDAKAN
Buat daftar tindakan perbaikan konkret terstruktur berdasarkan bab/bagian dokumen menggunakan format checkbox '- [ ] ' dan tingkat kepentingannya (Kritis/Penting/Opsional).

## STRUKTUR MINDMAP KONSEP
Buat peta konsep analisis dokumen dalam bentuk daftar poin bersarang (nested bullet points).

## DIAGRAM ALUR
Buat diagram alur logika proses audit dokumen ini menggunakan sintaks blok kode Mermaid.js (```mermaid ... ```).
```

---

## Tahap 5: Verifikasi Manual & Kompilasi PDF Offline

Setelah mendapatkan seluruh teks jawaban dari Pass 3 di Web LLM, lakukan langkah final berikut:

1.  **Salin Seluruh Percakapan**: Gabungkan hasil dari Pass 1, Pass 2, dan Pass 3 ke dalam satu file teks baru, simpan sebagai file markdown, misalnya: `laporan_audit_gabungan.md`.
2.  **Verifikasi Format Cetak Miring**: 
    Lakukan pencarian cepat (*Find/Ctrl+F*) pada file markdown tersebut. Pastikan istilah asing seperti `good governance`, `database`, `download`, dll., di bagian **Sesudah** dan **Checklist** telah dibungkus tanda bintang (contoh: `*good governance*`, `*database*`). Jika masih ada yang tegak, tambahkan tanda bintang secara manual.
3.  **Kompilasi ke PDF**:
    Gunakan CLI AuditDok untuk mengonversi berkas markdown tersebut menjadi PDF resmi secara instan:
    ```powershell
    python -m projects.auditdok.src.cli --compile "path/to/laporan_audit_gabungan.md" --output "path/to/output_directory"
    ```
    *Catatan: Perintah ini secara otomatis akan menghasilkan berkas PDF final, serta mengekstrak berkas `checklist_perbaikan.md` dan `minimap.md` yang sinkron ke folder output Anda tanpa membutuhkan akses API.*
