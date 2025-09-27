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

    // Initialize form
    initForm() {
        const form = document.getElementById('calculator-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processForm();
            });

            // Add change listeners to all form elements
            const formElements = form.querySelectorAll('input[type="radio"], select');
            formElements.forEach(element => {
                element.addEventListener('change', () => {
                    this.updateFormData();
                    if (this.isFormComplete()) {
                        this.showPreview();
                    }
                });
            });
        }
    }

    // Update form data
    updateFormData() {
        const form = document.getElementById('calculator-form');
        const formData = new FormData(form);
        
        this.formData = {};
        for (let [key, value] of formData.entries()) {
            this.formData[key] = value;
        }
        this.formData.budget = this.budget;
    }

    // Check if form is complete
    isFormComplete() {
        return this.formData.fish && 
               this.formData.location && 
               this.formData.season && 
               this.formData.experience;
    }

    // Show preview recommendations
    showPreview() {
        // This could show a simplified preview before full calculation
        console.log('Form is complete, ready for calculation');
    }

    // Process form submission
    processForm() {
        this.updateFormData();
        
        if (!this.isFormComplete()) {
            this.showError('Пожалуйста, заполните все обязательные поля');
            return;
        }

        this.calculateRecommendations();
    }

    // Calculate recommendations based on form data
    calculateRecommendations() {
        const { fish, location, season, experience, budget } = this.formData;
        
        // Get base recommendations
        let recommendations = this.getBaseRecommendations(fish, location, season, experience);
        
        // Filter by budget
        recommendations = this.filterByBudget(recommendations, budget);
        
        // Add specific adjustments based on conditions
        recommendations = this.adjustRecommendations(recommendations, location, season, experience);
        
        // Display results
        this.displayResults(recommendations);
    }

    // Get base recommendations for fish type
    getBaseRecommendations(fish, location, season, experience) {
        const recommendations = {
            pike: {
                rod: {
                    type: 'Спиннинговое удилище',
                    length: '2.1-2.7 м',
                    power: 'Medium-Heavy',
                    action: 'Fast',
                    price: 8000,
                    description: 'Жесткое удилище для контроля крупной щуки'
                },
                reel: {
                    type: 'Катушка безынерционная',
                    size: '3000-4000',
                    gearRatio: '6.2:1',
                    price: 6000,
                    description: 'Быстрая катушка для проводки приманок'
                },
                line: {
                    type: 'Плетеный шнур',
                    diameter: '0.20-0.30 мм',
                    strength: '12-20 кг',
                    price: 1500,
                    description: 'Прочный шнур для хищника'
                },
                lures: {
                    type: 'Воблеры и блесны',
                    count: 8,
                    price: 3500,
                    description: 'Разнообразные приманки для щуки'
                }
            },
            perch: {
                rod: {
                    type: 'Спиннинговое удилище',
                    length: '1.8-2.4 м',
                    power: 'Light-Medium',
                    action: 'Fast',
                    price: 5000,
                    description: 'Легкое удилище для окуня'
                },
                reel: {
                    type: 'Катушка безынерционная',
                    size: '2000-2500',
                    gearRatio: '5.8:1',
                    price: 4000,
                    description: 'Плавная катушка для тонкой проводки'
                },
                line: {
                    type: 'Плетеный шнур',
                    diameter: '0.12-0.18 мм',
                    strength: '6-10 кг',
                    price: 1000,
                    description: 'Тонкий шнур для осторожного окуня'
                },
                lures: {
                    type: 'Маленькие воблеры и блесны',
                    count: 12,
                    price: 2500,
                    description: 'Мелкие приманки для окуня'
                }
            },
            carp: {
                rod: {
                    type: 'Фидерное удилище',
                    length: '3.6-4.2 м',
                    power: 'Heavy',
                    action: 'Medium',
                    price: 12000,
                    description: 'Мощное удилище для дальнего заброса'
                },
                reel: {
                    type: 'Катушка безынерционная',
                    size: '4000-5000',
                    gearRatio: '4.8:1',
                    price: 8000,
                    description: 'Мощная катушка для карповой ловли'
                },
                line: {
                    type: 'Монофильная леска',
                    diameter: '0.30-0.40 мм',
                    strength: '15-25 кг',
                    price: 1200,
                    description: 'Прочная леска для карпа'
                },
                lures: {
                    type: 'Кормушки и бойлы',
                    count: 15,
                    price: 2000,
                    description: 'Кормовые прикормки и насадки'
                }
            },
            bream: {
                rod: {
                    type: 'Фидерное удилище',
                    length: '3.0-3.9 м',
                    power: 'Medium',
                    action: 'Medium',
                    price: 9000,
                    description: 'Универсальное фидерное удилище'
                },
                reel: {
                    type: 'Катушка безынерционная',
                    size: '3000-4000',
                    gearRatio: '5.2:1',
                    price: 5000,
                    description: 'Надежная катушка для фидера'
                },
                line: {
                    type: 'Монофильная леска',
                    diameter: '0.20-0.28 мм',
                    strength: '8-15 кг',
                    price: 800,
                    description: 'Тонкая леска для леща'
                },
                lures: {
                    type: 'Кормушки и черви',
                    count: 20,
                    price: 1500,
                    description: 'Прикормка и живые насадки'
                }
            },
            salmon: {
                rod: {
                    type: 'Нахлыстовое удилище',
                    length: '2.7-3.3 м',
                    power: 'Heavy',
                    action: 'Slow',
                    price: 25000,
                    description: 'Профессиональное нахлыстовое удилище'
                },
                reel: {
                    type: 'Нахлыстовая катушка',
                    size: 'Large Arbor',
                    gearRatio: '1:1',
                    price: 15000,
                    description: 'Качественная нахлыстовая катушка'
                },
                line: {
                    type: 'Нахлыстовая линия',
                    weight: 'WF-8',
                    strength: '15 кг',
                    price: 5000,
                    description: 'Плавающая нахлыстовая линия'
                },
                lures: {
                    type: 'Мушки и стримеры',
                    count: 25,
                    price: 3000,
                    description: 'Разнообразные мушки для лосося'
                }
            },
            catfish: {
                rod: {
                    type: 'Карповое удилище',
                    length: '3.6-4.2 м',
                    power: 'Extra Heavy',
                    action: 'Fast',
                    price: 15000,
                    description: 'Сверхмощное удилище для крупного сома'
                },
                reel: {
                    type: 'Катушка безынерционная',
                    size: '6000-8000',
                    gearRatio: '4.5:1',
                    price: 12000,
                    description: 'Мощная катушка для трофейного сома'
                },
                line: {
                    type: 'Плетеный шнур',
                    diameter: '0.40-0.60 мм',
                    strength: '30-50 кг',
                    price: 3000,
                    description: 'Сверхпрочный шнур для сома'
                },
                lures: {
                    type: 'Крупные воблеры и силикон',
                    count: 6,
                    price: 4000,
                    description: 'Крупные приманки для сома'
                }
            }
        };

        return recommendations[fish] || recommendations.pike;
    }

    // Filter recommendations by budget
    filterByBudget(recommendations, budget) {
        const totalPrice = 
            recommendations.rod.price + 
            recommendations.reel.price + 
            recommendations.line.price + 
            recommendations.lures.price;

        if (totalPrice <= budget) {
            return recommendations;
        }

        // Scale down recommendations to fit budget
        const scaleFactor = budget / totalPrice;
        
        const scaledRecommendations = { ...recommendations };
        
        Object.keys(scaledRecommendations).forEach(key => {
            if (scaledRecommendations[key].price) {
                scaledRecommendations[key].price = Math.round(
                    scaledRecommendations[key].price * scaleFactor
                );
                
                // Add budget note
                scaledRecommendations[key].budgetNote = 'Альтернатива бюджетного уровня';
            }
        });

        return scaledRecommendations;
    }

    // Adjust recommendations based on conditions
    adjustRecommendations(recommendations, location, season, experience) {
        const adjusted = { ...recommendations };

        // Location adjustments
        if (location === 'river') {
            if (adjusted.rod) {
                adjusted.rod.length = this.increaseLength(adjusted.rod.length);
                adjusted.rod.description += '. Подходит для речной ловли';
            }
        } else if (location === 'sea') {
            if (adjusted.line) {
                adjusted.line.type = 'Морская плетеная линия';
                adjusted.line.description += '. Устойчива к соленой воде';
                adjusted.line.price = Math.round(adjusted.line.price * 1.3);
            }
        }

        // Season adjustments
        if (season === 'winter') {
            if (adjusted.rod) {
                adjusted.rod.type = 'Зимнее ' + adjusted.rod.type.toLowerCase();
                adjusted.rod.length = '0.6-1.2 м';
                adjusted.rod.description = 'Короткое удилище для зимней рыбалки';
            }
        }

        // Experience adjustments
        if (experience === 'beginner') {
            Object.keys(adjusted).forEach(key => {
                if (adjusted[key].price) {
                    adjusted[key].price = Math.round(adjusted[key].price * 0.7);
                    adjusted[key].description += '. Подходит для начинающих';
                }
            });
        } else if (experience === 'advanced') {
            Object.keys(adjusted).forEach(key => {
                if (adjusted[key].price) {
                    adjusted[key].price = Math.round(adjusted[key].price * 1.5);
                    adjusted[key].description += '. Профессиональный уровень';
                }
            });
        }

        return adjusted;
    }

    // Helper function to increase rod length
    increaseLength(currentLength) {
        const lengthMatch = currentLength.match(/(\d+\.?\d*)-(\d+\.?\d*)/);
        if (lengthMatch) {
            const min = parseFloat(lengthMatch[1]) + 0.3;
            const max = parseFloat(lengthMatch[2]) + 0.3;
            return `${min.toFixed(1)}-${max.toFixed(1)} м`;
        }
        return currentLength;
    }

    // Display results
    displayResults(recommendations) {
        const container = document.getElementById('results-container');
        if (!container) return;

        const totalPrice = 
            recommendations.rod.price + 
            recommendations.reel.price + 
            recommendations.line.price + 
            recommendations.lures.price;

        container.innerHTML = `
            <div class="result-animation">
                <!-- Total Budget -->
                <div class="bg-gradient-to-r from-lake-blue to-blue-600 text-white rounded-xl p-4 mb-6">
                    <div class="text-center">
                        <p class="text-sm opacity-90">Общий бюджет</p>
                        <p class="text-2xl font-bold">${totalPrice.toLocaleString()} ₽</p>
                        <p class="text-xs opacity-75">из ${this.budget.toLocaleString()} ₽</p>
                    </div>
                </div>

                <!-- Rod Recommendation -->
                <div class="recommendation-card border border-slate-200 rounded-xl p-4 mb-4">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="font-semibold text-slate-800">${recommendations.rod.type}</h4>
                        <span class="text-lake-blue font-bold">${recommendations.rod.price.toLocaleString()} ₽</span>
                    </div>
                    <div class="text-sm text-slate-600 space-y-1">
                        <p><strong>Длина:</strong> ${recommendations.rod.length}</p>
                        <p><strong>Тест:</strong> ${recommendations.rod.power}</p>
                        <p><strong>Строй:</strong> ${recommendations.rod.action}</p>
                        <p class="text-xs text-slate-500">${recommendations.rod.description}</p>
                        ${recommendations.rod.budgetNote ? `<p class="text-xs text-orange-600">${recommendations.rod.budgetNote}</p>` : ''}
                    </div>
                </div>

                <!-- Reel Recommendation -->
                <div class="recommendation-card border border-slate-200 rounded-xl p-4 mb-4">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="font-semibold text-slate-800">${recommendations.reel.type}</h4>
                        <span class="text-lake-blue font-bold">${recommendations.reel.price.toLocaleString()} ₽</span>
                    </div>
                    <div class="text-sm text-slate-600 space-y-1">
                        <p><strong>Размер:</strong> ${recommendations.reel.size}</p>
                        <p><strong>Передаточное число:</strong> ${recommendations.reel.gearRatio}</p>
                        <p class="text-xs text-slate-500">${recommendations.reel.description}</p>
                        ${recommendations.reel.budgetNote ? `<p class="text-xs text-orange-600">${recommendations.reel.budgetNote}</p>` : ''}
                    </div>
                </div>

                <!-- Line Recommendation -->
                <div class="recommendation-card border border-slate-200 rounded-xl p-4 mb-4">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="font-semibold text-slate-800">${recommendations.line.type}</h4>
                        <span class="text-lake-blue font-bold">${recommendations.line.price.toLocaleString()} ₽</span>
                    </div>
                    <div class="text-sm text-slate-600 space-y-1">
                        <p><strong>Диаметр:</strong> ${recommendations.line.diameter || recommendations.line.weight}</p>
                        <p><strong>Разрывная нагрузка:</strong> ${recommendations.line.strength}</p>
                        <p class="text-xs text-slate-500">${recommendations.line.description}</p>
                        ${recommendations.line.budgetNote ? `<p class="text-xs text-orange-600">${recommendations.line.budgetNote}</p>` : ''}
                    </div>
                </div>

                <!-- Lures Recommendation -->
                <div class="recommendation-card border border-slate-200 rounded-xl p-4 mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="font-semibold text-slate-800">${recommendations.lures.type}</h4>
                        <span class="text-lake-blue font-bold">${recommendations.lures.price.toLocaleString()} ₽</span>
                    </div>
                    <div class="text-sm text-slate-600 space-y-1">
                        <p><strong>Количество:</strong> ${recommendations.lures.count} шт.</p>
                        <p class="text-xs text-slate-500">${recommendations.lures.description}</p>
                        ${recommendations.lures.budgetNote ? `<p class="text-xs text-orange-600">${recommendations.lures.budgetNote}</p>` : ''}
                    </div>
                </div>

                <!-- Additional Recommendations -->
                <div class="bg-slate-50 rounded-xl p-4 mb-4">
                    <h4 class="font-semibold text-slate-800 mb-3">Дополнительно рекомендуем:</h4>
                    <ul class="text-sm text-slate-600 space-y-2">
                        ${this.getAdditionalRecommendations(this.formData.fish, this.formData.location)}
                    </ul>
                </div>

                <!-- Save Button -->
                <button onclick="saveRecommendations()" class="w-full bg-sunset-orange hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300">
                    Сохранить подборку
                </button>
            </div>
        `;

        // Animate recommendation cards
        const cards = container.querySelectorAll('.recommendation-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('show');
            }, index * 200);
        });
    }

    // Get additional recommendations
    getAdditionalRecommendations(fish, location) {
        const additionalItems = {
            pike: [
                                '<li class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Поводки из титана или стали</li>',
                '<li class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Щипцы для извлечения крючков</li>',
                '<li class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Садок для хранения улова</li>'
            ],
            perch: [
                '<li class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Мормышки разных размеров</li>',
                '<li class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Бокс для приманок</li>',
                '<li class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Эхолот для поиска стай</li>'
            ],
            carp: [
                '<li class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Прикормочная машина</li>',
                '<li class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Карповые сигнализаторы</li>',
                '<li class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Подсачек большого диаметра</li>'
            ],
            bream: [
                '<li class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Фидерные кормушки</li>',
                '<li class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Живые насадки</li>',
                '<li class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Диповые насадки</li>'
            ],
            salmon: [
                '<li class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Разнообразные мушки</li>',
                '<li class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Сетчатый подсачек</li>',
                '<li class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Водонепроницаемая одежда</li>'
            ],
            catfish: [
                '<li class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Крупные крючки</li>',
                '<li class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Мощные вершики</li>',
                '<li class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>Багор для вываживания</li>'
            ]
        };

        return (additionalItems[fish] || additionalItems.pike).join('');
    }

    // Show error message
    showError(message) {
        const container = document.getElementById('results-container');
        if (!container) return;

        container.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <p class="text-red-800 font-semibold">${message}</p>
            </div>
        `;
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
    alert('Рекомендации сохранены! Вы можете вернуться к ним позже.');
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calculatorPage = new CalculatorPage();
});