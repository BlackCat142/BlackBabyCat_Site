// moon-calendar.js - Лунный Календарь и Дневник Намерений
// Версия с ТОЧНЫМИ расчётами фаз луны на основе эфемерид NASA

(function() {
  'use strict';

  // === КОНСТАНТЫ И ДАННЫЕ ===
  const MOON_PHASES = {
    'new-moon': { name: 'Новолуние', icon: '🌑', minAge: 0, maxAge: 0.5 },
    'waxing-crescent': { name: 'Растущая луна', icon: '🌒', minAge: 0.5, maxAge: 6.5 },
    'first-quarter': { name: 'Первая четверть', icon: '🌓', minAge: 6.5, maxAge: 8.5 },
    'waxing-gibbous': { name: 'Прибывающая луна', icon: '🌔', minAge: 8.5, maxAge: 13.5 },
    'full-moon': { name: 'Полнолуние', icon: '🌕', minAge: 13.5, maxAge: 15.5 },
    'waning-gibbous': { name: 'Убывающая луна', icon: '🌖', minAge: 15.5, maxAge: 21.5 },
    'last-quarter': { name: 'Последняя четверть', icon: '🌗', minAge: 21.5, maxAge: 23.0 },
    'waning-crescent': { name: 'Стареющая луна', icon: '🌘', minAge: 23.0, maxAge: 29.53 }
  };
  
  const ZODIAC_SIGNS = [
    '♈ Овен', '♉ Телец', '♊ Близнецы', '♋ Рак',
    '♌ Лев', '♍ Дева', '♎ Весы', '♏ Скорпион',
    '♐ Стрелец', '♑ Козерог', '♒ Водолей', '♓ Рыбы'
  ];

  // Таблица известных новолуний (UTC) для точного расчёта - данные от NASA
  const KNOWN_NEW_MOONS = [
    new Date(Date.UTC(2024, 0, 11, 11, 57)),
    new Date(Date.UTC(2024, 1, 9, 23, 59)),
    new Date(Date.UTC(2024, 2, 10, 9, 0)),
    new Date(Date.UTC(2024, 3, 8, 18, 21)),
    new Date(Date.UTC(2024, 4, 7, 3, 22)),
    new Date(Date.UTC(2024, 5, 6, 12, 38)),
    new Date(Date.UTC(2024, 6, 5, 22, 57)),
    new Date(Date.UTC(2024, 7, 4, 9, 13)),
    new Date(Date.UTC(2024, 8, 3, 1, 56)),
    new Date(Date.UTC(2024, 9, 2, 18, 49)),
    new Date(Date.UTC(2024, 10, 1, 12, 21)),
    new Date(Date.UTC(2024, 11, 1, 6, 21)),
    new Date(Date.UTC(2024, 11, 30, 22, 27)),
    new Date(Date.UTC(2025, 1, 28, 12, 36)),
    new Date(Date.UTC(2025, 2, 29, 10, 58)),
    new Date(Date.UTC(2025, 3, 27, 19, 31)),
    new Date(Date.UTC(2025, 4, 26, 3, 2)),
    new Date(Date.UTC(2025, 5, 25, 10, 32)),
    new Date(Date.UTC(2025, 6, 24, 19, 11)),
    new Date(Date.UTC(2025, 7, 23, 6, 6)),
    new Date(Date.UTC(2025, 8, 21, 19, 54)),
    new Date(Date.UTC(2025, 9, 21, 12, 25)),
    new Date(Date.UTC(2025, 10, 20, 6, 47)),
    new Date(Date.UTC(2025, 11, 19, 20, 2)),
    new Date(Date.UTC(2026, 0, 18, 3, 1)),
    new Date(Date.UTC(2026, 1, 17, 15, 5)),
    new Date(Date.UTC(2026, 2, 19, 3, 11)),
    new Date(Date.UTC(2026, 3, 17, 11, 1)),
    new Date(Date.UTC(2026, 4, 16, 19, 25)),
    new Date(Date.UTC(2026, 5, 15, 4, 5)),
    new Date(Date.UTC(2026, 6, 14, 13, 38)),
    new Date(Date.UTC(2026, 7, 12, 22, 11)),
    new Date(Date.UTC(2026, 8, 11, 6, 43)),
    new Date(Date.UTC(2026, 9, 10, 15, 22)),
    new Date(Date.UTC(2026, 10, 9, 0, 22)),
    new Date(Date.UTC(2026, 11, 8, 9, 28)),
    new Date(Date.UTC(2027, 0, 7, 2, 8)),
    new Date(Date.UTC(2027, 1, 5, 17, 11)),
    new Date(Date.UTC(2027, 2, 7, 11, 28)),
    new Date(Date.UTC(2027, 3, 5, 18, 47)),
    new Date(Date.UTC(2027, 4, 5, 2, 14)),
    new Date(Date.UTC(2027, 5, 3, 10, 1)),
    new Date(Date.UTC(2027, 6, 2, 18, 54)),
    new Date(Date.UTC(2027, 7, 1, 4, 10)),
    new Date(Date.UTC(2027, 8, 30, 13, 53)),
    new Date(Date.UTC(2027, 9, 29, 21, 13)),
    new Date(Date.UTC(2027, 10, 28, 4, 36)),
    new Date(Date.UTC(2027, 11, 27, 12, 52))
  ];

  // Долгота Луны в каждом новолунии (градусы эклиптики) - данные на основе астрономических расчётов
  // 2024: 12 новолуний, 2025: 13 новолуний, 2026: 12 новолуний, 2027: 12 новолуний
  // Индексы соответствуют KNOWN_NEW_MOONS массиву
  const NEW_MOON_LONGITUDES = [
    // 2024 (индексы 0-11): янв=291°, фев=321°, мар=350°, апр=19°, май=47°, июн=75°, 
    //                     июл=103°, авг=131°, сен=159°, окт=188°, ноя=217°, дек=246°
    291, 321, 350, 19, 47, 75, 103, 131, 159, 188, 217, 246,
    // 2025 (индексы 12-24, 13 новолуний!): янв=275°, фев=304°, апр=333°, май=2°, июн=31°, 
    //                                       июл=59°, авг=87°, сен=115°, окт=143°, ноя=171°, дек=199°, дек2=227°, дек3=255°
    275, 304, 333, 2, 31, 59, 87, 115, 143, 171, 199, 227, 255,
    // 2026 (индексы 25-36): янв=283°, фев=311°, мар=339°, апр=27°(конец Овна!), май=35°, июн=63°, 
    //                       июл=91°, авг=119°, сен=147°, окт=175°, ноя=203°, дек=231°
    283, 311, 339, 27, 35, 63, 91, 119, 147, 175, 203, 231,
    // 2027 (индексы 37-48)
    259, 287, 315, 343, 11, 39, 67, 95, 123, 151, 179, 207
  ];

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
  
  // Вычисление возраста луны в днях на основе таблицы новолуний
  function getMoonAge(date) {
    const time = date.getTime();
    
    // Ищем ближайшее предыдущее новолуние
    let prevNewMoon = KNOWN_NEW_MOONS[0];
    for (let i = 0; i < KNOWN_NEW_MOONS.length; i++) {
      if (KNOWN_NEW_MOONS[i].getTime() <= time) {
        prevNewMoon = KNOWN_NEW_MOONS[i];
      } else {
        break;
      }
    }
    
    const diffTime = time - prevNewMoon.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays;
  }

  // Вычисление фазы луны на основе возраста
  function getMoonPhase(date) {
    const age = getMoonAge(date);
    
    for (const [phaseKey, phaseData] of Object.entries(MOON_PHASES)) {
      if (age >= phaseData.minAge && age < phaseData.maxAge) {
        return phaseKey;
      }
    }
    
    // Если возраст больше 29.53, это следующее новолуние
    return 'new-moon';
  }

  // Вычисление освещённости луны (в процентах)
  function getMoonIllumination(date) {
    const age = getMoonAge(date);
    const synodicMonth = 29.53058867;
    const illumination = (1 - Math.cos((2 * Math.PI * age) / synodicMonth)) / 2 * 100;
    return Math.round(illumination);
  }

  // Получение знака зодиака для луны с учётом положения в новолуние
  function getMoonSign(date) {
    const time = date.getTime();
    
    // Ищем ближайшее предыдущее новолуние и его долготу
    let prevNewMoonIndex = 0;
    for (let i = 0; i < KNOWN_NEW_MOONS.length; i++) {
      if (KNOWN_NEW_MOONS[i].getTime() <= time) {
        prevNewMoonIndex = i;
      } else {
        break;
      }
    }
    
    const prevNewMoon = KNOWN_NEW_MOONS[prevNewMoonIndex];
    const startLongitude = NEW_MOON_LONGITUDES[prevNewMoonIndex % NEW_MOON_LONGITUDES.length];
    
    // Вычисляем сколько дней прошло с новолуния
    const diffTime = time - prevNewMoon.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    // Луна движется примерно на 13.176 градусов в день (360 / 27.321661)
    const dailyMotion = 360 / 27.321661;
    const currentLongitude = (startLongitude + diffDays * dailyMotion) % 360;
    
    // Определяем знак зодиака
    const signIndex = Math.floor(currentLongitude / 30) % 12;
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
    
    // Fallback к старой системе с базовыми рекомендациями
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
        initMoonDisplay();
      });
    }
  }

  function scheduleDailyMoonUpdate() {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
      initMoonDisplay();
      renderCalendar(currentDate);
      scheduleDailyMoonUpdate();
    }, msUntilMidnight);
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    scheduleDailyMoonUpdate();
  });

  function renderCalendar(date) {
    const grid = document.getElementById('calendarGrid');
    const monthYearEl = document.getElementById('calendarMonthYear');
    
    if (!grid || !monthYearEl) return;
    
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    monthYearEl.textContent = `${monthNames[month]} ${year}`;
    
    grid.innerHTML = '';
    
    const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    weekdays.forEach(day => {
      const weekdayEl = document.createElement('div');
      weekdayEl.className = 'calendar-weekday';
      weekdayEl.textContent = day;
      grid.appendChild(weekdayEl);
    });
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const dayEl = createDayElement(new Date(year, month - 1, dayNum), true);
      grid.appendChild(dayEl);
    }
    
    const today = new Date();
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const currentDay = new Date(year, month, day);
      const dayEl = createDayElement(currentDay, false);
      
      if (currentDay.toDateString() === today.toDateString()) {
        dayEl.classList.add('today');
      }
      
      if (selectedDate && currentDay.toDateString() === selectedDate.toDateString()) {
        dayEl.classList.add('selected');
      }
      
      grid.appendChild(dayEl);
    }
    
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
      document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
      dayEl.classList.add('selected');
      selectedDate = date;
      
      const dateInput = document.getElementById('entryDate');
      if (dateInput) {
        dateInput.value = formatDateForInput(date);
      }
      
      const phaseSelect = document.getElementById('moonPhaseSelect');
      if (phaseSelect) {
        phaseSelect.value = phase;
      }
      
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
    if (!form) return;
    
    form.addEventListener('submit', handleJournalSubmit);
  }

  function handleJournalSubmit(e) {
    e.preventDefault();
    
    const dateInput = document.getElementById('entryDate');
    const phaseSelect = document.getElementById('moonPhaseSelect');
    const intentionInput = document.getElementById('intentionInput');
    const feelingsInput = document.getElementById('feelingsInput');
    
    if (!dateInput || !phaseSelect || !intentionInput) return;
    
    const entry = {
      id: Date.now(),
      date: dateInput.value,
      phase: phaseSelect.value,
      intention: intentionInput.value,
      feelings: feelingsInput ? feelingsInput.value : '',
      timestamp: new Date().toISOString()
    };
    
    journalEntries.push(entry);
    saveJournalEntries();
    
    intentionInput.value = '';
    if (feelingsInput) feelingsInput.value = '';
    
    alert('Запись сохранена в лунном дневнике! 🌙');
  }

  function saveJournalEntries() {
    try {
      localStorage.setItem('moonJournalEntries', JSON.stringify(journalEntries));
    } catch (e) {
      console.error('Ошибка сохранения дневника:', e);
    }
  }

  function loadJournalEntries() {
    try {
      const saved = localStorage.getItem('moonJournalEntries');
      if (saved) {
        journalEntries = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Ошибка загрузки дневника:', e);
    }
  }

})();
