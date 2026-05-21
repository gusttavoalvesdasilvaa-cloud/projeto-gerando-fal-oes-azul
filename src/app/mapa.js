window.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map').setView([-23.5318, -46.3750], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const points = [
    {
      name: 'Rio Tietê - Itaquaquecetuba',
      coords: [-23.5265, -46.3786],
      status: 'Água muito poluída. Presença de resíduos sólidos e odor forte.'
    },
    {
      name: 'Afluente do Rio Baquirivu',
      coords: [-23.5296, -46.3567],
      status: 'Água com turbidez elevada, risco de contaminação.'
    },
    {
      name: 'Bacia de coleta Norte',
      coords: [-23.5420, -46.3694],
      status: 'Risco médio de poluição por esgoto e lixo urbano.'
    },
    {
      name: 'Estação de tratamento prevista',
      coords: [-23.5402, -46.3871],
      status: 'Local proposto para nova estação de tratamento de água.'
    }
  ];

  points.forEach((point) => {
    L.circleMarker(point.coords, {
      radius: 10,
      color: point.name.includes('prevista') ? '#22c55e' : '#ef4444',
      fillColor: point.name.includes('prevista') ? '#22c55e' : '#ef4444',
      fillOpacity: 0.7,
      weight: 2
    })
      .addTo(map)
      .bindPopup(`<strong>${point.name}</strong><br>${point.status}`);
  });
});
