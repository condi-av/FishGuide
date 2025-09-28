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

    // *** ИСПРАВЛЕНИЕ: Метод для объединения данных о рыбе из всех файлов ***
    getFishData() {
        // Объединяем глобально определенные массивы (predatory, peaceful, и fishData)
        // Используем || [] для безопасности, если какой-то файл не загрузится (до устранения ошибки пути).
        return [
            ...(window.fishDataPeaceful || []), 
            ...(window.fishDataPredatory || []), 
            ...(window.fishData || [])
        ];
    }
    // **********************************************************************

    init() {
        this.initMobileMenu();
        this.initSearch();
        this.initFilters();
        this.initSort();
        this.renderFishGrid();
        this.updateResultsCount();
        this.initAnimations();
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
                document.querySelectorAll('.category-filter').forEach(btn => btn.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                // Apply filter
                this.currentCategory = e.currentTarget.dataset.category;
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
                this.sortFish();
                this.renderFishGrid();
            });
        }
    }

    // Apply filters and search query
    applyFilters() {
        let tempFish = this.fishData.filter(fish => {
            // Category filter
            if (this.currentCategory !== 'all' && fish.category.toLowerCase() !== this.currentCategory) {
                return false;
            }
            // Search filter
            if (this.searchQuery && !fish.name.toLowerCase().includes(this.searchQuery)) {
                return false;
            }
            return true;
        });

        this.filteredFish = tempFish;
        this.sortFish();
        this.renderFishGrid();
        this.updateResultsCount();
    }

    // Sort the filtered fish list
    sortFish() {
        this.filteredFish.sort((a, b) => {
            if (this.currentSort === 'name') {
                return a.name.localeCompare(b.name, 'ru', { sensitivity: 'base' });
            } else if (this.currentSort === 'size') {
                // Simple sorting logic based on size string (can be improved)
                const sizeA = parseFloat(a.size.split('-')[0]) || 0;
                const sizeB = parseFloat(b.size.split('-')[0]) || 0;
                return sizeB - sizeA; // Sort descending
            } else if (this.currentSort === 'id') {
                return a.id.localeCompare(b.id);
            }
            return 0;
        });
    }

    // Render the fish grid
    renderFishGrid() {
        const grid = document.getElementById('fish-grid');
        const resultsCount = document.getElementById('results-count');
        
        if (!grid || !resultsCount) return;

        grid.innerHTML = ''; // Clear previous content

        if (this.filteredFish.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <svg class="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p class="text-xl text-slate-500 font-display">Увы, рыба не клюет...</p>
                    <p class="text-slate-400">Попробуйте изменить критерии поиска или фильтры.</p>
                </div>
            `;
            return;
        }

        this.filteredFish.forEach(fish => {
            const card = document.createElement('div');
            card.className = 'fish-card bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer';
            card.setAttribute('onclick', `showFishDetails('${fish.id}')`);
            
            const categoryClass = fish.category === 'Хищные' ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100';

            card.innerHTML = `
                <div class="h-48 overflow-hidden">
                    <img src="assets/images/fish/${fish.image_url}" alt="${fish.name}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">
                </div>
                <div class="p-4">
                    <span class="inline-block ${categoryClass} text-xs font-semibold px-2 py-0.5 rounded-full mb-2">
                        ${fish.category}
                    </span>
                    <h3 class="font-display text-xl font-semibold text-slate-800 mb-2">${fish.name}</h3>
                    <p class="text-sm text-slate-500">${fish.description.substring(0, 80)}...</p>
                    <div class="mt-3 flex items-center justify-between text-sm text-slate-600">
                        <div class="flex items-center">
                            <svg class="w-4 h-4 mr-1 text-lake-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            <span>Размер: ${fish.size.split(',')[0]}</span>
                        </div>
                        <button class="text-lake-blue hover:text-orange-500 font-medium">Подробнее &rarr;</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    updateResultsCount() {
        const countElement = document.getElementById('results-count');
        if (countElement) {
            countElement.textContent = this.filteredFish.length;
        }
    }
    
    // Animation for card loading
    initAnimations() {
        anime({
            targets: '.fish-card',
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(50),
            easing: 'easeOutQuad'
        });
    }

    // Modal logic
    showFishDetails(fishId) {
        const fish = this.fishData.find(f => f.id === fishId);
        const modal = document.getElementById('fish-modal');
        const modalContent = document.getElementById('fish-modal-content');

        if (!fish || !modal || !modalContent) return;
        
        const categoryClass = fish.category === 'Хищные' ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100';
        
        modalContent.innerHTML = `
            <div class="relative">
                <button onclick="closeModal()" class="absolute top-0 right-0 m-4 text-slate-500 hover:text-slate-800 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                
                <div class="text-center mb-6">
                    <img src="assets/images/fish/${fish.image_url}" alt="${fish.name}" class="w-full h-auto object-cover rounded-t-xl mb-4">
                    <span class="inline-block ${categoryClass} text-sm font-bold px-3 py-1 rounded-full mb-2">
                        ${fish.category}
                    </span>
                    <h2 class="font-display text-3xl font-bold text-slate-900">${fish.name}</h2>
                </div>
            
                <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div class="flex items-center p-3 bg-slate-50 rounded-lg">
                        <svg class="w-5 h-5 text-lake-blue mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 16V4m0 0l-4 4m4-4l4 4"></path></svg>
                        <span class="font-medium text-slate-700">Размер:</span> <span class="ml-2 text-slate-500">${fish.size}</span>
                    </div>
                    <div class="flex items-center p-3 bg-slate-50 rounded-lg">
                        <svg class="w-5 h-5 text-lake-blue mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243m4.243 4.243L12 20.9l-4.243-4.243m9.9 0l-4.243-4.243m4.243 4.243L12 16.657l-4.243-4.243m4.243 4.243L12 16.657l-4.243-4.243M12 20.9V4m0 0l-4 4m4-4l4 4"></path></svg>
                        <span class="font-medium text-slate-700">Среда:</span> <span class="ml-2 text-slate-500">${fish.habitat}</span>
                    </div>
                    <div class="flex items-center p-3 bg-slate-50 rounded-lg">
                        <svg class="w-5 h-5 text-lake-blue mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span class="font-medium text-slate-700">Питание:</span> <span class="ml-2 text-slate-500">${fish.diet}</span>
                    </div>
                    <div class="flex items-center p-3 bg-slate-50 rounded-lg">
                        <svg class="w-5 h-5 text-lake-blue mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span class="font-medium text-slate-700">Сезон:</span> <span class="ml-2 text-slate-500">${fish.seasons.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}</span>
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

// Add animations after DOM is loaded and fish are rendered
document.addEventListener('DOMContentLoaded', () => {
    if (window.fishGuidePage) {
        window.fishGuidePage.initAnimations();
    }
});
