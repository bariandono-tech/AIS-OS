import os
import re
import json
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# --- Font Konfigurasi ---
# Menggunakan Helvetica bawaan PDF yang mendukung native bold (<b>) dan italic (<i>).
_FONT_NAME = 'Helvetica'
_FONT_BOLD = 'Helvetica-Bold'


def clean_markdown_formatting(text):
    """
    Mengkonversi tag Markdown ke HTML yang dimengerti ReportLab,
    dan membersihkan karakter Unicode non-ASCII agar Helvetica tidak crash.
    """
    # 1. Bersihkan/konversi karakter Unicode non-ASCII yang sering menyebabkan crash
    text = text.replace('\u2014', ' -- ') # em-dash
    text = text.replace('\u2013', ' - ')  # en-dash
    text = text.replace('\u201c', '"').replace('\u201d', '"') # curly double quotes
    text = text.replace('\u2018', "'").replace('\u2019', "'") # curly single quotes
    
    # 2. Escape karakter XML yang berbahaya untuk ReportLab
    text = text.replace('&', '&amp;')
    text = text.replace('<', '&lt;').replace('>', '&gt;')
    
    # 3. Konversi Markdown bold/italic ke HTML (setelah escape)
    # Gunakan non-greedy regex untuk mencocokkan bold dan italic
    text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', text)
    return text


def _build_pdf_story(audit_result_text, metadata=None):
    styles = getSampleStyleSheet()
    
    # Custom styles menggunakan font Unicode
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName=_FONT_BOLD,
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#1A365D'),
        spaceAfter=15
    )
    
    h1_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName=_FONT_BOLD,
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#2B6CB0'),
        spaceBefore=12,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'SubSectionHeading',
        parent=styles['Heading3'],
        fontName=_FONT_BOLD,
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#2D3748'),
        spaceBefore=8,
        spaceAfter=4
    )
    
    body_style = ParagraphStyle(
        'AuditBody',
        parent=styles['Normal'],
        fontName=_FONT_NAME,
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#2D3748'),
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'AuditBullet',
        parent=styles['Normal'],
        fontName=_FONT_NAME,
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#4A5568'),
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    story = []
    
    # Title
    story.append(Paragraph("LAPORAN AUDIT DOKUMEN", title_style))
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
        
        # Skip mermaid code blocks
        if cleaned_line.startswith('```'):
            continue
            
        if cleaned_line.startswith('# '):
            story.append(Paragraph(cleaned_line[2:], title_style))
            story.append(Spacer(1, 8))
        elif cleaned_line.startswith('## '):
            story.append(Paragraph(cleaned_line[3:], h1_style))
        elif cleaned_line.startswith('### '):
            story.append(Paragraph(cleaned_line[4:], h2_style))
        elif cleaned_line.startswith('- ') or cleaned_line.startswith('* '):
            bullet_text = cleaned_line[2:]
            if bullet_text.startswith('  '):
                # Sub-bullet (indented)
                story.append(Paragraph(f"  - {bullet_text.strip()}", bullet_style))
            else:
                story.append(Paragraph(f"- {bullet_text}", bullet_style))
        else:
            story.append(Paragraph(cleaned_line, body_style))
            
    return story


def generate_pdf_report(audit_result_text, output_pdf_path, metadata=None):
    """
    Membuat file PDF profesional berdasarkan hasil audit teks dari LLM.
    Menggunakan font Unicode agar mendukung karakter Indonesia dengan baik.
    """
    # Coba ekstrak metadata dari komentar HTML di awal teks
    extracted_metadata = None
    meta_match = re.match(r"^<!-- METADATA\n(.*?)\n-->", audit_result_text, re.DOTALL)
    if meta_match:
        try:
            extracted_metadata = json.loads(meta_match.group(1))
            # Bersihkan metadata block dari text agar tidak ikut dirender di PDF
            audit_result_text = audit_result_text[meta_match.end():].strip()
        except Exception:
            pass
            
    if extracted_metadata:
        if not metadata:
            metadata = extracted_metadata
        else:
            # Tetap pertahankan data asli untuk statistik, campur compiler info
            for k, v in extracted_metadata.items():
                if k not in metadata or metadata[k] in (0, "N/A", None):
                    metadata[k] = v

    doc = SimpleDocTemplate(
        output_pdf_path,
        pagesize=A4,
        rightMargin=40, leftMargin=40,
        topMargin=40, bottomMargin=40
    )
    
    story = _build_pdf_story(audit_result_text, metadata)
            
    try:
        doc.build(story)
        return output_pdf_path
    except PermissionError:
        # Jika file dikunci oleh PDF Reader/Browser, buat file cadangan baru dengan penomoran
        base, ext = os.path.splitext(output_pdf_path)
        counter = 1
        while True:
            new_path = f"{base}_{counter}{ext}"
            try:
                # Rekonstruksi story agar bersih dari proses build pertama
                story = _build_pdf_story(audit_result_text, metadata)
                doc = SimpleDocTemplate(
                    new_path,
                    pagesize=A4,
                    rightMargin=40, leftMargin=40,
                    topMargin=40, bottomMargin=40
                )
                doc.build(story)
                print(f"\n[WARNING] File PDF utama sedang dibuka di aplikasi lain. Laporan disimpan sebagai: {new_path}")
                return new_path
            except PermissionError:
                counter += 1


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
    for line in audit_result_text.splitlines():
        stripped = line.strip()
        if "[ ]" in stripped or stripped.startswith("- [ ]") or stripped.startswith("* [ ]"):
            checklist_items.append(stripped)
            
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
    
    for line in audit_result_text.splitlines():
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
