import json
import sys

log_path = r"C:\Users\Asus\.gemini\antigravity-ide\brain\19265c00-3c86-4172-94e9-68b9bc22dbc2\.system_generated\logs\transcript.jsonl"
user_inputs = []

try:
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                if data.get('type') == 'USER_INPUT':
                    user_inputs.append(data.get('content'))
            except Exception as e:
                pass
    
    print("Found", len(user_inputs), "user inputs.")
    print("--- LAST 3 USER INPUTS ---")
    for i, content in enumerate(user_inputs[-3:]):
        print(f"[{i+1}]")
        print(content)
        print("-" * 40)
except Exception as e:
    print("Error:", e)
