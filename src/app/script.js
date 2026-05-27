const alerts = [
  {
    title: 'Atenção: rio da Zona Norte contaminado',
    description: 'Alto nível de metais pesados detectado. Risco de morte de peixes e doenças na população local.',
    type: 'danger',
    icon: '⚠️'
  },
  {
    title: 'pH perigoso no afluente central',
    description: 'Nível ácido abaixo de 6,0. A água exige neutralização urgente para recuperação do ecossistema.',
    type: 'warning',
    icon: '🧪'
  },
  {
    title: 'Excesso de lixo na margem sul',
    description: 'Acúmulo de resíduos sólidos e plástico impactando a fauna aquática.',
    type: 'success',
    icon: '♻️'
  }
];

const robots = [
  { name: 'AquaBot 01', status: 'Online', removed: 132, efficiency: 92 },
  { name: 'Purify 08', status: 'Online', removed: 97, efficiency: 87 },
  { name: 'HydroSweep', status: 'Offline', removed: 0, efficiency: 0 }
];

const missions = [
  { title: 'Limpar rios contaminados', status: 'Em andamento', reward: '150 pts ecológicos' },
  { title: 'Instalar saneamento básico', status: 'Pendente', reward: '200 pts ecológicos' },
  { title: 'Construir estação de tratamento', status: 'Novo', reward: '250 pts ecológicos' }
];

const mapPlaceInfo = {
  'Zona Norte': 'Área com água contaminada e risco elevado. Necessária ação imediata para recuperar a fauna e evitar doenças.',
  'Afluente Azul': 'Região com água potável e estações de tratamento próximas. Bom foco para expansão de redes sustentáveis.',
  'Estação Sul': 'Local com saneamento básico em funcionamento e monitoramento ativo. Ótimo ponto para educação ambiental.',
  'Parque Oeste': 'Região sustentável com áreas verdes e água tratável. Modelo de recuperação para outras cidades.'
};

const cityStates = [
  {
    title: 'Cidade Sustentável',
    summary: 'Água limpa, árvores recuperadas e vida aquática saudável. Cidades com tratamento e saneamento eficazes.',
    features: ['Água limpa', 'Árvores saudáveis', 'Vida selvagem equilibrada']
  },
  {
    title: 'Transição Ambiental',
    summary: 'Regiões em recuperação com rios sendo limpos e saneamento sendo instalado. O progresso está visível.',
    features: ['Poluição em queda', 'Saneamento em expansão', 'Corrida por água potável']
  },
  {
    title: 'Cidade em Recuperação',
    summary: 'Água escura e lixo acumulado exigem ações urgentes de remoção de poluentes e tratamento de esgoto.',
    features: ['Lixo acumulado', 'Água contaminada', 'Risco de saúde']
  }
];

const riverNetwork = [
  {
    name: 'Trecho A',
    state: 'São Paulo',
    lat: -23.705,
    lon: -46.693,
    quality: 86,
    category: 'Água potável',
    image: ''
  },
  {
    name: 'Trecho B',
    state: 'Minas Gerais',
    lat: -19.933,
    lon: -43.938,
    quality: 72,
    category: 'Área sustentável',
    image: ''
  },
  {
    name: 'Trecho C',
    state: 'Espírito Santo',
    lat: -19.817,
    lon: -40.347,
    quality: 48,
    category: 'Risco médio',
    image: ''
  },
  {
    name: 'Trecho D',
    state: 'Goiás',
    lat: -16.678,
    lon: -49.253,
    quality: 64,
    category: 'Área sustentável',
    image: ''
  }
];

const riverImageFallbacks = {
  'São Paulo': 'https://images.unsplash.com/photo-1482861824012-2b5f2eb498d9?auto=format&fit=crop&w=900&q=80',
  'Minas Gerais': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=900&q=80',
  'Espírito Santo': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  'Goiás': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
  default: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80'
};

