# Tennoform app shell

React 19 + Vite + Tailwind v4, with shadcn/ui (Base UI) components and Cult UI's halo progress.

```
npm install
npm run build              # writes ../assets/
python ../build/make_site.py
```

- `src/pages/` has one folder per page. Pages load on first visit and the rest preload in the background.
- `src/components/ui/` are the shadcn/ui components; `src/components/tf/` are Tennoform's own.
- `src/index.css` holds the design tokens (dark is the default). The older `src/css` styles read the same tokens.
- Pages read data and call actions through `window.TF`, defined by the `46*-bridge-*.js` files in `../src/js/`.
  `useTF()` and `useTFData()` in `src/lib/tf.ts` re-render when the app sends `tf:update`.
