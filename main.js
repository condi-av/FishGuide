// FishGuide - Main JavaScript File

// Global variables
let lakesData = [];
let fishData = [];
let userLocation = null;
let dataLoaded = false;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        console.log('Initializing FishGuide app...');
        
        // Load data first
        await loadData();
        
        // Initialize geolocation
        initializeGeolocation();
        
        // Initialize components based on current page
        const currentPage = getCurrentPage();
        console.log('Current page:', currentPage);
        
        switch(currentPage) {
            case 'index':
                initializeHomePage();
                break;
            case 'lakes':
                // Lakes page will initialize itself
                break;
            case 'lake-detail':
                // Lake detail page will initialize itself  
                break;
            case 'tackle-calculator':
                // Calculator will initialize itself
                break;
            case 'fish-guide':
                // Fish guide will initialize itself
                break;
        }
        
        console.log('App initialized successfully');
        
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Load data from JSON
async function loadData() {
    try {
        console.log('Loading data from data.json...');
        const response = await fetch('data.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        lakesData = data.lakes || [];
        fishData = data.fish || [];
        
        console.log(`Loaded ${lakesData.length} lakes and ${fishData.length} fish`);
        
        // Update global data object
        window.FishGuide = window.FishGuide || {};
        window.FishGuide.lakesData = lakesData;
        window.FishGuide.fishData = fishData;
        window.FishGuide.userLocation = userLocation;
        
        dataLoaded = true;
        
    } catch (error) {
        console.error('Error loading data:', error);
        // Use fallback data
        lakesData = generateAdditionalLakes([]);
        fishData = generateAdditionalFish([]);
        
        window.FishGuide = window.FishGuide || {};
        window.FishGuide.lakesData = lakesData;
        window.FishGuide.fishData = fishData;
        window.FishGuide.userLocation = userLocation;
        
        dataLoaded = true;
    }
}

// Generate additional lakes data (fallback)
function generateAdditionalLakes(existingLakes) {
    console.log('Generating fallback lakes data...');
    const additionalLakes = [
        {
            "id": 1,
            "name": "Озеро Селигер",
            "region": "Тверская область",
            "rating": 4.8,
            "description": "Одно из крупнейших и живописнейших озер Тверской области.",
            "fish_species": ["Щука", "Окунь", "Лещ", "Судак", "Язь", "Плотва"],
            "best_season": ["Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь"],
            "coordinates": { "lat": 57.2, "lon": 33.1 },
            "infrastructure": ["База отдыха", "Парковка", "Прокат лодок", "Кафе"],
            "popularity": 1
        },
        {
            "id": 2,
            "name": "Озеро Байкал", 
            "region": "Иркутская область",
            "rating": 4.9,
            "description": "Величайшее озеро мира с уникальной экосистемой.",
            "fish_species": ["Омуль", "Хариус", "Ленок", "Таймень", "Щука", "Окунь"],
            "best_season": ["Июнь", "Июль", "Август", "Сентябрь"],
            "coordinates": { "lat": 53.5, "lon": 108.2 },
            "infrastructure": ["Гостиницы", "Базы отдыха", "Экскурсии", "Рестораны"],
            "popularity": 2
        }
    ];
    
    return [...existingLakes, ...additionalLakes];
}

// Generate additional fish data (fallback)
function generateAdditionalFish(existingFish) {
    console.log('Generating fallback fish data...');
    const additionalFish = [
        {
            "id": 1,
            "name": "Щука",
            "type": "хищная",
            "description": "Крупная хищная рыба с длинным телом и острой пастью.",
            "habitat": "Предпочитает стоячие водоемы с зарослями тростника.",
            "tackle_recommendations": "Спиннинг среднего класса, прочная плетеная леска 0.15-0.25мм",
            "best_biting_time": "Раннее утро и вечер в теплые месяцы",
            "seasons": ["Весна", "Осень"]
        },
        {
            "id": 2, 
            "name": "Окунь",
            "type": "хищная",
            "description": "Полосатая хищная рыба среднего размера.",
            "habitat": "Живет как в стоячих, так и в проточных водоемах.",
            "tackle_recommendations": "Легкий спиннинг или поплавочная удочка, леска 0.12-0.18мм",
            "best_biting_time": "Круглый год, особенно активен зимой",
            "seasons": ["Зима", "Весна", "Лето", "Осень"]
        }
    ];
    
    return [...existingFish, ...additionalFish];
}

// Get current page
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    if (page === 'index.html' || page === '') return 'index';
    if (page === 'lakes.html') return 'lakes';
    if (page === 'lake-detail.html') return 'lake-detail';
    if (page === 'tackle-calculator.html') return 'tackle-calculator';
    if (page === 'fish-guide.html') return 'fish-guide';
    return 'index';
}

