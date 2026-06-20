import zipfile
from xml.etree import ElementTree as ET

docx_path = "MAKALAH_SIM_AJIE_BARIANDONO_2110426823_v2.docx"

with zipfile.ZipFile(docx_path) as z:
    doc_xml = z.read("word/document.xml")

root = ET.fromstring(doc_xml)
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

# Find all tables
tables = root.findall('.//w:tbl', ns)
print(f"Total tables in document: {len(tables)}")

# Find where tables are located relative to headings
current_heading = ""
for child in root.find('w:body', ns):
    tag = child.tag.split('}')[-1]
    if tag == 'p':
        p_text = "".join(child.itertext()).strip()
        pPr = child.find('w:pPr', ns)
        if pPr is not None:
            pStyle = pPr.find('w:pStyle', ns)
            if pStyle is not None:
                style_val = pStyle.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val')
                if style_val == 'Heading1':
                    current_heading = p_text
                    print(f"Heading 1: '{current_heading}'")
    elif tag == 'tbl':
        print(f"Table found under Heading: '{current_heading}'")
