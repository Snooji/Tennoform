# Tennoform

A free Warframe companion for keeping track of where you are and what to do next.

**https://tennoform.com**

- Mastery rank: what you've ranked, what's left, and a step-by-step plan through every source of mastery
- Item stats: health, shields, armour and abilities for frames; damage, crit, status and more for weapons
- My collection: everything you own and everything you've mastered in one place; mark what you own or don't, and undo an accidental rank
- Star chart, quests and syndicates
- Farm finder for resources, credits, standing and affinity
- Relics, refinements, ducats and Prime parts you still need
- Builds: community picks and player-shared builds you can vote on, copy or save as a goal
- Market: warframe.market prices for Prime sets and parts, plus mods and arcanes with each seller's rank
- Today: resets, Sortie, Archon Hunt, fissures, Baro and Nightwave
- Guides for every quest and mission type
- Chat: one window with a tab for General, Trading, LFG, your clan, your alliance and each friend or group conversation. Profile pictures, clan and alliance backgrounds set by leaders, and a filter that holds illegal or extremely explicit messages for review
- Friends: add by friend code or by tapping someone in Chat or on a shared build (they accept first), group chats, shared tasks, blocking

Progress saves in your browser. Sign in to keep it on every device. Link your Warframe account ID to fill in ranks, star chart and quests from your public profile; pick where you play (PC, PlayStation, Xbox, Switch, iPhone or Android) so sync reads the right profile. **Reset sync** shows what a fresh sync would add or remove and lets you choose item by item. Tennoform never asks for your Warframe password.

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
- Game data: the `game-data` workflow checks WFCD warframe-items every day. When there's a new release it runs `build/update_gamedata.py` (additive: new items, relics, mods and arcanes, relic rewards, vault status; hand-written data untouched), `build/make_stats.py` (item stats in `data/stats.json`, loaded only on item pages) and `build/make_umap.py`, checks that nothing was lost (item, relic and mod counts never drop; stats and the page build look right) and publishes. If a check fails, nothing is published and the run fails.

Commit `src/`, `app/`, `assets/` and `index.html` together. Firebase setup, the console and mobile sync relay, and Firestore rules (`firestore.rules`, publish them in the Firebase console after each change) are in `SETUP.md`.

The Backend page (admins only) shows players online, daily and total users, feedback, donations, the chat review queue, bans, and who leads each clan and alliance chat.

Not affiliated with Digital Extremes. Warframe is a trademark of Digital Extremes Ltd.
