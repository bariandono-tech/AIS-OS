import os
import re
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def clean_markdown_formatting(text):
    """
    Menghilangkan tag bold markdown (**) agar ReportLab tidak bingung,
    dan menggantinya dengan tag HTML <b>...</b> yang dimengerti ReportLab.
    """
    text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', text)
    return text

def generate_pdf_report(audit_result_text, output_pdf_path, metadata=None):
    """
    Membuat file PDF profesional berdasarkan hasil audit teks dari LLM.
    Menggunakan ReportLab Flowables untuk menangani perataan otomatis.
    """
    doc = SimpleDocTemplate(
        output_pdf_path,
        pagesize=A4,
        rightMargin=40, leftMargin=40,
        topMargin=40, bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles to look premium
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#1A365D'),
        spaceAfter=15
    )
    
    h1_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#2B6CB0'),
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SubSectionHeading',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#2D3748'),
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'AuditBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#2D3748'),
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'AuditBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#4A5568'),
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    story = []
    
    # Title
    story.append(Paragraph("LAPORAN AUDIT DOKUMEN STRATEGIS", title_style))
    story.append(Spacer(1, 10))
    
    # Metadata Table
    if metadata:
        meta_data = [
            [Paragraph("<b>Statistik Dokumen Asal</b>", h2_style), Paragraph("", h2_style)],
            [Paragraph("Jumlah Kata:", body_style), Paragraph(str(metadata.get("words", 0)), body_style)],
            [Paragraph("Jumlah Karakter:", body_style), Paragraph(str(metadata.get("characters", 0)), body_style)],
            [Paragraph("Jumlah Halaman:", body_style), Paragraph(str(metadata.get("pages", "N/A")), body_style)],
            [Paragraph("Jumlah Tabel:", body_style), Paragraph(str(metadata.get("tables_count", 0)), body_style)],
        ]
        t = Table(meta_data, colWidths=[150, 300])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F7FAFC')),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ]))
        story.append(t)
        story.append(Spacer(1, 20))
        
    # Parse lines of LLM text to PDF flowables
    lines = audit_result_text.split('\n')
    for line in lines:
        cleaned_line = clean_markdown_formatting(line.strip())
        if not cleaned_line:
            continue
            
        if cleaned_line.startswith('# '):
            story.append(Paragraph(cleaned_line[2:], title_style))
            story.append(Spacer(1, 8))
        elif cleaned_line.startswith('## '):
            story.append(Paragraph(cleaned_line[3:], h1_style))
        elif cleaned_line.startswith('### '):
            story.append(Paragraph(cleaned_line[4:], h2_style))
        elif cleaned_line.startswith('- ') or cleaned_line.startswith('* '):
            story.append(Paragraph(f"&bull; {cleaned_line[2:]}", bullet_style))
        else:
            story.append(Paragraph(cleaned_line, body_style))
            
    doc.build(story)

def generate_markdown_files(audit_result_text, output_dir):
    """
    Mengekstrak bagian-bagian tertentu dari output audit (seperti Checklist dan MiniMap)
    lalu menyimpannya sebagai file markdown terpisah.
    """
    os.makedirs(output_dir, exist_ok=True)
    
    # 1. Simpan Laporan Penuh
    full_report_path = os.path.join(output_dir, "laporan_audit.md")
    with open(full_report_path, "w", encoding="utf-8") as f:
        f.write(audit_result_text)
        
    # 2. Ekstrak Checklist Tindakan (PRD Checklist)
    checklist_items = []
    # Cari pola `- [ ]` atau `[ ]`
    for line in audit_result_text.split('\n'):
        if "[ ]" in line or "- [ ]" in line:
            checklist_items.append(line.strip())
            
    checklist_path = os.path.join(output_dir, "checklist_perbaikan.md")
    with open(checklist_path, "w", encoding="utf-8") as f:
        f.write("# CHECKLIST PERBAIKAN DOKUMEN (PRD)\n\n")
        f.write("Daftar tindakan perbaikan yang harus diselesaikan untuk meningkatkan kualitas dokumen:\n\n")
        if checklist_items:
            for item in checklist_items:
                f.write(f"{item}\n")
        else:
            f.write("- [ ] Tinjau kembali seluruh dokumen untuk temuan detail.\n")
            
    # 3. Ekstrak Visual MiniMap/Mermaid Diagram jika ada
    minimap_content = []
    in_mermaid_block = False
    
    for line in audit_result_text.split('\n'):
        if "```mermaid" in line:
            in_mermaid_block = True
            minimap_content.append(line)
            continue
        elif in_mermaid_block and "```" in line:
            in_mermaid_block = False
            minimap_content.append(line)
            continue
            
        if in_mermaid_block:
            minimap_content.append(line)
        elif "MINDMAP" in line or "Struktur Konsep" in line or line.startswith("  *") or line.startswith("    *"):
            minimap_content.append(line)
            
    minimap_path = os.path.join(output_dir, "minimap.md")
    with open(minimap_path, "w", encoding="utf-8") as f:
        f.write("# MAP STRUKTUR DOKUMEN (MINIMAP)\n\n")
        if minimap_content:
            f.write("\n".join(minimap_content))
        else:
            f.write("Peta visual terstruktur tidak terdeteksi secara otomatis di laporan. Harap tinjau versi PDF untuk melihat peta struktur dokumen.\n")
            
    return {
        "full_report": full_report_path,
        "checklist": checklist_path,
        "minimap": minimap_path
    }
