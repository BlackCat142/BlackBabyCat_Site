// script.js

// Функция инициализации всего функционала сайта
function initSite() {
  // === МОБИЛЬНОЕ МЕНЮ ===
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  // Проверяем наличие элементов перед добавлением обработчиков
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

  // === ВКЛАДКИ "МЕДИА" ===
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  if (tabButtons.length > 0) {
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const target = button.dataset.tab;

        // Убираем активный класс
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        // Добавляем активный класс
        button.classList.add('active');
        const targetElement = document.getElementById(target);
        if (targetElement) {
          targetElement.classList.add('active');
        }
      });
    });
  }

  // === ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      // Проверяем, что это не пустой якорь
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // Закрываем мобильное меню если оно открыто
          if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
          }
          
          window.scrollTo({
            top: targetElement.offsetTop - 100, // 100px для учета высоты шапки
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // === АВТОМАТИЧЕСКОЕ ОБНОВЛЕНИЕ ГОДА ===
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // === ПЕРЕКЛЮЧЕНИЕ ТЕМЫ ===
  setupThemeToggle();

  // === СИСТЕМА "ЭМОЦИЙ" САЙТА ===
  setupSitePersonality();

  // === ВИЗУАЛИЗАЦИЯ МУЗЫКИ ===
  createMusicVisualization();
}

// === ФУНКЦИОНАЛ ПЕРЕКЛЮЧЕНИЯ ТЕМЫ ===
function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Проверка сохраненной темы
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    // Если тема не сохранена, используем системную тему
    const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', systemTheme);
  }
  
  // Обновление иконки переключателя
  function updateThemeIcon() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const iconElements = document.querySelectorAll('.theme-toggle-btn i');
    
    iconElements.forEach(icon => {
      icon.className = currentTheme === 'dark' 
        ? 'fas fa-moon' 
        : 'fas fa-sun';
    });
  }
  
  updateThemeIcon();
  
  // Переключение темы
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
    
    // Принудительное обновление стилей для всех элементов
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }
  
  // Обработчики событий
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleTheme);
  }
  
  // Отслеживание системной темы
  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      updateThemeIcon();
    }
  });
}

// === СИСТЕМА "ЭМОЦИЙ" САЙТА ===
function setupSitePersonality() {
  try {
    // Создаём "память" сайта через localStorage
    const siteMemory = {
      lastVisit: localStorage.getItem('siteLastVisit') || new Date(0).toISOString(),
      visitCount: parseInt(localStorage.getItem('siteVisitCount') || '0', 10),
      userPreferences: JSON.parse(localStorage.getItem('siteUserPreferences') || '{}')
    };
    
    // Увеличиваем счётчик посещений
    siteMemory.visitCount++;
    localStorage.setItem('siteVisitCount', siteMemory.visitCount.toString());
    localStorage.setItem('siteLastVisit', new Date().toISOString());
    
    // Функция "эмоций" сайта в зависимости от времени и активности
    function updateSiteMood() {
      const now = new Date();
      const lastVisit = new Date(siteMemory.lastVisit);
      const hoursSinceLastVisit = (now - lastVisit) / (1000 * 60 * 60);
      
      let mood = 'neutral'; // neutral, happy, lonely, energetic, sleepy, curious
      
      if (siteMemory.visitCount === 1) {
        mood = 'curious'; // Первое посещение
      } else if (hoursSinceLastVisit > 48) {
        mood = 'lonely'; // Долго не посещали
      } else if (hoursSinceLastVisit < 1) {
        mood = 'happy'; // Частые посещения
      } else if (now.getHours() >= 20 || now.getHours() < 6) {
        mood = 'sleepy'; // Ночное время
      }
      
      // Применяем "настроение" к стилям
      document.documentElement.setAttribute('data-mood', mood);
      
      // Обновляем контент в зависимости от настроения
      updateMoodBasedContent(mood);
    }
    
    function updateMoodBasedContent(mood) {
      const heroTagline = document.querySelector('.hero-tagline');
      
      if (!heroTagline) return;
      
      const moods = {
        curious: 'Привет! Я только начинаю свой путь в музыке...',
        happy: 'Спасибо, что снова здесь! Новые треки уже в работе!',
        lonely: 'Скучал по тебе... Хочешь послушать что-то новое?',
        sleepy: 'Тише... даже музыка спит. Загляни завтра!',
        neutral: 'Создаю уникальный звук, объединяющий рэп и хип-хоп в танцевальном стиле'
      };
      
      if (moods[mood]) {
        heroTagline.textContent = moods[mood];
        
        // Добавляем анимацию при изменении настроения
        heroTagline.style.animation = 'pulse 0.5s';
        setTimeout(() => {
          heroTagline.style.animation = '';
        }, 500);
      }
    }
    
    // Сайт "помнит" предпочтения пользователя
    document.addEventListener('click', function(e) {
      const portfolioItem = e.target.closest('.portfolio-item');
      if (portfolioItem) {
        const portfolioContent = portfolioItem.querySelector('.portfolio-content');
        if (portfolioContent) {
          const trackNameElement = portfolioContent.querySelector('h3');
          if (trackNameElement) {
            const trackName = trackNameElement.textContent;
            
            try {
              // Запоминаем любимые треки
              const favorites = JSON.parse(localStorage.getItem('siteFavorites') || '[]');
              if (!favorites.includes(trackName)) {
                favorites.push(trackName);
                localStorage.setItem('siteFavorites', JSON.stringify(favorites));
                
                // Показываем "радость" сайта
                showSiteReaction('Ты полюбил этот трек! Я тоже!');
              }
            } catch (error) {
              console.error('Ошибка при работе с localStorage:', error);
            }
          }
        }
      }
    });
    
    // Функция реакции сайта
    function showSiteReaction(message) {
      // Проверяем, нет ли уже активной реакции
      if (document.querySelector('.site-reaction')) return;
      
      const reaction = document.createElement('div');
      reaction.className = 'site-reaction';
      reaction.innerHTML = `
        <div class="reaction-bubble">
          <span class="reaction-text">${message}</span>
          <div class="reaction-heart">❤️</div>
        </div>
      `;
      document.body.appendChild(reaction);
      
      // Анимация и удаление
      setTimeout(() => {
        if (reaction) {
          reaction.style.opacity = '0';
          reaction.style.transform = 'translateY(-20px)';
          setTimeout(() => {
            if (reaction && reaction.parentNode) {
              reaction.parentNode.removeChild(reaction);
            }
          }, 300);
        }
      }, 3000);
    }
    
    // Сайт "просыпается" и "засыпает" с реальным временем
    function updateDayNightCycle() {
      const now = new Date();
      const hours = now.getHours();
      
      // Ночное время: 20:00 - 6:00
      const isNight = hours >= 20 || hours < 6;
      
      document.documentElement.setAttribute('data-time', isNight ? 'night' : 'day');
      
      // Меняем фон в зависимости от времени суток
      const hero = document.querySelector('.hero');
      if (hero) {
        hero.style.background = isNight 
          ? 'linear-gradient(to bottom, #0a0a15, #05050a)' 
          : 'linear-gradient(to bottom, #1a1a2e, #0f0f1a)';
      }
    }
    
    // Запускаем систему "эмоций" сайта
    updateSiteMood();
    updateDayNightCycle();
    
    // Обновляем цикл каждые 30 минут (достаточно для смены времени суток)
    setInterval(updateDayNightCycle, 30 * 60 * 1000);
    
    console.log(`✨ Сайт проснулся! Посещений: ${siteMemory.visitCount}`);
  } catch (error) {
    console.error('Ошибка в системе эмоций сайта:', error);
  }
}

