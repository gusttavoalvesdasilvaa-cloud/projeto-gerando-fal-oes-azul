window.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map').setView([0, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Expor mapa globalmente para water-bodies.js
  window.ecoWaterMap = map;
});
