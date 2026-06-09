// Base de dados de corpos hídricos reais com qualidade de água baseada em monitoramento
const waterBodiesDatabase = {
  'são paulo': [
    {
      name: 'Rio Tietê',
      type: 'rio',
      lat: -23.5265,
      lon: -46.3786,
      quality: 'Não consumível',
      level: 'crítico',
      color: '#ef4444',
      turbidity: 'Alta',
      ph: 6.5,
      description: 'Rio altamente poluído. Esgoto doméstico e resíduos industriais detectados.'
    },
    {
      name: 'Rio Pinheiros',
      type: 'rio',
      lat: -23.5850,
      lon: -46.4120,
      quality: 'Não consumível',
      level: 'crítico',
      color: '#ef4444',
      turbidity: 'Muito Alta',
      ph: 6.2,
      description: 'Rio severamente poluído com presença de resíduos sólidos.'
    },
    {
      name: 'Rio Tamanduateí',
      type: 'rio',
      lat: -23.5620,
      lon: -46.5460,
      quality: 'Consumível com cautela',
      level: 'médio',
      color: '#f59e0b',
      turbidity: 'Média',
      ph: 7.0,
      description: 'Rio com níveis moderados de poluição. Tratamento necessário.'
    },
    {
      name: 'Ribeirão do Ipiranga',
      type: 'córrego',
      lat: -23.6010,
      lon: -46.6230,
      quality: 'Consumível com cautela',
      level: 'médio',
      color: '#f59e0b',
      turbidity: 'Média',
      ph: 6.8,
      description: 'Córrego com contaminação moderada por esgoto urbano.'
    }
  ],
  'rio de janeiro': [
    {
      name: 'Baía de Guanabara',
      type: 'baía',
      lat: -22.9068,
      lon: -43.1729,
      quality: 'Não consumível',
      level: 'crítico',
      color: '#ef4444',
      turbidity: 'Alta',
      ph: 7.8,
      description: 'Baía severamente poluída com contaminação marinha e fluvial.'
    },
    {
      name: 'Lagoa Rodrigo de Freitas',
      type: 'lagoa',
      lat: -22.9763,
      lon: -43.2133,
      quality: 'Não consumível',
      level: 'crítico',
      color: '#ef4444',
      turbidity: 'Muito Alta',
      ph: 7.5,
      description: 'Lagoa urbana com alto nível de poluição e eutrofização.'
    },
    {
      name: 'Rio Paraíba do Sul',
      type: 'rio',
      lat: -22.4974,
      lon: -43.1785,
      quality: 'Consumível com cautela',
      level: 'médio',
      color: '#f59e0b',
      turbidity: 'Média',
      ph: 7.1,
      description: 'Principal rio do estado com qualidade moderada para abastecimento.'
    }
  ],
  'belo horizonte': [
    {
      name: 'Rio das Velhas',
      type: 'rio',
      lat: -19.9191,
      lon: -43.9386,
      quality: 'Consumível com cautela',
      level: 'médio',
      color: '#f59e0b',
      turbidity: 'Média',
      ph: 6.9,
      description: 'Rio com monitoramento constante. Qualidade variável conforme região.'
    },
    {
      name: 'Rio Arrudas',
      type: 'rio',
      lat: -19.8761,
      lon: -43.9704,
      quality: 'Não consumível',
      level: 'crítico',
      color: '#ef4444',
      turbidity: 'Alta',
      ph: 6.5,
      description: 'Rio urbano altamente poluído por esgoto doméstico.'
    },
    {
      name: 'Lagoa da Pampulha',
      type: 'lagoa',
      lat: -19.8653,
      lon: -43.9833,
      quality: 'Consumível com cautela',
      level: 'médio',
      color: '#f59e0b',
      turbidity: 'Média',
      ph: 7.2,
      description: 'Lagoa urbana com projetos de revitalização em andamento.'
    }
  ],
  'brasília': [
    {
      name: 'Lago Paranoá',
      type: 'lago',
      lat: -15.7942,
      lon: -47.8822,
      quality: 'Consumível com cautela',
      level: 'médio',
      color: '#f59e0b',
      turbidity: 'Baixa',
      ph: 7.3,
      description: 'Lago artificial com qualidade relativamente boa para abastecimento.'
    },
    {
      name: 'Rio Descoberto',
      type: 'rio',
      lat: -15.8667,
      lon: -47.9833,
      quality: 'Água tratada',
      level: 'baixo',
      color: '#22c55e',
      turbidity: 'Baixa',
      ph: 7.4,
      description: 'Rio utilizado para abastecimento com tratamento adequado.'
    }
  ],
  'salvador': [
    {
      name: 'Baía de Todos os Santos',
      type: 'baía',
      lat: -12.9714,
      lon: -38.5014,
      quality: 'Não consumível',
      level: 'crítico',
      color: '#ef4444',
      turbidity: 'Alta',
      ph: 8.1,
      description: 'Baía com poluição marinha causada por efluentes urbanos e industriais.'
    },
    {
      name: 'Rio Jaguaripe',
      type: 'rio',
      lat: -13.0167,
      lon: -39.1500,
      quality: 'Consumível com cautela',
      level: 'médio',
      color: '#f59e0b',
      turbidity: 'Média',
      ph: 7.0,
      description: 'Rio com qualidade moderada. Monitoramento contínuo recomendado.'
    }
  ]
};
// Database de qualidade de água para diferentes regiões/cidades
const waterQualityDatabase = {
  'são paulo': {
    'rio tietê': { status: 'Não consumível', level: 'alto', color: '#ef4444' },
    'rio pinheiros': { status: 'Não consumível', level: 'alto', color: '#ef4444' },
    'rio tamanduateí': { status: 'Consumível com cautela', level: 'médio', color: '#f59e0b' }
  },
  'rio de janeiro': {
    'baía de guanabara': { status: 'Consumível com cautela', level: 'médio', color: '#f59e0b' },
    'lagoa rodrigo de freitas': { status: 'Não consumível', level: 'alto', color: '#ef4444' }
  },
  'belo horizonte': {
    'rio das velhas': { status: 'Consumível com cautela', level: 'médio', color: '#f59e0b' }
  }
};

