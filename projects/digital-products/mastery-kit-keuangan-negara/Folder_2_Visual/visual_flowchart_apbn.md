# 📊 FOLDER 2: VISUAL FLOWCHART ALUR PELAKSANAAN APBN
## Bedah PP 50/2018 & PMK 62/2023 (Koleksi Diagram untuk Skripsi & Tugas)

> **Cara Penggunaan:** Kumpulan diagram di bawah ini ditulis menggunakan format **Mermaid.js**. Anda bisa meng-copy kode diagram di bawah ini langsung ke Notion, GitHub, atau situs [Mermaid Live Editor](https://mermaid.live) untuk mendownloadnya secara gratis dalam format **PNG, SVG, atau PDF** berkualitas tinggi untuk ditempel di Bab II/III skripsi Anda.

---

## 📌 Diagram 1: Alur Makro Pelaksanaan Anggaran Belanja Negara
*Menjelaskan siklus makro pelaksanaan anggaran di tingkat Satker dari terbitnya DIPA sampai audit.*

```mermaid
graph TD
    A[1. Pengesahan DIPA] --> B[2. Pembuatan Komitmen / Kontrak]
    B --> C[3. Penyerahan Barang/Jasa & Kuitansi]
    C --> D[4. Pengujian Tagihan oleh PPK]
    D --> E[5. Penerbitan SPM oleh PPSPM]
    E --> F[6. Penerbitan SP2D oleh KPPN]
    F --> G[7. Transfer Dana ke Rekening Rekanan/Bendahara]
    G --> H[8. Pertanggungjawaban & Pelaporan SAKTI]
    H --> I[9. Audit Laporan Keuangan oleh BPK]

    style A fill:#4F46E5,stroke:#312E81,stroke-width:2px,color:#FFF
    style E fill:#0EA5E9,stroke:#0369A1,stroke-width:2px,color:#FFF
    style F fill:#10B981,stroke:#047857,stroke-width:2px,color:#FFF
    style I fill:#EF4444,stroke:#B91C1C,stroke-width:2px,color:#FFF
```

---

## 📌 Diagram 2: Alur Penerbitan SPP - SPM - SP2D (Sistem Pengeluaran Kas Negara)
*Menjelaskan proses verifikasi formal dan material dari penagihan sampai pencairan dana.*

```mermaid
sequenceDiagram
    autonumber
    actor Rekanan as Penyedia / Rekanan
    actor PPK as Pejabat Pembuat Komitmen
    actor PPSPM as Pejabat Penandatangan SPM
    actor KPPN as Kantor Pelayanan Perbendaharaan Negara
    actor Bank as Bank Operasional Penyalur

    Rekanan->>PPK: Menyerahkan BAST & Tagihan Fisik/Elektronik
    Note over PPK: Melakukan Pengujian Material & Kebenaran Hak Tagih
    PPK->>PPSPM: Menerbitkan SPP (Surat Permintaan Pembayaran) + ADK SAKTI
    Note over PPSPM: Melakukan Pengujian Formal & Kesesuaian Pagu DIPA
    PPSPM->>KPPN: Menerbitkan SPM (Surat Perintah Membayar) via SAKTI (TTE)
    Note over KPPN: Melakukan Pengujian Formal SPM & Uji Ketersediaan Kas Negara
    KPPN->>Bank: Menerbitkan SP2D (Surat Perintah Pencairan Dana)
    Bank->>Rekanan: Transfer Dana ke Rekening Rekanan (Real-time)
```

---

## 📌 Diagram 3: Alur Fleksibilitas Revisi Anggaran (Berdasarkan PMK 62/2023)
*Menunjukkan delegasi wewenang baru yang memotong birokrasi pengurusan revisi pagu.*

```mermaid
graph TD
    Start[Usulan Revisi Anggaran Satker] --> UjiPagu{Apakah revisi mengubah total Pagu Pagu DIPA?}
    
    UjiPagu -- Ya --> DJA[Wewenang DJA / Kementerian Keuangan]
    UjiPagu -- Tidak --> UjiOutput{Apakah revisi mengubah volume Target Output Prioritas?}
    
    UjiOutput -- Ya --> Eselon1[Wewenang Unit Eselon I K/L]
    UjiOutput -- Tidak --> KPA[Wewenang Mandiri Kuasa Pengguna Anggaran - KPA Satker]
    
    DJA --> SAKTI[Update Database SAKTI & DIPA Baru]
    Eselon1 --> SAKTI
    KPA --> SAKTI

    style DJA fill:#F59E0B,stroke:#D97706,stroke-width:2px,color:#FFF
    style Eselon1 fill:#8B5CF6,stroke:#7C3AED,stroke-width:2px,color:#FFF
    style KPA fill:#10B981,stroke:#047857,stroke-width:2px,color:#FFF
    style SAKTI fill:#4F46E5,stroke:#312E81,stroke-width:2px,color:#FFF
```

---

## 💡 Kunci Penjelasan untuk Ujian/Bab Skripsi:
1.  **Pengujian Material (Oleh PPK):** Menguji apakah barang benar-benar dikirim sesuai spesifikasi kontrak, harga wajar, dan dokumen kuitansi sah. Bertanggung jawab mutlak atas kerugian negara jika ada kesalahan bayar.
2.  **Pengujian Formal (Oleh PPSPM & KPPN):** Menguji kelengkapan administrasi, tidak melampaui pagu anggaran, kesesuaian tanda tangan pejabat, dan keabsahan dokumen elektronik.
3.  **IKPA (Indikator Kinerja Pelaksanaan Anggaran):** Flowchart 2 sangat mempengaruhi nilai IKPA satker pada aspek **Ketepatan Waktu Penyampaian SPM** (maksimal 5 hari kerja setelah SPP diterbitkan).
