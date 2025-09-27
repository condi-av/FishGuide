// Weather service and fishing forecast module
class WeatherService {
    constructor(apiKey) {
        this.apiKey = apiKey || 'd192e284d050cbe679c3641f372e7a02';
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.forecastCache = new Map();
        this.moonPhases = [
            { name: 'Новолуние', emoji: '🌑', biteFactor: 0.7 },
            { name: 'Молодая луна', emoji: '🌒', biteFactor: 0.8 },
            { name: 'Первая четверть', emoji: '🌓', biteFactor: 0.9 },
            { name: 'Растущая луна', emoji: '🌔', biteFactor: 1.0 },
            { name: 'Полнолуние', emoji: '🌕', biteFactor: 0.6 },
            { name: 'Убывающая луна', emoji: '🌖', biteFactor: 1.1 },
            { name: 'Последняя четверть', emoji: '🌗', biteFactor: 1.0 },
            { name: 'Старая луна', emoji: '🌘', biteFactor: 0.9 }
        ];
    }

    // Get current weather data
    async getCurrentWeather(lat, lng) {
        try {
            const response = await fetch(`${this.baseUrl}/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric&lang=ru`);
            if (!response.ok) throw new Error('Weather API error');
            return await response.json();
        } catch (error) {
            console.error('Error fetching current weather:', error);
            return null;
        }
    }

    // Get 5-day weather forecast
    async getWeatherForecast(lat, lng) {
        try {
            const response = await fetch(`${this.baseUrl}/forecast?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric&lang=ru`);
            if (!response.ok) throw new Error('Weather API error');
            return await response.json();
        } catch (error) {
            console.error('Error fetching weather forecast:', error);
            return null;
        }
    }

    // Calculate moon phase for a given date
    calculateMoonPhase(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        // Simplified moon phase calculation
        const c = Math.floor((year - 1900) / 100);
        const e = 2 * (year - 1900 - 100 * c);
        const f = Math.floor((146097 * c) / 4) + Math.floor((1461 * e) / 4) + Math.floor((153 * (month + 12 * Math.floor((14 - month) / 12) - 3) + 2) / 5) + day + 1721119;
        const phase = ((f - 2451550.1) / 29.530588853) % 1;
        const phaseIndex = Math.floor(phase * 8);
        
        return this.moonPhases[phaseIndex];
    }

    // Calculate atmospheric pressure trend
    calculatePressureTrend(pressureHistory) {
        if (pressureHistory.length < 2) return 'stable';
        
        const recent = pressureHistory.slice(-3);
        const trend = recent[recent.length - 1] - recent[0];
        
        if (trend > 3) return 'rising';
        if (trend < -3) return 'falling';
        return 'stable';
    }

    // Calculate fishing bite forecast based on multiple factors
    calculateBiteForecast(weatherData, fishType = 'general') {
        if (!weatherData) return null;

        const { main, weather, wind, dt } = weatherData;
        const currentTime = new Date(dt * 1000);
        
        // Base bite factor (0.0 - 1.0)
        let biteFactor = 0.5;

        // Temperature factor
        const temp = main.temp;
        const tempWater = this.estimateWaterTemperature(temp);
        
        // Optimal temperature ranges for different fish types
        const optimalTemps = {
            pike: { min: 8, max: 18, optimal: 12 },
            perch: { min: 6, max: 20, optimal: 15 },
            carp: { min: 15, max: 25, optimal: 20 },
            bream: { min: 10, max: 22, optimal: 16 },
            salmon: { min: 4, max: 12, optimal: 8 },
            catfish: { min: 12, max: 28, optimal: 22 },
            general: { min: 10, max: 20, optimal: 15 }
        };

        const fishTemp = optimalTemps[fishType] || optimalTemps.general;
        const tempFactor = this.calculateTemperatureFactor(tempWater, fishTemp);
        biteFactor *= tempFactor;

        // Pressure factor
        const pressure = main.pressure;
        const pressureFactor = this.calculatePressureFactor(pressure);
        biteFactor *= pressureFactor;

        // Weather conditions factor
        const weatherFactor = this.calculateWeatherFactor(weather[0]);
        biteFactor *= weatherFactor;

        // Wind factor
        const windSpeed = wind.speed;
        const windFactor = this.calculateWindFactor(windSpeed);
        biteFactor *= windFactor;

        // Time of day factor
        const timeFactor = this.calculateTimeFactor(currentTime);
        biteFactor *= timeFactor;

        // Moon phase factor
        const moonPhase = this.calculateMoonPhase(currentTime);
        biteFactor *= moonPhase.biteFactor;

        // Ensure bite factor is between 0.1 and 1.0
        biteFactor = Math.max(0.1, Math.min(1.0, biteFactor));

        return {
            biteFactor: Math.round(biteFactor * 100) / 100,
            biteLevel: this.getBiteLevel(biteFactor),
            temperature: temp,
            waterTemperature: tempWater,
            pressure: pressure,
            weather: weather[0],
            windSpeed: windSpeed,
            moonPhase: moonPhase,
            timeOfDay: this.getTimeOfDay(currentTime),
            recommendations: this.getBiteRecommendations(biteFactor, fishType)
        };
    }