// === ВИЗУАЛИЗАЦИЯ МУЗЫКИ ===
function createMusicVisualization() {
  try {
    const hero = document.querySelector('.hero');
    if (!hero || document.querySelector('.music-visualization')) return;
    
    const bars = 15; // Уменьшаем количество для лучшей производительности
    let html = '';
    
    for (let i = 0; i < bars; i++) {
      html += `<div class="music-bar" style="--index: ${i}"></div>`;
    }
    
    hero.insertAdjacentHTML('beforeend', `<div class="music-visualization">${html}</div>`);
    
    // Анимация "музыки" с разной частотой для разных столбцов
    setInterval(() => {
      document.querySelectorAll('.music-bar').forEach((bar, index) => {
        // Создаем волну с разным периодом для каждого столбца
        const waveFactor = (Date.now() / 1000 + index * 0.2) % (Math.PI * 2);
        const baseHeight = Math.sin(waveFactor) * 50 + 50;
        
        // Случайные вариации высоты
        const randomVariation = Math.random() * 20 - 10;
        const height = Math.max(0, Math.min(100, baseHeight + randomVariation));
        
        bar.style.height = `${height}%`;
        bar.style.opacity = height > 60 ? '1' : '0.6';
        bar.style.backgroundColor = `hsl(${(index * 20 + Date.now() / 50) % 360}, 70%, 60%)`;
      });
    }, 150);
  } catch (error) {
    console.error('Ошибка при создании визуализации музыки:', error);
  }
}

// === ГЕНЕРАТОР "МЫСЛЕЙ" АРТИСТА ===
function generateArtistThought() {
  const themes = ['звук', 'эмоции', 'Норильск', 'танец', 'ритм', 'свобода', 'музыка', 'стиль'];
  const actions = ['создаю', 'чувствую', 'мечтаю', 'экспериментирую', 'делюсь', 'ищу', 'нахожу'];
  const emotions = ['радость', 'грусть', 'вдохновение', 'тоска', 'энергия', 'гармония', 'страсть'];
  
  const theme = themes[Math.floor(Math.random() * themes.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const emotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  return `💭 "${action} музыку, которая передаёт ${emotion} через ${theme}. Это мой путь..."`;
}

// Запускаем инициализацию при загрузке DOM
document.addEventListener('DOMContentLoaded', initSite);

// Дополнительная защита: запускаем инициализацию при полной загрузке страницы
window.addEventListener('load', () => {
  console.log('Страница полностью загружена');
});