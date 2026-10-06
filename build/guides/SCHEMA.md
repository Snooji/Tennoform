# Guide JSON schema (one JSON array per output file)

Each entry:
{
  "id": "helminth",                      // lowercase slug, unique
  "n": "Helminth",                       // display name, exactly as the wiki titles it
  "kind": "quest" | "system" | "mode",   // quest = a Codex quest; system = an unlockable feature (Helminth, Railjack...); mode = a mission type or special mission
  "aka": ["helminth chair", "subsume", "infuse abilities"],  // 3-8 lowercase words/phrases a player might type in search
  "sum": "One or two plain sentences: what it is and why you want it.",
  "unlock": {
    "mr": 8,                             // minimum Mastery Rank, or null if none
    "quests": ["Heart of Deimos"],       // quests that must be finished first (exact wiki quest names), [] if none
    "other": ["Reach rank 5 (Family) with Entrati on Deimos"]  // other requirements in plain words, [] if none
  },
  "steps": [                             // 3-12 ordered steps a player follows, imperative voice, one action each
    {"t": "Finish Heart of Deimos.", "tip": "optional short tip for this step"}
  ],
  "fast": ["2-5 concrete tips for doing it quickest / easiest, e.g. which Warframe or weapon trivialises a stage, how to skip waiting"],
  "rw": ["Main rewards, short names"],   // [] if none
  "time": "~30 min",                     // rough time to complete or unlock, or "" if not meaningful
  "go": ["Xaku", "Helminth Charger"],    // optional: names of related Warframes/weapons/items/quests (exact names), [] if none
  "w": "https://wiki.warframe.com/w/Helminth"
}

Rules:
- Get facts from the Warframe wiki. Fetch wikitext with:
  curl -s "https://wiki.warframe.com/api.php?action=parse&page=PAGE_NAME&prop=wikitext&format=json&redirects=1"
  (URL-encode the page name; spaces as _). Read the requirements, walkthrough and rewards sections.
- Only state what the wiki supports. If a number (standing, MR, resource cost) isn't on the wiki page, leave it out rather than guess.
- Plain, friendly English. No wiki markup, no "[[...]]", no HTML. Spoiler-light: describe what to do, not story twists.
- "fast" tips must be practical (e.g. "Bring a Warframe with crowd control such as Khora for the defense stage"), drawn from the wiki's tips/notes/walkthrough or widely documented on the wiki.
- Write valid JSON (UTF-8, double quotes). Validate with: python3 -c "import json;json.load(open('FILE'))"
