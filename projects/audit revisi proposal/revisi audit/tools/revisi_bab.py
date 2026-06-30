"""
Agen Writing: Revisi Per-Bab (Stage 5)
Membaca draf mentah + temuan audit, menghasilkan revisi per-bab.
Provider: Claude/Dinoiki (berbayar) — writing membutuhkan reasoning mendalam.
"""
import os
import glob
from llm_provider import get_client


def _load_audit_reports(tmp_dir):
    """Load all audit report files from .tmp/ directory."""
    audit_files = sorted(glob.glob(os.path.join(tmp_dir, "0[2-7]-*.md")))
    combined = []
    for filepath in audit_files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        filename = os.path.basename(filepath)
        combined.append(f"=== {filename} ===\n{content}")
    return "\n\n".join(combined)


def _load_catatan_dosen(revisi_dir):
    """Load optional dosen notes if they exist."""
    catatan_path = os.path.join(revisi_dir, "catatan-dosen.md")
    if os.path.exists(catatan_path):
        with open(catatan_path, 'r', encoding='utf-8') as f:
            return f.read()
    return None


def run_revisi_bab(raw_text_path, tmp_dir, revisi_dir, bab_number, output_path):
    """
    Revise a specific chapter (bab) based on audit findings.
    
    Args:
        raw_text_path: Path to 01-raw-extraction.txt (original draft)
        tmp_dir: Path to .tmp/ directory containing audit reports
        revisi_dir: Path to the revision output directory (for catatan-dosen.md)
        bab_number: Chapter number (1, 2, or 3)
        output_path: Where to write the revised chapter
    """
    bab_label = f"Bab {bab_number}"
    bab_map = {1: "Pendahuluan", 2: "Tinjauan Pustaka", 3: "Metodologi Penelitian"}
    bab_name = bab_map.get(bab_number, f"Bab {bab_number}")
    
    print(f"[Writing] Merevisi {bab_label}: {bab_name}...")
    
    if not os.path.exists(raw_text_path):
        print(f"Error: {raw_text_path} not found.")
        return False

    with open(raw_text_path, 'r', encoding='utf-8') as f:
        raw_text = f.read()[:100000]

    audit_reports = _load_audit_reports(tmp_dir)
    catatan_dosen = _load_catatan_dosen(revisi_dir)

    # Build the prompt
    catatan_section = ""
    if catatan_dosen:
        catatan_section = f"""

CATATAN TAMBAHAN DARI DOSEN PEMBIMBING:
{catatan_dosen}

Catatan dosen ini memiliki PRIORITAS TERTINGGI. Jika catatan dosen bertentangan dengan temuan audit, ikuti catatan dosen.
"""

    # Use Claude for deep reasoning
    client, model = get_client()  # Uses LLM_PROVIDER from .env

    prompt = f"""Anda adalah REVISOR skripsi profesional. Tugas Anda: merevisi {bab_label} ({bab_name}) dari proposal skripsi berikut berdasarkan temuan audit yang telah dilakukan oleh tim auditor.

ATURAN MUTLAK — BACA DAN PATUHI SEBELUM MENULIS:
1. Anda adalah REVISOR, BUKAN PENULIS. Anda TIDAK BOLEH menulis dari nol.
2. Mulai dari draf asli {bab_label} di bawah, lalu TERAPKAN perbaikan sesuai temuan audit.
3. PERTAHANKAN ide asli, argumen utama, dan gaya bahasa mahasiswa sebisa mungkin.
4. JANGAN menambahkan teori, variabel, atau referensi baru yang tidak ada di draf asli, KECUALI temuan audit secara eksplisit memintanya.
5. JANGAN gunakan frasa AI generik:
   - "penting untuk diingat"
   - "berikut adalah"  
   - "dapat disimpulkan bahwa"
   - "dalam era globalisasi"
   - "tidak bisa dipungkiri"
   - "perlu dicatat bahwa"
   - "hal ini menunjukkan bahwa"
6. WAJIB cetak miring (*italic*) setiap istilah asing (Bahasa Inggris, Latin, dll).
7. Jika temuan audit saling bertentangan, prioritaskan benang merah (koherensi) di atas ejaan.
8. Output HARUS berupa teks {bab_label} yang sudah direvisi secara UTUH (bukan daftar perubahan).

FORMAT OUTPUT:
- Gunakan heading Markdown yang rapi (## untuk sub-bab, ### untuk sub-sub-bab)
- Sertakan sitasi dalam format (Nama, Tahun) sesuai draf asli
- Di akhir dokumen, tambahkan section:
  ## Catatan Revisi
  Daftar perubahan yang dilakukan beserta alasan, merujuk ke temuan audit mana.
{catatan_section}
TEMUAN AUDIT DARI TIM AUDITOR:
{audit_reports}

DRAF ASLI LENGKAP (cari bagian {bab_label} dan fokus di situ):
{raw_text}
"""

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=16384
    )

    result = response.choices[0].message.content

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(f"# Hasil Revisi {bab_label}: {bab_name}\n\n")
        f.write(result)

    print(f"[Writing] {bab_label} selesai → {output_path}")
    return True


