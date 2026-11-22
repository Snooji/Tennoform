// Copies the built site into www/ for the app. Build the site first (see the main README):
//   cd ../app && npm run build && cd .. && python3 build/make_site.py
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs"
import { join } from "node:path"

const root = join(import.meta.dirname, "..")
const out = join(import.meta.dirname, "www")
if (!existsSync(join(root, "index.html")) || !existsSync(join(root, "bundle"))) {
  console.error("Build the site first: cd app && npm run build && cd .. && python3 build/make_site.py")
  process.exit(1)
}
rmSync(out, { recursive: true, force: true })
mkdirSync(out)
const files = ["index.html", "boot.js", "firebase-config.js", "manifest.webmanifest", "favicon.svg", "favicon-32.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png"]
const dirs = ["assets", "bundle", "data", "fonts", "vendor"]
for (const f of files) if (existsSync(join(root, f))) cpSync(join(root, f), join(out, f))
for (const d of dirs) cpSync(join(root, d), join(out, d), { recursive: true })
console.log("Copied the site into www/")
