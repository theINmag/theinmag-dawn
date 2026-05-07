#!/usr/bin/env python3
"""
Combined audit pass over every comp in competitions-database.csv:
  1. Fetch the website
  2. Logo: extract og:image / twitter:image / apple-touch-icon /
     icon link / favicon.ico (in that priority). Download to
     assets/logos/<id>.<ext>.
  3. Link verification: scan page text for the comp name. If the
     comp name isn't found on the page, flag the URL as
     "verify" (likely points to a homepage rather than the comp's
     entry page).

Outputs:
  - assets/logos/<id>.<ext>           (one per successful fetch)
  - _tools/comps-logos.csv            (id, status, logo_filename, source, error)
  - _tools/comps-link-audit.csv       (id, name, url, name_match, redirected_to, http_status, flag)

Concurrency: ThreadPoolExecutor, 8 workers, ~10s timeout each.
Stdlib only - no requests/bs4 dependency.

Run from /theinmag-dawn root:
    python3 _tools/audit-competitions.py
"""

import csv
import io
import json
import os
import re
import socket
import ssl
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
from urllib import request, error
from urllib.parse import urljoin, urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(ROOT, "competitions-database.csv")
LOGO_DIR = os.path.join(ROOT, "assets", "logos")
LOGOS_OUT = os.path.join(ROOT, "_tools", "comps-logos.csv")
LINKS_OUT = os.path.join(ROOT, "_tools", "comps-link-audit.csv")

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) theinmag-audit/1.0"
TIMEOUT = 12
MAX_BODY = 800_000  # bytes - cap so a giant page doesn't kill us

# Allow images up to ~1MB (matches the 1MB Shopify /assets/ cap)
MAX_IMG = 1_000_000

# Tolerate self-signed / weak SSL on government sites
SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE


def fetch(url, max_bytes=MAX_BODY):
    """GET with timeout, follow redirects, return (final_url, status, bytes, content_type)."""
    req = request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    with request.urlopen(req, timeout=TIMEOUT, context=SSL_CTX) as resp:
        body = resp.read(max_bytes)
        ct = resp.headers.get("Content-Type", "").lower()
        return resp.url, resp.status, body, ct


class MetaImageParser(HTMLParser):
    """Pulls out og:image, twitter:image, apple-touch-icon, link rel=icon."""

    def __init__(self):
        super().__init__()
        self.og = None
        self.twitter = None
        self.apple = None
        self.icon = None
        self.title = None
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "meta":
            prop = (a.get("property") or "").lower()
            name = (a.get("name") or "").lower()
            content = a.get("content")
            if not content:
                return
            if prop == "og:image":
                self.og = self.og or content
            elif name == "twitter:image" or prop == "twitter:image":
                self.twitter = self.twitter or content
        elif tag == "link":
            rel = (a.get("rel") or "").lower()
            href = a.get("href")
            if not href:
                return
            if "apple-touch-icon" in rel:
                self.apple = self.apple or href
            elif rel in ("icon", "shortcut icon", "shortcut") or "icon" in rel:
                self.icon = self.icon or href
        elif tag == "title":
            self._in_title = True

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._in_title and not self.title:
            self.title = data.strip()


def best_logo_candidates(html_str, base_url):
    """Return prioritized list of absolute URLs to try for a logo."""
    p = MetaImageParser()
    try:
        p.feed(html_str)
    except Exception:
        pass
    candidates = []
    for c in [p.og, p.twitter, p.apple, p.icon]:
        if c:
            candidates.append(urljoin(base_url, c))
    # Always try /favicon.ico as last fallback
    parsed = urlparse(base_url)
    candidates.append(f"{parsed.scheme}://{parsed.netloc}/favicon.ico")
    # de-dupe preserving order
    seen = set()
    out = []
    for u in candidates:
        if u and u not in seen:
            seen.add(u)
            out.append(u)
    return out


def ext_for(url, content_type):
    ct = (content_type or "").lower()
    if "png" in ct:
        return ".png"
    if "jpeg" in ct or "jpg" in ct:
        return ".jpg"
    if "gif" in ct:
        return ".gif"
    if "webp" in ct:
        return ".webp"
    if "svg" in ct or "svg" in url.lower():
        return ".svg"
    if "icon" in ct or url.lower().endswith(".ico"):
        return ".ico"
    # fall back from URL
    parsed = urlparse(url)
    path = parsed.path.lower()
    for ext in (".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico"):
        if path.endswith(ext):
            return ".jpg" if ext == ".jpeg" else ext
    return ".png"


def text_from_html(html_str):
    """Strip tags, collapse whitespace, lowercase."""
    no_script = re.sub(r"<script\b[^>]*>.*?</script>", " ", html_str, flags=re.DOTALL | re.IGNORECASE)
    no_style = re.sub(r"<style\b[^>]*>.*?</style>", " ", no_script, flags=re.DOTALL | re.IGNORECASE)
    no_tags = re.sub(r"<[^>]+>", " ", no_style)
    return re.sub(r"\s+", " ", no_tags).strip().lower()


def name_match_score(comp_name, page_text, page_title):
    """Did the page mention this comp? Returns one of: full, partial, miss."""
    name = (comp_name or "").lower().strip()
    if not name:
        return "miss"
    if name in page_text:
        return "full"
    if page_title and name in page_title.lower():
        return "full"
    # partial: at least 2 distinctive tokens (4+ chars, not stopwords) co-occur
    tokens = [t for t in re.split(r"\W+", name) if len(t) >= 4 and t not in
              {"comp", "comps", "kids", "kid", "young", "youth", "award", "awards",
               "competition", "competitions", "prize", "prizes", "australian"}]
    hits = sum(1 for t in tokens if t in page_text)
    if hits >= 2:
        return "partial"
    if tokens and hits >= 1 and len(tokens) <= 2:
        return "partial"
    return "miss"


