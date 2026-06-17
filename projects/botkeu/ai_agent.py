import local_brain
import google_drive
import config
from google import genai
from google.genai import types

# Mapping nama fungsi dari LLM ke fungsi Python lokal
TOOLS_MAP = {
    "search_local_wiki": local_brain.search_local_wiki,
    "list_excel_files": google_drive.list_excel_files,
    "download_excel_file": google_drive.download_excel_file,
    "read_excel_sheets": google_drive.read_excel_sheets,
    "query_excel_data": google_drive.query_excel_data
}

# Daftar fungsi Python sebagai tools bagi Gemini
tools_list = [
    local_brain.search_local_wiki,
    google_drive.list_excel_files,
    google_drive.download_excel_file,
    google_drive.read_excel_sheets,
    google_drive.query_excel_data
]

def get_gemini_client():
    """Menginisialisasi klien Google GenAI."""
    if not config.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY belum dikonfigurasi di file .env.")
    return genai.Client(api_key=config.GEMINI_API_KEY)

def ask_gemini(user_message: str, chat_history: list = None) -> tuple:
    """
    Mengirim pesan ke Gemini dan menangani iterasi pemanggilan fungsi (Tool Calling).
    
    Args:
        user_message: Pertanyaan atau perintah dari pengguna.
        chat_history: Riwayat pesan sebelumnya (list of types.Content).
        
    Returns:
        Tuple: (jawaban_teks, riwayat_chat_terbaru)
    """
    try:
        client = get_gemini_client()
    except Exception as e:
        return f"Error sistem saat menghubungkan ke AI: {e}", chat_history or []
        
    # Susun payload percakapan
    contents = []
    if chat_history:
        contents.extend(chat_history)
        
    contents.append(types.Content(
        role="user",
        parts=[types.Part.from_text(text=user_message)]
    ))
    
    # Instruksi sistem (System Instruction) agar AI bertindak sesuai peran
    system_instruction = (
        "Anda adalah Bot Keuangan Kantor (botkeu). Tugas Anda membantu staf keuangan "
        "kantor menjawab pertanyaan seputar regulasi internal/SOP dan data keuangan di berkas Excel.\n\n"
        "Anda memiliki akses ke peralatan (tools) berikut:\n"
        "1. `search_local_wiki` - Mencari dokumen regulasi/SOP lokal di PC kantor.\n"
        "2. `list_excel_files` - Menampilkan daftar file Excel keuangan yang tersedia di Google Drive.\n"
        "3. `download_excel_file` - Mengunduh berkas Excel dari Drive berdasarkan file_id yang ditemukan.\n"
        "4. `read_excel_sheets` - Membaca daftar nama sheet yang ada di file Excel lokal hasil unduhan.\n"
        "5. `query_excel_data` - Membaca isi data sheet tertentu (hasilnya berupa tabel markdown/CSV).\n\n"
        "Aturan Penting:\n"
        "- Jika ditanya tentang data anggaran/Excel di Drive, panggil `list_excel_files` untuk mencari file terlebih dahulu. "
        "Jika ID berkas sudah diketahui, unduh menggunakan `download_excel_file`. "
        "Gunakan `read_excel_sheets` untuk mengecek sheet yang ada di file tersebut, kemudian gunakan `query_excel_data` "
        "untuk mengekstrak tabel datanya.\n"
        "- JANGAN membuat asumsi angka atau nama sheet. Selalu kueri menggunakan alat bantu Anda agar data akurat.\n"
        "- Jawab pertanyaan dalam Bahasa Indonesia yang formal, ramah, dan ringkas."
    )
    
    # Loop Function Calling (Gemini memanggil tools secara berurutan jika diperlukan)
    max_iterations = 8
    for i in range(max_iterations):
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=contents,
                config=types.GenerateContentConfig(
                    tools=tools_list,
                    system_instruction=system_instruction
                )
            )
        except Exception as e:
            return f"Terjadi kesalahan saat memproses permintaan Anda ke Gemini: {e}", contents
            
        # Tambahkan respon model ke riwayat konten
        if response.candidates and response.candidates[0].content:
            contents.append(response.candidates[0].content)
        else:
            return "Maaf, respon dari model kosong.", contents
            
        # Periksa apakah Gemini ingin menjalankan function call
        function_calls = response.function_calls
        if not function_calls:
            # Tidak ada function call lagi, ini adalah jawaban akhir
            return response.text, contents
            
        # Eksekusi setiap fungsi yang diminta Gemini
        tool_response_parts = []
        for call in function_calls:
            name = call.name
            args = call.args
            print(f"[AI Agent] Mengeksekusi fungsi '{name}' dengan argumen: {args}")
            
            if name in TOOLS_MAP:
                try:
                    result = TOOLS_MAP[name](**args)
                except Exception as e:
                    result = f"Error saat menjalankan fungsi '{name}': {e}"
            else:
                result = f"Error: Fungsi '{name}' tidak terdaftar di sistem."
                
            # Bungkus hasil eksekusi ke part response
            tool_response_parts.append(
                types.Part.from_function_response(
                    name=name,
                    response={"result": result}
                )
            )
            
        # Masukkan respon fungsi ke turn konten baru sebagai 'user'
        contents.append(types.Content(
            role="user",
            parts=tool_response_parts
        ))
        
    return "Maaf, bot mendeteksi loop pemanggilan data yang terlalu panjang. Silakan persingkat pertanyaan Anda.", contents

if __name__ == "__main__":
    # Test lokal singkat
    import os
    if os.getenv("GEMINI_API_KEY"):
        print("Menguji AI Agent...")
        ans, history = ask_gemini("Apakah ada aturan tentang botkeu di wiki lokal?")
        print(f"Jawaban AI:\n{ans}")
    else:
        print("GEMINI_API_KEY tidak diset di env, melewati uji lokal.")
