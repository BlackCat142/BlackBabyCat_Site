// sun-astro.js — Солнце и северное сияние для Норильска (и любой другой точки).
// Работает в браузере (window.SunAstro) и в Node.js (сборка страниц).
// Положение Солнца — алгоритм NOAA (точность восхода/заката ~1 минута для средних широт,
// в Заполярье около дат полярной ночи — несколько минут, это нормально для таких расчётов).

(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SunAstro = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const DEG = Math.PI / 180;
  // Норильск: центр города; время — красноярское, UTC+7 (без перехода на летнее)
  const NORILSK = { name: 'Норильск', lat: 69.3535, lon: 88.2027, tz: 7 };
  // Высота центра Солнца для восхода/заката с учётом рефракции и радиуса диска
  const H_SUNRISE = -0.833;
  const H_CIVIL = -6;         // гражданские сумерки
  const H_DARK = -12;         // достаточно темно для сияния (навигационные сумерки)

  const julian = date => date.getTime() / 86400000 + 2440587.5;

  // Склонение Солнца и уравнение времени (минуты) на момент date
  function sunCoords(date) {
    const T = (julian(date) - 2451545.0) / 36525;
    const L0 = ((280.46646 + T * (36000.76983 + 0.0003032 * T)) % 360 + 360) % 360;
    const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
    const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
    const C = Math.sin(M * DEG) * (1.914602 - T * (0.004817 + 0.000014 * T))
            + Math.sin(2 * M * DEG) * (0.019993 - 0.000101 * T) + Math.sin(3 * M * DEG) * 0.000289;
    const trueLong = L0 + C;
    const omega = 125.04 - 1934.136 * T;
    const lambda = trueLong - 0.00569 - 0.00478 * Math.sin(omega * DEG);
    const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60;
    const eps = eps0 + 0.00256 * Math.cos(omega * DEG);
    const decl = Math.asin(Math.sin(eps * DEG) * Math.sin(lambda * DEG)) / DEG;
    const y = Math.tan(eps / 2 * DEG) ** 2;
    const eqTime = 4 / DEG * (y * Math.sin(2 * L0 * DEG) - 2 * e * Math.sin(M * DEG)
      + 4 * e * y * Math.sin(M * DEG) * Math.cos(2 * L0 * DEG)
      - 0.5 * y * y * Math.sin(4 * L0 * DEG) - 1.25 * e * e * Math.sin(2 * M * DEG));
    return { decl, eqTime };
  }

  // Высота Солнца над горизонтом (градусы) в момент date
  function sunElevation(date, place = NORILSK) {
    const { decl, eqTime } = sunCoords(date);
    const utcMin = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
    const trueSolarTime = ((utcMin + eqTime + 4 * place.lon) % 1440 + 1440) % 1440;
    const hourAngle = trueSolarTime / 4 - 180;
    const cosZ = Math.sin(place.lat * DEG) * Math.sin(decl * DEG)
               + Math.cos(place.lat * DEG) * Math.cos(decl * DEG) * Math.cos(hourAngle * DEG);
    return 90 - Math.acos(Math.max(-1, Math.min(1, cosZ))) / DEG;
  }

  // Местная дата (год, месяц 0-11, день) → момент местной полуночи в UTC
  const localMidnight = (y, m, d, place = NORILSK) => new Date(Date.UTC(y, m, d) - place.tz * 3600000);

  // Пересечения высоты h за местные сутки: перебор по минутам с уточнением (надёжно в Заполярье)
  function crossings(y, m, d, h, place = NORILSK) {
    const start = localMidnight(y, m, d, place).getTime();
    const step = 60000; // 1 минута
    let prev = sunElevation(new Date(start), place) - h;
    let rise = null, set = null, max = -90, min = 90, maxAt = start;
    for (let t = start; t <= start + 86400000; t += step) {
      const el = sunElevation(new Date(t), place);
      if (el > max) { max = el; maxAt = t; }
      if (el < min) min = el;
      const cur = el - h;
      if (t > start) {
        if (prev < 0 && cur >= 0 && rise === null) rise = new Date(t - step * cur / (cur - prev));
        if (prev >= 0 && cur < 0 && set === null) set = new Date(t - step * cur / (cur - prev));
      }
      prev = cur;
    }
    return { rise, set, max, min, noon: new Date(maxAt) };
  }

  // Всё о солнце на местную дату
  function sunDay(y, m, d, place = NORILSK) {
    const main = crossings(y, m, d, H_SUNRISE, place);
    const polarNight = main.max < H_SUNRISE;
    const polarDay = main.min > H_SUNRISE;
    let dayMinutes;
    if (polarNight) dayMinutes = 0;
    else if (polarDay) dayMinutes = 1440;
    else if (main.rise && main.set) dayMinutes = Math.round(((main.set - main.rise) / 60000 + 1440) % 1440);
    else dayMinutes = Math.round(main.max > 0 ? 1440 - Math.abs(((main.rise || main.set) - localMidnight(y, m, d, place)) / 60000) : 0);
    const civil = crossings(y, m, d, H_CIVIL, place);
    return {
      date: { y, m, d },
      sunrise: polarNight || polarDay ? null : main.rise,
      sunset: polarNight || polarDay ? null : main.set,
      noon: main.noon,
      maxElevation: main.max,
      dayMinutes,
      polarNight,
      polarDay,
      civilDawn: civil.rise,
      civilDusk: civil.set,
      twilightOnly: polarNight && civil.max >= H_CIVIL   // полярная ночь, но днём светлые сумерки
    };
  }

  // Периоды полярной ночи и полярного дня в году (по местным датам)
  function polarPeriods(year, place = NORILSK) {
    const out = { nights: [], days: [] };
    let curN = null, curD = null;
    for (let t = Date.UTC(year, 0, 1); t < Date.UTC(year + 1, 0, 1); t += 86400000) {
      const dt = new Date(t);
      const s = crossings(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate(), H_SUNRISE, place);
      const key = dt.toISOString().slice(0, 10);
      const night = s.max < H_SUNRISE, day = s.min > H_SUNRISE;
      if (night) { if (!curN) curN = { from: key }; curN.to = key; } else if (curN) { out.nights.push(curN); curN = null; }
      if (day) { if (!curD) curD = { from: key }; curD.to = key; } else if (curD) { out.days.push(curD); curD = null; }
    }
    if (curN) out.nights.push(curN);
    if (curD) out.days.push(curD);
    return out;
  }

  // ── Северное сияние ──
  // Геомагнитная широта точки (дипольная модель; полюс по IGRF-14 на 2025 г.)
  const GEOMAG_POLE = { lat: 80.8, lon: -72.6 };
  function geomagneticLatitude(place = NORILSK) {
    const sinPhi = Math.sin(place.lat * DEG) * Math.sin(GEOMAG_POLE.lat * DEG)
      + Math.cos(place.lat * DEG) * Math.cos(GEOMAG_POLE.lat * DEG) * Math.cos((place.lon - GEOMAG_POLE.lon) * DEG);
    return Math.asin(sinPhi) / DEG;
  }
  // Граница овала сияний (геомагнитная широта, над головой) для индекса Kp — таблица NOAA
  const OVAL_OVERHEAD = [66.5, 64.5, 62.4, 60.4, 58.3, 56.3, 54.2, 52.2, 50.1, 48.1];
  const ovalAt = kp => {
    const k = Math.max(0, Math.min(9, kp));
    const i = Math.floor(k), f = k - i;
    return i >= 9 ? OVAL_OVERHEAD[9] : OVAL_OVERHEAD[i] + (OVAL_OVERHEAD[i + 1] - OVAL_OVERHEAD[i]) * f;
  };
  // Минимальный Kp, при котором сияние видно: над головой / низко над северным горизонтом (~5° дальше)
  function kpNeeded(place = NORILSK) {
    const gm = geomagneticLatitude(place);
    let overhead = 9, horizon = 9;
    for (let k = 0; k <= 9; k += 0.1) { if (ovalAt(k) <= gm && overhead === 9) overhead = +k.toFixed(1); if (ovalAt(k) - 5 <= gm && horizon === 9) horizon = +k.toFixed(1); }
    return { geomag: gm, overhead, horizon };
  }

  return { NORILSK, H_SUNRISE, H_CIVIL, H_DARK, sunElevation, sunDay, polarPeriods, geomagneticLatitude, kpNeeded, localMidnight };
});
