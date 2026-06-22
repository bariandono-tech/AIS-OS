# Architecture: Finalisasi Makalah Seminar Akuntansi

## Deliverables
- [ ] **Custom Skill**: `projects/auditdok/skills/makalah_akuntansi.md`
- [ ] **Laporan Audit Makalah**: `projects/revisi-makalah-akuntansi/output/laporan_audit.md` (dan versi PDF-nya)
- [ ] **Checklist Perbaikan Ter-ekstrak**: `projects/revisi-makalah-akuntansi/output/checklist_perbaikan.md`
- [ ] **Minimap Struktur Teori**: `projects/revisi-makalah-akuntansi/output/minimap.md`
- [ ] **Updated Master Markdown**: `skripsi/drafts/makalah_seminar.md`
- [ ] **Final Compiled Word Document**: `skripsi/drafts/makalah_seminar.docx` (dibuat menggunakan `build_makalah.js`)

## Target Akademis
*   **Fakultas**: Fakultas Ekonomi dan Bisnis, Universitas Panca Bhakti Pontianak.
*   **Ketentuan**: Pedoman penulisan ilmiah akuntansi (EYD/PUEBI, cetak miring istilah asing, konsistensi referensi, spasi tepat).
*   **Lensa Analisis**: Agency Theory (Jensen & Meckling, 1976) & PMK 62/2023 / PER-5/PB/2024.

## Scope
### In v1
- Menyusun skill audit `makalah_akuntansi` yang sensitif terhadap istilah keuangan, akuntansi, dan keimigrasian.
- Menjalankan audit 3-pass penuh menggunakan CLI `AuditDok` pada file draf `MAKALAH SEMINAR AKUNTANSI_AJIE BARIANDONO_2110426823.pdf`.
- Mengoreksi seluruh istilah asing dan typo pada file master `makalah_seminar.md`.
- Mengkompilasi makalah ke Word `.docx` menggunakan `build_makalah.js` dan memverifikasi tata letaknya.

### NOT in v1 (parked)
- Mengubah substansi metodologi atau data primer (karena data real dari OM-SPAN/SAKTI sudah valid).

## Stack / Tools
- **AuditDok Engine**: Untuk pemindaian kesalahan dan pembuatan checklist otomatis.
- **Node.js + docx library (`build_makalah.js`)**: Untuk kompilasi akhir dokumen Word agar siap dicetak.
