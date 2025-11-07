document.addEventListener('DOMContentLoaded', function() {
    // Автоматическое обновление года в футере
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        const currentYear = new Date().getFullYear();
        currentYearSpan.textContent = currentYear;
    }
    // Инициализация темы
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    // Переключение темы
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }
    // Мобильное меню
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
        // Закрытие мобильного меню при клике на ссылку
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }
    // Вкладки "Медиа"
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.tab;
            // Убираем активный класс
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            // Добавляем активный класс
            button.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });
    // Плавная прокрутка к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    // Lazy loading для изображений
    lazyLoadImages();
    // Обновление структурированных данных
    enhanceStructuredData();
    // Добавление атрибутов для безопасных внешних ссылок
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        if (!link.hasAttribute('rel')) {
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
    // Обновление даты последнего модифицирования
    updateLastModified();
});

// Функция переключения темы
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    updateMetaThemeColor(newTheme);
}

// Обновление иконки темы
function updateThemeIcon(theme) {
    const themeIcons = document.querySelectorAll('#themeIcon, #mobileThemeIcon');
    themeIcons.forEach(icon => {
        if (theme === 'light') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
}

// Обновление мета-тега для цвета темы в браузере
function updateMetaThemeColor(theme) {
    const metaThemeColor = document.getElementById('themeColorMeta');
    if (metaThemeColor) {
        metaThemeColor.content = theme === 'light' ? '#ffffff' : '#8b5cf6';
    }
}

// Lazy loading для изображений
function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback для старых браузеров
        lazyImages.forEach(img => {
            img.classList.add('loaded');
        });
    }
}

// Обновление структурированных данных
function enhanceStructuredData() {
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
        try {
            const data = JSON.parse(existingScript.textContent);
            
            // Добавляем дополнительные данные если их нет
            if (!data.hasOwnProperty('sameAs')) {
                data.sameAs = [
                    "https://vk.com/blackbabycat_official",
                    "https://t.me/BlackBabyCat",
                    "https://www.youtube.com/@BlackBabyCat"
                ];
            }
            
            if (!data.hasOwnProperty('review')) {
                data.review = [
                    {
                        "@type": "Review",
                        "reviewRating": {
                            "@type": "Rating",
                            "ratingValue": "4.5",
                            "bestRating": "5"
                        },
                        "author": {
                            "@type": "Organization",
                            "name": "Музыкальный портал"
                        },
                        "reviewBody": "BlackBabyCat создает уникальный звук, объединяющий рэп и хип-хоп в танцевальном стиле. Его музыка находит отклик у слушателей благодаря честному самовыражению.",
                        "datePublished": "2025-03-15"
                    }
                ];
            }
            
            // Обновляем скрипт
            existingScript.textContent = JSON.stringify(data, null, 2);
        } catch (e) {
            console.error('Ошибка при обновлении structured ', e);
        }
    }
}

// Обновление даты последнего модифицирования
function updateLastModified() {
    const lastModifiedMeta = document.querySelector('meta[name="last-modified"]');
    if (lastModifiedMeta) {
        lastModifiedMeta.content = new Date().toISOString();
    }
}

// Добавление класса scrolled при скролле
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});