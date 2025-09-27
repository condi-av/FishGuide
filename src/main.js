// FishGuide - Interactive functionality
class FishGuideApp {
    constructor() {
        this.map = null;
        this.lakes = this.getLakesData();
        this.fishTypes = this.getFishTypes();
        this.weatherService = new WeatherService('d192e284d050cbe679c3641f372e7a02');
        this.currentWeatherData = null;
        this.init();
    }

    init() {
        this.initMobileMenu();
        this.initScrollAnimations();
        this.initMap();
        this.initSearchFunctionality();
        this.initWeatherForecast();
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

    // Scroll animations
    initScrollAnimations() {
        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all cards and sections
        document.querySelectorAll('.card-hover, section > div').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Animate fish icons
        anime({
            targets: '.fish-icon',
            translateY: [-10, 10],
            rotate: [-5, 5],
            duration: 2000,
            easing: 'easeInOutSine',
            direction: 'alternate',
            loop: true
        });
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
        this.addLakeMarkers();
    }

    // Add markers for lakes
    addLakeMarkers() {
        if (!this.map) return;

        this.lakes.forEach(lake => {
            const marker = L.marker([lake.lat, lake.lng])
                .addTo(this.map)
                .bindPopup(this.createLakePopup(lake));

            // Customize marker color based on fish type
            const markerIcon = this.createCustomMarker(lake.fishType);
            marker.setIcon(markerIcon);
        });
    }

    // Create custom marker based on fish type
    createCustomMarker(fishType) {
        const colors = {
            'pike': '#1e3a8a',    // lake-blue
            'perch': '#f97316',   // sunset-orange
            'carp': '#059669',    // nature-green
            'bream': '#7c3aed',   // purple
            'salmon': '#dc2626'   // red
        };

        const color = colors[fishType] || '#1e3a8a';

        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
    }

    // Create popup content for lake marker
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
                <a href="lakes.html" class="inline-block bg-lake-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
                    Подробнее
                </a>
            </div>
        `;
    }

    // Search functionality
    initSearchFunctionality() {
        const searchBtn = document.querySelector('button[onclick="searchLakes()"]');
        if (searchBtn) {
            searchBtn.addEventListener('click', this.searchLakes.bind(this));
        }

        // Add enter key support for search
        const filters = ['region-filter', 'fish-filter', 'season-filter'];
        filters.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.addEventListener('change', this.searchLakes.bind(this));
            }
        });
    }

    // Search lakes based on filters
    searchLakes() {
        const region = document.getElementById('region-filter')?.value || '';
        const fishType = document.getElementById('fish-filter')?.value || '';
        const season = document.getElementById('season-filter')?.value || '';

        // Filter lakes based on criteria
        const filteredLakes = this.lakes.filter(lake => {
            const matchesRegion = !region || lake.region.toLowerCase().includes(region.toLowerCase());
            const matchesFish = !fishType || lake.fishType === fishType;
            const matchesSeason = !season || lake.seasons.includes(season);
            
            return matchesRegion && matchesFish && matchesSeason;
        });

        // Update map markers
        this.updateMapMarkers(filteredLakes);

        // Show results count
        this.showSearchResults(filteredLakes.length);
    }

    // Update map markers based on search results
    updateMapMarkers(filteredLakes) {
        if (!this.map) return;

        // Clear existing markers
        this.map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                this.map.removeLayer(layer);
            }
        });

        // Add filtered markers
        filteredLakes.forEach(lake => {
            const marker = L.marker([lake.lat, lake.lng])
                .addTo(this.map)
                .bindPopup(this.createLakePopup(lake));

            const markerIcon = this.createCustomMarker(lake.fishType);
            marker.setIcon(markerIcon);
        });

        // Fit map to show all markers
        if (filteredLakes.length > 0) {
            const group = new L.featureGroup(filteredLakes.map(lake => 
                L.marker([lake.lat, lake.lng])
            ));
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    // Show search results message
    showSearchResults(count) {
        // Create or update results message
        let resultsDiv = document.getElementById('search-results');
        if (!resultsDiv) {
            resultsDiv = document.createElement('div');
            resultsDiv.id = 'search-results';
            resultsDiv.className = 'mt-4 p-4 bg-blue-50 rounded-xl text-center';
            document.querySelector('#map-section .bg-white').appendChild(resultsDiv);
        }

        resultsDiv.innerHTML = `
            <p class="text-lake-blue font-semibold">
                Найдено озер: ${count}
            </p>
        `;

        // Animate the results
        anime({
            targets: resultsDiv,
            scale: [0.9, 1],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });
    }

    // Initialize weather and forecast
    async initWeatherForecast() {
        try {
            // Default location (Moscow)
            const lat = 55.7558;
            const lng = 37.6176;
            
            // Get current weather and forecast
            const detailedConditions = await this.weatherService.getDetailedConditions(lat, lng, 'pike');
            
            if (detailedConditions) {
                this.currentWeatherData = detailedConditions;
                this.displayCurrentWeather(detailedConditions.current);
                this.displayForecast(detailedConditions.forecast);
                this.displayRecommendations(detailedConditions.recommendations);
            }
        } catch (error) {
            console.error('Error initializing weather forecast:', error);
            this.displayWeatherError();
        }
    }

    // Display current weather
    displayCurrentWeather(currentData) {
        const { weather, biteForecast } = currentData;
        
        // Update weather display
        document.getElementById('current-weather-icon').textContent = this.getWeatherIcon(weather.weather[0].icon);
        document.getElementById('current-temp').textContent = `${Math.round(weather.main.temp)}°C`;
        document.getElementById('current-weather-desc').textContent = weather.weather[0].description;
        document.getElementById('current-pressure').textContent = `${Math.round(weather.main.pressure * 0.750062)} мм`;
        document.getElementById('current-wind').textContent = `${Math.round(weather.wind.speed)} м/с`;
        document.getElementById('wind-direction').textContent = this.getWindDirection(weather.wind.deg);
        document.getElementById('moon-phase-icon').textContent = biteForecast.moonPhase.emoji;
        document.getElementById('moon-phase-name').textContent = biteForecast.moonPhase.name;
        
        // Update pressure trend
        const pressureTrend = biteForecast.pressure > 1016 ? 'растет' : biteForecast.pressure < 1010 ? 'падает' : 'стабильно';
        document.getElementById('pressure-trend').textContent = pressureTrend;
        
        // Display current bite forecast
        this.displayCurrentBite(biteForecast);
    }

    // Display current bite forecast
    displayCurrentBite(biteForecast) {
        const container = document.getElementById('current-bite-forecast');
        if (!container) return;

        const { biteLevel, temperature, waterTemperature, pressure } = biteForecast;
        
        container.innerHTML = `
            <div class="text-center mb-4">
                <div class="text-4xl mb-2" style="color: ${biteLevel.color}">${biteLevel.text}</div>
                <div class="text-2xl font-bold" style="color: ${biteLevel.color}">${Math.round(biteForecast.biteFactor * 10)}/10</div>
            </div>
            
            <div class="space-y-3">
                <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span class="text-sm text-slate-600">Температура воды</span>
                    <span class="font-semibold">${Math.round(waterTemperature)}°C</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span class="text-sm text-slate-600">Давление</span>
                    <span class="font-semibold">${Math.round(pressure * 0.750062)} мм рт. ст.</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span class="text-sm text-slate-600">Время суток</span>
                    <span class="font-semibold">${biteForecast.timeOfDay}</span>
                </div>
            </div>
        `;
    }

    // Display 3-day forecast
    displayForecast(forecast) {
        const container = document.getElementById('forecast-container');
        if (!container || !forecast) return;

        container.innerHTML = forecast.map(day => `
            <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg mb-3">
                <div class="flex items-center space-x-3">
                    <div class="text-2xl">${this.getWeatherIcon(day.weather.weather[0].icon)}</div>
                    <div>
                        <div class="font-semibold text-slate-800">${day.date.toLocaleDateString('ru-RU', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                        <div class="text-sm text-slate-600">${Math.round(day.weather.main.temp)}°C</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-lg" style="color: ${day.biteForecast.biteLevel.color}">
                        ${Math.round(day.biteForecast.biteFactor * 10)}/10
                    </div>
                    <div class="text-xs text-slate-500">${day.biteForecast.biteLevel.text}</div>
                </div>
            </div>
        `).join('');
    }

    // Display recommendations
    displayRecommendations(recommendations) {
        const container = document.getElementById('recommendations-container');
        if (!container || !recommendations) return;

        container.innerHTML = recommendations.map(rec => `
            <div class="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div class="w-6 h-6 bg-lake-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <p class="text-slate-700">${rec}</p>
            </div>
        `).join('');
    }

    // Get weather icon
    getWeatherIcon(iconCode) {
        const iconMap = {
            '01d': '☀️', '01n': '🌙',
            '02d': '⛅', '02n': '☁️',
            '03d': '☁️', '03n': '☁️',
            '04d': '☁️', '04n': '☁️',
            '09d': '🌧️', '09n': '🌧️',
            '10d': '🌦️', '10n': '🌧️',
            '11d': '⛈️', '11n': '⛈️',
            '13d': '❄️', '13n': '❄️',
            '50d': '🌫️', '50n': '🌫️'
        };
        return iconMap[iconCode] || '🌡️';
    }

    // Get wind direction
    getWindDirection(degrees) {
        const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
        return directions[Math.round(degrees / 45) % 8];
    }

    // Display weather error
    displayWeatherError() {
        const container = document.getElementById('current-bite-forecast');
        if (container) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <div class="text-4xl mb-4">🌡️</div>
                    <p class="text-slate-600">Данные о погоде временно недоступны</p>
                    <p class="text-sm text-slate-500 mt-2">Попробуйте обновить страницу позже</p>
                </div>
            `;
        }
    }

    // Get lakes data
    getLakesData() {
        return [
            {
                name: 'Озеро Селигер',
                region: 'Тверская область',
                lat: 57.2217,
                lng: 33.2206,
                fish: ['Щука', 'Окунь', 'Лещ'],
                fishType: 'pike',
                rating: 4.8,
                bestTime: 'Май-Октябрь',
                seasons: ['spring', 'summer', 'autumn']
            },
            {
                name: 'Озеро Байкал',
                region: 'Иркутская область',
                lat: 53.5587,
                lng: 108.1649,
                fish: ['Омуль', 'Хариус', 'Таймень'],
                fishType: 'salmon',
                rating: 4.9,
                bestTime: 'Июнь-Сентябрь',
                seasons: ['summer', 'autumn']
            },
            {
                name: 'Дельта Волги',
                region: 'Астраханская область',
                lat: 45.8038,
                lng: 47.3736,
                fish: ['Сазан', 'Сом', 'Судак'],
                fishType: 'carp',
                rating: 4.7,
                bestTime: 'Апрель-Октябрь',
                seasons: ['spring', 'summer', 'autumn']
            },
            {
                name: 'Озеро Ладожское',
                region: 'Карелия',
                lat: 61.1097,
                lng: 32.0280,
                fish: ['Щука', 'Окунь', 'Судак'],
                fishType: 'perch',
                rating: 4.6,
                bestTime: 'Май-Сентябрь',
                seasons: ['spring', 'summer', 'autumn']
            },
            {
                name: 'Озеро Онежское',
                region: 'Карелия',
                lat: 62.0000,
                lng: 36.5000,
                fish: ['Лосось', 'Хариус', 'Щука'],
                fishType: 'salmon',
                rating: 4.5,
                bestTime: 'Июнь-Сентябрь',
                seasons: ['summer', 'autumn']
            },
            {
                name: 'Рыбинское водохранилище',
                region: 'Ярославская область',
                lat: 58.0000,
                lng: 38.0000,
                fish: ['Щука', 'Окунь', 'Лещ'],
                fishType: 'bream',
                rating: 4.4,
                bestTime: 'Апрель-Октябрь',
                seasons: ['spring', 'summer', 'autumn']
            },
            {
                name: 'Озеро Ильмень',
                region: 'Новгородская область',
                lat: 58.2167,
                lng: 31.3333,
                fish: ['Щука', 'Окунь', 'Карп'],
                fishType: 'carp',
                rating: 4.3,
                bestTime: 'Май-Сентябрь',
                seasons: ['spring', 'summer', 'autumn']
            },
            {
                name: 'Куйбышевское водохранилище',
                region: 'Самарская область',
                lat: 53.5000,
                lng: 50.0000,
                fish: ['Судак', 'Щука', 'Окунь'],
                fishType: 'perch',
                rating: 4.2,
                bestTime: 'Май-Октябрь',
                seasons: ['spring', 'summer', 'autumn']
            }
        ];
    }

    // Get fish types data
    getFishTypes() {
        return {
            'pike': {
                name: 'Щука',
                color: '#1e3a8a',
                seasons: ['spring', 'autumn', 'winter'],
                bait: ['Воблеры', 'Блесны', 'Живец']
            },
            'perch': {
                name: 'Окунь',
                color: '#f97316',
                seasons: ['spring', 'summer', 'autumn', 'winter'],
                bait: ['Мормышки', 'Блесны', 'Черви']
            },
            'carp': {
                name: 'Карп',
                color: '#059669',
                seasons: ['spring', 'summer', 'autumn'],
                bait: ['Кукуруза', 'Черви', 'Бойлы']
            },
            'bream': {
                name: 'Лещ',
                color: '#7c3aed',
                seasons: ['spring', 'summer', 'autumn'],
                bait: ['Черви', 'Мотыль', 'Пареная кукуруза']
            },
            'salmon': {
                name: 'Лосось',
                color: '#dc2626',
                seasons: ['summer', 'autumn'],
                bait: ['Мушки', 'Блесны', 'Воблеры']
            }
        };
    }
}

// Utility functions
function scrollToMap() {
    const mapSection = document.getElementById('map-section');
    if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function searchLakes() {
    if (window.fishGuideApp) {
        window.fishGuideApp.searchLakes();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.fishGuideApp = new FishGuideApp();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FishGuideApp;
}