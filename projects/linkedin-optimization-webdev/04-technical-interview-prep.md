# Technical Interview Prep for Vibe Coders (Non-IT)

Sebagai seorang **Vibe Coder**, Anda memiliki kemampuan luar biasa untuk merilis aplikasi web fungsional dalam waktu singkat berkat bantuan AI. Namun, tantangan terbesar Anda adalah **interview teknis (live coding & tanya jawab)**. 

Banyak junior dev gugup saat ditanya: *"Bagaimana alur logika fungsi ini?"* atau *"Mengapa Anda mendesain skema database seperti ini?"* jika kode tersebut ditulis dengan bantuan AI.

Dokumen ini adalah panduan taktis agar Anda bisa menguasai kode Anda sendiri dan tampil meyakinkan saat wawancara kerja.

---

## Part 1: Cara Menguasai Kode Anda Sendiri (Project Auditing)

Sebelum Anda mencantumkan proyek portofolio di LinkedIn atau mengirimkannya ke recruiter, lakukan audit mandiri terhadap kode Anda menggunakan AI dengan langkah-langkah berikut:

### 1. Buat Peta Arsitektur Proyek
Buka proyek Anda di IDE. Mintalah AI (seperti Claude/Gemini) untuk me-review struktur proyek dan membuat rangkuman arsitekturnya.
*   **Prompt AI:** 
    > *"Tolong jelaskan struktur folder dan arsitektur aplikasi ini. Sebutkan library/package utama yang digunakan, apa fungsinya, dan bagaimana data mengalir dari frontend (form/halaman) ke backend hingga disimpan ke database."*
*   **Tindakan Anda:** Baca rangkuman ini beberapa kali. Anda harus paham file mana yang bertanggung jawab untuk database, endpoint API, dan halaman UI.

### 2. Audit Kode Kunci Baris-demi-Baris
Identifikasi komponen/handler paling penting dari aplikasi Anda (misalnya: fungsi registrasi & login JWT, fungsi checkout belanja, atau kalkulasi logika utama).
*   **Prompt AI:**
    > *(Tempelkan kode fungsi tersebut)* 
    > *"Tolong jelaskan cara kerja fungsi ini baris-demi-baris secara mendetail. Mengapa baris X ditulis seperti itu? Apa kemungkinan bug atau edge-case yang bisa terjadi di fungsi ini, dan bagaimana cara menanganinya?"*
*   **Tindakan Anda:** Pastikan Anda bisa menjelaskan alur logika fungsi tersebut dengan bahasa Anda sendiri tanpa membuka AI.

---

## Part 2: Konsep Esensial JavaScript/TypeScript Stack yang Wajib Dipahami

Recruiter sering menanyakan teori dasar untuk menguji apakah Anda benar-benar paham pemrograman atau sekadar menyalin kode. Hafalkan dan pahami konsep-konsep ini:

### 1. Konsep Frontend (React & Next.js)
*   **State vs Props**: *State* adalah data internal komponen yang bisa berubah (menggunakan `useState`), sedangkan *Props* adalah data yang dikirimkan dari komponen induk (parent) ke komponen anak (child) dan bersifat *read-only*.
*   **useEffect Hook**: Hook untuk menjalankan *side effect* (seperti mengambil data dari API, berlangganan event, atau manipulasi DOM langsung) setelah komponen di-render.
*   **Server Components vs Client Components (Next.js)**: 
    *   *Server Components*: Di-render di server secara default, menghasilkan ukuran bundle Javascript client yang lebih kecil, bagus untuk SEO dan performa.
    *   *Client Components*: Menggunakan direktif `"use client"`, di-render di browser, dibutuhkan jika aplikasi menggunakan interaktivitas, state (`useState`), atau hooks browser (`useEffect`).

### 2. Konsep Backend & Database (Node.js & Express)
*   **REST API & HTTP Methods**: 
    *   `GET` (mengambil data), `POST` (membuat data baru), `PUT`/`PATCH` (mengubah data), `DELETE` (menghapus data).
    *   Pahami HTTP Status Codes: `200 OK` (berhasil), `201 Created` (berhasil membuat data), `400 Bad Request` (input salah), `401 Unauthorized` (belum login/token salah), `404 Not Found` (data tidak ada), `500 Internal Server Error` (backend error).
*   **Middleware**: Fungsi yang dijalankan sebelum request masuk ke router utama (misal: middleware untuk mengecek JWT token atau parsing body request).
*   **ORM (Prisma)**: Alat untuk berinteraksi dengan database relasional (seperti PostgreSQL/MySQL) menggunakan kode JavaScript/TypeScript tanpa perlu menulis query SQL manual.

---

## Part 3: Cara Menjawab Pertanyaan "Mengapa Tidak Punya Gelar IT?"

Posisikan latar belakang non-IT Anda sebagai **nilai tambah**, bukan kekurangan. Gunakan teknik re-framing ini:

> **Pertanyaan Recruiter:** *"Saya lihat latar belakang pendidikan Anda bukan IT/Sistem Informasi. Bagaimana Anda belajar coding?"*
>
> **Jawaban Anda:**
> *"Betul, latar belakang formal saya bukan IT. Namun, hal itu justru melatih saya menjadi seorang **independent learner** yang adaptif. Saya belajar coding secara mandiri karena saya memiliki ketertarikan kuat untuk membangun produk digital.*
> 
> *Berbeda dengan pendekatan akademis yang teoritis, saya langsung belajar dengan metode **project-based**. Saya membangun aplikasi nyata dari nol, memecahkan error sendiri, dan membiasakan diri menggunakan alat kolaborasi modern serta AI assistance untuk mempercepat waktu pengembangan.*
> 
> *Saya percaya dalam dunia software development saat ini, kemampuan beradaptasi dengan teknologi baru dan kecepatan merilis produk (delivery) adalah hal yang sangat berharga bagi bisnis, dan itulah kekuatan utama saya."*

---

## Part 4: Survival Guide saat Live Coding

Jika Anda diminta live coding (menulis kode di depan interviewer):

1.  **Jangan Diam (Think Aloud)**: Bicarakan apa yang ada di pikiran Anda. Jelaskan alur logika Anda sebelum mulai mengetik. Interviewer lebih menghargai proses berpikir dibanding jawaban yang langsung jadi tapi tanpa penjelasan.
2.  **Sederhanakan Masalah**: Jangan langsung mencoba membuat solusi yang sempurna. Buat kode yang paling sederhana dulu (brute force) agar fungsinya berjalan, baru tawarkan optimasi kemudian.
3.  **Fokus pada Logika, Bukan Sintaks**: Jika Anda lupa sintaks spesifik JavaScript (misal: cara penulisan filter array tertentu), katakan kepada interviewer:
    > *"Saya ingat logikanya adalah kita perlu memfilter array ini berdasarkan kondisi X. Di sini saya akan menggunakan fungsi bawaan JS. Saya agak lupa penulisan argumen presisinya karena biasanya saya terbantu oleh autocomplete IDE, namun logika jalannya adalah seperti ini..."*
    Interviewer biasanya akan membantu memberikan sintaksnya atau membiarkan Anda mencarinya di Google jika Anda menjelaskan logika dengan benar.
