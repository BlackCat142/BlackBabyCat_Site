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