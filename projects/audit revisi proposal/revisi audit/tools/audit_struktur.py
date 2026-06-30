"""
Agen 4: Audit Struktur & Research Gap (Layer 2 — Opus/Berbayar)
Fokus: Piramida terbalik, research gap, kelengkapan sub-bab, kesesuaian judul.
CATATAN: Agen ini TIDAK lagi menangani metodologi (Agen 5) dan sitasi (Agen 3).
"""
import os
from llm_provider import get_client

def run_structure_audit(input_path, output_path):
    print("[Agen 4/6] Running Struktur & Research Gap Audit...")
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        return

    with open(input_path, 'r', encoding='utf-8') as f:
        raw_text = f.read()[:100000]

    # Layer 2: Read from .env
    client, model = get_client()

    prompt = f"""
Anda adalah Dosen Penguji senior yang sangat kritis. Tugas Anda: mengevaluasi STRUKTUR dan RESEARCH GAP dari proposal skripsi Bab I-III ini.

BATASAN TUGAS: Anda HANYA mengevaluasi struktur dan logika argumen. JANGAN mengoreksi ejaan/PUEBI (agen lain yang menangani), JANGAN mengevaluasi metodologi secara detail (agen lain yang menangani), dan JANGAN mengevaluasi sitasi secara detail (agen lain yang menangani).

FORMAT LAPORAN WAJIB (Markdown):

## 1. SKOR EVALUASI STRUKTUR (1-10)
Berikan skor dengan justifikasi tegas dalam satu paragraf. Jadilah kejam tapi adil.

## 2. EVALUASI JUDUL
- Apakah judul sudah spesifik (ada variabel X, Y, objek, lokasi)?
- Apakah judul terlalu panjang (> 20 kata) atau terlalu pendek (< 8 kata)?
- Apakah kata kerja sesuai dengan jenis penelitian (Pengaruh → kuantitatif, Analisis → bisa keduanya)?
- Saran perbaikan judul jika diperlukan.

## 3. EVALUASI BAB I — PENDAHULUAN

### 3.1 Latar Belakang
- Apakah sudah mengikuti pola **Piramida Terbalik** (umum → khusus → gap → urgensi)?
- Paragraf 1: Konteks global/nasional — ADA/TIDAK ADA?
- Paragraf 2-3: Penyempitan ke konteks spesifik — ADA/TIDAK ADA?
- Paragraf 4-5: Identifikasi masalah & data pendukung — ADA/TIDAK ADA?
- Paragraf terakhir: Research gap & urgensi penelitian — ADA/TIDAK ADA?
- Saran perbaikan struktur dengan contoh kerangka paragraf.

### 3.2 Rumusan Masalah
- Apakah berbentuk pertanyaan penelitian yang spesifik dan terukur?
- Apakah jumlah rumusan masalah sesuai (ideal: 2-4 poin)?
- Apakah setiap poin bisa dijawab dengan data/analisis?

### 3.3 Tujuan Penelitian
- Apakah selaras 1:1 dengan rumusan masalah?
- Apakah menggunakan kata kerja operasional yang tepat?

### 3.4 Kelengkapan Sub-bab
Cek apakah ada sub-bab wajib yang hilang:
- [ ] Latar Belakang
- [ ] Rumusan Masalah  
- [ ] Tujuan Penelitian
- [ ] Manfaat Penelitian (Teoritis & Praktis)
- [ ] Batasan Masalah / Ruang Lingkup

## 4. EVALUASI BAB II — TINJAUAN PUSTAKA

### 4.1 Kerangka Teori
- Apakah setiap variabel dalam judul memiliki landasan teori yang memadai?
- Apakah teori-teori yang digunakan relevan dan dari sumber primer (buku/jurnal, bukan blog)?
- Variabel mana yang landasan teorinya masih lemah atau kosong?

### 4.2 Penelitian Terdahulu
- Apakah ada minimal 5-10 penelitian terdahulu yang relevan?
- Apakah ada tabel perbandingan penelitian terdahulu?
- Apakah ada penjelasan perbedaan penelitian ini dengan penelitian sebelumnya (novelty)?

### 4.3 Kerangka Berpikir / Kerangka Konseptual
- Apakah ada diagram kerangka berpikir?
- Apakah semua variabel dalam judul tercermin dalam diagram?
- Apakah arah panah kausalitas logis dan didukung teori?

### 4.4 Hipotesis (jika kuantitatif)
- Apakah hipotesis konsisten dengan kerangka berpikir?
- Apakah ada H0 dan Ha untuk setiap hubungan variabel?

## 5. CHECKLIST KELENGKAPAN STRUKTUR
Buat checklist `- [ ]` atau `- [x]` untuk semua elemen wajib yang sudah/belum ada.

## 6. SARAN PERBAIKAN PRIORITAS
Kelompokkan menjadi: KRITIS (harus diperbaiki sebelum sidang), PENTING (sebaiknya diperbaiki), OPSIONAL (nice-to-have).

Teks Proposal:
{raw_text}
"""

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=16384
    )

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Hasil Audit Struktur & Research Gap\n\n")
        f.write(response.choices[0].message.content)

    print(f"[Agen 4/6] Struktur Audit selesai → {output_path}")
