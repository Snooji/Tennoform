# Tennoform

Tennoform is a free Warframe objective tracker: mastery rank tracking with per-item ranks, an editable in-game mastery breakdown, quest log, star chart missions, resource farming by game stage, crafting trees with relic drop locations, meta Warframe, weapon and companion builds, Kuva/Tenet/Coda weapon tracking, arcane and key-mod collections, a relic inventory and refinement planner, a ducat and trading helper, junction task lists, fishing and mining guides, friend and clan comparison, warframe.market prices with cheapest sellers, and a vault tracker.

**Open it:** https://tennoform.com

Progress saves in your browser. Use **Tenno → Backup** to move it to another device.

## Data
- Game data: [WFCD warframe-items](https://github.com/WFCD/warframe-items) and the [Warframe wiki](https://wiki.warframe.com)
- Prices and sellers: [warframe.market](https://warframe.market), refreshed daily by `.github/workflows/refresh.yml`
- Live Prime Resurgence and profile sync: [warframestat.us](https://docs.warframestat.us)

## Rebuild
`python build/make_site.py` rebuilds `index.html` from `build/template.html`, `build/base.json` and `build/market.json`.
`python build/refresh_market.py` refreshes `build/market.json`.

Not affiliated with Digital Extremes.
