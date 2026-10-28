"""Validate collage structure, original catalogue and new source coverage."""
import json
import re
import subprocess
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
raw = (ROOT / "projects.js").read_text()
projects = json.loads(raw.split("=", 1)[1].strip().removesuffix(";"))
original_projects = projects
node_script = "global.window = {}; require('./projects.js'); require('./pool-projects.js'); require('./artist-projects.js'); process.stdout.write(JSON.stringify(window.PORTFOLIO_PROJECTS));"
projects = json.loads(subprocess.check_output(["node", "-e", node_script], cwd=ROOT))
new_projects = projects[len(original_projects):25]
artist_projects = projects[25:]
assert projects[:13] == original_projects, "Original project data changed"
project_ids = {p["id"] for p in projects}
assert len(project_ids) == len(projects), "Duplicate project IDs"
love = json.loads(subprocess.check_output(["node", "-e", "global.window={};require('./love-project.js');process.stdout.write(JSON.stringify(window.LOVE_PROJECT));"], cwd=ROOT))
assert love["id"] == "love" and love["id"] not in project_ids
assert len(love["images"]) == 4 and "concept" in love["note"].lower()
project_ids.add(love["id"])
for art in love["images"]:
    assert art["alt"] and art["width"] > 0 and art["height"] > 0
    assert "crop" not in art, "New LOVE gallery images must be shown in full"
    assert art["src"].startswith("assets/love/love-"), "LOVE gallery must use the new standalone images"
assert len({art["src"] for art in love["images"]}) == 4, "LOVE gallery images must be distinct"
assert len(original_projects) == 13, "The original 13 project galleries must remain"
assert sum(len(p["images"]) for p in original_projects) == 55, "Original artwork missing"
assert sum(len(p.get("videos", [])) for p in original_projects) == 2, "Original film missing"
assert (ROOT / "CNAME").read_text().strip() == "meet-love.com", "Unexpected custom domain configuration"
assert len(new_projects) == 12, "Missing new collections"
assert sum(len(p["images"]) for p in new_projects) == 90, "Unique new still missing"
assert sum(len(p.get("videos", [])) for p in new_projects) == 4, "Unique new video missing"
new_items = [art for p in new_projects for art in p["images"] + p.get("videos", [])]
source_files = [name for art in new_items for name in art["sourceFiles"]]
assert len(source_files) == len(set(source_files)) == 100, "Every source must be accounted for exactly once"
assert len({art["src"] for art in new_items}) == 94, "Duplicate item in public galleries"
assert len(artist_projects) == 2, "Missing closing collections"
assert sum(len(p["images"]) for p in artist_projects) == 12, "Missing artist presentation or process image"
all_art = [art["src"] for p in projects for art in p["images"] + p.get("videos", [])]
assert len(all_art) == len(set(all_art)), "Duplicate artwork added to the catalogue"
artist_meta = json.loads(subprocess.check_output(["node", "-e", node_script.replace("JSON.stringify(window.PORTFOLIO_PROJECTS)", "JSON.stringify({sources:window.ARTIST_SOURCE_MAP,featured:window.ARTIST_FEATURED})")], cwd=ROOT))
assert len(artist_meta["sources"]) == 21, "Artist ZIP coverage is incomplete"
assert sum(item["status"] == "new" for item in artist_meta["sources"].values()) == 12
assert sum(item["status"] == "existing" for item in artist_meta["sources"].values()) == 9
assert all(item["src"] in all_art for item in artist_meta["sources"].values()), "Artist source points outside the catalogue"
for project_id, source, title in artist_meta["featured"]:
    project = next(p for p in artist_projects if p["id"] == project_id)
    assert source in {a["src"] for a in project["images"]} and title, "Broken closing feature"
assets = set()
assets.update(art["src"] for art in love["images"])
for project in projects:
    assert (project["images"] or project.get("videos")) and project["summary"] and project["title"]
    for image in [project["cover"], *project["images"]]:
        assert image["alt"] and image["width"] > 0 and image["height"] > 0
        assets.update([image["src"], image["thumb"]] if image == project["cover"] else [image["src"]])
    for video in project.get("videos", []):
        assets.update([video["src"], video["poster"]])

