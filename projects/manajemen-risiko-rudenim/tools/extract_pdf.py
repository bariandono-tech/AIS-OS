import sys, os
sys.stdout.reconfigure(encoding='utf-8')
import fitz

pdf_path = os.path.join(os.path.dirname(__file__), '..', 'PedomanPenerapan Manajemen Risiko_KEMENIMIPAS_2025.pdf')
output_path = os.path.join(os.path.dirname(__file__), '..', '.tmp', 'pedoman_extracted.txt')

doc = fitz.open(pdf_path)
print(f"Total pages: {len(doc)}")

os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, 'w', encoding='utf-8') as f:
    for i, page in enumerate(doc):
        text = page.get_text()
        f.write(f"=== PAGE {i+1} ===\n{text}\n")

doc.close()
print(f"Extracted to: {output_path}")
