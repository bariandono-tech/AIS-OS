import os
import sys
import subprocess
import json
import re

try:
    import markdown
    from bs4 import BeautifulSoup
except ImportError:
    print("Installing dependencies...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "markdown", "beautifulsoup4"])
    import markdown
    from bs4 import BeautifulSoup

def clean_llm_markdown(md_text):
    """
    Membersihkan teks meta dari LLM sebelum diparsing.
    Misalnya baris yang berisi '# Hasil Revisi' atau sapaan.
    """
    lines = md_text.split('\n')
    cleaned = []
    for line in lines:
        if line.strip().startswith('# Hasil Revisi'):
            continue
        cleaned.append(line)
    return '\n'.join(cleaned)

def parse_html_to_json(html_content):
    """
    Menggunakan BeautifulSoup untuk memparsing HTML menjadi struktur JSON
    yang bisa dibaca oleh build_makalah.js (Node.js).
    Ini jauh lebih tangguh daripada regex/startswith.
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    blocks = []
    
    for element in soup.find_all(recursive=False):
        if element.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            text = element.get_text(strip=True)
            if not text: continue
            
            # Khusus untuk "Tabel 1.1" atau "Gambar 2.1" yang mungkin keliru jadi header oleh LLM
            if text.startswith('Tabel'):
                blocks.append({"type": "table_caption", "text": text})
            elif text.startswith('Gambar'):
                blocks.append({"type": "image_caption", "text": text})
            else:
                blocks.append({"type": element.name, "text": text})
                
        elif element.name == 'p':
            # Kembalikan string HTML-nya agar parseMarkdownRuns di JS bisa mendeteksi <strong> dan <em>
            # Ataukah lebih baik kita konversi tag html kembali ke markdown asterisks?
            # Karena build_makalah.js mengharapkan **bold** dan *italic*, kita ubah tag HTML 
            # kembali ke markdown style untuk dikirim ke JS.
            text = ""
            for child in element.children:
                if child.name in ['strong', 'b']:
                    text += f"**{child.get_text()}**"
                elif child.name in ['em', 'i']:
                    text += f"*{child.get_text()}*"
                else:
                    text += getattr(child, 'text', str(child))
            
            text = text.strip()
            if not text: continue
            
            # Deteksi manual caption dan source
            if text.startswith('Tabel'):
                blocks.append({"type": "table_caption", "text": text})
            elif text.startswith('Sumber:') or text.startswith('*Sumber:'):
                blocks.append({"type": "table_source", "text": text.replace('*', '')})
            elif text.startswith('Gambar'):
                blocks.append({"type": "image_caption", "text": text})
            elif text.startswith('[Flowchart'):
                blocks.append({"type": "image_placeholder", "text": text})
            else:
                blocks.append({"type": "p", "text": text})
                
        elif element.name in ['ul', 'ol']:
            for li in element.find_all('li', recursive=False):
                text = ""
                for child in li.children:
                    if child.name in ['strong', 'b']:
                        text += f"**{child.get_text()}**"
                    elif child.name in ['em', 'i']:
                        text += f"*{child.get_text()}*"
                    else:
                        text += getattr(child, 'text', str(child))
                blocks.append({"type": "list_item", "text": text.strip()})
                
        elif element.name == 'table':
            table_data = []
            for row in element.find_all('tr'):
                cols = row.find_all(['td', 'th'])
                row_data = []
                for col in cols:
                    text = ""
                    for child in col.children:
                        if child.name in ['strong', 'b']:
                            text += f"**{child.get_text()}**"
                        elif child.name in ['em', 'i']:
                            text += f"*{child.get_text()}*"
                        else:
                            text += getattr(child, 'text', str(child))
                    row_data.append(text.strip())
                if row_data:
                    table_data.append(row_data)
            if table_data:
                blocks.append({"type": "table", "content": table_data})

    return blocks

def parse_markdown_robust(filepath):
    """
    Membaca MD, ubah ke HTML pakai library resmi, lalu parsing ke JSON.
    Ini anti-error dari variasi spasi/format aneh LLM.
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        md_text = f.read()
        
    md_text = clean_llm_markdown(md_text)
    
    # Ekstensi tabel sangat penting agar markdown.markdown mengenali tabel
    html_content = markdown.markdown(md_text, extensions=['tables'])
    
    return parse_html_to_json(html_content)

def clean_and_build_json(revisi_dir):
    """
    Membaca semua file MD, memparsing menjadi JSON block yang ROBUST.
    """
    files = ["05-revisi-bab1.md", "05-revisi-bab2.md", "05-revisi-bab3.md", "05-revisi-daftar-pustaka.md"]
    data_revisi = {}
    
    for filename in files:
        filepath = os.path.join(revisi_dir, filename)
        if os.path.exists(filepath):
            key = filename.replace('.md', '')
            data_revisi[key] = parse_markdown_robust(filepath)
            
    json_path = os.path.join(revisi_dir, "data_revisi.json")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data_revisi, f, ensure_ascii=False, indent=2)
        
    return json_path

def run_build_document(revisi_dir):
    """
    Fungsi pembantu untuk dipanggil dari main_writing.py
    Menggunakan build_makalah.js asli agar format 100% identik!
    """
    print(f"Membangun data JSON untuk NodeJS dari {revisi_dir} secara ROBUST...")
    json_path = clean_and_build_json(revisi_dir)
    
    out_docx1 = os.path.join(revisi_dir, "makalah_seminar_final_1.docx")
    out_docx2 = os.path.join(revisi_dir, "makalah_seminar_final_2.docx")
    
    script_path = r"d:\WORKSPACE\AIS-OS\skripsi\drafts\build_makalah.js"
    
    print(f"Menjalankan build_makalah.js (Node.js engine) untuk mempertahankan layout akademis...")
    try:
        # Pindah ke direktori skripsi/drafts agar kerangka_penelitian.png terbaca
        cwd = r"d:\WORKSPACE\AIS-OS\skripsi\drafts"
        subprocess.check_call(
            ["node", "build_makalah.js", json_path, out_docx1, out_docx2],
            cwd=cwd
        )
        print(f"✅ Dokumen Word 100% identik berhasil dibuat di:\n - {out_docx1}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Gagal menjalankan NodeJS: {e}")
        return False
    except FileNotFoundError:
        print(f"❌ Node.js tidak terdeteksi. Pastikan 'node' bisa dijalankan di command prompt.")
        return False

if __name__ == "__main__":
    revisi_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "outputs", "analisis-anggaran-rudenim", "revisi-v1"))
    run_build_document(revisi_dir)