function getRiverImageUrl(river, city) {
  if (river && typeof river.image === 'string' && river.image.trim()) {
    return river.image;
  }
  // try Unsplash dynamic search by city then state
  const locationKey = city || (river && river.state) || '';
  if (locationKey) {
    // Use source.unsplash which returns a redirect to a relevant image
    return `https://source.unsplash.com/900x600/?river,${encodeURIComponent(locationKey)}`;
  }
  return riverImageFallbacks.default;
}

async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Reverse geocode failed');
    const data = await res.json();
    const addr = data.address || {};
    const city = addr.city || addr.town || addr.village || addr.hamlet || addr.county || '';
    const state = addr.state || addr.region || '';
    console.log('Reverse geocode result:', { city, state, raw: data });
    return { city, state };
  } catch (err) {
    console.warn('Reverse geocode error', err);
    return { city: '', state: '' };
  }
}

const sustainabilityRanking = {
  cleanStates: ['São Paulo', 'Minas Gerais', 'Goiás', 'Espírito Santo'],
  pollutedRivers: ['Trecho C', 'Rio Pinheiros', 'Rio Doce', 'Rio Amazonas'],
  protectors: ['Projeto Azul', 'Instituto Águas Claras', 'Comunidade Guardiões do Rio'],
  improvements: ['Recuperação de nascentes', 'Travessias de resíduos reduzidas', 'Monitoramento de pH em tempo real', 'Proteção de matas ciliares']
};

const telemetry = {
  score: 78,
  ph: 6.8,
  robotsActive: 2
};

let savedPosition = null;
let currentRiver = null;
let lastLocationInfo = {};

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 6371 * c;
}

function getNearestRiver(coords) {
  return riverNetwork.reduce((closest, river) => {
    const distance = getDistanceKm(coords.latitude, coords.longitude, river.lat, river.lon);
    return distance < closest.distance ? { river, distance } : closest;
  }, { river: riverNetwork[0], distance: Infinity });
}

function classifyImpact(quality) {
  if (quality >= 80) {
    return { label: 'Água potável', theme: 'success', message: 'Trecho muito saudável e seguro para consumo.' };
  }
  if (quality >= 55) {
    return { label: 'Área sustentável', theme: 'cyan', message: 'Ecossistema equilibrado, com ações positivas em andamento.' };
  }
  if (quality >= 40) {
    return { label: 'Risco médio', theme: 'warning', message: 'Atenção: contaminação moderada. Ações são necessárias.' };
  }
  return { label: 'Água contaminada', theme: 'danger', message: 'Água imprópria. Limpeza urgente requerida.' };
}

function formatDistance(value) {
  return `${value.toFixed(1)} km`; 
}

async function updateLocationPanel(position) {
  savedPosition = position;
  const coords = position.coords;
  const nearest = getNearestRiver(coords);
  currentRiver = { ...nearest.river };
  console.log('Nearest region determined:', nearest);
  const loc = await reverseGeocode(coords.latitude, coords.longitude);
  lastLocationInfo = loc || {};
  refreshTelemetry(currentRiver, nearest.distance, lastLocationInfo);
  const locationDetails = document.getElementById('location-details');
  if (locationDetails) {
    locationDetails.classList.remove('hidden');
  }
}

function showLocationError(message) {
  const locationDetails = document.getElementById('location-details');
  const statusText = document.getElementById('nearest-river-status');
  if (locationDetails) {
    locationDetails.classList.remove('hidden');
  }
  if (statusText) {
    statusText.textContent = message;
  }
}

