// moon-calendar.js - Лунный Календарь и Дневник Намерений
// Фазы и знак Луны вычисляются астрономическими формулами (см. раздел АСТРОНОМИЧЕСКИЕ РАСЧЁТЫ)

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

  // === АСТРОНОМИЧЕСКИЕ РАСЧЁТЫ ===
  // Положения Солнца и Луны по упрощённым формулам Ж. Меёса («Astronomical Algorithms»).
  // Точность ~0.1°, т.е. время фаз ±1 час. Работает для любого года, таблицы не нужны.
  const DEG = Math.PI / 180;
  const SYNODIC_MONTH = 29.530588853;
  function norm360(x) { return ((x % 360) + 360) % 360; }
  function julianCenturies(date) { return (date.getTime() / 86400000 + 2440587.5 - 2451545.0) / 36525; }
  function sunLongitude(date) {
    const T = julianCenturies(date);
    const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * DEG;
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M)
            + (0.019993 - 0.000101 * T) * Math.sin(2 * M)
            + 0.000289 * Math.sin(3 * M);
    return norm360(L0 + C - 0.00569);
  }
  function moonLongitude(date) {
    const T = julianCenturies(date);
    const Lp = 218.3164477 + 481267.88123421 * T;
    const D = (297.8501921 + 445267.1114034 * T) * DEG;
    const M = (357.5291092 + 35999.0502909 * T) * DEG;
    const Mp = (134.9633964 + 477198.8675055 * T) * DEG;
    const F = (93.2720950 + 483202.0175233 * T) * DEG;
    const E = 1 - 0.002516 * T;
    const terms = [
      [6.288774, 0, 0, 1, 0], [1.274027, 2, 0, -1, 0], [0.658314, 2, 0, 0, 0],
      [0.213618, 0, 0, 2, 0], [-0.185116, 0, 1, 0, 0], [-0.114332, 0, 0, 0, 2],
      [0.058793, 2, 0, -2, 0], [0.057066, 2, -1, -1, 0], [0.053322, 2, 0, 1, 0],
      [0.045758, 2, -1, 0, 0], [-0.040923, 0, 1, -1, 0], [-0.034720, 1, 0, 0, 0],
      [-0.030383, 0, 1, 1, 0], [0.015327, 2, 0, 0, -2], [-0.012528, 0, 0, 1, 2],
      [0.010980, 0, 0, 1, -2], [0.010675, 4, 0, -1, 0], [0.010034, 0, 0, 3, 0],
      [0.008548, 4, 0, -2, 0], [-0.007888, 2, 1, -1, 0], [-0.006766, 2, 1, 0, 0],
      [-0.005163, 1, 0, -1, 0], [0.004987, 1, 1, 0, 0], [0.004036, 2, -1, 1, 0]
    ];
    let sum = 0;
    for (const [a, d, m, mp, f] of terms) {
      const k = Math.abs(m) === 1 ? E : 1;
      sum += a * k * Math.sin(d * D + m * M + mp * Mp + f * F);
    }
    return norm360(Lp + sum);
  }

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
  
  // Возраст луны в днях: угол между Луной и Солнцем, переведённый в долю синодического месяца
  function getMoonAge(date) {
    const elongation = norm360(moonLongitude(date) - sunLongitude(date));
    return elongation / 360 * SYNODIC_MONTH;
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
    const illumination = (1 - Math.cos((2 * Math.PI * age) / SYNODIC_MONTH)) / 2 * 100;
    return Math.round(illumination);
  }

  // Знак зодиака (тропический), в котором находится Луна
  function getMoonSign(date) {
    return ZODIAC_SIGNS[Math.floor(moonLongitude(date) / 30) % 12];
  }

  // Рисунок Луны (SVG) по возрасту луны: освещённая часть = полукруг + эллипс терминатора.
  // Для северного полушария: растущая Луна освещена справа, убывающая — слева.
  function renderMoonSvg(age) {
    const R = 100;
    const p = ((age / SYNODIC_MONTH) % 1 + 1) % 1;           // 0 — новолуние, 0.5 — полнолуние
    const rx = Math.abs(Math.cos(2 * Math.PI * p)) * R;       // полуширина терминатора
    const waxing = p < 0.5;
    const crescent = p < 0.25 || p > 0.75;
    // Внешний край: правый полукруг для растущей, левый для убывающей
    const outerSweep = waxing ? 1 : 0;
    // Терминатор: у серпа выгибается в сторону света, у горбатой Луны — в тень
    const innerSweep = waxing ? (crescent ? 0 : 1) : (crescent ? 1 : 0);
    const lit = `M 0 ${-R} A ${R} ${R} 0 0 ${outerSweep} 0 ${R} A ${rx.toFixed(2)} ${R} 0 0 ${innerSweep} 0 ${-R} Z`;
    return `<svg viewBox="-100 -100 200 200" width="100%" height="100%" aria-hidden="true" style="display:block">
      <defs>
        <radialGradient id="moonLit" cx="35%" cy="35%" r="75%">
          <stop offset="0%" stop-color="#ffffff"/><stop offset="70%" stop-color="#e5e5e5"/><stop offset="100%" stop-color="#bdbdbd"/>
        </radialGradient>
        <radialGradient id="moonDark" cx="40%" cy="40%" r="75%">
          <stop offset="0%" stop-color="#2a2a33"/><stop offset="100%" stop-color="#121216"/>
        </radialGradient>
      </defs>
      <circle r="${R}" fill="url(#moonDark)"/>
      ${p < 0.005 || p > 0.995 ? '' : `<path d="${lit}" fill="url(#moonLit)"/>`}
    </svg>`;
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
      moonVisual.innerHTML = renderMoonSvg(getMoonAge(today));
      moonVisual.setAttribute('role', 'img');
      moonVisual.setAttribute('aria-label', `${phaseData.name}, освещённость ${getMoonIllumination(today)}%`);
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
