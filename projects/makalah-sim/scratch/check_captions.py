import zipfile
from xml.etree import ElementTree as ET

docx_path = "MAKALAH_SIM_AJIE_BARIANDONO_2110426823_v2.docx"

with zipfile.ZipFile(docx_path) as z:
    doc_xml = z.read("word/document.xml")

root = ET.fromstring(doc_xml)
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

# We want to find paragraphs with w:pStyle having w:val="CaptionFigure"
print("Caption paragraphs:")
for p in root.findall('.//w:p', ns):
    pPr = p.find('w:pPr', ns)
    if pPr is not None:
        pStyle = pPr.find('w:pStyle', ns)
        if pStyle is not None and pStyle.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val') == 'CaptionFigure':
            p_text = "".join(p.itertext()).strip()
            print(f"\n--- Paragraph: '{p_text}' ---")
            # Let's print the elements in the paragraph
            for child in p:
                tag = child.tag.split('}')[-1]
                if tag == 'r':
                    t = child.find('w:t', ns)
                    t_text = t.text if t is not None else ""
                    instr = child.find('w:instrText', ns)
                    instr_text = f" [field: {instr.text}]" if instr is not None else ""
                    print(f"  Run: '{t_text}'{instr_text}")
                elif tag == 'fldSimple':
                    instr = child.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}instr')
                    t = child.find('w:t', ns)
                    t_text = t.text if t is not None else ""
                    print(f"  fldSimple: instr='{instr}', text='{t_text}'")
                else:
                    print(f"  Element: {tag}")
