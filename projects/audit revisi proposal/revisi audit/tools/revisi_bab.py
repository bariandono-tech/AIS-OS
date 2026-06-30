"""
Agen Writing: Revisi Per-Bab (Stage 5)
Membaca draf mentah + temuan audit, menghasilkan revisi per-bab.
Provider: Claude/Dinoiki (berbayar) — writing membutuhkan reasoning mendalam.
"""
import os
import glob
from llm_provider import get_client


def _load_build_schema():
    """Load the build_schema.md format rules for injection into prompts."""
    schema_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        '..', 'templates', 'build_schema.md'
    )
    if os.path.exists(schema_path):
        with open(schema_path, 'r', encoding='utf-8') as f:
            return f.read()
    # Fallback minimal rules if template not found
    return """FORMAT RULES:
- # untuk judul BAB (dua baris: # BAB I lalu # PENDAHULUAN)
- ## untuk sub-bab (e.g. ## 1.1  Latar Belakang)
- ### untuk sub-sub-bab (e.g. ### 1.4.1  Manfaat Teoritis)
- **bold** untuk teks tebal, *italic* untuk istilah asing
- Tabel caption: **Tabel X.X Judul** (baris sendiri sebelum tabel)
- Tabel source: *Sumber: ...* (baris sendiri sesudah tabel)
- Setiap paragraf = satu baris utuh
"""


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

    # Load build schema for format enforcement
    build_schema = _load_build_schema()

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

FORMAT OUTPUT WAJIB — IKUTI DENGAN TEPAT:
Output Anda akan diproses secara otomatis oleh document builder menjadi file Word (.docx).
Anda HARUS mengikuti format Markdown yang presisi berikut ini:

{build_schema}

ATURAN FORMAT KRITIS:
- Heading # HANYA untuk judul BAB (dua baris: # BAB I lalu # PENDAHULUAN)
- Heading ## untuk sub-bab (e.g. ## 1.1  Latar Belakang — GUNAKAN DUA SPASI antara nomor dan judul)
- Heading ### untuk sub-sub-bab (e.g. ### 1.4.1  Manfaat Teoritis)
- JANGAN gunakan heading ####
- Setiap paragraf = SATU BARIS UTUH (jangan wrap manual)
- Caption tabel = **Tabel X.X Judul** (baris terpisah, bold)
- Source tabel = *Sumber: ...* (baris terpisah, italic)
- Caption gambar = **Gambar X.X Judul** (baris terpisah, bold)
- Numbered list = 1. Item (bukan bullet -)
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

    # Load build schema for format enforcement
    build_schema = _load_build_schema()

    prompt = f"""Anda adalah editor Daftar Pustaka profesional. Tugas Anda: memperbaiki dan menyusun ulang Daftar Pustaka dari proposal skripsi berikut berdasarkan temuan audit sitasi.

ATURAN:
1. Susun Daftar Pustaka secara ALFABETIS berdasarkan nama belakang penulis pertama.
2. Pastikan SETIAP kutipan (Nama, Tahun) yang muncul di teks Bab 1-3 memiliki entri di Daftar Pustaka.
3. Tandai entri yang ada di Daftar Pustaka tapi TIDAK PERNAH dikutip di teks sebagai "[TIDAK DIKUTIP]".
4. Tandai kutipan di teks yang TIDAK ADA di Daftar Pustaka sebagai "[REFERENSI HILANG]".
5. Perbaiki format ke standar APA 7th Edition jika memungkinkan.
6. Cetak miring (*italic*) judul jurnal dan judul buku.
7. JANGAN menambahkan referensi baru yang tidak ada di draf asli.

FORMAT OUTPUT WAJIB — IKUTI DENGAN TEPAT:
Output Anda akan diproses secara otomatis oleh document builder menjadi file Word (.docx).

ATURAN FORMAT KRITIS DAFTAR PUSTAKA:
- Mulai dengan heading: # DAFTAR PUSTAKA
- Setiap entri = SATU BARIS UTUH (satu paragraf, jangan wrap)
- Judul buku dalam *italic*: *Research design: Qualitative...*
- Volume jurnal dalam *italic*: *8*(2), 502–518.
- Format APA 7th Edition
- Urut ALFABETIS berdasarkan nama belakang penulis pertama
- JANGAN gunakan bullet (-) atau numbered list (1.) untuk entri dapus
- Di akhir dokumen, tambahkan:
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
