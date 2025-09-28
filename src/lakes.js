// Lakes page functionality
class LakesPage {
  constructor() {
    this.extendedLakesData = extendedLakesData; // глобальная переменная из extended-lakes-data.js
    this.lakes = this.getAllLakes();
    this.filteredLakes = [...this.lakes];
    this.currentView = 'grid';
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.map = null;
    this.init();
  }

  init() {
    this.initMobileMenu();
    this.initViewToggle();
    this.initFilters();
    this.initSearch();
    this.initSort();
    this.renderLakes();
    this.initMap();
    this.updateResultsCount();
  }

  // Mobile menu
  initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) {
      btn.addEventListener('click', () => menu.classList.toggle('hidden'));
    }
  }

  // Grid / Map toggle
  initViewToggle() {
    const gridBtn = document.getElementById('grid-view');
    const mapBtn = document.getElementById('map-view');
    const gridSec = document.getElementById('lakes-grid');
    const mapSec = document.getElementById('lakes-map');

    gridBtn?.addEventListener('click', () => {
      this.currentView = 'grid';
      gridBtn.classList.add('active');
      mapBtn.classList.remove('active');
      gridSec.classList.remove('hidden');
      mapSec.classList.add('hidden');
    });

    mapBtn?.addEventListener('click', () => {
      this.currentView = 'map';
      mapBtn.classList.add('active');
      gridBtn.classList.remove('active');
      mapSec.classList.remove('hidden');
      gridSec.classList.add('hidden');
      if (!this.map) setTimeout(() => this.initMap(), 100);
      else setTimeout(() => this.map.invalidateSize(), 100);
    });
  }

  // Filters
  initFilters() {
    ['region-filter', 'fish-filter', 'season-filter', 'rating-filter', 'infrastructure-filter'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', () => this.applyFilters());
    });
    document.getElementById('per-page')?.addEventListener('change', e => {
      this.itemsPerPage = parseInt(e.target.value);
      this.currentPage = 1;
      this.renderLakes();
    });
  }

  // Search
  initSearch() {
    document.getElementById('search-input')?.addEventListener('input', e => {
      this.searchQuery = e.target.value.toLowerCase();
      this.applyFilters();
    });
  }

  // Sort
  initSort() {
    document.getElementById('sort-select')?.addEventListener('change', e => {
      this.sortBy = e.target.value;
      this.applyFilters();
    });
  }

  // Apply all filters
  applyFilters() {
    let filtered = [...this.lakes];

    const search = this.searchQuery;
    const region = document.getElementById('region-filter')?.value || '';
    const fish = document.getElementById('fish-filter')?.value || '';
    const season = document.getElementById('season-filter')?.value || '';
    const rating = document.getElementById('rating-filter')?.value || '';
    const infra = document.getElementById('infrastructure-filter')?.value || '';

    if (search) {
      filtered = filtered.filter(l =>
        l.name.toLowerCase().includes(search) ||
        l.region.toLowerCase().includes(search) ||
        l.fish.some(f => f.toLowerCase().includes(search))
      );
    }
    if (region) filtered = filtered.filter(l => l.region.toLowerCase().includes(region.toLowerCase()));
    if (fish) filtered = filtered.filter(l => l.fish.some(f => f.toLowerCase().includes(fish.toLowerCase())));
    if (season) filtered = filtered.filter(l => l.seasons.includes(season));
    if (rating) filtered = filtered.filter(l => l.rating >= parseFloat(rating));
    if (infra) filtered = filtered.filter(l => l.infrastructure.toLowerCase().includes(infra.toLowerCase()));

    if (this.sortBy) {
      filtered.sort((a, b) => {
        switch (this.sortBy) {
          case 'rating': return b.rating - a.rating;
          case 'name': return a.name.localeCompare(b.name);
          case 'region': return a.region.localeCompare(b.region);
          case 'fish-count': return b.fish.length - a.fish.length;
          default: return 0;
        }
      });
    }

    this.filteredLakes = filtered;
    this.currentPage = 1;
    this.renderLakes();
    this.updateResultsCount();
    if (this.currentView === 'map' && this.map) this.updateMapMarkers();
  }

  // Render lakes (grid)
  renderLakes() {
    const container = document.getElementById('lakes-container');
    if (!container) return;

    const end = this.currentPage * this.itemsPerPage;
    const slice = this.filteredLakes.slice(0, end);

    container.innerHTML = '';
    slice.forEach((lake, i) => container.appendChild(this.createLakeCard(lake, i)));

    const loadBtn = document.getElementById('load-more');
    if (!loadBtn) return;
    loadBtn.style.display = end >= this.filteredLakes.length ? 'none' : 'block';
    loadBtn.onclick = () => {
      this.currentPage++;
      this.renderLakes();
    };

    anime({
      targets: '.lake-card',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(100),
      duration: 600,
      easing: 'easeOutQuad'
    });
  }

  // Create lake card
  createLakeCard(lake) {
    const card = document.createElement('div');
    card.className = 'lake-card card-hover bg-white rounded-2xl shadow-lg overflow-hidden';

    const fishColors = {
      'Щука': 'bg-blue-100 text-blue-800',
      'Окунь': 'bg-orange-100 text-orange-800',
      'Карп': 'bg-green-100 text-green-800',
      'Лещ': 'bg-purple-100 text-purple-800',
      'Судак': 'bg-pink-100 text-pink-800',
      'Сазан': 'bg-yellow-100 text-yellow-800',
      'Сом': 'bg-red-100 text-red-800'
    };

    card.innerHTML = `
      <div class="h-48 bg-gradient-to-br from-blue-400 to-blue-600 relative">
        <img src="${this.getLakeImage(lake.name)}" alt="${lake.name}" class="w-full h-full object-cover">
        <div class="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold">${lake.rating} ⭐</div>
        <div class="absolute top-4 left-4 bg-lake-blue text-white px-3 py-1 rounded-full text-sm">${lake.region}</div>
      </div>
      <div class="p-6">
        <h3 class="font-display text-xl font-bold text-slate-800 mb-2">${lake.name}</h3>
        <p class="text-slate-600 mb-4">${lake.description}</p>
        <div class="flex flex-wrap gap-2 mb-4">
          ${lake.fish.map(f => `<span class="${fishColors[f] || 'bg-gray-100 text-gray-800'} px-2 py-1 rounded-full text-xs font-medium">${f}</span>`).join('')}
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="flex space-x-1">${this.generateRatingStars(lake.rating)}</div>
            <span class="text-xs text-slate-500">(${lake.reviews} отзывов)</span>
          </div>
          <button onclick="showLakeDetails('${lake.id}')" class="text-lake-blue hover:text-blue-800 font-semibold text-sm">Подробнее →</button>
        </div>
      </div>
    `;
    return card;
  }

  // Image helper
  getLakeImage(name) {
    const map = {
      'Озеро Селигер': 'https://kimi-web-img.moonshot.cn/img/plus.unsplash.com/63aa503971168e315df586e32f30abb6bc13e832',
      'Озеро Байкал': 'https://kimi-web-img.moonshot.cn/img/www.nps.gov/55be5d236f5610ad8e60dfffd8cd4af2cbcdd03f.jpg',
      'Дельта Волги': 'https://kimi-web-img.moonshot.cn/img/media.istockphoto.com/a2b417d5ec2a7a6995e1aaffeb9e52e6decffef7.jpg'
    };
    return map[name] || 'https://kimi-web-img.moonshot.cn/img/plus.unsplash.com/63aa503971168e315df586e32f30abb6bc13e832';
  }

  // Stars helper
  generateRatingStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    const empty = 5 - full - (half ? 1 : 0);
    return [
      ...Array(full).fill('<div class="w-3 h-3 bg-yellow-400 rounded-full"></div>'),
      ...(half ? ['<div class="w-3 h-3 bg-gradient-to-r from-yellow-400 to-gray-300 rounded-full"></div>'] : []),
      ...Array(empty).fill('<div class="w-3 h-3 bg-gray-300 rounded-full"></div>')
    ].join('');
  }

  // Map initialization
  initMap() {
    const el = document.getElementById('map');
    if (!el) return;
    this.map = L.map('map').setView([61.524, 105.3188], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    this.updateMapMarkers();
  }

  // Update markers on map
  updateMapMarkers() {
    if (!this.map) return;
    this.map.eachLayer(layer => { if (layer instanceof L.Marker) this.map.removeLayer(layer); });
    this.filteredLakes.forEach(lake => {
      const marker = L.marker([lake.lat, lake.lng]).addTo(this.map).bindPopup(this.createLakePopup(lake));
      marker.setIcon(this.createCustomMarker(lake.fish[0]));
    });
    if (this.filteredLakes.length) {
      const group = new L.featureGroup(this.filteredLakes.map(l => L.marker([l.lat, l.lng])));
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  // Custom marker
  createCustomMarker(fishType) {
    const colors = {
      'Щука': '#1e3a8a', 'Окунь': '#f97316', 'Карп': '#059669', 'Лещ': '#7c3aed',
      'Судак': '#ec4899', 'Сазан': '#eab308', 'Сом': '#dc2626'
    };
    const color = colors[fishType] || '#1e3a8a';
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:${color};width:20px;height:20px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,.3)"></div>`,
      iconSize: [20, 20], iconAnchor: [10, 10]
    });
  }

  // Popup for map
  createLakePopup(lake) {
    return `
      <div class="p-3 max-w-xs">
        <h3 class="font-bold text-lg text-slate-800 mb-2">${lake.name}</h3>
        <p class="text-sm text-slate-600 mb-2">${lake.region}</p>
        <div class="flex flex-wrap gap-1 mb-3">
          ${lake.fish.map(f => `<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">${f}</span>`).join('')}
        </div>
        <p class="text-sm text-slate-600 mb-2">Рейтинг: ${lake.rating}/5 ⭐</p>
        <p class="text-sm text-slate-600 mb-3">Лучшее время: ${lake.bestTime}</p>
        <button onclick="showLakeDetails('${lake.id}')" class="inline-block bg-lake-blue text-white px-4 py-2 rounded-lg text-sm font-semibold">Подробнее</button>
      </div>
    `;
  }

  // Results count
  updateResultsCount() {
    const el = document.getElementById('results-count');
    if (el) el.textContent = this.filteredLakes.length;
  }

  // Collect all lakes from extended data
  getAllLakes() {
    const all = [];
    Object.keys(this.extendedLakesData).forEach(district => {
      const data = this.extendedLakesData[district];
      if (data?.lakes?.length) {
        data.lakes.forEach(lake => {
          all.push({ ...lake, district, districtName: data.name });
        });
      }
    });
    return all;
  }
}

// Utility
function clearFilters() {
  ['region-filter', 'fish-filter', 'season-filter', 'rating-filter', 'infrastructure-filter'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const search = document.getElementById('search-input');
  if (search) search.value = '';
  if (window.lakesPage) {
    window.lakesPage.searchQuery = '';
    window.lakesPage.applyFilters();
  }
}

function showLakeDetails(id) {
  alert(`Детали озера: ${id}`);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  window.lakesPage = new LakesPage();
});
