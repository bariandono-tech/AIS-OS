"""
Agen 2: Audit Register & Kualitas Bahasa Akademik (Layer 1 — Gemini/Gratis)
Fokus: Pleonasme, bahasa kasual, subjektivitas, kalimat tidak efektif, hedging.
BEDA dari PUEBI: PUEBI cek ejaan SALAH, Register cek bahasa BENAR tapi TIDAK AKADEMIS.
"""
import os
from llm_provider import get_client, get_pedoman_ctx

def run_register_audit(input_path, output_path):
    print("[Agen 2/6] Running Register & Kualitas Bahasa Akademik Audit...")
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        return

    with open(input_path, 'r', encoding='utf-8') as f:
        raw_text = f.read()[:100000]

    # Layer 1: Read from .env (fallback to google if not set)
    client, model = get_client()

    prompt = f"""{get_pedoman_ctx()}
Anda adalah reviewer jurnal ilmiah terakreditasi SINTA 1. Tugas Anda: mengevaluasi KUALITAS BAHASA AKADEMIK dari proposal skripsi ini. 

PENTING: Anda BUKAN mengecek ejaan atau PUEBI (itu tugas agen lain). Anda mengecek apakah GAYA BAHASA dan REGISTER tulisan ini sudah setara standar karya ilmiah.

FORMAT LAPORAN: Tabel Markdown per bab.
| No | Lokasi (Bab/Paragraf) | Kalimat Asli | Masalah | Saran Perbaikan Akademis |

KATEGORI MASALAH YANG WAJIB DICARI:

1. **Pleonasme (Redundansi):**
   - "sangat penting sekali" → "sangat penting" atau "krusial"
   - "saling berkaitan satu sama lain" → "saling berkaitan"
   - "para mahasiswa-mahasiswa" → "para mahasiswa"

2. **Bahasa Kasual / Tidak Formal:**
   - "kita" → "peneliti" atau "penulis" (dalam konteks ilmiah)
   - "lewat" → "melalui"
   - "sudah" → "telah"
   - "bisa" → "dapat" atau "mampu"
   - "sepertinya" → hindari atau ganti dengan hedging akademis

3. **Kalimat Tanpa Data/Bukti:**
   - "Banyak orang menggunakan internet" → perlu data: "Berdasarkan data BPS (2023)..."
   - "Teknologi berkembang pesat" → perlu bukti spesifik

4. **Subjektivitas:**
   - "Peneliti ingin mengetahui..." → "Penelitian ini bertujuan untuk menganalisis..."
   - "Menurut penulis..." → hindari dalam karya ilmiah
   - "Saya rasa..." → tidak boleh ada sama sekali

5. **Kalimat Tidak Efektif:**
   - Kalimat > 40 kata tanpa subordinasi yang jelas
   - Nominalisasi berlebihan: "melakukan pengujian" → "menguji"
   - "memberikan pengaruh" → "memengaruhi"

6. **Hedging Akademik yang Kurang:**
   - "X menyebabkan Y" (terlalu absolut) → "X berpotensi memengaruhi Y" atau "X diduga berpengaruh terhadap Y"
   - Pernyataan kausal tanpa kualifikasi

7. **Penggunaan "akan" Berlebihan:**
   - Menandakan tulisan lebih mirip rencana daripada karya ilmiah
   - "Penelitian ini akan menggunakan..." boleh di Bab III, tapi tidak boleh di Bab I/II

Pindai SELURUH dokumen. Laporkan SEMUA temuan tanpa batasan jumlah.

Teks Proposal:
{raw_text}
"""

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=16384
    )

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Hasil Audit Register & Kualitas Bahasa Akademik\n\n")
        f.write(response.choices[0].message.content)

    print(f"[Agen 2/6] Register Audit selesai → {output_path}")