function refreshTelemetry(river, distanceKm, locationInfo = {}) {
  telemetry.score = Math.round(river.quality);
  telemetry.ph = parseFloat((6.2 + ((telemetry.score - 30) / 65) * 3.2).toFixed(1));
  telemetry.robotsActive = Math.max(1, 2 + Math.round((Math.random() - 0.4) * 1));

  const nearestName = document.getElementById('nearest-river-name');
  const nearestDistance = document.getElementById('nearest-river-distance');
  const nearestStatus = document.getElementById('nearest-river-status');
  const riverImage = document.getElementById('riverImage');
  const riverClass = document.getElementById('nearest-river-class');
  const impactLine = document.getElementById('environmental-impact');
  const classification = classifyImpact(telemetry.score);

  const cityName = locationInfo.city || '';
  const stateName = locationInfo.state || river.state || '';
  const displayLabel = cityName ? `${cityName}, ${stateName}` : `${stateName}`;
  if (nearestName) {
    nearestName.textContent = `${river.name} — ${displayLabel}`;
  }
  if (nearestDistance) {
    nearestDistance.textContent = formatDistance(distanceKm);
  }
  if (riverImage) {
    const imageUrl = getRiverImageUrl(river, cityName || stateName);
    riverImage.alt = `Imagem do trecho próximo a ${displayLabel}`;
    // Ensure src is a non-empty string
    try {
      if (!imageUrl || typeof imageUrl !== 'string') throw new Error('Invalid image URL');
      console.log('Setting river image to', imageUrl);
      riverImage.onload = () => console.log('riverImage loaded successfully');
      riverImage.onerror = () => {
        console.warn('riverImage failed to load, applying fallback');
        riverImage.onerror = null;
        const fallback = riverImageFallbacks[stateName] || riverImageFallbacks.default;
        riverImage.src = fallback;
      };
      riverImage.src = imageUrl;
    } catch (e) {
      console.warn('Error setting river image', e);
      riverImage.src = riverImageFallbacks.default;
    }
  }
  if (riverClass) {
    riverClass.textContent = classification.label;
    riverClass.className = `status-badge ${classification.theme}`;
  }
  if (nearestStatus) {
    nearestStatus.textContent = classification.message;
  }
  if (impactLine) {
    impactLine.textContent = `Impacto ambiental: ${classification.message}`;
  }

  updateStatusDisplay();
  refreshAlerts(river, distanceKm);
  updateMapInfo(river, classification.label);
}

function updateStatusDisplay() {
  const phValue = document.getElementById('ph-value');
  const phBar = document.getElementById('ph-bar');
  const phStatus = document.getElementById('ph-status');
  const statusScore = document.getElementById('status-score');
  const statusPh = document.getElementById('status-ph');
  const statusRobots = document.getElementById('status-robots');

  if (statusScore) {
    statusScore.textContent = `${telemetry.score}%`;
  }
  if (statusPh) {
    statusPh.textContent = telemetry.ph.toFixed(1);
  }
  if (statusRobots) {
    statusRobots.textContent = telemetry.robotsActive;
  }
  if (phValue) {
    phValue.textContent = telemetry.ph.toFixed(1);
  }
  if (phBar) {
    const barWidth = Math.min(Math.max(((telemetry.ph - 4) / 6) * 100, 0), 100);
    phBar.style.width = `${barWidth}%`;
  }
  if (phBar && phStatus) {
    if (telemetry.ph <= 6) {
      phBar.style.background = '#f97316';
      phStatus.textContent = 'Água perigosa';
    } else if (telemetry.ph < 7.2) {
      phBar.style.background = '#fbbf24';
      phStatus.textContent = 'Água em atenção';
    } else {
      phBar.style.background = '#22c55e';
      phStatus.textContent = 'Água saudável';
    }
  }
}

