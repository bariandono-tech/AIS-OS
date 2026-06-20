import zipfile
import re

docx_path = "scratch/test_toc.docx"

with zipfile.ZipFile(docx_path) as z:
    doc_xml = z.read("word/document.xml").decode("utf-8")

instr_texts = re.findall(r'<w:instrText[^>]*>(.*?)</w:instrText>', doc_xml)
print("Generated TOC Field Instructions:")
for idx, text in enumerate(instr_texts):
    print(f"  Field {idx+1}: {text.strip()}")
