// Main JavaScript for Homeland Map V5

// Map state
let map;
let waterwaysLayer;
let cartTrailsLayer;
let locationsLayer;
let buffaloHerdsLayer;

// Layer visibility state - buffalo herds OFF by default for cleaner mobile view
const layerState = {
 waterways: true,
 cartTrails: true,
 locations: true,
 buffaloHerds: false  // OFF by default - user toggles on
};

/**
 * Initialize the map
 */
function initMap() {
 // Create map centered on the homeland region (Manitoba/Saskatchewan area)
 map = L.map('map', {
 center: [52.0, -98.0], // Centered roughly on the homeland
 zoom: 6,
 minZoom: 4,
 maxZoom: 18,
 zoomControl: true
 });

 // Add base tile layer (CartoDB Positron - clean, refined cartographic style)
 L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
 attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
 subdomains: 'abcd',
 maxZoom: 20
 }).addTo(map);

 // Move zoom control to top-right
 map.zoomControl.setPosition('topright');

 // Load data layers from embedded data
 loadDataLayers();
}

/**
 * Load all data layers from embedded data
 */
function loadDataLayers() {
 try {
 const data = window.homelandData;
 
 if (!data) {
 throw new Error('Embedded data not found. Please check data.js is loaded.');
 }

 // Render waterways
 renderWaterways(data.waterways);

 // Render cart trails
 renderCartTrails(data.cartTrails);

 // Render locations
 renderLocations(data.locations);

 // Render buffalo herd zones (OFF by default)
 renderBuffaloHerds(data.buffaloHerds);

 // Add layer control AFTER all layers are loaded
 addLayerControl();

 // Update stats
 updateStats(data);

 } catch (error) {
 console.error('Error loading data layers:', error);
 alert('Error loading map data. Please check data.js is loaded.');
 }
}

/**
 * Update stats display
 */
function updateStats(data) {
 const statsEl = document.getElementById('stats-waterways');
 const trailsEl = document.getElementById('stats-trails');
 const locationsEl = document.getElementById('stats-locations');
 const buffaloEl = document.getElementById('stats-buffalo');
 
 if (statsEl) statsEl.textContent = data.waterways.features.length;
 if (trailsEl) trailsEl.textContent = data.cartTrails.features.length;
 if (locationsEl) locationsEl.textContent = data.locations.features.length;
 if (buffaloEl) buffaloEl.textContent = data.buffaloHerds.features.length;
}

/**
 * Render waterways as blue lines
 */
function renderWaterways(data) {
 waterwaysLayer = L.geoJSON(data, {
 style: {
 color: '#1E4D8C',
 weight: 3,
 opacity: 0.8
 },
 onEachFeature: function(feature, layer) {
 if (feature.properties && feature.properties.name) {
 layer.bindPopup(createPopup('Waterway', feature.properties.name, feature.properties.description, feature.properties));
 }
 }
 });

 if (layerState.waterways) {
 waterwaysLayer.addTo(map);
 }
}

/**
 * Render cart trails as red dashed lines
 */
function renderCartTrails(data) {
 cartTrailsLayer = L.geoJSON(data, {
 style: {
 color: '#B8312F',
 weight: 4,
 opacity: 0.9,
 dashArray: '12, 8'
 },
 onEachFeature: function(feature, layer) {
 if (feature.properties && feature.properties.name) {
 layer.bindPopup(createPopup('Historic Cart Trail', feature.properties.name, feature.properties.description, feature.properties));
 }
 }
 });

 if (layerState.cartTrails) {
 cartTrailsLayer.addTo(map);
 }
}

/**
 * Render locations as markers
 */
function renderLocations(data) {
 // Create custom green marker icon
 const locationIcon = L.divIcon({
 className: 'location-marker',
 html: '<div style="background-color: #2D7D46; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(45, 125, 70, 0.5);"></div>',
 iconSize: [14, 14],
 iconAnchor: [7, 7]
 });

 locationsLayer = L.geoJSON(data, {
 pointToLayer: function(feature, latlng) {
 return L.marker(latlng, { icon: locationIcon });
 },
 onEachFeature: function(feature, layer) {
 layer.bindPopup(createPopup('Location', feature.properties.name, feature.properties.description, feature.properties, feature.properties.story));
 }
 });

 if (layerState.locations) {
 locationsLayer.addTo(map);
 }
}

/**
 * Render buffalo herd zones with seasonal colors (solid fill, semi-transparent)
 * Each zone gets a different color based on time period
 */
