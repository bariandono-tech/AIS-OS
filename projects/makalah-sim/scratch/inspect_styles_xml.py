import zipfile
from xml.etree import ElementTree as ET

docx_path = "MAKALAH_SIM_AJIE_BARIANDONO_2110426823_v2.docx"

with zipfile.ZipFile(docx_path) as z:
    styles_xml = z.read("word/styles.xml")

root = ET.fromstring(styles_xml)
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

for style in root.findall('.//w:style', ns):
    style_id = style.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}styleId')
    if style_id in ['CaptionFigure', 'CaptionTable', 'Caption']:
        # Let's print the entire XML representation of this style
        print(f"\nStyle XML for Style ID '{style_id}':")
        ET.indent(style)
        print(ET.tostring(style, encoding='utf-8').decode('utf-8'))
