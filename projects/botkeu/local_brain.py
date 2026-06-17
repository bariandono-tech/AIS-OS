import re
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
# Target path: d:\WORKSPACE\AIS-OS\office-brain\wiki
WIKI_DIR = BASE_DIR.parent.parent / "office-brain" / "wiki"

def search_local_wiki(query: str) -> str:
    """
    Memindai dokumen markdown di folder office-brain/wiki.
    Mencari kecocokan kata kunci pada nama file maupun isi konten.
    
    Args:
        query: Kueri pencarian dari pengguna.
        
    Returns:
        String berisi potongan/isi dokumen yang cocok atau info jika tidak ditemukan.
    """
    if not WIKI_DIR.exists():
        return f"Direktori wiki lokal tidak ditemukan di: {WIKI_DIR.resolve()}"
        
    # Pecah kueri menjadi kata kunci untuk pencarian multi-keyword
    keywords = [kw.lower() for kw in re.split(r'\s+', query) if len(kw.strip()) > 1]
    if not keywords:
        return "Query pencarian terlalu pendek."
        
    matches = []
    
    # Memindai seluruh berkas .md di folder wiki
    for md_file in WIKI_DIR.glob("*.md"):
        filename_lower = md_file.name.lower()
        
        try:
            with open(md_file, "r", encoding="utf-8") as f:
                content = f.read()
        except Exception as e:
            print(f"Error membaca {md_file.name}: {e}")
            continue
            
        content_lower = content.lower()
        
        # Skor kecocokan kata kunci
        score = 0
        for kw in keywords:
            if kw in filename_lower:
                score += 10  # Bobot kecocokan nama file lebih tinggi
            if kw in content_lower:
                score += content_lower.count(kw)
                
        if score > 0:
            matches.append((score, md_file.name, content))
            
    # Urutkan berdasarkan skor kecocokan tertinggi
    matches.sort(key=lambda x: x[0], reverse=True)
    
    if not matches:
        return "Tidak ditemukan regulasi atau SOP lokal yang cocok dengan kueri Anda."
        
    # Buat string hasil kueri
    result = ["=== HASIL PENCARIAN DOKUMEN SOP/ATURAN KANTOR LOKAL ==="]
    # Ambil maksimal 3 dokumen terbaik untuk efisiensi token
    for score, doc_name, doc_content in matches[:3]:
        result.append(f"\n--- Dokumen: {doc_name} ---")
        if len(doc_content) > 3000:
            result.append(doc_content[:3000] + "\n\n[...Konten dipotong karena terlalu panjang...]")
        else:
            result.append(doc_content)
            
    return "\n".join(result)

if __name__ == "__main__":
    # Test lokal
    print("Menguji pencarian wiki lokal...")
    print(search_local_wiki("Project Botkeu"))
