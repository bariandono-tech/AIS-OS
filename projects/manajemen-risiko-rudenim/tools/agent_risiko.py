import os
import sys
import argparse
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

SYSTEM_INSTRUCTION = """
Anda adalah AI Auditor Ahli di Kementerian Imigrasi dan Pemasyarakatan (Kemenimipas).
Tugas Anda adalah membaca daftar masalah/risiko mentah dari Subbagian Tata Usaha (Keuangan dan Pengadaan), lalu mengubahnya ke dalam format Register Risiko sesuai dengan 'Pedoman MIP-OT.02.02-47 TAHUN 2025'.

Pedoman Kategori Risiko Resmi:
1. Risiko Operasional: Berkaitan dengan kegagalan proses bisnis, gagal lelang, wanprestasi, serapan anggaran lambat.
2. Risiko Kecurangan (Fraud): Gratifikasi, mark-up harga, persekongkolan tender, SPJ fiktif, dll.
3. Risiko Kepatuhan: Pelanggaran peraturan PBJ, telat lapor UP/TUP, pencatatan BMN tidak sesuai SAP.

Aturan Pemrosesan:
1. Konsolidasikan daftar masalah mentah yang sejenis menjadi SATU "Pernyataan Risiko Utama".
2. Tentukan Kategori Risikonya.
3. Berikan estimasi Skor Kemungkinan (1-5) dan Dampak (1-5).
4. Buat Rencana Tindak Pengendalian (RTP).
5. Format output Anda ke dalam Tabel Markdown yang rapi.
"""

def get_client(force_provider=None):
    """
    Returns (client, model_name) tuple based on .env configuration
    Supports: 
      - 'google' (Gemini via OpenAI compat interface)
      - 'dinoiki' (Claude Sonnet via Dinoiki proxy)
    """
    provider = (force_provider or os.getenv("LLM_PROVIDER", "dinoiki")).lower()
    
    if provider == "google":
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not set in .env")
        client = OpenAI(
            api_key=api_key,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )
        model_name = "gemini-2.0-flash"  # atau gemini-1.5-pro
    elif provider == "dinoiki":
        api_key = os.getenv("DINOIKI_API_KEY")
        if not api_key:
            raise ValueError("DINOIKI_API_KEY not set in .env")
        client = OpenAI(
            api_key=api_key,
            base_url="https://ai.dinoiki.com/v1"
        )
        model_name = "claude-sonnet-4-6" # model name mapped at proxy
    else:
        raise ValueError(f"Unknown LLM_PROVIDER: {provider}. Use 'google' or 'dinoiki'.")
    
    return client, model_name

def process_raw_text(raw_text, provider=None):
    client, model_name = get_client(force_provider=provider)
    
    prompt = f"Berikut adalah daftar risiko mentahnya:\n\n{raw_text}\n\nTolong buatkan Draf Register Risikonya."
    
    response = client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": SYSTEM_INSTRUCTION},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content, model_name

def main():
    parser = argparse.ArgumentParser(description="Agentic Workflow Manajemen Risiko")
    parser.add_argument("input_file", help="File TXT berisi risiko mentah")
    parser.add_argument("--provider", choices=["google", "dinoiki"], default=None, 
                        help="Override LLM_PROVIDER dari .env (google, dinoiki)")
    args = parser.parse_args()

    print(f"Membaca file risiko mentah: {args.input_file}...")
    try:
        with open(args.input_file, 'r', encoding='utf-8') as f:
            raw_text = f.read()
    except Exception as e:
        print(f"Gagal membaca file: {e}")
        sys.exit(1)

    print("Menghubungkan ke API...")
    try:
        result_text, used_model = process_raw_text(raw_text, args.provider)
        print(f"\n--- HASIL ANALISIS AGENTIC WORKFLOW (Model: {used_model}) ---\n")
        print(result_text)
        
        # Save to output file
        out_file = f"output_register_risiko.md"
        with open(out_file, 'w', encoding='utf-8') as f:
            f.write(result_text)
        print(f"\n[SUCCESS] Hasil analisis telah disimpan ke {out_file}")
    except Exception as e:
        print(f"\n[ERROR] Gagal memanggil API: {e}")

if __name__ == "__main__":
    main()
