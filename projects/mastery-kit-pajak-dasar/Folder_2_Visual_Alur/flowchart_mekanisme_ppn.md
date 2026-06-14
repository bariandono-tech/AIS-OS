# FLOWCHART MEKANISME PAJAK PERTAMBAHAN NILAI (PPN)
*Visualisasi Kredit Pajak Masukan vs Pajak Keluaran Bagi Pengusaha Kena Pajak (PKP)*

Mekanisme PPN di Indonesia menggunakan sistem **Faktur Pajak** untuk mencatat Pajak Masukan (saat membeli) dan Pajak Keluaran (saat menjual). Diagram Mermaid.js di bawah ini menunjukkan alur transaksi dan perhitungan PPN di akhir bulan.

---

## 📊 Kode Mermaid Diagram

```mermaid
graph TD
    %% Styling
    classDef supplier fill:#f5ede3,stroke:#6b4f3a,stroke-width:2px,color:#6b4f3a;
    classDef pkp fill:#e8c9a0,stroke:#6b4f3a,stroke-width:2px,color:#6b4f3a;
    classDef customer fill:#f5ede3,stroke:#a47864,stroke-width:1px,color:#6b4f3a;
    classDef state fill:#6b4f3a,stroke:#a47864,stroke-width:2px,color:#f5ede3;

    Supplier[PKP A: Supplier Bahan Baku] -- "Jual Bahan Baku Rp 10.000.000<br>+ PPN 11% (Rp 1.100.000)" --> PKPB[PKP B: Produsen / Wajib Pajak Kita]
    
    PKPB -- "Bayar Total Rp 11.100.000<br>(Mendapatkan Faktur Pajak Masukan)" --> Supplier
    
    PKPB -- "Jual Barang Jadi Rp 20.000.000<br>+ PPN 11% (Rp 2.200.000)" --> Customer[PKP C / Konsumen Akhir]
    
    Customer -- "Bayar Total Rp 22.200.000<br>(Mendapatkan Faktur Pajak Keluaran)" --> PKPB

    subgraph Perhitungan Akhir Bulan di PKP B
        Recon[Rekonsiliasi PPN Masa] --> Formula["PPN Terutang = Pajak Keluaran (PK) - Pajak Masukan (PM)"]
        Formula --> Calc["PPN = Rp 2.200.000 - Rp 1.100.000<br>= Rp 1.100.000"]
        Calc --> Status{Hasil Perhitungan}
        Status -- "PK > PM (Kurang Bayar)" --> Pay[Setor Kurang Bayar ke Negara]
        Status -- "PK < PM (Lebih Bayar)" --> Carry[Kompensasi ke Bulan Depan / Restitusi]
    end

    Pay --> State[(Kas Negara / DJP)]

    %% Styles
    class Supplier customer;
    class PKPB pkp;
    class Customer customer;
    class State state;
    class Recon,Formula,Calc,Pay,Carry process;
```

---

## 📝 Konsep & Terminologi PPN yang Wajib Dipahami

1.  **Pajak Masukan (PM):** PPN yang dipungut oleh PKP lain ketika kita membeli Barang Kena Pajak (BKP) atau Jasa Kena Pajak (JKP). PM ini merupakan **piutang pajak** (aset) bagi kita karena merupakan uang muka pajak yang dapat dikreditkan.
2.  **Pajak Keluaran (PK):** PPN yang kita pungut ketika menyerahkan/menjual BKP atau JKP kepada pelanggan. PK ini merupakan **utang pajak** (kewajiban) bagi kita yang harus disetorkan ke negara.
3.  **Pengkreditan PPN:** Proses mengurangi utang Pajak Keluaran dengan piutang Pajak Masukan yang sah.
4.  **Kondisi Akhir Masa:**
    *   **Kurang Bayar (Net Liability):** Kita memungut pajak dari pembeli lebih banyak daripada pajak yang kita bayar ke supplier. Selisihnya harus disetorkan ke kas negara paling lambat akhir bulan berikutnya (sebelum lapor SPT Masa PPN).
    *   **Lebih Bayar (Net Asset):** Kita membayar pajak ke supplier lebih banyak daripada yang kita pungut dari pembeli (biasanya terjadi saat perusahaan banyak melakukan pembelian aset/stok bahan baku, atau melakukan ekspor dengan tarif PPN 0%). Lebih bayar ini tidak hangus, melainkan dikompensasikan ke masa pajak berikutnya atau diminta kembali (restitusi).
