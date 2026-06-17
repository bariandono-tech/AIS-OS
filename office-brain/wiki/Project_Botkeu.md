# 🤖 Project Botkeu (Telegram Finance Bot)

`Project_Botkeu` adalah asisten keuangan pintar berbasis **Telegram Bot** yang berfungsi sebagai gerbang penghubung (*broker*) data keuangan kantor. Bot ini dirancang agar pengelola keuangan dapat mengakses data regulasi lokal (SOP) dan data dinamis (Excel anggaran) langsung dari Telegram tanpa perlu berinteraksi dengan terminal atau sistem teknis.

---

## 📌 Deskripsi Singkat
* **Nama Proyek:** botkeu
* **Tipe Proyek:** Telegram Bot / Broker Data Keuangan & Regulasi
* **Repositori Kode:** [projects/botkeu/](file:///d:/WORKSPACE/AIS-OS/projects/botkeu/)
* **Dokumen PRD:** [prd.md](file:///d:/WORKSPACE/AIS-OS/projects/botkeu/prd.md)

---

## 🛠️ Fitur Utama & Cara Kerja

### 1. Otorisasi Akses (Access Control)
* Membatasi akses bot hanya untuk pengguna Telegram yang terdaftar di `.env` (berdasarkan User ID angka unik).
* Memastikan data keuangan internal kantor tetap aman.

### 2. Pencarian Dokumen Lokal (Local RAG)
* Bot memindai dokumen regulasi internal dan SOP yang ada di folder [office-brain/wiki/](file:///d:/WORKSPACE/AIS-OS/office-brain/wiki/).
* Menggunakan pencarian berbasis kata kunci (keyword/regex) untuk menemukan dokumen relevan, lalu mengirimkannya sebagai konteks ke Gemini untuk dijawab.

### 3. Integrasi Excel Google Drive (Google Drive Broker)
* Bot dihubungkan ke Google Drive menggunakan **Service Account Key (.json)**.
* Pencarian dibatasi pada satu ID Folder Google Drive tertentu (dikonfigurasi via `.env`) untuk menjaga efisiensi dan keamanan.
* Menggunakan **Gemini Function Calling (Tool Calling)** secara dinamis untuk mengunduh Excel, melihat lembar kerja (sheet), dan mem-filter baris data menggunakan library `pandas` sebelum merumuskan jawaban keuangan.

---

## 🚀 Stack Teknologi
* **Bahasa:** Python
* **Telegram Interface:** `python-telegram-bot`
* **LLM Engine:** Google Gemini API (`gemini-2.5-flash` / `gemini-1.5-flash`)
* **Integrasi Drive:** Google Drive API v3 (Service Account)
* **Parser Data:** `pandas` & `openpyxl`

---

## 🔗 Referensi Dokumen
* **Spesifikasi Teknis Lengkap:** [PRD botkeu](file:///d:/WORKSPACE/AIS-OS/projects/botkeu/prd.md)
* **Folder Kode Proyek:** [projects/botkeu/](file:///d:/WORKSPACE/AIS-OS/projects/botkeu/)
