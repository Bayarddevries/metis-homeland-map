#!/usr/bin/env python3
"""
Import data into the Métis Homeland Map.

Drop a KMZ, KML, or CSV file and this script converts it AND updates
the map so the changes go live. No manual file juggling needed.

Usage:
    python3 scripts/import_data.py ~/Desktop/cart_trails_new.kmz
    python3 scripts/import_data.py ~/Desktop/locations.csv
    python3 scripts/import_data.py ~/Desktop/battles.kml

Supported formats:
    .kmz, .kml — from Google Earth (line trails or point locations)
    .csv — tabular location data
"""

import sys
import os
import json
import csv
import re
import zipfile
from pathlib import Path

REPO_DIR = Path(__file__).parent.parent

# Map layer keywords to their data.js property names
LAYER_MAP = {
    "cart":       "cartTrails",
    "trail":      "cartTrails",
    "path":       "cartTrails",
    "water":      "waterways",
    "river":      "waterways",
    "waterway":   "waterways",
    "way":        "waterways",
    "location":   "locations",
    "locations":  "locations",
    "community":  "locations",
    "settlement": "locations",
    "battle":     "battles",
    "battles":    "battles",
    "buffalo":    "buffaloHerds",
    "herd":       "buffaloHerds",
    "herds":      "buffaloHerds",
    "bison":      "buffaloHerds",
}

HUMAN_NAMES = {
    "cartTrails": "Cart Trails",
    "waterways": "Waterways",
    "locations": "Locations",
    "battles": "Battles",
    "buffaloHerds": "Buffalo Herds",
}

DATA_JS_PATH = REPO_DIR / "js" / "data.js"


def detect_layer(filepath):
    """Detect the layer type from the filename."""
    name = filepath.stem.lower()
    for sep in ["_", "-", " "]:
        name = name.replace(sep, " ")
    
    for keyword, data_key in LAYER_MAP.items():
        if keyword in name:
            return keyword, data_key
    
    return None, None


def parse_kml_to_geojson(kml_content):
    """Parse KML text into a GeoJSON FeatureCollection."""
    features = []
    placemark_pattern = r"<Placemark>.*?</Placemark>"
    placemarks = re.findall(placemark_pattern, kml_content, re.DOTALL)
    
    for placemark in placemarks:
        name_match = re.search(r"<name>(.*?)</name>", placemark)
        if not name_match:
            continue
        name = name_match.group(1).strip()
        
        coords_match = re.search(r"<coordinates>(.*?)</coordinates>", placemark, re.DOTALL)
        if coords_match:
            coords_text = coords_match.group(1).strip()
            coords = []
            for coord_pair in coords_text.split():
                parts = coord_pair.strip().split(",")
                if len(parts) >= 2:
                    try:
                        lon = float(parts[0])
                        lat = float(parts[1])
                        coords.append([lon, lat])
                    except ValueError:
                        continue
            
            if len(coords) >= 2:
                features.append({
                    "type": "Feature",
                    "properties": {"name": name, "type": "cart_trail"},
                    "geometry": {"type": "LineString", "coordinates": coords}
                })
        
        is_point = re.search(r"<Point>", placemark) is not None
        if is_point:
            point_coords = re.search(r"<coordinates>(.*?)</coordinates>", placemark)
            if point_coords:
                parts = point_coords.group(1).strip().split(",")
                if len(parts) >= 2:
                    try:
                        lon = float(parts[0])
                        lat = float(parts[1])
                        features.append({
                            "type": "Feature",
                            "properties": {"name": name, "type": "location"},
                            "geometry": {"type": "Point", "coordinates": [lon, lat]}
                        })
                    except ValueError:
                        continue
    
    return {"type": "FeatureCollection", "features": features}


def extract_kmz(kmz_path):
    with zipfile.ZipFile(kmz_path, "r") as z:
        kml_files = [f for f in z.namelist() if f.endswith(".kml")]
        if not kml_files:
            raise ValueError("No KML file found in KMZ archive")
        return z.read(kml_files[0]).decode("utf-8")


def read_kml(kml_path):
    with open(kml_path, "r", encoding="utf-8") as f:
        return f.read()


def convert_csv_to_geojson(csv_path):
    features = []
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                lat_str = row.get("Latitude", "").strip().replace("°", "").replace("N", "").replace("S", "").strip()
                lon_str = row.get("Longitude", "").strip().replace("°", "").replace("E", "").replace("W", "").strip()
                
                lat = float(lat_str)
                lon = float(lon_str)
                if "S" in row.get("Latitude", ""):
                    lat = -lat
                if "W" in row.get("Longitude", ""):
                    lon = -lon
                
                features.append({
                    "type": "Feature",
                    "properties": {
                        "name": row.get("Location Name", "").strip(),
                        "description": row.get("Description", "").strip(),
                        "story": row.get("Story", row.get("story", "")).strip(),
                        "founded": row.get("Founded", "").strip(),
                        "community_type": row.get("Community Type", "").strip(),
                        "type": "location"
                    },
                    "geometry": {"type": "Point", "coordinates": [lon, lat]}
                })
            except Exception as e:
                print(f"  Warning: skipped row — {e}")
    
    return {"type": "FeatureCollection", "features": features}


