# FLOWCHART ALUR ADMINISTRASI PAJAK (KUP)
*Visualisasi Langkah-Langkah Menjadi Wajib Pajak Aktif: Dari NPWP s.d Pelaporan SPT*

Diagram di bawah ini digambar menggunakan format **Mermaid.js**. Anda bisa meng-copy teks kode di bawah langsung ke dalam Notion, Obsidian, GitHub, atau merendernya menjadi gambar menggunakan editor online seperti [mermaid.live](https://mermaid.live).

---

## 📊 Kode Mermaid Diagram

```mermaid
graph TD
    %% Styling Nodes
    classDef start_end fill:#6b4f3a,stroke:#a47864,stroke-width:2px,color:#f5ede3;
    classDef process fill:#f5ede3,stroke:#a47864,stroke-width:2px,color:#6b4f3a;
    classDef decision fill:#e8c9a0,stroke:#6b4f3a,stroke-width:2px,color:#6b4f3a;

    Start([Mulai: WP Memenuhi Syarat Subjektif & Objektif]) --> Step1[Pendaftaran NPWP / Aktivasi NIK di e-Registration DJP Online]
    Step1 --> Step2[DJP Menerbitkan Kartu NPWP / NIK Terdaftar sebagai WP Aktif]
    Step2 --> Step3[Wajib Pajak Melakukan Kegiatan Usaha atau Pekerjaan Bebas]
    Step3 --> Step4[Penghitungan Pajak Terutang secara Mandiri - Self Assessment System]
    
    Step4 --> Dec1{Apakah ada Pajak Kurang Bayar?}
    Dec1 -- Ya --> Step5[Membuat Kode Billing di Portal DJP Online]
    Step5 --> Step6[Membayar via Bank Persepsi, Kantor Pos, e-Commerce, atau ATM]
    Step6 --> Step7[Mendapatkan Bukti Penerimaan Negara - BPN]
    Step7 --> Step8[Melaporkan Pajak Terutang di SPT Masa/Tahunan via e-Filing / e-Form]
    
    Dec1 -- Tidak/Nihil --> Step8
    
    Step8 --> Step9[Mendapatkan Bukti Penerimaan Elektronik - BPE]
    Step9 --> End([Selesai: Siklus Pajak Terpenuhi])

    %% Apply Styles
    class Start,End start_end;
    class Step1,Step2,Step3,Step4,Step5,Step6,Step7,Step8,Step9 process;
    class Dec1 decision;
```

---

## 📝 Deskripsi Alur Proses

1.  **Syarat Subjektif & Objektif:** Siklus hidup perpajakan dimulai saat seseorang atau entitas badan memenuhi syarat subjektif (misal: lahir di Indonesia, tinggal lebih dari 183 hari) dan objektif (misal: memiliki penghasilan di atas PTKP).
2.  **Pendaftaran (NPWP):** Pendaftaran dilakukan secara daring di situs resmi DJP. Saat ini, bagi orang pribadi, NIK KTP diaktifkan sebagai NPWP.
3.  **Self Assessment System:** Indonesia menganut sistem di mana Wajib Pajak dipercaya untuk **menghitung sendiri**, **menyetor sendiri**, dan **melaporkan sendiri** pajaknya.
4.  **Penyetoran Pajak:** Jika ada pajak yang harus dibayar (Kurang Bayar), wajib membuat kode billing (15 digit) terlebih dahulu. Pembayaran tanpa kode billing tidak akan diterima sistem bank.
5.  **Bukti Penerimaan Negara (BPN):** Simpan BPN (yang berisi NTPN - Nomor Transaksi Penerimaan Negara) sebagai bukti setoran yang sah.
6.  **Pelaporan (SPT):** Pelaporan wajib dilakukan melalui e-Filing. Batas lapor SPT Tahunan Orang Pribadi adalah 31 Maret tahun berikutnya, sedangkan Badan adalah 30 April tahun berikutnya.
