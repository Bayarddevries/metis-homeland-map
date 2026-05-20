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
const opening = !statsPanel.classList.contains('visible');
if (opening) {
 layerInfoPanel.classList.remove('visible');
 filterPanel.classList.remove('visible');
 if (filterToggleBtn) filterToggleBtn.classList.remove('active');
}
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

// Places filter state — which community type categories are visible
const filterState = {
 settlement: true,
 fort: true,
 'road-allowance': true,
 parish: true,
 landmark: true,
 transport: true,
 traditional: true,
 other: false
};

// Map community_type values to filter categories with colors
function getLocationCategory(type) {
 const t = (type || '').toLowerCase();
 if (t.includes('road allowance') || t.includes('road-allowance')) return { cat: 'road-allowance', color: '#FF9800' };
 if (t.includes('settlement') || t.includes('reserved lands')) return { cat: 'settlement', color: '#4CAF50' };
 if (t.includes('fort') || t.includes('trading post') || t.includes('trading outpost')) return { cat: 'fort', color: '#B8312F' };
 if (t.includes('parish') || t.includes('mission')) return { cat: 'parish', color: '#9C27B0' };
 if (t.includes('historic') || t.includes('landmark') || t.includes('sanctuary') || t.includes('geographic')) return { cat: 'landmark', color: '#2196F3' };
 if (t.includes('transport') || t.includes('route') || t.includes('hub')) return { cat: 'transport', color: '#FFC107' };
 if (t.includes('harvest') || t.includes('seasonal') || t.includes('gathering') || t.includes('traditional') || t.includes('ceremonial') || t.includes('meeting')) return { cat: 'traditional', color: '#795548' };
 return { cat: 'other', color: '#6B5D4D' };
}

 // Layer info data
 const layerInfo = {
  waterways: {
   title: '💧 Waterways',
   about: 'This layer shows the major waterways of the Métis Homeland including rivers, lakes, and streams. These water routes were essential for transportation, trade, and sustenance, forming the backbone of the Métis economy and culture.',
   sources: 'MANITOBA MÉTIS KNOWLEDGE, LAND USE AND OCCUPANCY STUDY MMF, 2022',
   features: []
  },
  trails: {
   title: '🛤️ Cart Trails',
   about: 'Historic Métis cart trails connecting settlements across the homeland. These trails were traveled by Red River carts, unique to the Métis, enabling trade networks spanning hundreds of kilometers. The trails follow natural portage routes and connect major waterways.',
   sources: 'MANITOBA MÉTIS KNOWLEDGE, LAND USE AND OCCUPANCY STUDY MMF, 2022',
   features: []
  },
  locations: {
   title: '📍 Places & Communities',
   about: 'Métis settlements, communities, and significant locations across the homeland. These places represent centers of Métis culture, trade, and governance. Many locations date to the early fur trade era and remain important to Métis families today.',
   sources: 'Barkwell, Lawrence J. "20th Century Métis Displacement and Road Allowance Communities in Manitoba." Louis Riel Institute, 8 Nov. 2016; Barkwell, Lawrence. Historic Métis Settlements in Manitoba and Geographical Place Names. Louis Riel Institute, 2018',
   features: []
  },
  buffalo: {
   title: '🦬 Buffalo Herd Ranges',
   about: 'This layer shows the dramatic contraction of buffalo range from pre-contact times through 1889. The buffalo were central to Métis culture, economy, and survival. By understanding where the buffalo were, we understand where the Métis could live and thrive. The rapid disappearance of the buffalo after 1870 forced dramatic changes to Métis lifeways.',
   sources: 'Range data: Hornaday, William Temple. The Extermination of the American Bison. Washington, D.C.: Government Printing Office, 1889. Population estimates: [6] Isenberg (2000), [7] Lott, American Bison, [8] Ken Burns / PBS timeline, [9] Lott, [10] Roe (1951), [11] Hornaday (1888).',
   eras: [
    {
     name: 'Original Range',
     color: '#4CAF50',
     count: 1,
     description: 'Pre-contact buffalo distribution across the northern plains. This vast territory supported enormous herds and was the foundation of Plains Indigenous economies for millennia. Population estimates: 24-30 million buffalo in 1800 [6].',
     polygons: []
    },
    {
     name: '1870 Range',
     color: '#FF9800',
     count: 2,
     description: 'By 1870, commercial hunting and westward expansion had already reduced the range. The buffalo were still present but their territory was shrinking rapidly. This period coincides with Manitoba entry into Confederation. Population estimates: 5.5 million buffalo in 1870 [9], down from 20 million in 1850 [7] and 12-15 million in 1865 [8].',
     polygons: []
    },
    {
     name: '1889 Range',
     color: '#F44336',
     count: 6,
     description: 'By 1889, the buffalo were nearly extinct. Only scattered remnant herds survived in remote areas. This represents one of the most rapid ecological collapses in recorded history, devastating the Métis economy and way of life. Population estimates: 653 buffalo in 1889 [11], down from 395,000 in 1880 [10].',
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
 const layerMap = {
 waterways: waterwaysLayer,
 trails: cartTrailsLayer,
 locations: locationsLayer,
 buffalo: buffaloHerdsLayer,
 battles: battlesLayer
 };
 const paneMap = {
 waterways: 'overlay-pane-waterways',
 trails: 'overlay-pane-trails',
 locations: 'overlay-pane-locations',
 buffalo: 'overlay-pane-buffalo',
 battles: 'overlay-pane-battles'
 };

 if (isActive) {
 if (btn) btn.classList.add('active');
 if (layerName === 'waterways' && data) renderWaterways(data.waterways);
 if (layerName === 'trails' && data) renderCartTrails(data.cartTrails);
 if (layerName === 'locations' && data) renderLocations(data.locations);
 if (layerName === 'buffalo' && data) renderBuffaloHerds(data.buffaloHerds);
 if (layerName === 'battles' && data) renderBattles(data.battles);
// Fade in the layer using CSS transition
 const layer = layerMap[layerName];
 if (layer) {
  // Start invisible, then next frame CSS transition fades in
  layer.eachLayer(l => {
   if (l.getElement) {
    const el = l.getElement();
    if (el) el.style.opacity = '0';
   }
  });
  requestAnimationFrame(() => {
   layer.eachLayer(l => {
    if (l.getElement) {
     const el = l.getElement();
     if (el) el.style.opacity = '';
    }
   });
  });
 }
 console.log(`${layerName}: ON`);
} else {
 if (btn) btn.classList.remove('active');
 // Fade out via CSS transition, then remove from map
 const layer = layerMap[layerName];
 if (layer) {
  layer.eachLayer(l => {
   if (l.getElement) {
    const el = l.getElement();
    if (el) el.style.opacity = '0';
   }
  });
  setTimeout(() => {
   if (layerName === 'waterways' && waterwaysLayer) map.removeLayer(waterwaysLayer);
   if (layerName === 'trails' && cartTrailsLayer) map.removeLayer(cartTrailsLayer);
   if (layerName === 'locations' && locationsLayer) map.removeLayer(locationsLayer);
   if (layerName === 'buffalo' && buffaloHerdsLayer) map.removeLayer(buffaloHerdsLayer);
   if (layerName === 'battles' && battlesLayer) map.removeLayer(battlesLayer);
  }, 380);
 } else {
  if (layerName === 'waterways' && waterwaysLayer) map.removeLayer(waterwaysLayer);
  if (layerName === 'trails' && cartTrailsLayer) map.removeLayer(cartTrailsLayer);
  if (layerName === 'locations' && locationsLayer) map.removeLayer(locationsLayer);
  if (layerName === 'buffalo' && buffaloHerdsLayer) map.removeLayer(buffaloHerdsLayer);
  if (layerName === 'battles' && battlesLayer) map.removeLayer(battlesLayer);
 }
 console.log(`${layerName}: OFF`);
 }
 }

// Layer buttons - toggle layer on/off
const layerBtns = document.querySelectorAll('.layer-btn');
layerBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const layer = btn.dataset.layer;
    toggleLayer(layer);
  });
});

