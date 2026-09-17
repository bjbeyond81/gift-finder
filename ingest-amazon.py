#!/usr/bin/env python3
"""Inbox Amazon.it -> data-5.js (Tech). Tag fisso 357921-21."""
import json, re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent
INBOX = ROOT / "inbox-tech.txt"
OUT = ROOT / "data-5.js"
TAG = "357921-21"
SLUG_RE = re.compile(r"amazon\.[^/]+/([^/]+)/dp/([A-Z0-9]{10})", re.I)

def budget(price):
    if price is None: return "oltre_100"
    if price < 20: return "sotto_20"
    if price < 50: return "20_50"
    if price < 100: return "50_100"
    return "oltre_100"

def title_from_slug(slug):
    s = re.sub(r"%[0-9A-Fa-f]{2}", " ", slug)
    s = s.replace("-", " ").replace("_", " ")
    s = re.sub(r"\s+", " ", s).strip()
    return s[:140] if s else ""

def parse_line(line):
    line = line.strip()
    if not line or line.startswith("#"):
        return None
    parts = [p.strip() for p in line.split("|")]
    url = parts[0]
    title = parts[1] if len(parts) > 1 and parts[1] else ""
    price = None
    if len(parts) > 2 and parts[2]:
        try:
            price = float(parts[2].replace(",", ".").replace("€", "").strip())
        except ValueError:
            price = None
    m = SLUG_RE.search(url)
    asin = None
    if m:
        asin = m.group(2).upper()
        if not title:
            title = title_from_slug(m.group(1))
    if not asin:
        cands = re.findall(r"B[0-9A-Z]{9}", url.upper())
        asin = cands[0] if cands else None
    if not asin:
        return None
    if not title:
        title = "Prodotto Tech Amazon " + asin
    if not any(k in title.lower() for k in ("iphone", "usb", "tech", "cuffie", "airpod", "earpod")):
        title = title + " — Tech"
    clean = f"https://www.amazon.it/dp/{asin}?tag={TAG}"
    img = f"https://images-eu.ssl-images-amazon.com/images/P/{asin}.01._AC_SL500_.jpg"
    return {"c": "papà", "b": budget(price), "t": title[:180], "p": float(price) if price is not None else 0, "u": clean, "i": img}

def main():
    items, seen = [], set()
    for line in INBOX.read_text(encoding="utf-8").splitlines():
        row = parse_line(line)
        if not row:
            continue
        asin = row["u"].split("/dp/")[1].split("?")[0]
        if asin in seen:
            continue
        seen.add(asin)
        items.append(row)
    OUT.write_text("window.PRODUCTS=(window.PRODUCTS||[]).concat(" + json.dumps(items, ensure_ascii=False, separators=(",", ":")) + ");\n", encoding="utf-8")
    print(f"wrote {len(items)} tech products -> {OUT.name}")

if __name__ == "__main__":
    main()
