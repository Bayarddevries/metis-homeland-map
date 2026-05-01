// Main JavaScript for Homeland Map V5
//
// Map tile configuration:
// Uses CartoDB Positron as primary (very permissive, almost never 403s),
// with OpenStreetMap as fallback. Also supports ESRI satellite fallback.
// Multiple fallback providers are arranged in priority order with a robust
// per-provider error tracking system that avoids one-shot-fallback bugs.

// ---- Tile Provider Configuration ----
// Listed in priority order. The tile layer falls forward through the list
// on errors. Each entry tracks its own failure count so a single bad tile
// doesn't block the entire chain.
const TILE_PROVIDERS = [
    {
        // CartoDB Positron (light) — very permissive, no auth required
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
        subdomains: 'abcd',
        name: 'CartoDB Light'
    },
    {
        // CartoDB Dark Matter (dark alt)
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
        subdomains: 'abcd',
        name: 'CartoDB Dark'
    },
    {
        // OpenStreetMap (primary) — most detailed, but may 403 from some browsers
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        subdomains: 'abc',
        name: 'OpenStreetMap'
    },
    {
        // OSM France CDN — same data, different CDN edge
        url: 'https://tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM France</a>',
        maxZoom: 20,
        subdomains: 'abc',
        name: 'OSM France'
    },
    {
        // ESRI World Topo — very stable, widely allowed
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; <a href="https://www.esri.com/">ESRI</a>',
        maxZoom: 18,
        subdomains: 'server',
        name: 'ESRI Topo'
    },
    {
        // ESRI World Imagery — satellite view as last resort
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; <a href="https://www.esri.com/">ESRI</a>',
        maxZoom: 18,
        subdomains: 'server',
        name: 'ESRI Satellite'
    }
];

// Map state
let map;
let currentTileLayer = null;
let currentProviderIndex = 0;

// Per-provider error tracking: maps provider index -> count of tile errors
const providerErrorCounts = {};

// Layer groups for data overlays
let waterwaysLayer;
let cartTrailsLayer;
let locationsLayer;

// Layer visibility state
const layerState = {
    waterways: true,
    cartTrails: true,
    locations: true
};

// Max tile errors before we switch providers (some tiles may fail individually
// due to load race — we're generous)
const MAX_TILE_ERRORS = 3;

// Tile-error debounce timeout (ms): prevents rapid-fire fallback from a burst
const FALLBACK_DEBOUNCE_MS = 2000;
let fallbackTimer = null;

/**
 * Initialize the map
 */
function initMap() {
    // Create map centered on the homeland region (Manitoba/Saskatchewan area)
    map = L.map('map', {
        center: [52.0, -98.0], // Centered roughly on the homeland
        zoom: 6,
        minZoom: 4,
        maxZoom: 18
    });

    // Add primary tile layer with error fallback
    addTileLayer(0);

    // Load data layers from embedded data
    loadDataLayers();
}

/**
 * Add a tile layer from the provider list, with automatic fallback on error.
 * Each provider is given MAX_TILE_ERRORS chances before we move to the next.
 * A debounce prevents rapid cascading from bursts of tile loads.
 * @param {number} providerIndex - Index into TILE_PROVIDERS array
 */
