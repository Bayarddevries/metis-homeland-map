# Changelog

All notable changes to the Métis Homeland Map project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses dates rather than versions (unversioned site).

## [2026-05-21]

### Added
- `category` field to all location features (8 filter categories)
- Location marker colors by category (green=settlement, red=fort, orange=road allowance, purple=parish, blue=landmark, yellow=transport, brown=traditional)
- Filter JS now reads `category` field directly (with legacy fallback)

### Changed
- Community type normalization: 64 values cleaned to 8 categories
  - Redundant prefixes stripped (e.g. "Settlement / Wintering site" → "Wintering site")
  - Crossover types use comma format (e.g. "Fort, Settlement")
  - Full mapping applied to all 199 features
- Filter categories now powered by explicit `category` field instead of substring matching
- Popup improvements (#15): color-coded header bar (4px accent) matching category, added category label tag before community_type

### Removed
- 30 duplicate location entries merged (229 → 199 unique locations) — 27 clusters reviewed
  - 19 merge clusters, 3 keep-both, 1 keep-all-three
  - 5 entries renamed for clarity
  - 9 content merges preserving unique descriptions/stories
  - Full decision log: `~/.hermes/kanban/output/homeland_duplicate_decisions.csv`
  - Remaining locations: `~/.hermes/kanban/output/homeland_locations_remaining.csv`

### Changed
- Consolidated duplicate entries preserving best name, founded date, and unique descriptions

## [2026-05-20]

### Added
- Buffalo herd era labels: "Original Range", "1870 Range", "1889 Range" on-map tooltips (#7)
- Buffalo population timeline table in info panel w/ sources (Isenberg, Lott, PBS, Roe, Hornaday)
- Places filter panel — 8 color-coded community_type categories with ⓘ descriptions
- Splash→map entrance animation with zoom reveal and bottom bar slide-up (#13)
- Layer toggle fade in/out transitions (#13)
- Info panel backdrop overlay (#13)
- Kanban task: Data Review — locations audit + layers recommendations (Research Archivist)

### Changed
- Bottom bar: switched to `position: fixed` with left/right centering for reliable mobile layout
- Mobile bottom bar: icons-only mode at ≤430px width
- Layer pills color-coded by community_type category
- Filter panel properly z-indexed and scrollable on mobile

### Planned
- #12 Integration work
- #15 Popup improvements (content refinement)
- Cart trail data re-trace with route names

## [2026-05-07]

### Changed
- Vertical layout: info button (ⓘ) now below layer button in layer-control
- Stats icon + dark mode toggle grouped together in stats-theme-group div
- All bottom bar items centered

### Added
- Mobile bottom-sheet panel style (65vh max-height, rounded corners)
- Split layer toggle/info panel (Option A: main btn toggles, ⓘ opens panel)
- Touch targets: 28px for info-btn, compact bottom bar padding

### Fixed
- Mobile layer info panel taking full screen (task #15)
- Layer toggles conflicting with info panel opens

## [2026-05-06]

### Added
- Dark mode toggle with inverted Voyager tiles (CSS filter)
- Splash page with ∞ symbol, dark default theme
- Panel mutual exclusion (only one open at a time)

---

**Legend:**
- `### Added` for new features
- `### Changed` for changes in existing functionality  
- `### Deprecated` for soon-to-be removed features
- `### Removed` for now removed features
- `### Fixed` for any bug fixes
- `### Security` for vulnerability fixes
