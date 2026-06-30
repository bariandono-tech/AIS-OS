import os
import json
import re

def parse_markdown(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    blocks = []
    lines = content.split('\n')
    
    current_table = None
    
    for line in lines:
        line = line.strip()
        if not line:
            if current_table:
                blocks.append({"type": "table", "content": current_table})
                current_table = None
            continue
            
        if line.startswith('|') and line.endswith('|'):
            if current_table is None:
                current_table = []
            # Skip separator line
            if set(line.replace('|', '').replace('-', '').replace(':', '').replace(' ', '')) == set():
                continue
            cells = [c.strip() for c in line.split('|')[1:-1]]
            current_table.append(cells)
            continue
            
        if current_table:
            blocks.append({"type": "table", "content": current_table})
            current_table = None

        if line.startswith('# '):
            blocks.append({"type": "h1", "text": line[2:].strip()})
        elif line.startswith('## '):
            blocks.append({"type": "h2", "text": line[3:].strip()})
        elif line.startswith('### '):
            blocks.append({"type": "h3", "text": line[4:].strip()})
        elif line.startswith('#### '):
            blocks.append({"type": "h4", "text": line[5:].strip()})
        elif line.startswith('**Tabel '):
            blocks.append({"type": "table_caption", "text": line.replace('**', '')})
        elif line.startswith('*Sumber:'):
            blocks.append({"type": "table_source", "text": line.replace('*', '')})
        elif line.startswith('**Gambar '):
            blocks.append({"type": "image_caption", "text": line.replace('**', '')})
        elif line.startswith('[Flowchart'):
            blocks.append({"type": "image_placeholder", "text": line})
        elif line.startswith('- ') or re.match(r'^\d+\.\s', line):
            blocks.append({"type": "list_item", "text": line})
        else:
            # Paragraph
            blocks.append({"type": "p", "text": line})
            
    if current_table:
         blocks.append({"type": "table", "content": current_table})
         
    return blocks

if __name__ == "__main__":
    revisi_dir = r"d:\WORKSPACE\AIS-OS\projects\audit revisi proposal\revisi audit\outputs\analisis-anggaran-rudenim\revisi-v1"
    files = ["05-revisi-bab1.md", "05-revisi-bab2.md", "05-revisi-bab3.md", "05-revisi-daftar-pustaka.md"]
    
    all_data = {}
    for f in files:
        path = os.path.join(revisi_dir, f)
        if os.path.exists(path):
            all_data[f.replace('.md', '')] = parse_markdown(path)
            
    out_path = os.path.join(revisi_dir, "data_revisi.json")
    with open(out_path, 'w', encoding='utf-8') as out_f:
        json.dump(all_data, out_f, indent=2, ensure_ascii=False)
        
    print(f"Berhasil men-generate JSON di: {out_path}")