def process_one(row):
    """Return (logo_record, link_record). One row of CSV."""
    cid = row.get("ID", "")
    name = row.get("Name", "")
    url = (row.get("Website") or "").strip()
    logo_rec = {"id": cid, "name": name, "url": url, "status": "skip", "logo_filename": "",
                "source": "", "error": ""}
    link_rec = {"id": cid, "name": name, "url": url, "name_match": "miss",
                "redirected_to": "", "http_status": "", "page_title": "", "flag": "no-url"}

    if not url or url == "":
        return logo_rec, link_rec

    try:
        final_url, status, body, ct = fetch(url)
    except (error.URLError, socket.timeout, ssl.SSLError, Exception) as e:
        msg = str(e)[:200]
        logo_rec["status"] = "fail"
        logo_rec["error"] = msg
        link_rec["flag"] = "fetch-failed"
        link_rec["http_status"] = msg
        return logo_rec, link_rec

    link_rec["http_status"] = status
    link_rec["redirected_to"] = final_url if final_url != url else ""

    # decode html
    try:
        html_str = body.decode("utf-8", errors="ignore")
    except Exception:
        html_str = body.decode("latin-1", errors="ignore")

    # ---- logo ----
    parser = MetaImageParser()
    try:
        parser.feed(html_str)
    except Exception:
        pass
    link_rec["page_title"] = (parser.title or "")[:200]
    candidates = best_logo_candidates(html_str, final_url)

    chosen = None
    chosen_src = ""
    for cand in candidates:
        try:
            f_url, f_status, img_body, img_ct = fetch(cand, max_bytes=MAX_IMG)
            if f_status >= 400 or not img_body:
                continue
            # Skip likely-tiny favicons that aren't true logos. Allow .ico
            # since favicons are a valid fallback - just better-than-nothing.
            chosen = (img_body, ext_for(f_url, img_ct))
            # tag the source - first candidate wins (priority order baked in)
            chosen_src = cand
            break
        except Exception:
            continue

    if chosen:
        body_bytes, ext = chosen
        out_path = os.path.join(LOGO_DIR, f"{cid}{ext}")
        try:
            with open(out_path, "wb") as f:
                f.write(body_bytes)
            logo_rec["status"] = "ok"
            logo_rec["logo_filename"] = os.path.basename(out_path)
            logo_rec["source"] = chosen_src
        except Exception as e:
            logo_rec["status"] = "fail"
            logo_rec["error"] = f"write: {e}"
    else:
        logo_rec["status"] = "fail"
        logo_rec["error"] = "no logo candidate succeeded"

    # ---- link verification ----
    page_text = text_from_html(html_str)
    score = name_match_score(name, page_text, parser.title)
    link_rec["name_match"] = score
    if score == "miss":
        link_rec["flag"] = "verify-url"
    elif score == "partial":
        link_rec["flag"] = "partial-match"
    else:
        link_rec["flag"] = "ok"

    return logo_rec, link_rec


def main():
    os.makedirs(LOGO_DIR, exist_ok=True)
    with open(CSV_PATH, newline="", encoding="utf-8") as fp:
        rows = list(csv.DictReader(fp))

    print(f"Auditing {len(rows)} competitions...")
    t0 = time.time()

    logos = []
    links = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(process_one, r): r.get("ID", "") for r in rows}
        for i, fut in enumerate(as_completed(futures), 1):
            try:
                logo_rec, link_rec = fut.result()
            except Exception as e:
                cid = futures[fut]
                logo_rec = {"id": cid, "name": "", "url": "", "status": "fail",
                            "logo_filename": "", "source": "", "error": str(e)[:200]}
                link_rec = {"id": cid, "name": "", "url": "", "name_match": "miss",
                            "redirected_to": "", "http_status": "", "page_title": "",
                            "flag": "exception"}
            logos.append(logo_rec)
            links.append(link_rec)
            print(f"  [{i:>2}/{len(rows)}] {logo_rec['id'][:30]:<30} logo:{logo_rec['status']:<5} link:{link_rec['flag']}")

    # Write logo report
    with open(LOGOS_OUT, "w", newline="", encoding="utf-8") as fp:
        w = csv.DictWriter(fp, fieldnames=["id", "name", "url", "status", "logo_filename", "source", "error"])
        w.writeheader()
        for r in sorted(logos, key=lambda x: x["id"]):
            w.writerow(r)

    # Write link audit
    with open(LINKS_OUT, "w", newline="", encoding="utf-8") as fp:
        w = csv.DictWriter(fp, fieldnames=["id", "name", "url", "name_match", "redirected_to",
                                            "http_status", "page_title", "flag"])
        w.writeheader()
        for r in sorted(links, key=lambda x: x["id"]):
            w.writerow(r)

    ok_logos = sum(1 for r in logos if r["status"] == "ok")
    flagged = sum(1 for r in links if r["flag"] in ("verify-url", "partial-match", "fetch-failed"))
    print(f"\nDone in {time.time() - t0:.0f}s")
    print(f"  Logos saved: {ok_logos}/{len(rows)} -> {LOGO_DIR}")
    print(f"  Link audit:  {flagged} flagged for review -> {LINKS_OUT}")


if __name__ == "__main__":
    main()
