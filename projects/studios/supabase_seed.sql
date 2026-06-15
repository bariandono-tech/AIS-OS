-- ============================================
-- StudiOS Database Seed Data (Phase 1)
-- ============================================

-- 1. INSERT STACKS
INSERT INTO public.stacks (id, slug, title, description, icon, color, is_published) VALUES
('11111111-1111-1111-1111-111111111111', 'akuntansi-pajak', 'Akuntansi Pajak', 'Rangkuman lengkap materi perpajakan: PPh 21, PPN, PPh Badan, Coretax System, dan regulasi terbaru PMK 2024-2025.', '📊', '#00cec9', true),
('22222222-2222-2222-2222-222222222222', 'hukum-syariah', 'Hukum Syariah', 'Materi fiqh muamalah, akad-akad syariah, perbankan syariah, dan fatwa DSN-MUI terkini.', '⚖️', '#6c5ce7', true),
('33333333-3333-3333-3333-333333333333', 'statistika-penelitian', 'Statistika Penelitian', 'Uji hipotesis, regresi, ANOVA, SPSS tutorial, dan interpretasi hasil penelitian kuantitatif.', '📈', '#fd79a8', true),
('44444444-4444-4444-4444-444444444444', 'manajemen-keuangan', 'Manajemen Keuangan', 'Time value of money, capital budgeting, WACC, analisis rasio keuangan, dan valuasi perusahaan.', '💰', '#fdcb6e', true),
('55555555-5555-5555-5555-555555555555', 'audit-dan-assurance', 'Audit & Assurance', 'Standar audit, prosedur substantif, sampling audit, laporan auditor, dan etika profesi akuntan.', '🔍', '#00b894', true),
('66666666-6666-6666-6666-666666666666', 'metodologi-penelitian', 'Metodologi Penelitian', 'Desain riset, teknik sampling, instrumen penelitian, validitas & reliabilitas, dan penulisan skripsi.', '🔬', '#e17055', true)
ON CONFLICT (slug) DO NOTHING;

