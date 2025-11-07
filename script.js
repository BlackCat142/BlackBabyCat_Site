// script.js
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
    // Добавление атрибутов для безопасных внешних ссылок
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        if (!link.hasAttribute('rel')) {
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
    // Проверка загрузки Font Awesome и резервное отображение иконок
    checkFontAwesomе();
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

// Проверка загрузки Font Awesome и добавление резервных стилей
function checkFontAwesomе() {
    // Создаем тестовый элемент для проверки загрузки иконок
    const testIcon = document.createElement('i');
    testIcon.className = 'fas fa-test';
    document.body.appendChild(testIcon);
    
    setTimeout(() => {
        const computedStyle = window.getComputedStyle(testIcon);
        // Проверяем, загрузился ли Font Awesome
        const isLoaded = computedStyle.fontFamily && computedStyle.fontFamily.includes('Font Awesome');
        
        if (!isLoaded) {
            console.warn('Font Awesome не загружен. Применяются резервные стили для иконок.');
            applyFallbackIcons();
        }
        
        document.body.removeChild(testIcon);
    }, 2000);
}

// Применение резервных стилей для иконок
function applyFallbackIcons() {
    // Создаем стиль с резервными иконками
    const fallbackStyle = document.createElement('style');
    fallbackStyle.innerHTML = `
        /* Резервные иконки для социальных сетей */
        .fab.fa-vk::before { 
            content: "VK"; 
            font-weight: bold; 
            background: #4C75A8; 
            color: white; 
            padding: 2px 8px; 
            border-radius: 10px; 
            font-size: 0.9em;
        }
        .fab.fa-telegram::before { 
            content: "TG"; 
            font-weight: bold; 
            background: #0088CC; 
            color: white; 
            padding: 2px 8px; 
            border-radius: 10px; 
            font-size: 0.9em;
        }
        .fab.fa-youtube::before { 
            content: "YT"; 
            font-weight: bold; 
            background: #FF0000; 
            color: white; 
            padding: 2px 8px; 
            border-radius: 10px; 
            font-size: 0.9em;
        }
        
        /* Резервные иконки для функциональных элементов */
        .fas.fa-moon::before { content: "🌙"; }
        .fas.fa-sun::before { content: "☀️"; }
        .fas.fa-bars::before { content: "☰"; font-size: 1.8em; }
        .fas.fa-calendar::before { content: "📅"; }
        .fas.fa-play-circle::before { content: "▶️"; }
        .fas.fa-envelope::before { content: "✉️"; }
        .fas.fa-map-marker-alt::before { content: "📍"; }
        .fas.fa-music::before { content: "🎵"; }
        .fas.fa-image::before { content: "🖼️"; }
        .fas.fa-video::before { content: "📹"; }
        
        /* Стили для корректного отображения резервных иконок */
        .fab, .fas {
            display: inline-block;
            width: 1em;
            height: 1em;
            line-height: 1;
            text-align: center;
            font-style: normal;
        }
        .social-links a, .footer-social a, .contact-social a {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .event-icon, .contact-card i {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(fallbackStyle);
}

// Добавление класса scrolled при скролле для изменения стиля шапки
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

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

// Запускаем lazy loading при загрузке страницы
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Обновление структурированных данных при необходимости
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
            
            // Обновляем скрипт
            existingScript.textContent = JSON.stringify(data, null, 2);
        } catch (e) {
            console.error('Ошибка при обновлении structured data:', e);
        }
    }
}

// Запускаем функцию при загрузке страницы
document.addEventListener('DOMContentLoaded', enhanceStructuredData);

// Функция для обновления мета-тегов при динамических изменениях
function updateMetaTags() {
    // Обновляем дату последнего изменения
    const lastModifiedMeta = document.querySelector('meta[name="last-modified"]');
    if (lastModifiedMeta) {
        lastModifiedMeta.content = new Date().toISOString();
    }
}

// Запускаем функцию при загрузке страницы
document.addEventListener('DOMContentLoaded', updateMetaTags);