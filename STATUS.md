---
project: "Métis Homeland Map V8"
repo: "https://github.com/Bayarddevries/metis-homeland-map"
deployed_url: "https://bayarddevries.github.io/metis-homeland-map/"
last_updated: "2026-05-20"
deployed_commit: "latest"
completion_percent: 87
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
- **#13 Transitions** — splash→map animation, layer fade, panel backdrop
- **Mobile bottom bar** — fixed centering via position:fixed, icons-only at ≤430px
- **Buffalo herds (#7)** — era labels on-map + population timeline in info panel
- **Places filter** — 8 color-coded community_type categories with descriptions
- **Duplicate cleanup** — 30 duplicate location entries merged (229 → 199 unique), 27 clusters reviewed and resolved
- **Community type normalization** — mapped 64 values to 8 filter categories; added `category` field; cleaned `community_type` values
- **Popup improvements (#15)** — color-coded header bar, category label tag, source citation for descriptions

## What's Next 📋
1. **Cart trails** — re-trace with route names (on hold)

## Blockers 🚫
None currently.

## Gotchas ⚠️
- **CI auto-deploys** to gh-pages on push to master — do NOT manually sync docs/
- **Lightroom never writes PersonInImage** — Shoebox v2 issue (separate project)
- **Mobile first** — always test with Chrome DevTools (F12 → Ctrl+Shift+M)
- **Git Pages source** is `master` branch (not `main`, not `gh-pages` branch)

## Recent Commits
```
7b41c22 - docs: add ATTRIBUTION.md and cultural disclaimer (2026-05-08)
ec5f9f8 - Vertical info button layout + stats/theme grouped (2026-05-07)
ab5a0c6 - Center bottom bar items, fix layer-toggles flex
f3eb9f4 - Improve mobile touch targets and compact bottom bar
b182598 - Split layer toggle and info panel (Option A)
4a7ee62 - Fix mobile layer info panel - bottom-sheet style
```