    // Estimate water temperature based on air temperature
    estimateWaterTemperature(airTemp) {
        // Simplified water temperature estimation
        // Water temperature is usually more stable than air temperature
        if (airTemp < 0) return Math.max(0, airTemp + 2);
        if (airTemp < 10) return airTemp + 1;
        if (airTemp < 20) return airTemp - 1;
        return Math.min(25, airTemp - 3);
    }

    // Calculate temperature factor
    calculateTemperatureFactor(waterTemp, optimalRange) {
        if (waterTemp < optimalRange.min || waterTemp > optimalRange.max) {
            return 0.3; // Poor conditions
        }
        
        const distanceFromOptimal = Math.abs(waterTemp - optimalRange.optimal);
        const maxDistance = Math.max(optimalRange.optimal - optimalRange.min, optimalRange.max - optimalRange.optimal);
        
        return 1 - (distanceFromOptimal / maxDistance) * 0.5;
    }

    // Calculate pressure factor
    calculatePressureFactor(pressure) {
        // Optimal pressure range: 1013-1020 hPa
        const optimalPressure = 1016;
        const deviation = Math.abs(pressure - optimalPressure);
        
        if (deviation > 20) return 0.5;
        if (deviation > 10) return 0.8;
        return 1.0;
    }

    // Calculate weather conditions factor
    calculateWeatherFactor(weather) {
        const weatherConditions = {
            '01d': 1.0, // Clear sky day
            '01n': 1.1, // Clear sky night
            '02d': 0.9, // Few clouds day
            '02n': 1.0, // Few clouds night
            '03d': 0.8, // Scattered clouds
            '03n': 0.9,
            '04d': 0.7, // Broken clouds
            '04n': 0.8,
            '09d': 0.6, // Shower rain
            '09n': 0.7,
            '10d': 0.5, // Rain
            '10n': 0.6,
            '11d': 0.3, // Thunderstorm
            '11n': 0.4,
            '13d': 0.4, // Snow
            '13n': 0.5,
            '50d': 0.6, // Mist
            '50n': 0.7
        };
        
        return weatherConditions[weather.icon] || 0.8;
    }

    // Calculate wind factor
    calculateWindFactor(windSpeed) {
        if (windSpeed < 2) return 1.0; // Calm
        if (windSpeed < 5) return 0.9; // Light breeze
        if (windSpeed < 10) return 0.7; // Moderate breeze
        if (windSpeed < 15) return 0.5; // Strong breeze
        return 0.3; // Very windy
    }

    // Calculate time of day factor
    calculateTimeFactor(date) {
        const hour = date.getHours();
        
        // Best times: dawn (5-7), dusk (17-19), night (20-4)
        if (hour >= 5 && hour <= 7) return 1.3; // Dawn
        if (hour >= 17 && hour <= 19) return 1.2; // Dusk
        if (hour >= 20 || hour <= 4) return 1.1; // Night
        if (hour >= 10 && hour <= 16) return 0.7; // Midday
        return 0.9; // Morning/Evening
    }

    // Get time of day string
    getTimeOfDay(date) {
        const hour = date.getHours();
        if (hour >= 5 && hour < 12) return 'Утро';
        if (hour >= 12 && hour < 18) return 'День';
        if (hour >= 18 && hour < 22) return 'Вечер';
        return 'Ночь';
    }

    // Get bite level description
    getBiteLevel(biteFactor) {
        if (biteFactor >= 0.8) return { level: 'excellent', text: 'Отличный', color: '#22c55e' };
        if (biteFactor >= 0.6) return { level: 'good', text: 'Хороший', color: '#84cc16' };
        if (biteFactor >= 0.4) return { level: 'average', text: 'Средний', color: '#f59e0b' };
        if (biteFactor >= 0.2) return { level: 'poor', text: 'Плохой', color: '#ef4444' };
        return { level: 'very-poor', text: 'Очень плохой', color: '#dc2626' };
    }