def load_data_js(path):
    """Parse the homelandData object from js/data.js."""
    with open(path, "r") as f:
        content = f.read()
    
    # Extract the JSON object from the assignment
    match = re.search(r"window\.homelandData\s*=\s*(\{.*\})\s*;", content, re.DOTALL)
    if not match:
        raise ValueError("Cannot find window.homelandData in data.js")
    
    data = json.loads(match.group(1))
    
    # Preserve the comment header for re-writing
    header_match = re.match(r"(.*?)(?=\nwindow\.homelandData)", content, re.DOTALL)
    header = header_match.group(1) if header_match else ""
    
    return data, header


def save_data_js(path, data, header):
    """Write the updated data back to js/data.js."""
    json_str = json.dumps(data, indent=2)
    output = f"{header}\nwindow.homelandData = {json_str};\n"
    
    with open(path, "w") as f:
        f.write(output)


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/import_data.py <file.kmz|file.kml|file.csv>\n")
        print("Drop a Google Earth file or CSV here — this script handles the rest.\n")
        print("Recognized layer keywords (in your filename):")
        for kw in sorted(set(LAYER_MAP.values()), key=lambda x: x):
            keywords = [k for k, v in LAYER_MAP.items() if v == x]
            print(f"  {x} ← {', '.join(keywords)}")
        sys.exit(0)
    
    input_path = Path(sys.argv[1]).expanduser()
    
    if not input_path.exists():
        print(f"Error: File not found — {input_path}")
        sys.exit(1)
    
    suffix = input_path.suffix.lower()
    
    # 1. Detect layer
    keyword, data_key = detect_layer(input_path)
    
    if keyword:
        print(f"Detected layer: {HUMAN_NAMES.get(data_key, data_key)} (from filename '{input_path.name}')")
    else:
        print(f"Could not auto-detect layer from '{input_path.name}'.")
        print("\nChoose:")
        for i, key in enumerate(sorted(LAYER_MAP.values(), key=lambda x: x), 1):
            name = HUMAN_NAMES.get(key, key)
            print(f"  {i}. {name} ({key})")
        try:
            choice = int(input("Select (1-{}): ".format(len(set(LAYER_MAP.values())))).strip())
            data_key = sorted(set(LAYER_MAP.values()), key=lambda x: x)[choice - 1]
        except (ValueError, IndexError):
            print("Invalid.")
            sys.exit(1)
    
    # 2. Convert to GeoJSON FeatureCollection
    print(f"\nConverting {input_path.name}...")
    
    try:
        if suffix == ".kmz":
            kml_text = extract_kmz(input_path)
            geojson = parse_kml_to_geojson(kml_text)
        elif suffix == ".kml":
            kml_text = read_kml(input_path)
            geojson = parse_kml_to_geojson(kml_text)
        elif suffix == ".csv":
            geojson = convert_csv_to_geojson(input_path)
        else:
            print(f"Error: Unsupported format '{suffix}'. Use .kmz, .kml, or .csv")
            sys.exit(1)
    except Exception as e:
        print(f"Conversion failed: {e}")
        sys.exit(1)
    
    print(f"  {len(geojson['features'])} features extracted")
    
    # 3. Update js/data.js directly (that's where the map reads from)
    if DATA_JS_PATH.exists():
        print(f"\nUpdating js/data.js ({data_key}) ...")
        data, header = load_data_js(DATA_JS_PATH)
        
        if data_key not in data:
            print(f"  Layer '{data_key}' not found in data.js. Adding as new.")
        
        data[data_key] = geojson
        
        save_data_js(DATA_JS_PATH, data, header)
        print(f"  Done! {HUMAN_NAMES.get(data_key, data_key)} updated with {len(geojson['features'])} features")
    else:
        print(f"Error: {DATA_JS_PATH} not found")
        sys.exit(1)
    
    # 4. Push instructions
    print(f"\n{'=' * 50}")
    print(f"To push live:")
    print(f"  git add js/data.js")
    print(f"  git commit -m 'Update {HUMAN_NAMES.get(data_key, data_key)} from {input_path.name}'")
    print(f"  git push")
    print(f"{'=' * 50}")


if __name__ == "__main__":
    main()