def run_revisi_daftar_pustaka(raw_text_path, tmp_dir, revisi_dir, output_path):
    """
    Revise the bibliography (Daftar Pustaka) based on audit findings.
    """
    print("[Writing] Merevisi Daftar Pustaka...")
    
    if not os.path.exists(raw_text_path):
        print(f"Error: {raw_text_path} not found.")
        return False

    with open(raw_text_path, 'r', encoding='utf-8') as f:
        raw_text = f.read()[:100000]

    audit_reports = _load_audit_reports(tmp_dir)
    catatan_dosen = _load_catatan_dosen(revisi_dir)

    catatan_section = ""
    if catatan_dosen:
        catatan_section = f"""

CATATAN TAMBAHAN DARI DOSEN PEMBIMBING:
{catatan_dosen}
"""

    client, model = get_client()  # Uses LLM_PROVIDER from .env

    prompt = f"""Anda adalah editor Daftar Pustaka profesional. Tugas Anda: memperbaiki dan menyusun ulang Daftar Pustaka dari proposal skripsi berikut berdasarkan temuan audit sitasi.

ATURAN:
1. Susun Daftar Pustaka secara ALFABETIS berdasarkan nama belakang penulis pertama.
2. Pastikan SETIAP kutipan (Nama, Tahun) yang muncul di teks Bab 1-3 memiliki entri di Daftar Pustaka.
3. Tandai entri yang ada di Daftar Pustaka tapi TIDAK PERNAH dikutip di teks sebagai "[TIDAK DIKUTIP]".
4. Tandai kutipan di teks yang TIDAK ADA di Daftar Pustaka sebagai "[REFERENSI HILANG]".
5. Perbaiki format ke standar APA 7th Edition jika memungkinkan.
6. Cetak miring (*italic*) judul jurnal dan judul buku.
7. JANGAN menambahkan referensi baru yang tidak ada di draf asli.

FORMAT OUTPUT:
## Daftar Pustaka (Revisi)
[daftar pustaka yang sudah diperbaiki]

## Catatan Revisi Daftar Pustaka
- Daftar perubahan yang dilakukan
- Referensi yang hilang (perlu dicari mahasiswa)
- Referensi yang tidak dikutip (pertimbangkan untuk dihapus)
{catatan_section}
TEMUAN AUDIT:
{audit_reports}

DRAF ASLI LENGKAP:
{raw_text}
"""

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=16384
    )

    result = response.choices[0].message.content

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Hasil Revisi Daftar Pustaka\n\n")
        f.write(result)

    print(f"[Writing] Daftar Pustaka selesai → {output_path}")
    return True