// Info buttons - open layer info panel
const infoBtns = document.querySelectorAll('.info-btn');
infoBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent triggering layer toggle
    const layer = btn.dataset.layer;
    // If this layer's info is already showing, collapse it
    if (layerInfoPanel.classList.contains('visible') && layerInfoTitle.textContent === layerInfo[layer]?.title) {
      layerInfoPanel.classList.remove('visible');
    } else {
      // Close filter panel when opening info
      if (filterPanel) filterPanel.classList.remove('visible');
      if (filterToggleBtn) filterToggleBtn.classList.remove('active');
      showLayerInfo(layer);
    }
  });
});

// Show layer info panel
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

  // Buffalo population table
  if (layerName === 'buffalo') {
   content += '<div class="layer-info-section layer-info-features"><h4>Population Estimates</h4>';
   content += '<table class="buffalo-pop-table">';
   content += '<tr><th>Year</th><th>Population</th><th>Source</th></tr>';
   content += '<tr><td>1800</td><td>24-30 Million</td><td>[6] Isenberg (2000)</td></tr>';
   content += '<tr><td>1850</td><td>20 Million</td><td>[7] Lott, American Bison</td></tr>';
   content += '<tr><td>1865</td><td>12-15 Million</td><td>[8] Ken Burns / PBS</td></tr>';
   content += '<tr><td>1870</td><td>5.5 Million</td><td>[9] Lott</td></tr>';
   content += '<tr><td>1880</td><td>395,000</td><td>[10] Roe (1951)</td></tr>';
   content += '<tr><td>1889</td><td>653</td><td>[11] Hornaday (1888)</td></tr>';
   content += '</table></div>';
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
 statsPanel.classList.remove('visible');
}

