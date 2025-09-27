// Fish guide page functionality
class FishGuidePage {
    constructor() {
        this.fishData = this.getFishData();
        this.filteredFish = [...this.fishData];
        this.currentCategory = 'all';
        this.currentSort = 'name';
        this.searchQuery = '';
        this.init();
    }

    init() {
        this.initMobileMenu();
        this.initSearch();
        this.initFilters();
        this.initSort();
        this.renderFishGrid();
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

    // Initialize search functionality
    initSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }
    }

    // Initialize category filters
    initFilters() {
        const filterButtons = document.querySelectorAll('.category-filter');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update current category
                this.currentCategory = e.target.dataset.category;
                this.applyFilters();
            });
        });
    }

    // Initialize sort functionality
    initSort() {
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applyFilters();
            });
        }
    }

    // Apply all filters and search
    applyFilters() {
        let filtered = [...this.fishData];

        // Apply category filter
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(fish => fish.category === this.currentCategory);
        }

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(fish => 
                fish.name.toLowerCase().includes(this.searchQuery) ||
                fish.scientificName.toLowerCase().includes(this.searchQuery) ||
                fish.description.toLowerCase().includes(this.searchQuery) ||
                fish.habitat.toLowerCase().includes(this.searchQuery)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'difficulty':
                    const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
                    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
                case 'popularity':
                    return b.popularity - a.popularity;
                default:
                    return 0;
            }
        });

        this.filteredFish = filtered;
        this.renderFishGrid();
        this.updateResultsCount();
    }

    // Render fish grid
    renderFishGrid() {
        const container = document.getElementById('fish-container');
        if (!container) return;

        container.innerHTML = '';

        this.filteredFish.forEach((fish, index) => {
            const fishCard = this.createFishCard(fish, index);
            container.appendChild(fishCard);
        });

        // Animate cards
        anime({
            targets: '.fish-card',
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(100),
            duration: 600,
            easing: 'easeOutQuad'
        });
    }

    // Create fish card element
    createFishCard(fish, index) {
        const card = document.createElement('div');
        card.className = 'fish-card bg-white rounded-2xl shadow-lg overflow-hidden';
        card.style.opacity = '0';
        
        const difficultyColors = {
            easy: 'difficulty-easy',
            medium: 'difficulty-medium',
            hard: 'difficulty-hard'
        };

        const difficultyLabels = {
            easy: 'Легко',
            medium: 'Средне',
            hard: 'Сложно'
        };

        card.innerHTML = `
            <div class="h-48 bg-gradient-to-br ${fish.gradient} relative">
                <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-6xl">${fish.emoji}</span>
                </div>
                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span class="text-sm font-semibold text-slate-700">${fish.popularity}/5 ⭐</span>
                </div>
                <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span class="text-xs font-medium text-slate-700">${fish.category === 'predatory' ? 'Хищная' : fish.category === 'peaceful' ? 'Мирная' : 'Редкая'}</span>
                </div>
            </div>
            
            <div class="p-6">
                <h3 class="font-display text-xl font-bold text-slate-800 mb-2">${fish.name}</h3>
                <p class="text-sm text-slate-500 mb-3 italic">${fish.scientificName}</p>
                
                <div class="space-y-2 mb-4">
                    <div class="flex items-center text-sm text-slate-600">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        ${fish.habitat}
                    </div>
                    <div class="flex items-center text-sm text-slate-600">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                        <span class="${difficultyColors[fish.difficulty]}">${difficultyLabels[fish.difficulty]}</span>
                    </div>
                </div>
                
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                        <span class="text-sm text-slate-600">Сезон:</span>
                        <div class="flex space-x-1">
                            ${fish.seasons.map(season => `
                                <div class="season-indicator season-${season}" title="${this.getSeasonName(season)}"></div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <p class="text-sm text-slate-600 mb-4 line-clamp-3">${fish.description}</p>
                
                <button onclick="showFishDetails('${fish.id}')" class="w-full bg-lake-blue hover:bg-blue-800 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300">
                    Подробнее
                </button>
            </div>
        `;

        return card;
    }

    // Get season name
    getSeasonName(season) {
        const seasonNames = {
            spring: 'Весна',
            summer: 'Лето',
            autumn: 'Осень',
            winter: 'Зима'
        };
        return seasonNames[season] || season;
    }

    // Update results count
    updateResultsCount() {
        const countElement = document.getElementById('results-count');
        if (countElement) {
            countElement.textContent = this.filteredFish.length;
        }
    }

    // Get fish data
    getFishData() {
        return [
            {
                id: 'pike',
                name: 'Щука',
                scientificName: 'Esox lucius',
                emoji: '🐟',
                gradient: 'from-blue-400 to-blue-600',
                category: 'predatory',
                difficulty: 'medium',
                popularity: 5,
                seasons: ['spring', 'autumn', 'winter'],
                habitat: 'Реки, озера, водохранилища',
                description: 'Крупная хищная рыба с вытянутым телом и острыми зубами. Известна своей агрессивностью и силой.',
                size: 'До 150 см, вес до 35 кг',
                lifespan: '15-25 лет',
                diet: 'Рыба, лягушки, мелкие млекопитающие',
                bestBait: 'Воблеры, блесны, живец',
                bestTime: 'Рассвет и закуск',
                tips: 'Лучше всего ловить в проводку с быстрой скоростью. Используйте металлические поводки.',
                regulations: 'Минимальный размер 45 см в большинстве регионов'
            },
            {
                id: 'perch',
                name: 'Окунь',
                scientificName: 'Perca fluviatilis',
                emoji: '🐠',
                gradient: 'from-orange-400 to-red-500',
                category: 'predatory',
                difficulty: 'easy',
                popularity: 5,
                seasons: ['spring', 'summer', 'autumn', 'winter'],
                habitat: 'Реки, озера, пруды',
                description: 'Мелкая хищная рыба с характерными полосами на теле. Очень активна и распространена.',
                size: 'До 50 см, обычно 15-25 см',
                lifespan: '8-12 лет',
                diet: 'Мелкая рыба, рачки, насекомые',
                bestBait: 'Мормышки, блесны, черви',
                bestTime: 'Весь день, особенно утро',
                tips: 'Окунь любит стайную ловлю. Найдите одного - найдете десяток.',
                regulations: 'Без ограничений по размеру в большинстве регионов'
            },
            {
                id: 'carp',
                name: 'Карп',
                scientificName: 'Cyprinus carpio',
                emoji: '🐡',
                gradient: 'from-green-400 to-green-600',
                category: 'peaceful',
                difficulty: 'medium',
                popularity: 4,
                seasons: ['spring', 'summer', 'autumn'],
                habitat: 'Озера, пруды, медленные реки',
                description: 'Крупная мирная рыба с усиками. Очень осторожна и требует терпения в ловле.',
                size: 'До 120 см, вес до 40 кг',
                lifespan: '20-50 лет',
                diet: 'Растительная пища, моллюски, черви',
                bestBait: 'Кукуруза, бойлы, черви',
                bestTime: 'Ночь и раннее утро',
                tips: 'Карп очень осторожен. Минимальный шум и качественная прикормка обязательны.',
                regulations: 'Минимальный размер 30-50 см в зависимости от региона'
            },
            {
                id: 'bream',
                name: 'Лещ',
                scientificName: 'Abramis brama',
                emoji: '🐟',
                gradient: 'from-purple-400 to-purple-600',
                category: 'peaceful',
                difficulty: 'easy',
                popularity: 4,
                seasons: ['spring', 'summer', 'autumn'],
                habitat: 'Реки, озера, водохранилища',
                description: 'Высокая сжатая рыба серебристого цвета. Ценится за вкусное мясо и активный клев.',
                size: 'До 80 см, вес до 8 кг',
                lifespan: '15-20 лет',
                diet: 'Черви, моллюски, растительная пища',
                bestBait: 'Черви, мотыль, опарыш',
                bestTime: 'Утро и вечер',
                tips: 'Лещ предпочитает глубокие участки с течением. Используйте фидерную снасть.',
                regulations: 'Без ограничений по размеру в большинстве регионов'
            },
            {
                id: 'salmon',
                name: 'Лосось',
                scientificName: 'Salmo salar',
                emoji: '🐟',
                gradient: 'from-pink-400 to-red-500',
                category: 'predatory',
                difficulty: 'hard',
                popularity: 5,
                seasons: ['summer', 'autumn'],
                habitat: 'Северные реки и озера',
                description: 'Ценная промысловая рыба, мигрирующая между морем и пресной водой.',
                size: 'До 150 см, вес до 40 кг',
                lifespan: '3-8 лет',
                diet: 'Рыба, ракообразные, насекомые',
                bestBait: 'Мушки, блесны, воблеры',
                bestTime: 'Рассвет и закуск',
                tips: 'Требует специальной лицензии. Лучше всего ловить нахлыстом в чистой воде.',
                regulations: 'Требуется специальная лицензия, строгие ограничения'
            },
            {
                id: 'catfish',
                name: 'Сом',
                scientificName: 'Silurus glanis',
                emoji: '🐟',
                gradient: 'from-gray-400 to-gray-600',
                category: 'predatory',
                difficulty: 'hard',
                popularity: 4,
                seasons: ['spring', 'summer', 'autumn'],
                habitat: 'Крупные реки и озера',
                description: 'Крупная хищная рыба с усиками. Активна ночью и предпочитает глубокие ямы.',
                size: 'До 500 см, вес до 300 кг',
                lifespan: '30-60 лет',
                diet: 'Рыба, лягушки, птицы, мелкие млекопитающие',
                bestBait: 'Крупные воблеры, силикон, живец',
                bestTime: 'Ночь',
                tips: 'Сом - ночной хищник. Используйте крупные приманки и мощную снасть.',
                regulations: 'Минимальный размер 70-100 см в зависимости от региона'
            },
            {
                id: 'pikeperch',
                name: 'Судак',
                scientificName: 'Sander lucioperca',
                emoji: '🐟',
                gradient: 'from-yellow-400 to-orange-500',
                category: 'predatory',
                difficulty: 'medium',
                popularity: 4,
                seasons: ['spring', 'autumn', 'winter'],
                habitat: 'Реки, озера, водохранилища',
                description: 'Хищная рыба с острыми зубами. Ценится за вкусное белое мясо.',
                size: 'До 130 см, вес до 20 кг',
                lifespan: '10-20 лет',
                diet: 'Рыба, ракообразные',
                bestBait: 'Воблеры, блесны, твистеры',
                bestTime: 'Ночь и раннее утро',
                tips: 'Судак любит глубокие ямы и перекаты. Используйте приманки на дне.',
                regulations: 'Минимальный размер 40-50 см в зависимости от региона'
            },
            {
                id: 'crucian',
                name: 'Карась',
                scientificName: 'Carassius carassius',
                emoji: '🐠',
                gradient: 'from-amber-400 to-orange-500',
                category: 'peaceful',
                difficulty: 'easy',
                popularity: 3,
                seasons: ['spring', 'summer', 'autumn'],
                habitat: 'Пруды, озера, медленные реки',
                description: 'Мирная рыба золотистого цвета. Очень вынослива и распространена.',
                size: 'До 45 см, обычно 15-25 см',
                lifespan: '10-15 лет',
                diet: 'Растительная пища, черви, насекомые',
                bestBait: 'Черви, хлеб, кукуруза',
                bestTime: 'Утро и вечер',
                tips: 'Карась неприхотлив и клюет на простые насадки. Отличная рыба для начинающих.',
                regulations: 'Без ограничений по размеру в большинстве регионов'
            },
            {
                id: 'roach',
                name: 'Плотва',
                scientificName: 'Rutilus rutilus',
                emoji: '🐟',
                gradient: 'from-teal-400 to-cyan-500',
                category: 'peaceful',
                difficulty: 'easy',
                popularity: 3,
                seasons: ['spring', 'summer', 'autumn', 'winter'],
                habitat: 'Реки, озера, пруды',
                description: 'Распространенная мирная рыба серебристого цвета с красными плавниками.',
                size: 'До 50 см, обычно 10-20 см',
                lifespan: '8-15 лет',
                diet: 'Растительная пища, мелкие беспозвоночные',
                bestBait: 'Мотыль, червь, хлеб',
                bestTime: 'Весь день',
                tips: 'Плотва клюет круглый год. Зимой активна и хорошо ловится на мормышки.',
                regulations: 'Без ограничений по размеру в большинстве регионов'
            },
            {
                id: 'ide',
                name: 'Язь',
                scientificName: 'Leuciscus idus',
                emoji: '🐟',
                gradient: 'from-indigo-400 to-blue-500',
                category: 'peaceful',
                difficulty: 'medium',
                popularity: 3,
                seasons: ['spring', 'summer', 'autumn'],
                habitat: 'Реки, озера',
                description: 'Крупная мирная рыба с серебристым блеском. Осторожна и требует мастерства.',
                size: 'До 80 см, вес до 8 кг',
                lifespan: '15-20 лет',
                diet: 'Растительная пища, насекомые, моллюски',
                bestBait: 'Мотыль, червь, растительные насадки',
                bestTime: 'Утро и вечер',
                tips: 'Язь очень осторожен. Используйте тонкие снасти и естественные насадки.',
                regulations: 'Без ограничений по размеру в большинстве регионов'
            },
            {
                id: 'asp',
                name: 'Жерех',
                scientificName: 'Aspius aspius',
                emoji: '🐟',
                gradient: 'from-green-400 to-teal-500',
                category: 'predatory',
                difficulty: 'hard',
                popularity: 4,
                seasons: ['spring', 'summer', 'autumn'],
                habitat: 'Большие реки',
                description: 'Быстрая хищная рыба, предпочитающая течение. Заносится в Красную книгу.',
                size: 'До 120 см, вес до 12 кг',
                lifespan: '15-20 лет',
                diet: 'Рыба, насекомые',
                bestBait: 'Блесны, воблеры, мушки',
                bestTime: 'Утро и вечер',
                tips: 'Жерех - рыба течения. Ловите на спиннинг с быстрой проводкой по течению.',
                regulations: 'Занесен в Красную книгу в ряде регионов, ловля ограничена'
            },
            {
                id: 'chub',
                name: 'Голавль',
                scientificName: 'Squalius cephalus',
                emoji: '🐟',
                gradient: 'from-yellow-400 to-green-500',
                category: 'peaceful',
                difficulty: 'medium',
                popularity: 3,
                seasons: ['spring', 'summer', 'autumn'],
                habitat: 'Быстрые реки и ручьи',
                description: 'Рыба семейства карповых, обитающая в чистых быстрых водах.',
                size: 'До 60 см, вес до 8 кг',
                lifespan: '12-15 лет',
                diet: 'Насекомые, ракообразные, растительная пища',
                bestBait: 'Мушки, натуральные насадки',
                bestTime: 'День',
                tips: 'Голавль любит чистую воду. Лучше всего ловить нахлыстом вверх по течению.',
                regulations: 'Без ограничений по размеру в большинстве регионов'
            },
            {
                id: 'tench',
                name: 'Линь',
                scientificName: 'Tinca tinca',
                emoji: '🐟',
                gradient: 'from-emerald-400 to-green-600',
                category: 'peaceful',
                difficulty: 'medium',
                popularity: 3,
                seasons: ['spring', 'summer', 'autumn'],
                habitat: 'Заросшие пруды и озера',
                description: 'Мирная рыба зеленовато-бурого цвета, обитающая в заросших водоемах.',
                size: 'До 70 см, вес до 10 кг',
                lifespan: '20-30 лет',
                diet: 'Черви, моллюски, растительная пища',
                bestBait: 'Черви, личинки, растительные насадки',
                bestTime: 'Ночь и раннее утро',
                tips: 'Линь обитает в заросших местах. Используйте тяжелые оснастки для доставки насадки.',
                regulations: 'Без ограничений по размеру в большинстве регионов'
            }
        ];
    }

    // Show fish details modal
    showFishDetails(fishId) {
        const fish = this.fishData.find(f => f.id === fishId);
        if (!fish) return;

        const modal = document.getElementById('fish-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalContent = document.getElementById('modal-content');

        modalTitle.textContent = fish.name;
        
        modalContent.innerHTML = `
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                    <div class="w-full h-64 bg-gradient-to-br ${fish.gradient} rounded-xl flex items-center justify-center mb-4">
                        <span class="text-8xl">${fish.emoji}</span>
                    </div>
                    
                    <div class="space-y-3">
                        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <span class="font-semibold text-slate-700">Категория</span>
                            <span class="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                ${fish.category === 'predatory' ? 'Хищная' : fish.category === 'peaceful' ? 'Мирная' : 'Редкая'}
                            </span>
                        </div>
                        
                        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <span class="font-semibold text-slate-700">Сложность ловли</span>
                            <span class="text-sm px-2 py-1 ${
                                fish.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                fish.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            } rounded-full">
                                ${fish.difficulty === 'easy' ? 'Легко' : fish.difficulty === 'medium' ? 'Средне' : 'Сложно'}
                            </span>
                        </div>
                        
                        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <span class="font-semibold text-slate-700">Популярность</span>
                            <div class="flex items-center">
                                <span class="text-sm font-medium text-slate-600">${fish.popularity}/5</span>
                                <span class="ml-1 text-yellow-400">⭐</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <div class="mb-6">
                        <h3 class="font-semibold text-slate-800 mb-2">Научное название</h3>
                        <p class="text-slate-600 italic">${fish.scientificName}</p>
                    </div>
                    
                    <div class="mb-6">
                        <h3 class="font-semibold text-slate-800 mb-2">Среда обитания</h3>
                        <p class="text-slate-600">${fish.habitat}</p>
                    </div>
                    
                    <div class="mb-6">
                        <h3 class="font-semibold text-slate-800 mb-2">Размер и возраст</h3>
                        <p class="text-slate-600 mb-1"><strong>Размер:</strong> ${fish.size}</p>
                        <p class="text-slate-600"><strong>Возраст:</strong> ${fish.lifespan}</p>
                    </div>
                    
                    <div class="mb-6">
                        <h3 class="font-semibold text-slate-800 mb-2">Питание</h3>
                        <p class="text-slate-600">${fish.diet}</p>
                    </div>
                    
                    <div class="mb-6">
                        <h3 class="font-semibold text-slate-800 mb-2">Сезон активности</h3>
                        <div class="flex space-x-2">
                            ${fish.seasons.map(season => `
                                <div class="flex items-center px-3 py-1 bg-slate-100 rounded-full">
                                    <div class="season-indicator season-${season} mr-2"></div>
                                    <span class="text-sm font-medium">${this.getSeasonName(season)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="bg-blue-50 rounded-xl p-4">
                    <h3 class="font-semibold text-slate-800 mb-3">Лучшие насадки</h3>
                    <p class="text-slate-600">${fish.bestBait}</p>
                </div>
                
                <div class="bg-orange-50 rounded-xl p-4">
                    <h3 class="font-semibold text-slate-800 mb-3">Лучшее время</h3>
                    <p class="text-slate-600">${fish.bestTime}</p>
                </div>
            </div>
            
            <div class="mb-6">
                <h3 class="font-semibold text-slate-800 mb-3">Описание</h3>
                <p class="text-slate-600 leading-relaxed">${fish.description}</p>
            </div>
            
            <div class="mb-6">
                <h3 class="font-semibold text-slate-800 mb-3">Советы по ловле</h3>
                <div class="bg-green-50 rounded-xl p-4">
                    <p class="text-slate-700">${fish.tips}</p>
                </div>
            </div>
            
            <div class="bg-yellow-50 rounded-xl p-4">
                <h3 class="font-semibold text-slate-800 mb-2">Правила и ограничения</h3>
                <p class="text-slate-700 text-sm">${fish.regulations}</p>
            </div>
        `;

        modal.classList.add('show');
    }
}

// Utility functions
function showFishDetails(fishId) {
    if (window.fishGuidePage) {
        window.fishGuidePage.showFishDetails(fishId);
    }
}

function closeModal() {
    const modal = document.getElementById('fish-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('fish-modal');
    if (modal && e.target === modal) {
        closeModal();
    }
});

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.fishGuidePage = new FishGuidePage();
});