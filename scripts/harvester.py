import csv
import requests
import yaml
import os
import io
from datetime import datetime
import re

SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSL9jBDcQJpJInJCJS1SQC3VYSw352PH0Ud-_Ch_-EROjSrKdlsUUsMww0amMaWEDDUAC5XgjCEtq4y/pub?gid=122937646&single=true&output=csv"
OUTPUT_DIR = "data/conferences"

def slugify(text: str) -> str:
  text = text.lower()
  return re.sub(r'[^a-z0-9]+', '-', text).strip('-')

def fetch_sheet_data():
  print(f"Downloading data from spreadsheet...")
  response = requests.get(SHEET_URL)
  response.raise_for_status()
  return csv.DictReader(io.StringIO(response.text))

def parse_date(date_str: str):
  """
  Google forms generally change dates to 'dd/mm/aaaa HH:mm:ss' 
  or 'mm/dd/aaaa'. We need to format that on ISO format.
  """
  formats = [
    "%d/%m/%Y %H:%M:%S", # Brazil
    "%m/%d/%Y %H:%M:%S", # US
    "%Y-%m-%d %H:%M:%S",
    "%d/%m/%Y",
    "%m/%d/%Y"
  ]
  
  for fmt in formats:
    try:
      dt = datetime.strptime(date_str, fmt)
      # Retorn string ISO
      return dt.strftime("%Y-%m-%dT%H:%M:%S")
    except ValueError:
      continue
  
  return None

def transform_and_save(csv_reader):
  if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

  count = 0
  
  # Temp dict to group deadlines from the same conference.
  # (In case that somebody submit the abstract deadline and then the full paper deadline)
  confs_map = {}

  for row in csv_reader:
    # Map each google sheet column

    title = row.get('Conference Title', '').strip()
    acronym = row.get('Acronym', '').strip()
    year = row.get('Year', '').strip()
    website = row.get('Website/URL', '').strip()
    location = row.get('Local', '').strip()
    deadline_type = row.get('Deadline Type')
    date_raw = row.get('Deadline Date and Hour', '')
    timezone = row.get('Timezone', 'AoE')
    tags_raw = row.get('Tags; Area', '')

    if not title or not acronym:
      continue

    conf_id = slugify(f"{acronym}-{year}")
    
    # Parse date
    iso_date = parse_date(date_raw)
    if not iso_date:
      print(f"Invalid date for {acronym}: {date_raw}")
      continue

    # Base structure (if not exists on map, it creates a new one)
    if conf_id not in confs_map:
      confs_map[conf_id] = {
        "id": conf_id,
        "title": title,
        "acronym": acronym,
        "year": int(year) if year.isdigit() else datetime.now().year,
        "website": website,
        "location": location,
        "timezone": timezone,
        "tags": [t.strip() for t in tags_raw.split('\n')] if tags_raw else [],
        "deadlines": []
      }
    
    # Adds the deadline to the list of that conference
    confs_map[conf_id]["deadlines"].append({
      "type": deadline_type,
      "date": iso_date
    })

  for conf_id, data in confs_map.items():
    file_path = os.path.join(OUTPUT_DIR, f"{conf_id}.yaml")
    with open(file_path, "w", encoding="utf-8") as f:
      yaml.dump(data, f, allow_unicode=True, sort_keys=False)
      count += 1

  print(f"Process completed. {count} files generated via Google Sheets.")

if __name__ == "__main__":
  reader = fetch_sheet_data()
  transform_and_save(reader)