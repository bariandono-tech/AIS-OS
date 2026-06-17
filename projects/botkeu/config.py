import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load env variables from .env file
BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)

# Config variables
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GOOGLE_DRIVE_FOLDER_ID = os.getenv("GOOGLE_DRIVE_FOLDER_ID")
SERVICE_ACCOUNT_PATH = BASE_DIR / "service_account.json"

# Process whitelisted Telegram users
ALLOWED_USERS_RAW = os.getenv("ALLOWED_USERS", "")
ALLOWED_USERS = set()

if ALLOWED_USERS_RAW:
    for item in ALLOWED_USERS_RAW.split(","):
        item = item.strip()
        if item:
            try:
                ALLOWED_USERS.add(int(item))
            except ValueError:
                print(f"Warning: Invalid user ID '{item}' in ALLOWED_USERS", file=sys.stderr)

def validate_config():
    """Validates that all essential config parameters are set."""
    errors = []
    if not TELEGRAM_TOKEN or TELEGRAM_TOKEN.startswith("your_"):
        errors.append("TELEGRAM_TOKEN is missing or has placeholder value in environment.")
    if not GEMINI_API_KEY or GEMINI_API_KEY.startswith("your_"):
        errors.append("GEMINI_API_KEY is missing or has placeholder value in environment.")
    if not GOOGLE_DRIVE_FOLDER_ID or GOOGLE_DRIVE_FOLDER_ID.startswith("your_"):
        errors.append("GOOGLE_DRIVE_FOLDER_ID is missing or has placeholder value in environment.")
    
    if not SERVICE_ACCOUNT_PATH.exists():
        print(f"Warning: Google service account key not found at {SERVICE_ACCOUNT_PATH}. Google Drive features will fail until this file is provided.", file=sys.stderr)
        
    if not ALLOWED_USERS:
        errors.append("ALLOWED_USERS is empty or invalid. No one will be able to access the bot.")
        
    if errors:
        print("Configuration errors found:", file=sys.stderr)
        for err in errors:
            print(f"- {err}", file=sys.stderr)
        return False
    return True

if __name__ == "__main__":
    print("Validating configuration...")
    if validate_config():
        print("Configuration is valid.")
        print(f"Loaded {len(ALLOWED_USERS)} allowed user(s).")
    else:
        print("Configuration is incomplete or has placeholder values.")