function refreshAlerts(river, distanceKm) {
  const alertsList = document.getElementById('alerts-list');
  if (!alertsList) return;
  alertsList.innerHTML = '';

  const dynamicAlerts = [
    {
      title: `Atualização em tempo real - ${river.name}`,
      description: `Qualidade ${river.quality}% detectada a ${formatDistance(distanceKm)}. ${classifyImpact(river.quality).message}`,
      type: river.quality >= 55 ? 'success' : river.quality >= 40 ? 'warning' : 'danger',
      icon: river.quality >= 55 ? '✅' : river.quality >= 40 ? '⚠️' : '🚨'
    },
    {
      title: 'Área de risco ambiental',
      description: `Monitoramento indica ${classifyImpact(river.quality).label} no trecho do ${river.name}.`, 
      type: river.quality >= 55 ? 'success' : 'warning',
      icon: river.quality >= 55 ? '♻️' : '⚠️'
    }
  ];

  dynamicAlerts.forEach((alert) => alertsList.appendChild(createAlertCard(alert)));
}

function updateMapInfo(river, classificationLabel) {
  const mapInfo = document.getElementById('map-info');
  if (!mapInfo) return;
  mapInfo.textContent = `Risco em ${river.state}: ${classificationLabel} no ${river.name}. Áreas de risco são atualizadas com a sua localização.`;
}

function loadRankings() {
  const cleanStatesList = document.getElementById('clean-states-list');
  const pollutedRiversList = document.getElementById('polluted-rivers-list');
  const riverGuardiansList = document.getElementById('river-guardians-list');
  const improvementsList = document.getElementById('improvements-list');

  if (cleanStatesList) {
    cleanStatesList.innerHTML = sustainabilityRanking.cleanStates.map((state) => `<li>${state}</li>`).join('');
  }
  if (pollutedRiversList) {
    pollutedRiversList.innerHTML = sustainabilityRanking.pollutedRivers.map((river) => `<li>${river}</li>`).join('');
  }
  if (riverGuardiansList) {
    riverGuardiansList.innerHTML = sustainabilityRanking.protectors.map((guardian) => `<li>${guardian}</li>`).join('');
  }
  if (improvementsList) {
    improvementsList.innerHTML = sustainabilityRanking.improvements.map((item) => `<li>${item}</li>`).join('');
  }
}

function requestUserLocation() {
  if (!navigator.geolocation) {
    showLocationError('Geolocalização não é suportada no seu navegador.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    updateLocationPanel,
    (error) => {
      showLocationError('Permissão negada ou localização indisponível.');
      console.warn(error);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
  );
}

function startTelemetryLoop() {
  if (currentRiver && savedPosition) {
    refreshTelemetry(currentRiver, getNearestRiver(savedPosition.coords).distance, lastLocationInfo);
  }
  setInterval(() => {
    if (currentRiver && savedPosition) {
      const nearest = getNearestRiver(savedPosition.coords);
      currentRiver = { ...nearest.river, quality: currentRiver.quality };
      const variation = (Math.random() - 0.5) * 6;
      currentRiver.quality = Math.min(95, Math.max(25, currentRiver.quality + variation));
      refreshTelemetry(currentRiver, nearest.distance, lastLocationInfo);
    }
  }, 18000);
}

const users = JSON.parse(localStorage.getItem('ecowater-users')) || [];
let currentUser = null;

function saveUsers() {
  localStorage.setItem('ecowater-users', JSON.stringify(users));
}

function showAuthMessage(message, success = false) {
  const messageArea = document.getElementById('auth-message');
  if (!messageArea) return;
  messageArea.textContent = message;
  messageArea.style.color = success ? '#86efac' : '#fda4af';
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginTab = document.getElementById('login-tab');
  const registerTab = document.getElementById('register-tab');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    showAuthMessage('Preencha seus dados para entrar no sistema.');
  } else {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    loginTab.classList.remove('active');
    registerTab.classList.add('active');
    showAuthMessage('Use um email válido para criar sua conta ecológica.');
  }
}

function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  const user = users.find((entry) => entry.email === email && entry.password === password);

  if (user) {
    currentUser = user;
    showAuthMessage(`Bem-vindo, ${user.name}! Você está logado.`, true);
  } else {
    showAuthMessage('Usuário ou senha incorretos. Verifique e tente novamente.');
  }
}

