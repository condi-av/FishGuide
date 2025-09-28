// src/main.js - основной файл приложения

class FishGuideApp {
    constructor() {
        this.weatherService = new WeatherService();
        this.init();
    }
    
    init() {
        console.log('FishGuideApp инициализирован!');
        this.initMap();
        this.loadWeatherData();
        this.setupEventListeners();
    }
    
    initMap() {
        // Простая инициализация карты для тестирования
        const map = L.map('map').setView([55.7558, 37.6173], 5);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        console.log('Карта инициализирована');
    }
    
    async loadWeatherData() {
        try {
            // Тестовые координаты (Москва)
            const conditions = await this.weatherService.getDetailedConditions(55.7558, 37.6173);
            if (conditions) {
                this.updateWeatherUI(conditions);
            }
        } catch (error) {
            console.error('Ошибка загрузки погоды:', error);
        }
    }
    
    updateWeatherUI(conditions) {
        const current = conditions.current;
        
        // Обновляем текущую погоду
        if (current.weather) {
            document.getElementById('current-temp').textContent = `${Math.round(current.weather.main.temp)}°C`;
            document.getElementById('current-weather-desc').textContent = current.weather.weather[0].description;
            document.getElementById('current-pressure').textContent = `${current.weather.main.pressure} мм`;
            document.getElementById('current-wind').textContent = `${current.weather.wind.speed} м/с`;
        }
        
        // Обновляем прогноз клева
        if (current.biteForecast) {
            const bite = current.biteForecast;
            const biteElement = document.getElementById('current-bite-forecast');
            biteElement.innerHTML = `
                <div class="bg-${bite.biteLevel.level === 'excellent' ? 'green' : 
                                 bite.biteLevel.level === 'good' ? 'lime' :
                                 bite.biteLevel.level === 'average' ? 'yellow' :
                                 bite.biteLevel.level === 'poor' ? 'orange' : 'red'}-100 
                        p-4 rounded-xl">
                    <div class="flex items-center justify-between mb-2">
                        <span class="font-semibold text-slate-800">Клев: ${bite.biteLevel.text}</span>
                        <span class="text-2xl font-bold" style="color: ${bite.biteLevel.color}">
                            ${Math.round(bite.biteFactor * 100)}%
                        </span>
                    </div>
                    <div class="text-sm text-slate-600">
                        Вода: ${Math.round(bite.waterTemperature)}°C • 
                        Время: ${bite.timeOfDay} • 
                        Луна: ${bite.moonPhase.emoji}
                    </div>
                </div>
            `;
        }
        
        // Обновляем рекомендации
        if (conditions.recommendations) {
            const recContainer = document.getElementById('recommendations-container');
            recContainer.innerHTML = conditions.recommendations
                .map(rec => `<div class="flex items-center space-x-2">
                    <span class="w-2 h-2 bg-lake-blue rounded-full"></span>
                    <span class="text-slate-700">${rec}</span>
                </div>`)
                .join('');
        }
    }
    
    setupEventListeners() {
        // Добавляем обработчики событий
        console.log('Обработчики событий установлены');
    }
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    new FishGuideApp();
});