// Store raw location data for re-filtering
let rawLocationsData = null;

// Places filter panel toggle
const filterToggleBtn = document.getElementById('filterToggle');
const filterPanel = document.getElementById('filterPanel');
if (filterToggleBtn && filterPanel) {
 filterToggleBtn.addEventListener('click', () => {
  const opening = !filterPanel.classList.contains('visible');
  if (opening) {
   layerInfoPanel.classList.remove('visible');
   statsPanel.classList.remove('visible');
  }
  filterPanel.classList.toggle('visible');
  filterToggleBtn.classList.toggle('active');
 });
}

// Filter pill click handlers
document.querySelectorAll('.filter-pill').forEach(pill => {
 pill.addEventListener('click', () => {
  const cat = pill.dataset.category;
  if (!cat) return;
  filterState[cat] = !filterState[cat];
  pill.classList.toggle('active');
  if (rawLocationsData) reapplyLocationFilter();
 });
});

// Re-apply filter to locations layer
function reapplyLocationFilter() {
 if (!rawLocationsData) return;
 // Rebuild location layer with only visible categories
 const visible = { features: [] };
 for (const feat of rawLocationsData.features) {
  const cat = getLocationCategory(feat.properties.community_type).cat;
  if (filterState[cat]) visible.features.push(feat);
 }
 // Count visible for footer
 let totalVisible = 0;
 for (const cat in filterState) {
  if (filterState[cat]) {
   const count = rawLocationsData.features.filter(f => getLocationCategory(f.properties.community_type).cat === cat).length;
   totalVisible += count;
  }
 }
 const footer = document.querySelector('.filter-footer');
 if (footer) footer.textContent = `Showing ${totalVisible} of ${rawLocationsData.features.length} locations`;
 renderLocations(visible);
}

