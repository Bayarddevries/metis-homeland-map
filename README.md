# Métis Homeland Map

**Status:** Active development (~75% complete)
**Live site:** https://bayarddevries.github.io/metis-homeland-map/
**Version:** V8 (as of May 2026)
**Platform:** HTML/CSS/JS + Leaflet.js + OpenStreetMap

---

## Overview

Interactive web map displaying the historical Métis homeland, including
waterways, Red River cart trails, settlements, buffalo herds, and battle
locations. Designed for both desktop and mobile, with a dark mode default.

This repo evolved from [homeland-map-v5](https://github.com/Bayarddevries/homeland-map-v5)
and is now the canonical map project (V6 → V8+).

## Features

- **Waterways** — Historical river and waterway routes (blue lines)
- **Cart Trails** — Red River cart trail routes (red dashed lines)
- **Locations** — 229+ historical settlements, forts, communities
- **Battles** — 6 historical Métis battle locations
- **Buffalo herds** — *Planned (issue #7)*
- **Dark mode** — Default theme with inverted Voyager tiles
- **Splash page** — ∞ symbol entry screen
- **Mobile-optimized** — Bottom-sheet panels, 65vh max-height
- **Layer controls** — Toggle visibility + info panels per layer
- **Panel mutual exclusion** — Only one panel open at a time

## Quick Start

1. Open `index.html` in a web browser, or
2. Serve via local server:
   ```bash
   python3 scripts/serve.py
   # or
   python3 -m http.server 8000
   ```
3. Navigate to `http://localhost:8000`

## Map Versions

This repo contains multiple map iterations:
- `index.html` — Current (V8, dark mode default)
- `index-v9.html` — V9 experimental
- `index-v7.html` — V7 experimental
- `index-classic.html` — Classic/light theme

## Data Sources

| Data | Format | Count |
|------|--------|-------|
| Waterways | GeoJSON | 41 segments |
| Cart trails | GeoJSON | 43 segments |
| Locations | GeoJSON | 229 points |
| Battles | GeoJSON | 6 locations |

### Updating Data

**From Google Earth (KMZ/KML):**
```bash
python3 scripts/convert_kml.py waterways.kmz data/waterways.geojson
```

**From CSV:**
```bash
python3 scripts/convert_csv.py locations.csv data/locations.geojson
```

CSV columns: `Location Name`, `Latitude`, `Longitude`, `Description`, `Founded`, `Community Type`

## File Structure

```
metis-homeland-map/
├── index.html              # Current map (V8)
├── index-v7.html, v9.html  # Experimental versions
├── index-classic.html      # Light theme variant
├── css/                    # Stylesheets (per version)
├── js/                     # Map logic (per version)
├── data/                   # GeoJSON data files
├── scripts/                # Python data conversion tools
├── docs/                   # Project docs (STATUS, CHANGELOG, ATTRIBUTION)
├── lib/                    # Third-party libraries
├── node_modules/           # Node dependencies
├── splash-mockup.html      # Splash page design
└── test-*.html             # Test pages
```

## Technology Stack

- **Leaflet.js** — Interactive map library
- **OpenStreetMap / CartoDB Voyager** — Base map tiles
- **GeoJSON** — Data format
- **Vanilla HTML/CSS/JS** — No build step required
- **Python 3** — Data conversion scripts

## Project Status

See `STATUS.md` for current completion state and roadmap.
See `CHANGELOG.md` for version history.
See `ATTRIBUTION.md` for data source attribution and cultural disclaimer.

### Next Up (from STATUS.md)
1. Buffalo herds layer (#7)
2. Integration work (#12)
3. Transitions (#13)
4. Popup improvements (#15)

## Deployment

- CI auto-deploys to GitHub Pages on push to `master` branch
- **Do NOT manually sync `docs/`** — CI handles this
- Pages source: `master` branch (not `main`, not `gh-pages`)
- Always test mobile with Chrome DevTools (F12 → Ctrl+Shift+M)

## Shared Navigation

This site is part of the RRMNHC web suite, linked via `site-nav.js` to:
- [RRMNHC Website](https://bayarddevries.github.io/rrmnhc-website/)
- [Shoebox Digital Archive](https://bayarddevries.github.io/shoebox-v2/)

## License & Attribution

See `ATTRIBUTION.md` for data source attribution.
Cultural disclaimer included. All Métis historical data researched from
primary sources.
