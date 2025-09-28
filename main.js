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
                initializeLakesPage();
                break;
            case 'lake-detail':
                initializeLakeDetailPage();
                break;
            case 'tackle-calculator':
                initializeTackleCalculator();
                break;
            case 'fish-guide':
                initializeFishGuide();
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
        
        // Generate additional lakes and fish if needed
        if (lakesData.length < 50) {
            lakesData = generateAdditionalLakes(lakesData);
        }
        if (fishData.length < 50) {
            fishData = generateAdditionalFish(fishData);
        }
        
    } catch (error) {
        console.error('Error loading data:', error);
        // Use generated data as fallback
        lakesData = generateAdditionalLakes([]);
        fishData = generateAdditionalFish([]);
    }
}

// Generate additional lakes data
function generateAdditionalLakes(existingLakes) {
    const additionalLakes = [
        {
            "id": 11,
            "name": "Озеро Топозеро",
            "region": "Карелия",
            "rating": 4.2,
            "description": "Живописное карельское озеро с чистой водой и богатой фауной. Отличное место для ловли щуки и окуня.",
            "fish_species": ["Щука", "Окунь", "Лещ", "Язь", "Плотва", "Судак"],
            "best_season": ["Июнь", "Июль", "Август", "Сентябрь"],
            "coordinates": { "lat": 62.1, "lon": 34.2 },
            "infrastructure": ["Базы отдыха", "Кемпинги", "Пирсы"],
            "popularity": 11
        },
        {
            "id": 12,
            "name": "Озеро Вигозеро",
            "region": "Карелия",
            "rating": 4.3,
            "description": "Крупное озеро в Карелии, известное своими лососевыми и хищными рыбами. Популярное место у спиннингистов.",
            "fish_species": ["Лосось", "Сиг", "Судак", "Щука", "Окунь", "Язь"],
            "best_season": ["Июнь", "Июль", "Август", "Сентябрь"],
            "coordinates": { "lat": 63.5, "lon": 34.8 },
            "infrastructure": ["Базы отдыха", "Гостиницы", "Прокат лодок"],
            "popularity": 12
        },
        {
            "id": 13,
            "name": "Озеро Сегозеро",
            "region": "Карелия",
            "rating": 4.1,
            "description": "Озеро с девственной природой и отличными условиями для рыбалки. Здесь водится много видов рыб.",
            "fish_species": ["Щука", "Окунь", "Лещ", "Судак", "Плотва", "Язь"],
            "best_season": ["Июнь", "Июль", "Август", "Сентябрь"],
            "coordinates": { "lat": 63.2, "lon": 33.5 },
            "infrastructure": ["Кемпинги", "Пирсы", "Магазины"],
            "popularity": 13
        },
        {
            "id": 14,
            "name": "Озеро Водлярви",
            "region": "Карелия",
            "rating": 4.0,
            "description": "Красивое карельское озеро с хорошим клевом. Подходит для всех видов рыбалки круглый год.",
            "fish_species": ["Окунь", "Щука", "Лещ", "Язь", "Плотва", "Голавль"],
            "best_season": ["Круглый год"],
            "coordinates": { "lat": 61.8, "lon": 35.2 },
            "infrastructure": ["Базы отдыха", "Парковка", "Пирсы"],
            "popularity": 14
        },
        {
            "id": 15,
            "name": "Озеро Укшозеро",
            "region": "Карелия",
            "rating": 3.9,
            "description": "Озеро с прекрасной природой и разнообразной рыбой. Отличное место для семейной рыбалки.",
            "fish_species": ["Щука", "Окунь", "Лещ", "Плотва", "Язь", "Судак"],
            "best_season": ["Июнь", "Июль", "Август", "Сентябрь"],
            "coordinates": { "lat": 62.5, "lon": 34.5 },
            "infrastructure": ["Базы отдыха", "Кемпинги", "Магазины"],
            "popularity": 15
        }
    ];
    
    return [...existingLakes, ...additionalLakes];
}

