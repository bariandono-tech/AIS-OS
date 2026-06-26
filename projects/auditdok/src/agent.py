import os
from dotenv import load_dotenv

# Load environment variables relative to the agent.py directory
current_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(current_dir, "..", ".env"))

class AuditAgent:
    def __init__(self, provider="gemini", model_name=None, use_gemini=None):
        # Backward compatibility for use_gemini
        if use_gemini is not None:
            provider = "gemini" if use_gemini else "claude"

        self.provider = provider
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        self.openrouter_key = os.getenv("OPENROUTER_API_KEY")
        
        # Set default models
        if provider == "gemini":
            self.model = model_name or "gemini-2.5-flash"
            if not self.gemini_key:
                print("[WARNING] GEMINI_API_KEY tidak ditemukan di environment. Menggunakan mock mode.")
        elif provider == "claude":
            self.model = model_name or "claude-3-5-sonnet-20241022"
            if not self.anthropic_key:
                print("[WARNING] ANTHROPIC_API_KEY tidak ditemukan di environment. Menggunakan mock mode.")
        elif provider == "openrouter":
            # Default to meta-llama/llama-3-8b-instruct:free
            self.model = model_name or "meta-llama/llama-3-8b-instruct:free"
            if not self.openrouter_key:
                print("[WARNING] OPENROUTER_API_KEY tidak ditemukan di environment. Menggunakan mock mode.")

    def run_audit(self, system_instruction, document_text, focus_prompt=""):
        """
        Menjalankan audit terhadap dokumen menggunakan LLM pilihan.
        """
        prompt = f"Berikut adalah konten dokumen yang harus diaudit:\n\n{document_text}\n\n"
        if focus_prompt:
            prompt += f"Fokus Tambahan Audit:\n{focus_prompt}\n\n"
        prompt += "Lakukan audit secara mendalam dan berikan laporan terstruktur sesuai dengan pedoman yang diberikan."

        # MOCK MODE (Jika key tidak diset)
        if (self.provider == "gemini" and not self.gemini_key) or \
           (self.provider == "claude" and not self.anthropic_key) or \
           (self.provider == "openrouter" and not self.openrouter_key):
            return self._generate_mock_response(system_instruction, focus_prompt)

        if self.provider == "gemini":
            try:
                from google import genai
                from google.genai import types
                
                client = genai.Client(api_key=self.gemini_key)
                config = types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.2,
                )
                
                response = client.models.generate_content(
                    model=self.model,
                    contents=prompt,
                    config=config
                )
                return response.text or "[WARNING: Respon kosong atau diblokir filter keamanan oleh API Gemini.]"
            except Exception as e:
                print(f"[ERROR] Gagal memanggil Gemini API: {e}. Beralih ke Mock Mode.")
                return self._generate_mock_response(system_instruction, focus_prompt)
        elif self.provider == "claude":
            # Fallback to Anthropic Claude
            try:
                import anthropic
                
                client = anthropic.Anthropic(api_key=self.anthropic_key)
                message = client.messages.create(
                    model=self.model,
                    max_tokens=4000,
                    temperature=0.2,
                    system=system_instruction,
                    messages=[
                        {"role": "user", "content": prompt}
                    ]
                )
                return message.content[0].text or "[WARNING: Respon kosong dari API Anthropic.]"
            except Exception as e:
                print(f"[ERROR] Gagal memanggil Anthropic API: {e}. Beralih ke Mock Mode.")
                return self._generate_mock_response(system_instruction, focus_prompt)
        elif self.provider == "openrouter":
            try:
                import json
                import urllib.request
                import urllib.error
                
                url = "https://openrouter.ai/api/v1/chat/completions"
                headers = {
                    "Authorization": f"Bearer {self.openrouter_key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://github.com/bariandono-tech/AIS-OS", # Optional referer for OpenRouter
                    "X-Title": "AuditDok",
                }
                
                data = {
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": system_instruction},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.2
                }
                
                req = urllib.request.Request(
                    url, 
                    data=json.dumps(data).encode("utf-8"), 
                    headers=headers, 
                    method="POST"
                )
                
                with urllib.request.urlopen(req) as response:
                    res_data = json.loads(response.read().decode("utf-8"))
                    return res_data["choices"][0]["message"]["content"]
            except urllib.error.HTTPError as he:
                error_body = he.read().decode("utf-8")
                print(f"[ERROR] Gagal memanggil OpenRouter API (HTTP {he.code}): {error_body}")
                return self._generate_mock_response(system_instruction, focus_prompt)
            except Exception as e:
                print(f"[ERROR] Gagal memanggil OpenRouter API: {e}. Beralih ke Mock Mode.")
                return self._generate_mock_response(system_instruction, focus_prompt)

    def _generate_mock_response(self, system_instruction, focus_prompt):
        """
        Menghasilkan output mock terstruktur untuk keperluan pengujian luring.
        """
        role = "Akademik" if "Makalah" in system_instruction or "Skripsi" in system_instruction else "Keuangan"
        
        if role == "Akademik":
            return """# HASIL AUDIT DOKUMEN (MOCK)

## Skor Evaluasi
Skor Keseluruhan: 7.5 / 10

## Temuan Utama (Daftar Masalah)
1. **Lokasi/Bagian**: Bab I Latar Belakang (Halaman 2)
   - **Jenis Masalah**: Logika
   - **Tingkat Keparahan**: Kritis
   - **Deskripsi**: Penjelasan research gap kurang tajam dan tidak didukung data statistik.
   - **Sebelum**: "Penelitian ini penting karena teknologi saat ini berkembang sangat cepat sekali dan mahasiswa butuh sistem baru."
   - **Sesudah**: "Penelitian ini mendesak untuk dilakukan mengingat 64% mahasiswa mengalami kendala adaptasi sistem manual (BPS, 2025). Efisiensi sistem baru diproyeksikan menghemat waktu operasional hingga 40%."

2. **Lokasi/Bagian**: Bab II Pembahasan (Halaman 5)
   - **Jenis Masalah**: Bahasa
   - **Tingkat Keparahan**: Penting
   - **Deskripsi**: Penggunaan kata tidak baku dan tidak adanya cetak miring pada istilah asing.
   - **Sebelum**: "Kita bisa mendownload software tersebut secara free lewat website resmi."
   - **Sesudah**: "Pengguna dapat mengunduh (*download*) perangkat lunak tersebut secara gratis (*free*) melalui situs web resmi."

## Contoh Checklist Tindakan (PRD Format)
- [ ] Perbaiki bagian Latar Belakang agar lebih berfokus pada data statistik kendala sistem lama.
- [ ] Ubah kata asing 'download' dan 'free' menjadi tercetak miring (*italic*) atau gunakan padanan bahasa Indonesia.
"""
        else:
            return """# HASIL AUDIT DOKUMEN (MOCK - KEUANGAN)

## Skor Evaluasi & Opini Awal
Skor Keseluruhan: 6.8 / 10
Opini Awal: Wajar Dengan Pengecualian (WDP)

## Rekonsiliasi & Temuan Ketidakselarasan Angka
1. Saldo Kas Akhir pada Lembar Neraca (Rp125.000.000) tidak cocok dengan Saldo Kas Akhir di Laporan Arus Kas (Rp128.500.000). Terdapat selisih tidak terjelaskan sebesar Rp3.500.000.

## Daftar Temuan Operasional & Kepatuhan
1. **Bagian/Tabel**: Catatan atas Laporan Keuangan (CALK) - Penerimaan Hibah
   - **Tingkat Keparahan**: Kritis
   - **Deskripsi Masalah**: Tidak ada penjelasan rinci mengenai asal penerimaan hibah sebesar Rp15.000.000 yang dicatat pada triwulan II.
   - **Tindakan Korektif**: Tambahkan tabel rincian pemberi hibah beserta tanggal terima dan nomor tanda bukti serah terima barang/uang di Lampiran CALK.

## Contoh Checklist Tindakan (PRD Format)
- [ ] Selaraskan saldo kas akhir antara Neraca dan Laporan Arus Kas menjadi Rp128.500.000.
- [ ] Tambahkan tabel rincian transaksi hibah triwulan II pada CALK.
"""
