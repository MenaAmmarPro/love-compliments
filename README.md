# Compliment Jar — Love for Mena

A jar full of things I mean about you. Reach in, pull one out — never the same
line twice in a row. Part of the **Love for Mena** collection.

**Live:** https://menaammarpro.github.io/love-compliments/

## What it does

- **Draw a compliment** — 16 starter lines, and it never repeats the last one
- **Add your own** lines (they show in pink)
- Remove any line, or return to the original sixteen
- Everything stays on the device — no tracking, no network calls
- Installable PWA with offline support

## How it works

Lines live in localStorage under `mena-compliments`. The starter set is in the
`STARTER` array at the top of `js/app.js`.

## Files

- `index.html` — the page
- `css/theme.css` — shared love-theme (copied from `_love-theme/`)
- `css/app.css` — page-specific styles (the jar, the line card)
- `js/theme-main.js`, `js/effects.js` — shared behaviour/effects
- `js/app.js` — jar logic
- `manifest.webmanifest`, `sw.js` — PWA
- `assets/` — favicon and icons

## Run locally

```powershell
py -m http.server 8000
```

Then visit http://localhost:8000.

## Deploy

Static site, deployed with GitHub Pages from `main`.

## License

Creative Commons BY-NC-ND 4.0 — see [`LICENSE`](LICENSE).
© 2026 Ammar (MenaAmmarPro). Made with care for Mena.