function registerUser(event) {
  event.preventDefault();
  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim().toLowerCase();
  const password = document.getElementById('register-password').value;

  if (!name || !email || !password) {
    showAuthMessage('Todos os campos são obrigatórios.');
    return;
  }

  if (users.some((entry) => entry.email === email)) {
    showAuthMessage('Este email já está cadastrado. Faça login ou use outro email.');
    return;
  }

  const newUser = { name, email, password };
  users.push(newUser);
  saveUsers();
  currentUser = newUser;
  showAuthMessage(`Conta criada com sucesso! Bem-vindo, ${name}.`, true);
  switchAuthTab('login');
}

function getWaterDiagnosis(color, odor) {
  const badColors = ['escura', 'verde', 'marrom'];
  const hasOdor = odor === 'sim';
  const danger = hasOdor || badColors.includes(color);

  if (danger) {
    return {
      status: 'Não consumível',
      message: `A água está ${color} e com odor ${odor}. Não recomenda-se consumo.`
    };
  }

  return {
    status: 'Consumível com cautela',
    message: 'A água aparenta estar clara e sem odor. Recomendamos análise laboratorial antes do consumo definitivo.'
  };
}

function evaluateWaterState() {
  const color = document.getElementById('water-color').value;
  const odor = document.querySelector('input[name="water-odor"]:checked').value;
  const resultArea = document.getElementById('water-result');
  const diagnosis = getWaterDiagnosis(color, odor);

  resultArea.innerHTML = `
    <strong>${diagnosis.status}</strong><br />
    ${diagnosis.message}
  `;
  resultArea.style.borderColor = diagnosis.status.includes('Não') ? 'rgba(239, 68, 68, 0.28)' : 'rgba(34, 197, 94, 0.28)';
}

function createAlertCard(alert) {
  const card = document.createElement('article');
  card.className = `alert-card ${alert.type}`;

  card.innerHTML = `
    <div class="alert-icon">${alert.icon}</div>
    <h3>${alert.title}</h3>
    <p>${alert.description}</p>
  `;

  return card;
}

function createRobotCard(robot) {
  const card = document.createElement('article');
  card.className = 'robot-card';
  const statusClass = robot.status === 'Online' ? 'online' : 'offline';

  card.innerHTML = `
    <h3>${robot.name}</h3>
    <div class="robot-details">
      <span>Status: <strong>${robot.status}</strong></span>
      <span>Lixo removido: <strong>${robot.removed} kg</strong></span>
    </div>
    <div class="robot-status ${statusClass}">${robot.status}</div>
    <div>
      <div class="efficiency-bar">
        <div class="efficiency-bar-fill" style="width: ${robot.efficiency}%"></div>
      </div>
      <p style="margin-top: 10px; color: #cbd5e1;">Eficiência operacional: ${robot.efficiency}%</p>
    </div>
  `;

  return card;
}

function createMissionCard(mission) {
  const card = document.createElement('article');
  card.className = 'mission-card';
  const statusClass = mission.status === 'Pendente' ? 'status-pending' : mission.status === 'Em andamento' ? 'status-active' : 'status-new';

  card.innerHTML = `
    <h3>${mission.title}</h3>
    <p>${mission.reward}</p>
    <div class="mission-meta">
      <span class="status ${statusClass}">${mission.status}</span>
      <span>Recompensa disponível</span>
    </div>
  `;

  return card;
}

