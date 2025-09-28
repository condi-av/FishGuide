// FishGuide - Main JavaScript File

// Global variables
let lakesData = [];
let fishData = [];
let userLocation = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Load data
        await loadData();
        
        // Initialize geolocation
        initializeGeolocation();
        
        // Initialize components based on current page
        const currentPage = getCurrentPage();
        
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
        
        // Initialize animations
        initializeAnimations();
        
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Load data from JSON
async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        lakesData = data.lakes || [];
        fishData = data.fish || [];
        
        console.log('Loaded data:', { lakes: lakesData.length, fish: fishData.length });
        
    } catch (error) {
        console.error('Error loading data:', error);
        // Use generated data as fallback
        lakesData = generateAdditionalLakes([]);
        fishData = generateAdditionalFish([]);
    }
}

// Generate additional lakes data (fallback)
function generateAdditionalLakes(existingLakes) {
    const additionalLakes = [
        {
            "id": 11,
            "name": "Озеро Топозеро",
            "region": "Карелия",
            "rating": 4.2,
            "description": "Живописное карельское озеро с чистой водой и богатой фауной.",
            "fish_species": ["Щука", "Окунь", "Лещ", "Язь", "Плотва", "Судак"],
            "best_season": ["Июнь", "Июль", "Август", "Сентябрь"],
            "coordinates": { "lat": 62.1, "lon": 34.2 },
            "infrastructure": ["Базы отдыха", "Кемпинги", "Пирсы"],
            "popularity": 11
        }
        // ... остальные озера из вашего файла
    ];
    
    return [...existingLakes, ...additionalLakes];
}

// Generate additional fish data (fallback)
function generateAdditionalFish(existingFish) {
    const additionalFish = [
        {
            "id": 6,
            "name": "Голавль",
            "type": "мирная",
            "description": "Крупная мирная рыба с серебристым боком.",
            "habitat": "Быстрые реки с каменистым дном",
            "tackle_recommendations": "Легкий спиннинг, леска 0.14-0.20мм",
            "best_biting_time": "Утро и вечер",
            "seasons": ["Весна", "Лето"]
        }
        // ... остальные рыбы из вашего файла
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
            },
            function(error) {
                console.log('Geolocation error:', error);
                // Set default location (Moscow)
                userLocation = { lat: 55.7558, lon: 37.6173 };
            }
        );
    } else {
        userLocation = { lat: 55.7558, lon: 37.6173 };
    }
}

// Initialize home page
function initializeHomePage() {
    console.log('Initializing home page...');
    initializePopularLakesSlider();
}

// Initialize popular lakes slider
function initializePopularLakesSlider() {
    const popularLakes = lakesData
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 6);
    
    const lakesList = document.getElementById('popular-lakes-list');
    if (lakesList) {
        lakesList.innerHTML = popularLakes.map(lake => createLakeCard(lake)).join('');
        
        // Initialize Splide slider
        if (typeof Splide !== 'undefined') {
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

// Initialize animations
function initializeAnimations() {
    // Simple fade-in animation for cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.card-hover').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
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

// Export functions and data for use in other pages
window.FishGuide = {
    lakesData: [],
    fishData: [],
    userLocation: null,
    createLakeCard,
    formatDistance,
    calculateDistance,
    toggleMobileMenu
};

// Initialize data after load
loadData().then(() => {
    window.FishGuide.lakesData = lakesData;
    window.FishGuide.fishData = fishData;
    window.FishGuide.userLocation = userLocation;
    console.log('FishGuide data initialized');
});
