# -*- coding: utf-8 -*-
import pathlib

BASE = pathlib.Path(r"c:\Users\user\Desktop\СТРОЙКА")
OLD_LOGO = '<span class="logo__brand">РЕСТРОЙ</span><span class="logo__num">64</span>'
NEW_LOGO = '<span class="logo__rem">РЕМ</span><span class="logo__stroy">СТРОЙ</span><span class="logo__num">64</span>'

for path in BASE.rglob("*.html"):
    if "tools" in path.parts:
        continue
    t = path.read_text(encoding="utf-8")
    o = t
    t = t.replace(OLD_LOGO, NEW_LOGO)
    t = t.replace("«Рестрой&nbsp;64»", "«РЕМСТРОЙ64»")
    t = t.replace("Рестрой&nbsp;64", "РЕМСТРОЙ64")
    t = t.replace("Рестрой 64", "РЕМСТРОЙ64")
    if t != o:
        path.write_text(t, encoding="utf-8")
        print(path.relative_to(BASE))

for path in (BASE / "partials").glob("*.html"):
    t = path.read_text(encoding="utf-8")
    o = t
    t = t.replace("«Рестрой&nbsp;64»", "«РЕМСТРОЙ64»")
    t = t.replace("Рестрой 64", "РЕМСТРОЙ64")
    if t != o:
        path.write_text(t, encoding="utf-8")
        print("partial", path.name)

# patch_brand.py logo constant
pb = BASE / "tools" / "patch_brand.py"
if pb.exists():
    t = pb.read_text(encoding="utf-8")
    t = t.replace(OLD_LOGO.replace("РЕСТРОЙ", "РЕСТРОЙ"), NEW_LOGO)  # same OLD
    t = t.replace(
        '<span class="logo__brand">РЕСТРОЙ</span><span class="logo__num">64</span>',
        NEW_LOGO,
    )
    t = t.replace("Рестрой 64", "РЕМСТРОЙ64")
    pb.write_text(t, encoding="utf-8")
    print("patch_brand.py")
