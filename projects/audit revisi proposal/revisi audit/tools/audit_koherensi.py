"""
Agen 6: Audit Koherensi & Benang Merah Lintas-Bab (Layer 2 — Opus/Berbayar)
Fokus: Konsistensi variabel, kesesuaian kata kerja, jumlah poin RM↔Tujuan↔Analisis.
Agen ini MEMBUTUHKAN konteks dari seluruh Bab I-III sekaligus.
"""
import os
from llm_provider import get_client

def run_koherensi_audit(input_path, output_path):
    print("[Agen 6/6] Running Koherensi & Benang Merah Lintas-Bab Audit...")
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        return

    with open(input_path, 'r', encoding='utf-8') as f:
        raw_text = f.read()[:100000]

    # Layer 2: Force Dinoiki/Claude (paid, cross-bab reasoning)
    client, model = get_client(force_provider="dinoiki")

    prompt = f"""
Anda adalah Quality Assurance akademik yang tugasnya satu: memastikan BENANG MERAH proposal skripsi ini lurus sempurna dari Judul hingga Metodologi.

PENTING: Anda BUKAN mengevaluasi kualitas masing-masing bab (agen lain yang menangani). Anda mengevaluasi KONEKSI dan KONSISTENSI antar-bab.

FORMAT LAPORAN WAJIB (Markdown):

## 1. PETA BENANG MERAH (6 Titik Koneksi)

Buat tabel yang mencocokkan elemen-elemen ini:
| Titik | Elemen | Isi (Kutipan dari Teks) | Konsisten? |
|:---:|:---|:---|:---:|
| 1 | Judul | ... | - |
| 2 | Latar Belakang (Gap) | ... | ✅/❌ vs Judul |
| 3 | Rumusan Masalah | ... | ✅/❌ vs Latbel |
| 4 | Tujuan Penelitian | ... | ✅/❌ vs RM |
| 5 | Tinjauan Pustaka (Teori) | ... | ✅/❌ vs Variabel di Judul |
| 6 | Metodologi (Analisis) | ... | ✅/❌ vs RM & Tujuan |

## 2. ANALISIS KONSISTENSI VARIABEL

Identifikasi SEMUA variabel yang disebutkan di judul. Lalu lacak kemunculannya:
| Variabel | Di Judul? | Di Latbel? | Di RM? | Di Tujuan? | Di Tinpus? | Di Metode? |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|

Variabel yang HILANG di salah satu bab → tandai sebagai **INKONSISTENSI KRITIS**.

## 3. ANALISIS JUMLAH POIN (Quantity Mismatch)

| Elemen | Jumlah Poin | Detail |
|:---|:---:|:---|
| Rumusan Masalah | ? | RM1, RM2, ... |
| Tujuan Penelitian | ? | T1, T2, ... |
| Hipotesis (jika ada) | ? | H1, H2, ... |
| Teknik Analisis | ? | A1, A2, ... |

**ATURAN KETAT:**
- Jumlah RM HARUS = Jumlah Tujuan (1:1 mapping)
- Jumlah Hipotesis HARUS = Jumlah hubungan variabel di kerangka berpikir
- Setiap RM HARUS punya teknik analisis yang sesuai di Bab III

## 4. ANALISIS KATA KERJA OPERASIONAL

| Tujuan | Kata Kerja | Implikasi Jenis Penelitian | Sesuai dengan Bab III? |
|:---|:---|:---|:---:|

**EDGE CASES:**
- "Mengetahui" → terlalu umum, bukan kata kerja operasional Bloom's Taxonomy
- "Mendeskripsikan" → hanya bisa dijawab dengan deskriptif, BUKAN regresi
- "Menganalisis pengaruh" → HARUS ada uji inferensial (regresi, korelasi)
- "Mengembangkan" → implikasi R&D, BUKAN survei biasa

## 5. ANALISIS KERANGKA BERPIKIR vs HIPOTESIS

- Apakah setiap panah dalam kerangka berpikir memiliki hipotesis yang sesuai?
- Apakah arah hipotesis (positif/negatif) konsisten dengan teori di Bab II?

## 6. TEMUAN INKONSISTENSI (Diurutkan berdasarkan Keparahan)

Untuk setiap inkonsistensi yang ditemukan:
| No | Elemen A | Elemen B | Jenis Inkonsistensi | Keparahan | Saran Perbaikan |

## 7. MINDMAP ALUR LOGIKA IDEAL

Buat diagram Mermaid.js yang memvisualisasikan bagaimana seharusnya benang merah proposal ini terhubung:
```mermaid
graph TD
    ...
```

Teks Proposal:
{raw_text}
"""

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=8192
    )

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Hasil Audit Koherensi & Benang Merah Lintas-Bab\n\n")
        f.write(response.choices[0].message.content)

    print(f"[Agen 6/6] Koherensi Audit selesai → {output_path}")
