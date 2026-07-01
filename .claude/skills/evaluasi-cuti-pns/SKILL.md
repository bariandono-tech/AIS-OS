---
name: evaluasi-cuti-pns
description: Workflow agentik berdasar model "The Council" (Nate Hersch) untuk mengevaluasi pengajuan Cuti Pegawai Negeri Sipil (PNS). Menjalankan 5 persona (Analis Kepegawaian, Atasan, Pengawas Disiplin, Advokat, Rekan Kerja) untuk membedah kelayakan cuti berdasarkan Peraturan BKN, lalu memberikan keputusan mutlak (DISETUJUI / DITANGGUHKAN / DITOLAK).
argument-hint: "[detail pengajuan cuti]"
---

## What this does

Sistem ini adalah adaptasi dari model "Roast / The Council" untuk konteks birokrasi, khususnya Peraturan Cuti PNS. Daripada sekadar mengiyakan pengajuan cuti, workflow ini akan memanggil dewan (council) yang terdiri dari 5 persona agen independen. Mereka akan membedah pengajuan cuti dari segala sisi (hukum, operasional, disiplin, hak pegawai), lalu seorang Hakim (Pejabat yang Berwenang) akan memberikan keputusan final (verdict).

Dewan ini bersifat objektif dan kritis. Tujuannya adalah memastikan keputusan cuti tidak melanggar aturan BKN (Peraturan BKN No. 24 Tahun 2017 / No. 7 Tahun 2021) dan tidak merugikan operasional instansi.

## Step 1: Get the brief

Jika `$ARGUMENTS` sudah berisi detail pengajuan cuti, mulailah dari situ. Jika belum lengkap, tanyakan daftar pertanyaan singkat (maksimal 3-4 pertanyaan dalam satu kali chat) kepada user agar dewan memiliki konteks yang jelas:

1. **Identitas & Jenis Cuti**: Nama/NIP, Jabatan, dan jenis cuti yang diajukan (Tahunan, Sakit, Alasan Penting, Besar, Melahirkan, atau Di Luar Tanggungan Negara).
2. **Durasi & Tanggal**: Berapa lama dan kapan pelaksanaannya.
3. **Alasan & Urgensi**: Mengapa cuti ini diajukan (terutama penting untuk Cuti Alasan Penting / CLTN).
4. **Sisa Kuota Cuti & Kondisi Tim**: Apakah kuota cuti tahunan masih ada? Bagaimana kondisi beban kerja tim saat ini?

Jika user berkata "langsung saja" atau sudah memberikan info yang cukup, lewati pertanyaan dan langsung mulai proses sidang. 

Tulis *brief* tersebut ke dalam satu paragraf pendek yang akan di-paste ke setiap prompt anggota dewan, agar kelima agen mengevaluasi hal yang persis sama.

## Step 2: Convene the council (5 agents, in parallel)

Jalankan **kelima agen secara paralel dalam satu pesan** (satu pemanggilan Task masing-masing, `subagent_type: general-purpose`). Paste brief yang sama ke masing-masing agen, lalu berikan mandat persona mereka di bawah ini.

Setiap anggota dewan harus mengembalikan: satu kalimat sikap utama (stance), 3-5 argumen paling tajam, satu hal paling penting yang harus didengar user, dan skor 1-10 dari sudut pandang mereka (1 = tolak mentah-mentah, 10 = setujui tanpa syarat).

**1. Analis Kepegawaian (The Compliance Officer)**
> You are the Analis Kepegawaian (HR Analyst) on the council. Your job is to strictly evaluate this request against Peraturan BKN No. 24 Tahun 2017 / No. 7 Tahun 2021 regarding PNS leave. Are the requirements met? Is the quota sufficient? Are there any administrative flaws? Be rigid and specific about the rules. THE BRIEF: [brief]

**2. Atasan Langsung (The Operational Manager)**
> You are the Atasan Langsung (Direct Supervisor). Your main concern is the operational impact on the unit. If this person leaves, who will cover their work? Will targets be missed? Find the biggest risk to the team's performance. Be pragmatic and slightly protective of your unit's output. THE BRIEF: [brief]

