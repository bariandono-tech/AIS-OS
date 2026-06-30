import os
import json

uuid = "e5f274a3-338c-4014-acdc-1efc1c33242c"
transcript_path = r"C:\Users\Asus\.gemini\antigravity-ide\brain\e5f274a3-338c-4014-acdc-1efc1c33242c\.system_generated\logs\transcript.jsonl"
output_path = os.path.join(os.getcwd(), "percakapan_build_makalah.md")

print(f"Mengekstrak percakapan {uuid} (Kandidat Utama build_makalah)...")

if not os.path.exists(transcript_path):
    print("File tidak ditemukan:", transcript_path)
else:
    try:
        with open(output_path, "w", encoding="utf-8", errors="ignore") as out:
            out.write(f"# Percakapan: {uuid}\n\n")
            with open(transcript_path, 'r', encoding='utf-8', errors='ignore') as f:
                for line in f:
                    try:
                        data = json.loads(line)
                        if data.get("type") in ["USER_INPUT", "USER_EXPLICIT", "MODEL"]:
                            source = data.get("source", "UNKNOWN")
                            content = data.get("content", "")
                            if source == "USER" or source == "USER_EXPLICIT":
                                out.write(f"## 👤 User:\n{content}\n\n")
                            elif source == "MODEL":
                                out.write(f"## 🤖 AI:\n{content}\n\n")
                    except Exception:
                        pass
        print(f"Berhasil! File tersimpan di: {output_path}")
    except Exception as e:
        print(f"Gagal memproses: {e}")


