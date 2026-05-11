#!/usr/bin/env python3
"""
Import data into the Métis Homeland Map.

Drop a KMZ, KML, or CSV file and this script figures out everything else.
Supports: cart trails, waterways, battles, buffalo herds, and locations.

Usage:
    python3 scripts/import_data.py ~/Desktop/cart_trails_new.kmz
    python3 scripts/import_data.py ~/Desktop/locations.csv
    python3 scripts/import_data.py ~/Desktop/battles.kml
"""

import sys
import os
import json
import csv
import re
import zipfile
from pathlib import Path

# Map layer types to their output GeoJSON files
LAYER_MAP = {
    "cart":       "data/cart_trails.geojson",
    "trail":      "data/cart_trails.geojson",
    "water":      "data/waterways.geojson",
    "river":      "data/waterways.geojson",
    "waterway":   "data/waterways.geojson",
    "way":        "data/waterways.geojson",
    "location":   "data/locations.geojson",
    "locations":  "data/locations.geojson",
    "battle":     "data/battles.geojson",
    "battles":    "data/battles.geojson",
    "buffalo":    "data/buffalo_herds.geojson",
    "herd":       "data/buffalo_herds.geojson",
    "herds":      "data/buffalo_herds.geojson",
}

SCRIPT_DIR = Path(__file__).parent
REPO_DIR = SCRIPT_DIR.parent


def detect_layer(filepath):
    """Detect the layer type from the filename."""
    name = filepath.stem.lower()
    # Strip common separators
    for sep in ["_", "-", " "]:
        name = name.replace(sep, " ")
    
    for keyword in LAYER_MAP:
        if keyword in name:
            return keyword, LAYER_MAP[keyword]
    
    return None, None


def parse_kml_content(kml_content, feature_type=None):
    """Parse KML and extract LineStrings and Points."""
    features = []
    placemark_pattern = r'<Placemark>.*?</Placemark>'
    placemarks = re.findall(placemark_pattern, kml_content, re.DOTALL)
    
    for placemark in placemarks:
        name_match = re.search(r'<name>(.*?)</name>', placemark)
        if not name_match:
            continue
        name = name_match.group(1).strip()
        
        coords_match = re.search(r'<coordinates>(.*?)</coordinates>', placemark, re.DOTALL)
        if coords_match:
            coords_text = coords_match.group(1).strip()
            coords = []
            for coord_pair in coords_text.split():
                parts = coord_pair.strip().split(',')
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
                    "properties": {"name": name, "type": feature_type or "unknown"},
                    "geometry": {"type": "LineString", "coordinates": coords}
                })
        
        point_match = re.search(r'<Point>.*?</Point>', placemark, re.DOTALL)
        if point_match:
            point_coords = re.search(r'<coordinates>(.*?)</coordinates>', point_match.group(0))
            if point_coords:
                coords_text = point_coords.group(1).strip()
                parts = coords_text.split(',')
                if len(parts) >= 2:
                    try:
                        lon = float(parts[0])
                        lat = float(parts[1])
                        features.append({
                            "type": "Feature",
                            "properties": {"name": name, "type": feature_type or "point"},
                            "geometry": {"type": "Point", "coordinates": [lon, lat]}
                        })
                    except ValueError:
                        continue
    
    return {"type": "FeatureCollection", "features": features}


def convert_kmz(kmz_path):
    """Extract and parse KMZ file."""
    with zipfile.ZipFile(kmz_path, 'r') as z:
        kml_files = [f for f in z.namelist() if f.endswith('.kml')]
        if not kml_files:
            raise ValueError("No KML file found in KMZ")
        kml_content = z.read(kml_files[0]).decode('utf-8')
    return parse_kml_content(kml_content)


def convert_kml(kml_path):
    """Read and parse KML file."""
    with open(kml_path, 'r', encoding='utf-8') as f:
        kml_content = f.read()
    return parse_kml_content(kml_content)


def convert_csv(csv_path):
    """Parse CSV and convert to GeoJSON."""
    features = []
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                lat_str = row.get('Latitude', '').strip().replace('°', '').replace('N', '').replace('S', '').strip()
                lon_str = row.get('Longitude', '').strip().replace('°', '').replace('E', '').replace('W', '').strip()
                
                lat = float(lat_str)
                lon = float(lon_str)
                if 'S' in row.get('Latitude', ''):
                    lat = -lat
                if 'W' in row.get('Longitude', ''):
                    lon = -lon
                
                features.append({
                    "type": "Feature",
                    "properties": {
                        "name": row.get('Location Name', '').strip(),
                        "description": row.get('Description', '').strip(),
                        "story": row.get('Story', '').strip(),
                        "founded": row.get('Founded', '').strip(),
                        "community_type": row.get('Community Type', '').strip(),
                        "type": "location"
                    },
                    "geometry": {"type": "Point", "coordinates": [lon, lat]}
                })
            except Exception as e:
                print(f"  Warning: skipped row — {e}")
    
    return {"type": "FeatureCollection", "features": features}


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/import_data.py <file.kmz|file.kml|file.csv>")
        print("\nJust drop your KMZ/KML/CSV file and this script figures out the rest.")
        print("\nRecognized layer names (in your filename):")
        print("  cart trails  → data/cart_trails.geojson")
        print("  waterways    → data/waterways.geojson")
        print("  locations    → data/locations.geojson")
        print("  battles      → data/battles.geojson")
        print("  buffalo herds → data/buffalo_herds.geojson")
        sys.exit(1)
    
    input_path = Path(sys.argv[1]).expanduser()
    
    if not input_path.exists():
        print(f"Error: File not found — {input_path}")
        sys.exit(1)
    
    suffix = input_path.suffix.lower()
    
    # 1. Detect layer type
    keyword, output_rel = detect_layer(input_path)
    
    if keyword:
        print(f"Detected layer: {keyword} (from filename '{input_path.name}')")
    else:
        print(f"Could not auto-detect layer type from '{input_path.name}'.")
        print("\nChoose a layer number:")
        options = sorted(set(LAYER_MAP.values()))
        for i, path in enumerate(options, 1):
            print(f"  {i}. {path}")
        try:
            choice = int(input("Select (1-{}): ".format(len(options))).strip())
            output_rel = options[choice - 1]
        except (ValueError, IndexError):
            print("Invalid selection.")
            sys.exit(1)
    
    output_path = REPO_DIR / output_rel
    
    # 2. Convert
    print(f"\nConverting {input_path.name} → {output_rel}...")
    
    try:
        if suffix == '.kmz':
            data = convert_kmz(input_path)
        elif suffix == '.kml':
            data = convert_kml(input_path)
        elif suffix == '.csv':
            data = convert_csv(input_path)
        else:
            print(f"Error: Unsupported file type '{suffix}'. Use .kmz, .kml, or .csv.")
            sys.exit(1)
    except Exception as e:
        print(f"Error during conversion: {e}")
        sys.exit(1)
    
    # 3. Write output
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"Done! {len(data['features'])} features written to {output_rel}")
    print(f"\nTo update the live map, commit and push:")
    print(f"  git add {output_rel}")
    print(f"  git commit -m 'Update {keyword or 'data'} from {input_path.name}'")
    print(f"  git push")


if __name__ == '__main__':
    main()
