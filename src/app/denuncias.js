const reportTypes = [
  'Vazamento de água',
  'Lixo nos rios',
  'Água escura/suja',
  'Casas sem saneamento',
  'Esgoto a céu aberto',
  'Mau cheiro',
  'Poluição da água'
];

const severityMap = {
  'Vazamento de água': 'grave',
  'Lixo nos rios': 'medium',
  'Água escura/suja': 'grave',
  'Casas sem saneamento': 'medium',
  'Esgoto a céu aberto': 'grave',
  'Mau cheiro': 'medium',
  'Poluição da água': 'grave'
};

const mapNodes = [
  { label: 'Margem do Rio', severity: 'grave', note: 'Ponto de esgoto e poluição visível.' },
  { label: 'Parque Verde', severity: 'medium', note: 'Lixo acumulado próximo à costa.' },
  { label: 'Área Central', severity: 'grave', note: 'Vazamento de água atingindo a rua.' },
  { label: 'Residencial Sul', severity: 'resolved', note: 'Caso acompanhado e em monitoramento.' }
];

let selectedRating = 0;
let selectedImageData = null;
let reports = JSON.parse(localStorage.getItem('eco-reports')) || [];

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function saveReports() {
  localStorage.setItem('eco-reports', JSON.stringify(reports));
}

function getSeverityLabel(type) {
  return severityMap[type] || 'medium';
}

function getStatusText(severity) {
  if (severity === 'grave') return 'Grave';
  if (severity === 'resolved') return 'Resolvido';
  return 'Médio';
}

function updateCounters() {
  const grave = reports.filter((item) => item.severity === 'grave').length;
  const medium = reports.filter((item) => item.severity === 'medium').length;
  const resolved = reports.filter((item) => item.severity === 'resolved').length;

  document.getElementById('status-grave').textContent = grave;
  document.getElementById('status-medium').textContent = medium;
  document.getElementById('status-resolved').textContent = resolved;
  document.getElementById('count-grave').textContent = grave;
  document.getElementById('count-medium').textContent = medium;
  document.getElementById('count-resolved').textContent = resolved;
}

function resetForm() {
  document.getElementById('report-name').value = '';
  document.getElementById('report-location').value = '';
  document.getElementById('report-type').value = '';
  document.getElementById('report-description').value = '';
  document.getElementById('report-comment').value = '';
  selectedRating = 0;
  selectedImageData = null;
  document.getElementById('image-preview').innerHTML = 'Nenhuma imagem selecionada.';
  updateStarDisplay();
}

function updateStarDisplay() {
  const starContainer = document.getElementById('star-rating');
  if (!starContainer) return;

  starContainer.innerHTML = '';
  for (let i = 1; i <= 5; i += 1) {
    const star = document.createElement('span');
    star.className = i <= selectedRating ? 'star active' : 'star';
    star.textContent = '★';
    star.dataset.value = i;
    star.addEventListener('click', () => {
      selectedRating = i;
      updateStarDisplay();
    });
    starContainer.appendChild(star);
  }
}

function showMessage(message, success = true) {
  const messageNode = document.getElementById('denuncia-message');
  if (!messageNode) return;
  messageNode.textContent = message;
  messageNode.style.color = success ? '#86efac' : '#fda4af';
}

function handleImageUpload(file) {
  const preview = document.getElementById('image-preview');
  if (!file || !preview) return;

  const reader = new FileReader();
  reader.onload = () => {
    selectedImageData = reader.result;
    preview.innerHTML = `<img src="${selectedImageData}" alt="Imagem de denúncia" />`;
  };
  reader.readAsDataURL(file);
}

function renderReports() {
  const grid = document.getElementById('reports-grid');
  if (!grid) return;

  grid.innerHTML = '';
  if (reports.length === 0) {
    grid.innerHTML = '<p class="field-hint">Nenhuma denúncia registrada ainda. Seja o primeiro a reportar.</p>';
    return;
  }

  reports.slice().reverse().forEach((report) => {
    const card = document.createElement('article');
    card.className = 'report-card';
    card.innerHTML = `
      <div class="report-card-top">
        <div>
          <span class="badge ${report.severity}">${getStatusText(report.severity)}</span>
          <h3>${report.type}</h3>
          <p class="report-meta">${report.location} · ${formatDate(report.createdAt)}</p>
        </div>
      </div>
      <div class="report-card-body">
        ${report.imageData ? `<img src="${report.imageData}" alt="Imagem da denúncia" />` : '<div class="image-placeholder">Sem imagem</div>'}
        <div class="report-details">
          <p>${report.description}</p>
          <div class="report-note"><strong>Avaliação:</strong> ${report.rating}/5</div>
          ${report.comment ? `<div class="report-note"><strong>Comentário:</strong> ${report.comment}</div>` : ''}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function renderMap() {
  const map = document.getElementById('sim-map');
  if (!map) return;

  map.innerHTML = '';
  mapNodes.forEach((node) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `sim-node ${node.severity}`;
    button.innerHTML = `<strong>${node.label}</strong><span>${node.note}</span>`;
    button.addEventListener('click', () => {
      showMessage(`Local: ${node.label}. ${node.note}`, true);
    });
    map.appendChild(button);
  });
}

function mapSeverityStatus() {
  const reportsByType = reports.reduce((summary, report) => {
    const severity = report.severity;
    summary[severity] = (summary[severity] || 0) + 1;
    return summary;
  }, {});

  document.getElementById('count-grave').textContent = reportsByType.grave || 0;
  document.getElementById('count-medium').textContent = reportsByType.medium || 0;
  document.getElementById('count-resolved').textContent = reportsByType.resolved || 0;
}

function initDenuncias() {
  updateStarDisplay();
  renderReports();
  renderMap();
  updateCounters();
  mapSeverityStatus();

  const cameraInput = document.getElementById('camera-input');
  const galleryInput = document.getElementById('gallery-input');
  const cameraButton = document.getElementById('camera-button');
  const galleryButton = document.getElementById('gallery-button');
  const submitButton = document.getElementById('submit-report');

  if (cameraButton && cameraInput) {
    cameraButton.addEventListener('click', () => cameraInput.click());
  }

  if (galleryButton && galleryInput) {
    galleryButton.addEventListener('click', () => galleryInput.click());
  }

  [cameraInput, galleryInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('change', (event) => {
      const file = event.target.files && event.target.files[0];
      if (file) {
        handleImageUpload(file);
      }
    });
  });

  if (submitButton) {
    submitButton.addEventListener('click', () => {
      const name = document.getElementById('report-name').value.trim();
      const location = document.getElementById('report-location').value.trim();
      const type = document.getElementById('report-type').value;
      const description = document.getElementById('report-description').value.trim();
      const comment = document.getElementById('report-comment').value.trim();

      if (!name || !location || !type || !description) {
        showMessage('Por favor, preencha nome, localização, tipo e descrição.', false);
        return;
      }

      const severity = getSeverityLabel(type);
      const report = {
        id: Date.now(),
        name,
        location,
        type,
        description,
        comment,
        rating: selectedRating || 0,
        imageData: selectedImageData,
        severity,
        createdAt: Date.now()
      };

      reports.push(report);
      saveReports();
      renderReports();
      updateCounters();
      mapSeverityStatus();
      resetForm();
      showMessage('Denúncia registrada com sucesso. Obrigado por informar.', true);
    });
  }
}

window.addEventListener('DOMContentLoaded', initDenuncias);
