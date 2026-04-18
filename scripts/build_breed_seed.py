import json
import pathlib
import re

import requests

HEADERS = {
    'User-Agent': 'OpenClaw/1.0 (contact: jacobsouro02@gmail.com)',
}
URL = 'https://en.wikipedia.org/w/api.php?action=parse&page=List_of_pig_breeds&prop=wikitext&format=json'
OUT_PATH = pathlib.Path(r'C:\Users\jacob\.openclaw\workspace\breed_seed.json')


def clean_links(text: str) -> str:
    return re.sub(r'\[\[([^\]|]+\|)?([^\]]+)\]\]', lambda m: m.group(2), text).strip()


response = requests.get(URL, headers=HEADERS, timeout=30)
response.raise_for_status()
text = response.json()['parse']['wikitext']['*']
rows = text.split('|-')
out = []

for row in rows[2:]:
    parts = [p.strip() for p in row.split('||')]
    if len(parts) < 6:
        continue

    breed = re.sub(r'\{\{Anchor\|[^}]+\}\}', '', parts[0])
    breed = clean_links(breed).replace("'''", '').replace("''", '').strip()
    origin = clean_links(parts[1]) or 'Unknown'
    color = clean_links(parts[4]) or 'Unknown'
    image_match = re.search(r'\[\[File:(.+?)\|', parts[5])
    image = image_match.group(1) if image_match else None

    if breed and breed != 'Breed':
        out.append(
            {
                'name': breed,
                'origin': origin,
                'color': color,
                'image': image,
            }
        )

OUT_PATH.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding='utf-8')
print(len(out))