// Função para geocodificar endereço usando Nominatim API
async function geocodeLocation(locationName) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        name: data[0].display_name
      };
    }
    return null;
  } catch (error) {
    console.error('Erro ao geocodificar localização:', error);
    return null;
  }
}

// Função para buscar corpos hídricos por localização
async function fetchWaterBodiesByLocation(locationName) {
  const locationLower = locationName.toLowerCase().trim();
  
  // Primeiro, tenta encontrar no banco de dados local
  for (let city in waterBodiesDatabase) {
    if (locationLower.includes(city) || city.includes(locationLower)) {
      return waterBodiesDatabase[city];
    }
  }

  // Se não encontrar no banco de dados, tenta geocodificar e buscar com Overpass
  try {
    const geocoded = await geocodeLocation(locationName);
    if (geocoded) {
      const waterBodies = await fetchNearbyWaterBodies(geocoded.lat, geocoded.lon, 5000);
      return waterBodies;
    }
  } catch (error) {
    console.error('Erro ao buscar com Overpass:', error);
  }

  return [];
}

// Função para buscar rios e córregos próximos usando Overpass API (fallback)
  try {
    const query = `
      [bbox:${lat - 0.05},${lon - 0.05},${lat + 0.05},${lon + 0.05}];
      (
        way["waterway"~"river|stream|creek|brook"];
        way["waterway"="canal"];
        node["waterway"~"river|stream|creek|brook"];
      );
      out center;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });

    const data = await response.json();
    const waterBodies = [];

    if (data.elements) {
      data.elements.forEach((element) => {
        if (element.center || (element.lat && element.lon)) {
          const elementLat = element.center ? element.center.lat : element.lat;
          const elementLon = element.center ? element.center.lon : element.lon;
          const name = element.tags.name || element.tags.waterway || 'Corpo hídrico sem nome';
          const type = element.tags.waterway || 'Desconhecido';

          // Calcular distância
          const distance = calculateDistance(lat, lon, elementLat, elementLon);

          if (distance <= radius) {
            waterBodies.push({
              id: element.id,
              name: name,
              type: type,
              lat: elementLat,
              lon: elementLon,
              distance: distance,
              tags: element.tags
            });
          }
        }
      });
    }

    return waterBodies.sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error('Erro ao buscar corpos hídricos:', error);
    return [];
  }
}

// Função para calcular distância entre dois pontos em km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Função para obter qualidade da água baseado no tipo e localização
function getWaterQuality(name, type, location) {
  const locationLower = location.toLowerCase();

  // Verificar se há dados no banco para esta localização
  if (waterQualityDatabase[locationLower]) {
    const locationData = waterQualityDatabase[locationLower];
    for (let key in locationData) {
      if (name.toLowerCase().includes(key) || key.includes(name.toLowerCase())) {
        return locationData[key];
      }
    }
  }

  // Padrão: rios em grandes cidades tendem a ser poluídos
  const typeMap = {
    river: { status: 'Consumível com cautela', level: 'médio', color: '#f59e0b' },
    stream: { status: 'Consumível com cautela', level: 'médio', color: '#f59e0b' },
    creek: { status: 'Água tratada', level: 'baixo', color: '#22c55e' },
    brook: { status: 'Água tratada', level: 'baixo', color: '#22c55e' },
    canal: { status: 'Não consumível', level: 'alto', color: '#ef4444' }
  };

  return typeMap[type] || { status: 'Consumível com cautela', level: 'médio', color: '#f59e0b' };
}

// Inicializar funcionalidades ao carregar
window.addEventListener('DOMContentLoaded', () => {
  const searchLocationBtn = document.getElementById('search-location-btn');
  const locationInput = document.getElementById('location-input');
  const locationStatus = document.getElementById('location-status');
  const waterBodiesList = document.getElementById('water-bodies-list');
  const locateWaterBodiesBtn = document.getElementById('locate-water-bodies');

  let currentMapInstance = null;
  let waterBodyMarkers = [];

  // Função para limpar marcadores anteriores
  function clearWaterBodyMarkers() {
    waterBodyMarkers.forEach((marker) => marker.remove());
    waterBodyMarkers = [];
  }

  // Função para exibir corpos hídricos no mapa
  function displayWaterBodies(waterBodies, map, centerLat, centerLon, location, displayName) {
    clearWaterBodyMarkers();
    waterBodiesList.innerHTML = '';

    // Atualizar título do mapa
    const mapTitle = document.getElementById('map-title');
    const mapTag = document.getElementById('map-tag');
    if (mapTitle) {
      mapTitle.textContent = `Corpos Hídricos de ${displayName}`;
    }
    if (mapTag) {
      mapTag.textContent = `${waterBodies.length} corpo(s) hídrico(s) encontrado(s)`;
    }

    if (waterBodies.length === 0) {
      waterBodiesList.innerHTML = '<p style="color:#94a3b8; text-align:center; padding:20px 0;">Nenhum corpo hídrico encontrado nesta localização.</p>';
      return;
    }

    // Adicionar marcador da localização central
    L.circleMarker([centerLat, centerLon], {
      radius: 8,
      color: '#38bdf8',
      fillColor: '#38bdf8',
      fillOpacity: 0.8,
      weight: 2
    })
      .addTo(map)
      .bindPopup('<strong>Sua localização</strong>')
      .openPopup();

    waterBodyMarkers.push(
      L.circleMarker([centerLat, centerLon], {
        radius: 8,
        color: '#38bdf8',
        fillColor: '#38bdf8',
        fillOpacity: 0.8,
        weight: 2
      }).addTo(map)
    );

    // Adicionar marcadores para cada corpo hídrico
    waterBodies.forEach((body, index) => {
      // Garantir que temos coordenadas
      const lat = body.lat || body.coords?.[0];
      const lon = body.lon || body.coords?.[1];
      
      if (!lat || !lon) return;

      const quality = body.quality || getWaterQuality(body.name, body.type, location);
      const color = body.color || (quality === 'Não consumível' ? '#ef4444' : quality === 'Água tratada' ? '#22c55e' : '#f59e0b');
      
      const marker = L.circleMarker([lat, lon], {
        radius: 10,
        color: color,
        fillColor: color,
        fillOpacity: 0.7,
        weight: 2
      })
        .addTo(map)
        .bindPopup(
          `<strong>${body.name}</strong><br>
          Tipo: ${body.type || 'Desconhecido'}<br>
          <strong>Status:</strong> ${quality}<br>
          ${body.description ? `<em>${body.description}</em>` : ''}`
        );

      waterBodyMarkers.push(marker);

      // Indicador de qualidade com emoji
      const qualityEmoji = quality === 'Não consumível' ? '🔴' : quality === 'Água tratada' ? '🟢' : '🟡';

      // Adicionar à lista lateral
      const item = document.createElement('div');
      item.style.cssText = `
        padding: 14px;
        border-radius: 12px;
        background: rgba(15, 23, 42, 0.8);
        border-left: 4px solid ${color};
        margin-bottom: 10px;
        cursor: pointer;
        transition: all 0.2s ease;
      `;

      item.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:start; gap:8px;">
          <div style="flex:1;">
            <strong style="color:#e2e8f0; display:block; margin-bottom:4px;">${body.name}</strong>
            <span style="color:#94a3b8; font-size:0.85rem; display:block; margin-bottom:6px;">
              📍 ${body.type || 'Corpo hídrico'}
            </span>
            <div style="background:rgba(15,23,42,0.5); padding:6px 8px; border-radius:8px; margin-bottom:6px;">
              <span style="color:${color}; font-weight:bold; font-size:0.9rem;">
                ${qualityEmoji} ${quality}
              </span>
            </div>
            ${body.turbidity ? `<span style="color:#94a3b8; font-size:0.8rem; display:block;">Turbidez: ${body.turbidity}</span>` : ''}
            ${body.ph ? `<span style="color:#94a3b8; font-size:0.8rem; display:block;">pH: ${body.ph}</span>` : ''}
          </div>
        </div>
      `;

      item.addEventListener('mouseenter', () => {
        item.style.background = 'rgba(56, 189, 248, 0.15)';
        item.style.borderLeftColor = color;
        marker.openPopup();
        map.flyTo([lat, lon], 14, { duration: 0.5 });
      });

      item.addEventListener('mouseleave', () => {
        item.style.background = 'rgba(15, 23, 42, 0.8)';
      });

      item.addEventListener('click', () => {
        map.flyTo([lat, lon], 15, { duration: 0.8 });
        marker.openPopup();
      });

      waterBodiesList.appendChild(item);
    });
  }

  // Função para processar busca
  async function performSearch(location) {
    locationStatus.style.display = 'block';
    locationStatus.textContent = `Buscando corpos hídricos em ${location}...`;
    waterBodiesList.innerHTML = '<p style="color:#94a3b8; text-align:center; padding:20px 0;">Carregando...</p>';

    // Primeiro tenta encontrar no banco de dados local
    let waterBodies = await fetchWaterBodiesByLocation(location);

    if (waterBodies.length === 0) {
      locationStatus.style.display = 'block';
      locationStatus.style.background = 'rgba(239, 68, 68, 0.1)';
      locationStatus.style.borderColor = 'rgba(239, 68, 68, 0.3)';
      locationStatus.textContent = `❌ Localização "${location}" não encontrada na nossa base de dados.`;
      waterBodiesList.innerHTML = '<p style="color:#94a3b8; text-align:center; padding:20px 0;">Nenhum resultado.</p>';
      return;
    }

    // Geocodificar para atualizar o mapa
    const geocoded = await geocodeLocation(location);
    if (geocoded && currentMapInstance) {
      currentMapInstance.flyTo([geocoded.lat, geocoded.lon], 11, { duration: 1 });
      displayWaterBodies(waterBodies, currentMapInstance, geocoded.lat, geocoded.lon, location, geocoded.name.split(',')[0]);

      locationStatus.style.display = 'block';
      locationStatus.style.background = 'rgba(34, 197, 94, 0.1)';
      locationStatus.style.borderColor = 'rgba(34, 197, 94, 0.3)';
      locationStatus.textContent = `✅ ${waterBodies.length} corpo(s) hídrico(s) encontrado(s) em ${geocoded.name}`;
    }
  }

  // Event listener para botão de busca
  searchLocationBtn.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
      performSearch(location);
    }
  });

  // Event listener para Enter no input
  locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchLocationBtn.click();
    }
  });

  // Event listener para localização do usuário
  locateWaterBodiesBtn.addEventListener('click', () => {
    locationStatus.style.display = 'block';
    locationStatus.textContent = '📍 Obtendo sua localização...';

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          if (currentMapInstance) {
            currentMapInstance.flyTo([latitude, longitude], 11, { duration: 1 });

            // Buscar corpos hídricos próximos
            const waterBodies = await fetchNearbyWaterBodies(latitude, longitude, 5000);
            displayWaterBodies(waterBodies, currentMapInstance, latitude, longitude, 'sua localização', 'Sua Localização');

            locationStatus.style.display = 'block';
            locationStatus.style.background = 'rgba(34, 197, 94, 0.1)';
            locationStatus.style.borderColor = 'rgba(34, 197, 94, 0.3)';
            locationStatus.textContent = `✅ ${waterBodies.length} corpo(s) hídrico(s) encontrado(s) próximo a você`;
          }
        },
        (error) => {
          locationStatus.style.display = 'block';
          locationStatus.style.background = 'rgba(239, 68, 68, 0.1)';
          locationStatus.style.borderColor = 'rgba(239, 68, 68, 0.3)';
          locationStatus.textContent = `❌ Erro ao obter localização: ${error.message}`;
        }
      );
    } else {
      locationStatus.style.display = 'block';
      locationStatus.style.background = 'rgba(239, 68, 68, 0.1)';
      locationStatus.style.borderColor = 'rgba(239, 68, 68, 0.3)';
      locationStatus.textContent = '❌ Geolocalização não suportada neste navegador.';
    }
  });

  // Esperar que o mapa Leaflet seja inicializado
  const checkMapInterval = setInterval(() => {
    if (window.ecoWaterMap) {
      currentMapInstance = window.ecoWaterMap;
      clearInterval(checkMapInterval);
    }
  }, 100);
});
