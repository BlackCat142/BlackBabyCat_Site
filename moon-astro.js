// moon-astro.js — астрономия Луны для сайта TheWitcheryCat.
// Один и тот же код работает в браузере (window.MoonAstro) и в Node.js (сборка страниц дней).
// Положения Солнца и Луны — упрощённые формулы Ж. Меёса, точность ~0.1° (время фаз ±1 час).

(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MoonAstro = api;
})(typeof self !== 'undefined' ? self : this, function () {
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


  // Фаза для календарного дня (от dayStart на 24 часа), как в обычных лунных календарях:
  // если точный момент новолуния, четверти или полнолуния попадает в этот день — день так и называется;
  // иначе фаза определяется по середине дня.
  function getDayPhase(dayStart) {
    const S = SYNODIC_MONTH;
    const a0 = getMoonAge(dayStart);
    const a1 = getMoonAge(new Date(dayStart.getTime() + 86400000));
    if (a1 < a0) return 'new-moon';                       // возраст «обнулился» — было новолуние
    const crosses = t => a0 < t && a1 >= t;
    if (crosses(S / 4)) return 'first-quarter';
    if (crosses(S / 2)) return 'full-moon';
    if (crosses(3 * S / 4)) return 'last-quarter';
    const mid = getMoonAge(new Date(dayStart.getTime() + 43200000));
    if (mid < S / 4) return 'waxing-crescent';
    if (mid < S / 2) return 'waxing-gibbous';
    if (mid < 3 * S / 4) return 'waning-gibbous';
    return 'waning-crescent';
  }

  // Дата в формате ГГГГ-ММ-ДД по местному времени (для адресов страниц дней)
  function dateKey(date) {
    const y = date.getFullYear(), m = String(date.getMonth() + 1).padStart(2, '0'), d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  return { MOON_PHASES, ZODIAC_SIGNS, SYNODIC_MONTH, sunLongitude, moonLongitude,
           getMoonAge, getMoonPhase, getDayPhase, getMoonIllumination, getMoonSign, renderMoonSvg, dateKey };
});
