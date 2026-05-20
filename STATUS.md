---
project: "Métis Homeland Map V8"
repo: "https://github.com/Bayarddevries/metis-homeland-map"
deployed_url: "https://bayarddevries.github.io/metis-homeland-map/"
last_updated: "2026-05-20"
deployed_commit: "1e6255d"
completion_percent: 85
pages_source: "master"
main_js: "js/main.js"
---

# Project Status

## What's Complete ✅
- **Dark mode** — inverted Voyager tiles via CSS filter
- **Splash page** — dark default, ∞ symbol, no em dashes
- **Mobile panel fix (#15)** — bottom-sheet style (65vh), not fullscreen
- **Layer toggle/info split** — main btn toggles layer, ⓘ opens panel
- **Vertical layout** — info button below layer button
- **Stats + dark mode grouped** — centered in bottom bar
- **Panel mutual exclusion** — only one panel open at a time
- **Copyright audit** — ATTRIBUTION.md + cultural disclaimer added
- **Shoebox photos** — confirmed original with written citizen consent
- **Splash→map entrance animation** — scale+fade with zoom reveal
- **Layer toggle fade** — CSS transitions on toggle on/off
- **Info panel backdrop** — dark overlay behind panels
- **Buffalo data** — population table, era labels, corrected sources
- **Places filter panel** — 8 category pills, color-coded markers, ⓘ descriptions
- **Mobile responsive** — fixed-position bar, icons-only breakpoints, scrollable filter

## What's Next 📋
1. **#7** Buffalo herds layer (data loaded, needs verification)
2. **#12** Integration work
3. **Redraw cart trails with actual route names**
4. **Collect oral histories**
5. **Collect location images**
6. **Trim settlements** — keep only relevant ones

## Blockers 🚫
None currently.

## Gotchas ⚠️
- **CI auto-deploys** to gh-pages on push to master — do NOT manually sync docs/
- **Lightroom never writes PersonInImage** — Shoebox v2 issue (separate project)
- **Mobile first** — always test with Chrome DevTools (F12 → Ctrl+Shift+M)
- **Git Pages source** is `master` branch (not `main`, not `gh-pages` branch)

## Recent Commits
```
1e6255d - fix mobile: fixed-position bottom bar + flex:1 layer toggles (2026-05-20)
73e1745 - mobile responsive: fixed-position filter panel, icons-only breakpoints (2026-05-20)
b97b144 - places filter: category descriptions with ⓘ, z-index/theming fix (2026-05-20)
17dae34 - places filter: filter panel with colored pills, color-coded markers (2026-05-20)
791f7d8 - layer toggle fade + info panel backdrop slide-up (2026-05-20)
f68e0de - splash → map entrance + bottom bar slide-up (2026-05-20)
4784d95 - buffalo captions/labels + population table + citations (2026-05-20)
7b41c22 - docs: add ATTRIBUTION.md and cultural disclaimer (2026-05-08)
```
