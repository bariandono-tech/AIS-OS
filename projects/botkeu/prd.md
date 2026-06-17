# PRD: botkeu (Telegram Finance Bot) — v1.0
> **Status:** 🟢 APPROVED (Phase 2: ARCHITECT)  
> **Target Platform:** Localhost (Dev) / Cloud (Prod)  
> **LLM Provider:** Google Gemini API (`gemini-2.5-flash`)  

---

## 🎯 1. Visi & Tujuan Produk

**botkeu** adalah asisten keuangan pintar berbasis **Telegram Bot** yang bertindak sebagai gerbang penghubung (*Broker*) antara pengelola keuangan kantor dengan pangkalan data keuangan. 

Staf keuangan dapat mengajukan pertanyaan operasional sehari-hari menggunakan bahasa alami lewat Telegram. Bot akan secara cerdas mencari berkas regulasi lokal di PC (RAG lokal) serta berkas Excel di Google Drive secara harian untuk merumuskan jawaban yang akurat.

---

## 👥 2. Target Pengguna & Masalah
*   **Siapa:** Pengelola Keuangan, Pejabat Pembuat Komitmen (PPK), dan Staf Perbendaharaan Kantor.
*   **Masalah:** 
    *   Staf tidak memahami cara menggunakan Git, VS Code, atau UI developer lainnya untuk mengakses data.
    *   Catatan regulasi (SOP) tersimpan secara lokal di PC, sementara berkas dinamis (Excel realisasi/pagu) diunggah di Google Drive secara terpisah.
    *   Staf butuh cara instan lewat handphone/PC via Telegram untuk mencocokkan data pengeluaran dengan peraturan tanpa harus membuka banyak berkas secara manual.

---

## 🛠️ 3. Arsitektur Teknis & Stack

Bot ini dibangun menggunakan bahasa **Python** dengan spesifikasi berikut:

*   **Telegram Bot Interface:** Menggunakan library `python-telegram-bot` (Handler polling/webhook).
*   **LLM Engine:** Google Gemini API (`gemini-2.5-flash` atau `gemini-1.5-flash`) menggunakan SDK resmi `google-genai` atau `google-generativeai`.
*   **Google Drive Integration:** Google Drive API v3 dengan otorisasi **Google Service Account (.json key file)** untuk membaca folder keuangan bersama secara aman.
*   **Local Search (Local RAG):** Pencarian teks lokal berbasis Regex/Keyword Matching pada file markdown di folder `office-brain/wiki/`.
*   **Spreadsheet Parser:** Library `pandas` dan `openpyxl` untuk membaca dan memotong baris data Excel dari Google Drive sebelum dikirim ke konteks LLM.

---

## ⚙️ 4. Alur Kerja Fitur (Feature Flow)

### A. Fitur 1: Otorisasi Pengguna (Access Control)
*   Bot hanya akan membalas pesan dari daftar **User ID Telegram** atau **Group ID** yang sudah terdaftar di berkas `.env` demi keamanan data keuangan negara.

### B. Fitur 2: Pencarian Aturan Kantor (Local RAG)
1.  User bertanya di Telegram: *"Bagaimana ketentuan pengadaan barang di bawah 50 juta?"*
2.  Bot memanggil fungsi `search_local_wiki` untuk memindai berkas `.md` di folder `office-brain/wiki/` menggunakan pencarian kata kunci (keyword/regex) pada nama file dan isi dokumen.
3.  Konten aturan yang cocok dikirim ke Gemini sebagai konteks untuk dirangkum dan dikirim balik ke Telegram.

### C. Fitur 3: Pencarian & Pembacaan Excel (Google Drive Broker)
1.  User bertanya di Telegram: *"Berapa pagu sisa renovasi gedung di Excel anggaran?"*
2.  Bot memanggil fungsi `search_google_drive` untuk mencari file dengan kata kunci *"anggaran"* atau *"realisasi"* terbatas pada ID Folder Google Drive spesifik yang dikonfigurasi di berkas `.env`.
3.  Bot mengunduh berkas Excel tersebut ke folder `/tmp`, lalu menggunakan **Gemini Function Calling (Tool Calling)** agar Gemini dapat memanggil fungsi Python secara dinamis untuk melihat nama sheet dan mem-filter data keuangan menggunakan `pandas`.
4.  Gemini memproses data riil Excel tersebut dan mengirimkan jawaban yang akurat ke Telegram.

---

## 📂 5. Struktur Folder Kode (`projects/botkeu/`)

```text
projects/botkeu/
├── prd.md                    <-- Dokumen persyaratan ini
├── .env                      <-- API Keys (TELEGRAM_TOKEN, GEMINI_API_KEY, ALLOWED_USERS)
├── service_account.json      <-- Google Cloud Service Account Key (Git-ignored)
├── requirements.txt          <-- Dependensi Python (pandas, openpyxl, python-telegram-bot, etc.)
├── main.py                   <-- Titik masuk utama aplikasi (Bot Polling)
├── config.py                 <-- Validasi & pemuatan variabel env
├── google_drive.py           <-- Modul interaksi Google Drive API
├── local_brain.py            <-- Modul pemindaian berkas Markdown office-brain
└── ai_agent.py               <-- Integrasi Gemini & logika Tool-Calling (Function Calling)
```

---

## 🔬 6. Rencana Pengujian (Verification Plan)

### A. Pengujian Tahap 1: Pengujian Lokal Python
*   Menjalankan botkeu di terminal lokal (`python main.py`).
*   Menguji deteksi pesan masuk dari Telegram User ID yang tidak terdaftar (harus diblokir).
*   Mengirim chat pengujian aturan lokal dan file Excel.

### B. Pengujian Tahap 2: Integrasi Google Drive
*   Memastikan akun robot Service Account telah ditambahkan sebagai editor/viewer di folder Google Drive bersama.
*   Menguji pengunduhan dan pembacaan berkas `.xlsx` secara otomatis.
