// Weather service and fishing forecast module
// ✅ Защита от дублирования: если класс уже объявлен — не объявляем повторно
if (typeof WeatherService === 'undefined') {

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

    /* ---------- API ---------- */

    async getCurrentWeather(lat, lng) {
      try {
        const res = await fetch(`${this.baseUrl}/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric&lang=ru`);
        if (!res.ok) throw new Error('Weather API error');
        return await res.json();
      } catch (e) {
        console.warn('⚠️ Ошибка загрузки текущей погоды:', e);
        return null;
      }
    }

    async getWeatherForecast(lat, lng) {
      try {
        const res = await fetch(`${this.baseUrl}/forecast?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric&lang=ru`);
        if (!res.ok) throw new Error('Forecast API error');
        return await res.json();
      } catch (e) {
        console.warn('⚠️ Ошибка загрузки прогноза:', e);
        return null;
      }
    }

    /* ---------- Moon & Helpers ---------- */

    calculateMoonPhase(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const c = Math.floor((year - 1900) / 100);
      const e = 2 * (year - 1900 - 100 * c);
      const f = Math.floor((146097 * c) / 4) + Math.floor((1461 * e) / 4) + Math.floor((153 * (month + 12 * ((14 - month) / 12) - 3) + 2) / 5) + day + 1721119;
      const phase = ((f - 2451550.1) / 29.530588853) % 1;
      const idx = Math.floor(phase * 8) % 8;
      return this.moonPhases[idx];
    }

    /* ---------- Bite Forecast Core ---------- */

    calculateBiteForecast(weatherData, fishType = 'general') {
      if (!weatherData || !weatherData.main || !weatherData.weather?.[0] || !weatherData.wind) {
        console.warn('⚠️ Некорректные данные погоды для расчёта клева');
        return null;
      }

      const { main, weather, wind, dt } = weatherData;
      const date = new Date(dt * 1000);
      let biteFactor = 0.5;

      const temp = main.temp;
      const waterTemp = this.estimateWaterTemperature(temp);
      const optimal = this.getOptimalTemp(fishType);
      biteFactor *= this.calculateTemperatureFactor(waterTemp, optimal);

      biteFactor *= this.calculatePressureFactor(main.pressure);
      biteFactor *= this.calculateWeatherFactor(weather[0]);
      biteFactor *= this.calculateWindFactor(wind.speed);
      biteFactor *= this.calculateTimeFactor(date);
      biteFactor *= this.calculateMoonPhase(date).biteFactor;

      biteFactor = Math.max(0.1, Math.min(1.0, biteFactor));

      return {
        biteFactor: Math.round(biteFactor * 100) / 100,
        biteLevel: this.getBiteLevel(biteFactor),
        temperature: temp,
        waterTemperature: waterTemp,
        pressure: main.pressure,
        weather: weather[0],
        windSpeed: wind.speed,
        moonPhase: this.calculateMoonPhase(date),
        timeOfDay: this.getTimeOfDay(date),
        recommendations: this.getBiteRecommendations(biteFactor, fishType)
      };
    }

    estimateWaterTemperature(airTemp) {
      if (airTemp < 0) return Math.max(0, airTemp + 2);
      if (airTemp < 10) return airTemp + 1;
      if (airTemp < 20) return airTemp - 1;
      return Math.min(25, airTemp - 3);
    }

    getOptimalTemp(fishType) {
      const map = {
        pike: { min: 8, max: 18, optimal: 12 },
        perch: { min: 6, max: 20, optimal: 15 },
        carp: { min: 15, max: 25, optimal: 20 },
        bream: { min: 10, max: 22, optimal: 16 },
        salmon: { min: 4, max: 12, optimal: 8 },
        catfish: { min: 12, max: 28, optimal: 22 },
        general: { min: 10, max: 20, optimal: 15 }
      };
      return map[fishType] || map.general;
    }

    calculateTemperatureFactor(waterTemp, range) {
      if (waterTemp < range.min || waterTemp > range.max) return 0.3;
      const dist = Math.abs(waterTemp - range.optimal);
      const maxDist = Math.max(range.optimal - range.min, range.max - range.optimal);
      return 1 - (dist / maxDist) * 0.5;
    }

    calculatePressureFactor(pressure) {
      const optimal = 1016;
      const dev = Math.abs(pressure - optimal);
      if (dev > 20) return 0.5;
      if (dev > 10) return 0.8;
      return 1.0;
    }

    calculateWeatherFactor(weather) {
      const map = {
        '01d': 1.0, '01n': 1.1, '02d': 0.9, '02n': 1.0, '03d': 0.8, '03n': 0.9,
        '04d': 0.7, '04n': 0.8, '09d': 0.6, '09n': 0.7, '10d': 0.5, '10n': 0.6,
        '11d': 0.3, '11n': 0.4, '13d': 0.4, '13n': 0.5, '50d': 0.6, '50n': 0.7
      };
      return map[weather.icon] || 0.8;
    }

    calculateWindFactor(speed) {
      if (speed < 2) return 1.0;
      if (speed < 5) return 0.9;
      if (speed < 10) return 0.7;
      if (speed < 15) return 0.5;
      return 0.3;
    }

    calculateTimeFactor(date) {
      const h = date.getHours();
      if (h >= 5 && h <= 7) return 1.3;
      if (h >= 17 && h <= 19) return 1.2;
      if (h >= 20 || h <= 4) return 1.1;
      if (h >= 10 && h <= 16) return 0.7;
      return 0.9;
    }

    getTimeOfDay(date) {
      const h = date.getHours();
      if (h >= 5 && h < 12) return 'Утро';
      if (h >= 12 && h < 18) return 'День';
      if (h >= 18 && h < 22) return 'Вечер';
      return 'Ночь';
    }

    getBiteLevel(biteFactor) {
      if (biteFactor >= 0.8) return { level: 'excellent', text: 'Отличный', color: '#22c55e' };
      if (biteFactor >= 0.6) return { level: 'good', text: 'Хороший', color: '#84cc16' };
      if (biteFactor >= 0.4) return { level: 'average', text: 'Средний', color: '#f59e0b' };
      if (biteFactor >= 0.2) return { level: 'poor', text: 'Плохой', color: '#ef4444' };
      return { level: 'very-poor', text: 'Очень плохой', color: '#dc2626' };
    }

    getBiteRecommendations(biteFactor, fishType) {
      const map = {
        excellent: ['Идеальные условия!', 'Рыба активна', 'Шанс на трофей'],
        good: ['Хорошие условия', 'Используйте активную проводку', 'Попробуйте разные глубины'],
        average: ['Умеренный клев', 'Проверенные насадки', 'Ловите на глубине'],
        poor: ['Сложные условия', 'Терпение', 'Естественные насадки'],
        'very-poor': ['Лучше перенести', 'Закормленные места']
      };
      const level = this.getBiteLevel(biteFactor).level;
      return map[level] || map.average;
    }

    findClosestForecast(list, targetTimestamp) {
      if (!Array.isArray(list)) return null;
      let closest = null;
      let minDiff = Infinity;
      for (const f of list) {
        if (f?.dt) {
          const diff = Math.abs(f.dt - targetTimestamp);
          if (diff < minDiff) {
            minDiff = diff;
            closest = f;
          }
        }
      }
      return closest;
    }

    async generateFishingForecast(lat, lng, days = 3, fishType = 'general') {
      const data = await this.getWeatherForecast(lat, lng);
      if (!data || !Array.isArray(data.list)) {
        console.warn('⚠️ Нет прогноза погоды');
        return null;
      }
      const forecast = [];
      const today = new Date();
      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const target = Math.floor(date.getTime() / 1000);
        const closest = this.findClosestForecast(data.list, target);
        if (closest) {
          const bite = this.calculateBiteForecast(closest, fishType);
          if (bite) forecast.push({ date, weather: closest, biteForecast: bite });
        }
      }
      return forecast.length ? forecast : null;
    }

    async getDetailedConditions(lat, lng, fishType = 'general') {
      const current = await this.getCurrentWeather(lat, lng);
      const forecast = await this.generateFishingForecast(lat, lng, 3, fishType);
      if (!current) return null;
      const currentBite = this.calculateBiteForecast(current, fishType);
      return {
        current: { weather: current, biteForecast: currentBite },
        forecast: forecast,
        recommendations: this.getOverallRecommendations(currentBite, forecast)
      };
    }

    getOverallRecommendations(currentBite, forecast) {
      const rec = [];
      if (currentBite?.biteFactor >= 0.7) rec.push('Сейчас отличное время для рыбалки!');
      else if (currentBite?.biteFactor <= 0.3) rec.push('Сейчас не лучшее время.');
      if (forecast?.length > 0) {
        const best = forecast.reduce((b, d) => d.biteForecast.biteFactor > b.biteForecast.biteFactor ? d : b);
        rec.push(`Лучший день в прогнозе: ${best.date.toLocaleDateString('ru-RU')}`);
        const pressures = forecast.map(d => d.weather.main.pressure);
        const trend = this.calculatePressureTrend(pressures);
        if (trend === 'rising') rec.push('Рост давления улучшит клев');
        if (trend === 'falling') rec.push('Падение давления может ухудшить клев');
      }
      return rec;
    }
  }

  // ✅ Экспортируем глобально, если ещё не объявлено
  if (typeof WeatherService === 'undefined') {
    window.WeatherService = WeatherService;
  }

} // конец if (typeof WeatherService === 'undefined')
