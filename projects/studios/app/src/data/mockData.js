// Mock data for StudiOS MVP
// This simulates what will come from Supabase later

export const stacks = [
  {
    id: "1",
    slug: "akuntansi-pajak",
    title: "Akuntansi Pajak",
    description:
      "Rangkuman lengkap materi perpajakan: PPh 21, PPN, PPh Badan, Coretax System, dan regulasi terbaru PMK 2024-2025.",
    icon: "📊",
    color: "#00cec9",
    is_published: true,
    content_count: 12,
  },
  {
    id: "2",
    slug: "hukum-syariah",
    title: "Hukum Syariah",
    description:
      "Materi fiqh muamalah, akad-akad syariah, perbankan syariah, dan fatwa DSN-MUI terkini.",
    icon: "⚖️",
    color: "#6c5ce7",
    is_published: true,
    content_count: 8,
  },
  {
    id: "3",
    slug: "statistika-penelitian",
    title: "Statistika Penelitian",
    description:
      "Uji hipotesis, regresi, ANOVA, SPSS tutorial, dan interpretasi hasil penelitian kuantitatif.",
    icon: "📈",
    color: "#fd79a8",
    is_published: true,
    content_count: 10,
  },
  {
    id: "4",
    slug: "manajemen-keuangan",
    title: "Manajemen Keuangan",
    description:
      "Time value of money, capital budgeting, WACC, analisis rasio keuangan, dan valuasi perusahaan.",
    icon: "💰",
    color: "#fdcb6e",
    is_published: true,
    content_count: 9,
  },
  {
    id: "5",
    slug: "audit-dan-assurance",
    title: "Audit & Assurance",
    description:
      "Standar audit, prosedur substantif, sampling audit, laporan auditor, dan etika profesi akuntan.",
    icon: "🔍",
    color: "#00b894",
    is_published: true,
    content_count: 7,
  },
  {
    id: "6",
    slug: "metodologi-penelitian",
    title: "Metodologi Penelitian",
    description:
      "Desain riset, teknik sampling, instrumen penelitian, validitas & reliabilitas, dan penulisan skripsi.",
    icon: "🔬",
    color: "#e17055",
    is_published: true,
    content_count: 11,
  },
];