// Initialize geolocation
function initializeGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                userLocation = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                console.log('User location:', userLocation);
                
                // Update global object
                if (window.FishGuide) {
                    window.FishGuide.userLocation = userLocation;
                }
            },
            function(error) {
                console.log('Geolocation error:', error);
                // Set default location (Moscow)
                userLocation = { lat: 55.7558, lon: 37.6173 };
                if (window.FishGuide) {
                    window.FishGuide.userLocation = userLocation;
                }
            }
        );
    } else {
        userLocation = { lat: 55.7558, lon: 37.6173 };
        if (window.FishGuide) {
            window.FishGuide.userLocation = userLocation;
        }
    }
}

// Initialize home page
function initializeHomePage() {
    console.log('Initializing home page...');
    
    // Wait for data to be loaded
    if (lakesData.length > 0) {
        initializePopularLakesSlider();
    } else {
        // Wait for data
        const checkInterval = setInterval(() => {
            if (lakesData.length > 0) {
                clearInterval(checkInterval);
                initializePopularLakesSlider();
            }
        }, 100);
    }
}

// Initialize popular lakes slider
function initializePopularLakesSlider() {
    const popularLakes = lakesData
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 6);
    
    const lakesList = document.getElementById('popular-lakes-list');
    if (lakesList) {
        lakesList.innerHTML = popularLakes.map(lake => createLakeCard(lake)).join('');
        
        // Initialize Splide slider if available
        if (typeof Splide !== 'undefined') {
            try {
                new Splide('#popular-lakes-slider', {
                    type: 'loop',
                    perPage: 3,
                    perMove: 1,
                    gap: '2rem',
                    autoplay: true,
                    interval: 4000,
                    breakpoints: {
                        768: { perPage: 1 },
                        1024: { perPage: 2 }
                    }
                }).mount();
            } catch (error) {
                console.error('Splide initialization error:', error);
            }
        }
    }
}

// Create lake card HTML
function createLakeCard(lake) {
    return `
        <li class="splide__slide">
            <div class="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
                <div class="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <div class="text-6xl">🏞️</div>
                </div>
                <div class="p-6">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm text-slate-600">${lake.region}</span>
                        <div class="flex items-center">
                            <span class="text-yellow-500">⭐</span>
                            <span class="ml-1 text-sm font-medium">${lake.rating}</span>
                        </div>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">${lake.name}</h3>
                    <p class="text-slate-600 text-sm mb-4 line-clamp-2">${lake.description}</p>
                    <div class="flex flex-wrap gap-1 mb-4">
                        ${lake.fish_species.slice(0, 3).map(fish => 
                            `<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${fish}</span>`
                        ).join('')}
                        ${lake.fish_species.length > 3 ? `<span class="text-xs text-slate-500">+${lake.fish_species.length - 3}</span>` : ''}
                    </div>
                    <div class="text-sm text-slate-600 mb-4">
                        Лучший сезон: ${lake.best_season.slice(0, 3).join(', ')}
                    </div>
                    <a href="lake-detail.html?id=${lake.id}" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                        Подробнее →
                    </a>
                </div>
            </div>
        </li>
    `;
}

// Utility functions
function calculateDistance(coord1, coord2) {
    if (!coord1 || !coord2) return null;
    
    const R = 6371;
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLon = (coord2.lon - coord1.lon) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function formatDistance(distance) {
    if (distance === null || distance === undefined) return 'Неизвестно';
    if (distance < 1) {
        return `${Math.round(distance * 1000)}м`;
    }
    return `${distance.toFixed(1)}км`;
}

// Toggle mobile menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Export functions and data for use in other pages
window.FishGuide = window.FishGuide || {};
window.FishGuide.createLakeCard = createLakeCard;
window.FishGuide.formatDistance = formatDistance;
window.FishGuide.calculateDistance = calculateDistance;
window.FishGuide.toggleMobileMenu = toggleMobileMenu;

// Check if data is ready every 100ms and initialize pages
let dataCheckInterval = setInterval(() => {
    if (dataLoaded && window.FishGuide.lakesData && window.FishGuide.lakesData.length > 0) {
        clearInterval(dataCheckInterval);
        
        // Initialize specific page functions if they exist
        const currentPage = getCurrentPage();
        if (currentPage === 'lakes' && typeof initializeLakesPage === 'function') {
            initializeLakesPage();
        }
        if (currentPage === 'fish-guide' && typeof initializeFishGuide === 'function') {
            initializeFishGuide();
        }
        if (currentPage === 'tackle-calculator' && typeof initializeTackleCalculator === 'function') {
            initializeTackleCalculator();
        }
        if (currentPage === 'lake-detail' && typeof initializeLakeDetailPage === 'function') {
            initializeLakeDetailPage();
        }
    }
}, 100);
