const MISSION_STORAGE = 'ecowater-mission-progress';
const missionsData = [
  {
    id: 'limpar-rios',
    title: 'Limpar rios contaminados',
    description: 'Remova resíduos sólidos e materiais tóxicos das margens dos rios.',
    impact: 'Reduz a poluição, protege peixes e contribui para a água saudável de comunidades locais.',
    points: 150
  },
  {
    id: 'instalar-saneamento',
    title: 'Instalar saneamento básico',
    description: 'Apoie a instalação de redes de água e esgoto em comunidades sem saneamento.',
    impact: 'Melhora o tratamento de esgoto e reduz a contaminação de rios e mananciais.',
    points: 200
  },
  {
    id: 'construir-estacao',
    title: 'Construir estação de tratamento',
    description: 'Ajude a criar estações locais de tratamento de água e esgoto.',
    impact: 'Permite água potável e diminui a carga de poluentes nos corpos d’água.',
    points: 250
  },
  {
    id: 'remover-lixo',
    title: 'Remover lixo tóxico',
    description: 'Coleta de lixo tóxico próximo a corpos d’água para proteger a fauna.',
    impact: 'Evita doenças, protege o ecossistema aquático e melhora a qualidade visual dos rios.',
    points: 180
  }
  ,
  {
    id: 'plantar-mata-ciliar',
    title: 'Plantar mata ciliar',
    description: 'Refloreste as margens com plantas nativas para filtrar água e reduzir erosão.',
    impact: 'Cria uma barreira natural que melhora a qualidade da água e a resistência das margens.',
    points: 170
  },
  {
    id: 'educar-comunidade',
    title: 'Educar a comunidade',
    description: 'Promova ações educativas sobre uso consciente da água e descarte correto de resíduos.',
    impact: 'Aumenta a conscientização e reduz ações que degradam a água local.',
    points: 120
  },
  {
    id: 'monitorar-ph',
    title: 'Monitorar pH do rio',
    description: 'Coleta dados de pH regularmente para detectar mudanças na qualidade da água.',
    impact: 'Permite respostas rápidas a alterações químicas e protege a saúde ambiental.',
    points: 130
  }
];

function getMissionProgress() {
  return JSON.parse(localStorage.getItem(MISSION_STORAGE) || '{}');
}

function saveMissionProgress(progress) {
  localStorage.setItem(MISSION_STORAGE, JSON.stringify(progress));
}

function hasCompletedMission(email, id) {
  const progress = getMissionProgress();
  return progress[email] ? progress[email].includes(id) : false;
}

function markMissionCompleted(email, id) {
  const progress = getMissionProgress();
  if (!progress[email]) {
    progress[email] = [];
  }
  if (!progress[email].includes(id)) {
    progress[email].push(id);
    saveMissionProgress(progress);
    return true;
  }
  return false;
}

function getCompletedCount(email) {
  const progress = getMissionProgress();
  return progress[email] ? progress[email].length : 0;
}

function getReportCount() {
  const reports = JSON.parse(localStorage.getItem('eco-reports') || '[]');
  return Array.isArray(reports) ? reports.length : 0;
}

function calculateImpactEstimate(missionsCompleted, reportsCount) {
  const impactScore = missionsCompleted * 10 + reportsCount * 5;
  return `${impactScore} pontos estimados de impacto`; 
}

function renderMissions(user) {
  const missionsList = document.getElementById('missions-list');
  missionsList.innerHTML = '';
  const completedCount = getCompletedCount(user.email);
  const reportsCount = getReportCount();
  const impactEstimate = calculateImpactEstimate(completedCount, reportsCount);

  document.getElementById('user-summary').innerHTML = `
    <strong>${user.name}</strong><br />
    Missões concluídas: <strong>${completedCount}</strong><br />
    Denúncias realizadas: <strong>${reportsCount}</strong><br />
    Impacto estimado: <strong>${impactEstimate}</strong>
  `;

  const messageArea = document.getElementById('mission-message');
  messageArea.textContent = 'Acompanhe suas ações ambientais reais abaixo.';
  messageArea.style.color = '#c7d2fe';

  missionsData.forEach((mission) => {
    const completed = hasCompletedMission(user.email, mission.id);
    const card = document.createElement('article');
    card.className = 'mission-card';
    card.innerHTML = `
      <h3>${mission.title}</h3>
      <p>${mission.description}</p>
      <div class="mission-meta">
        <span class="status ${completed ? 'status-active' : 'status-new'}">${completed ? 'Concluída' : 'Disponível'}</span>
        <button class="btn btn-small" ${completed ? 'disabled' : ''} data-id="${mission.id}">${completed ? 'Completa' : 'Completar'}</button>
      </div>
    `;

    const button = card.querySelector('button');
    button.addEventListener('click', () => {
      if (completed) return;
        markMissionCompleted(user.email, mission.id);
        updateUserPoints(user.email, mission.points);
        renderMissions(user);
        messageArea.innerHTML = `Missão concluída! Você ganhou ${mission.points} pontos.`;
        messageArea.style.color = '#86efac';
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  const missionsList = document.getElementById('missions-list');
  const messageArea = document.getElementById('mission-message');
  const summary = document.getElementById('user-summary');

  if (!user) {
    summary.textContent = 'Você precisa fazer login para registrar missões e ganhar pontos.';
    messageArea.textContent = 'Acesse sua conta ou crie uma nova para começar.';
    messageArea.style.color = '#fda4af';
    missionsList.innerHTML = '<p style="color:#94a3b8">Faça login em <a href="login.html" style="color:#38bdf8">Login</a> para acessar missões.</p>';
    return;
  }

  renderMissions(user);
});
