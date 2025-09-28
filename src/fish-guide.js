// Fish guide page functionality
class FishGuidePage {
    constructor() {
        // [ИСПРАВЛЕНИЕ: Теперь getFishData() возвращает данные из внешнего файла]
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
        // Убедимся, что при загрузке страницы показываем, сколько всего видов
        console.log(`FishGuide инициализирован. Найдено ${this.fishData.length} видов рыб.`); 
    }

    // [КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ ЭКСПЕРТА] - Метод для получения данных
    getFishData() { 
        // Глобальная переменная fishGuideData должна быть загружена из src/fish-data.js ПЕРЕД этим скриптом!
        if (typeof fishGuideData !== 'undefined') {
            return fishGuideData;
        }
        console.error('Ошибка: Глобальная переменная fishGuideData не найдена. Подключите src/fish-data.js ПЕРЕД fish-guide.js!');
        return [];
    }

    // Mobile menu functionality (оставлено без изменений)
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
                const category = e.currentTarget.dataset.category;
                this.currentCategory = category;
                
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('bg-lake-blue', 'text-white'));
                e.currentTarget.classList.add('bg-lake-blue', 'text-white');

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
    
    // Apply all filters and sort
    applyFilters() {
        let fish = this.fishData;

        // 1. Фильтр по категории
        if (this.currentCategory !== 'all') {
            fish = fish.filter(f => f.category === this.currentCategory);
        }

        // 2. Поиск по имени и описанию
        if (this.searchQuery) {
            fish = fish.filter(f => 
                f.name.toLowerCase().includes(this.searchQuery) || 
                f.description.toLowerCase().includes(this.searchQuery)
            );
        }

        // 3. Сортировка
        fish.sort((a, b) => {
            if (this.currentSort === 'name') {
                return a.name.localeCompare(b.name, 'ru', { sensitivity: 'base' });
            }
            if (this.currentSort === 'category') {
                return a.category.localeCompare(b.category);
            }
            return 0; // default
        });

        this.filteredFish = fish;
        this.renderFishGrid();
        this.updateResultsCount();
    }

    // Render the fish grid
    renderFishGrid() {
        const gridContainer = document.getElementById('fish-grid');
        if (!gridContainer) return;

        gridContainer.innerHTML = ''; 

        if (this.filteredFish.length === 0) {
            gridContainer.innerHTML = this.renderEmptyState();
            return;
        }

        this.filteredFish.forEach(fish => {
            gridContainer.innerHTML += this.renderFishCard(fish);
        });
    }
    
    // [ДОБАВЛЕНО] - Генерация HTML для карточки рыбы
    renderFishCard(fish) {
        const categoryMap = {
            'predator': 'Хищник',
            'peaceful': 'Мирная рыба'
        };

        const categoryText = categoryMap[fish.category] || 'Неизвестно';
        const colorClass = fish.category === 'predator' ? 'bg-sunset-orange/10 text-sunset-orange' : 'bg-accent-green/10 text-accent-green';

        // Добавляем обработчик onclick для открытия модального окна
        return `
            <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer" onclick="showFishDetails('${fish.id}')">
                <div class="relative overflow-hidden h-48 rounded-t-xl bg-gray-100">
                    <div class="flex items-center justify-center h-full text-6xl text-slate-400">
                        ${fish.icon || '🐟'}
                    </div>
                    <span class="absolute top-3 right-3 ${colorClass} text-xs font-semibold px-3 py-1 rounded-full">${categoryText}</span>
                </div>
                <div class="p-5">
                    <h2 class="text-2xl font-display font-bold text-slate-900 mb-2">${fish.name}</h2>
                    <p class="text-sm text-slate-600 line-clamp-2">${fish.description.split('.')[0]}.</p>
                    <div class="mt-4 flex justify-between items-center">
                        <span class="text-sm font-semibold text-lake-blue">${fish.season.join(', ')}</span>
                        <button class="text-sm font-medium text-slate-500 hover:text-lake-blue transition-colors">Подробнее →</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Update results counter
    updateResultsCount() {
        const countElement = document.getElementById('results-count');
        if (countElement) {
            countElement.textContent = this.filteredFish.length;
        }
    }
    
    // Render empty state (когда нет результатов)
    renderEmptyState() {
        return `
            <div class="col-span-full text-center py-12 bg-gray-100 rounded-xl">
                <span class="text-6xl mb-4 block">😔</span>
                <h3 class="text-2xl font-display font-bold text-slate-900 mb-2">Ничего не найдено!</h3>
                <p class="text-slate-600">Попробуйте изменить фильтры или поисковый запрос. Возможно, этой рыбы просто нет в нашем справочнике. (Пока что!)</p>
            </div>
        `;
    }

    // Show details in modal (нужен соответствующий HTML-модал в fish-guide.html!)
    showFishDetails(fishId) {
        const fish = this.fishData.find(f => f.id === fishId);
        if (!fish) return;

        const modal = document.getElementById('fish-modal');
        const modalContent = document.getElementById('fish-modal-content');
        if (!modal || !modalContent) return;
        
        // Рендеринг детальной информации в модальном окне
        modalContent.innerHTML = `
            <div class="flex justify-between items-start mb-6">
                <h2 class="text-3xl font-display font-bold text-slate-900">${fish.name} <span class="text-4xl ml-2">${fish.icon}</span></h2>
                <button onclick="closeModal()" class="text-slate-400 hover:text-slate-700 transition-colors p-1">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            <div class="relative mb-6 rounded-xl overflow-hidden bg-gray-200 h-64 flex items-center justify-center text-8xl text-slate-500">
                ${fish.icon}
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                    <h3 class="font-semibold text-slate-800">Категория</h3>
                    <p class="text-slate-600">${fish.category === 'predator' ? 'Хищник' : 'Мирная рыба'}</p>
                </div>
                <div>
                    <h3 class="font-semibold text-slate-800">Сезон</h3>
                    <p class="text-slate-600">${fish.season.join(', ')}</p>
                </div>
                <div>
                    <h3 class="font-semibold text-slate-800">Среда обитания</h3>
                    <p class="text-slate-600">${fish.habitat}</p>
                </div>
            </div>
            
            <div class="mb-6">
                <h3 class="font-semibold text-slate-800 mb-3">На что ловить (Приманки)</h3>
                <div class="flex flex-wrap gap-2">
                    ${fish.bait.map(b => `<span class="bg-lake-blue/10 text-lake-blue px-3 py-1 rounded-full text-sm font-medium">${b}</span>`).join('')}
                </div>
            </div>

            <div class="mb-6">
                <h3 class="font-semibold text-slate-800 mb-3">Описание</h3>
                <p class="text-slate-600 leading-relaxed">${fish.description}</p>
            </div>
            
            <div class="mb-6">
                <h3 class="font-semibold text-slate-800 mb-3">Советы по ловле</h3>
                <div class="bg-accent-green/10 text-accent-green rounded-xl p-4">
                    <p class="text-slate-700">${fish.tips}</p>
                </div>
            </div>
            
            <div class="bg-sunset-orange/10 text-sunset-orange rounded-xl p-4">
                <h3 class="font-semibold text-slate-800 mb-2">Правила и ограничения</h3>
                <p class="text-slate-700 text-sm">${fish.regulations}</p>
            </div>
        `;

        // Активация модального окна (предполагает, что у модала есть CSS-стили для .show)
        modal.classList.add('show');
    }
}

// Utility functions (функции-помощники для вызова из HTML)
function showFishDetails(fishId) {
    if (window.fishGuidePage) {
        window.fishGuidePage.showFishDetails(fishId);
    }
}

function closeModal() {
    const modal = document.getElementById('fish-modal');
    // Закрытие модального окна
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

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.fishGuidePage = new FishGuidePage();
});