export const contentItems = [
  // --- Akuntansi Pajak Stack ---
  {
    id: "c1",
    stack_id: "1",
    type: "resume",
    title: "Ringkasan PPh Pasal 21 — Tarif TER Terbaru 2025",
    body: {
      sections: [
        {
          title: "Apa itu PPh 21?",
          content:
            "Pajak Penghasilan Pasal 21 adalah pajak yang dikenakan atas penghasilan yang diterima oleh Wajib Pajak orang pribadi dalam negeri sehubungan dengan pekerjaan, jasa, atau kegiatan. Pemotong PPh 21 meliputi pemberi kerja, bendahara pemerintah, dan penyelenggara kegiatan.",
        },
        {
          title: "Tarif Efektif Rata-rata (TER) — PMK 168/2023",
          content:
            "Mulai Januari 2024, penghitungan PPh 21 menggunakan tarif efektif rata-rata (TER) yang dibagi menjadi dua kategori:\n\n• **TER Bulanan** — untuk masa pajak Januari s.d. November\n• **TER Tahunan** — untuk masa pajak Desember (penghitungan ulang setahun penuh)\n\nTER ditentukan berdasarkan status PTKP (TK/0, K/0, K/1, dst.) dan jumlah penghasilan bruto bulanan.",
        },
        {
          title: "Tabel TER Bulanan Kategori A (TK/0 & TK/1)",
          content:
            "| Penghasilan Bruto Bulanan | TER |\n|---|---|\n| s.d. Rp 5.400.000 | 0% |\n| > Rp 5.400.000 - Rp 5.650.000 | 0,25% |\n| > Rp 5.650.000 - Rp 5.950.000 | 0,50% |\n| > Rp 5.950.000 - Rp 6.300.000 | 0,75% |\n| > Rp 6.300.000 - Rp 6.750.000 | 1,00% |\n| > Rp 6.750.000 - Rp 7.500.000 | 1,25% |\n| ... | ... |\n\n*Sumber: Lampiran PMK 168/2023*",
        },
        {
          title: "Cara Menghitung PPh 21 dengan TER",
          content:
            "**Masa Januari-November:**\nPPh 21 = Penghasilan Bruto × TER Bulanan\n\n**Masa Desember:**\nPPh 21 = PPh 21 Terutang Setahun − Total PPh 21 (Jan-Nov)\n\n**Contoh:**\nBudi (TK/0) gaji bruto Rp 10.000.000/bulan\n• TER Bulanan: 2% (sesuai tabel Kategori A)\n• PPh 21 per bulan (Jan-Nov): Rp 10.000.000 × 2% = Rp 200.000\n• Total PPh 21 (Jan-Nov): Rp 200.000 × 11 = Rp 2.200.000\n• PPh 21 Desember: dihitung ulang dengan tarif Pasal 17 UU PPh",
        },
        {
          title: "Poin Penting untuk Ujian",
          content:
            "1. **TER hanya berlaku untuk pegawai tetap** — untuk pegawai tidak tetap dan bukan pegawai, masih menggunakan mekanisme lama\n2. **PTKP tetap** — besaran PTKP tidak berubah (TK/0 = Rp 54.000.000/tahun)\n3. **Coretax System** — mulai 2025, pelaporan PPh 21 melalui sistem Coretax DJP\n4. **Bukti potong** — form 1721-A1 tetap wajib diterbitkan oleh pemberi kerja",
        },
      ],
    },
    order_index: 1,
  },
  {
    id: "c2",
    stack_id: "1",
    type: "flashcard",
    title: "Flashcard: Dasar-Dasar Perpajakan Indonesia",
    body: null,
    order_index: 2,
  },
  {
    id: "c3",
    stack_id: "1",
    type: "notes",
    title: "Catatan Kuliah: PPN dan PPnBM",
    body: {
      markdown: `# PPN dan PPnBM — Catatan Kuliah

## Definisi PPN
Pajak Pertambahan Nilai (PPN) adalah pajak yang dikenakan atas **penyerahan Barang Kena Pajak (BKP)** dan/atau **Jasa Kena Pajak (JKP)** di dalam daerah pabean.

## Tarif PPN
- **Tarif umum**: 11% (berlaku sejak April 2022)
- **Tarif rencana 2025**: 12% (sesuai UU HPP)
- **Tarif ekspor BKP berwujud & JKP tertentu**: 0%

## Mekanisme Pengkreditan
\`\`\`
PPN yang harus disetor = Pajak Keluaran - Pajak Masukan
\`\`\`

### Pajak Keluaran (PK)
PPN yang dipungut saat **menjual/menyerahkan** BKP/JKP

### Pajak Masukan (PM)
PPN yang dibayar saat **membeli/memperoleh** BKP/JKP

## Faktur Pajak
- Wajib dibuat oleh PKP (Pengusaha Kena Pajak)
- Format: **e-Faktur** (elektronik)
- Kode transaksi: 01, 02, 03, 04, 05, 06, 07, 08, 09

## PPnBM (Pajak Penjualan Barang Mewah)
- Hanya dikenakan **satu kali** pada saat impor atau penyerahan oleh pabrikan
- Tarif: 10% - 200% (tergantung jenis barang)
- Contoh: kendaraan bermotor mewah, hunian mewah > Rp 30 miliar

## Poin Penting
1. PPN bersifat **tidak langsung** — beban ditanggung konsumen akhir
2. PPN bersifat **netral** — tidak dipengaruhi rantai distribusi
3. **Faktur Pajak cacat** = tidak bisa dikreditkan sebagai Pajak Masukan

> 💡 **Tips ujian**: Fokus pada mekanisme pengkreditan PK-PM dan kode faktur pajak!
`,
    },
    order_index: 3,
  },
  {
    id: "c4",
    stack_id: "1",
    type: "reference",
    title: "Referensi & Link Penting Perpajakan",
    body: null,
    order_index: 4,
  },
  {
    id: "c5",
    stack_id: "1",
    type: "resume",
    title: "Rangkuman Coretax System — Sistem Baru DJP 2025",
    body: {
      sections: [
        {
          title: "Apa itu Coretax?",
          content:
            "Coretax Administration System (CTAS) adalah sistem inti administrasi perpajakan baru yang diluncurkan DJP pada 1 Januari 2025. Sistem ini menggantikan berbagai aplikasi lama (e-SPT, e-Filing, e-Faktur lama) menjadi satu platform terintegrasi.",
        },
        {
          title: "Fitur Utama",
          content:
            "• **Portal Wajib Pajak** — satu pintu untuk semua layanan perpajakan\n• **e-Faktur baru** — terintegrasi langsung dalam Coretax\n• **Taxpayer Account** — dashboard lengkap riwayat perpajakan\n• **Prepopulated SPT** — data sudah terisi otomatis dari bukti potong\n• **e-BuPot** — bukti potong elektronik terintegrasi",
        },
        {
          title: "Yang Berubah untuk Mahasiswa/Praktisi",
          content:
            "1. Semua pelaporan SPT kini melalui portal Coretax (bukan DJP Online lama)\n2. NPWP 15 digit akan digantikan NIK (16 digit) secara bertahap\n3. Faktur Pajak menggunakan format baru\n4. Proses restitusi PPN lebih cepat dengan validasi otomatis",
        },
      ],
    },
    order_index: 5,
  },
  {
    id: "c6",
    stack_id: "1",
    type: "brainstorm",
    title: "Mind Map: Jenis-Jenis Pajak di Indonesia",
    body: {
      nodes: [
        { id: "root", label: "Pajak Indonesia", parent_id: null, color: "#6c5ce7" },
        { id: "pusat", label: "Pajak Pusat", parent_id: "root", color: "#00cec9" },
        { id: "daerah", label: "Pajak Daerah", parent_id: "root", color: "#fd79a8" },
        { id: "pph", label: "PPh", parent_id: "pusat", color: "#00cec9" },
        { id: "ppn", label: "PPN", parent_id: "pusat", color: "#00cec9" },
        { id: "ppnbm", label: "PPnBM", parent_id: "pusat", color: "#00cec9" },
        { id: "bm", label: "Bea Materai", parent_id: "pusat", color: "#00cec9" },
        { id: "pbb", label: "PBB-P2", parent_id: "daerah", color: "#fd79a8" },
        { id: "bphtb", label: "BPHTB", parent_id: "daerah", color: "#fd79a8" },
        { id: "pkb", label: "PKB", parent_id: "daerah", color: "#fd79a8" },
        { id: "pajak-restoran", label: "Pajak Restoran", parent_id: "daerah", color: "#fd79a8" },
        { id: "pph21", label: "PPh 21", parent_id: "pph", color: "#fdcb6e" },
        { id: "pph22", label: "PPh 22", parent_id: "pph", color: "#fdcb6e" },
        { id: "pph23", label: "PPh 23", parent_id: "pph", color: "#fdcb6e" },
        { id: "pph25", label: "PPh 25", parent_id: "pph", color: "#fdcb6e" },
        { id: "pphfinal", label: "PPh Final", parent_id: "pph", color: "#fdcb6e" },
      ],
    },
    order_index: 6,
  },
  {
    id: "c7",
    stack_id: "1",
    type: "notes",
    title: "Catatan: PPh Badan dan Tarif Pasal 17",
    body: {
      markdown: `# PPh Badan — Tarif dan Penghitungan

## Tarif PPh Badan 2024-2025
- **Tarif umum**: 22%
- **Tarif UMKM** (PP 55/2022): 0,5% dari omzet (untuk omzet ≤ Rp 4,8 miliar/tahun)
- **Tarif khusus Go Public**: diskon 3% → 19% (untuk perusahaan yang listing di BEI dan memenuhi syarat kepemilikan publik ≥ 40%)

## Penghitungan PPh Badan
\`\`\`
Penghasilan Bruto
- Biaya untuk mendapatkan, menagih, dan memelihara penghasilan
= Penghasilan Neto
- Kompensasi Kerugian
= Penghasilan Kena Pajak (PKP)
× Tarif PPh Badan (22%)
= PPh Badan Terutang
- Kredit Pajak (PPh 22, PPh 23, PPh 24, PPh 25)
= PPh Badan Kurang/Lebih Bayar
\`\`\`

## Biaya yang BOLEH Dikurangkan (Deductible)
1. Biaya gaji dan tunjangan karyawan
2. Biaya sewa kantor dan utilitas
3. Biaya penyusutan aset tetap
4. Biaya bunga pinjaman
5. Biaya riset dan pengembangan
6. Sumbangan bencana nasional (sesuai PP)

## Biaya yang TIDAK BOLEH Dikurangkan (Non-Deductible)
1. Pembagian dividen
2. Biaya pribadi pemegang saham
3. Sanksi perpajakan (bunga, denda, kenaikan)
4. Sumbangan (kecuali yang diatur PP)
5. Natura dan kenikmatan (sebelum UU HPP)

> ⚠️ **Perubahan UU HPP**: Sejak 2022, natura dan kenikmatan **bisa** menjadi biaya bagi pemberi kerja DAN penghasilan bagi penerima (kecuali yang dikecualikan).
`,
    },
    order_index: 7,
  },

  // --- Hukum Syariah Stack ---
  {
    id: "c8",
    stack_id: "2",
    type: "resume",
    title: "Ringkasan Akad-Akad dalam Perbankan Syariah",
    body: {
      sections: [
        {
          title: "Pengertian Akad",
          content:
            "Akad dalam fiqh muamalah adalah perikatan/perjanjian antara dua pihak atau lebih yang menimbulkan hak dan kewajiban. Rukun akad: al-aqidain (para pihak), mahallul aqd (objek), maudhu'ul aqd (tujuan), sighat (ijab-qabul).",
        },
        {
          title: "Akad Jual Beli (Tijarah)",
          content:
            "• **Murabahah** — jual beli dengan margin keuntungan yang disepakati. Bank membeli barang lalu menjual ke nasabah dengan harga pokok + margin.\n• **Salam** — jual beli dengan pembayaran di muka dan penyerahan barang di kemudian hari. Cocok untuk produk pertanian.\n• **Istishna'** — jual beli pesanan/manufacturing. Pembayaran bisa bertahap sesuai progress pembuatan barang.",
        },
        {
          title: "Akad Bagi Hasil (Syirkah)",
          content:
            "• **Mudharabah** — kerjasama antara pemilik modal (shahibul maal) dan pengelola (mudharib). Keuntungan dibagi sesuai nisbah, kerugian ditanggung pemilik modal.\n• **Musyarakah** — kerjasama di mana semua pihak menyertakan modal. Keuntungan dan kerugian dibagi proporsional.",
        },
      ],
    },
    order_index: 1,
  },
  {
    id: "c9",
    stack_id: "2",
    type: "flashcard",
    title: "Flashcard: Istilah-Istilah Fiqh Muamalah",
    body: null,
    order_index: 2,
  },
  {
    id: "c10",
    stack_id: "2",
    type: "brainstorm",
    title: "Mind Map: Pembagian Riba dalam Fiqh Muamalah",
    body: {
      nodes: [
        { id: "riba-root", label: "Riba (Bunga/Kelebihan)", parent_id: null, color: "#6c5ce7" },
        { id: "riba-duyun", label: "Riba Duyun (Utang)", parent_id: "riba-root", color: "#e17055" },
        { id: "riba-buyu", label: "Riba Buyu' (Jual Beli)", parent_id: "riba-root", color: "#00b894" },
        { id: "riba-qardh", label: "Riba Qardh (Manfaat tambahan utang)", parent_id: "riba-duyun", color: "#fdcb6e" },
        { id: "riba-jahiliyah", label: "Riba Jahiliyah (Denda keterlambatan)", parent_id: "riba-duyun", color: "#fdcb6e" },
        { id: "riba-fadhl", label: "Riba Fadhl (Kelebihan takaran barang ribawi)", parent_id: "riba-buyu", color: "#fd79a8" },
        { id: "riba-nasiah", label: "Riba Nasi'ah (Penundaan penyerahan barang ribawi)", parent_id: "riba-buyu", color: "#fd79a8" },
      ],
    },
    order_index: 3,
  },
  {
    id: "c11",
    stack_id: "2",
    type: "reference",
    title: "Referensi Kajian & Fatwa Keuangan Syariah",
    body: null,
    order_index: 4,
  },

  // --- Statistika Penelitian Stack ---
  {
    id: "c12",
    stack_id: "3",
    type: "notes",
    title: "Catatan: Uji Asumsi Klasik Regresi OLS",
    body: {
      markdown: `# Uji Asumsi Klasik — Regresi OLS

Uji asumsi klasik adalah prasyarat statistik untuk analisis regresi linear berganda Ordinary Least Squares (OLS) agar estimator bersifat BLUE (Best Linear Unbiased Estimator).

## 1. Uji Normalitas
Menguji apakah residual berdistribusi normal.
- **Uji**: Kolmogorov-Smirnov atau Shapiro-Wilk.
- **Aturan**: Sig. > 0.05 artinya data residual berdistribusi normal.

## 2. Uji Multikolinearitas
Menguji apakah ada korelasi kuat antar variabel independen.
- **Indikator**: Tolerance & VIF (Variance Inflation Factor).
- **Aturan**: VIF < 10 dan Tolerance > 0.10.

## 3. Uji Heteroskedastisitas
Menguji ketidaksamaan varians residual antar pengamatan.
- **Uji**: Uji Glejser, Uji Park, atau uji grafik Scatterplot.
- **Aturan**: Sig. > 0.05 artinya bebas heteroskedastisitas.

## 4. Uji Autokorelasi
Menguji korelasi residual periode t dengan t-1. Umumnya pada data data deret waktu (*time series*).
- **Uji**: Durbin-Watson (DW) atau Run Test.
- **Aturan**: Bebas autokorelasi jika nilai DW berada di antara du dan 4-du.
`,
    },
    order_index: 1,
  },
  {
    id: "c13",
    stack_id: "3",
    type: "flashcard",
    title: "Flashcard: Konsep Uji Hipotesis Statistika",
    body: null,
    order_index: 2,
  },

  // --- Manajemen Keuangan Stack ---
  {
    id: "c14",
    stack_id: "4",
    type: "resume",
    title: "Ringkasan Time Value of Money & Valuasi Aset",
    body: {
      sections: [
        {
          title: "Konsep Dasar Nilai Waktu Uang",
          content: "Nilai waktu uang (Time Value of Money) berasumsi bahwa nilai nominal uang saat ini lebih berharga dibanding masa depan karena adanya potensi bunga (earning power), risiko inflasi, dan preferensi konsumsi saat ini.",
        },
        {
          title: "Rumus Bunga Majemuk (Compound Interest)",
          content: "• **Future Value (FV)**:\n  FV = PV × (1 + i)^n\n\n• **Present Value (PV)**:\n  PV = FV / (1 + i)^n\n\nKeterangan:\n- FV = Nilai masa depan\n- PV = Nilai sekarang\n- i = Tingkat suku bunga per periode\n- n = Jumlah periode pembungaan",
        },
      ],
    },
    order_index: 1,
  },
  {
    id: "c15",
    stack_id: "4",
    type: "brainstorm",
    title: "Mind Map: Metode Kelayakan Investasi (Capital Budgeting)",
    body: {
      nodes: [
        { id: "cb-root", label: "Metode Capital Budgeting", parent_id: null, color: "#fdcb6e" },
        { id: "cb-dcf", label: "Discounted Cash Flow (DCF)", parent_id: "cb-root", color: "#00cec9" },
        { id: "cb-ndcf", label: "Non-Discounted Cash Flow", parent_id: "cb-root", color: "#fd79a8" },
        { id: "cb-npv", label: "Net Present Value (NPV)", parent_id: "cb-dcf", color: "#00b894" },
        { id: "cb-irr", label: "Internal Rate of Return (IRR)", parent_id: "cb-dcf", color: "#00b894" },
        { id: "cb-pi", label: "Profitability Index (PI)", parent_id: "cb-dcf", color: "#00b894" },
        { id: "cb-pb", label: "Payback Period", parent_id: "cb-ndcf", color: "#fd79a8" },
        { id: "cb-arr", label: "Accounting Rate of Return (ARR)", parent_id: "cb-ndcf", color: "#fd79a8" },
      ],
    },
    order_index: 2,
  },

  // --- Audit & Assurance Stack ---
  {
    id: "c16",
    stack_id: "5",
    type: "notes",
    title: "Catatan: Prosedur Audit & Bukti Audit",
    body: {
      markdown: `# Prosedur Audit & Bukti Audit

Prosedur audit adalah tindakan konkret yang dilakukan auditor untuk mendapatkan bukti audit guna menarik kesimpulan opini.

## 1. Prosedur Penilaian Risiko
Dilakukan pada awal audit untuk memahami entitas dan mendeteksi risiko salah saji material.

## 2. Pengujian Pengendalian (Test of Controls / TOC)
Menguji efektivitas operasional pengendalian internal klien dalam mencegah atau mendeteksi salah saji material.

## 3. Prosedur Substantif
Dirancang untuk mendeteksi salah saji material pada tingkat asersi. Terdiri dari:
- **Prosedur Analitis Substantif**: Membandingkan data keuangan dan non-keuangan.
- **Pengujian Rincian (Test of Details)**: Pengujian saldo akun (misal: konfirmasi bank, stok opname).

> 💡 **Asersi Manajemen Penting**: Keberadaan (Existence), Kelengkapan (Completeness), Hak & Kewajiban (Rights & Obligations), Penilaian/Alokasi (Valuation), Penyajian/Pengungkapan (Presentation).
`,
    },
    order_index: 1,
  },
  {
    id: "c17",
    stack_id: "5",
    type: "flashcard",
    title: "Flashcard: Jenis Opini Audit Laporan Keuangan",
    body: null,
    order_index: 2,
  },

  // --- Metodologi Penelitian Stack ---
  {
    id: "c18",
    stack_id: "6",
    type: "resume",
    title: "Ringkasan Sistematika Penulisan Bab I - III Skripsi",
    body: {
      sections: [
        {
          title: "Sistematika Proposal Penelitian",
          content: "Secara umum, proposal skripsi/tesis terdiri dari tiga bab awal:\n\n• **BAB I: Pendahuluan** — Latar Belakang Masalah (gap penelitian/fenomena), Rumusan Masalah, Tujuan Penelitian, dan Manfaat Penelitian.\n• **BAB II: Tinjauan Pustaka** — Telaah Teori (Grand Theory, e.g. Agency Theory), Kajian Literatur, Hubungan Antar Variabel & Kerangka Berpikir, dan Pengembangan Hipotesis.\n• **BAB III: Metode Penelitian** — Desain Riset, Populasi & Sampel, Definisi Operasional & Pengukuran Variabel, Metode Pengumpulan Data, dan Teknik Analisis Data.",
        },
      ],
    },
    order_index: 1,
  },
  {
    id: "c19",
    stack_id: "6",
    type: "reference",
    title: "Referensi Tools & Jurnal Metodologi Penelitian",
    body: null,
    order_index: 2,
  },
];

