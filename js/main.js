// Métis Homeland Map V8 - Bottom Bar UI

document.addEventListener('DOMContentLoaded', () => {
 // Toggle panels
 const statsToggleBtn = document.getElementById('statsToggle');
 const closeStats = document.getElementById('closeStats');
 const statsPanel = document.getElementById('statsPanel');
 
 // Layer info panel
 const layerInfoPanel = document.getElementById('layerInfoPanel');
 const layerInfoTitle = document.getElementById('layerInfoTitle');
 const layerInfoContent = document.getElementById('layerInfoContent');
 const closeLayerInfo = document.getElementById('closeLayerInfo');

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

 // Layer info panel close
 if (closeLayerInfo && layerInfoPanel) {
  closeLayerInfo.addEventListener('click', () => {
   layerInfoPanel.classList.remove('visible');
  });
 }

 // Layer state
 const layerState = {
  waterways: true,
  trails: true,
  locations: true,
  buffalo: false
 };

 // Layer info data
 const layerInfo = {
  waterways: {
   title: '💧 Waterways',
   about: 'This layer shows the major waterways of the Métis Homeland including rivers, lakes, and streams. These water routes were essential for transportation, trade, and sustenance, forming the backbone of the Métis economy and culture.',
   sources: 'Natural Resources Canada, Manitoba Historical Society, Provincial hydrographic data',
   features: []
  },
  trails: {
   title: '🛤️ Cart Trails',
   about: 'Historic Métis cart trails connecting settlements across the homeland. These trails were traveled by Red River carts, unique to the Métis, enabling trade networks spanning hundreds of kilometers. The trails follow natural portage routes and connect major waterways.',
   sources: 'Manitoba Archives, Hudson Bay Company records, Historical maps and journals',
   features: []
  },
  locations: {
   title: '📍 Places & Communities',
   about: 'Métis settlements, communities, and significant locations across the homeland. These places represent centers of Métis culture, trade, and governance. Many locations date to the early fur trade era and remain important to Métis families today.',
   sources: 'Manitoba Historical Society, Census records, Community oral histories',
   features: []
  },
  buffalo: {
   title: '🦬 Buffalo Herd Ranges',
   about: 'This layer shows the dramatic contraction of buffalo range from pre-contact times through 1889. The buffalo were central to Métis culture, economy, and survival. By understanding where the buffalo were, we understand where the Métis could live and thrive. The rapid disappearance of the buffalo after 1870 forced dramatic changes to Métis lifeways.',
   sources: 'Hornaday (1889), Meades (1982), Manitoba Conservation Data Centre',
   eras: [
    {
     name: 'Original Range',
     color: '#4CAF50',
     count: 1,
     description: 'Pre-contact buffalo distribution across the northern plains. This vast territory supported enormous herds and was the foundation of Plains Indigenous economies for millennia.',
     polygons: []
    },
    {
     name: '1870 Range',
     color: '#FF9800',
     count: 2,
     description: 'By 1870, commercial hunting and westward expansion had already reduced the range. The buffalo were still present but their territory was shrinking rapidly. This period coincides with Manitoba entry into Confederation.',
     polygons: []
    },
    {
     name: '1889 Range',
     color: '#F44336',
     count: 6,
     description: 'By 1889, the buffalo were nearly extinct. Only scattered remnant herds survived in remote areas. This represents one of the most rapid ecological collapses in recorded history, devastating the Métis economy and way of life.',
     polygons: []
    }
   ]
  }
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
 function toggleLayer(layerName, newState) {
  if (newState !== undefined) {
   layerState[layerName] = newState;
  } else {
   layerState[layerName] = !layerState[layerName];
  }
  
  const isActive = layerState[layerName];
  const btn = document.querySelector(`.layer-btn[data-layer="${layerName}"]`);
  
  if (isActive) {
   if (btn) btn.classList.add('active');
   if (layerName === 'waterways' && data) renderWaterways(data.waterways);
   if (layerName === 'trails' && data) renderCartTrails(data.cartTrails);
   if (layerName === 'locations' && data) renderLocations(data.locations);
   if (layerName === 'buffalo' && data) renderBuffaloHerds(data.buffaloHerds);
   console.log(`${layerName}: ON`);
  } else {
   if (btn) btn.classList.remove('active');
   if (layerName === 'waterways' && waterwaysLayer) map.removeLayer(waterwaysLayer);
   if (layerName === 'trails' && cartTrailsLayer) map.removeLayer(cartTrailsLayer);
   if (layerName === 'locations' && locationsLayer) map.removeLayer(locationsLayer);
   if (layerName === 'buffalo' && buffaloHerdsLayer) map.removeLayer(buffaloHerdsLayer);
   console.log(`${layerName}: OFF`);
  }
 }

 // Layer buttons - open info panel
 const layerBtns = document.querySelectorAll('.layer-btn');
 layerBtns.forEach(btn => {
  btn.addEventListener('click', () => {
   const layer = btn.dataset.layer;
   showLayerInfo(layer);
  });
 });

 // Show layer info panel
 function showLayerInfo(layerName) {
  const info = layerInfo[layerName];
  if (!info) return;

  layerInfoTitle.textContent = info.title;
  
  let content = '';
  
  // Toggle switch
  content += `
  <div class="layer-info-toggle">
  <input type="checkbox" id="layerToggleCheckbox" ${layerState[layerName] ? 'checked' : ''}>
  <label for="layerToggleCheckbox">Enable Layer</label>
  </div>
  `;

  // About section
  content += `
  <div class="layer-info-section layer-info-about">
  <h4>About</h4>
  <p>${info.about}</p>
  </div>
  `;

  // Sources section
  content += `
  <div class="layer-info-section layer-info-sources">
  <h4>Sources</h4>
  <p>${info.sources}</p>
  </div>
  `;

  // Features section (if applicable)
  if (info.features && info.features.length > 0) {
   content += '<div class="layer-info-section layer-info-features"><h4>Features</h4>';
   info.features.forEach(feature => {
    content += `
    <div class="feature-item">
    <strong>${feature.name}</strong>
    <p>${feature.description}</p>
    </div>
    `;
   });
   content += '</div>';
  }

  // Buffalo eras (special case)
  if (layerName === 'buffalo' && info.eras) {
   content += '<div class="layer-info-section layer-info-features"><h4>Herd Ranges by Era</h4>';
   info.eras.forEach((era, index) => {
    const eraId = `buffalo-era-${index}`;
    content += `
    <div class="expandable-section">
    <div class="expandable-header" data-target="${eraId}">
    <h5>${era.name} (${era.count} polygon${era.count !== 1 ? 's' : ''})</h5>
    <span class="expandable-icon">▼</span>
    </div>
    <div class="expandable-content" id="${eraId}" style="display: none;">
    <p>${era.description}</p>
    ${era.polygons.length > 0 ? era.polygons.map(p => `
    <div class="feature-item" style="margin-top: 8px;">
    <strong>${p.name}</strong>
    <p>${p.description}</p>
    </div>
    `).join('') : ''}
    </div>
    </div>
    `;
   });
   content += '</div>';
  }

  layerInfoContent.innerHTML = content;
  
  // Add toggle checkbox listener
  const checkbox = document.getElementById('layerToggleCheckbox');
  if (checkbox) {
   checkbox.addEventListener('change', (e) => {
    toggleLayer(layerName, e.target.checked);
   });
  }

  // Add expandable section listeners
  setTimeout(() => {
   const expandableHeaders = document.querySelectorAll('.expandable-header');
   expandableHeaders.forEach(header => {
    header.addEventListener('click', () => {
     const targetId = header.dataset.target;
     const content = document.getElementById(targetId);
     const isActive = header.classList.contains('active');
     
     if (isActive) {
      header.classList.remove('active');
      content.style.display = 'none';
     } else {
      header.classList.add('active');
      content.style.display = 'block';
     }
    });
   });
  }, 100);

  layerInfoPanel.classList.add('visible');
 }

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

 function createLocationPopup(props) {
   const name = props.name || 'Unknown Location';
   let html = `
 <div class="popup-header">
 <div class="popup-title">${name}</div>
 </div>
 <div class="popup-body">
 `;

   if (props.description) {
     const desc = props.description.length > 400
       ? props.description.substring(0, 400) + '…'
       : props.description;
     html += `<div class="popup-description">${desc}</div>`;
   }

   html += '<div class="popup-meta">';

   if (props.founded && props.founded !== '#N/A' && props.founded !== '') {
     html += `<span class="popup-tag founded">Founded: ${props.founded}</span>`;
   }

   if (props.community_type) {
     html += `<span class="popup-tag type">${props.community_type}</span>`;
   }

   html += '</div></div>';
   return html;
 }

 function renderLocations(geojsonData) {
  if (locationsLayer) map.removeLayer(locationsLayer);
  
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
    if (feature.properties) {
     layer.bindPopup(createLocationPopup(feature.properties));
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
     const name = feature.properties.name;
     let eraDesc = '';
     if (name.includes('Original')) {
      eraDesc = 'Pre-contact range - vast territory supporting enormous herds';
     } else if (name.includes('1870')) {
      eraDesc = '1870 range - shrinking rapidly due to commercial hunting';
     } else if (name.includes('1889')) {
      eraDesc = '1889 range - remnant herds, nearly extinct';
     }
     
     layer.bindPopup(
      '<div class="popup-header">' +
      '<div class="popup-title">' + name + '</div>' +
      '</div>' +
      '<div class="popup-body">' +
      '<p class="popup-description">' + eraDesc + '</p>' +
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
  console.log(' Waterways:', data.waterways.features.length);
  console.log(' Cart trails:', data.cartTrails.features.length);
  console.log(' Locations:', data.locations.features.length);
  console.log(' Buffalo herds:', data.buffaloHerds.features.length);
  
  // Render initial layers (waterways, trails, locations - but NOT buffalo by default)
  renderWaterways(data.waterways);
  renderCartTrails(data.cartTrails);
  renderLocations(data.locations);
  updateStats(data);
  
 } catch (error) {
  console.error('✗ Error loading map data:', error);
 }
});
