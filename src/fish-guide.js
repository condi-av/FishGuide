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
                // Remove active state from all
                filterButtons.forEach(btn => btn.classList.remove('bg-lake-blue', 'text-white'));
                
                // Set new active state
                e.currentTarget.classList.add('bg-lake-blue', 'text-white');

                this.currentCategory = e.currentTarget.dataset.category || 'all';
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
    
    // ⭐ ОБНОВЛЕННЫЙ МЕТОД: Собирает данные из двух файлов (fish_peaceful.js и fish_predatory.js)
    getFishData() {
        // Мы предполагаем, что fishDataPeaceful и fishDataPredatory
        // были загружены в глобальный scope с помощью <script> тегов в HTML.
        const peaceful = window.fishDataPeaceful || [];
        const predatory = window.fishDataPredatory || [];

        // Объединяем оба массива в один полный список
        const allFish = [...peaceful, ...predatory];
        
        // Шуточный контроль качества:
        if (allFish.length !== 45) {
            console.warn(`Алексей, загружено только ${allFish.length} видов рыб! Какая-то рыба ушла в свободное плавание. Ищите ее в других файлах.`);
        } else {
            console.log(`Ура! Загружено ${allFish.length} видов рыб. Все 45 на месте.`);
        }
        
        return allFish;
    }

    // Apply filtering and sorting logic
    applyFilters() {
        let results = this.fishData;

        // 1. Filter by Search Query
        if (this.searchQuery) {
            results = results.filter(fish => 
                fish.name.toLowerCase().includes(this.searchQuery) ||
                fish.description.toLowerCase().includes(this.searchQuery) ||
                fish.category.toLowerCase().includes(this.searchQuery)
            );
        }

        // 2. Filter by Category
        if (this.currentCategory !== 'all') {
            results = results.filter(fish => fish.category.toLowerCase() === this.currentCategory.toLowerCase());
        }

        // 3. Sort Results
        this.filteredFish = this.sortFish(results);

        this.renderFishGrid();
        this.updateResultsCount();
    }
    
    // Sort logic
    sortFish(fishArray) {
        return fishArray.sort((a, b) => {
            if (this.currentSort === 'name') {
                return a.name.localeCompare(b.name, 'ru');
            } else if (this.currentSort === 'size') {
                // Простая сортировка по размеру, чтобы что-то было
                return a.size.localeCompare(b.size, 'ru');
            } else if (this.currentSort === 'category') {
                return a.category.localeCompare(b.category, 'ru');
            }
            return 0; // Default: no sort
        });
    }

    // Render the fish grid
    renderFishGrid() {
        const grid = document.getElementById('fish-grid');
        if (!grid) return;

        grid.innerHTML = ''; // Clear existing content

        if (this.filteredFish.length === 0) {
            grid.innerHTML = '<p class="text-center text-xl text-slate-500 col-span-full py-10">Увы, Алексей, по Вашему запросу ни одна рыба не нашлась. Попробуйте другой водоем или наживку! 🎣</p>';
            return;
        }

        this.filteredFish.forEach(fish => {
            const card = this.renderFishCard(fish);
            grid.appendChild(card);
            
            this.animateElement(card);
        });
    }

    // Render single fish card
    renderFishCard(fish) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-[1.02]';
        card.setAttribute('onclick', `showFishDetails('${fish.id}')`);
        
        const categoryClass = fish.category === 'Хищные' ? 'bg-red-100 text-red-800' : 
                              fish.category === 'Мирные' ? 'bg-green-100 text-green-800' :
                              'bg-indigo-100 text-indigo-800';
        
        const seasonMap = {
            'spring': 'Весна', 'summer': 'Лето', 'autumn': 'Осень', 'winter': 'Зима', 'all': 'Круглый год'
        };

        card.innerHTML = `
            <div class="relative h-48 overflow-hidden">
                <img src="./img/fish/${fish.image_url}" alt="${fish.name}" class="w-full h-full object-cover">
                <span class="absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full ${categoryClass}">
                    ${fish.category}
                </span>
            </div>
            <div class="p-5">
                <h3 class="font-display text-2xl font-bold text-slate-900 mb-2">${fish.name}</h3>
                <div class="flex items-center text-sm text-slate-500 mb-4">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243m10.121-6.121L13.414 3.1a1.998 1.998 0 00-2.828 0L6.343 9.343m10.121 0a4.998 4.998 0 01-7.07 0M10 18h4"></path></svg>
                    <span>${fish.habitat}</span>
                </div>
                <p class="text-slate-600 text-sm line-clamp-2 mb-4">${fish.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-lg font-semibold text-lake-blue">${fish.size}</span>
                    <span class="text-sm text-slate-500">${fish.seasons.map(s => seasonMap[s] || s).join(', ')}</span>
                </div>
            </div>
        `;
        return card;
    }

    // Update results count
    updateResultsCount() {
        const countElement = document.getElementById('results-count');
        if (countElement) {
            countElement.textContent = this.filteredFish.length;
        }
    }
    
    // Initialize animations (for card loading effect)
    initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('#fish-grid > div').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    animateElement(el) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    }

    // Show details in modal
    showFishDetails(fishId) {
        const fish = this.fishData.find(f => f.id === fishId);
        const modal = document.getElementById('fish-modal');
        const modalContent = document.getElementById('fish-modal-content');

        if (!fish || !modal || !modalContent) return;

        const categoryClass = fish.category === 'Хищные' ? 'bg-red-500' : 
                              fish.category === 'Мирные' ? 'bg-green-500' :
                              'bg-indigo-500';
        
        const seasonMap = {
            'spring': 'Весна', 'summer': 'Лето', 'autumn': 'Осень', 'winter': 'Зима', 'all': 'Круглый год'
        };
        const seasonsList = fish.seasons.map(s => seasonMap[s] || s).join(', ');

        modalContent.innerHTML = `
            <div class="relative">
                <button onclick="closeModal()" class="absolute top-4 right-4 text-white hover:text-gray-300 z-10 p-2 rounded-full bg-black bg-opacity-30 transition-opacity duration-200">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <div class="h-64 sm:h-80 overflow-hidden relative">
                    <img src="./img/fish/${fish.image_url}" alt="${fish.name}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-black opacity-30"></div>
                    <div class="absolute bottom-0 left-0 p-6">
                        <span class="inline-block px-3 py-1 text-sm font-semibold text-white rounded-full ${categoryClass} mb-2">
                            ${fish.category}
                        </span>
                        <h2 class="font-display text-4xl font-bold text-white shadow-text">${fish.name}</h2>
                    </div>
                </div>
            </div>

            <div class="p-6 md:p-8">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                    <div class="p-3 bg-slate-50 rounded-lg">
                        <span class="block text-xs font-semibold text-slate-500 uppercase">Средний размер</span>
                        <span class="block text-lg font-bold text-lake-blue">${fish.size}</span>
                    </div>
                    <div class="p-3 bg-slate-50 rounded-lg">
                        <span class="block text-xs font-semibold text-slate-500 uppercase">Обитание</span>
                        <span class="block text-lg font-bold text-slate-800">${fish.habitat}</span>
                    </div>
                    <div class="p-3 bg-slate-50 rounded-lg">
                        <span class="block text-xs font-semibold text-slate-500 uppercase">Питание</span>
                        <span class="block text-lg font-bold text-slate-800">${fish.diet}</span>
                    </div>
                    <div class="p-3 bg-slate-50 rounded-lg">
                        <span class="block text-xs font-semibold text-slate-500 uppercase">Активный сезон</span>
                        <span class="block text-lg font-bold text-green-600">${seasonsList}</span>
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
