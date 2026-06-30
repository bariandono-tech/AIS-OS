"""
Agen Verification Pass (Stage 6)
Cross-checks setiap temuan audit terhadap draf revisi.
Menghasilkan tabel kepatuhan dan verdik LULUS / PERLU REVISI ULANG.
Provider: Claude/Dinoiki (berbayar) — QA membutuhkan analisis silang mendalam.
"""
import os
import glob
from llm_provider import get_client


def run_verification(tmp_dir, revisi_dir, output_path):
    """
    Cross-check all audit findings against revised drafts.
    
    Args:
        tmp_dir: Path to .tmp/ directory containing audit reports
        revisi_dir: Path to revision directory containing 05-revisi-*.md files
        output_path: Where to write the verification report
    """
    print("[Verification] Memulai cross-check temuan audit vs draf revisi...")
    
    # Load all audit reports
    audit_files = sorted(glob.glob(os.path.join(tmp_dir, "0[2-7]-*.md")))
    audit_combined = []
    for filepath in audit_files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        filename = os.path.basename(filepath)
        audit_combined.append(f"=== AUDIT: {filename} ===\n{content}")
    audit_text = "\n\n".join(audit_combined)
    
    # Load all revision files
    revisi_files = sorted(glob.glob(os.path.join(revisi_dir, "05-revisi-*.md")))
    if not revisi_files:
        print(f"Error: No revision files found in {revisi_dir}")
        return False
    
    revisi_combined = []
    for filepath in revisi_files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        filename = os.path.basename(filepath)
        revisi_combined.append(f"=== REVISI: {filename} ===\n{content}")
    revisi_text = "\n\n".join(revisi_combined)

    client, model = get_client()  # Uses LLM_PROVIDER from .env

    prompt = f"""Anda adalah Quality Assurance akademik. Tugas Anda SATU: memverifikasi bahwa SELURUH temuan audit telah diterapkan di draf revisi.

INSTRUKSI KETAT:
1. Baca SEMUA file audit di bawah. Ekstrak SETIAP temuan individual (setiap baris tabel, setiap poin masalah).
2. Baca SEMUA file revisi di bawah.
3. Untuk SETIAP temuan audit, cari bukti bahwa temuan tersebut sudah diterapkan di draf revisi.
4. Buat tabel cross-check LENGKAP.

FORMAT OUTPUT WAJIB:

## Ringkasan Verifikasi
- Total temuan audit: [angka]
- Sudah diperbaiki (✅): [angka]
- Belum diperbaiki (❌): [angka]
- Persentase kepatuhan: [angka]%
- **Verdik: LULUS / PERLU REVISI ULANG** (threshold: 90%)

## Tabel Verifikasi Temuan Audit

| No | Sumber Audit | Temuan | Diterapkan? | Bukti (Kutipan dari Revisi) |
|:---|:---|:---|:---:|:---|
| 1 | ... | ... | ✅/❌ | "..." |

## Temuan yang Belum Diperbaiki
Daftar temuan audit yang TIDAK ditemukan bukti perbaikannya di draf revisi.
Untuk setiap temuan, jelaskan:
- Apa yang seharusnya diperbaiki
- Di bab mana seharusnya perbaikan tersebut muncul
- Tingkat urgensi (KRITIS / PENTING / OPSIONAL)

## Pengecekan Tambahan

### Istilah Asing yang Belum Di-Italic
Daftar istilah asing yang masih ditulis tegak (bukan miring) di draf revisi.

### Frasa AI Generik yang Terdeteksi
Daftar frasa seperti "penting untuk diingat", "berikut adalah", "dapat disimpulkan bahwa" yang masih muncul di draf revisi.

### Paragraf yang Tidak Natural
Paragraf yang terasa "bukan suara mahasiswa" — terlalu formal, terlalu robot, atau terlalu sempurna.

---

FILE AUDIT:
{audit_text}

FILE REVISI:
{revisi_text}
"""

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=16384
    )

    result = response.choices[0].message.content

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Verification Pass — Laporan QA\n\n")
        f.write(result)

    print(f"[Verification] Selesai → {output_path}")
    return True
