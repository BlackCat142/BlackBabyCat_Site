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
            // Изменяем иконку бургер-меню
            const icon = mobileMenuToggle.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Закрытие мобильного меню при клике на ссылку
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
        
        // Закрытие меню при клике вне его области
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !mobileMenuToggle.contains(e.target)) {
                mobileMenu.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
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
            
            // Если переключились на видео, инициализируем плеер
            if (target === 'video') {
                initVideoPreviews();
            }
        });
    });
    
    // Инициализация видео превью
    initVideoPreviews();
    
    // Плавная прокрутка к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Закрываем мобильное меню если оно открыто
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Анимация при скролле
    initScrollAnimations();
    
    // Инициализация ленивой загрузки изображений
    initLazyLoading();
    
    // Обработка видео превью
    function initVideoPreviews() {
        const videoPreviews = document.querySelectorAll('.video-preview');
        const videoPlayerContainer = document.getElementById('videoPlayerContainer');
        
        videoPreviews.forEach(preview => {
            preview.addEventListener('click', function() {
                const videoId = this.getAttribute('data-video-id');
                const title = this.querySelector('h3').textContent;
                
                // Создаем YouTube iframe
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                iframe.frameBorder = '0';
                
                // Очищаем контейнер и добавляем плеер
                videoPlayerContainer.innerHTML = '';
                videoPlayerContainer.innerHTML = `
                    <div class="video-player-header">
                        <h3>Сейчас играет: ${title}</h3>
                        <button class="close-video-btn" id="closeVideoBtn">
                            <i class="fas fa-times"></i> Закрыть
                        </button>
                    </div>
                `;
                videoPlayerContainer.querySelector('.video-player-header').appendChild(iframe);
                
                // Добавляем обработчик для кнопки закрытия
                document.getElementById('closeVideoBtn').addEventListener('click', function() {
                    videoPlayerContainer.innerHTML = `
                        <div class="video-player-placeholder">
                            <p>Выберите видео для воспроизведения</p>
                        </div>
                    `;
                });
            });
        });
    }
    
    // Анимация при скролле
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Наблюдаем за карточками
        document.querySelectorAll('.portfolio-item, .press-item, .event-item, .contact-card').forEach(item => {
            observer.observe(item);
        });
    }
    
    // Ленивая загрузка изображений
    function initLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            // Браузер поддерживает нативную ленивую загрузку
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                img.src = img.src;
            });
        } else {
            // Полифил для браузеров без поддержки
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('lazy-loaded');
                        observer.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => {
                if (img.dataset.src) {
                    imageObserver.observe(img);
                }
            });
        }
    }
});

// Функция переключения темы
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    updateMetaThemeColor(newTheme);
    
    // Добавляем анимацию переключения
    document.body.classList.add('theme-transition');
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
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

// Функция для кнопок билетов
function openTickets(url) {
    window.open(url, '_blank');
    // Отправляем событие в Яндекс.Метрику
    if (typeof ym !== 'undefined') {
        ym(99999999, 'reachGoal', 'tickets_click');
    }
}

// Предзагрузка изображений
function preloadImages() {
    const imagesToPreload = [
        'https://sun9-67.userapi.com/s/v1/ig2/E_25I6AaaBX6H8Q8M88bbftus-JkSYy3VZjrdHEPyGRuIya4jdxaQO8fIMKJepnrhteKP9SNwWEKU6xWtQyUy7NL.jpg',
        'https://sun9-59.userapi.com/s/v1/ig2/hI6RndpG5SNtGXVn6FeFyqB0YUFoEUiecdRbApTbweGcE5N-8pS1Uvil9mSB1Yz7BTg8e4-OYIyH3bcJjZ15qpAw.jpg',
        'https://sun9-47.userapi.com/s/v1/ig2/CCQF2pAUuf3BN31-Pswkx3ih9FmZR9kNjUKiWVGA6E8O5Mtb_mPO6yx_WpeqKv9evHQK7BfSa7qTHJfwLT2iLJuu.jpg',
        'https://sun9-60.userapi.com/s/v1/ig2/P_o0takqAuN8glR3g_5NyH7igPK8q0aC-eSpvrqf4RIeP-or2xXFIkyEiirg39LW6JwnLzJofoxgz2cbc1A7d4Me.jpg'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Запускаем предзагрузку при загрузке страницы
window.addEventListener('load', preloadImages);

// Проверка поддержки service workers для PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('ServiceWorker зарегистрирован:', registration.scope);
        }).catch(error => {
            console.log('Регистрация ServiceWorker не удалась:', error);
        });
    });
}