import zipfile
import re
from xml.etree import ElementTree as ET

docx_path = "MAKALAH_SIM_AJIE_BARIANDONO_2110426823_v2.docx"

with zipfile.ZipFile(docx_path) as z:
    doc_xml = z.read("word/document.xml")

root = ET.fromstring(doc_xml)

# Namespaces
ns = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
}

# Let's find the paragraphs under the DAFTAR GAMBAR heading
# We can find the paragraph with text "DAFTAR GAMBAR"
found_dg = False
paragraphs_after_dg = []

for p in root.findall('.//w:p', ns):
    p_text = "".join(p.itertext()).strip()
    if "DAFTAR GAMBAR" in p_text:
        found_dg = True
        print(f"Found DAFTAR GAMBAR heading paragraph: {p_text}")
        continue
    if found_dg:
        paragraphs_after_dg.append(p)
        if len(paragraphs_after_dg) >= 30:
            break

print(f"\nPrinting the first 25 paragraphs after DAFTAR GAMBAR:")
for idx, p in enumerate(paragraphs_after_dg[:25]):
    p_text = "".join(p.itertext()).strip()
    instr_texts = [t.text for t in p.findall('.//w:instrText', ns)]
    print(f"  P {idx+1}: text='{p_text}', instrs={instr_texts}")
