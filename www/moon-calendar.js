// moon-calendar.js - Лунный Календарь и Дневник Намерений
// Улучшенная версия с точными расчётами фаз луны и динамическими рекомендациями

(function() {
  'use strict';

  // === КОНСТАНТЫ И ДАННЫЕ ===
  const MOON_PHASES = {
    'new-moon': { name: 'Новолуние', icon: '🌑', startDay: 0, endDay: 1.5 },
    'waxing-crescent': { name: 'Растущая луна', icon: '🌒', startDay: 1.5, endDay: 6.5 },
    'first-quarter': { name: 'Первая четверть', icon: '🌓', startDay: 6.5, endDay: 8.5 },
    'waxing-gibbous': { name: 'Прибывающая луна', icon: '🌔', startDay: 8.5, endDay: 13.5 },
    'full-moon': { name: 'Полнолуние', icon: '🌕', startDay: 13.5, endDay: 15.5 },
    'waning-gibbous': { name: 'Убывающая луна', icon: '🌖', startDay: 15.5, endDay: 20.5 },
    'last-quarter': { name: 'Последняя четверть', icon: '🌗', startDay: 20.5, endDay: 22.5 },
    'waning-crescent': { name: 'Стареющая луна', icon: '🌘', startDay: 22.5, endDay: 29.5 }
  };

  const ZODIAC_SIGNS = [
    '♈ Овен', '♉ Телец', '♊ Близнецы', '♋ Рак',
    '♌ Лев', '♍ Дева', '♎ Весы', '♏ Скорпион',
    '♐ Стрелец', '♑ Козерог', '♒ Водолей', '♓ Рыбы'
  ];

  // Базовые рекомендации для каждой фазы
  const BASE_RECOMMENDATIONS = {
    'new-moon': {
      positive: ['Загадывайте желания', 'Ставьте новые цели', 'Начинайте проекты', 'Планируйте будущее'],
      negative: ['Избегайте спешки', 'Не принимайте поспешных решений'],
      ritual: 'Ритуал на исполнение желаний',
      meditation: 'Медитация на новое начало'
    },
    'waxing-crescent': {
      positive: ['Развивайте начатое', 'Привлекайте ресурсы', 'Работайте над целями', 'Учитесь новому'],
      negative: ['Не распыляйтесь', 'Избегайте конфликтов'],
      ritual: 'Ритуал на привлечение изобилия',
      meditation: 'Медитация роста'
    },
    'first-quarter': {
      positive: ['Действуйте решительно', 'Преодолевайте препятствия', 'Проявляйте инициативу', 'Боритесь за цели'],
      negative: ['Контролируйте агрессию', 'Избегайте рисков'],
      ritual: 'Ритуал на силу и энергию',
      meditation: 'Медитация внутренней силы'
    },
    'waxing-gibbous': {
      positive: ['Завершайте дела', 'Шлифуйте детали', 'Готовьтесь к результату', 'Анализируйте прогресс'],
      negative: ['Не перфекционируйте чрезмерно', 'Избегайте критики'],
      ritual: 'Ритуал благодарности',
      meditation: 'Медитация завершения'
    },
    'full-moon': {
      positive: ['Подводите итоги', 'Празднуйте успехи', 'Отпускайте старое', 'Проводите ритуалы'],
      negative: ['Контролируйте эмоции', 'Избегайте конфликтов'],
      ritual: 'Мощный ритуал исполнения желаний',
      meditation: 'Медитация полной луны'
    },
    'waning-gibbous': {
      positive: ['Делитесь опытом', 'Помогайте другим', 'Анализируйте результат', 'Благодарите'],
      negative: ['Не цепляйтесь за прошлое', 'Избегайте жалости к себе'],
      ritual: 'Ритуал благодарности вселенной',
      meditation: 'Медитация благодарности'
    },
    'last-quarter': {
      positive: ['Избавляйтесь от ненужного', 'Завершайте старые дела', 'Очищайте пространство', 'Отпускайте'],
      negative: ['Не начинайте новое', 'Избегайте долгов'],
      ritual: 'Ритуал очищения',
      meditation: 'Медитация отпускания'
    },
    'waning-crescent': {
      positive: ['Отдыхайте', 'Восстанавливайтесь', 'Готовьтесь к новому циклу', 'Медитируйте'],
      negative: ['Не напрягайтесь', 'Избегайте важных решений'],
      ritual: 'Ритуал подготовки к новому циклу',
      meditation: 'Медитация тишины'
    }
  };

  // Рекомендации по знакам зодиака
  const ZODIAC_RECOMMENDATIONS = {
    '♈ Овен': 'Энергия действий! Проявляйте инициативу, начинайте смелые проекты.',
    '♉ Телец': 'Время стабильности! Работайте над материальными целями, наслаждайтесь красотой.',
    '♊ Близнецы': 'Период общения! Учитесь, делитесь идеями, заводите полезные контакты.',
    '♋ Рак': 'Время заботы! Уделите внимание семье, дому, эмоциональному комфорту.',
    '♌ Лев': 'Период творчества! Выражайте себя, будьте в центре внимания, лидируйте.',
    '♍ Дева': 'Время порядка! Анализируйте, систематизируйте, заботьтесь о здоровье.',
    '♎ Весы': 'Период гармонии! Налаживайте отношения, ищите баланс, создавайте красоту.',
    '♏ Скорпион': 'Время трансформации! Глубокая работа над собой, избавление от старого.',
    '♐ Стрелец': 'Период расширения! Путешествуйте, учитесь, ставьте глобальные цели.',
    '♑ Козерог': 'Время дисциплины! Работайте упорно, стройте долгосрочные планы.',
    '♒ Водолей': 'Период инноваций! Экспериментируйте, дружите, меняйте жизнь к лучшему.',
    '♓ Рыбы': 'Время интуиции! Медитируйте, творите, слушайте внутренний голос.'
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

  // Получение знака зодиака для луны (улучшенный алгоритм)
  function getMoonSign(date) {
    // Более точный расчёт положения луны через сидерический месяц
    const knownNewMoon = new Date(2000, 0, 6, 18, 14);
    const diffTime = date.getTime() - knownNewMoon.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    // Луна проходит через весь зодиак примерно за 27.3 дней (сидерический месяц)
    const siderealMonth = 27.321661;
    const moonPosition = (diffDays % siderealMonth) / siderealMonth * 360;
    
    // Разделение на 12 знаков по 30 градусов
    const signIndex = Math.floor(moonPosition / 30) % 12;
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
    
    // Обновление рекомендаций - генерация динамических рекомендаций
    const recommendationEl = document.getElementById('moonRecommendation');
    if (recommendationEl) {
      recommendationEl.innerHTML = generateDailyRecommendation(today, phase);
    }
  }

  // === ГЕНЕРАЦИЯ ДИНАМИЧЕСКИХ РЕКОМЕНДАЦИЙ ===
  function generateDailyRecommendation(date, phase) {
    const moonSign = getMoonSign(date);
    
    // Используем новый движок рекомендаций если он доступен
    if (window.MoonRecommendationEngine) {
      return window.MoonRecommendationEngine.generate(date, phase, moonSign);
    }
    
    // Fallback к старой системе
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
    const baseRec = BASE_RECOMMENDATIONS[phase];
    
    const positiveIndex = (dayOfWeek + dayOfMonth) % baseRec.positive.length;
    const negativeIndex = dayOfWeek % baseRec.negative.length;
    
    let recommendation = `<strong>🌙 Фаза:</strong> ${MOON_PHASES[phase].icon} ${MOON_PHASES[phase].name}<br><br>`;
    recommendation += `<strong>✨ Благоприятно:</strong> ${baseRec.positive[positiveIndex]}. ${ZODIAC_RECOMMENDATIONS[moonSign]}<br><br>`;
    recommendation += `<strong>⚠️ Избегать:</strong> ${baseRec.negative[negativeIndex]}.<br><br>`;
    recommendation += `<strong>🕯️ Ритуал:</strong> ${baseRec.ritual}.<br><br>`;
    recommendation += `<strong>🧘 Медитация:</strong> ${baseRec.meditation}.`;
    
    return recommendation;
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
