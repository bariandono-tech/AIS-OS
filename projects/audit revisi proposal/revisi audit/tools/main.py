"""
main.py — Orkestrator Pipeline Audit (Fase A)
Menjalankan 6 agen audit secara berurutan (PUEBI, Register, Sitasi, Struktur,
Metodologi, Koherensi), lalu menghasilkan Final Report PDF.
Fitur: retry logic (3x), skip-if-exists, error isolation per agen.
"""
import sys
import os
import time
import traceback

# Add tools directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from extract_pdf import extract_text_from_pdf
from audit_puebi import run_puebi_audit
from audit_register import run_register_audit
from audit_sitasi import run_sitasi_audit
from audit_struktur import run_structure_audit
from audit_metodologi import run_metodologi_audit
from audit_koherensi import run_koherensi_audit
from generate_pdf_report import generate_pdf


def run_with_retry(fn, *args, max_retries=3, delay=30):
    """
    Menjalankan fungsi dengan retry logic.
    Jika gagal, tunggu `delay` detik lalu coba lagi (max 3x).
    Mengembalikan True jika berhasil, False jika gagal setelah semua retry.
    """
    for attempt in range(1, max_retries + 1):
        try:
            fn(*args)
            return True
        except Exception as e:
            error_type = type(e).__name__
            if attempt < max_retries:
                wait = delay * attempt  # exponential backoff: 30s, 60s, 90s
                print(f"\n  ⚠️  Attempt {attempt}/{max_retries} GAGAL: {error_type}")
                print(f"      {str(e)[:200]}")
                print(f"      Menunggu {wait}s sebelum retry...\n")
                time.sleep(wait)
            else:
                print(f"\n  ❌ GAGAL setelah {max_retries} percobaan: {error_type}")
                print(f"      {str(e)[:300]}")
                print(f"      Agen ini dilewati. Pipeline melanjutkan ke agen berikutnya.\n")
                return False


def should_skip(filepath):
    """Cek apakah file sudah ada dan cukup besar (> 100 bytes)."""
    if os.path.exists(filepath) and os.path.getsize(filepath) > 100:
        return True
    return False


