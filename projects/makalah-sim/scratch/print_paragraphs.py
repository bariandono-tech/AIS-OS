import zipfile
from xml.etree import ElementTree as ET

docx_path = "MAKALAH_SIM_AJIE_BARIANDONO_2110426823_v2.docx"

with zipfile.ZipFile(docx_path) as z:
    doc_xml = z.read("word/document.xml")

root = ET.fromstring(doc_xml)
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

paragraphs = root.findall('.//w:p', ns)

in_dg = False
for idx, p in enumerate(paragraphs):
    p_text = "".join(p.itertext()).strip()
    if "DAFTAR GAMBAR" in p_text:
        in_dg = True
        print(f"--- START DAFTAR GAMBAR ---")
    if "BAB I" in p_text:
        print(f"--- END DAFTAR GAMBAR (Met BAB I) ---")
        in_dg = False
    
    if in_dg:
        # Let's inspect the runs and structure of this paragraph
        runs_info = []
        for child in p:
            tag = child.tag.split('}')[-1]
            if tag == 'r':
                t = child.find('w:t', ns)
                t_text = t.text if t is not None else ""
                runs_info.append(f"R('{t_text}')")
            elif tag == 'fldSimple':
                instr = child.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}instr')
                t = child.find('w:t', ns)
                t_text = t.text if t is not None else ""
                runs_info.append(f"fldSimple({instr}, '{t_text}')")
            elif tag == 'hyperlink':
                hl_text = "".join(child.itertext())
                runs_info.append(f"hyperlink('{hl_text}')")
            elif tag == 'pPr':
                # Let's see style
                pStyle = child.find('w:pStyle', ns)
                style_val = pStyle.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val') if pStyle is not None else ""
                runs_info.append(f"pPr(style={style_val})")
        print(f"P {idx}: Text='{p_text}' Structure={runs_info}")
