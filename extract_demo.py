import os
import sys

# Tambahkan path project auditdok agar bisa import parser.py
sys.path.append(r"d:\WORKSPACE\AIS-OS\projects\auditdok\src")
import parser

pdf_path = r"d:\WORKSPACE\AIS-OS\projects\auditdok\MAKALAH_SIM - AJIE_BARIANDONO_2110426823.pdf"
out_path = r"d:\WORKSPACE\AIS-OS\outputs\demo-ajie\00-raw-ekstrak.md"

print(f"Mengekstrak teks dari: {pdf_path}...")
try:
    text_content, metadata = parser.parse_document(pdf_path)
    
    # Pastikan folder output ada
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(text_content)
        
    print(f"Berhasil! Ekstraksi disimimpan ke: {out_path}")
    print(f"Metadata: {metadata}")
except Exception as e:
    print(f"Gagal: {e}")
