// Sistema de Explorador de Corpos Hídricos - V2 (Funcional)

const citiesDatabase = {
  'são paulo': { lat: -23.5505, lon: -46.6333 },
  'sp': { lat: -23.5505, lon: -46.6333 },
  'rio de janeiro': { lat: -22.9068, lon: -43.1729 },
  'rj': { lat: -22.9068, lon: -43.1729 },
  'belo horizonte': { lat: -19.9191, lon: -43.9386 },
  'bh': { lat: -19.9191, lon: -43.9386 },
  'brasília': { lat: -15.7942, lon: -47.8822 },
  'salvador': { lat: -12.9714, lon: -38.5014 },
  'recife': { lat: -8.0476, lon: -34.8770 },
  'fortaleza': { lat: -3.7319, lon: -38.5267 },
  'manaus': { lat: -3.1190, lon: -60.0217 }
};

const riverQualityMap = {
  'tietê': { status: 'Não consumível', color: '#ef4444', emoji: '🔴' },
  'pinheiros': { status: 'Não consumível', color: '#ef4444', emoji: '🔴' },
  'tamanduateí': { status: 'Consumível com cautela', color: '#f59e0b', emoji: '🟡' },
  'ipiranga': { status: 'Consumível com cautela', color: '#f59e0b', emoji: '🟡' },
  'guanabara': { status: 'Não consumível', color: '#ef4444', emoji: '🔴' },
  'paraíba': { status: 'Consumível com cautela', color: '#f59e0b', emoji: '🟡' },
  'velhas': { status: 'Consumível com cautela', color: '#f59e0b', emoji: '🟡' },
  'arrudas': { status: 'Não consumível', color: '#ef4444', emoji: '🔴' },
  'descoberto': { status: 'Água tratada', color: '#22c55e', emoji: '🟢' }
};

let globalMap = null;
let waterLayer = null;
let selectedWaterLayer = null;
let placeMarkers = [];
let waterVisible = false;
let currentSearchCoords = null;

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getWaterQuality(name, type) {
  const lower = ((name || '') + ' ' + (type || '')).toLowerCase();
  for (const key in riverQualityMap) {
    if (lower.includes(key)) return riverQualityMap[key];
  }
  if (lower.includes('represa') || lower.includes('reservoir') || lower.includes('lagoa') || lower.includes('lago')) {
    return { status: 'Consumível com cautela', color: '#3b82f6', emoji: '🔵' };
  }
  return { status: 'Consumível com cautela', color: '#f59e0b', emoji: '🟡' };
}

