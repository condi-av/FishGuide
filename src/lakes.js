// Lakes page functionality
class LakesPage {
    constructor() {
        this.extendedLakesData = extendedLakesData;
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

    // Mobile menu functionality
    initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    // View toggle functionality
    initViewToggle() {
        const gridViewBtn = document.getElementById('grid-view');
        const mapViewBtn = document.getElementById('map-view');
        const gridSection = document.getElementById('lakes-grid');
        const mapSection = document.getElementById('lakes-map');

        gridViewBtn.addEventListener('click', () => {
            this.currentView = 'grid';
            gridViewBtn.classList.add('active');
            mapViewBtn.classList.remove('active');
            gridSection.classList.remove('hidden');
            mapSection.classList.add('hidden');
        });

        mapViewBtn.addEventListener('click', () => {
            this.currentView = 'map';
            mapViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            mapSection.classList.remove('hidden');
            gridSection.classList.add('hidden');
            
            // Initialize map if not already done
            if (!this.map) {
                setTimeout(() => this.initMap(), 100);
            } else {
                setTimeout(() => this.map.invalidateSize(), 100);
            }
        });
    }

    // Initialize filters
    initFilters() {
        const filters = ['region-filter', 'fish-filter', 'season-filter', 'rating-filter', 'infrastructure-filter'];
        
        filters.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.addEventListener('change', () => this.applyFilters());
            }
        });

        // Items per page
        const perPageSelect = document.getElementById('per-page');
        if (perPageSelect) {
            perPageSelect.addEventListener('change', (e) => {
                this.itemsPerPage = parseInt(e.target.value);
                this.currentPage = 1;
                this.renderLakes();
            });
        }
    }

    // Initialize search
    initSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }
    }

    // Initialize sort
    initSort() {
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.applyFilters();
            });
        }
    }

    // Apply all filters
    applyFilters() {
        let filtered = [...this.lakes];

        // Search filter
        if (this.searchQuery) {
            filtered = filtered.filter(lake => 
                lake.name.toLowerCase().includes(this.searchQuery) ||
                lake.region.toLowerCase().includes(this.searchQuery) ||
                lake.fish.some(f => f.toLowerCase().includes(this.searchQuery))
            );
        }

        // Region filter
        const regionFilter = document.getElementById('region-filter').value;
        if (regionFilter) {
            filtered = filtered.filter(lake => 
                lake.region.toLowerCase().includes(regionFilter.toLowerCase())
            );
        }

        // Fish filter
        const fishFilter = document.getElementById('fish-filter').value;
        if (fishFilter) {
            filtered = filtered.filter(lake => 
                lake.fish.some(f => f.toLowerCase().includes(fishFilter.toLowerCase()))
            );
        }

        // Season filter
        const seasonFilter = document.getElementById('season-filter').value;
        if (seasonFilter) {
            filtered = filtered.filter(lake => 
                lake.seasons.includes(seasonFilter.toLowerCase())
            );
        }

        // Rating filter
        const ratingFilter = document.getElementById('rating-filter').value;
        if (ratingFilter) {
            filtered = filtered.filter(lake => 
                lake.rating >= parseFloat(ratingFilter)
            );
        }

        // Infrastructure filter
        const infrastructureFilter = document.getElementById('infrastructure-filter').value;
        if (infrastructureFilter) {
            filtered = filtered.filter(lake => 
                lake.infrastructure.toLowerCase().includes(infrastructureFilter.toLowerCase())
            );
        }

        // Apply sorting
        if (this.sortBy) {
            filtered.sort((a, b) => {
                switch (this.sortBy) {
                    case 'rating':
                        return b.rating - a.rating;
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'region':
                        return a.region.localeCompare(b.region);
                    case 'fish-count':
                        return b.fish.length - a.fish.length;
                    default:
                        return 0;
                }
            });
        }

        this.filteredLakes = filtered;
        this.currentPage = 1;
        this.renderLakes();
        this.updateResultsCount();
        
        // Update map markers if in map view
        if (this.currentView === 'map' && this.map) {
            this.updateMapMarkers();
        }
    }

    // Render lakes
    renderLakes() {
        const container = document.getElementById('lakes-container');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const lakesToShow = this.filteredLakes.slice(0, endIndex);

        container.innerHTML = '';

        lakesToShow.forEach((lake, index) => {
            const lakeCard = this.createLakeCard(lake, index);
            container.appendChild(lakeCard);
        });

        // Update load more button
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            if (endIndex >= this.filteredLakes.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'block';
                loadMoreBtn.onclick = () => {
                    this.currentPage++;
                    this.renderLakes();
                };
            }
        }

        // Animate cards
        anime({
            targets: '.lake-card',
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(100),
            duration: 600,
            easing: 'easeOutQuad'
        });
    }

    // Create lake card element
    createLakeCard(lake, index) {
        const card = document.createElement('div');
        card.className = 'lake-card card-hover bg-white rounded-2xl shadow-lg overflow-hidden';
        
        const fishColors = {
            'Щука': 'bg-blue-100 text-blue-800',
            'Окунь': 'bg-orange-100 text-orange-800',
            'Карп': 'bg-green-100 text-green-800',
            'Лещ': 'bg-purple-100 text-purple-800',
            'Судак': 'bg-pink-100 text-pink-800',
            'Сазан': 'bg-yellow-100 text-yellow-800',
            'Сом': 'bg-red-100 text-red-800',
            'Хариус': 'bg-indigo-100 text-indigo-800',
            'Омуль': 'bg-cyan-100 text-cyan-800',
            'Таймень': 'bg-emerald-100 text-emerald-800'
        };

        card.innerHTML = `
            <div class="h-48 bg-gradient-to-br from-blue-400 to-blue-600 relative">
                <img src="${this.getLakeImage(lake.name)}" alt="${lake.name}" class="w-full h-full object-cover">
                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span class="text-sm font-semibold text-slate-700">${lake.rating} ⭐</span>
                </div>
                <div class="absolute top-4 left-4 bg-lake-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                    ${lake.region}
                </div>
            </div>
            <div class="p-6">
                <h3 class="font-display text-xl font-bold text-slate-800 mb-2">${lake.name}</h3>
                <p class="text-slate-600 mb-4">${lake.description}</p>
                
                <div class="flex flex-wrap gap-2 mb-4">
                    ${lake.fish.map(fish => `
                        <span class="${fishColors[fish] || 'bg-gray-100 text-gray-800'} px-2 py-1 rounded-full text-xs font-medium">
                            ${fish}
                        </span>
                    `).join('')}
                </div>
                
                <div class="space-y-2 mb-4">
                    <div class="flex items-center text-sm text-slate-600">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        ${lake.coordinates}
                    </div>
                    <div class="flex items-center text-sm text-slate-600">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                        Лучшее время: ${lake.bestTime}
                    </div>
                    <div class="flex items-center text-sm text-slate-600">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        ${lake.infrastructure}
                    </div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <div class="flex space-x-1">
                            ${this.generateRatingStars(lake.rating)}
                        </div>
                        <span class="text-xs text-slate-500">(${lake.reviews} отзывов)</span>
                    </div>
                    <button onclick="showLakeDetails('${lake.id}')" class="text-lake-blue hover:text-blue-800 font-semibold text-sm transition-colors">
                        Подробнее →
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    // Get lake image based on name
    getLakeImage(lakeName) {
        const imageMap = {
            'Озеро Селигер': 'https://kimi-web-img.moonshot.cn/img/plus.unsplash.com/63aa503971168e315df586e32f30abb6bc13e832',
            'Озеро Байкал': 'https://kimi-web-img.moonshot.cn/img/www.nps.gov/55be5d236f5610ad8e60dfffd8cd4af2cbcdd03f.jpg',
            'Дельта Волги': 'https://kimi-web-img.moonshot.cn/img/media.istockphoto.com/a2b417d5ec2a7a6995e1aaffeb9e52e6decffef7.jpg',
            'Озеро Ладожское': 'https://kimi-web-img.moonshot.cn/img/images.squarespace-cdn.com/0071e4cea04fa6c06e9b3ac89c7df0201ad3594d.jpg',
            'Озеро Онежское': 'https://kimi-web-img.moonshot.cn/img/www.explorekentuckylake.com/de9f623b40331c26409adc946ce1d45fe4dad144.jpg'
        };
        
        return imageMap[lakeName] || 'https://kimi-web-img.moonshot.cn/img/plus.unsplash.com/63aa503971168e315df586e32f30abb6bc13e832';
    }

    // Generate rating stars
    generateRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '<div class="w-3 h-3 bg-yellow-400 rounded-full"></div>';
        }
        
        // Half star
        if (hasHalfStar) {
            stars += '<div class="w-3 h-3 bg-gradient-to-r from-yellow-400 to-gray-300 rounded-full"></div>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars += '<div class="w-3 h-3 bg-gray-300 rounded-full"></div>';
        }
        
        return stars;
    }

    // Initialize map
    initMap() {
        const mapElement = document.getElementById('map');
        if (!mapElement) return;

        // Initialize Leaflet map centered on Russia
        this.map = L.map('map').setView([61.5240, 105.3188], 3);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Add lake markers
        this.updateMapMarkers();
    }

    // Update map markers
    updateMapMarkers() {
        if (!this.map) return;

        // Clear existing markers
        this.map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                this.map.removeLayer(layer);
            }
        });

        // Add filtered markers
        this.filteredLakes.forEach(lake => {
            const marker = L.marker([lake.lat, lake.lng])
                .addTo(this.map)
                .bindPopup(this.createLakePopup(lake));

            const markerIcon = this.createCustomMarker(lake.fish[0]);
            marker.setIcon(markerIcon);
        });

        // Fit map to show all markers if there are any
        if (this.filteredLakes.length > 0) {
            const group = new L.featureGroup(this.filteredLakes.map(lake => 
                L.marker([lake.lat, lake.lng])
            ));
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    // Create custom marker
    createCustomMarker(fishType) {
        const colors = {
            'Щука': '#1e3a8a',
            'Окунь': '#f97316',
            'Карп': '#059669',
            'Лещ': '#7c3aed',
            'Судак': '#ec4899',
            'Сазан': '#eab308',
            'Сом': '#dc2626'
        };

        const color = colors[fishType] || '#1e3a8a';

        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
    }

    // Create popup for lake marker
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
                <button onclick="showLakeDetails('${lake.id}')" class="inline-block bg-lake-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
                    Подробнее
                </button>
            </div>
        `;
    }

    // Update results count
    updateResultsCount() {
        const countElement = document.getElementById('results-count');
        if (countElement) {
            countElement.textContent = this.filteredLakes.length;
        }
    }

    // Get all lakes from extended database
    getAllLakes() {
        const allLakes = [];
        
        Object.keys(this.extendedLakesData).forEach(district => {
            this.extendedLakesData[district].lakes.forEach(lake => {
                allLakes.push({
                    ...lake,
                    district: district,
                    districtName: this.extendedLakesData[district].name
                });
            });
        });
        
        return allLakes;
    }
}

// Utility functions
function clearFilters() {
    const filters = ['region-filter', 'fish-filter', 'season-filter', 'rating-filter', 'infrastructure-filter'];
    filters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) filter.value = '';
    });
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    
    if (window.lakesPage) {
        window.lakesPage.searchQuery = '';
        window.lakesPage.applyFilters();
    }
}

function showLakeDetails(lakeId) {
    // This would typically open a modal or navigate to a detail page
    alert(`Показать детальную информацию об озере: ${lakeId}`);
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.lakesPage = new LakesPage();
});