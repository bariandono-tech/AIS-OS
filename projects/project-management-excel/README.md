# Interactive Gantt Chart Template (Mocha Warm Theme)

Template Manajemen Proyek berbasis Excel yang dirancang khusus untuk mempermudah koordinasi tugas kelompok kuliah (makalah kelompok, proyek skripsi, atau tugas besar). Memanfaatkan otomatisasi formula Excel dan pemformatan bersyarat (*Conditional Formatting*) dengan estetika premium bertema **Mocha Warm** (Pantone 2025).

---

## 📁 Struktur Lembar Kerja (Worksheets)

1.  **`README & Guide`**
    *   Panduan pengoperasian cepat bagi anggota kelompok.
    *   Daftar shortcut produktivitas Excel untuk pengisian data yang cepat.
2.  **`KPI Dashboard`**
    *   Visualisasi rekapitulasi status proyek kelompok (Total tugas, selesai, sedang berjalan, belum dimulai).
    *   *Project Progress Bar* otomatis berbasis rata-rata penyelesaian tugas.
    *   Tabel beban kerja per anggota kelompok (menghitung jumlah tugas dan rata-rata progress per PIC).
3.  **`Gantt Chart Schedule`**
    *   Tabel pengisian tugas, PIC, durasi, tanggal mulai/selesai, dan persentase progress.
    *   Kalender sumbu waktu Gantt Chart 30 hari yang bergeser secara dinamis mengikuti perubahan sel `Project Start Date` (C4).

---

## 📊 Otomatisasi & Formula yang Digunakan

*   **Pembaruan Kalender Dinamis:**
    *   Sumbu tanggal pertama (sel J10) diset ke `=$C$4` (sel tanggal mulai proyek). Kolom setelahnya menggunakan rumus `=J10+1` secara berantai ke kanan.
*   **Perhitungan Durasi Otomatis:**
    *   Kolom durasi hari dihitung otomatis menggunakan formula:
        ```excel
        =IF(OR(ISBLANK(D12), ISBLANK(E12)), "", E12-D12+1)
        ```
*   **Pembaruan Status Otomatis:**
    *   Status tugas akan terupdate otomatis berdasarkan kolom progress:
        ```excel
        =IF(ISBLANK(B12), "", IF(G12=0, "Not Started", IF(G12=1, "Completed", "In Progress")))
        ```
*   **Arsir Gantt Bar Otomatis:**
    *   Sumbu visual Gantt Chart terisi karakter blok `█` dan diarsir warna emas pasir secara otomatis berdasarkan formula bersyarat (*Conditional Formatting*):
        ```excel
        =AND(Tanggal_Kolom>=Tanggal_Mulai, Tanggal_Kolom<=Tanggal_Selesai)
        ```

---

## 🎨 Warna Estetika (Mocha Warm Palette)

*   **Primary Header Fill:** `#6B4F3A` (Deep Espresso)
*   **Gantt Bar Highlight:** `#E8C9A0` (Sand Gold)
*   **Zebra Grid Line:** `#F9F6F0` (Light Warm Ivory)
*   **Status Indicators:**
    *   `Completed`: Hijau Muda (`#D1E7DD`) & Teks Hijau Tua (`#0F5132`)
    *   `In Progress`: Kuning Muda (`#FFF3CD`) & Teks Kuning Tua (`#664D03`)
    *   `Not Started`: Abu-abu Terang (`#F8F9FA`) & Teks Abu-abu Gelap (`#6C757D`)

---

## 💻 Panduan Kompatibilitas

Template ini 100% kompatibel dengan:
*   **Microsoft Excel (Office 365 / 2021 dst.)** (Direkomendasikan)
*   **Google Sheets** (Arsir warna akan ter-render otomatis)
*   **WPS Office**
*   **Apple Numbers**
