#!/usr/bin/env python3
"""
Convert competitions-database.csv into:
  1. assets/competitions.json - canonical JSON, human-readable, used for future
     metaobject migration map.
  2. snippets/theinmag-competitions-data.liquid - parallel-array Liquid snippet
     that the section file iterates over.

Why parallel arrays in Liquid: Shopify Liquid has no JSON parse and no
metaobjects yet (Option A migration is later). Parallel arrays are the
idiomatic split-by-delimiter pattern that the rest of the theme already
uses for static lists.

Why a single delimiter (|): no field in the source CSV contains a pipe.
Verified by grep before writing this script.

Run from /theinmag-dawn root:
    python3 _tools/build-competitions-data.py
"""

import csv
import json
import os
import sys
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(ROOT, "competitions-database.csv")
JSON_OUT = os.path.join(ROOT, "assets", "competitions.json")
SNIPPET_OUT = os.path.join(ROOT, "snippets", "theinmag-competitions-data.liquid")

# Category mapping: CSV "Category" -> normalised slug + chip colour pair
CATEGORY_MAP = {
    "Art": "art",
    "Writing": "writing",
    "Photography & Film": "photofilm",
    "STEM": "stem",
    "Performance": "performance",
    "Social Good": "social-good",
}

# Cost mapping: CSV value -> filter slug
def cost_to_slug(raw):
    s = (raw or "").lower()
    if "paid-optional" in s or "paid optional" in s:
        return "paid-optional"
    if s.startswith("free"):
        return "free"
    if "paid" in s:
        return "paid"
    return "free"

# Build the list of age tags from the four boolean columns
def age_tags(row):
    out = []
    for csv_col, slug in [
        ("Age 4-6", "ages-4-6"),
        ("Age 7-9", "ages-7-9"),
        ("Age 10-12", "ages-10-12"),
        ("Age 13-16", "ages-13-16"),
    ]:
        if (row.get(csv_col) or "").strip().upper() == "TRUE":
            out.append(slug)
    if len(out) == 4:
        out.append("all-ages")
    return out

# Compute one of: live-now, opens-in-N, closed, soon (for TBC dates)
def state_for(row):
    raw = (row.get("Closing date 2026") or "").strip()
    if not raw or raw.upper() in {"TBC", "ROLLING", "VARIES", "MONTHLY", "QUARTERLY", "YEAR-ROUND", "TERM 2 ONWARDS", "AUG-APR", "TERM 1", "TERM 3"}:
        return "soon"
    try:
        y, m, d = [int(x) for x in raw.split("-")]
        comp_date = date(y, m, d)
    except Exception:
        return "soon"
    today = date(2026, 5, 7)  # script-stable "now"; section computes live in Liquid too
    delta = (comp_date - today).days
    if delta < 0:
        return "closed"
    if delta > 30:
        return "opens-in"
    return "live-now"

# First letter of name, used as visual placeholder when no logo exists
def first_letter(name):
    s = (name or "").strip()
    if not s:
        return "?"
    return s[0].upper()