export const flashcards = [
  // Flashcards for c2 (Dasar-Dasar Perpajakan)
  {
    id: "f1",
    content_item_id: "c2",
    front: "Apa kepanjangan dari NPWP?",
    back: "Nomor Pokok Wajib Pajak — identitas yang diberikan kepada Wajib Pajak untuk sarana administrasi perpajakan.",
    tags: ["dasar", "npwp"],
  },
  {
    id: "f2",
    content_item_id: "c2",
    front: "Berapa tarif PPh Pasal 17 untuk lapisan penghasilan pertama (s.d. Rp 60 juta)?",
    back: "5% — berlaku untuk Penghasilan Kena Pajak sampai dengan Rp 60.000.000 per tahun (sesuai UU HPP).",
    tags: ["pph", "tarif"],
  },
  {
    id: "f3",
    content_item_id: "c2",
    front: "Apa perbedaan Pajak Langsung dan Pajak Tidak Langsung?",
    back: "Pajak Langsung: tidak bisa dibebankan ke pihak lain (contoh: PPh).\nPajak Tidak Langsung: bisa dibebankan ke pihak lain / konsumen akhir (contoh: PPN).",
    tags: ["dasar", "klasifikasi"],
  },
  {
    id: "f4",
    content_item_id: "c2",
    front: "Apa itu PTKP dan berapa besarannya untuk TK/0?",
    back: "Penghasilan Tidak Kena Pajak — batas penghasilan yang tidak dikenai PPh.\nTK/0 (Tidak Kawin, tanpa tanggungan) = Rp 54.000.000 per tahun.",
    tags: ["ptkp", "pph21"],
  },
  {
    id: "f5",
    content_item_id: "c2",
    front: "Sebutkan 5 lapisan tarif PPh Pasal 17 UU HPP!",
    back: "1. s.d. Rp 60 juta → 5%\n2. > Rp 60 juta - Rp 250 juta → 15%\n3. > Rp 250 juta - Rp 500 juta → 25%\n4. > Rp 500 juta - Rp 5 miliar → 30%\n5. > Rp 5 miliar → 35%",
    tags: ["pph", "tarif"],
  },
  {
    id: "f6",
    content_item_id: "c2",
    front: "Apa itu Self Assessment System?",
    back: "Sistem pemungutan pajak di mana Wajib Pajak diberi kepercayaan untuk menghitung, memperhitungkan, menyetor, dan melaporkan sendiri pajak yang terutang. Indonesia menganut sistem ini.",
    tags: ["dasar", "sistem"],
  },

  // Flashcards for c9 (Fiqh Muamalah)
  {
    id: "f7",
    content_item_id: "c9",
    front: "Apa itu Murabahah?",
    back: "Akad jual beli di mana penjual menyatakan harga perolehan dan margin keuntungan yang disepakati. Bank membeli barang, lalu menjual ke nasabah dengan harga pokok + margin.",
    tags: ["akad", "jual-beli"],
  },
  {
    id: "f8",
    content_item_id: "c9",
    front: "Apa perbedaan Mudharabah dan Musyarakah?",
    back: "Mudharabah: modal 100% dari shahibul maal, pengelolaan oleh mudharib.\nMusyarakah: modal dari semua pihak, pengelolaan bersama. Keuntungan & kerugian ditanggung proporsional.",
    tags: ["akad", "bagi-hasil"],
  },

  // Flashcards for c13 (Konsep Uji Hipotesis Statistika)
  {
    id: "f9",
    content_item_id: "c13",
    front: "Apa perbedaan Hipotesis Nol (H0) dan Hipotesis Alternatif (Ha)?",
    back: "H0: Menyatakan tidak ada pengaruh atau hubungan antara variabel.\nHa: Menyatakan ada pengaruh atau hubungan antara variabel.",
    tags: ["uji-hipotesis", "statistika"],
  },
  {
    id: "f10",
    content_item_id: "c13",
    front: "Apa arti tingkat signifikansi alpha (α) = 0.05?",
    back: "Menyatakan toleransi kesalahan tipe I sebesar 5% (peluang menolak hipotesis nol padahal benar).",
    tags: ["signifikansi", "alpha"],
  },
  {
    id: "f11",
    content_item_id: "c13",
    front: "Kapan menggunakan Uji T (T-Test) dan Uji F (F-Test)?",
    back: "Uji T: Pengujian hipotesis secara parsial (individu variabel).\nUji F: Pengujian hipotesis secara simultan (bersama-sama).",
    tags: ["uji-t", "uji-f"],
  },

  // Flashcards for c17 (Jenis Opini Audit)
  {
    id: "f12",
    content_item_id: "c17",
    front: "Apa itu Opini Wajar Tanpa Pengecualian (Unqualified Opinion)?",
    back: "Opini yang diberikan jika laporan keuangan disajikan secara wajar dalam semua hal material dan sesuai SAK.",
    tags: ["opini", "wtp"],
  },
  {
    id: "f13",
    content_item_id: "c17",
    front: "Apa perbedaan Opini Tidak Wajar (Adverse) dan Disclaimer (Tidak Memberikan Pendapat)?",
    back: "Tidak Wajar (Adverse): Salah saji material dan bersifat pervasive (menyebar).\nDisclaimer: Auditor tidak dapat memperoleh bukti yang cukup karena pembatasan ruang lingkup.",
    tags: ["opini", "adverse", "disclaimer"],
  },
];

