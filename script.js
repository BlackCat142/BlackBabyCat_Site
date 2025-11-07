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

// Обработка формы
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Спасибо! Ваше сообщение отправлено.');
    this.reset();
  });
}

// Обновление года копирайта и переключение темы
document.addEventListener('DOMContentLoaded', function() {
  const currentYearSpan = document.getElementById('currentYear');
  const currentYear = new Date().getFullYear();
  currentYearSpan.textContent = currentYear;

  const themeToggle = document.getElementById('themeToggle');
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const mobileThemeIcon = document.getElementById('mobileThemeIcon');
  const themeColorMeta = document.getElementById('themeColorMeta');

  // Проверяем сохраненную тему в localStorage
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme, themeIcon);
  updateThemeIcon(savedTheme, mobileThemeIcon);
  updateMetaThemeColor(savedTheme);

  // Функция для переключения темы
  function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme, themeIcon);
    updateThemeIcon(newTheme, mobileThemeIcon);
    updateMetaThemeColor(newTheme);
  }

  // Привязываем обработчики к кнопкам
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);
});

function updateThemeIcon(theme, iconElement) {
  if (theme === 'light') {
    iconElement.classList.remove('fa-moon');
    iconElement.classList.add('fa-sun');
  } else {
    iconElement.classList.remove('fa-sun');
    iconElement.classList.add('fa-moon');
  }
}

function updateMetaThemeColor(theme) {
  const meta = document.getElementById('themeColorMeta');
  if (meta) {
    meta.content = theme === 'light' ? '#ffffff' : '#8b5cf6';
  }
}
