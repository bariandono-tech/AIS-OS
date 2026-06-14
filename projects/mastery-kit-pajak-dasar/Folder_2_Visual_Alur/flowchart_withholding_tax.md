# FLOWCHART MEKANISME WITHHOLDING TAX SYSTEM
*Visualisasi Alur Kerja Pemotongan & Pemungutan Pajak oleh Pihak Ketiga (PPh 21, 22, 23, 4(2))*

Diagram Mermaid.js di bawah ini menggambarkan interaksi tiga arah antara **Wajib Pajak (WP) Penerima Penghasilan**, **Pemotong/Pemungut Pajak (Pemberi Kerja/Perusahaan/Bendahara)**, dan **Negara (Kas Negara/DJP)**.

---

## 📊 Kode Mermaid Diagram

```mermaid
sequenceDiagram
    autonumber
    actor WP as Wajib Pajak (Penerima Penghasilan)
    actor Agen as Pemotong Pajak (Perusahaan / Bendahara)
    actor Negara as Kas Negara / DJP

    WP->>Agen: Memberikan Jasa / Pekerjaan / Barang
    Note over Agen: Menghitung Pajak Terutang (misal PPh 21/23)<br>dari Nilai Bruto Transaksi
    
    Agen->>WP: Membayar Penghasilan Netto (Nilai Bruto - Potongan Pajak)
    Agen->>WP: Memberikan Bukti Pemotongan Pajak (Bupot)
    
    Note over Agen: Membuat Kode Billing penyetoran atas nama Perusahaan
    Agen->>Negara: Menyetorkan Uang Pajak yang Dipotong ke Kas Negara (Maks tgl 10 bulan berikutnya)
    Negara-->>Agen: Menerbitkan Bukti Penerimaan Negara (BPN)
    
    Agen->>Negara: Melaporkan SPT Masa PPh atas pemotongan tersebut (Maks tgl 20 bulan berikutnya)
    
    Note over WP: Mengumpulkan Bukti Pemotongan (Bupot) sepanjang tahun
    WP->>Negara: Menggunakan Bupot sebagai Kredit Pajak (Pengurang Pajak) di SPT Tahunan
```

---

## 📝 Penjelasan Penting Mekanisme Withholding Tax

1.  **Definisi Withholding Tax:** Sistem pemungutan pajak di mana pihak ketiga (biasanya pemberi kerja atau pembeli jasa) diberikan wewenang dan kewajiban oleh undang-undang untuk memotong sebagian penghasilan yang dibayarkan kepada penerima penghasilan.
2.  **Penghasilan Netto:** Wajib Pajak (karyawan/rekanan jasa) menerima pembayaran dalam jumlah bersih yang sudah dikurangi potongan pajak.
3.  **Bukti Pemotongan (Bupot):** Bupot adalah dokumen sangat penting. Dokumen ini membuktikan bahwa pajak Anda telah dipotong dan disetorkan ke negara oleh pihak pemotong. **Jangan sampai hilang!**
4.  **Kredit Pajak:** Pada akhir tahun pajak, saat wajib pajak menghitung PPh tahunan mereka secara mandiri, seluruh Bukti Pemotongan yang dikumpulkan dari pihak ketiga ini berfungsi sebagai **Uang Muka Pajak (kredit pajak)** yang akan mengurangi total PPh terutang akhir tahun. 
    *   Jika PPh Terutang Akhir Tahun > Kredit Pajak $\rightarrow$ **Kurang Bayar (PPh Pasal 29)**.
    *   Jika PPh Terutang Akhir Tahun < Kredit Pajak $\rightarrow$ **Lebih Bayar (PPh Pasal 28A)**.