-- 2. INSERT CONTENT ITEMS
INSERT INTO public.content_items (id, stack_id, type, title, body, order_index, is_published) VALUES
-- --- Akuntansi Pajak ---
(
  'c1c1c1c1-1111-1111-1111-111111111111', 
  '11111111-1111-1111-1111-111111111111', 
  'resume', 
  'Ringkasan PPh Pasal 21 — Tarif TER Terbaru 2025',
  '{
    "sections": [
      {
        "title": "Apa itu PPh 21?",
        "content": "Pajak Penghasilan Pasal 21 adalah pajak yang dikenakan atas penghasilan yang diterima oleh Wajib Pajak orang pribadi dalam negeri sehubungan dengan pekerjaan, jasa, atau kegiatan. Pemotong PPh 21 meliputi pemberi kerja, bendahara pemerintah, dan penyelenggara kegiatan."
      },
      {
        "title": "Tarif Efektif Rata-rata (TER) — PMK 168/2023",
        "content": "Mulai Januari 2024, penghitungan PPh 21 menggunakan tarif efektif rata-rata (TER) yang dibagi menjadi dua kategori:\n\n• TER Bulanan — untuk masa pajak Januari s.d. November\n• TER Tahunan — untuk masa pajak Desember (penghitungan ulang setahun penuh)\n\nTER ditentukan berdasarkan status PTKP (TK/0, K/0, K/1, dst.) dan jumlah penghasilan bruto bulanan."
      },
      {
        "title": "Tabel TER Bulanan Kategori A (TK/0 & TK/1)",
        "content": "| Penghasilan Bruto Bulanan | TER |\n|---|---|\n| s.d. Rp 5.400.000 | 0% |\n| > Rp 5.400.000 - Rp 5.650.000 | 0,25% |\n| > Rp 5.650.000 - Rp 5.950.000 | 0,50% |\n| > Rp 5.950.000 - Rp 6.300.000 | 0,75% |\n| > Rp 6.300.000 - Rp 6.750.000 | 1,00% |\n| > Rp 6.750.000 - Rp 7.500.000 | 1,25% |\n| ... | ... |\n\n*Sumber: Lampiran PMK 168/2023*"
      },
      {
        "title": "Cara Menghitung PPh 21 dengan TER",
        "content": "Masa Januari-November:\nPPh 21 = Penghasilan Bruto × TER Bulanan\n\nMasa Desember:\nPPh 21 = PPh 21 Terutang Setahun − Total PPh 21 (Jan-Nov)\n\nContoh:\nBudi (TK/0) gaji bruto Rp 10.000.000/bulan\n• TER Bulanan: 2% (sesuai tabel Kategori A)\n• PPh 21 per bulan (Jan-Nov): Rp 10.000.000 × 2% = Rp 200.000\n• Total PPh 21 (Jan-Nov): Rp 200.000 × 11 = Rp 2.200.000\n• PPh 21 Desember: dihitung ulang dengan tarif Pasal 17 UU PPh"
      }
    ]
  }'::jsonb,
  1,
  true
),
(
  'c2c2c2c2-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'flashcard',
  'Flashcard: Dasar-Dasar Perpajakan Indonesia',
  '{}'::jsonb,
  2,
  true
),
(
  'c3c3c3c3-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'notes',
  'Catatan Kuliah: PPN dan PPnBM',
  '{
    "markdown": "# PPN dan PPnBM — Catatan Kuliah\n\n## Definisi PPN\nPajak Pertambahan Nilai (PPN) adalah pajak yang dikenakan atas **penyerahan Barang Kena Pajak (BKP)** dan/atau **Jasa Kena Pajak (JKP)** di dalam daerah pabean.\n\n## Tarif PPN\n- **Tarif umum**: 11% (berlaku sejak April 2022)\n- **Tarif rencana 2025**: 12% (sesuai UU HPP)\n- **Tarif ekspor BKP berwujud & JKP tertentu**: 0%\n\n## Mekanisme Pengkreditan\n```\nPPN yang harus disetor = Pajak Keluaran - Pajak Masukan\n```\n\n### Pajak Keluaran (PK)\nPPN yang dipungut saat **menjual/menyerahkan** BKP/JKP\n\n### Pajak Masukan (PM)\nPPN yang dibayar saat **membeli/memperoleh** BKP/JKP\n\n## PPnBM (Pajak Penjualan Barang Mewah)\n- Hanya dikenakan **satu kali** pada saat impor atau penyerahan oleh pabrikan\n- Tarif: 10% - 200% (tergantung jenis barang)\n\n> 💡 **Tips ujian**: Fokus pada mekanisme pengkreditan PK-PM dan kode faktur pajak!"
  }'::jsonb,
  3,
  true
),
(
  'c4c4c4c4-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'reference',
  'Referensi & Link Penting Perpajakan',
  '{}'::jsonb,
  4,
  true
),

-- --- Hukum Syariah ---
(
  'c8c8c8c8-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'resume',
  'Ringkasan Akad-Akad dalam Perbankan Syariah',
  '{
    "sections": [
      {
        "title": "Pengertian Akad",
        "content": "Akad dalam fiqh muamalah adalah perikatan/perjanjian antara dua pihak atau lebih yang menimbulkan hak dan kewajiban. Rukun akad: al-aqidain (para pihak), mahallul aqd (objek), maudhu''ul aqd (tujuan), sighat (ijab-qabul)."
      },
      {
        "title": "Akad Jual Beli (Tijarah)",
        "content": "• **Murabahah** — jual beli dengan margin keuntungan yang disepakati. Bank membeli barang lalu menjual ke nasabah dengan harga pokok + margin.\n• **Salam** — jual beli dengan pembayaran di muka dan penyerahan barang di kemudian hari.\n• **Istishna''** — jual beli pesanan/manufacturing."
      }
    ]
  }'::jsonb,
  1,
  true
),
(
  'c9c9c9c9-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'flashcard',
  'Flashcard: Istilah-Istilah Fiqh Muamalah',
  '{}'::jsonb,
  2,
  true
),
(
  'c10c10c1-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'brainstorm',
  'Mind Map: Pembagian Riba dalam Fiqh Muamalah',
  '{
    "nodes": [
      { "id": "riba-root", "label": "Riba (Bunga/Kelebihan)", "parent_id": null, "color": "#6c5ce7" },
      { "id": "riba-duyun", "label": "Riba Duyun (Utang)", "parent_id": "riba-root", "color": "#e17055" },
      { "id": "riba-buyu", "label": "Riba Buyu'' (Jual Beli)", "parent_id": "riba-root", "color": "#00b894" },
      { "id": "riba-qardh", "label": "Riba Qardh (Manfaat tambahan utang)", "parent_id": "riba-duyun", "color": "#fdcb6e" },
      { "id": "riba-jahiliyah", "label": "Riba Jahiliyah (Denda keterlambatan)", "parent_id": "riba-duyun", "color": "#fdcb6e" },
      { "id": "riba-fadhl", "label": "Riba Fadhl (Kelebihan takaran)", "parent_id": "riba-buyu", "color": "#fd79a8" },
      { "id": "riba-nasiah", "label": "Riba Nasi''ah (Penundaan penyerahan)", "parent_id": "riba-buyu", "color": "#fd79a8" }
    ]
  }'::jsonb,
  3,
  true
),
(
  'c11c11c1-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'reference',
  'Referensi Kajian & Fatwa Keuangan Syariah',
  '{}'::jsonb,
  4,
  true
),

