// script.js

// Мобильное меню
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
});

// Закрытие мобильного меню при клике на ссылку
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
  });
});

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
// Автоматическое обновление года в футере
document.addEventListener('DOMContentLoaded', function() {
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
});
// script.js - добавьте этот код
document.addEventListener('DOMContentLoaded', function() {
  // Создаём "память" сайта через localStorage
  const siteMemory = {
    lastVisit: localStorage.getItem('siteLastVisit') || new Date(0),
    visitCount: parseInt(localStorage.getItem('siteVisitCount') || '0'),
    userPreferences: JSON.parse(localStorage.getItem('siteUserPreferences') || '{}')
  };
  
  // Увеличиваем счётчик посещений
  siteMemory.visitCount++;
  localStorage.setItem('siteVisitCount', siteMemory.visitCount);
  localStorage.setItem('siteLastVisit', new Date().toISOString());
  
  // Функция "эмоций" сайта в зависимости от времени и активности
  function updateSiteMood() {
    const now = new Date();
    const lastVisit = new Date(siteMemory.lastVisit);
    const hoursSinceLastVisit = (now - lastVisit) / (1000 * 60 * 60);
    
    let mood = 'neutral'; // neutral, happy, lonely, energetic
    
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
    const socialLinks = document.querySelector('.social-links');
    
    const moods = {
      curious: 'Привет! Я только начинаю свой путь в музыке...',
      happy: 'Спасибо, что снова здесь! Новые треки уже в работе!',
      lonely: 'Скучал по тебе... Хочешь послушать что-то новое?',
      sleepy: 'Тише... даже музыка спит. Загляни завтра!',
      neutral: 'Создаю уникальный звук, объединяющий рэп и хип-хоп в танцевальном стиле'
    };
    
    if (heroTagline && moods[mood]) {
      heroTagline.textContent = moods[mood];
      
      // Добавляем анимацию при изменении настроения
      heroTagline.style.animation = 'pulse 0.5s';
      setTimeout(() => {
        heroTagline.style.animation = '';
      }, 500);
    }
  }
  
  // Запускаем систему "эмоций" сайта
  updateSiteMood();
  
  // Сайт "помнит" предпочтения пользователя
  document.addEventListener('click', function(e) {
    if (e.target.closest('.portfolio-item')) {
      const trackName = e.target.closest('.portfolio-content').querySelector('h3').textContent;
      
      // Запоминаем любимые треки
      const favorites = JSON.parse(localStorage.getItem('siteFavorites') || '[]');
      if (!favorites.includes(trackName)) {
        favorites.push(trackName);
        localStorage.setItem('siteFavorites', JSON.stringify(favorites));
        
        // Показываем "радость" сайта
        showSiteReaction('Ты полюбил этот трек! Я тоже!');
      }
    }
  });
  
  // Функция реакции сайта
  function showSiteReaction(message) {
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
      reaction.style.opacity = '0';
      reaction.style.transform = 'translateY(-20px)';
      setTimeout(() => reaction.remove(), 300);
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
  
  // Обновляем цикл каждую минуту
  updateDayNightCycle();
  setInterval(updateDayNightCycle, 60000);
  
  console.log(`✨ Сайт проснулся! Посещений: ${siteMemory.visitCount}`);
});
function generateArtistThought() {
  const themes = ['звук', 'эмоции', 'Норильск', 'танец', 'ритм', 'свобода'];
  const actions = ['создаю', 'чувствую', 'мечтаю', 'экспериментирую', 'делюсь'];
  const emotions = ['радость', 'грусть', 'вдохновение', 'тоска', 'энергия'];
  
  const theme = themes[Math.floor(Math.random() * themes.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const emotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  return `💭 "${action} музыку, которая передаёт ${emotion} через ${theme}. Это мой путь..."`;
}
// Имитация визуализации музыки
function createMusicVisualization() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const bars = 20;
  let html = '';
  
  for (let i = 0; i < bars; i++) {
    html += `<div class="music-bar" style="--index: ${i}"></div>`;
  }
  
  hero.insertAdjacentHTML('beforeend', `<div class="music-visualization">${html}</div>`);
  
  // Анимация "музыки"
  setInterval(() => {
    document.querySelectorAll('.music-bar').forEach(bar => {
      const height = Math.random() * 100;
      bar.style.height = `${height}%`;
      bar.style.opacity = height > 50 ? '1' : '0.5';
    });
  }, 100);
}