def add_asset(value, base=ROOT):
    """Resolve local URLs without query strings or fragment identifiers."""
    value = value.strip()
    if not value or value.startswith("#"):
        return
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc:
        return
    assert not parsed.path.startswith("/"), f"Root-relative URL breaks Pages: {value}"
    path = (base / unquote(parsed.path)).resolve()
    assert path.is_relative_to(ROOT), f"Asset outside site directory: {value}"
    assets.add(path.relative_to(ROOT).as_posix())


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = {}
        self.h1_count = 0
        self.nav_count = 0
        self.project_links = []
        self.fragment_links = []
        self.stylesheets = set()
        self.position = 0

    def handle_starttag(self, tag, attrs):
        self.position += 1
        attributes = dict(attrs)
        if tag == "h1":
            self.h1_count += 1
        if tag == "nav":
            self.nav_count += 1
        if "id" in attributes:
            identifier = attributes["id"]
            assert identifier not in self.ids, f"Duplicate HTML ID: {identifier}"
            self.ids[identifier] = self.position
        if tag == "link" and "stylesheet" in attributes.get("rel", "").split():
            self.stylesheets.add(attributes["href"])
        for name, value in attrs:
            if not value:
                continue
            if name == "srcset":
                for candidate in value.split(","):
                    add_asset(candidate.strip().split()[0])
            elif name in {"src", "href", "poster"}:
                if value.startswith("#project/"):
                    project_id = unquote(value.split("/", 1)[1])
                    assert project_id in project_ids, f"Unknown project: {project_id}"
                    self.project_links.append((self.position, project_id))
                elif value.startswith("#"):
                    self.fragment_links.append(value[1:])
                else:
                    add_asset(value)


page = Links()
page.feed((ROOT / "index.html").read_text())
assert page.h1_count == 1, "Use one portfolio H1"
assert page.nav_count == 1, "Use one main navigation"
chapters = ["paper-riot", "electric-playground", "hyperdream"]
assert all(chapter in page.ids for chapter in chapters), "Missing a visual world"
assert page.ids["paper-riot"] < page.ids["cut-through"] < page.ids["electric-playground"], "Collage interlude must sit between first and second worlds"
positions = [page.ids[chapter] for chapter in chapters]
assert positions == sorted(positions), "Visual worlds are out of order"
assert page.ids["hyperdream"] < page.ids["afterimage"] < page.ids["archive"], "Closing chapter is out of order"
assert page.ids["archive"] < page.ids["love"] < page.ids["about"], "LOVE must follow All the work and precede About"
assert "lightbox-crop" in page.ids, "Missing cropped artwork enlargement view"
featured = set()
for start, end in zip(positions, positions[1:]):
    interlude = {project_id for position, project_id in page.project_links if start < position < end}
    assert len(interlude) >= 4, "Each interlude needs at least four original projects"
    featured.update(interlude)
assert len(featured) >= 8, "Eight different original projects must connect the worlds"
for target in page.fragment_links:
    assert not target or target in page.ids, f"Broken section link: #{target}"

for stylesheet in page.stylesheets:
    parsed = urlsplit(stylesheet)
    if parsed.scheme or parsed.netloc:
        continue
    css_path = ROOT / unquote(parsed.path)
    css = css_path.read_text()
    for match in re.finditer(r"url\(\s*(['\"]?)(.*?)\1\s*\)", css, re.IGNORECASE):
        add_asset(match.group(2), css_path.parent)

for world in ("paper", "cut-through", "electric", "hyperdream", "afterimage"):
    assets.update({f"assets/world-{world}.webp", f"assets/world-{world}-small.webp"})

for asset in assets:
    path = ROOT / asset
    assert path.is_file() and path.stat().st_size > 0, f"Missing or empty: {asset}"
html = (ROOT / "index.html").read_text()
assert "Independent creative practice / Worldwide" in html and "<span>WORLDWIDE</span>" in html
assert "LONDON, UK" not in html and "practice / London" not in html
assert "mailto:" not in html and "rudyhartt@" not in html, "Public email must stay removed"
assert "assets/world-paper.webp" in html and "world-paper-skate" not in html, "Keep the original ribbon banner"
print(f"PASS: 100 pool sources and 21 artist sources accounted for, four chapters in order, one H1/navigation, {len(featured)} original featured projects, "
      f"{len(projects)} index galleries plus four LOVE studies, {len(assets)} local assets and meet-love.com custom domain.")