-- --- Statistika Penelitian ---
(
  'c12c12c1-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  'notes',
  'Catatan: Uji Asumsi Klasik Regresi OLS',
  '{
    "markdown": "# Uji Asumsi Klasik — Regresi OLS\n\nUji asumsi klasik adalah prasyarat statistik untuk analisis regresi OLS agar estimator bersifat BLUE.\n\n## 1. Uji Normalitas\nresidual berdistribusi normal (Sig. > 0.05).\n\n## 2. Uji Multikolinearitas\nTidak ada korelasi kuat antar variabel bebas (VIF < 10, Tolerance > 0.10).\n\n## 3. Uji Heteroskedastisitas\nVarians residual bersifat homoskedastisitas (Uji Glejser / Park > 0.05).\n\n## 4. Uji Autokorelasi\nBebas autokorelasi (uji Durbin-Watson / Run Test)."
  }'::jsonb,
  1,
  true
),
(
  'c13c13c1-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  'flashcard',
  'Flashcard: Konsep Uji Hipotesis Statistika',
  '{}'::jsonb,
  2,
  true
),

-- --- Manajemen Keuangan ---
(
  'c14c14c1-1111-1111-1111-111111111111',
  '44444444-4444-4444-4444-444444444444',
  'resume',
  'Ringkasan Time Value of Money & Valuasi Aset',
  '{
    "sections": [
      {
        "title": "Konsep Dasar TVM",
        "content": "Uang sekarang lebih bernilai daripada nanti karena adanya peluang investasi, inflasi, dan risiko ketidakpastian."
      },
      {
        "title": "Formula Utama",
        "content": "• Future Value: FV = PV × (1 + i)^n\n• Present Value: PV = FV / (1 + i)^n"
      }
    ]
  }'::jsonb,
  1,
  true
),
(
  'c15c15c1-1111-1111-1111-111111111111',
  '44444444-4444-4444-4444-444444444444',
  'brainstorm',
  'Mind Map: Metode Kelayakan Investasi (Capital Budgeting)',
  '{
    "nodes": [
      { "id": "cb-root", "label": "Metode Capital Budgeting", "parent_id": null, "color": "#fdcb6e" },
      { "id": "cb-dcf", "label": "Discounted Cash Flow (DCF)", "parent_id": "cb-root", "color": "#00cec9" },
      { "id": "cb-npv", "label": "Net Present Value (NPV)", "parent_id": "cb-dcf", "color": "#00b894" },
      { "id": "cb-irr", "label": "Internal Rate of Return (IRR)", "parent_id": "cb-dcf", "color": "#00b894" }
    ]
  }'::jsonb,
  2,
  true
),

