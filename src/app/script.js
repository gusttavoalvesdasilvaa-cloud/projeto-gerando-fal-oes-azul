const alerts = [
  {
    title: 'Atenção: rio da Zona Norte contaminado',
    description: 'Alto nível de metais pesados detectado. Risco de morte de peixes e doenças na população local.',
    type: 'danger',
    icon: '⚠️'
  },
  {
    title: 'pH perigoso no afluente central',
    description: 'Nível ácido abaixo de 6,0. A água exige neutralização urgente para proteger o ecossistema.',
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
  {
    title: 'Guardar água da chuva',
    status: 'Em andamento',
    reward: '50 pts ecológicos',
    description: 'Usar para lavar carros, calçadas ou quintais.'
  },
  {
    title: 'Patrulha das torneiras',
    status: 'Pendente',
    reward: '30 pts ecológicos',
    description: 'Checar e consertar torneiras pingando na casa.'
  },
  {
    title: 'Banho focado de 5 minutos',
    status: 'Novo',
    reward: '40 pts ecológicos',
    description: 'Fechar o registro do chuveiro ao se ensaboar.'
  }
];

const mapPlaceInfo = {
  'Zona Norte': 'Área com água contaminada e risco elevado. Ação imediata ajuda a evitar doenças e proteger a fauna.',
  'Afluente Azul': 'Região com água potável e estações de tratamento próximas. Bom foco para expansão de redes sustentáveis.',
  'Estação Sul': 'Local com saneamento básico em funcionamento e monitoramento ativo. Ótimo ponto para educação ambiental.',
  'Parque Oeste': 'Região sustentável com áreas verdes e água tratável. Exemplo de eficiência no tratamento local.'
};

const cityStates = [
  {
    title: 'Cidade Sustentável',
    summary: 'Água limpa, árvores saudáveis e vida aquática equilibrada. Cidades com tratamento e saneamento eficazes.',
    features: ['Água limpa', 'Árvores saudáveis', 'Vida selvagem equilibrada']
  },
  {
    title: 'Transição Ambiental',
    summary: 'Regiões em progresso com rios sendo limpos e saneamento sendo instalado. O progresso está visível.',
    features: ['Poluição em queda', 'Saneamento em expansão', 'Corrida por água potável']
  },
  {
    title: 'Cidade em Melhoria',
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

const cidadesSustentaveis = [
  { nome: 'Curitiba', pontos: 98 },
  { nome: 'Florianópolis', pontos: 96 },
  { nome: 'Campinas', pontos: 94 },
  { nome: 'Maringá', pontos: 92 },
  { nome: 'São Paulo', pontos: 91 },
  { nome: 'Porto Alegre', pontos: 90 },
  { nome: 'Belo Horizonte', pontos: 89 },
  { nome: 'Brasília', pontos: 88 },
  { nome: 'Recife', pontos: 87 },
  { nome: 'Salvador', pontos: 86 },
  { nome: 'Manaus', pontos: 85 },
  { nome: 'Fortaleza', pontos: 84 },
  { nome: 'Natal', pontos: 83 },
  { nome: 'Vitória', pontos: 82 },
  { nome: 'João Pessoa', pontos: 81 },
  { nome: 'Ribeirão Preto', pontos: 80 },
  { nome: 'Joinville', pontos: 79 },
  { nome: 'Londrina', pontos: 78 },
  { nome: 'Campo Grande', pontos: 77 },
  { nome: 'São José dos Campos', pontos: 76 }
];

const bairrosSustentaveis = [
  { nome: 'Centro', pontos: 97 },
  { nome: 'Jardim Europa', pontos: 95 },
  { nome: 'Vila Olímpia', pontos: 94 },
  { nome: 'Moema', pontos: 92 },
  { nome: 'Tatuapé', pontos: 91 },
  { nome: 'Pinheiros', pontos: 90 },
  { nome: 'Itaim Bibi', pontos: 89 },
  { nome: 'Liberdade', pontos: 88 },
  { nome: 'Parque das Nações', pontos: 87 },
  { nome: 'Santa Cecília', pontos: 86 },
  { nome: 'Morro da Saúde', pontos: 85 },
  { nome: 'Vila Mariana', pontos: 84 },
  { nome: 'Jardim Botânico', pontos: 83 },
  { nome: 'Santo Antônio', pontos: 82 },
  { nome: 'Vila Nova', pontos: 81 },
  { nome: 'Cidade Alta', pontos: 80 },
  { nome: 'Bosque dos Ipês', pontos: 79 },
  { nome: 'Praia da Costa', pontos: 78 },
  { nome: 'Jardim das Palmeiras', pontos: 77 },
  { nome: 'Parque Industrial', pontos: 76 }
];

const evolucoesAmbientais = [
  { nome: 'Itaquaquecetuba', crescimento: '+15%' },
  { nome: 'Suzano', crescimento: '+12%' },
  { nome: 'Mogi das Cruzes', crescimento: '+10%' },
  { nome: 'Arujá', crescimento: '+9%' },
  { nome: 'Poá', crescimento: '+8%' }
];

// Dados de exemplo para evolução de um rio de Itaquaquecetuba
const sampleRiver = {
  name: 'Rio Itaquá',
  neighborhood: 'Jardim São João',
  evolution: [
    { year: 2018, status: 'Alto nível de poluição e acúmulo de lixo nas margens' },
    { year: 2020, status: 'Início de programa municipal de limpeza e monitoramento' },
    { year: 2022, status: 'Instalação de pontos de coleta e pequenas estações de tratamento' },
    { year: 2024, status: 'Melhora visível na água; maior biodiversidade observada' }
  ]
};

const telemetry = {
  score: 78,
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
  const statusScore = document.getElementById('status-score');
  const statusRobots = document.getElementById('status-robots');

  if (statusScore) {
    statusScore.textContent = `${telemetry.score}%`;
  }
  if (statusRobots) {
    statusRobots.textContent = telemetry.robotsActive;
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

function renderRankingList(containerId, items, formatter) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  items.forEach((item, index) => {
    const entry = document.createElement('div');
    entry.className = 'ranking-item';
    entry.innerHTML = formatter(item, index + 1);
    container.appendChild(entry);
  });
}

function loadRankings() {
  renderRankingList('lista-cidades', cidadesSustentaveis, (item, position) => `
    <strong>${position}º</strong> ${item.nome} — ${item.pontos} pontos
  `);

  renderRankingList('lista-bairros', bairrosSustentaveis, (item, position) => `
    <strong>${position}º</strong> ${item.nome} — ${item.pontos} pontos
  `);

  renderRankingList('lista-evolucoes', evolucoesAmbientais, (item) => `
    📈 ${item.nome} — ${item.crescimento} de melhoria
  `);
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

function createMissionCard(mission, index) {
  const card = document.createElement('article');
  card.className = 'mission-card';
  card.dataset.index = index;
  const statusClass = mission.status === 'Pendente' ? 'status-pending' : mission.status === 'Em andamento' ? 'status-active' : 'status-new';

  card.innerHTML = `
    <div class="mission-card-header">
      <h3>${mission.title}</h3>
      <span class="status ${statusClass}">${mission.status}</span>
    </div>
    <p>${mission.description}</p>
    <div class="mission-meta">
      <span class="mission-reward">${mission.reward}</span>
      <button type="button" class="btn btn-secondary mission-action-button">Concluir</button>
    </div>
  `;

  return card;
}

function completeMission(card, mission) {
  if (!card || mission.status === 'Concluído') return;

  mission.status = 'Concluído';
  const statusLabel = card.querySelector('.status');
  const rewardLabel = card.querySelector('.mission-reward');
  const actionButton = card.querySelector('.mission-action-button');

  if (statusLabel) {
    statusLabel.textContent = 'Concluído';
    statusLabel.className = 'status status-completed';
  }
  if (rewardLabel) {
    rewardLabel.textContent = `${mission.reward} validados`;
  }
  if (actionButton) {
    actionButton.textContent = 'Concluído';
    actionButton.disabled = true;
    actionButton.classList.add('completed');
  }

  card.classList.add('mission-completed');
}

function initializePanel() {
  const alertsList = document.getElementById('alerts-list');
  const robotsList = document.getElementById('robots-list');
  const missionsList = document.getElementById('missions-list');
  const statusScore = document.getElementById('status-score');
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
  missions.forEach((mission, index) => {
    const card = createMissionCard(mission, index);
    missionsList.appendChild(card);

    card.addEventListener('click', () => completeMission(card, mission));
    const actionButton = card.querySelector('.mission-action-button');
    if (actionButton) {
      actionButton.addEventListener('click', (event) => {
        event.stopPropagation();
        completeMission(card, mission);
      });
    }
  });

  if (statusScore) {
    statusScore.textContent = `${telemetry.score}%`;
  }
  if (statusRobots) {
    statusRobots.textContent = telemetry.robotsActive;
  }

  if (mapFrame && mapInfo) {
    mapFrame.querySelectorAll('.map-marker').forEach((marker) => {
      marker.addEventListener('click', () => {
        const place = marker.dataset.place;
        mapInfo.textContent = mapPlaceInfo[place] || 'Detalhes indisponíveis.';
      });
    });
  }

  let currentCityIndex = 2;

  function updateCityState(index) {
    const state = cityStates[index];
    if (!state) return;

    if (cityTitle) cityTitle.textContent = state.title;
    if (citySummary) citySummary.textContent = state.summary;
    if (cityFeature1) cityFeature1.textContent = state.features[0];
    if (cityFeature2) cityFeature2.textContent = state.features[1];
    if (cityFeature3) cityFeature3.textContent = state.features[2];
  }

  if (cityTitle || citySummary || cityFeature1 || cityFeature2 || cityFeature3) {
    updateCityState(currentCityIndex);
  }

  if (toggleCityState) {
    toggleCityState.addEventListener('click', () => {
      currentCityIndex = (currentCityIndex + 1) % cityStates.length;
      updateCityState(currentCityIndex);
    });
  }

  // --- Fluxograma de saneamento: tornar etapas clicáveis e mostrar explicações educativas ---
  function createOrGetTreatmentExplanationContainer(panel) {
    let container = panel.querySelector('.treatment-explanation');
    if (!container) {
      container = document.createElement('div');
      container.className = 'treatment-explanation panel panel-glass';
      container.style.marginTop = '12px';
      container.innerHTML = `
        <h3 id="treatment-explanation-title">Detalhes da etapa</h3>
        <div id="treatment-explanation-body" class="field-hint">Clique em uma etapa do fluxograma para ver uma explicação educativa.</div>
      `;
      panel.appendChild(container);
    }
    return container;
  }

  const treatmentExplanations = {
    'coleta da agua': {
      title: 'Coleta da Água',
      what: 'Etapa responsável por captar água de rios, represas ou reservatórios.',
      how: 'A água é retirada e encaminhada para as estações de tratamento.',
      why: 'Garante o abastecimento da população.'
    },
    'tratamento da agua': {
      title: 'Tratamento da Água',
      what: 'Processo que remove impurezas da água.',
      how: 'São realizados vários procedimentos para torná-la adequada para consumo.',
      why: 'Protege a saúde da população.'
    },
    'tratamento quimico': {
      title: 'Tratamento Químico',
      what: 'Aplicação de produtos químicos para eliminar microrganismos e impurezas.',
      how: 'São utilizados produtos como cloro e flúor.',
      why: 'Garante água segura e própria para beber.'
    },
    'distribuicao da agua': {
      title: 'Distribuição da Água',
      what: 'Envio da água tratada para residências e estabelecimentos.',
      how: 'Através de tubulações e reservatórios.',
      why: 'Permite o abastecimento da população.'
    },
    'tratamento do esgoto': {
      title: 'Tratamento de Esgoto',
      what: 'Processo de limpeza da água utilizada pela população.',
      how: 'Remove poluentes antes da devolução ao meio ambiente.',
      why: 'Evita a contaminação de rios e protege o meio ambiente.'
    }
  };

  function normalizeKey(text) {
    if (!text) return '';
    return text
      .toString()
      .trim()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .toLowerCase();
  }

  function formatExplanation(stepTitle, data) {
    if (!data) {
      return `
        <p><strong>O que é a etapa:</strong> ${stepTitle}.</p>
        <p><strong>Como funciona:</strong> Esta etapa faz parte do processo geral de saneamento e envolve ações técnicas específicas para alcançar seu objetivo.</p>
        <p><strong>Sua importância para o saneamento:</strong> Contribui para o funcionamento seguro e eficiente do sistema de abastecimento e tratamento.</p>
      `;
    }
    return `
      <p><strong>O que é a etapa:</strong> ${data.what}</p>
      <p><strong>Como funciona:</strong> ${data.how}</p>
      <p><strong>Sua importância para o saneamento:</strong> ${data.why}</p>
    `;
  }

  function setupTreatmentFlowInteractions() {
    const saneamentoSection = document.getElementById('saneamento');
    if (!saneamentoSection) return;
    const panel = saneamentoSection.querySelector('.treatment-panel') || saneamentoSection.querySelector('.panel');
    if (!panel) return;
    const stepsList = panel.querySelector('.treatment-steps');
    if (!stepsList) return;

    const explanationContainer = createOrGetTreatmentExplanationContainer(panel);
    const explanationTitle = explanationContainer.querySelector('#treatment-explanation-title');
    const explanationBody = explanationContainer.querySelector('#treatment-explanation-body');

    // Tornar cada item clicável e garantir IDs
    Array.from(stepsList.querySelectorAll('li')).forEach((li, index) => {
      li.style.cursor = 'pointer';
      // garantir ID único se não existir
      if (!li.id) {
        const strong = li.querySelector('strong');
        const base = strong ? strong.textContent.trim() : li.textContent.trim();
        const slug = normalizeKey(base).replace(/\s+/g, '-').slice(0, 60) || `step-${index}`;
        li.id = `treatment-step-${slug}`;
      }
      li.addEventListener('click', () => {
        const strong = li.querySelector('strong');
        const rawText = strong ? strong.textContent.trim() : li.textContent.trim();
        const key = normalizeKey(rawText);

        // map variants to canonical keys
        let lookupKey = key;
        if (key.includes('filtr') || key.includes('filtro')) {
          lookupKey = 'tratamento da agua';
        }
        if (key.includes('distribu') && !key.includes('potavel')) {
          lookupKey = 'distribuicao da agua';
        }

        const data = treatmentExplanations[lookupKey] || treatmentExplanations[key] || null;
        if (explanationTitle) explanationTitle.textContent = data ? data.title : `Etapa: ${rawText}`;
        if (explanationBody) explanationBody.innerHTML = formatExplanation(rawText, data);
        // scroll into view for accessibility
        explanationContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  }

  // inicializar interação do fluxo de saneamento
  setupTreatmentFlowInteractions();

  loadRankings();
  startTelemetryLoop();
}

window.addEventListener('DOMContentLoaded', initializePanel);