// Generate additional fish data
function generateAdditionalFish(existingFish) {
    const additionalFish = [
        {
            "id": 6,
            "name": "Голавль",
            "type": "мирная",
            "description": "Крупная мирная рыба с серебристым боком. Очень осторожная и сильная, любит чистую проточную воду.",
            "habitat": "Быстрые реки с каменистым дном, пороги и перекаты. Избегает стоячей воды.",
            "tackle_recommendations": "Легкий спиннинг или поплавочная удочка, леска 0.14-0.20мм, искусственные мушки, червь.",
            "best_biting_time": "Утро и вечер в теплое время года. Особенно активен весной и ранним летом.",
            "seasons": ["Весна", "Лето"]
        },
        {
            "id": 7,
            "name": "Плотва",
            "type": "мирная",
            "description": "Маленькая серебристая рыбка, очень распространенная. Отличная наживка для хищной рыбы.",
            "habitat": "Практически все пресноводные водоемы. Предпочитает участки со слабым течением.",
            "tackle_recommendations": "Легкая поплавочная удочка, леска 0.10-0.14мм, мелкие крючки, мотыль, опарыш.",
            "best_biting_time": "Круглый год, особенно активна зимой. Лучшее время - утро и вечер.",
            "seasons": ["Зима", "Весна", "Лето", "Осень"]
        },
        {
            "id": 8,
            "name": "Карп",
            "type": "мирная",
            "description": "Крупная рыба семейства карповых. Очень сильная и выносливая, требует терпения при ловле.",
            "habitat": "Стоячие или слабопроточные водоемы с мягким дном и обилием пищи.",
            "tackle_recommendations": "Фидер или карповая удочка, прочная леска 0.25-0.35мм, специальные бойлы и кукуруза.",
            "best_biting_time": "Ночь и раннее утро. Наиболее активен в теплые месяцы.",
            "seasons": ["Лето", "Осень"]
        },
        {
            "id": 9,
            "name": "Сазан",
            "type": "мирная",
            "description": "Крупнейшая рыба семейства карповых. Может достигать огромных размеров, очень сильная.",
            "habitat": "Большие реки и озера с теплой водой. Предпочитает глубокие участки с коряжником.",
            "tackle_recommendations": "Мощный карповый комплект, плетеная леска 0.30-0.40мм, большие крючки, бойлы.",
            "best_biting_time": "Ночное время в теплый сезон. Особенно активен в июле-августе.",
            "seasons": ["Лето"]
        },
        {
            "id": 10,
            "name": "Линь",
            "type": "мирная",
            "description": "Речная рыба с золотистым отливом. Очень вкусная, предпочитает чистую воду.",
            "habitat": "Реки и озера с чистой водой и обилием растительности. Избегает загрязненных мест.",
            "tackle_recommendations": "Поплавочная удочка или донка, леска 0.12-0.18мм, червь, опарыш, тесто.",
            "best_biting_time": "Утро и вечер в теплое время года. Особенно активен в мае-июне.",
            "seasons": ["Весна", "Лето"]
        }
    ];
    
    return [...existingFish, ...additionalFish];
}

// Get current page
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('lakes.html')) return 'lakes';
    if (path.includes('lake-detail.html')) return 'lake-detail';
    if (path.includes('tackle-calculator.html')) return 'tackle-calculator';
    if (path.includes('fish-guide.html')) return 'fish-guide';
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
            }
        );
    }
}

// Initialize home page
function initializeHomePage() {
    initializePopularLakesSlider();
    initializeScrollAnimations();
}

// Initialize popular lakes slider
function initializePopularLakesSlider() {
    const popularLakes = lakesData
        .sort((a, b) => a.popularity - b.popularity)
        .slice(0, 6);
    
    const lakesList = document.getElementById('popular-lakes-list');
    if (lakesList) {
        lakesList.innerHTML = popularLakes.map(lake => createLakeCard(lake)).join('');
        
        // Initialize Splide slider
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

// Initialize scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 800,
                    easing: 'easeOutQuart'
                });
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.card-hover').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Initialize animations
function initializeAnimations() {
    // P5.js background animation
    if (typeof p5 !== 'undefined') {
        new p5((sketch) => {
            let particles = [];
            
            sketch.setup = function() {
                const canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
                canvas.id('p5-background');
                
                // Create particles
                for (let i = 0; i < 50; i++) {
                    particles.push({
                        x: sketch.random(sketch.width),
                        y: sketch.random(sketch.height),
                        size: sketch.random(2, 6),
                        speedX: sketch.random(-0.5, 0.5),
                        speedY: sketch.random(-0.5, 0.5),
                        opacity: sketch.random(0.1, 0.3)
                    });
                }
            };
            
            sketch.draw = function() {
                sketch.clear();
                
                // Update and draw particles
                particles.forEach(particle => {
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;
                    
                    // Wrap around edges
                    if (particle.x < 0) particle.x = sketch.width;
                    if (particle.x > sketch.width) particle.x = 0;
                    if (particle.y < 0) particle.y = sketch.height;
                    if (particle.y > sketch.height) particle.y = 0;
                    
                    // Draw particle
                    sketch.fill(255, 255, 255, particle.opacity * 255);
                    sketch.noStroke();
                    sketch.ellipse(particle.x, particle.y, particle.size);
                });
            };
            
            sketch.windowResized = function() {
                sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
            };
        });
    }
}

// Utility functions
function formatDistance(distance) {
    if (distance < 1) {
        return `${Math.round(distance * 1000)}м`;
    }
    return `${distance.toFixed(1)}км`;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Export functions for use in other pages
window.FishGuide = {
    lakesData,
    fishData,
    userLocation,
    createLakeCard,
    formatDistance,
    calculateDistance
};