# "Way to farm" entries (one JSON array per file)

For things you farm that aren't a single item drop: credits, standing, Endo, affinity, Focus, Forma...

{
  "id": "credits",                           // lowercase slug, unique
  "n": "Credits",                            // display name
  "cat": "Currency" | "Standing" | "Progress" | "Upgrades",
  "aka": ["money", "cash", "creds"],         // 3-8 lowercase words players might search
  "sum": "One plain sentence: what it's for and the short answer to 'where do I get it fast'.",
  "ways": [                                  // 3-7 ways, BEST FIRST (fastest for most players), then easier/beginner options
    {
      "t": "The Index (Neptune)",            // short title: place, mission or activity
      "how": "What you actually do, in one or two plain sentences.",
      "why": "Why it's good. Include a yield/rate ONLY if the wiki states it (e.g. '~250,000 credits for 3 rounds').",
      "req": "What you need first (MR, quest, junction, rank) or '' if nothing special",
      "tags": ["fastest", "beginner", "afk", "solo", "squad", "endgame", "daily", "weekly"],   // 1-3 that apply
      "node": "Index (Neptune)"              // optional: the star chart node 'Name (Planet)' if it's one node, else ''
    }
  ],
  "tips": ["2-5 short practical tips: boosters, Smeeta Kavat, specific Warframes, resource-boost mods, timing"],
  "w": "https://wiki.warframe.com/w/Credits"
}

Rules:
- Facts from the Warframe wiki. Fetch wikitext with:
  curl -s "https://wiki.warframe.com/api.php?action=parse&page=PAGE_NAME&prop=wikitext&format=json&redirects=1"
  Many pages have a "Farming", "Acquisition" or "Tips" section, and some topics have dedicated guide pages (e.g. "Credit Farming", "Endo", "Affinity", "Focus").
- Never invent numbers. A rate/amount goes in "why" only if the wiki gives it.
- Current game only: ignore methods the wiki says were removed or changed; if a famous old method changed, don't list it.
- Plain friendly English, no wiki markup. Validate: python3 -c "import json;json.load(open('FILE'))"