**3. Pengawas Disiplin (The Skeptic)**
> You are the Pengawas Disiplin (Discipline Supervisor). You look for patterns of abuse. Is this leave an excuse to extend a holiday (e.g. harpitnas)? Is the reason actually urgent or just a fabricated excuse? Your job is to find reasons why this might be a bad faith request. Be ruthlessly skeptical. THE BRIEF: [brief]

**4. Pembela Hak Pegawai (The Advocate)**
> You are the Pembela Hak Pegawai (Employee Advocate). Make the strongest possible case FOR approving this leave. Argue from the perspective of employee well-being, mental health, and their legal rights as a PNS. Why is denying this leave actually harmful to the organization in the long run? THE BRIEF: [brief]

**5. Rekan Kerja (Voice of the Team)**
> You are the Rekan Kerja (Colleague). Role-play a team member who has to cover for this person. Are you genuinely supportive, or are you secretly resentful because it's the busy season and you are already overworked? React in the first person. What's the real impact on the ground? THE BRIEF: [brief]

## Step 3: The Judge delivers the verdict

Setelah kelima agen selesai, ANDA bertindak sebagai Hakim (Pejabat Pembina Kepegawaian / Pejabat yang Berwenang Memberikan Cuti). Baca temuan dari seluruh anggota dewan, timbang semuanya, dan sintesiskan menjadi satu keputusan mutlak. Jangan sekadar merata-rata skor. Selesaikan tensi antara aturan kaku (Analis), operasional (Atasan/Rekan), dan hak (Advokat).

Sajikan verdict dengan format persis seperti ini:

```
## KEPUTUSAN: DISETUJUI / DITANGGUHKAN / DITOLAK
Keyakinan: [Rendah / Sedang / Tinggi]

**Ringkasan Keputusan:** [Satu kalimat lugas mengenai status persetujuan]

**Alasan Utama:** [2-3 kalimat yang menyelesaikan perdebatan antara kelima persona]

**Risiko Utama:** [Hal yang paling mungkin menjadi masalah dari keputusan ini]
**Dasar Hukum (Perka BKN):** [Kesesuaian dengan regulasi BKN secara spesifik]

**Dampak Operasional & Mitigasi:** [Bagaimana tim harus menutupi kekosongan / alasan mengapa ini tidak masalah]

**Tindakan Administratif Selanjutnya:** [Langkah pasti yang harus diambil, misalnya "Cetak form cuti", "Minta surat dokter", dsb.]

**Jika DITANGGUHKAN/DITOLAK (Syarat Perubahan):** [Apa yang harus diubah dari pengajuan ini agar bisa disetujui (misal: kurangi durasi, geser tanggal)]
```

Lalu, cantumkan skor dari kelima anggota dewan di bagian paling bawah dalam satu baris: 
`Analis X/10 · Atasan X/10 · Pengawas X/10 · Advokat X/10 · Rekan X/10`

## Rules

- **Karakter Konsisten**: Setiap persona harus tetap pada karakternya. Jangan ada yang bersikap netral atau mencoba menyenangkan semua pihak. Nilai utama dari workflow ini ada pada perdebatan sudut pandang.
- **Aturan Eksplisit Penolakan/Penangguhan (Perka BKN)**: 
  - **Dapat Ditangguhkan/Ditolak**: Cuti Tahunan, Cuti Besar, dan Cuti di Luar Tanggungan Negara (CLTN) boleh ditangguhkan (maks 1 tahun) atau ditolak demi kepentingan dinas yang mendesak.
  - **TIDAK DAPAT Ditangguhkan/Ditolak**: Cuti Sakit, Cuti Melahirkan, dan Cuti Alasan Penting adalah hak mutlak dan instansi tidak boleh menangguhkan atau menolaknya (meski Analis tetap harus memeriksa kelengkapan dokumen/syaratnya).
- **Keputusan Pasti**: Hakim HARUS memberikan keputusan pasti (GO / RESHAPE / KILL) dalam terminologi (DISETUJUI / DITANGGUHKAN / DITOLAK). "Tergantung" bukanlah sebuah keputusan.
- **Rujukan Aturan**: Dasar hukum wajib merujuk pada prinsip-prinsip Peraturan BKN No. 24 Tahun 2017 (dan perubahannya dalam No. 7 Tahun 2021).
- **Format Skimmable**: Hasil akhir harus mudah dibaca secara sekilas. Dewan yang bekerja keras mencari detail, namun Hakim yang mengambil keputusan praktis.
