"""
Agen 7: Konsolidasi & PDF Report Generator
Menerima combined markdown (atau dua file terpisah untuk backward compatibility)
dan menghasilkan PDF final.
"""
import os
from markdown_pdf import MarkdownPdf, Section

def generate_pdf(input_md_or_puebi, struktur_md, output_pdf):
    """
    Generate PDF from markdown report(s).
    
    Supports two modes:
    1. Single file mode: input_md_or_puebi = combined markdown, struktur_md = None
    2. Legacy two-file mode: input_md_or_puebi = puebi report, struktur_md = struktur report
    """
    print("Generating Final Audit Report PDF...")
    
    try:
        if struktur_md is None:
            # Single combined file mode (Pro Max pipeline)
            with open(input_md_or_puebi, 'r', encoding='utf-8') as f:
                combined_md = f.read()
        else:
            # Legacy two-file mode (backward compatible)
            with open(input_md_or_puebi, 'r', encoding='utf-8') as f:
                puebi_text = f.read()
            with open(struktur_md, 'r', encoding='utf-8') as f:
                struktur_text = f.read()
            combined_md = f"""# FINAL AUDIT REPORT: PROPOSAL SKRIPSI

---

{struktur_text}

---

{puebi_text}
"""
    except FileNotFoundError as e:
        print(f"Error reading report files: {e}")
        return

    # Generate PDF
    pdf = MarkdownPdf(toc_level=2)
    pdf.add_section(Section(combined_md, toc=False))
    pdf.meta["title"] = "Laporan Audit Proposal — Tier Pro Max"
    
    pdf.save(output_pdf)
    print(f"✅ SUCCESS! Final Audit Report saved to: {output_pdf}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.abspath(os.path.join(current_dir, ".."))
    generate_pdf(
        os.path.join(project_dir, ".tmp", "08-combined-report.md"),
        None,
        os.path.join(project_dir, "Final_Audit_Report.pdf")
    )
