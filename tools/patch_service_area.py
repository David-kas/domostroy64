# -*- coding: utf-8 -*-
import json
import pathlib
import re

BASE = pathlib.Path(r"c:\Users\user\Desktop\СТРОЙКА\services")
AREA = {
    "@type": "AdministrativeArea",
    "name": "Saratov Oblast",
    "alternateName": "Саратовская область",
}

for path in BASE.glob("*.html"):
    text = path.read_text(encoding="utf-8")
    m = re.search(
        r'<script type="application/ld\+json">\s*(\{.*?\})\s*</script>',
        text,
        re.DOTALL,
    )
    if not m:
        continue
    raw = m.group(1)
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        print("json skip", path.name)
        continue
    changed = False
    if isinstance(data, dict) and "@graph" in data:
        for node in data["@graph"]:
            if node.get("@type") == "Service":
                if "areaServed" not in node:
                    node["areaServed"] = [AREA]
                    changed = True
    if not changed:
        continue
    new_json = json.dumps(data, ensure_ascii=False, indent=2)
    new_block = '<script type="application/ld+json">\n' + new_json + "\n  </script>"
    text2 = re.sub(
        r'<script type="application/ld\+json">\s*\{.*?\}\s*</script>',
        new_block,
        text,
        count=1,
        flags=re.DOTALL,
    )
    path.write_text(text2, encoding="utf-8")
    print("schema areaServed", path.name)
