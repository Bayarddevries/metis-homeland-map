# Changelog

All notable changes to the Métis Homeland Map project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses dates rather than versions (unversioned site).

## [Unreleased]

### Planned
- #7 Buffalo herds layer
- #12 Integration work  
- #13 Transitions
- #15 Popup improvements (partial - mobile fix complete)

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