// Render functions
 function renderWaterways(geojsonData) {
 if (waterwaysLayer) map.removeLayer(waterwaysLayer);
 
 waterwaysLayer = L.geoJSON(geojsonData, {
 style: { color: '#1E4D8C', weight: 3, opacity: 0.8 },
 onEachFeature: function(feature, layer) {
 layer.on({
 mouseover: function(e) {
 e.target.setStyle({ weight: 5, opacity: 1 });
 if (e.target.getElement) { const el = e.target.getElement(); if (el) el.style.filter = 'drop-shadow(0 0 6px rgba(30,77,140,0.6))'; }
 },
 mouseout: function(e) {
 waterwaysLayer.resetStyle(e.target);
 if (e.target.getElement) { const el = e.target.getElement(); if (el) el.style.filter = ''; }
 }
 });
 }
 }).addTo(map);
 
 console.log('Waterways rendered:', geojsonData.features.length, 'features');
 }

 function renderCartTrails(geojsonData) {
 if (cartTrailsLayer) map.removeLayer(cartTrailsLayer);
 
 cartTrailsLayer = L.geoJSON(geojsonData, {
 style: { color: '#B8312F', weight: 2, opacity: 0.8 },
 onEachFeature: function(feature, layer) {
 layer.on({
 mouseover: function(e) {
 e.target.setStyle({ weight: 4, opacity: 1 });
 if (e.target.getElement) { const el = e.target.getElement(); if (el) el.style.filter = 'drop-shadow(0 0 6px rgba(184,49,47,0.6))'; }
 },
 mouseout: function(e) {
 cartTrailsLayer.resetStyle(e.target);
 if (e.target.getElement) { const el = e.target.getElement(); if (el) el.style.filter = ''; }
 }
 });
 }
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

 // Update pill counts
 for (const feat of (rawLocationsData || geojsonData).features) {
  const cat = getLocationCategory(feat.properties.community_type).cat;
  // skip — counts computed below
 }
 for (const cat in filterState) {
  const count = (rawLocationsData || geojsonData).features.filter(f => getLocationCategory(f.properties.community_type).cat === cat).length;
  const el = document.getElementById('count-' + cat);
  if (el) el.textContent = count;
 }

 locationsLayer = L.geoJSON(geojsonData, {
 pointToLayer: function(feature, latlng) {
 const catInfo = getLocationCategory(feature.properties.community_type);
 return L.circleMarker(latlng, {
 radius: 6,
 fillColor: catInfo.color,
 color: '#fff',
 weight: 2,
 opacity: 1,
 fillOpacity: 0.9
 });
 },
 onEachFeature: function(feature, layer) {
 if (feature.properties) {
 layer.bindPopup(createLocationPopup(feature.properties));
 }
 layer.on({
 mouseover: function(e) {
 e.target.setStyle({ radius: 9, weight: 3, fillOpacity: 1 });
 if (e.target.getElement) { const el = e.target.getElement(); if (el) el.style.filter = 'drop-shadow(0 0 6px rgba(45,125,70,0.7))'; }
 },
 mouseout: function(e) {
 locationsLayer.resetStyle(e.target);
 if (e.target.getElement) { const el = e.target.getElement(); if (el) el.style.filter = ''; }
 }
 });
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
     let population = '';
     let source = '';
     
     if (name.includes('Original')) {
      eraDesc = 'Pre-contact range - vast territory supporting enormous herds';
      population = '<strong>Population:</strong> 24-30 million buffalo (1800) [6]';
      source = 'Isenberg (2000)';
     } else if (name.includes('1870')) {
      eraDesc = '1870 range - shrinking rapidly due to commercial hunting';
      population = '<strong>Population:</strong> 5.5 million buffalo (1870) [9]<br><small>Down from 20M (1850) [7] and 12-15M (1865) [8]</small>';
      source = 'Lott, PBS, Hornaday (1888)';
     } else if (name.includes('1889')) {
      eraDesc = '1889 range - remnant herds, nearly extinct';
      population = '<strong>Population:</strong> 653 buffalo (1889) [11]<br><small>Down from 395,000 (1880) [10]</small>';
      source = 'Roe (1951), Hornaday (1888)';
     }
     
     layer.bindPopup(
      '<div class="popup-header">' +
      '<div class="popup-title">' + name + '</div>' +
      '</div>' +
      '<div class="popup-body">' +
      '<p class="popup-description">' + eraDesc + '</p>' +
      '<p style="font-size: 12px; color: #333; margin: 8px 0;">' + population + '</p>' +
      '<p style="font-size: 11px; color: #666; font-style: italic;">' +
      '<strong>Source:</strong> ' + source +
      '</p>' +
      '</div>'
     );

     // Add on-map label
     var labelText = '';
     if (name.includes('Original')) labelText = 'Original Range';
     else if (name.includes('1870')) labelText = '1870 Range';
     else if (name.includes('1889')) labelText = '1889 Range';
     if (labelText) {
      layer.bindTooltip(labelText, {
       permanent: true,
       direction: 'center',
       className: 'buffalo-label'
      });
     }
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
 rawLocationsData = data.locations;
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
