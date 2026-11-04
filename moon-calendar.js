// moon-calendar.js - Лунный календарь: Луна сегодня и календарь на месяц
// Фазы и знак Луны вычисляются астрономическими формулами (см. раздел АСТРОНОМИЧЕСКИЕ РАСЧЁТЫ)

(function() {
  'use strict';

  // Астрономия — в moon-astro.js (подключается раньше этого файла)
  const { MOON_PHASES, ZODIAC_SIGNS, SYNODIC_MONTH, getMoonAge, getMoonPhase, getDayPhase, getMoonIllumination,
          getMoonSign, renderMoonSvg, dateKey } = window.MoonAstro;

  // === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ===
  let currentDate = new Date();

  // === ИНИЦИАЛИЗАЦИЯ ===
  document.addEventListener('DOMContentLoaded', function() {
    initMoonDisplay();
    initCalendar();
  });

  // === ОТОБРАЖЕНИЕ ТЕКУЩЕЙ ФАЗЫ ЛУНЫ ===
  function initMoonDisplay() {
    const today = new Date();
    const phase = getDayPhase(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
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
      
      
      grid.appendChild(dayEl);
    }
    
    const totalCells = startDay + lastDay.getDate();
    const nextMonthDays = 42 - totalCells;
    for (let day = 1; day <= nextMonthDays; day++) {
      const dayEl = createDayElement(new Date(year, month + 1, day), true);
      grid.appendChild(dayEl);
    }
  }

  // Страницы отдельных дней генерируются сборкой на текущий и следующий год (папка /moon/)
  function hasDayPage(date) {
    if (window.Capacitor) return false;   // в мобильном приложении страниц дней нет
    const y = new Date().getFullYear();
    return date.getFullYear() >= y && date.getFullYear() <= y + 1;
  }

  function createDayElement(date, isOtherMonth) {
    const phase = getDayPhase(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
    const phaseData = MOON_PHASES[phase];
    const linked = hasDayPage(date);
    const dayEl = document.createElement(linked ? 'a' : 'div');
    dayEl.className = `calendar-day ${isOtherMonth ? 'other-month' : ''}`;
    if (linked) {
      dayEl.href = `/moon/${dateKey(date)}.html`;
      dayEl.title = `Луна ${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}: ${phaseData.name}`;
    }
    dayEl.innerHTML = `
      <div class="phase-icon">${phaseData.icon}</div>
      <div class="calendar-day-number">${date.getDate()}</div>
      <div class="calendar-day-phase">${phaseData.name.split(' ')[0]}</div>
    `;
    return dayEl;
  }

})();
