# Ideation: Finalisasi Makalah Seminar Akuntansi (Thesis Brain)

## Brain Dump
*   **Tujuan Utama**: Membantu Ajie Bariandono melakukan finalisasi terhadap Makalah Seminar Akuntansi pribadinya yang berjudul *"Analisis Pelaksanaan Anggaran Belanja pada Rumah Detensi Imigrasi Pontianak"*.
*   **Konteks Akademis**: Universitas Panca Bhakti Pontianak, Fakultas Ekonomi dan Bisnis (2026).
*   **Metodologi**: 
    1. Membuat skill audit spesifik untuk akuntansi/anggaran/IKPA (`makalah_akuntansi`).
    2. Menjalankan engine `AuditDok` pada file draf PDF makalah seminar yang terletak di `skripsi/drafts/MAKALAH SEMINAR AKUNTANSI_AJIE BARIANDONO_2110426823.pdf`.
    3. Mengekstrak checklist perbaikan detail untuk diterapkan pada file master `makalah_seminar.md` sebelum dikompilasi menggunakan `build_makalah.js` menjadi dokumen Word final.

## Fokus Analisis & Gap Akademik
*   **Kepatuhan EYD/PUEBI**: Memastikan semua istilah asing seperti *Agency Theory*, *adverse selection*, *moral hazard*, *agency cost*, *underrun*, *overrun*, *idle cash*, *withholding tax*, *bottleneck*, *supply chain*, *real-time*, dan *e-purchasing* ditulis miring secara konsisten.
*   **Keakuratan Teori & Regulasi**: Kesesuaian kutipan regulasi (PMK 62/2023, PER-5/PB/2024, UU 17/2003, UU 1/2004) dan penerapan Teori Keagenan (Jensen & Meckling, 1976).
*   **Konsistensi Nomenklatur**: Transisi nama kementerian dari Kementerian Hukum dan Hak Asasi Manusia (TA 2023-2024) ke Kementerian Imigrasi dan Pemasyarakatan (TA 2025) berdasarkan Perpres 139/2024.
*   **Konsistensi Angka**: Menyelaraskan angka antara tabel data empiris deviasi bulanan dengan pembahasan di tubuh teks.

## Alur Kerja Finalisasi (Thesis HITL Workflow)
1. **[NEW SKILL]**: Buat skill audit khusus `makalah_akuntansi.md` di folder `projects/auditdok/skills/`.
2. **[AUDIT DRAFT]**: Jalankan audit 3-pass penuh menggunakan CLI `AuditDok` dengan API Gemini terhadap draf PDF makalah seminar.
3. **[REWRITE & BUILD]**: Terapkan checklist tindakan perbaikan ke file master `makalah_seminar.md` di `skripsi/drafts/`.
4. **[COMPILE TO WORD]**: Jalankan `node build_makalah.js` untuk menghasilkan dokumen Word (`makalah_seminar.docx`) yang bebas dari kesalahan format, spasi, dan ejaan.
