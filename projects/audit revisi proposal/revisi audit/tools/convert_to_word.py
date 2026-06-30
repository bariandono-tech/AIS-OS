"""
convert_to_word.py — Simplified document converter.

Calls build_revisi.js (Node.js dynamic builder) to convert
schema-compliant Markdown files into a formatted Word document.

No more HTML parsing or BeautifulSoup — the Markdown files are read
directly by build_revisi.js using the same docx_helpers.js formatting
module as the original build_makalah.js.
"""
import os
import sys
import subprocess


def run_build_document(revisi_dir):
    """
    Build a Word document from revision Markdown files.

    Uses build_revisi.js (Node.js) which reads 05-revisi-bab*.md files
    directly and produces a formatted .docx using the same styling
    helpers as the original build_makalah.js.

    Args:
        revisi_dir: Directory containing 05-revisi-bab*.md files
    """
    script_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    script_path = os.path.join(script_dir, "build_revisi.js")

    out_docx = os.path.join(revisi_dir, "Makalah_Revisi.docx")

    # Validate input files exist
    expected_files = [
        "05-revisi-bab1.md",
        "05-revisi-bab2.md",
        "05-revisi-bab3.md",
        "05-revisi-daftar-pustaka.md"
    ]

    missing = [f for f in expected_files if not os.path.exists(os.path.join(revisi_dir, f))]
    if missing:
        print(f"⚠️  File revisi belum lengkap, belum bisa build docx:")
        for f in missing:
            print(f"   - {f}")
        return False

    print(f"Menjalankan build_revisi.js (Node.js dynamic builder)...")
    print(f"  Input:  {revisi_dir}")
    print(f"  Output: {out_docx}")

    try:
        subprocess.check_call(
            ["node", "build_revisi.js", revisi_dir, out_docx],
            cwd=script_dir
        )
        print(f"✅ Dokumen Word berhasil dibuat: {out_docx}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Gagal menjalankan build_revisi.js: {e}")
        return False
    except FileNotFoundError:
        print(f"❌ Node.js tidak terdeteksi. Pastikan 'node' ada di PATH.")
        return False


if __name__ == "__main__":
    if len(sys.argv) > 1:
        revisi_dir = os.path.abspath(sys.argv[1])
    else:
        revisi_dir = os.path.abspath(os.path.join(
            os.path.dirname(__file__), "..",
            "outputs", "analisis-anggaran-rudenim", "revisi-v1"
        ))
    run_build_document(revisi_dir)
