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
  buffalo: false,
  battles: false
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
  },
  battles: {
   title: '⚔️ Battles',
   about: 'Six decisive battles and engagements that shaped the Métis experience in the 19th century. From the founding assertion of sovereignty at Seven Oaks in 1816 to the final retreat at Loon Lake in 1885, these military encounters defined Métis political identity and resistance to colonial encroachment.',
   sources: 'Lawrence Barkwell, Jean-Claude Castex, Manitoba Historical Society, Saskatchewan Archives',
   features: []
  }
 };

 // Initialize map
 const map = L.map('map').setView([52.5, -98.5], 6);
 window._metisMap = map; // expose for dark mode tile switching

 // Base map tiles — CartoDB Voyager (light); dark mode swaps to Dark Matter
 const baseTiles = L.tileLayer(
 window._metisDarkMode ? window._metisDarkMode.getTileUrl() : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
 {
 attribution: window._metisDarkMode ? window._metisDarkMode.getAttr() : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
 maxZoom: 18,
 subdomains: 'abcd'
 }
 ).addTo(map);

 let waterwaysLayer, cartTrailsLayer, locationsLayer, buffaloHerdsLayer, battlesLayer;
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
   if (layerName === 'battles' && data) renderBattles(data.battles);
   console.log(`${layerName}: ON`);
  } else {
   if (btn) btn.classList.remove('active');
   if (layerName === 'waterways' && waterwaysLayer) map.removeLayer(waterwaysLayer);
   if (layerName === 'trails' && cartTrailsLayer) map.removeLayer(cartTrailsLayer);
   if (layerName === 'locations' && locationsLayer) map.removeLayer(locationsLayer);
   if (layerName === 'buffalo' && buffaloHerdsLayer) map.removeLayer(buffaloHerdsLayer);
   if (layerName === 'battles' && battlesLayer) map.removeLayer(battlesLayer);
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

function createBattlePopup(props) {
  const name = props.name || 'Unknown Battle';
  const date = props.date || '';
  const desc = props.description || '';
  const figures = props.historical_figures || '';
  const descShort = desc.length > 300 ? desc.substring(0, 300) + '…' : desc;

  return `
  <div class="popup-header">
  <div class="popup-title">${name}</div>
  </div>
  <div class="popup-body">
  ${date ? `<p style="margin:0 0 8px; font-size:12px; color:#B8312F; font-weight:600;">${date}</p>` : ''}
  ${descShort ? `<p class="popup-description">${descShort}</p>` : ''}
  ${figures ? `<p style="font-size:11px; color:#555; margin-top:8px;"><strong>Key figures:</strong> ${figures}</p>` : ''}
  </div>
  `;
}

function renderBattles(geojsonData) {
  if (battlesLayer) map.removeLayer(battlesLayer);

  battlesLayer = L.geoJSON(geojsonData, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: 8,
        fillColor: '#B8312F',
        color: '#fff',
        weight: 2.5,
        opacity: 1,
        fillOpacity: 0.9
      });
    },
    onEachFeature: function(feature, layer) {
      if (feature.properties) {
        layer.bindPopup(createBattlePopup(feature.properties));
      }
    }
  }).addTo(map);

  console.log('Battles rendered:', geojsonData.features.length, 'features');
}

 // Update stats display
 function updateStats(geojsonData) {
  const stats = [
   { id: 'waterways', count: geojsonData.waterways.features.length },
   { id: 'trails', count: geojsonData.cartTrails.features.length },
   { id: 'locations', count: geojsonData.locations.features.length },
   { id: 'buffalo', count: geojsonData.buffaloHerds.features.length },
   { id: 'battles', count: (geojsonData.battles || []).features.length }
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
 (async () => {
 const banner = document.getElementById('errorBanner');
 const bannerMsg = document.getElementById('errorMessage');
 const dismissBtn = document.getElementById('errorDismiss');

 function showError(msg, isWarning) {
 if (banner && bannerMsg) {
 bannerMsg.textContent = msg;
 banner.classList.toggle('warning', !!isWarning);
 banner.classList.add('visible');
 console.error('Map error:', msg);
 }
 }

 if (dismissBtn) {
 dismissBtn.addEventListener('click', () => {
 if (banner) banner.classList.remove('visible');
 });
 }

 try {
 data = window.homelandData;
 if (!data) {
 throw new Error('Map data not found. Please refresh the page.');
 }
 } catch (error) {
 showError('Unable to load map data: ' + error.message);
 return;
 }

 // Load each layer with independent error handling
 // Fetch battles layer from external GeoJSON
 try {
 const response = await fetch('data/battles.geojson');
 if (response.ok) {
 data.battles = await response.json();
 console.log('Battles:', data.battles.features.length, 'loaded');
 } else {
 console.warn('Battles data returned status', response.status);
 }
 } catch (e) {
 console.warn('Could not load battles layer:', e);
 showError('Battles layer could not be loaded. Other layers are still available.', true);
 }

 // Render each layer independently — one failure won't break the others
 let loadedCount = 0;
 const totalLayers = 4; // waterways, trails, locations, buffalo

 try {
 renderWaterways(data.waterways);
 loadedCount++;
 } catch (e) {
 console.error('Failed to render waterways:', e);
 showError('Waterways layer failed to render.', true);
 }

 try {
 renderCartTrails(data.cartTrails);
 loadedCount++;
 } catch (e) {
 console.error('Failed to render cart trails:', e);
 showError('Cart trails layer failed to render.', true);
 }

 try {
 renderLocations(data.locations);
 loadedCount++;
 } catch (e) {
 console.error('Failed to render locations:', e);
 showError('Locations layer failed to render.', true);
 }

 try {
 if (layerState.buffalo) {
 renderBuffaloHerds(data.buffaloHerds);
 loadedCount++;
 } else {
 loadedCount++; // count as success — layer is intentionally off
 }
 } catch (e) {
 console.error('Failed to render buffalo herds:', e);
 showError('Buffalo herds layer failed to render.', true);
 }

 try {
 updateStats(data);
 } catch (e) {
 console.error('Failed to update stats:', e);
 }

 console.log('✓ Map loaded — ' + loadedCount + '/' + totalLayers + ' layers rendered successfully');

 if (loadedCount === 0) {
 showError('No map layers could be rendered. Please try refreshing the page.');
 }
 })();
});
