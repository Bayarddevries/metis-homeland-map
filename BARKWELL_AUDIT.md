# Barkwell Provenance Audit — Homeland Map PoC

**Prepared for:** MMF leadership review via Sarah Hodges-Kolisnyk  
**Date:** July 23, 2026  
**Scope:** All 198 locations + 6 battles in `/data/locations.geojson` and `/data/battles.geojson`

---

## 1. Executive Summary

Of 198 map locations, **151 (76.3%) are sourced from Lawrence Barkwell's work**. This is the dominant source layer for the PoC demo. The concern from MMF leadership — that Barkwell may not have used enough primary sources — is valid and warrants attention before the Jul 27–31 Tactica demo.

This report categorizes every Barkwell-sourced location by claim type, identifies where provenance is weakest, and recommends what to prioritize.

---

## 2. Total Count Breakdown

| Source | Locations | % |
|---|---|---|
| Barkwell — Main 2018 Settlements PDF | 124 | 62.6% |
| Barkwell — Individual monographs | 27 | 13.6% |
| **Total Barkwell** | **151** | **76.3%** |
| Virtual Museum / Gabriel Dumont Institute | 46 | 23.2% |
| Other (Dorion-Paquin et al., Kelly Lake) | 1 | 0.5% |
| **Total non-Barkwell** | **47** | **23.7%** |
| **Grand Total** | **198** | |

### Battles (6 total)

| Source | Count | % |
|---|---|---|
| Barkwell monographs (with ISBNs) | 5 | 83% |
| HSMBC (Loon Lake) | 1 | 17% |

---

## 3. Barkwell Monograph Types

### 3a. Main 2018 PDF — "Historic Métis Settlements in Manitoba" (124 locations)

The dominant source. A comprehensive reference work that, per Barkwell's own methodology, synthesizes:
- HBC archival records (post journals, account books)
- Scrip commission records
- Census data (particularly 1959 census of Métis populations)
- Catholic mission records
- Secondary historical literature

**Risk**: Without knowing the exact proportion of primary vs. secondary sources in Barkwell's compilation, MMF may see this as a secondary source masquerading as a comprehensive reference. The 2018 PDF is not peer-reviewed academic scholarship.

### 3b. Individual Barkwell Monographs (27 locations, 27 separate monographs)

| Location | Monograph | External source cited within? |
|---|---|---|
| Black Butte (Butte Noir) | Black Butte | **YES** — cites Nor'Wester, Nov 15, 1860 |
| Buffalo Lake | Buffalo Lake and the Battle River Valley | No external source |
| Butte St. Paul | Butte St. Paul | No external source |
| Choteau | Front Range Métis | No external source |
| Edmonton House | Edmonton House | No external source |
| Fort Langley | Fort Langley | No external source |
| Green Lake | Green Lake, Saskatchewan | No external source |
| Heart Butte | Heart Butte, North Dakota | No external source |
| Island Cache | Island Cache, British Columbia | **YES** — cites Evans, Krebs et al. (2004) and Evans & Foster (2010) |
| Kansas Half Breed Tracts | Kansa Half Breed Tracts | No external source |
| Laboucane (Duhamel) | Laboucane Settlement | No external source |
| Lac Ste. Anne | Lac St. Anne, Alberta | No external source |
| Lake Pepin | Lake Pepin Half-Breed Tract | No external source |
| Last Mountain Lake | Last Mountain Lake | No external source |
| Little Chicago (Chicago Line) | Métis Road Allowance Communities: Little Chicago | No external source |
| Michipicoten Post | Michipicoten Post | No external source |
| Milk River | Deportation of the Métis on the Milk River | No external source |
| Park Valley | Park Valley, Saskatchewan | **YES** — cites Campbell, Maria (2001) |
| Portage La Loche | The Portage La Loche Brigade | No external source |
| Rat Portage | Rat Portage – Name changed to Kenora | No external source |
| Rat River | Rivière aux Rats, St. Pierre Jolys | No external source |
| Smokey River | Smokey River, Alberta Scrip Applications | **PARTIAL** — title mentions scrip applications (primary documents) |
| St. Peter's Mission | St. Peter's Mission | No external source |
| Teton River | Teton River, South Fork | No external source |
| Whiskey Flats | Whiskey Flats and Moccasin Flats | No external source |
| Williams County | Williams County North Dakota Metis | No external source |
| Battle River Valley | Saskatchewan Métis Communities: Historical Overview | No external source |

**Only 4 of 27 individual monographs explicitly cite external primary sources.** The remaining 23 are Barkwell's own synthesis with no visible citation trail in the GeoJSON.

### 3c. Battles (5 of 6)

Better provenance than locations — two have ISBNs (verified publications) and all name specific monographs. However, the monographs themselves may still rely heavily on secondary sources.

---

## 4. Risk Assessment by Location Category

