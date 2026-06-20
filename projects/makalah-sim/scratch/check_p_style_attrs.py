import zipfile
from xml.etree import ElementTree as ET

docx_path = "MAKALAH_SIM_AJIE_BARIANDONO_2110426823_v2.docx"

with zipfile.ZipFile(docx_path) as z:
    doc_xml = z.read("word/document.xml")

root = ET.fromstring(doc_xml)
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

print("All paragraphs and their styles:")
for idx, p in enumerate(root.findall('.//w:p', ns)):
    p_text = "".join(p.itertext()).strip()
    pPr = p.find('w:pPr', ns)
    style_id = ""
    if pPr is not None:
        pStyle = pPr.find('w:pStyle', ns)
        if pStyle is not None:
            style_id = pStyle.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val')
    if "Gambar" in p_text or "Tabel" in p_text:
        print(f"  P {idx+1}: StyleID='{style_id}', Text='{p_text}'")