-- --- Audit & Assurance ---
(
  'c16c16c1-1111-1111-1111-111111111111',
  '55555555-5555-5555-5555-555555555555',
  'notes',
  'Catatan: Prosedur Audit & Bukti Audit',
  '{
    "markdown": "# Prosedur Audit & Bukti Audit\n\n## 1. Prosedur Penilaian Risiko\nDilakukan pada awal perencanaan audit.\n\n## 2. Pengujian Pengendalian (TOC)\nMenguji keandalan pengendalian internal.\n\n## 3. Prosedur Substantif\nMendeteksi salah saji material pada saldo dan transaksi."
  }'::jsonb,
  1,
  true
),
(
  'c17c17c1-1111-1111-1111-111111111111',
  '55555555-5555-5555-5555-555555555555',
  'flashcard',
  'Flashcard: Jenis Opini Audit Laporan Keuangan',
  '{}'::jsonb,
  2,
  true
),

-- --- Metodologi Penelitian ---
(
  'c18c18c1-1111-1111-1111-111111111111',
  '66666666-6666-6666-6666-666666666666',
  'resume',
  'Ringkasan Sistematika Penulisan Bab I - III Skripsi',
  '{
    "sections": [
      {
        "title": "Sistematika Proposal",
        "content": "• BAB I: Latar belakang, rumusan, tujuan.\n• BAB II: Landasan teori, hipotesis.\n• BAB III: Populasi, sampel, teknik analisis data."
      }
    ]
  }'::jsonb,
  1,
  true
),
(
  'c19c19c1-1111-1111-1111-111111111111',
  '66666666-6666-6666-6666-666666666666',
  'reference',
  'Referensi Tools & Jurnal Metodologi Penelitian',
  '{}'::jsonb,
  2,
  true
)
ON CONFLICT (id) DO NOTHING;

-- 3. INSERT FLASHCARDS
INSERT INTO public.flashcards (id, content_item_id, front, back, tags) VALUES
('f1f1f1f1-1111-1111-1111-111111111111', 'c2c2c2c2-1111-1111-1111-111111111111', 'Apa kepanjangan dari NPWP?', 'Nomor Pokok Wajib Pajak — identitas yang diberikan kepada Wajib Pajak untuk sarana administrasi perpajakan.', '{"dasar", "npwp"}'),
('f2f2f2f2-1111-1111-1111-111111111111', 'c2c2c2c2-1111-1111-1111-111111111111', 'Berapa tarif PPh Pasal 17 untuk lapisan pertama (s.d. Rp 60 juta)?', '5% sesuai UU HPP.', '{"pph", "tarif"}'),
('f7f7f7f7-1111-1111-1111-111111111111', 'c9c9c9c9-1111-1111-1111-111111111111', 'Apa itu Murabahah?', 'Akad jual beli dengan keuntungan margin yang disepakati bersama.', '{"akad", "jual-beli"}'),
('f9f9f9f9-1111-1111-1111-111111111111', 'c13c13c1-1111-1111-1111-111111111111', 'Apa perbedaan Hipotesis Nol (H0) dan Hipotesis Alternatif (Ha)?', 'H0: Menyatakan tidak ada pengaruh.\nHa: Menyatakan ada pengaruh.', '{"uji-hipotesis", "statistika"}'),
('f12f12f1-1111-1111-1111-111111111111', 'c17c17c1-1111-1111-1111-111111111111', 'Apa itu Opini Wajar Tanpa Pengecualian (WTP)?', 'Opini bahwa laporan keuangan disajikan secara wajar dalam semua hal material.', '{"opini", "wtp"}')
ON CONFLICT (id) DO NOTHING;

-- 4. INSERT REFERENCES
INSERT INTO public.references (id, content_item_id, url, ref_type, title, description) VALUES
('r1r1r1r1-1111-1111-1111-111111111111', 'c4c4c4c4-1111-1111-1111-111111111111', 'https://pajak.go.id', 'article', 'Portal Resmi DJP', 'Informasi regulasi dan layanan online perpajakan.'),
('r6r6r6r6-1111-1111-1111-111111111111', 'c11c11c1-1111-1111-1111-111111111111', 'https://dsnmui.or.id', 'article', 'DSN-MUI Official Website', 'Dewan Syariah Nasional Majelis Ulama Indonesia.'),
('r8r8r8r8-1111-1111-1111-111111111111', 'c19c19c1-1111-1111-1111-111111111111', 'https://scholar.google.co.id', 'article', 'Google Scholar', 'Mesin pencari literatur ilmiah akademis.')
ON CONFLICT (id) DO NOTHING;