function addTileLayer(providerIndex) {
    if (providerIndex >= TILE_PROVIDERS.length) {
        console.warn('All tile providers failed. Map will have no background.');
        if (currentTileLayer) {
            map.removeLayer(currentTileLayer);
            currentTileLayer = null;
        }
        return;
    }

    currentProviderIndex = providerIndex;
    const provider = TILE_PROVIDERS[providerIndex];

    // Initialize error count for this provider if not set
    if (providerErrorCounts[providerIndex] === undefined) {
        providerErrorCounts[providerIndex] = 0;
    }

    // Remove previous tile layer if it exists
    if (currentTileLayer) {
        map.removeLayer(currentTileLayer);
    }

    console.log('Loading tiles from:', provider.name, '(' + provider.url.split('/')[2] + ')');

    currentTileLayer = L.tileLayer(provider.url, {
        attribution: provider.attribution,
        maxZoom: provider.maxZoom,
        subdomains: provider.subdomains || 'abc',
        detectRetina: true,
        errorTileUrl: '',
        crossOrigin: 'anonymous'
    });

    // Listen for tile loading errors and swap provider when threshold is hit
    currentTileLayer.on('tileerror', function(event) {
        // Bump error count for this provider
        providerErrorCounts[providerIndex] = (providerErrorCounts[providerIndex] || 0) + 1;
        const currentErrors = providerErrorCounts[providerIndex];

        // Debounce: only attempt fallback after a quiet period
        if (fallbackTimer) {
            clearTimeout(fallbackTimer);
        }

        fallbackTimer = setTimeout(function() {
            fallbackTimer = null;

            const errorsNow = providerErrorCounts[providerIndex] || 0;
            if (errorsNow >= MAX_TILE_ERRORS) {
                const nextIndex = providerIndex + 1;
                const nextName = nextIndex < TILE_PROVIDERS.length
                    ? TILE_PROVIDERS[nextIndex].name
                    : '(none — all exhausted)';
                console.warn(
                    provider.name + ' hit ' + errorsNow + ' tile errors. ' +
                    'Falling back to ' + nextName
                );
                addTileLayer(nextIndex);
            } else {
                const remaining = MAX_TILE_ERRORS - errorsNow;
                console.warn(
                    provider.name + ': ' + errorsNow + ' tile error(s) so far ' +
                    '(' + remaining + ' remaining before fallback)'
                );
            }
        }, FALLBACK_DEBOUNCE_MS);
    });

    currentTileLayer.addTo(map);
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

        // Render waterways, cart trails, locations
        renderWaterways(data.waterways);
        renderCartTrails(data.cartTrails);
        renderLocations(data.locations);

        // Add layer control AFTER all layers are loaded
        addLayerControl();

    } catch (error) {
        console.error('Error loading data layers:', error);
        alert('Error loading map data. Please check data.js is loaded.');
    }
}

/**
 * Render waterways as blue lines
 */
function renderWaterways(data) {
    waterwaysLayer = L.geoJSON(data, {
        style: {
            color: '#3498db',
            weight: 3,
            opacity: 0.7
        },
        onEachFeature: function(feature, layer) {
            if (feature.properties && feature.properties.name) {
                layer.bindPopup('<div class="popup-title">' + feature.properties.name + '</div>' +
                                '<div class="popup-description">Waterway</div>');
            }
        }
    });

    if (layerState.waterways) {
        waterwaysLayer.addTo(map);
    }
}

/**
 * Render cart trails as red/brown lines
 */
function renderCartTrails(data) {
    cartTrailsLayer = L.geoJSON(data, {
        style: {
            color: '#e74c3c',
            weight: 4,
            opacity: 0.8,
            dashArray: '10, 10'
        },
        onEachFeature: function(feature, layer) {
            if (feature.properties && feature.properties.name) {
                layer.bindPopup('<div class="popup-title">' + feature.properties.name + '</div>' +
                                '<div class="popup-description">Historic Cart Trail</div>');
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
        html: '<div style="background-color: #27ae60; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });

    locationsLayer = L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, { icon: locationIcon });
        },
        onEachFeature: function(feature, layer) {
            const props = feature.properties || {};
            let popupContent = '<div class="popup-title">' + (props.name || 'Unknown Location') + '</div>';

            if (props.description) {
                // Truncate long descriptions
                const desc = props.description.length > 200
                    ? props.description.substring(0, 200) + '...'
                    : props.description;
                popupContent += '<div class="popup-description">' + desc + '</div>';
            }

            let metaInfo = [];
            if (props.founded && props.founded !== '#N/A' && props.founded !== '') {
                metaInfo.push('Founded: ' + props.founded);
            }
            if (props.community_type) {
                metaInfo.push(props.community_type);
            }

            if (metaInfo.length > 0) {
                popupContent += '<div class="popup-meta">' + metaInfo.join(' | ') + '</div>';
            }

            layer.bindPopup(popupContent);
        }
    });

    if (layerState.locations) {
        locationsLayer.addTo(map);
    }
}

/**
 * Add layer control to toggle visibility
 */
function addLayerControl() {
    const overlays = {
        "Waterways": waterwaysLayer,
        "Cart Trails": cartTrailsLayer,
        "Locations": locationsLayer
    };

    L.control.layers(null, overlays, {
        position: 'topright',
        collapsed: false
    }).addTo(map);
}

/**
 * Toggle layer visibility
 */
function toggleLayer(layerName) {
    const layer = {
        'waterways': waterwaysLayer,
        'cartTrails': cartTrailsLayer,
        'locations': locationsLayer
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