// Métis Homeland Map - V7 Balanced UI

// Stats toggle functionality
const statsToggle = document.getElementById('statsToggle');
const statsBar = document.getElementById('statsBar');

statsToggle.addEventListener('click', () => {
 const isVisible = statsBar.classList.contains('visible');
 
 if (isVisible) {
  // Hide stats
  statsBar.classList.remove('visible');
  statsToggle.classList.remove('active');
  statsToggle.querySelector('.text').textContent = 'Show Data';
 } else {
  // Show stats
  statsBar.classList.add('visible');
  statsToggle.classList.add('active');
  statsToggle.querySelector('.text').textContent = 'Hide Data';
 }
});

// Layer toggles
const layerToggles = document.querySelectorAll('.layer-toggle');
const layerState = {
 waterways: true,
 trails: true,
 locations: true,
 buffalo: false
};

layerToggles.forEach(toggle => {
 toggle.addEventListener('click', () => {
  const layer = toggle.dataset.layer;
  const isActive = toggle.classList.contains('active');
  
  if (isActive) {
   toggle.classList.remove('active');
   layerState[layer] = false;
   // Hide layer logic here
  } else {
   toggle.classList.add('active');
   layerState[layer] = true;
   // Show layer logic here
  }
 });
});

// Initialize map (Leaflet)
const map = L.map('map').setView([52.5, -98.5], 6);

// Base map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 attribution: '© OpenStreetMap contributors',
 maxZoom: 18
}).addTo(map);

// Render functions would go here
function renderWaterways(data) {
 // Implementation
}

function renderCartTrails(data) {
 // Implementation
}

function renderLocations(data) {
 // Implementation
}

function renderBuffaloHerds(data) {
 // Implementation with new colors
 const seasonalColors = [
  { name: 'Original extent', color: '#1B5E20', fill: '#4CAF50' },
  { name: 'Range in 1870', color: '#E65100', fill: '#FF9800' },
  { name: 'Range in 1889', color: '#B71C1C', fill: '#F44336' }
 ];
 
 function getColorForName(name) {
  for (const scheme of seasonalColors) {
   if (name.includes(scheme.name) || scheme.name.includes(name.split(' ')[0])) {
    return scheme;
   }
  }
  return seasonalColors[0];
 }
 
 const buffaloHerdsLayer = L.geoJSON(data.buffaloHerds, {
  style: function(feature) {
   const name = feature.properties.name || '';
   const colors = getColorForName(name);
   
   return {
    color: colors.color,
    weight: 2,
    opacity: 0.9,
    fillColor: colors.fill,
    fillOpacity: 0.35,
    dashArray: null
   };
  },
  onEachFeature: function(feature, layer) {
   if (feature.properties && feature.properties.name) {
    layer.bindPopup(createBuffaloPopup(feature.properties.name, feature));
   }
  }
 });
 
 if (layerState.buffalo) {
  buffaloHerdsLayer.addTo(map);
 }
}

function createBuffaloPopup(zoneName, feature) {
 return `
  <div class="popup-header">
   <div class="popup-title">${zoneName}</div>
  </div>
  <div class="popup-body">
   <div class="popup-meta">
    <div style="margin-top: 8px; font-size: 11px; color: #666; font-style: italic;">
     <strong>Source:</strong> Hornaday, William Temple. <em>The Extermination of the American Bison</em>. 1889.
    </div>
   </div>
  </div>
 `;
}

// Update stats display
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

// Load data and initialize
async function initMap() {
 try {
  const data = window.homelandData;
  
  // Render all layers
  renderWaterways(data);
  renderCartTrails(data);
  renderLocations(data);
  renderBuffaloHerds(data);
  
  // Update stats
  updateStats(data);
  
 } catch (error) {
  console.error('Error loading map data:', error);
 }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', initMap);
} else {
 initMap();
}
