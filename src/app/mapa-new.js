window.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map').setView([-23.5318, -46.3750], 12);
  const waterBodyMarkers = {};
  let userMarker = null;
  let userLocation = null;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const points = [
    {
      id: 'rio-tiete',
      name: 'Rio Tietê - Itaquaquecetuba',
      coords: [-23.5265, -46.3786],
      status: 'Não consumível. Elevados níveis de turbidez, material orgânico e presença de esgoto doméstico detectados no monitoramento recente.',
      classification: 'Não consumível',
      color: '#ef4444',
      note: 'Dados de monitoramento CETESB / 2024 — uso restrito a fins ambientais.'
    },
    {
      id: 'afluente-baquirivu',
      name: 'Afluente do Rio Baquirivu',
      coords: [-23.5296, -46.3567],
      status: 'Consumível com cautela. Turbidez alta e indicadores de contaminação microbiológica acima do recomendado.',
      classification: 'Consumível com cautela',
      color: '#f59e0b',
      note: 'Monitoramento local aponta necessidade de tratamento prévio antes do consumo.'
    },
    {
      id: 'bacia-coleta-norte',
      name: 'Bacia de coleta Norte',
      coords: [-23.5420, -46.3694],
      status: 'Água tratada disponível em pontos filtrados. Perigo moderado em locais não protegidos.',
      classification: 'Água tratada',
      color: '#22c55e',
      note: 'Ponto de coleta com tratamento complementar recomendado para beberagem segura.'
    },
    {
      id: 'estacao-prevista',
      name: 'Estação de tratamento prevista',
      coords: [-23.5402, -46.3871],
      status: 'Local de futura estação de tratamento. Ainda não é indicada para consumo direto.',
      classification: 'Não consumível',
      color: '#ef4444',
      note: 'Planejamento municipal com base em estudos de qualidade de água para melhorar o abastecimento.'
    }
  ];

  const locationSelect = document.getElementById('location-select');
  const locationResult = document.getElementById('location-result');
  const locateBtn = document.getElementById('locate-water-bodies');
  const locationStatus = document.getElementById('location-status');
  const waterBodiesList = document.getElementById('water-bodies-list');
  const searchInput = document.getElementById('search-water-bodies');
  let allWaterBodies = [];

  // Renderizar pontos monitorados
  points.forEach((point) => {
    const marker = L.circleMarker(point.coords, {
      radius: 10,
      color: point.color,
      fillColor: point.color,
      fillOpacity: 0.7,
      weight: 2
    })
      .addTo(map)
      .bindPopup(`<strong>${point.name}</strong><br>${point.status}`);

    const option = document.createElement('option');
    option.value = point.id;
    option.textContent = point.name;
    locationSelect.appendChild(option);

    point.marker = marker;
  });

  function updateLocationDetails(point) {
    locationResult.innerHTML = `
      <strong>${point.name}</strong><br>
      <strong>Classificação:</strong> ${point.classification}<br>
      ${point.status}<br>
      <em>${point.note}</em>
    `;
  }

  locationSelect.addEventListener('change', (event) => {
    const selectedId = event.target.value;
    const point = points.find((item) => item.id === selectedId);

    if (!point) {
      locationResult.textContent = 'Selecione um local para ver se a água é consumível e conhecer o status real do monitoramento.';
      return;
    }

    map.flyTo(point.coords, 14, { duration: 0.8 });
    point.marker.openPopup();
    updateLocationDetails(point);
  });

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  }

  function getWaterBodyType(tags) {
    if (tags.waterway === 'river') return 'Rio';
    if (tags.waterway === 'stream' || tags.waterway === 'creek') return 'Córrego';
    if (tags.waterway === 'dam') return 'Represa';
    if (tags.natural === 'water') return 'Corpo d\'água';
    if (tags.water === 'lake') return 'Lago';
    return 'Corpo Hídrico';
  }

  function renderWaterBodies() {
    if (allWaterBodies.length === 0) {
      waterBodiesList.innerHTML = '<p style="color:#94a3b8; text-align:center; padding:20px 0;">Nenhum corpo hídrico encontrado no raio de 5km.</p>';
      return;
    }

    const filteredBodies = allWaterBodies.filter((body) => {
      const query = searchInput.value.toLowerCase();
      return body.name.toLowerCase().includes(query) || body.type.toLowerCase().includes(query);
    });

    if (filteredBodies.length === 0) {
      waterBodiesList.innerHTML = '<p style="color:#94a3b8; text-align:center; padding:20px 0;">Nenhum resultado encontrado.</p>';
      return;
    }

    waterBodiesList.innerHTML = '';
    filteredBodies.forEach((body) => {
      const item = document.createElement('div');
      item.className = 'water-body-item';
      item.innerHTML = `
        <div class="water-body-item-name">${body.name || 'Corpo Hídrico'}</div>
        <div class="water-body-item-type">${body.type}</div>
        <div class="water-body-item-distance">📍 ${body.distance} km</div>
      `;
      item.addEventListener('click', () => {
        map.flyTo([body.lat, body.lon], 15, { duration: 0.8 });
        if (body.marker) body.marker.openPopup();
      });
      waterBodiesList.appendChild(item);
    });
  }

  function queryOverpassAPI(lat, lon, radius = 5000) {
    const bbox = `(${lat - radius / 111000},${lon - radius / 111000},${lat + radius / 111000},${lon + radius / 111000})`;
    const query = `
      [bbox:${bbox}];
      (
        way["waterway"];
        way["natural"="water"];
        way["water"="lake"];
        node["waterway"];
        relation["waterway"];
      );
      out center;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        allWaterBodies = [];
        const processed = {};

        data.elements.forEach((element) => {
          const lat = element.center ? element.center.lat : element.lat;
          const lon = element.center ? element.center.lon : element.lon;
          const tags = element.tags || {};
          const name = tags.name || `${getWaterBodyType(tags)} (sem nome)`;
          const key = `${lat.toFixed(4)}${lon.toFixed(4)}`;

          if (lat && lon && !processed[key]) {
            processed[key] = true;
            const distance = calculateDistance(userLocation.latitude, userLocation.longitude, lat, lon);
            allWaterBodies.push({
              name,
              type: getWaterBodyType(tags),
              lat,
              lon,
              distance,
              tags
            });
          }
        });

        allWaterBodies.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

        allWaterBodies.forEach((body) => {
          const marker = L.circleMarker([body.lat, body.lon], {
            radius: 6,
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.6,
            weight: 1.5
          })
            .addTo(map)
            .bindPopup(`<strong>${body.name}</strong><br><strong>Tipo:</strong> ${body.type}<br><strong>Distância:</strong> ${body.distance} km`);
          body.marker = marker;
          waterBodyMarkers[`${body.lat}${body.lon}`] = marker;
        });

        renderWaterBodies();
        locationStatus.style.display = 'none';
      })
      .catch((error) => {
        console.error('Erro na busca de corpos hídricos:', error);
        waterBodiesList.innerHTML = '<p style="color:#ef4444; text-align:center; padding:20px 0;">Erro ao buscar corpos hídricos. Verifique sua conexão.</p>';
        locationStatus.style.display = 'none';
      });
  }

  locateBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      locationStatus.textContent = 'Geolocalização não suportada pelo seu navegador.';
      locationStatus.style.display = 'block';
      return;
    }

    locationStatus.textContent = 'Obtendo sua localização...';
    locationStatus.style.display = 'block';
    locateBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = position.coords;
        if (userMarker) map.removeLayer(userMarker);
        userMarker = L.marker([userLocation.latitude, userLocation.longitude], {
          icon: L.icon({
            iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2338bdf8"><circle cx="12" cy="12" r="8"/></svg>',
            iconSize: [24, 24]
          })
        })
          .addTo(map)
          .bindPopup('Sua localização');

        map.flyTo([userLocation.latitude, userLocation.longitude], 13, { duration: 0.8 });
        locationStatus.textContent = 'Buscando corpos hídricos próximos...';

        queryOverpassAPI(userLocation.latitude, userLocation.longitude);
      },
      (error) => {
        let errorMsg = 'Erro ao obter localização.';
        if (error.code === 1) errorMsg = 'Permissão negada. Ative a geolocalização nas configurações do navegador.';
        if (error.code === 2) errorMsg = 'Localização indisponível. Tente novamente mais tarde.';
        if (error.code === 3) errorMsg = 'Timeout ao obter localização.';
        locationStatus.textContent = errorMsg;
        locationStatus.style.display = 'block';
        locateBtn.disabled = false;
      }
    );
  });

  searchInput.addEventListener('input', renderWaterBodies);
});
