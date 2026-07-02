import os
import json
import argparse
from pypdf import PdfReader
from openai import OpenAI
from dotenv import load_dotenv

# Load API Key
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    print("Warning: OPENROUTER_API_KEY is not set in .env")

# Inisialisasi OpenRouter Client menggunakan SDK OpenAI
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)

def extract_text_from_pdf(pdf_path):
    """
    Ekstrak teks dari PDF menggunakan pypdf.
    """
    print(f"Mengekstrak teks dari: {pdf_path}...")
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return text
    except Exception as e:
        print(f"Error membaca PDF: {e}")
        return ""

def generate_insights_with_ai(text):
    """
    Mengirim teks ke LLM (via OpenRouter) dan mendapatkan struktur JSON:
    - Summary
    - Action Items (Tasks)
    - Flashcards
    """
    print("Menganalisis teks dengan AI via OpenRouter...")
    
    prompt = """
    Kamu adalah asisten riset (Agentic PKM). 
    Baca dokumen berikut dan ekstrak informasinya dalam format JSON murni.
    Format JSON yang diharapkan persis seperti ini (jangan tambahkan markdown ```json):
    {
      "title": "Judul utama atau topik utama dari dokumen",
      "summary": "Ringkasan komprehensif dari dokumen ini",
      "tags": ["tag1", "tag2"],
      "tasks": ["Action item 1", "Action item 2"],
      "flashcards": [
        {"q": "Pertanyaan untuk flashcard 1", "a": "Jawaban singkat dan jelas"},
        {"q": "Pertanyaan untuk flashcard 2", "a": "Jawaban singkat dan jelas"}
      ]
    }
    
    Teks Dokumen:
    """ + text[:150000] # Batasi sedikit demi keamanan
    
    try:
        response = client.chat.completions.create(
            model="nvidia/nemotron-3-ultra-550b-a55b:free", # Anda bisa ganti dengan model lain di OpenRouter
            messages=[
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        result_text = response.choices[0].message.content
        # Parse JSON
        result = json.loads(result_text)
        return result
    except Exception as e:
        print(f"Error memanggil OpenRouter API: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Agentic PDF Processor (OpenRouter Version)")
    parser.add_argument("pdf_path", help="Path ke file PDF")
    args = parser.parse_args()
    
    if not os.path.exists(args.pdf_path):
        print(f"File {args.pdf_path} tidak ditemukan!")
        return

    # 1. Ekstrak
    text = extract_text_from_pdf(args.pdf_path)
    if not text:
        return
        
    # 2. Proses AI
    result = generate_insights_with_ai(text)
    
    if result:
        # 3. Output
        print("\n--- HASIL ANALISIS AI ---")
        print(json.dumps(result, indent=2))
        print("-------------------------")
        print("\nLangkah selanjutnya: Menggunakan notion_sync.py untuk menyimpan ini ke Notion.")
        
        # Menyimpan output ke JSON sementara
        output_file = "data/last_ai_result.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=4)
        print(f"Data disimpan sementara di {output_file}")

if __name__ == "__main__":
    main()
