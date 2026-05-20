# Changelog

All notable changes to the Métis Homeland Map project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses dates rather than versions (unversioned site).

## [2026-05-20]

### Added
- Splash → map entrance animation (scale+fade on splash, zoom+reveal on map)
- Bottom bar slide-up entrance with staggered button reveal
- Layer toggle fade transitions (CSS-based, in/out 0.35s)
- Info panel backdrop overlay for slide-up panels
- Places filter panel — 8 colored pill buttons to show/hide location categories
- Category-based marker colors (settlement=green, fort=red, road allowance=orange, etc.)
- Filter counts per category with live summary footer ("Showing X of 229 locations")
- Category descriptions with ⓘ info icons — tap to learn what each type means

### Changed
- Locations markers now color-coded by community_type category (7 buckets)
- Filter panel uses CSS theme variables instead of hardcoded dark colors
- Filter panel z-index bumped to 1001 (above bottom bar)

### Fixed
- Filter panel was behind bottom bar (z-index 999 vs 1000)
- Mobile bottom bar positioning — switched to `position: fixed` + `left/right` centering
- Mobile label overflow — icons-only layout at ≤430px width
- Filter panel clipping on mobile — viewport-constrained height with scrollable pills
- Mobile responsive breakpoints for all filter elements

## [Unreleased]

### Changed

### Added

### Planned
- #7 Buffalo herds layer
- #12 Integration work
- Redraw cart trails with actual route names

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
