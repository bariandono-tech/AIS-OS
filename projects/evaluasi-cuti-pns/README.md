# Project: Evaluasi Cuti PNS (Agentic Workflow)

Project ini merupakan implementasi dari model workflow *The Council* (Nate Hersch) yang diadaptasi untuk mengevaluasi kelayakan pengajuan cuti Pegawai Negeri Sipil (PNS) berdasarkan Peraturan BKN (khususnya Peraturan BKN No. 24 Tahun 2017 dan perubahannya).

## Cara Kerja

Workflow ini mengandalkan _Skill_ `evaluasi-cuti-pns` yang memanggil 5 agen (persona) secara paralel:
1. **Analis Kepegawaian** (Fokus pada kepatuhan aturan BKN)
2. **Atasan Langsung** (Fokus pada dampak operasional kerja)
3. **Pengawas Disiplin** (Mencari celah pelanggaran/penyalahgunaan)
4. **Pembela Hak Pegawai** (Mengadvokasi kesejahteraan dan hak PNS)
5. **Rekan Kerja** (Melihat dampak nyata pada tim yang ditinggalkan)

Setelah kelima agen selesai berdebat, sistem akan bertindak sebagai **Hakim** untuk mensintesis dan mengeluarkan satu dari tiga keputusan mutlak:
- **DISETUJUI** (GO)
- **DITANGGUHKAN** (RESHAPE)
- **DITOLAK** (KILL)

## Cara Menggunakan

Anda bisa langsung menggunakan workflow ini dengan memberikan instruksi kepada Agent seperti:

> "Tolong jalankan evaluasi cuti PNS untuk Budi (NIP 1980xxx). Dia mengajukan Cuti Alasan Penting selama 5 hari karena ibunya sakit keras di luar kota. Beban kerja tim saat ini sedang tinggi karena akhir tahun, dan dia sudah menggunakan 3 hari cuti tahunannya."

Atau cukup ketik:
> "/evaluasi-cuti-pns"

Sistem akan merespons dengan meminta detail pengajuan cuti jika belum lengkap, lalu menggelar sidang dewan untuk memutuskannya.
