import requests
import yaml
import os
from datetime import datetime
import re

CATEGORY_MAP = {
  "ML": "Machine Learning",
  "CV": "Computer Vision",
  "NLP": "Natural Language Processing",
  "RO": "Robotics",
  "SP": "Speech Processing",
  "DM": "Data Mining",
  "AI": "Artificial Intelligence",
  "CG": "Computer Graphics",
  "SE": "Software Engineering",
  "SYS": "Computer Systems",
  "CT": "Control Theory"
}

# (Community driven)
SOURCE_URL = "https://raw.githubusercontent.com/paperswithcode/ai-deadlines/master/_data/conferences.yml"
OUTPUT_DIR = "data/conferences"


def generate_smart_tags(item):
  tags = set()

  raw_sub = item.get("sub", "AI")

  if isinstance(raw_sub, str):
      subs_list = [raw_sub]
  elif isinstance(raw_sub, list):
      subs_list = raw_sub
  else:
      subs_list = ["AI"] # Fallback
  
  for sub in subs_list:
    sub_str = str(sub).strip() 
    
    if sub_str in CATEGORY_MAP:
        tags.add(CATEGORY_MAP[sub_str])
    else:
        tags.add(sub_str)

  title_lower = item["title"].lower()
  
  if "neural" in title_lower or "learning" in title_lower:
    tags.add("Machine Learning")
  if "vision" in title_lower or "image" in title_lower:
    tags.add("Computer Vision")
  if "language" in title_lower or "linguistics" in title_lower:
    tags.add("Natural Language Processing")
  if "robot" in title_lower:
    tags.add("Robotics")
  if "data" in title_lower and "mining" in title_lower:
    tags.add("Data Mining")
  if "intelligence" in title_lower:
    tags.add("Artificial Intelligence")
      
  return sorted(list(tags))

def slugify(text: str) -> str:
  """Transform each conference name (e.g.'NeurIPS 2025')
  in its own slug (e.g. 'neurips-2025')
  """
  text = text.lower()
  return re.sub(r'[^a-z0-9]+', '-', text).strip('-')

def fetch_external_data() -> list[dict]:
  print(f"Fetching data from {SOURCE_URL}...")
  response = requests.get(SOURCE_URL)
  response.raise_for_status()
  # yaml.safe_load from PyYAML read the entire file as a list of dicts
  return yaml.safe_load(response.text)

def transform_and_save(external_data: str):
  if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

  count = 0
  for item in external_data:
    # Filter: Only future or recent conferences (opt)
    # Generating the identifier
    conf_id = item.get("id", slugify(item["title"]))

    smart_tags = generate_smart_tags(item)
        
    # Mapping for OUR scheme
    my_conf = {
      "id": conf_id,
      "title": item["title"],
      "acronym": item.get("id", "").upper(), # Try to get the default ID
      "year": item.get("year", datetime.now().year),
      "website": item.get("link", ""),
      "timezone": item.get("timezone", "AoE"),
      "deadlines": [],
      "tags": smart_tags
    }

    # Handle dates ('deadline' becomes a list in OUR scheme)
    if "deadline" in item:
      date_str = str(item["deadline"]).replace(" ", "T")
            
      my_conf["deadlines"].append({
        "type": "Submission Deadline",
        "date": date_str
      })

    # Save file
    # Save and let git show the diff after the commits
    file_path = os.path.join(OUTPUT_DIR, f"{conf_id}.yaml")
        
    with open(file_path, "w", encoding="utf-8") as f:
      # allow_unicode=True
      yaml.dump(my_conf, f, allow_unicode=True, sort_keys=False)
        
    count += 1

  print(f"Proccess concluded. {count} files generated/updated.")

if __name__ == "__main__":
  # data = fetch_external_data()
  # transform_and_save(data)
  pass