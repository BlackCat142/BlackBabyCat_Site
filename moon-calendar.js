// moon-calendar.js - Лунный Календарь и Дневник Намерений

(function() {
  'use strict';

  // === КОНСТАНТЫ И ДАННЫЕ ===
  const MOON_PHASES = {
    'new-moon': { name: 'Новолуние', icon: '🌑' },
    'waxing-crescent': { name: 'Растущая луна', icon: '🌒' },
    'first-quarter': { name: 'Первая четверть', icon: '🌓' },
    'waxing-gibbous': { name: 'Прибывающая луна', icon: '🌔' },
    'full-moon': { name: 'Полнолуние', icon: '🌕' },
    'waning-gibbous': { name: 'Убывающая луна', icon: '🌖' },
    'last-quarter': { name: 'Последняя четверть', icon: '🌗' },
    'waning-crescent': { name: 'Стареющая луна', icon: '🌘' }
  };

  const ZODIAC_SIGNS = [
    '♈ Овен', '♉ Телец', '♊ Близнецы', '♋ Рак',
    '♌ Лев', '♍ Дева', '♎ Весы', '♏ Скорпион',
    '♐ Стрелец', '♑ Козерог', '♒ Водолей', '♓ Рыбы'
  ];

  const RECOMMENDATIONS = {
    'new-moon': 'Время новых начинаний! Загадывайте желания, ставьте цели, начинайте новые проекты. Идеально для закладки фундамента будущих достижений.',
    'waxing-crescent': 'Период роста и развития. Продолжайте начатое, привлекайте ресурсы, работайте над своими целями постепенно.',
    'first-quarter': 'Время действий и решительности. Преодолевайте препятствия, принимайте важные решения, проявляйте инициативу.',
    'waxing-gibbous': 'Завершающая стадия роста. Доводите дела до конца, шлифуйте детали, готовьтесь к результату.',
    'full-moon': 'Пик энергии! Идеальное время для ритуалов, подведения итогов, празднования успехов и отпускания старого.',
    'waning-gibbous': 'Время благодарности и分享. Делитесь опытом, помогайте другим, анализируйте полученный результат.',
    'last-quarter': 'Период отпускания. Избавляйтесь от ненужного, завершайте старые дела, очищайте пространство.',
    'waning-crescent': 'Время отдыха и восстановления. Отпустите прошлое, готовьтесь к новому циклу, медитируйте.'
  };

  // === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ===
  let currentDate = new Date();
  let selectedDate = null;
  let journalEntries = [];

  // === ИНИЦИАЛИЗАЦИЯ ===
  document.addEventListener('DOMContentLoaded', function() {
    initMoonDisplay();
    initCalendar();
    initJournal();
    loadJournalEntries();
  });

  // === ФАЗЫ ЛУНЫ ===
  
  // Вычисление возраста луны в днях (основной метод)
  function getMoonAge(date) {
    const knownNewMoon = new Date(2000, 0, 6, 18, 14); // Известное новолуние 6 января 2000 в 18:14 UTC
    const diffTime = date.getTime() - knownNewMoon.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const synodicMonth = 29.53058867; // Средняя продолжительность лунного месяца
    let age = diffDays % synodicMonth;
    if (age < 0) age += synodicMonth;
    return age;
  }

  // Вычисление фазы луны на основе возраста (более точный метод)
  function getMoonPhase(date) {
    const age = getMoonAge(date);
    
    // Границы фаз по возрасту луны в днях
    // Каждая фаза занимает примерно 1/8 лунного цикла (~3.69 дней)
    if (age < 1.845 || age > 27.685) return 'new-moon';         // Новолуние 🌑
    if (age < 5.535) return 'waxing-crescent';                   // Растущий серп 🌒
    if (age < 9.225) return 'first-quarter';                     // Первая четверть 🌓
    if (age < 12.915) return 'waxing-gibbous';                   // Прибывающая 🌔
    if (age < 16.605) return 'full-moon';                        // Полнолуние 🌕
    if (age < 20.295) return 'waning-gibbous';                   // Убывающая 🌖
    if (age < 23.985) return 'last-quarter';                     // Последняя четверть 🌗
    return 'waning-crescent';                                    // Стареющая 🌘
  }

  // Вычисление освещённости луны (в процентах)
  function getMoonIllumination(date) {
    const age = getMoonAge(date);
    const synodicMonth = 29.53058867;
    const illumination = (1 - Math.cos((2 * Math.PI * age) / synodicMonth)) / 2 * 100;
    return Math.round(illumination);
  }

  // Получение знака зодиака для луны (приблизительно)
  function getMoonSign(date) {
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const signIndex = Math.floor((dayOfYear % 365) / 30.44) % 12;
    return ZODIAC_SIGNS[signIndex];
  }

  // === ОТОБРАЖЕНИЕ ТЕКУЩЕЙ ФАЗЫ ЛУНЫ ===
  function initMoonDisplay() {
    const today = new Date();
    const phase = getMoonPhase(today);
    const phaseData = MOON_PHASES[phase];
    
    // Обновление визуализации
    const moonVisual = document.getElementById('currentMoonVisual');
    if (moonVisual) {
      moonVisual.className = `moon-phase-visual ${phase}`;
    }
    
    // Обновление названия фазы
    const phaseNameEl = document.getElementById('currentPhaseName');
    if (phaseNameEl) {
      phaseNameEl.textContent = `${phaseData.icon} ${phaseData.name}`;
    }
    
    // Обновление даты
    const dateEl = document.getElementById('currentDate');
    if (dateEl) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      dateEl.textContent = today.toLocaleDateString('ru-RU', options);
    }
    
    // Обновление деталей
    const moonAgeEl = document.getElementById('moonAge');
    if (moonAgeEl) {
      moonAgeEl.textContent = getMoonAge(today).toFixed(1) + ' дня';
    }
    
    const illuminationEl = document.getElementById('moonIllumination');
    if (illuminationEl) {
      illuminationEl.textContent = getMoonIllumination(today) + '%';
    }
    
    const signEl = document.getElementById('moonSign');
    if (signEl) {
      signEl.textContent = getMoonSign(today);
    }
    
    // Обновление рекомендаций
    const recommendationEl = document.getElementById('moonRecommendation');
    if (recommendationEl) {
      recommendationEl.textContent = RECOMMENDATIONS[phase];
    }
  }

  // === КАЛЕНДАРЬ ===
  function initCalendar() {
    renderCalendar(currentDate);
    
    // Обработчики кнопок навигации
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    const todayBtn = document.getElementById('todayBtn');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
      });
    }
    
    if (todayBtn) {
      todayBtn.addEventListener('click', () => {
        currentDate = new Date();
        renderCalendar(currentDate);
        initMoonDisplay(); // Обновить отображение текущей фазы луны
      });
    }
  }

  // Автоматическое обновление фазы луны при загрузке и каждый день
  function scheduleDailyMoonUpdate() {
    // Вычислить время до полуночи
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    // Запланировать обновление после полуночи
    setTimeout(() => {
      initMoonDisplay();
      renderCalendar(currentDate);
      // Рекурсивно планировать следующее обновление
      scheduleDailyMoonUpdate();
    }, msUntilMidnight);
  }
  
  // Запустить ежедневное обновление после первой инициализации
  document.addEventListener('DOMContentLoaded', function() {
    scheduleDailyMoonUpdate();
  });

  function renderCalendar(date) {
    const grid = document.getElementById('calendarGrid');
    const monthYearEl = document.getElementById('calendarMonthYear');
    
    if (!grid || !monthYearEl) return;
    
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Обновление заголовка
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    monthYearEl.textContent = `${monthNames[month]} ${year}`;
    
    // Очистка сетки
    grid.innerHTML = '';
    
    // Дни недели
    const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    weekdays.forEach(day => {
      const weekdayEl = document.createElement('div');
      weekdayEl.className = 'calendar-weekday';
      weekdayEl.textContent = day;
      grid.appendChild(weekdayEl);
    });
    
    // Первый день месяца
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Корректировка для начала недели с понедельника
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;
    
    // Предыдущий месяц
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const dayEl = createDayElement(new Date(year, month - 1, dayNum), true);
      grid.appendChild(dayEl);
    }
    
    // Текущий месяц
    const today = new Date();
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const currentDay = new Date(year, month, day);
      const dayEl = createDayElement(currentDay, false);
      
      // Пометка сегодняшнего дня
      if (currentDay.toDateString() === today.toDateString()) {
        dayEl.classList.add('today');
      }
      
      // Пометка выбранного дня
      if (selectedDate && currentDay.toDateString() === selectedDate.toDateString()) {
        dayEl.classList.add('selected');
      }
      
      grid.appendChild(dayEl);
    }
    
    // Следующий месяц (заполнение до 42 ячеек)
    const totalCells = startDay + lastDay.getDate();
    const nextMonthDays = 42 - totalCells;
    for (let day = 1; day <= nextMonthDays; day++) {
      const dayEl = createDayElement(new Date(year, month + 1, day), true);
      grid.appendChild(dayEl);
    }
  }

  function createDayElement(date, isOtherMonth) {
    const dayEl = document.createElement('div');
    dayEl.className = `calendar-day ${isOtherMonth ? 'other-month' : ''}`;
    
    const phase = getMoonPhase(date);
    const phaseData = MOON_PHASES[phase];
    
    dayEl.innerHTML = `
      <div class="phase-icon">${phaseData.icon}</div>
      <div class="calendar-day-number">${date.getDate()}</div>
      <div class="calendar-day-phase">${phaseData.name.split(' ')[0]}</div>
    `;
    
    dayEl.addEventListener('click', () => {
      // Снятие выделения с предыдущего
      document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
      dayEl.classList.add('selected');
      selectedDate = date;
      
      // Установка даты в форму дневника
      const dateInput = document.getElementById('entryDate');
      if (dateInput) {
        dateInput.value = formatDateForInput(date);
      }
      
      // Автоматический выбор фазы
      const phaseSelect = document.getElementById('moonPhaseSelect');
      if (phaseSelect) {
        phaseSelect.value = phase;
      }
      
      // Прокрутка к форме
      document.querySelector('.journal-section').scrollIntoView({ behavior: 'smooth' });
    });
    
    return dayEl;
  }

  function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatDisplayDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
  }

  // === ДНЕВНИК НАМЕРЕНИЙ ===
  function initJournal() {
    const form = document.getElementById('journalForm');
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }
    
    // Установка текущей даты по умолчанию
    const dateInput = document.getElementById('entryDate');
    if (dateInput) {
      dateInput.value = formatDateForInput(new Date());
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    
    const entry = {
      id: Date.now(),
      date: document.getElementById('entryDate').value,
      moonPhase: document.getElementById('moonPhaseSelect').value,
      intentionType: document.getElementById('intentionType').value,
      title: document.getElementById('entryTitle').value,
      text: document.getElementById('entryText').value,
      createdAt: new Date().toISOString()
    };
    
    journalEntries.unshift(entry);
    saveJournalEntries();
    renderEntries();
    
    // Очистка формы
    e.target.reset();
    document.getElementById('entryDate').value = formatDateForInput(new Date());
    
    // Показ уведомления
    showNotification('Намерение успешно сохранено! ✨');
  }

  function saveJournalEntries() {
    try {
      localStorage.setItem('moonJournalEntries', JSON.stringify(journalEntries));
    } catch (e) {
      console.error('Ошибка сохранения записей:', e);
      showNotification('Ошибка сохранения записи');
    }
  }

  function loadJournalEntries() {
    try {
      const saved = localStorage.getItem('moonJournalEntries');
      if (saved) {
        journalEntries = JSON.parse(saved);
        renderEntries();
      }
    } catch (e) {
      console.error('Ошибка загрузки записей:', e);
      journalEntries = [];
    }
  }

  function renderEntries() {
    const container = document.getElementById('entriesContainer');
    if (!container) return;
    
    if (journalEntries.length === 0) {
      container.innerHTML = '<p class="no-entries">Пока нет записей. Создайте первое намерение!</p>';
      return;
    }
    
    container.innerHTML = journalEntries.map(entry => {
      const phaseData = MOON_PHASES[entry.moonPhase] || { name: entry.moonPhase, icon: '' };
      const typeIcons = {
        'goal': '🎯',
        'ritual': '✨',
        'meditation': '🧘',
        'affirmation': '💫',
        'gratitude': '🙏',
        'release': '🔓'
      };
      const typeIcon = typeIcons[entry.intentionType] || '📝';
      
      return `
        <div class="entry-card" data-id="${entry.id}">
          <div class="entry-header">
            <span class="entry-date">${formatDisplayDate(entry.date)}</span>
            <span class="entry-moon-phase">${phaseData.icon} ${phaseData.name}</span>
          </div>
          <div class="entry-title">${typeIcon} ${escapeHtml(entry.title)}</div>
          <div class="entry-text">${escapeHtml(entry.text)}</div>
          <div class="entry-actions">
            <button class="entry-action-btn" onclick="editEntry(${entry.id})">
              <i class="fas fa-edit"></i> Редактировать
            </button>
            <button class="entry-action-btn delete" onclick="deleteEntry(${entry.id})">
              <i class="fas fa-trash"></i> Удалить
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Глобальные функции для кнопок редактирования/удаления
  window.editEntry = function(id) {
    const entry = journalEntries.find(e => e.id === id);
    if (!entry) return;
    
    document.getElementById('entryDate').value = entry.date;
    document.getElementById('moonPhaseSelect').value = entry.moonPhase;
    document.getElementById('intentionType').value = entry.intentionType;
    document.getElementById('entryTitle').value = entry.title;
    document.getElementById('entryText').value = entry.text;
    
    // Удаление старой записи перед редактированием
    deleteEntry(id, true);
    
    // Прокрутка к форме
    document.querySelector('.journal-form').scrollIntoView({ behavior: 'smooth' });
  };

  window.deleteEntry = function(id, isEdit = false) {
    if (!isEdit && !confirm('Вы уверены, что хотите удалить эту запись?')) return;
    
    journalEntries = journalEntries.filter(e => e.id !== id);
    saveJournalEntries();
    renderEntries();
    
    if (!isEdit) {
      showNotification('Запись удалена');
    }
  };

  // === УВЕДОМЛЕНИЯ ===
  function showNotification(message) {
    const existing = document.querySelector('.journal-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'journal-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #8b5cf6;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
      animation: slideUp 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideUp 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  // Добавление анимации
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
  `;
  document.head.appendChild(style);

})();
