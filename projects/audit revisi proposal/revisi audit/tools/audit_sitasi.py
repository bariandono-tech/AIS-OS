"""
Agen 3: Audit Sitasi & Daftar Pustaka (Layer 1 — Gemini/Gratis)
Fokus: Ghost citation, orphan reference, format sitasi, recency check.
"""
import os
from llm_provider import get_client

def run_sitasi_audit(input_path, output_path):
    print("[Agen 3/6] Running Sitasi & Daftar Pustaka Audit...")
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        return

    with open(input_path, 'r', encoding='utf-8') as f:
        raw_text = f.read()[:100000]

    # Layer 1: Force Gemini (free)
    client, model = get_client(force_provider="google")

    prompt = f"""
Anda adalah pustakawan akademik dan ahli manajemen referensi. Tugas Anda: mengaudit SELURUH aspek sitasi dan daftar pustaka dari proposal skripsi ini secara menyeluruh.

FORMAT LAPORAN WAJIB (Markdown):

## 1. Ghost Citations (Dikutip di Teks, Tidak Ada di Daftar Pustaka)
Temukan SEMUA nama penulis dan tahun yang disebutkan di dalam teks (contoh: "Menurut Sugiyono (2019)..." atau "(Creswell, 2014)") tetapi TIDAK tercantum di bagian Daftar Pustaka.
| No | Nama Penulis (Tahun) | Lokasi di Teks (Bab/Paragraf) | Status |

## 2. Orphan References (Ada di Daftar Pustaka, Tidak Pernah Dikutip)
Temukan referensi yang tercantum di Daftar Pustaka tetapi TIDAK PERNAH dirujuk di dalam teks.
| No | Referensi di Daftar Pustaka | Dikutip di Teks? |

## 3. Konsistensi Format Sitasi
Identifikasi apakah format sitasi konsisten di seluruh dokumen:
- Apakah menggunakan APA, Harvard, Chicago, atau campuran?
- Contoh inkonsistensi: "(Sugiyono, 2019)" di satu tempat vs "Sugiyono (2019)" di tempat lain tanpa pola.
- "et al." vs "dkk." — harus konsisten.
- Penulisan "&" vs "dan" dalam sitasi multi-penulis.

## 4. Recency Check (Kebaruan Referensi)
Hitung dan laporkan:
- Total jumlah referensi di Daftar Pustaka
- Jumlah referensi yang berusia > 10 tahun (dari tahun 2026)
- Jumlah referensi yang berusia 5-10 tahun
- Jumlah referensi yang berusia < 5 tahun
- Persentase referensi terbaru (< 5 tahun)
- Rekomendasi: untuk bidang teknologi/manajemen, idealnya 70%+ dari 5 tahun terakhir

## 5. Klaim Tanpa Sitasi
Temukan kalimat yang berisi klaim faktual, data statistik, atau pernyataan teori yang TIDAK disertai sitasi.
| No | Kalimat Klaim | Lokasi (Bab/Paragraf) | Jenis Klaim (Data/Teori/Definisi) |

## 6. Masalah Format Daftar Pustaka
- Apakah diurutkan alfabetis?
- Apakah ada entri yang tidak lengkap (tanpa tahun, tanpa penerbit, tanpa kota)?
- Apakah penulisan judul buku/jurnal sudah dicetak miring?

Teks Proposal:
{raw_text}
"""

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=8192
    )

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Hasil Audit Sitasi & Daftar Pustaka\n\n")
        f.write(response.choices[0].message.content)

    print(f"[Agen 3/6] Sitasi Audit selesai → {output_path}")
