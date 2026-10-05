# Tennoform shell (React + shadcn/ui + Cult UI)

The interface around the existing app: sidebar, header, search, account menu, toasts and the
shared design tokens. Pages are being moved into React one at a time; until a page is moved it
is still drawn by `src/js` and shown inside the shell.

- `npm install` once, then `npm run build` (or `npx vite build`) writes `../assets/`.
- `python ../build/make_site.py` then rebuilds `index.html`, linking the built files.
- Components: `src/components/ui` (shadcn/ui, Base UI flavour, plus Cult UI `halo-progress`).
- Tokens: `src/index.css` (`.dark` is the default theme). Legacy page styles read the same tokens.
- `window.TF` (defined in `../src/js/465-bridge.js`) is how the shell reads app state and calls app actions.
