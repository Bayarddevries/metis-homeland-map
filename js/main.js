// Métis Homeland Map V8 - Bottom Bar UI

document.addEventListener('DOMContentLoaded', () => {
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
   legendPanel.classList.toggle('visible');
  });
  
  if (closeLegend) {
   closeLegend.addEventListener('click', () => {
    legendPanel.classList.remove('visible');
   });
  }
 }

 // Layer state
 const layerState = {
  waterways: true,
  trails: true,
  locations: true,
  buffalo: false
 };

 // Initialize map
 const map = L.map('map').setView([52.5, -98.5], 6);

 // Base map tiles
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 18
 }).addTo(map);

 let waterwaysLayer, cartTrailsLayer, locationsLayer, buffaloHerdsLayer;
 let data = null;

 // Layer toggle function
 function toggleLayer(layerName) {
  const isActive = layerState[layerName];
  
  if (isActive) {
   // Turn OFF
   layerState[layerName] = false;
   if (layerName === 'waterways' && waterwaysLayer) map.removeLayer(waterwaysLayer);
   if (layerName === 'trails' && cartTrailsLayer) map.removeLayer(cartTrailsLayer);
   if (layerName === 'locations' && locationsLayer) map.removeLayer(locationsLayer);
   if (layerName === 'buffalo' && buffaloHerdsLayer) map.removeLayer(buffaloHerdsLayer);
   console.log(`${layerName}: OFF`);
  } else {
   // Turn ON
   layerState[layerName] = true;
   if (layerName === 'waterways' && data) renderWaterways(data.waterways);
   if (layerName === 'trails' && data) renderCartTrails(data.cartTrails);
   if (layerName === 'locations' && data) renderLocations(data.locations);
   if (layerName === 'buffalo' && data) renderBuffaloHerds(data.buffaloHerds);
   console.log(`${layerName}: ON`);
  }
 }

 // Layer toggle buttons
 const layerBtns = document.querySelectorAll('.layer-btn');
 layerBtns.forEach(btn => {
  btn.addEventListener('click', () => {
   const layer = btn.dataset.layer;
   const isActive = btn.classList.contains('active');
   
   if (isActive) {
    btn.classList.remove('active');
   } else {
    btn.classList.add('active');
   }
   
   toggleLayer(layer);
  });
 });

 // Render functions
 function renderWaterways(geojsonData) {
  if (waterwaysLayer) map.removeLayer(waterwaysLayer);
  
  waterwaysLayer = L.geoJSON(geojsonData, {
   style: { color: '#1E4D8C', weight: 3, opacity: 0.8 }
  }).addTo(map);
  
  console.log('Waterways rendered:', geojsonData.features.length, 'features');
 }

 function renderCartTrails(geojsonData) {
  if (cartTrailsLayer) map.removeLayer(cartTrailsLayer);
  
  cartTrailsLayer = L.geoJSON(geojsonData, {
   style: { color: '#B8312F', weight: 2, opacity: 0.8 }
  }).addTo(map);
  
  console.log('Cart trails rendered:', geojsonData.features.length, 'features');
 }

 function renderLocations(geojsonData) {
  if (locationsLayer) map.removeLayer(locationsLayer);
  
  // Use simple circle markers instead of default markers for better performance
  locationsLayer = L.geoJSON(geojsonData, {
   pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng, {
     radius: 6,
     fillColor: '#2D7D46',
     color: '#fff',
     weight: 2,
     opacity: 0.8,
     fillOpacity: 0.9
    });
   },
   onEachFeature: function(feature, layer) {
    if (feature.properties && feature.properties.name) {
     layer.bindPopup('<strong>' + feature.properties.name + '</strong>');
    }
   }
  }).addTo(map);
  
  console.log('Locations rendered:', geojsonData.features.length, 'features');
 }

 function renderBuffaloHerds(geojsonData) {
  if (buffaloHerdsLayer) map.removeLayer(buffaloHerdsLayer);
  
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
  
  buffaloHerdsLayer = L.geoJSON(geojsonData, {
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
     layer.bindPopup(
      '<div class="popup-header">' +
       '<div class="popup-title">' + feature.properties.name + '</div>' +
      '</div>' +
      '<div class="popup-body">' +
       '<p style="font-size: 11px; color: #666; font-style: italic;">' +
        '<strong>Source:</strong> Hornaday (1889)' +
       '</p>' +
      '</div>'
     );
    }
   }
  }).addTo(map);
  
  console.log('Buffalo herds rendered:', geojsonData.features.length, 'features');
 }

 // Update stats display
 function updateStats(geojsonData) {
  const stats = [
   { id: 'waterways', count: geojsonData.waterways.features.length },
   { id: 'trails', count: geojsonData.cartTrails.features.length },
   { id: 'locations', count: geojsonData.locations.features.length },
   { id: 'buffalo', count: geojsonData.buffaloHerds.features.length }
  ];
  
  stats.forEach(stat => {
   const el = document.getElementById('stats-' + stat.id);
   if (el) el.textContent = stat.count;
  });
  
  // Update detail panel too
  stats.forEach(stat => {
   const el = document.getElementById('stats-' + stat.id + '-detail');
   if (el) el.textContent = stat.count;
  });
 }

 // Initialize - load data
 try {
  data = window.homelandData;
  console.log('✓ Data loaded successfully');
  console.log('  Waterways:', data.waterways.features.length);
  console.log('  Cart trails:', data.cartTrails.features.length);
  console.log('  Locations:', data.locations.features.length);
  console.log('  Buffalo herds:', data.buffaloHerds.features.length);
  
  // Render initial layers (waterways, trails, locations - but NOT buffalo by default)
  renderWaterways(data.waterways);
  renderCartTrails(data.cartTrails);
  renderLocations(data.locations);
  updateStats(data);
  
 } catch (error) {
  console.error('✗ Error loading map data:', error);
 }
});