    // Get bite recommendations
    getBiteRecommendations(biteFactor, fishType) {
        const recommendations = {
            excellent: [
                'Идеальные условия для рыбалки!',
                'Рыба активна, используйте разные приманки',
                'Хорошее время для крупных трофеев'
            ],
            good: [
                'Хорошие условия для рыбалки',
                'Рекомендуется активная проводка',
                'Попробуйте разные глубины'
            ],
            average: [
                'Умеренные условия',
                'Используйте проверенные насадки',
                'Лучше ловить на глубине'
            ],
            poor: [
                'Сложные условия',
                'Рекомендуется терпение',
                'Используйте естественные насадки'
            ],
            'very-poor': [
                'Очень сложные условия',
                'Лучше перенести рыбалку',
                'Если ловить - только на закормленные места'
            ]
        };

        const level = this.getBiteLevel(biteFactor).level;
        return recommendations[level] || recommendations.average;
    }

    // Generate fishing forecast for multiple days
    async generateFishingForecast(lat, lng, days = 5, fishType = 'general') {
        const forecastData = await this.getWeatherForecast(lat, lng);
        if (!forecastData) return null;

        const forecast = [];
        const today = new Date();

        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);

            // Find closest forecast for this date
            const targetTimestamp = Math.floor(date.getTime() / 1000);
            const closestForecast = this.findClosestForecast(forecastData.list, targetTimestamp);

            if (closestForecast) {
                const biteForecast = this.calculateBiteForecast(closestForecast, fishType);
                forecast.push({
                    date: date,
                    weather: closestForecast,
                    biteForecast: biteForecast
                });
            }
        }

        return forecast;
    }

    // Find closest weather forecast for a given timestamp
    findClosestForecast(forecastList, targetTimestamp) {
        let closest = null;
        let minDiff = Infinity;

        for (const forecast of forecastList) {
            const diff = Math.abs(forecast.dt - targetTimestamp);
            if (diff < minDiff) {
                minDiff = diff;
                closest = forecast;
            }
        }

        return closest;
    }

    // Get detailed weather and fishing conditions
    async getDetailedConditions(lat, lng, fishType = 'general') {
        const currentWeather = await this.getCurrentWeather(lat, lng);
        const forecast = await this.generateFishingForecast(lat, lng, 3, fishType);

        if (!currentWeather) return null;

        const currentBite = this.calculateBiteForecast(currentWeather, fishType);

        return {
            current: {
                weather: currentWeather,
                biteForecast: currentBite
            },
            forecast: forecast,
            recommendations: this.getOverallRecommendations(currentBite, forecast)
        };
    }

    // Get overall recommendations based on current and forecast conditions
    getOverallRecommendations(currentBite, forecast) {
        const recommendations = [];

        // Current conditions
        if (currentBite.biteForecast.biteFactor >= 0.7) {
            recommendations.push('Сейчас отличное время для рыбалки!');
        } else if (currentBite.biteForecast.biteFactor <= 0.3) {
            recommendations.push('Сейчас не лучшее время для рыбалки.');
        }

        // Best days in forecast
        if (forecast && forecast.length > 0) {
            const bestDay = forecast.reduce((best, day) => 
                day.biteForecast.biteFactor > best.biteForecast.biteFactor ? day : best
            );
            
            recommendations.push(`Лучший день в прогнозе: ${bestDay.date.toLocaleDateString('ru-RU')}`);
        }

        // Weather trends
        if (forecast && forecast.length >= 2) {
            const pressureTrend = this.calculatePressureTrend(forecast.map(d => d.weather.main.pressure));
            if (pressureTrend === 'rising') {
                recommendations.push('Рост давления улучшит клев');
            } else if (pressureTrend === 'falling') {
                recommendations.push('Падение давления может ухудшить клев');
            }
        }

        return recommendations;
    }

    // Cache management
    setCache(key, data, ttl = 3600000) { // 1 hour default
        this.forecastCache.set(key, {
            data: data,
            expiry: Date.now() + ttl
        });
    }

    getCache(key) {
        const cached = this.forecastCache.get(key);
        if (!cached) return null;
        
        if (Date.now() > cached.expiry) {
            this.forecastCache.delete(key);
            return null;
        }
        
        return cached.data;
    }

    // Clear expired cache entries
    clearExpiredCache() {
        const now = Date.now();
        for (const [key, cached] of this.forecastCache.entries()) {
            if (now > cached.expiry) {
                this.forecastCache.delete(key);
            }
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherService;
}