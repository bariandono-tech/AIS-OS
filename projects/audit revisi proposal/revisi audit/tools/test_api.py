"""
Test API — Menguji koneksi ke KEDUA provider (Google Gemini & Dinoiki Claude).
Jalankan ini sebelum menjalankan pipeline utama untuk memastikan semua API key valid.
"""
import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from llm_provider import get_client

def test_provider(provider_name):
    print(f"\n{'─' * 40}")
    print(f"  Testing: {provider_name.upper()}")
    print(f"{'─' * 40}")
    try:
        client, model = get_client(force_provider=provider_name)
        print(f"  Model: {model}")
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": "Katakan 'API berhasil!' dalam satu kalimat."}],
            max_tokens=50
        )
        print(f"  ✅ BERHASIL: {response.choices[0].message.content}")
        return True
    except ValueError as e:
        print(f"  ⚠️  SKIP (API Key belum diset): {e}")
        return False
    except Exception as e:
        print(f"  ❌ GAGAL: {e}")
        return False

if __name__ == "__main__":
    print("=" * 40)
    print("  AUDIT PIPELINE — API CONNECTION TEST")
    print("=" * 40)
    
    google_ok = test_provider("google")
    dinoiki_ok = test_provider("dinoiki")
    
    print(f"\n{'=' * 40}")
    print(f"  HASIL:")
    print(f"  Google Gemini (Layer 1): {'✅ OK' if google_ok else '❌ GAGAL'}")
    print(f"  Dinoiki Claude (Layer 2): {'✅ OK' if dinoiki_ok else '❌ GAGAL'}")
    print(f"{'=' * 40}")
    
    if google_ok and dinoiki_ok:
        print("\n🚀 Semua API siap! Anda bisa menjalankan pipeline Pro Max.")
    elif google_ok:
        print("\n⚠️  Hanya Gemini yang aktif. Pipeline hanya bisa jalan Layer 1 (PUEBI, Register, Sitasi).")
    elif dinoiki_ok:
        print("\n⚠️  Hanya Dinoiki yang aktif. Anda bisa set LLM_PROVIDER=dinoiki di .env untuk fallback.")
    else:
        print("\n❌ Tidak ada API yang aktif. Periksa file .env Anda.")
