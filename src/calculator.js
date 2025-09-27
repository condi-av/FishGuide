// Calculator page functionality
class CalculatorPage {
    constructor() {
        this.formData = {};
        this.budget = 10000;
        this.init();
    }

    init() {
        this.initMobileMenu();
        this.initBudgetSlider();
        this.initForm();
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

    // Initialize budget slider
    initBudgetSlider() {
        const slider = document.getElementById('budget-slider');
        const valueDisplay = document.getElementById('budget-value');

        if (slider && valueDisplay) {
            // Установка начальных значений
            valueDisplay.textContent = `${this.budget.toLocaleString()} ₽`;
            
            slider.addEventListener('input', (e) => {
                this.budget = parseInt(e.target.value);
                valueDisplay.textContent = `${this.budget.toLocaleString()} ₽`;
                
                // Update slider color based on value
                const percentage = (this.budget - 1000) / (50000 - 1000) * 100;
                slider.style.background = `linear-gradient(to right, #1e3a8a 0%, #1e3a8a ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
            });

            // Initialize slider appearance
            const percentage = (this.budget - 1000) / (50000 - 1000) * 100;
            slider.style.background = `linear-gradient(to right, #1e3a8a 0%, #1e3a8a ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
        }
    }

    // Initialize form submission
    initForm() {
        const form = document.getElementById('calculator-form');
        if (form) {
            // Привязываем метод к контексту класса
            form.addEventListener('submit', this.processForm.bind(this));
        }
    }

    // --- [НАЧАЛО ИСПРАВЛЕННОЙ ЛОГИКИ] ---
    
    // Core logic for calculating gear recommendations (Critical Fix)
    calculateRecommendations() {
        const { fish, season, budget } = this.formData;
        let recommendations = [];
        let rod = '', reel = '', lure = '';

        // Logic based on fish type (the most important factor)
        if (fish === 'pike') {
            rod = 'Спиннинговое удилище (2.4-2.7м, тест 10-40г)';
            reel = 'Безынерционная катушка, размер 3000-4000';
            lure = 'Воблеры (минноу), крупные колеблющиеся блесны';
        } else if (fish === 'carp') {
            rod = 'Карповое удилище (3.6-3.9м, тест до 130г)';
            reel = 'Катушка с системой байтранер, размер 5000+';
            lure = 'Бойлы (фруктовые/рыбные), пеллетс, кукуруза';
        } else if (fish === 'perch') {
             rod = 'Ультралайт спиннинг (1.8-2.1м, тест 1-7г)';
            reel = 'Безынерционная катушка, размер 1000-2000';
            lure = 'Мелкие вращающиеся блесны, микроджиг';
        } else {
            // Default for Bream/Roach/General peaceful fish
            rod = 'Фидерное удилище (3.6м, тест до 80г)';
            reel = 'Безынерционная катушка, размер 2500';
            lure = 'Мотыль, опарыш, червь';
        }

        // Budget adjustment logic
        if (budget < 10000) {
            rod += ' (бюджетная серия - стеклопластик/композит)';
        } else if (budget > 30000) {
            rod += ' (премиум серия - высокомодульный карбон)';
        }

        // Season adjustment (simple example)
        if (season === 'winter') {
            rod = 'Зимняя удочка или жерлица';
            lure = 'Балансиры, мормышки, блесны для отвесного блеснения';
            reel = 'Инерционная катушка для зимней ловли';
        }


        recommendations.push(
            { type: 'Удилище', recommendation: rod },
            { type: 'Катушка', recommendation: reel },
            { type: 'Приманка/Насадка', recommendation: lure }
        );

        return recommendations;
    }

    // Process form submission (Critical Fix)
    processForm(e) {
        e.preventDefault();
        
        // 1. Сбор данных
        this.formData = {};
        const form = document.getElementById('calculator-form');
        new FormData(form).forEach((value, key) => {
            this.formData[key] = value;
        });
        
        // Validation
        if (!this.formData.fish || !this.formData.season) {
            this.renderResults([]);
            this.showError('Пожалуйста, выберите хотя бы тип рыбы и сезон для получения рекомендаций.');
            return;
        }

        // 2. Обработка данных и генерация рекомендаций
        const results = this.calculateRecommendations();

        // 3. Отображение результатов
        this.renderResults(results); 
        this.showError(null); // Clear previous errors
    }

    // --- [КОНЕЦ ИСПРАВЛЕННОЙ ЛОГИКИ] ---
    
    // Renders the results section
    renderResults(results) {
        const resultsContainer = document.getElementById('recommendation-results');
        if (!resultsContainer) return;

        if (results.length === 0) {
            resultsContainer.innerHTML = '';
            return;
        }

        let html = results.map(item => `
            <div class="p-4 bg-white rounded-lg shadow-md border-l-4 border-lake-blue">
                <p class="font-display font-semibold text-lg text-slate-800">${item.type}</p>
                <p class="text-slate-600">${item.recommendation}</p>
            </div>
        `).join('');
        
        html = `
            <div class="mt-8">
                <h2 class="text-3xl font-display font-bold text-slate-900 mb-6 border-b pb-2">Ваши Рекомендации</h2>
                <div class="space-y-4">
                    ${html}
                </div>
                <div class="mt-8 text-center">
                    <button onclick="saveRecommendations()" class="bg-sunset-orange text-white py-3 px-6 rounded-lg font-medium hover:bg-sunset-orange/90 transition-colors shadow-md">
                        Сохранить подборку
                    </button>
                </div>
            </div>
        `;
        
        resultsContainer.innerHTML = html;
        
        // Animation to draw attention to the new results
        anime({
            targets: resultsContainer.querySelector('.mt-8'),
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutQuad'
        });
    }

    // Show or hide error messages
    showError(message) {
        const errorContainer = document.getElementById('error-message-container');
        if (!errorContainer) return;

        if (message) {
            errorContainer.innerHTML = `
                <div class="p-4 bg-red-100 border-l-4 border-red-500 rounded-lg flex items-center space-x-3 mb-6 animate-pulse">
                    <div>
                        <svg class="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <p class="text-red-800 font-semibold">${message}</p>
                </div>
            `;
            errorContainer.classList.remove('hidden');
        } else {
            errorContainer.classList.add('hidden');
            errorContainer.innerHTML = '';
        }
    }

    // Initialize animations
    initAnimations() {
        // Animate form elements on scroll
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

        // Observe form sections
        document.querySelectorAll('#calculator-form > div').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// Utility functions
function saveRecommendations() {
    // This would typically save to localStorage or send to server
    alert('Рекомендации сохранены! Вы можете вернуться к ним позже, если, конечно, не забудете, где их сохранили 😉.');
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calculatorPage = new CalculatorPage();
});
