import os
import sys
import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_path, output_path):
    print(f"Extracting text from: {pdf_path}")
    if not os.path.exists(pdf_path):
        print(f"Error: File {pdf_path} not found.")
        sys.exit(1)
        
    doc = fitz.open(pdf_path)
    full_text = []
    
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text = page.get_text("text")
        full_text.append(text)
        
    combined_text = "\n\n".join(full_text)
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(combined_text)
        
    print(f"Extraction complete! Saved to {output_path}")

if __name__ == "__main__":
    pdf_input = sys.argv[1] if len(sys.argv) > 1 else "../.tmp/proposal.pdf"
    output_txt = "../.tmp/01-raw-extraction.txt"
    extract_text_from_pdf(pdf_input, output_txt)
