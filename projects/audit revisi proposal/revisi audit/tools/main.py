"""
main.py — Orkestrator Pipeline 7 Agen Pro Max
Menjalankan 6 agen audit secara berurutan, lalu menghasilkan Final Report PDF.
Layer 1 (Agen 1-3): Gemini/Gratis — audit permukaan
Layer 2 (Agen 4-6): Dinoiki/Claude — audit substansi  
Layer 3 (Agen 7): Konsolidasi & PDF
"""
import sys
import os
import time

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

def main():
    start_time = time.time()
    project_dir = os.path.abspath(os.path.join(current_dir, ".."))
    tmp_dir = os.path.join(project_dir, ".tmp")
    
    # Ensure .tmp directory exists
    os.makedirs(tmp_dir, exist_ok=True)
    
    pdf_input = sys.argv[1] if len(sys.argv) > 1 else os.path.join(tmp_dir, "proposal.pdf")
    
    print("=" * 60)
    print("  AGENTIC PROPOSAL AUDIT — TIER PRO MAX (7 AGEN)")
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
    
    # ─── LAYER 1: Audit Permukaan (Gemini/Gratis) ──────────
    print("\n" + "─" * 60)
    print("  LAYER 1: AUDIT PERMUKAAN (Gemini — Gratis)")
    print("─" * 60)
    
    run_puebi_audit(paths["raw"], paths["puebi"])
    run_register_audit(paths["raw"], paths["register"])
    run_sitasi_audit(paths["raw"], paths["sitasi"])
    
    # ─── LAYER 2: Audit Substansi (Claude/Berbayar) ────────
    print("\n" + "─" * 60)
    print("  LAYER 2: AUDIT SUBSTANSI (Claude — Premium)")
    print("─" * 60)
    
    run_structure_audit(paths["raw"], paths["struktur"])
    run_metodologi_audit(paths["raw"], paths["metodologi"])
    run_koherensi_audit(paths["raw"], paths["koherensi"])
    
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
    generate_pdf(combined_md_path, None, paths["final_pdf"])
    
    elapsed = time.time() - start_time
    minutes = int(elapsed // 60)
    seconds = int(elapsed % 60)
    
    print("\n" + "=" * 60)
    print(f"  ✅ AUDIT SELESAI! Waktu: {minutes}m {seconds}s")
    print(f"  📄 Laporan: {paths['final_pdf']}")
    print(f"  📁 File detail: {tmp_dir}")
    print("=" * 60)

if __name__ == "__main__":
    main()