### HIGH RISK — Locations with vague temporal claims (43 Barkwell locations)

These have founding dates like "Historic", "Ancient", "Late 1800s", or "#N/A" — no documentation of when Barkwell says the community existed:

| Category | Count |
|---|---|
| "Historic" | 23 |
| "Ancient" / "Ancient / Traditional" | 4 |
| "#N/A" | 3 |
| "Late 1800s" | 3 |
| Other vague | 10 |

**Key examples** that MMF may question:
- **Batoche**: "Historic wintering site" — Batoche has extensive primary documentation. This vagueness is unnecessary.
- **Battle River Valley**: "Historic" — entire river valley as a settlement area
- **Cormorant**: "Historic" — despite citing a 1959 census count of 169 Métis
- **Duck Bay**: "Ancient" — used since "ancient" times with no documentation
- **Kinosota**: "#N/A" — no founding date at all
- **Shoal River**: "#N/A" — no founding date

### HIGH RISK — Geographic features treated as settlements (9 Barkwell locations)

- **Battle River Valley** — 300km river valley, single coordinate point
- **Hair Hills / Pembina Mountains** — geographic formation
- **Duck Mountain** — geographic region
- **Little Saskatchewan River** — river valley
- **Smokey River** — entire river valley described
- **Williams County** — entire county in North Dakota
- **Kansas Half Breed Tracts** — Kansas (latitude 39.2°N, far outside core Homeland)
- **Milk River** — describes an arrest event, not a settlement
- **Upper Athabasca** — "ethnohistory" region

### MEDIUM RISK — Road Allowance communities (17 Barkwell locations)

These are well-documented in Barkwell's 2016 monograph "20th Century Métis Displacement and Road Allowance Communities in Manitoba," which relies heavily on oral histories collected decades after the events. Oral history is valuable but MMF may want corroborating documentary evidence:

- Bacon Ridge, Big Eddy, Cold Lake, Cold Lake (Kississing), Dog Patch, Fouillard Town, Little Chicago, MacGregor, Metikewap, Rooster Town, St. Eustache, Stovepipe, Thomas Settlement, Tin Town, Umphreville, Young Point, Whiskey Flats

### MEDIUM RISK — Round-number coordinates (14 locations)

Coordinates rounded to 1 decimal place (e.g., -97.15, 49.9) suggest approximate positioning from textual descriptions rather than survey data or GPS. Acceptable for a map at this scale, but MMF may note these as imprecise:

Dog Patch, Flee Island Entrenchments, Frog Plain, Kansas Half Breed Tracts, Lake Pepin, Little Britain, Michipicoten Post, Pointe du Chien-Maigre, Rock Lake, Shoal River, Smokey River, Sugar Island, Swan Creek, Williams County

### LOW RISK — Deduplication issues

- **Bas de la Rivière (Fort Alexander)** and **Fort Alexander (Sagkeeng)** share identical coordinates (-96.2917, 50.6053) — both Barkwell-sourced. Appear to be the same location presented twice.
- **Kinosota** and **Manitoba House (Kinosota)** share identical coordinates — the description says "See entry for Kinosota."
- **Opaskweyaw (The Pas)** and **The Pas** share identical coordinates (-101.2417, 53.8247) and very similar descriptions.

### LOW RISK — Coordinates outside core Métis Homeland

These locations from individual Barkwell monographs extend far beyond Manitoba:
- **Kansas Half Breed Tracts** (39.2°N) — Kansas, far south
- **Lake Pepin** (44.5°N) — Minnesota
- **Whiskey Flats** (49.0°N) — says Yukon in description, but coordinates show southern Alberta
- **Michipicoten Post** (47.9°N) — Ontario, Lake Superior
- **Fort Langley** (49.2°N) — British Columbia
- **Island Cache** (53.9°N) — British Columbia
- **Kelly Lake** (55.2°N) — British Columbia (non-Barkwell source)

---

## 5. Overlap Analysis — Can non-Barkwell sources replace Barkwell data?

**No significant overlap exists.** The 47 non-Barkwell locations (all Virtual Museum / Gabriel Dumont Institute) cover entirely distinct sites:

- **Forts not in Barkwell data**: Fort Desjarlais, Fort Gibralter, Fort la Reine, Fort Montagne à la Bosse, Fort Mr. Grant, Fort Pinancewaywining, Fort Souris, Fort St. Charles, Fort des Épinettes, Lane's Post, Jack River Post, Grassy Narrows House
- **Parishes / settlements not in Barkwell data**: St. Mary's, Spring Creek, Red River Settlements, Willow Bunch, Tokyo at Crescent Lake, etc.

**There is no "backup" dataset** that could replace Barkwell's 151 locations. If MMF rejects Barkwell, the map loses ~76% of its location data.

---

## 6. Specific Locations Flagged for Weakest Provenance

These are the most vulnerable to MMF challenge:

