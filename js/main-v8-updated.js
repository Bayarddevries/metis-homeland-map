// Métis Homeland Map V8 - Bottom Bar UI (Updated)

// Toggle panels
const legendToggle = document.getElementById('legendToggle');
const statsToggleBtn = document.getElementById('statsToggle');
const closeStats = document.getElementById('closeStats');
const closeLegend = document.getElementById('closeLegend');
const statsPanel = document.getElementById('statsPanel');
const legendPanel = document.getElementById('legendPanel');

// Stats toggle
if (statsToggleBtn && statsPanel) {
 statsToggleBtn.addEventListener('click', () => {
  const isVisible = statsPanel.classList.contains('visible');
  statsPanel.classList.toggle('visible');
 });
 
 if (closeStats) {
  closeStats.addEventListener('click', () => {
   statsPanel.classList.remove('visible');
  });
 }
}

// Legend toggle
if (legendToggle && legendPanel) {
 legendToggle.addEventListener('click', () => {
  const isVisible = legendPanel.classList.contains('visible');
  legendPanel.classList.toggle('visible');
 });
 
 if (closeLegend) {
  closeLegend.addEventListener('click', () => {
   legendPanel.classList.remove('visible');
  });
 }
}

// Layer toggles
const layerBtns = document.querySelectorAll('.layer-btn');
const layerState = {
 waterways: true,
 trails: true,
 locations: true,
 buffalo: false
};

layerBtns.forEach(btn => {
 btn.addEventListener('click', () => {
  const layer = btn.dataset.layer;
  const isActive = btn.classList.contains('active');
  
  if (isActive) {
   btn.classList.remove('active');
   layerState[layer] = false;
  } else {
   btn.classList.add('active');
   layerState[layer] = true;
  }
  console.log(`Layer ${layer}: ${layerState[layer] ? 'ON' : 'OFF'}`);
 });
});

// Initialize map
const map = L.map('map').setView([52.5, -98.5], 6);

// Base map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 attribution: '© OpenStreetMap contributors',
 maxZoom: 18
}).addTo(map);

// Render functions
function renderWaterways(data) {
 if (!layerState.waterways) return;
 waterwaysLayer = L.geoJSON(data.waterways, {
  style: { color: '#1E4D8C', weight: 3, opacity: 0.8 }
 }).addTo(map);
}

function renderCartTrails(data) {
 if (!layerState.trails) return;
 cartTrailsLayer = L.geoJSON(data.cartTrails, {
  style: { color: '#B8312F', weight: 2, opacity: 0.8 }
 }).addTo(map);
}

function renderLocations(data) {
 if (!layerState.locations) return;
 locationsLayer = L.geoJSON(data.locations, {
  pointToLayer: function(feature, latlng) {
   return L.marker(latlng);
  },
  onEachFeature: function(feature, layer) {
   if (feature.properties && feature.properties.name) {
    layer.bindPopup(`<strong>${feature.properties.name}</strong>`);
   }
  }
 }).addTo(map);
}

function renderBuffaloHerds(data) {
 const seasonalColors = [
  { name: 'Original extent', color: '#1B5E20', fill: '#4CAF50', label: 'Full Range' },
  { name: 'Range in 1870', color: '#E65100', fill: '#FF9800', label: '1870 Range' },
  { name: 'Range in 1889', color: '#B71C1C', fill: '#F44336', label: '1889 Range' }
 ];
 
 function getColorForName(name) {
  for (const scheme of seasonalColors) {
   if (name.includes(scheme.name) || scheme.name.includes(name.split(' ')[0])) {
    return scheme;
   }
  }
  return seasonalColors[0];
 }
 
 buffaloHerdsLayer = L.geoJSON(data.buffaloHerds, {
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
    const name = feature.properties.name;
    layer.bindPopup(`
     <div class="popup-header">
      <div class="popup-title">${name}</div>
     </div>
     <div class="popup-body">
      <p style="font-size: 11px; color: #666; font-style: italic;">
       <strong>Source:</strong> Hornaday (1889)<br>
       Historical buffalo herd range
      </p>
     </div>
    `);
   }
  }
 });
 
 if (layerState.buffalo) {
  buffaloHerdsLayer.addTo(map);
 }
}

// Update stats display
function updateStats(data) {
 const ids = ['waterways', 'trails', 'locations', 'buffalo'];
 const counts = [
  data.waterways.features.length,
  data.cartTrails.features.length,
  data.locations.features.length,
  data.buffaloHerds.features.length
 ];
 
 ids.forEach((id, i) => {
  const el = document.getElementById(`stats-${id}`);
  if (el) el.textContent = counts[i];
 });
 
 // Also update detail panel
 const detailIds = ['waterways', 'trails', 'locations', 'buffalo'];
 detailIds.forEach((id, i) => {
  const el = document.getElementById(`stats-${id}-detail`);
  if (el) el.textContent = counts[i];
 });
}

// Initialize
async function initMap() {
 try {
  const data = window.homelandData;
  renderWaterways(data);
  renderCartTrails(data);
  renderLocations(data);
  renderBuffaloHerds(data);
  updateStats(data);
 } catch (error) {
  console.error('Error loading map data:', error);
 }
}

if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', initMap);
} else {
 initMap();
}
