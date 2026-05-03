# Buffalo Herds Layer Implementation

## Overview
Successfully implemented the Buffalo Herds layer for the Métis Homeland Map V5, displaying the historical decline of American bison herds based on William Temple Hornaday's 1889 work "The Extermination of the American Bison."

**Deployment Date:** May 2, 2026  
**Data Source:** Hornaday, William Temple. *The Extermination of the American Bison*. Washington, D.C.: Government Printing Office, 1889.  
**KMZ File:** `Dwindling Buffalo Herds, 19th Century.kmz`

---

## What Was Done

### 1. Data Extraction
- Extracted GeoJSON data from the user-provided KMZ file (`Dwindling Buffalo Herds, 19th Century.kmz`)
- Properly handled **MultiGeometry** structures to capture all individual polygon parts
- Converted KML Polygon geometry with proper coordinate ordering (lon, lat)

### 2. Data Structure
The buffalo herds data consists of **9 separate polygon features** across 3 time periods:

#### Original extent of buffalo herds
- **1 polygon** with 677 coordinate points
- Latitude range: 24.11° to 63.97° (Texas to Arctic Canada)
- Longitude range: -120.67° to -77.92°
- Represents the full historical range before significant decline

#### Range in 1870 (MultiGeometry)
- **2 separate polygons:**
  - Northern herd: 181 points (lat 41.21° to 60.23°)
  - Southern herd: 97 points (lat 31.09° to 41.10°)
- Shows the beginning of fragmentation into northern and southern populations

#### Range in 1889 (MultiGeometry)
- **6 separate polygons** representing remnant herds:
  1. Saskatchewan/Canada: 50 points
  2. Montana: 23 points
  3. Wyoming/Montana border: 32 points
  4. Wyoming: 25 points
  5. Colorado: 24 points
  6. Kansas/Colorado border: 23 points
- Demonstrates the near-extinction state by 1889

### 3. Code Changes

#### `js/data.js`
- Embedded all 9 buffalo herd polygon features
- Data structure: `window.homelandData.buffaloHerds`
- Each feature includes:
  ```json
  {
    "type": "Feature",
    "properties": {
      "name": "Range name",
      "part": 1,  // For MultiGeometry parts
      "total_parts": 6
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[lon, lat], ...]]
    }
  }
  ```

#### `js/main.js`
- Implemented `renderBuffaloHerds()` function
- Features:
  - **Name-based color matching**: All parts of the same named range get consistent colors
  - **Seasonal color scheme**:
    - Original extent: Deep red-brown (`#8B4513` / `#A0522D`)
    - Range in 1870: Golden brown (`#D2691E` / `#CD853F`)
    - Range in 1889: Pale tan (`#CD853F` / `#DEB887`)
  - **Semi-transparent fills**: 35% opacity for overlapping visibility
  - **Individual popups**: Each polygon displays its name and source citation
  - **Layer control**: Buffalo zones OFF by default, toggleable via layer control

#### `css/style.css`
- Mobile-friendly overlay with scrollable container (`max-height: 40vh`)
- Popup styling for buffalo herd information

---

## Technical Challenges & Solutions

### Challenge 1: Missing Polygons (MultiGeometry)
**Problem:** Initial conversion only captured the first polygon from each MultiGeometry, missing 6 of 9 polygons.

**Symptom:** User reported "some polygons look a bit off" and "only see the northernmost one" for the 1889 range.

**Solution:** 
- Re-extracted KML data to properly handle `<MultiGeometry>` tags
- Created separate GeoJSON features for each polygon part
- Updated color matching to use name-based lookup instead of index cycling

**Code Fix:**
```javascript
// OLD: Only captured first polygon
polygon = placemark.find('.//Polygon')

// NEW: Captures all polygons in MultiGeometry
multi_geom = placemark.find('.//MultiGeometry')
if multi_geom is not None:
    polygons = multi_geom.findall('.//Polygon')
    for poly_idx, polygon in enumerate(polygons):
        # Create separate feature for each
```

### Challenge 2: Leaflet Style Function Index
**Problem:** Leaflet's `style` function doesn't receive an index parameter, causing `undefined % 3` errors.

**Symptom:** Console error: "Cannot read properties of undefined (reading 'color')"

**Solution:** 
- Removed index-based color assignment
- Implemented name-based color matching function

**Code Fix:**
```javascript
// OLD: Broke with undefined index
style: function(feature, index) {
  const zoneIndex = index % seasonalColors.length;
}

// NEW: Name-based matching
function getColorForName(name) {
  for (const scheme of seasonalColors) {
    if (name.includes(scheme.name)) {
      return scheme;
    }
  }
  return seasonalColors[0];
}

style: function(feature) {
  const name = feature.properties.name || '';
  const colors = getColorForName(name);
  // ...
}
```

