"""
Agen 5: Audit Metodologi Bab III (Layer 2 — Opus/Berbayar)
Fokus: Validitas desain riset, sampling, operasionalisasi variabel, instrumen, teknik analisis.
INI ADALAH AGEN PALING KRITIKAL — Bab III adalah bab yang paling sering diserang Dosen Penguji.
"""
import os
from llm_provider import get_client, get_pedoman_ctx

def run_metodologi_audit(input_path, output_path):
    print("[Agen 5/6] Running Metodologi Bab III Audit...")
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        return

    with open(input_path, 'r', encoding='utf-8') as f:
        raw_text = f.read()[:100000]

    # Layer 2: Read from .env
    client, model = get_client()

    prompt = f"""{get_pedoman_ctx()}
Anda adalah Profesor Metodologi Penelitian dengan pengalaman 20 tahun membimbing dan menguji proposal skripsi/tesis. Tugas Anda: melakukan BEDAH TOTAL terhadap Bab III (Metodologi Penelitian) dari proposal ini.

BATASAN: Fokus HANYA pada aspek metodologi. Jangan koreksi ejaan atau struktur bab lain.

FORMAT LAPORAN WAJIB (Markdown):

## 1. SKOR KUALITAS METODOLOGI (1-10)
Skor dengan justifikasi satu paragraf yang tegas.

## 2. JENIS & DESAIN PENELITIAN
- Apa jenis penelitian yang diklaim? (kuantitatif/kualitatif/mixed-method/R&D)
- Apakah desain ini SESUAI dengan rumusan masalah dan judul?
- **EDGE CASE**: Jika judul menyebut "Pengaruh X terhadap Y" (kausal), apakah desain yang dipilih memang bisa menjawab kausalitas? (Deskriptif TIDAK BISA menjawab "pengaruh")
- **EDGE CASE**: Jika klaim kualitatif, apakah ada unsur kuantitatif yang tersembunyi (misal: menggunakan kuesioner Likert)?

## 3. POPULASI & SAMPEL
- Apakah populasi didefinisikan dengan jelas (siapa, di mana, kapan)?
- Apakah teknik sampling dijelaskan (random, purposive, snowball, stratified)?
- Apakah ukuran sampel dijustifikasi? (rumus Slovin, tabel Krejcie-Morgan, saturasi data untuk kualitatif)
- **EDGE CASE**: Populasi = 50, Sampel = 50 → ini bukan sampling, ini SENSUS. Harus disebut sebagai sensus/sampling jenuh.
- **EDGE CASE**: Sampling purposive tanpa menyebutkan kriteria inklusi/eksklusi → FATAL.

## 4. OPERASIONALISASI VARIABEL
- Apakah SETIAP variabel yang disebutkan di judul didefinisikan secara operasional?
- Apakah ada tabel operasionalisasi variabel (variabel, dimensi, indikator, skala)?
- **EDGE CASE**: Variabel moderasi/mediasi disebutkan di judul tapi tidak dioperasionalisasikan → FATAL.
- **EDGE CASE**: Indikator menggunakan skala Likert (1-5) tapi diklaim sebagai data interval → harus ordinal.

## 5. INSTRUMEN PENELITIAN
- Apakah instrumen (kuesioner/pedoman wawancara/lembar observasi) dijelaskan?
- Apakah ada rencana uji validitas (content validity, construct validity)?
- Apakah ada rencana uji reliabilitas (Cronbach's Alpha > 0.6)?
- **EDGE CASE**: Menggunakan kuesioner dari penelitian lain tanpa menyebut adaptasi/adopsi.

## 6. TEKNIK PENGUMPULAN DATA
- Apakah langkah-langkah pengumpulan data dijelaskan secara prosedural?
- Apakah ada triangulasi (untuk kualitatif)?
- **EDGE CASE**: Menyebut "observasi" tapi tidak ada lembar observasi atau protokol.

## 7. TEKNIK ANALISIS DATA
- Apakah teknik analisis sesuai dengan jenis data dan rumusan masalah?
- **EDGE CASE**: Regresi linear untuk data ordinal (Likert) → seharusnya regresi ordinal.
- **EDGE CASE**: Uji normalitas, multikolinearitas, heteroskedastisitas tidak disebutkan padahal menggunakan regresi.
- **EDGE CASE**: Analisis tematik (kualitatif) tanpa menyebut langkah-langkah koding.

## 8. LOKASI & WAKTU PENELITIAN
- Apakah disebutkan? Jika tidak → PENTING untuk ditambahkan.

## 9. ETIKA PENELITIAN (Opsional tapi Bernilai Tambah)
- Apakah ada penyebutan informed consent (untuk penelitian yang melibatkan manusia)?
- Apakah ada penyebutan kerahasiaan data responden?

## 10. CHECKLIST KELENGKAPAN METODOLOGI
Buat checklist `- [ ]` atau `- [x]` untuk semua elemen wajib Bab III.

## 11. PERTANYAAN YANG KEMUNGKINAN AKAN DITANYAKAN DOSEN PENGUJI
Daftar 5-10 pertanyaan tajam yang kemungkinan besar akan ditanyakan saat sidang proposal, beserta saran jawaban.

Teks Proposal:
{raw_text}
"""

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=16384
    )

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Hasil Audit Metodologi Bab III\n\n")
        f.write(response.choices[0].message.content)

    print(f"[Agen 5/6] Metodologi Audit selesai → {output_path}")
