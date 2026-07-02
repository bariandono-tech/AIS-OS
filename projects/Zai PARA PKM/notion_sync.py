import os
from dotenv import load_dotenv
from notion_client import Client

# Load environment variables (.env file)
load_dotenv()

NOTION_TOKEN = os.getenv("NOTION_TOKEN")
DATABASE_ID_NOTES = os.getenv("DATABASE_ID_NOTES")
DATABASE_ID_TASKS = os.getenv("DATABASE_ID_TASKS")

if not NOTION_TOKEN:
    print("Warning: NOTION_TOKEN is not set in .env")

notion = Client(auth=NOTION_TOKEN)

def add_note_to_notion(title, summary, tags, flashcards):
    """
    Menambahkan entri ke Database Notes [PARA]
    """
    try:
        new_page = notion.pages.create(
            parent={"database_id": DATABASE_ID_NOTES},
            properties={
                "Name": {
                    "title": [{"text": {"content": title}}]
                },
                "Tags": {
                    "multi_select": [{"name": tag} for tag in tags]
                }
            },
            children=[
                {
                    "object": "block",
                    "type": "heading_2",
                    "heading_2": {
                        "rich_text": [{"type": "text", "text": {"content": "Summary"}}]
                    }
                },
                {
                    "object": "block",
                    "type": "paragraph",
                    "paragraph": {
                        "rich_text": [{"type": "text", "text": {"content": summary}}]
                    }
                },
                {
                    "object": "block",
                    "type": "heading_2",
                    "heading_2": {
                        "rich_text": [{"type": "text", "text": {"content": "Flashcards"}}]
                    }
                }
            ]
            # Flashcard blocks can be appended here programmatically
        )
        print(f"Berhasil menambahkan Note: {title}")
        return new_page["id"]
    except Exception as e:
        print(f"Error menambahkan Note: {e}")
        return None

def fetch_all_data():
    """
    Mengambil semua data dari Notion (Tasks, Notes, Projects, Areas)
    untuk di-inject ke Jinja2 (Tahap 3).
    """
    print("Fetching data dari Notion...")
    # Implementasi fetch query ke API Notion diletakkan di sini
    # Mengembalikan dictionary seperti mock_data di build_book.py
    return {}

if __name__ == "__main__":
    print("Notion Sync module ready.")