# Resolve a logo filename for a comp: looks in assets/logos/<id>.<ext> for any
# common image extension. Returns the basename relative to /assets/, or '' if
# none found. Auto-fetched by _tools/audit-competitions.py; tiny favicons are
# excluded by a post-fetch size filter (rather than the script).
def find_logo_filename(comp_id):
    if not comp_id:
        return ""
    logos_dir = os.path.join(ROOT, "assets", "logos")
    if not os.path.isdir(logos_dir):
        return ""
    for ext in (".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".ico"):
        candidate = os.path.join(logos_dir, comp_id + ext)
        if os.path.exists(candidate):
            return "logos/" + comp_id + ext
    return ""

# Build the search blob - concatenated text used by the JS search filter
def search_blob(row):
    parts = [
        row.get("Name", ""),
        row.get("Category", ""),
        row.get("Sub-category", ""),
        row.get("The pitch", ""),
        row.get("Fields", ""),
        row.get("Where", ""),
    ]
    return " ".join(p for p in parts if p).lower()

# Sanitise text for embedding inside a Liquid string literal: escape single
# quotes (since we wrap in single quotes) and collapse whitespace.
def liquid_safe(s):
    s = (s or "").replace("\r", " ").replace("\n", " ").strip()
    while "  " in s:
        s = s.replace("  ", " ")
    return s.replace("'", "’")  # curly apostrophe - reads naturally, escapes safely

# Assert no field contains the pipe delimiter
def assert_no_pipes(rows, fields):
    for i, r in enumerate(rows):
        for f in fields:
            v = r.get(f, "") or ""
            if "|" in v:
                raise SystemExit(f"Row {i} field {f} contains pipe character. Pick a different delimiter.")


def main():
    with open(CSV_PATH, newline="", encoding="utf-8") as fp:
        reader = csv.DictReader(fp)
        rows = list(reader)

    # All text fields we'll embed into Liquid strings
    text_fields = [
        "ID", "Name", "Category", "The pitch", "Closing date 2026",
        "Where", "Cost", "States", "Fields", "Format", "Website",
        "Cross-promo tier", "Cross-promo signal", "Status",
    ]
    assert_no_pipes(rows, text_fields)

    # ---------- Build JSON ----------
    json_data = []
    for r in rows:
        json_data.append({
            "id": r.get("ID", ""),
            "name": r.get("Name", ""),
            "category": r.get("Category", ""),
            "category_slug": CATEGORY_MAP.get(r.get("Category", ""), "art"),
            "sub_category": r.get("Sub-category", ""),
            "status": r.get("Status", ""),
            "pitch": r.get("The pitch", ""),
            "when": r.get("When (annual window)", ""),
            "closing_date_2026": r.get("Closing date 2026", ""),
            "where": r.get("Where", ""),
            "cost_raw": r.get("Cost", ""),
            "cost_slug": cost_to_slug(r.get("Cost", "")),
            "ages": age_tags(r),
            "states": [s.strip() for s in (r.get("States") or "").split(",") if s.strip()],
            "fields": [s.strip() for s in (r.get("Fields") or "").split(",") if s.strip()],
            "format": [s.strip() for s in (r.get("Format") or "").split(",") if s.strip()],
            "website": r.get("Website", ""),
            "cross_tier": r.get("Cross-promo tier", ""),
            "cross_signal": r.get("Cross-promo signal", ""),
            "tile_state": state_for(r),
            "first_letter": first_letter(r.get("Name", "")),
            "logo_filename": find_logo_filename(r.get("ID", "")),
        })

    os.makedirs(os.path.dirname(JSON_OUT), exist_ok=True)
    with open(JSON_OUT, "w", encoding="utf-8") as fp:
        json.dump({"competitions": json_data}, fp, indent=2, ensure_ascii=False)

    # ---------- Build Liquid snippet ----------
    DELIM = "|"

    def col(getter):
        return DELIM.join(liquid_safe(getter(r)) for r in rows)

    def col_list(getter):
        return DELIM.join(",".join(getter(r)) for r in rows)

    def col_letter(getter):
        return DELIM.join(getter(r) for r in rows)

    # All filter tags joined into one string per comp, space-separated
    def all_tags(r):
        tags = []
        tags.extend(age_tags(r))
        tags.extend(s.strip() for s in (r.get("States") or "").split(",") if s.strip())
        tags.extend(s.strip() for s in (r.get("Fields") or "").split(",") if s.strip())
        tags.append(cost_to_slug(r.get("Cost", "")))
        tags.extend(s.strip() for s in (r.get("Format") or "").split(",") if s.strip())
        tags.append(CATEGORY_MAP.get(r.get("Category", ""), "art"))
        return " ".join(tags)

    # Spotlight pool: locked to a 3-card editor-curated rotation per Ryan's
    # review. More than 3 means waiting too long for a card you saw earlier
    # to come back around. Order is the rotation order on page load.
    SPOTLIGHT_ORDER = [
        "micador-giveaways",
        "banabae-artists",
        "spencil-art-prize",
    ]
    by_id = {r["ID"]: r for r in rows}
    spotlight_ids = [cid for cid in SPOTLIGHT_ORDER if cid in by_id]

    lines = []
    lines.append("{%- comment -%}")
    lines.append("  theinmag-competitions-data")
    lines.append("  Generated from competitions-database.csv by")
    lines.append("  _tools/build-competitions-data.py - DO NOT EDIT BY HAND.")
    lines.append("  Re-run the script after any CSV change.")
    lines.append("")
    lines.append("  Defines parallel arrays - one per field - keyed by index.")
    lines.append("  The competitions section iterates 0..size-1 and reads each")
    lines.append("  field by index. Pipe (|) is the row delimiter; no field")
    lines.append("  in the source contains a pipe (script asserts this).")
    lines.append("{%- endcomment -%}")
    lines.append("")
    lines.append("{%- liquid")
    lines.append(f"  assign comp_ids = '{col(lambda r: r.get('ID',''))}' | split: '{DELIM}'")
    lines.append(f"  assign comp_names = '{col(lambda r: r.get('Name',''))}' | split: '{DELIM}'")
    lines.append(f"  assign comp_category_slugs = '{col(lambda r: CATEGORY_MAP.get(r.get('Category',''),'art'))}' | split: '{DELIM}'")
    lines.append(f"  assign comp_categories = '{col(lambda r: r.get('Category',''))}' | split: '{DELIM}'")
    lines.append(f"  assign comp_pitches = '{col(lambda r: r.get('The pitch',''))}' | split: '{DELIM}'")
    lines.append(f"  assign comp_closing_dates = '{col(lambda r: r.get('Closing date 2026',''))}' | split: '{DELIM}'")
    lines.append(f"  assign comp_wheres = '{col(lambda r: r.get('Where',''))}' | split: '{DELIM}'")
    lines.append(f"  assign comp_costs = '{col(lambda r: r.get('Cost',''))}' | split: '{DELIM}'")
    lines.append(f"  assign comp_cost_slugs = '{col(lambda r: cost_to_slug(r.get('Cost','')))}' | split: '{DELIM}'")
    lines.append(f"  assign comp_websites = '{col(lambda r: r.get('Website',''))}' | split: '{DELIM}'")
    lines.append(f"  assign comp_letters = '{col(lambda r: first_letter(r.get('Name','')))}' | split: '{DELIM}'")
    lines.append(f"  assign comp_logos = '{col(lambda r: find_logo_filename(r.get('ID','')))}' | split: '{DELIM}'")
    lines.append(f"  assign comp_states_raw = '{col(lambda r: r.get('States',''))}' | split: '{DELIM}'")
    lines.append(f"  assign comp_fields_raw = '{col(lambda r: r.get('Fields',''))}' | split: '{DELIM}'")
    lines.append(f"  assign comp_formats_raw = '{col(lambda r: r.get('Format',''))}' | split: '{DELIM}'")
    lines.append(f"  assign comp_tile_states = '{col(lambda r: state_for(r))}' | split: '{DELIM}'")
    lines.append(f"  assign comp_tags = '{col(all_tags)}' | split: '{DELIM}'")
    lines.append(f"  assign comp_search_blobs = '{col(search_blob)}' | split: '{DELIM}'")
    lines.append(f"  assign comp_when_text = '{col(lambda r: r.get('When (annual window)',''))}' | split: '{DELIM}'")
    lines.append("")
    lines.append(f"  assign spotlight_ids = '{','.join(spotlight_ids)}' | split: ','")
    lines.append("-%}")

    os.makedirs(os.path.dirname(SNIPPET_OUT), exist_ok=True)
    with open(SNIPPET_OUT, "w", encoding="utf-8") as fp:
        fp.write("\n".join(lines) + "\n")

    print(f"Wrote {JSON_OUT}")
    print(f"Wrote {SNIPPET_OUT}")
    print(f"  competitions: {len(rows)}")
    print(f"  spotlight pool: {len(spotlight_ids)} ({', '.join(spotlight_ids)})")


if __name__ == "__main__":
    main()