### Challenge 3: Arctic Bridge Artifact (Previous KMZ Version)
**Problem:** Earlier KMZ version had erroneous coordinate jumps from 64°N (Arctic) to 45°N (Montana) and back, creating a "weird strip off to the west."

**Symptom:** User reported "a line coming out of nowhere" on the Original extent polygon.

**Investigation:** 
- Original KML had coordinate sequence: point 677 (64.07°N) → point 678 (44.89°N) → point 679 (45.21°N) → point 680 (63.95°N)
- Created 19° latitude jumps, drawing a line through the map

**Resolution:** 
- User provided corrected KMZ file traced directly from Hornaday's original map
- New KMZ has continuous boundary without erroneous jumps
- Deployed exactly as provided by user

---

## Files Modified

### Data Files
- `data/buffalo-herds-new.geojson` - Extracted GeoJSON with all 9 polygons
- `data/Dwindling Buffalo Herds, 19th Century.kmz` - Source KMZ file

### Code Files
- `js/data.js` - Embedded buffalo herd data
- `js/main.js` - Added `renderBuffaloHerds()`, `createBuffaloPopup()` functions
- `css/style.css` - Mobile-friendly overlay styling

### Git Commits
1. `31b2e89` - Update buffalo herds from user's KMZ (Hornaday 1889)
2. Previous commits for bug fixes (emoji removal, syntax errors, etc.)

---

## Verification Steps

### Automated Testing (Puppeteer)
```bash
cd ~/homeland-map-v5
node test-map.js
```

**Expected Output:**
```
Total features: 9

By range:
  Original extent of buffalo herds: 1 polygon(s), 677 points
  Range in 1870: 2 polygon(s), 278 points
  Range in 1889: 6 polygon(s), 177 points

✓ No JavaScript errors!
```

### Manual Verification
1. Open https://bayarddevries.github.io/metis-homeland-map/
2. Enable "Buffalo Herds" layer in layer control
3. Verify all 9 polygons are visible:
   - 1 large polygon for Original extent
   - 2 separate polygons for 1870 (north + south)
   - 6 scattered polygons for 1889
4. Click polygons to see popup with name and source citation
5. Check browser console for errors (should be none except favicon 404)

---

## Future Improvements

### Potential Enhancements
1. **Animation**: Add time-slider to show progression from Original → 1870 → 1889
2. **Legend**: Add dedicated legend explaining color scheme and time periods
3. **Statistics**: Display area calculations for each time period
4. **Source attribution**: Link to full Hornaday text or Smithsonian archives
5. **Tooltip on hover**: Show name before clicking

### Known Limitations
- **Arctic boundary**: The Original extent polygon extends to 63.97°N (Arctic Canada). Historical accuracy unclear - may represent mapping artifact or actual perceived range.
- **Favicon 404**: Minor issue, doesn't affect functionality
- **Large data file**: `data.js` is ~777KB, may impact load time on slow connections

---

## Lessons Learned

### For Future KMZ/GeoJSON Conversions
1. **Always check for MultiGeometry**: KML files often group multiple polygons under one name
2. **Verify coordinate continuity**: Look for large jumps (>10°) that indicate errors
3. **Preserve all parts**: Don't assume single polygon - extract everything
4. **Test in actual browser**: Static validation (syntax, checksums) doesn't catch rendering issues

### For Leaflet + GeoJSON
1. **Style functions don't receive index**: Use feature properties or external counters
2. **Name-based color matching**: More robust than index-based for MultiGeometry
3. **Polygon vs LineString**: Ensure KMZ conversion preserves Polygon geometry, not just boundaries
4. **Layer control order**: Add layers before calling `addLayerControl()`

### For Browser Testing
1. **Puppeteer setup in WSL**: Requires `chromium-browser` package
2. **Headless testing script**: Use `test-map.js` pattern for reproducible verification
3. **Console error capture**: `page.on('console')` catches runtime errors
4. **Screenshot verification**: Visual confirmation of rendering issues

---

## Related Documentation
- AGENTS.md - Project overview
- CONTRIBUTING.md - Development guidelines
- README.md - Installation and usage
- `docs/GITHUB_PAGES_FIX.md` - Deployment troubleshooting

---

## Contact
For questions about this implementation, refer to:
- Hornaday's original 1889 text (public domain)
- Smithsonian Institution Archives (Hornaday papers)
- Project maintainer: Bayard deVries