async function geocodeLocation(location) {
  try {
    const normalized = location.toLowerCase().trim();
    if (citiesDatabase[normalized]) {
      return { lat: citiesDatabase[normalized].lat, lon: citiesDatabase[normalized].lon, name: location };
    }
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`);
    if (!response.ok) throw new Error('Falha ao geocodificar');
    const data = await response.json();
    if (!data || !data.length) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), name: data[0].display_name || location };
  } catch (error) {
    console.error('Geocode error:', error);
    return null;
  }
}

function buildGeoJsonFeatures(elements) {
  return elements
    .map((element) => {
      if (!element.geometry || !element.geometry.length) return null;
      const coords = element.geometry.map((point) => [point.lon, point.lat]);
      const tags = element.tags || {};
      const name = tags.name || tags.waterway || tags.natural || tags.landuse || 'Corpo hídrico sem nome';
      const type = tags.waterway || tags.natural || tags.landuse || 'water';
      const isPolygon = tags.natural === 'water' || tags.landuse === 'reservoir' || tags.waterway === 'canal';
      const geometry = isPolygon && coords.length > 2 && coords[0][0] === coords[coords.length - 1][0] && coords[0][1] === coords[coords.length - 1][1]
        ? { type: 'Polygon', coordinates: [coords] }
        : { type: 'LineString', coordinates: coords };
      return {
        type: 'Feature',
        geometry,
        properties: {
          id: element.id,
          name,
          type,
          tags,
          osmType: element.type
        }
      };
    })
    .filter(Boolean);
}

async function fetchWaterBodiesNearby(lat, lon, radius = 15000) {
  try {
    const query = `[out:json][timeout:25];
      (
        way["natural"="water"](around:${radius},${lat},${lon});
        way["landuse"="reservoir"](around:${radius},${lat},${lon});
        way["waterway"~"river|stream|canal|drain|ditch"](around:${radius},${lat},${lon});
        relation["natural"="water"](around:${radius},${lat},${lon});
        relation["landuse"="reservoir"](around:${radius},${lat},${lon});
        relation["waterway"~"river|stream|canal|drain|ditch"](around:${radius},${lat},${lon});
      );
      out body geom;`;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
    });
    if (!response.ok) throw new Error('Overpass API indisponível');
    const data = await response.json();
    if (!data.elements) return [];
    return buildGeoJsonFeatures(data.elements);
  } catch (error) {
    console.error('Overpass search failed:', error);
    return [];
  }
}

function clearSelectedWaterLayer() {
  if (selectedWaterLayer && globalMap && globalMap.hasLayer && globalMap.hasLayer(selectedWaterLayer)) {
    globalMap.removeLayer(selectedWaterLayer);
  }
  selectedWaterLayer = null;
}

function clearWaterData() {
  clearSelectedWaterLayer();
  if (waterLayer && globalMap && globalMap.hasLayer && globalMap.hasLayer(waterLayer)) {
    globalMap.removeLayer(waterLayer);
  }
  waterLayer = null;
  placeMarkers.forEach((marker) => marker.remove());
  placeMarkers = [];
}

async function loadWaterBodiesForCurrentLocation() {
  if (!currentSearchCoords) return;
  const { lat, lon, name } = currentSearchCoords;
  const features = await fetchWaterBodiesNearby(lat, lon);
  showWaterBodiesOnMap(features, lat, lon, name);
  renderResults(features, lat, lon, name);
}

function updateSearchLocation(lat, lon, locationName) {
  currentSearchCoords = { lat, lon, name: locationName };
  if (globalMap) {
    globalMap.setView([lat, lon], 12);
  }
}

function setStatusMessage(message, isError = false) {
  const status = document.getElementById('location-status');
  if (!status) return;
  status.style.display = 'block';
  status.style.background = isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(56, 189, 248, 0.1)';
  status.style.borderColor = isError ? 'rgba(239, 68, 68, 0.3)' : 'rgba(56, 189, 248, 0.3)';
  status.textContent = message;
}

function waterStyle(feature) {
  if (feature.geometry.type === 'Polygon') {
    return {
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 0.35,
      weight: 2
    };
  }
  return {
    color: '#0ea5e9',
    weight: 4,
    opacity: 0.8
  };
}

function showSelectedWaterBody(feature) {
  if (!globalMap || !feature) return;
  clearSelectedWaterLayer();

  selectedWaterLayer = L.geoJSON(feature, {
    style: waterStyle,
    onEachFeature
  }).addTo(globalMap);

  let bounds = null;
  selectedWaterLayer.eachLayer((layer) => {
    if (!bounds && layer.getBounds) {
      bounds = layer.getBounds();
    }
    if (layer.openPopup) {
      layer.openPopup();
    }
  });

  if (bounds && bounds.isValid()) {
    globalMap.fitBounds(bounds, { padding: [40, 40] });
  }
}

function onEachFeature(feature, layer) {
  const props = feature.properties || {};
  const tags = props.tags || {};
  const water = props.water || tags.water || 'Não informado';
  const waterway = props.waterway || tags.waterway || 'Não informado';
  const natural = props.natural || tags.natural || 'Não informado';
  const title = props.name || tags.name || water || waterway || natural || 'Corpo hídrico sem nome';

  const info = `
    <strong>${title}</strong><br>
    Água: ${water}<br>
    Waterway: ${waterway}<br>
    Natural: ${natural}
  `;

  layer.bindPopup(info);
  layer.bindTooltip(`<strong>${title}</strong><br>Água: ${water}<br>Waterway: ${waterway}`, {
    permanent: true,
    direction: 'center',
    className: 'water-label'
  });
}

function showWaterBodiesOnMap(features, lat, lon, locationName) {
  clearWaterData();
  clearSelectedWaterLayer();
  if (!globalMap) return;

  const center = L.circleMarker([lat, lon], {
    radius: 10,
    color: '#38bdf8',
    fillColor: '#38bdf8',
    fillOpacity: 0.95,
    weight: 2
  }).addTo(globalMap).bindPopup(`<strong>${locationName}</strong><br>Local pesquisado`);
  center.bindTooltip(`<strong>Sua Localização</strong>`, {
    permanent: true,
    direction: 'top',
    className: 'location-label'
  });
  placeMarkers.push(center);
  globalMap.setView([lat, lon], 12);
}

function renderResults(features, lat, lon, locationName) {
  const list = document.getElementById('water-bodies-list');
  const mapTitle = document.getElementById('map-title');
  const mapTag = document.getElementById('map-tag');
  const status = document.getElementById('location-status');

  if (mapTitle) mapTitle.textContent = `Corpos Hídricos de ${locationName}`;
  if (mapTag) mapTag.textContent = `${features.length} resultado(s)`;
  if (status) {
    status.style.display = 'block';
    status.style.background = 'rgba(34, 197, 94, 0.1)';
    status.style.borderColor = 'rgba(34, 197, 94, 0.3)';
    status.textContent = `✅ ${features.length} corpo(s) hídrico(s) encontrado(s)`;
  }

  if (!list) return;
  if (!features.length) {
    list.innerHTML = '<p style="color:#94a3b8; text-align:center; padding:20px;">Nenhum corpo hídrico encontrado.</p>';
    return;
  }

  list.innerHTML = '';
  features.forEach((feature) => {
    const quality = getWaterQuality(feature.properties.name, feature.properties.type);
    const coord = feature.geometry.type === 'Polygon'
      ? feature.geometry.coordinates[0][0]
      : feature.geometry.coordinates[0];
    const distance = calculateDistance(lat, lon, coord[1], coord[0]);

    const item = document.createElement('div');
    item.style.cssText = `
      padding: 14px;
      border-radius: 12px;
      background: rgba(15, 23, 42, 0.85);
      border-left: 4px solid ${quality.color};
      margin-bottom: 10px;
      cursor: pointer;
      transition: background 0.2s ease;
    `;
    item.innerHTML = `
      <strong style="color:#e2e8f0; display:block; margin-bottom:4px;">${feature.properties.name}</strong>
      <span style="color:#94a3b8; font-size:0.9rem; display:block; margin-bottom:6px;">${feature.properties.type} • ${distance.toFixed(1)} km</span>
      <span style="color:${quality.color}; font-weight:bold;">${quality.emoji} ${quality.status}</span>
    `;
    item.addEventListener('click', () => {
      showSelectedWaterBody(feature);
    });
    item.addEventListener('mouseenter', () => item.style.background = 'rgba(56, 189, 248, 0.15)');
    item.addEventListener('mouseleave', () => item.style.background = 'rgba(15, 23, 42, 0.85)');
    list.appendChild(item);
  });
}

async function searchNearby(lat, lon, locationName) {
  updateSearchLocation(lat, lon, locationName);
  setStatusMessage(`Local definido: ${locationName}`);
  clearWaterData();
  if (waterVisible) {
    setStatusMessage(`🔍 Buscando corpos hídricos próximos a ${locationName}...`);
    await loadWaterBodiesForCurrentLocation();
  } else {
    setStatusMessage('⛔ Corpos hídricos ocultos. Marque a caixa para carregá-los.');
    const list = document.getElementById('water-bodies-list');
    if (list) {
      list.innerHTML = '<p style="color:#94a3b8; text-align:center; padding:20px 0;">Ative a visualização de corpos hídricos para vê-los no mapa.</p>';
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    globalMap = window.ecoWaterMap;
    if (!globalMap) {
      console.error('Mapa não inicializado');
      return;
    }

    const searchBtn = document.getElementById('search-location-btn');
    const locationInput = document.getElementById('location-input');
    const locateBtn = document.getElementById('locate-water-bodies');
    const status = document.getElementById('location-status');

    const doSearch = async () => {
      const location = locationInput.value.trim();
      if (!location) return;
      let coords = null;
      const coordMatch = location.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
      if (coordMatch) {
        coords = { lat: parseFloat(coordMatch[1]), lon: parseFloat(coordMatch[2]), name: `Coordenadas ${coordMatch[1]}, ${coordMatch[2]}` };
      } else {
        coords = await geocodeLocation(location);
      }
      if (!coords) {
        if (status) {
          status.style.display = 'block';
          status.style.background = 'rgba(239, 68, 68, 0.1)';
          status.textContent = `❌ Localização "${location}" não encontrada.`;
        }
        return;
      }
      await searchNearby(coords.lat, coords.lon, coords.name);
    };

    if (searchBtn) searchBtn.addEventListener('click', doSearch);
    if (locationInput) locationInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') doSearch(); });

    const toggleWaterBodiesCheckbox = document.getElementById('toggle-water-bodies');
    const toggleWaterBodies = async (enabled) => {
      waterVisible = enabled;
      if (!enabled) {
        clearWaterData();
        setStatusMessage('⛔ Corpos hídricos ocultos. Marque a caixa para carregá-los.');
        return;
      }
      setStatusMessage('✅ Corpos hídricos ativados.');
      if (currentSearchCoords) {
        await loadWaterBodiesForCurrentLocation();
      } else {
        setStatusMessage('Selecione um local ou use sua localização para carregar os corpos hídricos.');
      }
    };

    if (toggleWaterBodiesCheckbox) {
      toggleWaterBodiesCheckbox.addEventListener('change', async (event) => {
        await toggleWaterBodies(event.target.checked);
      });
    }

    globalMap.on('click', async (event) => {
      const { lat, lng } = event.latlng;
      if (locationInput) locationInput.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      const locationName = 'Local selecionado no mapa';
      updateSearchLocation(lat, lng, locationName);
      if (waterVisible) {
        await loadWaterBodiesForCurrentLocation();
      } else {
        setStatusMessage('Local atualizado. Marque a caixa para exibir corpos hídricos.');
      }
    });

    if (locateBtn) {
      locateBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
          if (status) {
            status.style.display = 'block';
            status.style.background = 'rgba(239, 68, 68, 0.1)';
            status.textContent = '❌ Geolocalização não suportada.';
          }
          return;
        }
        if (status) {
          status.style.display = 'block';
          status.style.background = 'rgba(56, 189, 248, 0.1)';
          status.textContent = '📍 Obtendo localização...';
        }
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          if (locationInput) locationInput.value = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          await searchNearby(latitude, longitude, 'Sua localização atual');
        }, (error) => {
          if (status) {
            status.style.display = 'block';
            status.style.background = 'rgba(239, 68, 68, 0.1)';
            status.textContent = `❌ ${error.message}`;
          }
        });
      });
    }
  }, 500);
});
