import os
import shutil
import json
from jinja2 import Environment, FileSystemLoader

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(BASE_DIR, 'templates')
OUTPUT_DIR = os.path.join(BASE_DIR, 'output')
DATA_DIR = os.path.join(BASE_DIR, 'data')

# Create necessary directories
for d in [TEMPLATE_DIR, OUTPUT_DIR, DATA_DIR]:
    os.makedirs(d, exist_ok=True)

original_html = os.path.join(BASE_DIR, 'sdfadf.html')
template_html = os.path.join(TEMPLATE_DIR, 'book.html')

if not os.path.exists(template_html):
    print(f"Mengopi {original_html} menjadi {template_html}...")
    shutil.copy(original_html, template_html)
    
# Mock data (nanti akan digantikan oleh fetch dari Notion)
# Membaca data dari hasil AI jika ada, jika tidak gunakan mock data
data_path = os.path.join(DATA_DIR, 'last_ai_result.json')

if os.path.exists(data_path):
    with open(data_path, 'r', encoding='utf-8') as f:
        ai_data = json.load(f)
        
    mock_data = {
        "dashboard_title": ai_data.get("title", "Zai's PARA Dashboard"),
        "tasks": [{"name": task, "status": "To Do", "due": "N/A"} for task in ai_data.get("tasks", [])],
        "notes": [
            {"name": ai_data.get("title", "Insight"), "tags": ai_data.get("tags", []), "project": "Research"}
        ],
        "projects": [
            {"name": "Research", "status": "Ongoing", "area": "PKM"}
        ],
        "areas": [
            {"name": "PKM", "type": "Area"}
        ],
        "flashcards": ai_data.get("flashcards", [])
    }
    print(f"Berhasil memuat data dari hasil AI: {data_path}")
else:
    mock_data = {
        "dashboard_title": "Zai's PARA Dashboard",
        "tasks": [
            {"name": "Review PRD Architecture", "status": "Doing", "due": "Today"},
            {"name": "Setup Notion API Integration", "status": "To Do", "due": "Tomorrow"}
        ],
        "notes": [
            {"name": "The Design of Everyday Things - Summary", "tags": ["Reference"], "project": "Design PKM"},
            {"name": "Meeting with Stakeholders", "tags": ["Meeting"], "project": "Work"}
        ],
        "projects": [
            {"name": "Design PKM", "status": "Ongoing", "area": "Personal"}
        ],
        "areas": [
            {"name": "Personal", "type": "Area"}
        ]
    }
    print("Menggunakan Mock Data (AI result belum ada).")

try:
    env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
    template = env.get_template('book.html')
    output_html = template.render(data=mock_data)
    
    output_path = os.path.join(OUTPUT_DIR, 'index.html')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(output_html)
    print(f"Sukses! File HTML berhasil dibuat di {output_path}")
except Exception as e:
    print(f"Error rendering template: {e}")
