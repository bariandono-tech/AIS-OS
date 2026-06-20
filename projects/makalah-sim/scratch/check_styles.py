import zipfile
from xml.etree import ElementTree as ET

docx_path = "MAKALAH_SIM_AJIE_BARIANDONO_2110426823_v2.docx"

with zipfile.ZipFile(docx_path) as z:
    styles_xml = z.read("word/styles.xml")

root = ET.fromstring(styles_xml)
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

print("Searching for Table of Figures style in styles.xml:")
for style in root.findall('.//w:style', ns):
    style_id = style.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}styleId')
    name = style.find('w:name', ns)
    name_val = name.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val') if name is not None else ""
    
    if "Figure" in name_val or "Table of" in name_val or "Tableof" in style_id:
        print(f"\nStyle ID: '{style_id}', Name: '{name_val}'")
        # Let's print style paragraph properties (pPr)
        pPr = style.find('w:pPr', ns)
        if pPr is not None:
            ind = pPr.find('w:ind', ns)
            if ind is not None:
                left = ind.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}left')
                hanging = ind.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}hanging')
                print(f"  Indents: left={left}, hanging={hanging}")
            else:
                print("  No indents defined in style.")
        else:
            print("  No paragraph properties (pPr) defined in style.")
