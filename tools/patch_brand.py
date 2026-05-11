# -*- coding: utf-8 -*-
import pathlib

BASE = pathlib.Path(r"c:\Users\user\Desktop\СТРОЙКА")
LOGO = '<span class="logo__rem">РЕМ</span><span class="logo__stroy">СТРОЙ</span><span class="logo__num">64</span>'
DOMAIN_OLD = "https://example.com"
DOMAIN_NEW = "https://remstroy64.vercel.app"

for path in list(BASE.rglob("*.html")) + list(BASE.rglob("*.xml")) + list(BASE.rglob("*.txt")):
    if "tools" in path.parts:
        continue
    text = path.read_text(encoding="utf-8")
    orig = text
    text = text.replace(DOMAIN_OLD, DOMAIN_NEW)
    text = text.replace("Стройка <span>Саратов</span>", LOGO)
    text = text.replace("Стройка Саратов — строительная бригада", "РЕМСТРОЙ64 — строительная бригада")
    text = text.replace("Стройка Саратов", "РЕМСТРОЙ64")
    if text != orig:
        path.write_text(text, encoding="utf-8")
        print("patched", path.name)

inc = (BASE / "partials" / "local-seo-services.inc.html").read_text(encoding="utf-8")
marker = '<main id="main">'
end_tag = "</header>"
for path in (BASE / "services").glob("*.html"):
    text = path.read_text(encoding="utf-8")
    if 'class="local-seo"' in text:
        print("skip insert", path.name)
        continue
    i = text.find(marker)
    if i < 0:
        print("no main", path.name)
        continue
    sub = text[i:]
    j = sub.find(end_tag)
    if j < 0:
        print("no header", path.name)
        continue
    pos = i + j + len(end_tag)
    text = text[:pos] + inc + text[pos:]
    path.write_text(text, encoding="utf-8")
    print("inserted", path.name)