export const references = [
  {
    id: "r1",
    content_item_id: "c4",
    url: "https://pajak.go.id",
    ref_type: "article",
    title: "Portal Resmi DJP",
    description: "Website resmi Direktorat Jenderal Pajak — informasi regulasi, formulir, dan layanan online.",
  },
  {
    id: "r2",
    content_item_id: "c4",
    url: "https://coretaxdjp.pajak.go.id",
    ref_type: "article",
    title: "Coretax DJP Portal",
    description: "Portal sistem administrasi perpajakan baru — untuk pelaporan SPT dan manajemen pajak.",
  },
  {
    id: "r3",
    content_item_id: "c4",
    url: "https://jdih.kemenkeu.go.id",
    ref_type: "paper",
    title: "JDIH Kemenkeu",
    description: "Jaringan Dokumentasi dan Informasi Hukum — cari PMK, PP, dan UU terkait perpajakan.",
  },
  {
    id: "r4",
    content_item_id: "c4",
    url: "https://www.youtube.com/watch?v=example",
    ref_type: "video",
    title: "Tutorial Pengisian SPT Tahunan OP",
    description: "Video panduan step-by-step pengisian SPT 1770S melalui Coretax System.",
  },
  {
    id: "r5",
    content_item_id: "c4",
    url: "https://ortax.org",
    ref_type: "article",
    title: "Ortax — Komunitas Perpajakan",
    description: "Forum dan database peraturan perpajakan terlengkap di Indonesia.",
  },

  // References for c11 (Keuangan Syariah)
  {
    id: "r6",
    content_item_id: "c11",
    url: "https://dsnmui.or.id",
    ref_type: "article",
    title: "DSN-MUI Official Website",
    description: "Website Dewan Syariah Nasional Majelis Ulama Indonesia — basis data Fatwa Keuangan Syariah terlengkap.",
  },
  {
    id: "r7",
    content_item_id: "c11",
    url: "https://www.ojk.go.id/id/kanal/syariah/default.aspx",
    ref_type: "article",
    title: "Kanal Syariah OJK",
    description: "Portal regulasi dan data statistik perbankan & IKNB Syariah dari Otoritas Jasa Keuangan.",
  },

  // References for c19 (Metodologi Penelitian)
  {
    id: "r8",
    content_item_id: "c19",
    url: "https://scholar.google.co.id",
    ref_type: "article",
    title: "Google Scholar",
    description: "Mesin pencari literatur ilmiah publikasi jurnal, tesis, buku, abstrak, dan artikel hukum.",
  },
  {
    id: "r9",
    content_item_id: "c19",
    url: "https://www.mendeley.com",
    ref_type: "article",
    title: "Mendeley Reference Manager",
    description: "Alat bantu manajemen referensi gratis dan jejaring sosial akademis untuk mengelola riset skripsi.",
  },
];

// Helper function to get content items for a stack
export function getContentByStack(stackSlug) {
  const stack = stacks.find((s) => s.slug === stackSlug);
  if (!stack) return [];
  return contentItems.filter((item) => item.stack_id === stack.id);
}

// Helper function to get flashcards for a content item
export function getFlashcardsByContentId(contentId) {
  return flashcards.filter((f) => f.content_item_id === contentId);
}

// Helper function to get references for a content item
export function getReferencesByContentId(contentId) {
  return references.filter((r) => r.content_item_id === contentId);
}

// Content type labels and icons
export const contentTypeConfig = {
  brainstorm: { label: "Brainstorm", icon: "🧠", color: "var(--color-brainstorm)" },
  resume: { label: "Resume", icon: "📝", color: "var(--color-resume)" },
  notes: { label: "Notes", icon: "📒", color: "var(--color-notes)" },
  ebook: { label: "Ebook", icon: "📖", color: "var(--color-ebook)" },
  flashcard: { label: "Flashcard", icon: "🃏", color: "var(--color-flashcard)" },
  reference: { label: "Referensi", icon: "🔗", color: "var(--color-reference)" },
};
