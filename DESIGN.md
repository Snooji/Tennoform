# Tennoform design rules

Tennoform is a personal progress planner. Its look follows the Tennoform logo: gilded plate, cut corners and a cyan energy glow,
and it reacts to *your* progress. It should feel premium and part of the Warframe world while staying clearly its own: original art
only, never Digital Extremes' logos or UI, and distinct from other companion apps (AlecaFrame especially).

## Look

- **Default style: Prime, matched to the logo.** `data-theme="prime"` on `<html>` (`src/js/005-theme.js`). Styles live in
  `app/src/index.css` and `app/src/originals.css`; the logo-matched layer is `app/src/prime-logo.css`. The other styles
  (Orbiter, Foundry, Grineer, Corpus, Entrati, Lotus, Infested) stay available under Settings → Appearance.
- **Palette from the logo.** Black lacquer background with a faint Orokin lattice; metal gradients (`--m1`…`--m5`) for frames and main
  buttons; the logo's cyan (`--pr-energy`, `#6fd6e8` dark / `#0f7f8f` light) for energy: the mastery ring's head, progress bars, focus rings,
  live indicators and the active tab. Cyan is an accent, never a background.
- **Accent follows your rank.** `data-accent` picks the metal: bronze (MR 0–9), silver (10–19), gold (20–29), radiant (30+), or a fixed
  colour from Appearance. Every accent must pass WCAG AA in both modes.
- **Cut-corner plates.** Panels are chamfered top-left and bottom-right (`--pr-cut`), like the ends of the logo's arms, with a gilded line
  along each cut. Main buttons get a smaller chamfer. Badges, chips and segmented controls stay rounded so they read as controls.
- **The mastery ring is the centrepiece:** gold running into cyan, with a soft glow at the head.
- **Status colour is text and outline, never a filled card.** Owned/mastered/vaulted show as small outlined labels or a tick.
- **Type.** Engraved capitals for headings in Prime; Source Sans 3 for reading text. Long headings wrap on phones, never truncate.
- **Art is supporting, not the layout.** Item images are small thumbnails beside text (32–48px). The logo is the one ornate picture.
- **Motion.** A slow light sweep on frames, rings that fill on load, a glow that follows the pointer. "Calm" in Appearance and
  `prefers-reduced-motion` stop all of it.

## Behaviour

- **Words before icons.** Every control has a visible text label. No icon-only category bars.
- **Say what a number means** right next to it ("per run", "to finish", "7-day average").
- **Lists over walls of cards.** One row per thing, the action on the right, details on tap.
- **Only the checkbox completes.** Tapping a row opens it; the box ticks it; every tick can be undone (toast and Achievements).
- **Explain empty states** with the one action that fills them.
- **Phones first.** 40px touch targets, long tab rows scroll sideways, details open in a bottom sheet. Nothing floats over content
  on a phone: chat lives in the Squad tab; temporary bars (farming counter, picked items) sit just above the tab bar.
- **Accessible.** WCAG AA contrast in both modes, every style and every accent (run axe on every page), visible focus, labels on every input.
