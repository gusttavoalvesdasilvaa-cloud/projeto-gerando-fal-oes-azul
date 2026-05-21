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

const telemetry = {
  score: 78,
  ph: 6.8,
  robotsActive: 2
};

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

  if (loginTab || registerTab) {
    switchAuthTab('login');
  }

  alerts.forEach((alert) => alertsList.appendChild(createAlertCard(alert)));
  robots.forEach((robot) => robotsList.appendChild(createRobotCard(robot)));
  missions.forEach((mission) => missionsList.appendChild(createMissionCard(mission)));

  statusScore.textContent = `${telemetry.score}%`;
  statusPh.textContent = telemetry.ph.toFixed(1);
  statusRobots.textContent = telemetry.robotsActive;
  phValue.textContent = telemetry.ph.toFixed(1);

  const barWidth = Math.min(Math.max(((telemetry.ph - 4) / 6) * 100, 0), 100);
  phBar.style.width = `${barWidth}%`;

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

  mapFrame.querySelectorAll('.map-marker').forEach((marker) => {
    marker.addEventListener('click', () => {
      const place = marker.dataset.place;
      mapInfo.textContent = mapPlaceInfo[place] || 'Detalhes indisponíveis.';
    });
  });

  let currentCityIndex = 2;
  updateCityState(currentCityIndex);

  toggleCityState.addEventListener('click', () => {
    currentCityIndex = (currentCityIndex + 1) % cityStates.length;
    updateCityState(currentCityIndex);
  });

  function updateCityState(index) {
    const state = cityStates[index];
    cityTitle.textContent = state.title;
    citySummary.textContent = state.summary;
    cityFeature1.textContent = state.features[0];
    cityFeature2.textContent = state.features[1];
    cityFeature3.textContent = state.features[2];
  }
}

window.addEventListener('DOMContentLoaded', initializePanel);