function initializePanel() {
  const alertsList = document.getElementById('alerts-list');
  const robotsList = document.getElementById('robots-list');
  const missionsList = document.getElementById('missions-list');
  const phValue = document.getElementById('ph-value');
  const phBar = document.getElementById('ph-bar');
  const phStatus = document.getElementById('ph-status');
  const statusScore = document.getElementById('status-score');
  const statusPh = document.getElementById('status-ph');
  const statusRobots = document.getElementById('status-robots');
  const mapInfo = document.getElementById('map-info');
  const mapFrame = document.getElementById('map-frame');
  const requestLocationButton = document.getElementById('request-location');
  const cityTitle = document.getElementById('city-title');
  const citySummary = document.getElementById('city-summary');
  const cityFeature1 = document.getElementById('city-feature-1');
  const cityFeature2 = document.getElementById('city-feature-2');
  const cityFeature3 = document.getElementById('city-feature-3');
  const toggleCityState = document.getElementById('toggle-city-state');
  const loginTab = document.getElementById('login-tab');
  const registerTab = document.getElementById('register-tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginAction = document.getElementById('login-action');
  const registerAction = document.getElementById('register-action');
  const waterSubmit = document.getElementById('water-submit');

  if (loginTab) {
    loginTab.addEventListener('click', () => switchAuthTab('login'));
  }
  if (registerTab) {
    registerTab.addEventListener('click', () => switchAuthTab('register'));
  }
  if (loginAction) {
    loginAction.addEventListener('click', () => {
      if (loginForm) {
        switchAuthTab('login');
        loginForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
  if (registerAction) {
    registerAction.addEventListener('click', () => {
      if (registerForm) {
        switchAuthTab('register');
        registerForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
  if (loginForm) {
    loginForm.addEventListener('submit', loginUser);
  }
  if (registerForm) {
    registerForm.addEventListener('submit', registerUser);
  }
  if (waterSubmit) {
    waterSubmit.addEventListener('click', evaluateWaterState);
  }
  if (requestLocationButton) {
    requestLocationButton.addEventListener('click', requestUserLocation);
  }

  if (loginTab || registerTab) {
    switchAuthTab('login');
  }

  alerts.forEach((alert) => alertsList.appendChild(createAlertCard(alert)));
  robots.forEach((robot) => robotsList.appendChild(createRobotCard(robot)));
  missions.forEach((mission) => missionsList.appendChild(createMissionCard(mission)));

  if (statusScore) {
    statusScore.textContent = `${telemetry.score}%`;
  }
  if (statusPh) {
    statusPh.textContent = telemetry.ph.toFixed(1);
  }
  if (statusRobots) {
    statusRobots.textContent = telemetry.robotsActive;
  }
  if (phValue) {
    phValue.textContent = telemetry.ph.toFixed(1);
  }

  const barWidth = Math.min(Math.max(((telemetry.ph - 4) / 6) * 100, 0), 100);
  if (phBar) {
    phBar.style.width = `${barWidth}%`;
  }
  if (phBar && phStatus) {
    if (telemetry.ph <= 6) {
      phBar.style.background = '#f97316';
      phStatus.textContent = 'Água perigosa';
    } else if (telemetry.ph < 7.2) {
      phBar.style.background = '#fbbf24';
      phStatus.textContent = 'Água em atenção';
    } else {
      phBar.style.background = '#22c55e';
      phStatus.textContent = 'Água saudável';
    }
  }

  if (mapFrame) {
    mapFrame.querySelectorAll('.map-marker').forEach((marker) => {
      marker.addEventListener('click', () => {
        const place = marker.dataset.place;
        if (mapInfo) {
          mapInfo.textContent = mapPlaceInfo[place] || 'Detalhes indisponíveis.';
        }
      });
    });
  }

  let currentCityIndex = 2;
  updateCityState(currentCityIndex);

  if (toggleCityState) {
    toggleCityState.addEventListener('click', () => {
      currentCityIndex = (currentCityIndex + 1) % cityStates.length;
      updateCityState(currentCityIndex);
    });
  }

  function updateCityState(index) {
    const state = cityStates[index];
    cityTitle.textContent = state.title;
    citySummary.textContent = state.summary;
    cityFeature1.textContent = state.features[0];
    cityFeature2.textContent = state.features[1];
    cityFeature3.textContent = state.features[2];
  }

  loadRankings();
  startTelemetryLoop();
}

window.addEventListener('DOMContentLoaded', initializePanel);
