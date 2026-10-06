# Tennoform design rules

Tennoform is a personal progress planner. The look should feel soft, rounded and alive, and it should react to *your* progress.
It should never read like a game launcher or overlay, and it should stay clearly distinct from other Warframe companion apps (AlecaFrame especially).

## Look

- **Base colour.** Warm charcoal in dark mode (`--background #100f0d`, `--card #181714`), warm off-white in light mode. Greys carry no blue.
  No navy or indigo backgrounds, no purple, no neon.
- **Accent follows your rank.** `data-accent` on `<html>` picks the accent: bronze (MR 0–9), silver (10–19), gold (20–29), radiant (30+).
  People can pin a fixed colour (bronze, silver, gold, radiant, jade) from the menu's "Colour" option; it's stored in `tf-accent`.
  Every accent must pass WCAG AA in both themes.
- **Progress drives the glow.** The ambient background gradient (`--glow-a`, `--glow-b`) grows as you near your next rank, and `--progress` (0–1)
  is available to any component that wants to react to it.
- **Glass surfaces.** Cards, the sidebar, header and phone tab bar use `.tf-glass` (translucent, blurred, hairline border).
  With `prefers-reduced-transparency` they fall back to solid surfaces.
- **Rotund shapes.** Cards `rounded-2xl`, menu items `rounded-xl`, badges, chips and segmented controls `rounded-full`.
  The mastery ring is the centrepiece: a gradient stroke (`--glow2` → `--primary`) with a soft glow.
- **Status colour is text and outline, never a filled card.** Owned/mastered/vaulted show as small outlined labels or a tick.
  Never tint a whole card green (or any colour) to mean "owned".
- **Type.** Barlow Semi Condensed for headings and numbers that matter, Source Sans 3 for everything else.
- **Art is supporting, not the layout.** Item images are small thumbnails beside text (32–48px). No grids of big character renders,
  no rows of round part-icon bubbles with count badges.
- **Motion.** One short pass on load (rings fill, numbers roll) and a soft highlight that follows the pointer on the hero card.
  Nothing loops. Respect `prefers-reduced-motion`.

## Behaviour

- **Words before icons.** Every control has a visible text label. No icon-only category bars.
- **Say what a number means** right next to it ("per run", "to finish", "7-day average").
- **Lists over walls of cards.** One row per thing, the action on the right, details on tap.
- **Only the checkbox completes.** Tapping a row opens it; the box ticks it; every tick can be undone (toast and Achievements).
- **Explain empty states** with the one action that fills them.
- **Phones first.** 40px touch targets, long tab rows scroll sideways, details open in a bottom sheet.
- **Accessible.** WCAG AA contrast in both themes and every accent (run axe on every page), visible focus, labels on every input.
