import yaml
import json
import glob
import os
from datetime import datetime

INPUT_DIR = "data/conferences"
OUTPUT_FILE = "public/conferences.json" 

def get_next_deadline(conf):
  now = datetime.now().isoformat()
  valid_deadlines = []

  for d in conf.get('deadlines', []):
    if d['date'] > now:
      valid_deadlines.append(d['date'])
  
  if valid_deadlines:
    return min(valid_deadlines)
  else:
    return "9999-12-31"

def build_database():
  print("Initializing the database building...")
    
  files = glob.glob(os.path.join(INPUT_DIR, "*.yaml"))
  conferences = []
    
  for file in files:
    try:
      with open(file, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)

        if not data.get('id') or not data.get('title'):
          print(f"Ignoring {file}: missing ID or Title.")
          continue
        
        conferences.append(data)
    except Exception as e:
        print(f"Error reading {file}: {e}")

  conferences.sort(key=get_next_deadline)
  os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

  with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
      json.dump(conferences, f, ensure_ascii=False, indent=2)

  print(f"Build concluded! {len(conferences)} conferences aggregated in '{OUTPUT_FILE}'.")

if __name__ == "__main__":
  build_database()