1. **Kansas Half Breed Tracts** — single Barkwell monograph, in Kansas (not typical Homeland), 640-acre tracts from an 1825 treaty — the claim is more about U.S. treaty law than Métis settlement
2. **Lake Pepin** — single Barkwell monograph, in Minnesota, "Half-Breed Tract" from 1830 treaty
3. **Whiskey Flats** — coordinates (49.0°N, -113.1°W) correspond to southern Alberta, but description says Whitehorse, Yukon — **coordinate error**
4. **Williams County** — entire county as a single point, no specific settlement
5. **Upper Athabasca** — whole region as a settlement, vague, Virtual Museum-sourced
6. **Island Cache** — coordinates in description don't clearly map to Prince George BC area
7. **Choteau** — Montana, single Barkwell monograph, "Late 1800s" founding
8. **Milk River** — describes a military deportation event (1879), not a settlement — this is a historical incident mischaracterized as a location
9. **Teton River** — "over 100 Métis" claim with no census citation
10. **Heart Butte** — North Dakota, founded "Historic", single monograph
11. **St. Peter's Mission** — Montana, Riel taught school here (well-documented in other sources, but the GeoJSON cites only Barkwell)
12. **Black Butte (Butte Noir)** — North Dakota, though this is one of the stronger Barkwell monographs since it explicitly cites the Nor'Wester

---

## 7. Recommendations for PoC Demo (Jul 27-31)

### Priority 1: Add qualifying language to the attribution

In `ATTRIBUTION.md` and the map popup source lines, add a note like:

> *"Settlement data attributed to Lawrence Barkwell's published compilations for the Louis Riel Institute. Barkwell's work synthesizes Hudson's Bay Company archives, scrip records, census data, missionary records, and secondary historical sources. MMF is conducting further primary-source verification."*

This preempts the question by acknowledging the source methodology transparently.

### Priority 2: Swiftly verify the 4 strongest-corner cases

These Barkwell locations have independent primary sources MMF can confirm quickly through its own archives or the HBC Archives in Winnipeg:

| Location | What to verify | Source trail |
|---|---|---|
| Batoche | Well-documented in Sask archives and Parks Canada | Cross-reference with Parks Canada records |
| St. Boniface | Census and mission records abundant | MMF internal records |
| Seven Oaks | HBC records, multiple contemporary accounts | Already well-documented |
| Upper Fort Garry | HBC records | HBC Archives, Winnipeg |

### Priority 3: Flag the 12 weakest locations for potential removal

If MMF is uncomfortable, consider temporarily removing these from the PoC:
1. Kansas Half Breed Tracts
2. Lake Pepin
3. Whiskey Flats (coordinate error anyway)
4. Williams County
5. Milk River
6. Upper Athabasca
7. Choteau
8. Teton River
9. Heart Butte
10. St. Peter's Mission
11. Black Butte
12. Butte St. Paul

These are all outside Manitoba, based on single Barkwell monographs, and removing them would only reduce the total from 198 to 186 (~94% of data retained).

### Priority 4: For the remaining 139 Barkwell Manitoba locations

The bulk of the map (124 from the main 2018 PDF + ~15 from monographs within Manitoba) is less controversial because:
- They fall within MMF's core jurisdiction area
- Many correspond to known communities that appear in other records
- Population counts from the 1959 census (cited frequently in descriptions) are verifiable
- Locations like St. François Xavier, St. Laurent, St. Vital, Ste. Madeleine are well-attested in multiple sources

MMF should spot-check 10-15 of these against its own 2022 Land Use and Occupancy Study to confirm alignment.

### Priority 5: The Battles layer is safer than locations

5 of 6 battles are Barkwell-sourced, but:
- Two battle monographs have ISBNs (verifiable)
- Battle descriptions reference well-known historical events with multiple corroborating sources
- The battles could be cross-referenced with the Saskatchewan Archives or Parks Canada
- Consider adding an MMF or academic citation to each battle as supplementary

---

## 8. Summary Risk Matrix

| Claim Type | Barkwell Count | Risk Level | Rationale |
|---|---|---|---|
| Manitoba settlements with 1959 census data | ~80 | **Moderate** | Census data improves verifiability, but Barkwell's compilation is still secondary |
| Manitoba road allowance communities | 17 | **Moderate** | Oral history based, but many are documented in MMF records |
| Manitoba fur trade forts (HBC/NWC records) | ~23 | **Low-Moderate** | HBC archives provide primary confirmation for most |
| Red River parishes (St. Boniface, etc.) | ~15 | **Low** | Extensively documented in multiple sources |
| Out-of-province individual monographs | 27 | **High** | Single-sourced, often vague, MMF has no direct knowledge |
| Geographic features as settlements | ~9 | **High** | Not actually settlements — risk of misrepresentation |
| Battles (via Barkwell monographs) | 5 | **Low-Moderate** | Well-documented events; Barkwell is just one of many sources |