def main():
    start_time = time.time()
    project_dir = os.path.abspath(os.path.join(current_dir, ".."))
    tmp_dir = os.path.join(project_dir, ".tmp")
    
    # Ensure .tmp directory exists
    os.makedirs(tmp_dir, exist_ok=True)
    
    pdf_input = sys.argv[1] if len(sys.argv) > 1 else os.path.join(tmp_dir, "proposal.pdf")
    
    print("=" * 60)
    print("  AGENTIC PROPOSAL AUDIT — FASE A (6 AGEN AUDIT)")
    print("=" * 60)
    print(f"  Input: {pdf_input}")
    print(f"  Output: {os.path.join(project_dir, 'Final_Audit_Report.pdf')}")
    print("=" * 60)
    
    # Define all intermediate file paths
    paths = {
        "raw":        os.path.join(tmp_dir, "01-raw-extraction.txt"),
        "puebi":      os.path.join(tmp_dir, "02-audit-puebi.md"),
        "register":   os.path.join(tmp_dir, "03-audit-register.md"),
        "sitasi":     os.path.join(tmp_dir, "04-audit-sitasi.md"),
        "struktur":   os.path.join(tmp_dir, "05-audit-struktur.md"),
        "metodologi": os.path.join(tmp_dir, "06-audit-metodologi.md"),
        "koherensi":  os.path.join(tmp_dir, "07-audit-koherensi.md"),
        "final_pdf":  os.path.join(project_dir, "Final_Audit_Report.pdf"),
    }
    
    # ─── STAGE 0: Extraction ────────────────────────────────
    print("\n▶ STAGE 0: Mengekstrak teks dari PDF...")
    extract_text_from_pdf(pdf_input, paths["raw"])
    
    # ─── LAYER 1: Audit Permukaan (PUEBI, Register, Sitasi) ─
    print("\n" + "─" * 60)
    print("  LAYER 1: AUDIT PERMUKAAN (PUEBI, Register, Sitasi)")
    print("─" * 60)
    
    success_count = 0
    total_agents = 6
    
    agents = [
        ("Agen 1/6 — PUEBI",      paths["puebi"],      run_puebi_audit),
        ("Agen 2/6 — Register",    paths["register"],   run_register_audit),
        ("Agen 3/6 — Sitasi",      paths["sitasi"],     run_sitasi_audit),
    ]
    
    for label, output_path, fn in agents:
        if should_skip(output_path):
            print(f"\n  ⏭️  {label} sudah ada, dilewati: {os.path.basename(output_path)}")
            success_count += 1
        else:
            if run_with_retry(fn, paths["raw"], output_path):
                success_count += 1
    
    # ─── LAYER 2: Audit Substansi (Struktur, Metodologi, Koherensi) ─
    print("\n" + "─" * 60)
    print("  LAYER 2: AUDIT SUBSTANSI (Struktur, Metodologi, Koherensi)")
    print("─" * 60)
    
    agents_l2 = [
        ("Agen 4/6 — Struktur",    paths["struktur"],    run_structure_audit),
        ("Agen 5/6 — Metodologi",  paths["metodologi"],  run_metodologi_audit),
        ("Agen 6/6 — Koherensi",   paths["koherensi"],   run_koherensi_audit),
    ]
    
    for label, output_path, fn in agents_l2:
        if should_skip(output_path):
            print(f"\n  ⏭️  {label} sudah ada, dilewati: {os.path.basename(output_path)}")
            success_count += 1
        else:
            if run_with_retry(fn, paths["raw"], output_path):
                success_count += 1
    
    print(f"\n  Audit selesai: {success_count}/{total_agents} agen berhasil")
    
    if success_count < total_agents:
        print(f"  ⚠️  {total_agents - success_count} agen gagal. Lihat log di atas untuk detail.")
    
    # ─── LAYER 3: Konsolidasi & PDF ────────────────────────
    print("\n" + "─" * 60)
    print("  LAYER 3: KONSOLIDASI FINAL REPORT")
    print("─" * 60)
    
    # Combine all 6 audit reports into one markdown
    combined_md_path = os.path.join(tmp_dir, "08-combined-report.md")
    
    report_files = [
        ("AUDIT PUEBI & EJAAN", paths["puebi"]),
        ("AUDIT REGISTER & BAHASA AKADEMIK", paths["register"]),
        ("AUDIT SITASI & DAFTAR PUSTAKA", paths["sitasi"]),
        ("AUDIT STRUKTUR & RESEARCH GAP", paths["struktur"]),
        ("AUDIT METODOLOGI BAB III", paths["metodologi"]),
        ("AUDIT KOHERENSI & BENANG MERAH", paths["koherensi"]),
    ]
    
    with open(combined_md_path, 'w', encoding='utf-8') as combined:
        combined.write("# LAPORAN AUDIT PROPOSAL — TIER PRO MAX\n\n")
        combined.write("---\n\n")
        
        for title, filepath in report_files:
            if os.path.exists(filepath):
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                combined.write(f"\n\n---\n\n# {title}\n\n")
                combined.write(content)
                combined.write("\n")
            else:
                combined.write(f"\n\n---\n\n# {title}\n\n*⚠️ File tidak ditemukan: {filepath}*\n")
    
    print(f"  Combined report saved to {combined_md_path}")
    
    # Generate PDF from combined markdown
    try:
        generate_pdf(combined_md_path, None, paths["final_pdf"])
    except Exception as e:
        print(f"  ⚠️  PDF generation gagal: {e}")
        print(f"  📄  Anda masih bisa membaca laporan di: {combined_md_path}")
    
    elapsed = time.time() - start_time
    minutes = int(elapsed // 60)
    seconds = int(elapsed % 60)
    
    print("\n" + "=" * 60)
    print(f"  ✅ AUDIT SELESAI! Waktu: {minutes}m {seconds}s")
    print(f"  📄 Laporan: {paths['final_pdf']}")
    print(f"  📁 File detail: {tmp_dir}")
    print(f"  📊 Berhasil: {success_count}/{total_agents} agen")
    print("=" * 60)

if __name__ == "__main__":
    main()
