"""
Agen 1: Audit PUEBI & Ejaan (Layer 1 — Gemini/Gratis)
Fokus: Typo, PUEBI, tanda baca, istilah asing, penulisan angka, tanda hubung.
"""
import os
from llm_provider import get_client

def run_puebi_audit(input_path, output_path):
    print("[Agen 1/6] Running PUEBI & Ejaan Audit...")
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        return

    with open(input_path, 'r', encoding='utf-8') as f:
        raw_text = f.read()[:100000]

    # Layer 1: Force Gemini (free, sufficient for pattern-matching tasks)
    client, model = get_client(force_provider="google")

    prompt = f"""
Anda adalah editor PUEBI profesional bersertifikat. Tugas Anda: melakukan AUDIT TOTAL ejaan dan tata bahasa Indonesia pada teks proposal skripsi berikut.

ATURAN KETAT:
1. Pindai dari awal hingga akhir tanpa melewatkan satu paragraf pun.
2. Kelompokkan temuan berdasarkan BAB (Bab I, Bab II, Bab III, dll).
3. Format setiap temuan dalam TABEL MARKDOWN:
   | No | Halaman/Paragraf | Teks Asli | Saran Perbaikan | Kaidah PUEBI yang Dilanggar |

KATEGORI YANG WAJIB DICARI:
- Kesalahan ketik (typo) dan salah eja
- Istilah asing yang TIDAK dicetak miring (*italic*)
- Kata depan vs awalan: "di analisis" vs "dianalisis", "di mana" (hanya untuk tempat)
- Penulisan angka: angka di awal kalimat harus dieja ("3 variabel" → "Tiga variabel")
- Tanda hubung vs pisah: "intra-universitas" vs "intra universitas"  
- Singkatan: "dll." wajib pakai titik, "dsb." wajib pakai titik
- Tanda baca: spasi sebelum titik/koma, tanda kutip ganda vs tunggal
- Huruf kapital: setelah titik, nama diri, akronim
- Penggunaan "yang mana" (salah) vs "yang" (benar) kecuali untuk tempat

JANGAN batasi jumlah temuan. Laporkan SEMUA kesalahan yang Anda temukan.

Teks Proposal:
{raw_text}
"""

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=8192
    )

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Hasil Audit PUEBI & Ejaan\n\n")
        f.write(response.choices[0].message.content)

    print(f"[Agen 1/6] PUEBI Audit selesai → {output_path}")
