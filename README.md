# Tennoform

A free Warframe companion for keeping track of where you are and what to do next.

**https://tennoform.com**

- Mastery rank: what you've ranked, what's left, and a plan for the next rank
- Star chart, quests and syndicates
- Farm finder for resources, credits, standing and affinity
- Relics, refinements, ducats and Prime parts you still need
- Builds: community picks and player-shared builds you can vote on, copy or save as a goal
- Today: resets, Sortie, Archon Hunt, fissures, Baro and Nightwave
- Guides for every quest and mission type
- Friends, chats and shared tasks

Progress saves in your browser. Sign in to keep it on every device. Link your Warframe account ID to fill in ranks, star chart and quests from your public profile.

## Data

- Items and drops: [WFCD warframe-items](https://github.com/WFCD/warframe-items) and the [Warframe wiki](https://wiki.warframe.com)
- Prices: [warframe.market](https://warframe.market), refreshed daily
- Live world state: [warframestat.us](https://docs.warframestat.us)

## Building

The page is plain HTML/JS with a React shell on top.

```
cd app && npm install && npm run build   # React shell -> assets/
python build/make_site.py                # src/ + data -> index.html
```

- `src/shell.html` is the page skeleton; `src/css/` and `src/js/` are joined in file-name order.
- `app/` is the React shell (Vite, Tailwind, shadcn/ui). See `app/README.md`.
- `build/guides/` and `build/farms/` hold the guide and farm-route data (each has a `SCHEMA.md` and `merge.py`).
- `python build/refresh_market.py` updates prices; the `refresh` workflow runs it daily.

Commit `src/`, `app/`, `assets/` and `index.html` together. Firebase setup is in `SETUP.md`.

Not affiliated with Digital Extremes. Warframe is a trademark of Digital Extremes Ltd.
