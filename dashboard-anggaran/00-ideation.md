# Ideation: Dashboard Anggaran

## Brain Dump
- Membangun dashboard untuk memantau anggaran.
- Data sumber asli berasal dari Google Sheets.
- Halaman landing (Landing Page) menampilkan visualisasi data (dashboard).
- Memiliki menu tambahan, contohnya: **IKPA Penyerapan Anggaran**.
- Google Sheets memiliki 2 sheet: 
  1. Data Dashboard.
  2. Data IKPA Penyerapan (berisi indikator-indikator).
- **Fitur Utama**: Sinkronisasi Dua Arah (Two-way sync). Data bisa diisi/diubah melalui Google Sheets maupun melalui aplikasi web (Landing Page). Perubahan di web akan langsung mengubah Google Sheets, dan sebaliknya.

## Market Scan
- **Softr, Glide, AppSheet**: Platform no-code yang sudah ada dan bisa membuat web dari Google Sheets.
- **Custom Build**: Diperlukan jika indikator IKPA (Indikator Kinerja Pelaksanaan Anggaran) memiliki kalkulasi dan visualisasi spesifik yang sulit dicapai dengan tool no-code biasa. 

## Angles Explored
1. **No-Code Wrapper**: Menggunakan Glide atau AppSheet. Sangat cepat, namun kurang fleksibel untuk desain UI yang premium.
2. **Web App dengan Google Sheets sebagai Database (SSOT)**: Menggunakan Next.js dan Google Sheets API. Keunggulan: Staf tetap bisa bekerja di Sheet, sistem hanya bertindak sebagai UI layer. Kelemahan: Kecepatan, batasan limit API Google, serta rawan konflik.
3. **Web App dengan Database Asli (Supabase) + Sync Sheet**: Menggunakan Supabase sebagai *Single Source of Truth* (SSOT), dan mensinkronisasikannya dengan Google Sheets. Keunggulan: Cepat, aman, tidak rawan *race condition*.

## Chosen Direction
**Angle**: Web App kustom (Next.js) dengan sinkronisasi. Rekomendasi arsitektur detail ada di 01-architecture.md.
**Why**: Memenuhi kebutuhan spesifik IKPA, memberikan UI yang *premium*, dan sinkronisasi dua arah.

## Parked Ideas
- Role-based access control (RBAC) yang kompleks. Untuk MVP, fokus ke fungsi inti.
