# Ideation: AuditDok Agentic Workflow

## Brain Dump
Rekayasa sistem audit dokumen manual berbasis AI menjadi workflow agentic berbasis Python. Menggunakan kerangka kerja WAT (Workflows, Agent, Tools) untuk melakukan otomatisasi audit dokumen dengan 13 kategori dokumen target (laporan keuangan, proposal skripsi, nota dinas, dll.).

## Market Scan & Value Prop
- **Problem**: Langganan Claude/ChatGPT Pro mahal (Rp400.000/bulan) dan pengguna harus bisa prompt engineering sendiri.
- **Solution**: AuditDok menyediakan audit profesional per dokumen (mulai Rp25.000) dengan output terstandar siap pakai.
- **Angelic Transition**: Mengubah model operasional "copy-paste manual" ke sistem CLI agen Python yang otomatis memilah, menganalisis, dan memproduksi berkas laporan secara sistematis.

## Chosen Direction & Grill-Me Decisions
1. **Skills Library Terpusat**: Setiap jenis dokumen dari 13 kategori memiliki file instruksi khusus (`.md` di folder `skills/`) agar prompt terspesialisasi dan modular.
2. **Hybrid Automation**: Tier Basic, Plus, dan Pro berjalan otomatis penuh ke output. Tier Ultra (yang membutuhkan rewrite & formatting) memerlukan tahap *Human Review* (Protokol Kepercayaan) sebelum dirilis ke client.
3. **Backend Stack**: Menggunakan Python (dengan `python-docx` untuk DOCX, `pdfplumber` untuk PDF, dan SDK Gemini/Claude) untuk penanganan dokumen yang fleksibel dan handal.
4. **V1 Interface**: Memulai dengan program CLI/Script Internal lokal untuk menguji pipeline WAT secara cepat dengan *friction* minimal, sebelum dikembangkan menjadi WhatsApp Bot atau Web UI.

## Parked Ideas (Untuk Versi Mendatang)
- Integrasi WhatsApp Webhook API untuk order & delivery otomatis.
- Web UI admin berbasis Streamlit untuk pemantauan antrean dokumen.
- Integrasi pembayaran otomatis menggunakan QRIS/Midtrans.