function renderBuffaloHerds(data) {
 // Seasonal color scheme - different color for each zone
 const seasonalColors = [
 { color: '#8B4513', fill: '#A0522D', name: 'Pre-1800 Range' }, // Deep red-brown (earliest)
 { color: '#D2691E', fill: '#CD853F', name: '1850s Range' }, // Golden brown (middle)
 { color: '#CD853F', fill: '#DEB887', name: '1880s Range' } // Pale tan (latest)
 ];

  // Track feature index manually since Leaflet doesn't provide it in style function
  let featureIndex = 0;
  
  buffaloHerdsLayer = L.geoJSON(data, {
  style: function(feature) {
  // Get color based on zone index (seasonal progression)
  const zoneIndex = featureIndex % seasonalColors.length;
  const colors = seasonalColors[zoneIndex];
  featureIndex++; // Increment for next feature
  
  return {
  color: colors.color, // Border color
  weight: 2,
  opacity: 0.9,
  fillColor: colors.fill, // Fill color (seasonal)
  fillOpacity: 0.35, // Semi-transparent solid fill
  dashArray: null // Solid line (no dash)
  };
  },
  onEachFeature: function(feature, layer) {
  if (feature.properties && feature.properties.name) {
  // Use the property name directly
  const zoneName = feature.properties.name;
  
  layer.bindPopup(createBuffaloPopup(zoneName, feature));
  }
  }
  });

 if (layerState.buffaloHerds) {
 buffaloHerdsLayer.addTo(map);
 }
}

/**
 * Create popup content for buffalo herd zones
 */
function createBuffaloPopup(zoneName, feature) {
 const description = feature.properties.description || '';
 
 return `
 <div class="popup-header">
 <div class="popup-title">${zoneName}</div>
 </div>
 <div class="popup-body">
 ${description ? `<div class="popup-description">${description}</div>` : ''}
 <div class="popup-meta">
 <div style="margin-top: 8px; font-size: 11px; color: #666; font-style: italic;">
 <strong>Source:</strong> Hornaday, William Temple. <em>The Extermination of the American Bison</em>. Washington, D.C.: Government Printing Office, 1889.
 </div>
 </div>
 </div>
 `;
}

/**
 * Create popup HTML structure (generic)
 */
function createPopup(type, name, description, props, story) {
 let html = `
 <div class="popup-header">
 <div class="popup-title">${name || 'Unknown Location'}</div>
 </div>
 <div class="popup-body">
 `;
 
 if (description) {
 // Truncate long descriptions
 const desc = description.length > 250 
 ? description.substring(0, 250) + '...' 
 : description;
 html += `<div class="popup-description">${desc}</div>`;
 }
 
 // Add meta tags
 html += '<div class="popup-meta">';
 
 if (props && props.founded && props.founded !== '#N/A' && props.founded !== '') {
 html += `<span class="popup-tag founded">Founded: ${props.founded}</span>`;
 }
 
 if (props && props.community_type) {
 html += `<span class="popup-tag type">${props.community_type}</span>`;
 }
 
 html += '</div></div>';
 
 return html;
}

/**
 * Show buffalo herd info popup
 */
function showBuffaloInfo() {
 const infoContent = `
 <div style="padding: 8px;">
 <h4 style="margin: 0 0 8px 0; color: #8B4513;">Dwindling Buffalo Herds, 19th Century</h4>
 <p style="margin: 0 0 8px 0; font-size: 13px; line-height: 1.4;">
 These zones show the contraction of buffalo range through the 19th century, from the open plains to fragmented remnants by 1889.
 </p>
 <p style="margin: 0; font-size: 11px; color: #666; font-style: italic;">
 <strong>Source:</strong> Hornaday, William Temple. <em>The Extermination of the American Bison</em>. Washington, D.C.: Government Printing Office, 1889.
 </p>
 </div>
 `;
 
 // Create a temporary popup
 const popup = L.popup()
 .setLatLng(map.getCenter())
 .setContent(infoContent)
 .openOn(map);
}

/**
 * Add layer control to toggle visibility
 */
function addLayerControl() {
 // Create custom layer control with header
 const control = L.control.layers(null, null, {
 position: 'topright',
 collapsed: false
 });

 control.addOverlay(waterwaysLayer, '<span style="color:#1E4D8C">●</span> Waterways');
 control.addOverlay(cartTrailsLayer, '<span style="color:#B8312F">●</span> Cart Trails');
 control.addOverlay(locationsLayer, '<span style="color:#2D7D46">●</span> Locations');
 
 // Buffalo layer with info icon
 const buffaloLabel = '<span style="color:#8B4513">●</span> ' +
 '<span style="cursor: pointer; margin-right: 4px;" onclick="showBuffaloInfo()" title="View source information">ℹ️</span>' +
 'Buffalo Herd Zones';
 
 control.addOverlay(buffaloHerdsLayer, buffaloLabel);

 control.addTo(map);
}

/**
 * Toggle layer visibility
 */
function toggleLayer(layerName) {
 const layer = {
 'waterways': waterwaysLayer,
 'cartTrails': cartTrailsLayer,
 'locations': locationsLayer,
 'buffaloHerds': buffaloHerdsLayer
 }[layerName];

 if (!layer) return;

 if (layerState[layerName]) {
 map.removeLayer(layer);
 } else {
 layer.addTo(map);
 }

 layerState[layerName] = !layerState[layerName];
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', initMap);
