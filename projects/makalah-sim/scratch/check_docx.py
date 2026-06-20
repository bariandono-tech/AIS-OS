import zipfile
import re

docx_path = "MAKALAH_SIM_AJIE_BARIANDONO_2110426823_v2.docx"

with zipfile.ZipFile(docx_path) as z:
    doc_xml = z.read("word/document.xml").decode("utf-8")

# Let's find all w:instrText tags
instr_texts = re.findall(r'<w:instrText[^>]*>(.*?)</w:instrText>', doc_xml)
print("All field instruction texts:")
for idx, text in enumerate(instr_texts):
    print(f"  Field {idx+1}: {text.strip()}")

# Let's print the paragraph contents containing "TOC" or "Gambar" or "Tabel" in the front matter
# to see what is written in the DAFTAR GAMBAR section.
print("\n--- Paragraphs in XML ---")
# Let's extract paragraphs
paragraphs = re.findall(r'<w:p\b[^>]*>.*?</w:p>', doc_xml)
for p in paragraphs:
    p_text = "".join(re.findall(r'<w:t[^>]*>(.*?)</w:t>', p))
    p_instrs = re.findall(r'<w:instrText[^>]*>(.*?)</w:instrText>', p)
    if "DAFTAR GAMBAR" in p_text or "DAFTAR TABEL" in p_text or any("TOC" in inst for inst in p_instrs) or "Gambar" in p_text:
        # Print paragraph text and fields inside it
        print(f"P Text: {p_text}")
        if p_instrs:
            print(f"  Fields: {p_instrs}")
