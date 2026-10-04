# Tenno Codex

A free Warframe objective tracker: mastery rank tracking with per-item ranks, an editable in-game mastery breakdown, quest log, star chart missions, resource farming by game stage, crafting trees with relic drop locations, meta Warframe builds, warframe.market prices with cheapest sellers, and a vault tracker.

**Open it:** see the GitHub Pages link in this repository's About section.

Progress saves in your browser. Use **Tenno → Backup** to move it to another device.

## Data
- Game data: [WFCD warframe-items](https://github.com/WFCD/warframe-items) and the [Warframe wiki](https://wiki.warframe.com)
- Prices and sellers: [warframe.market](https://warframe.market), refreshed daily by `.github/workflows/refresh.yml`
- Live Prime Resurgence and profile sync: [warframestat.us](https://docs.warframestat.us)

## Rebuild
`python build/make_site.py` rebuilds `index.html` from `build/template.html`, `build/base.json` and `build/market.json`.
`python build/refresh_market.py` refreshes `build/market.json`.

Not affiliated with Digital Extremes.
