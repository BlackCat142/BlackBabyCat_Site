// norilsk-sky.js — живая часть страниц «Полярная ночь в Норильске» и «Северное сияние в Норильске».
// Нужен sun-astro.js (подключается раньше). Внешние данные: NOAA SWPC (индекс Kp) и Open-Meteo (облачность).

(function () {
  'use strict';
  var S = window.SunAstro;
  if (!S) return;
  var P = S.NORILSK;
  var MONTHS_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  var WD = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

  // «Норильское» представление момента: сдвигаем на UTC+7 и читаем UTC-поля
  function nl(d) { return new Date(d.getTime() + P.tz * 3600000); }
  function hm(d) { return d ? nl(d).toISOString().slice(11, 16) : '—'; }
  function todayKey() { return nl(new Date()).toISOString().slice(0, 10); }
  function keyDate(k) { var p = k.split('-').map(Number); return new Date(Date.UTC(p[0], p[1] - 1, p[2])); }
  function ru(k) { var d = keyDate(k); return d.getUTCDate() + ' ' + MONTHS_GEN[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); }
  function daysBetween(a, b) { return Math.round((keyDate(b) - keyDate(a)) / 86400000); }
  function dur(min) { return Math.floor(min / 60) + ' ч ' + String(min % 60).padStart(2, '0') + ' мин'; }
  function set(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; }

  // ───────── Полярная ночь ─────────
  var now = document.getElementById('skyNow');
  if (now) {
    var data = {};
    try { data = JSON.parse(now.getAttribute('data-sun')); } catch (e) { /* нет данных — оставляем статичные значения */ }
    var t = todayKey();
    var p = t.split('-').map(Number);
    var day = S.sunDay(p[0], p[1] - 1, p[2]);
    set('todayState', day.polarNight ? (day.twilightOnly ? 'полярная ночь, днём сумерки' : 'полярная ночь') : day.polarDay ? 'полярный день' : 'солнце встаёт');
    set('todayRise', day.polarNight || day.polarDay ? '—' : hm(day.sunrise));
    set('todaySet', day.polarNight || day.polarDay ? '—' : hm(day.sunset));
    set('todayLen', dur(day.dayMinutes));

    // Отсчёт: до ближайшего события
    var nights = (data.periods && data.periods.nights) || [];
    var pdays = (data.periods && data.periods.days) || [];
    var label, target;
    var curNight = nights.filter(function (n) { return n.from <= t && t <= n.to; })[0];
    var curDay = pdays.filter(function (n) { return n.from <= t && t <= n.to; })[0];
    if (curNight) {
      target = new Date(keyDate(curNight.to).getTime() + 86400000).toISOString().slice(0, 10);
      label = 'До первого восхода солнца';
    } else if (curDay) {
      target = new Date(keyDate(curDay.to).getTime() + 86400000).toISOString().slice(0, 10);
      label = 'До первого заката';
    } else {
      var nextN = nights.filter(function (n) { return n.from > t; })[0];
      var nextD = pdays.filter(function (n) { return n.from > t; })[0];
      if (nextD && (!nextN || nextD.from < nextN.from)) { target = nextD.from; label = 'До начала полярного дня'; }
      else if (nextN) { target = nextN.from; label = 'До начала полярной ночи'; }
    }
    if (target) {
      set('countLabel', label);
      set('countDays', String(Math.max(0, daysBetween(t, target))));
      set('countDate', ru(target));
    }

    // Линия «сегодня» на графике
    var chart = document.querySelector('.sky-chart');
    var line = document.getElementById('todayLine');
    if (chart && line && chart.getAttribute('data-year') === t.slice(0, 4)) {
      var y = +t.slice(0, 4);
      var total = (Date.UTC(y + 1, 0, 1) - Date.UTC(y, 0, 1)) / 86400000;
      var idx = daysBetween(y + '-01-01', t);
      var pad = +chart.getAttribute('data-pad');
      var x = pad + (720 - pad - 8) * idx / (total - 1);
      line.setAttribute('x1', x); line.setAttribute('x2', x); line.setAttribute('visibility', 'visible');
    }
  }

  // ───────── Северное сияние ─────────
  var box = document.getElementById('auroraNow');
  if (!box) return;
  var need = { horizon: 1, overhead: 3 };
  try { need = JSON.parse(box.getAttribute('data-need')); } catch (e) { /* значения по умолчанию */ }
  var kpHorizon = Math.max(1, Math.ceil(need.horizon));
  var kpOver = Math.ceil(need.overhead);

  var LEVELS = [
    { name: 'Низкий', cls: 'lvl0', hint: 'Сияние маловероятно.' },
    { name: 'Есть шанс', cls: 'lvl1', hint: 'Возможно слабое сияние над северным горизонтом — смотрите из тёмного места за городом.' },
    { name: 'Хороший', cls: 'lvl2', hint: 'Хорошие шансы: смотрите на север, подальше от огней.' },
    { name: 'Высокий', cls: 'lvl3', hint: 'Сияние может быть высоко в небе. Самое время выйти!' },
    { name: 'Очень высокий', cls: 'lvl4', hint: 'Геомагнитная буря — яркое сияние, возможно на всё небо.' }
  ];
  function kpLevel(kp) {
    if (kp >= 5) return 4;
    if (kp >= kpOver) return 3;
    if (kp >= kpHorizon + 1) return 2;
    if (kp >= kpHorizon) return 1;
    return 0;
  }
  // Итог с учётом облаков и темноты
  function verdict(kp, cloud, dark) {
    if (!dark) return { level: 0, why: 'Слишком светло — солнце недостаточно низко под горизонтом.' };
    var lvl = kpLevel(kp);
    if (cloud != null && cloud >= 85) return { level: 0, why: 'Небо затянуто облаками (' + Math.round(cloud) + '%).' };
    if (cloud != null && cloud >= 55 && lvl > 0) return { level: lvl - 1, why: 'Облачно (' + Math.round(cloud) + '%) — сияние может быть видно в просветах.' };
    return { level: lvl, why: LEVELS[lvl].hint };
  }
  function isDark(d) { return S.sunElevation(d) < S.H_DARK; }

  // Запрос с ограничением по времени: если источник не ответил за 12 секунд — ошибка, а не вечное ожидание
  function getJSON(url) {
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 12000);
    return fetch(url, { cache: 'no-store', signal: ctl ? ctl.signal : undefined })
      .then(function (r) { clearTimeout(timer); if (!r.ok) throw new Error(r.status); return r.json(); },
            function (e) { clearTimeout(timer); throw e; });
  }

  var KP_FORECAST = 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json';
  var KP_NOW = 'https://services.swpc.noaa.gov/json/planetary_k_index_1m.json';
  var CLOUDS = 'https://api.open-meteo.com/v1/forecast?latitude=' + P.lat + '&longitude=' + P.lon +
               '&hourly=cloud_cover&timezone=UTC&forecast_days=4&past_days=1';

  Promise.all([
    getJSON(KP_FORECAST),
    getJSON(KP_NOW).catch(function () { return []; }),
    getJSON(CLOUDS).catch(function () { return null; })
  ]).then(function (res) {
    var forecast = res[0], kpNow = res[1], clouds = res[2];

    // Облачность по часам (UTC) → функция «облачность в момент»
    var cloudAt = function () { return null; };
    if (clouds && clouds.hourly) {
      var map = {};
      clouds.hourly.time.forEach(function (tm, i) { map[tm.slice(0, 13)] = clouds.hourly.cloud_cover[i]; });
      cloudAt = function (d) { var v = map[d.toISOString().slice(0, 13)]; return v == null ? null : v; };
    }

    // Прогноз Kp: 3-часовые интервалы
    var rows = (Array.isArray(forecast) ? forecast : []).map(function (r) {
      if (Array.isArray(r)) return { t: r[0], kp: +r[1], kind: r[2] };        // старый формат: массив строк
      return { t: r.time_tag, kp: +r.kp, kind: r.observed };
    }).filter(function (r) { return r.t && !isNaN(r.kp) && r.t !== 'time_tag'; });
    var start = Date.now() - 3 * 3600000, end = Date.now() + 72 * 3600000;
    var slots = rows.map(function (r) {
      var from = new Date(r.t.replace(' ', 'T') + (/[zZ]$/.test(r.t) ? '' : 'Z'));
      var mid = new Date(from.getTime() + 90 * 60000);
      var cl = [0, 1, 2].map(function (h) { return cloudAt(new Date(from.getTime() + h * 3600000)); }).filter(function (v) { return v != null; });
      var cloud = cl.length ? cl.reduce(function (a, b) { return a + b; }, 0) / cl.length : null;
      var dark = isDark(mid);
      return { from: from, kp: r.kp, kind: r.kind, cloud: cloud, dark: dark, v: verdict(r.kp, cloud, dark) };
    }).filter(function (s) { return s.from.getTime() >= start && s.from.getTime() <= end; });

    // Сейчас
    var latestKp = kpNow.length ? +(kpNow[kpNow.length - 1].estimated_kp || kpNow[kpNow.length - 1].kp_index) : null;
    var nowD = new Date();
    var cur = slots.filter(function (s) { return s.from <= nowD && nowD < new Date(s.from.getTime() + 3 * 3600000); })[0];
    var kpCur = latestKp != null ? latestKp : (cur ? cur.kp : 0);
    var cloudCur = cloudAt(new Date(Math.floor(nowD.getTime() / 3600000) * 3600000));
    var darkCur = isDark(nowD);
    var vNow = verdict(kpCur, cloudCur, darkCur);
    var vb = document.getElementById('auroraVerdict');
    vb.className = 'aurora-verdict ' + LEVELS[vNow.level].cls;
    set('auroraValue', LEVELS[vNow.level].name);
    set('auroraHint', vNow.why);
    set('kpNow', kpCur.toFixed(1));
    set('cloudNow', cloudCur == null ? 'нет данных' : Math.round(cloudCur) + '%');
    set('darkNow', darkCur ? 'тёмное' : (S.sunElevation(nowD) > 0 ? 'день' : 'сумерки'));

    // Лучшее время
    var future = slots.filter(function (s) { return s.from.getTime() + 3 * 3600000 > nowD.getTime(); });
    var best = future.slice().sort(function (a, b) { return b.v.level - a.v.level || b.kp - a.kp; })[0];
    if (vNow.level > 0 && (!best || vNow.level >= best.v.level)) {
      set('bestTime', 'прямо сейчас');
    } else if (best && best.v.level > 0) {
      var bl = nl(best.from);
      set('bestTime', WD[bl.getUTCDay()] + ' ' + bl.getUTCDate() + ' ' + MONTHS_GEN[bl.getUTCMonth()] + ', ' + hm(best.from) + '–' + hm(new Date(best.from.getTime() + 3 * 3600000)));
    } else set('bestTime', 'шансов мало');

    // По «ночам»: группируем по местной дате вечера (слоты с 12:00 до 12:00 следующего дня)
    var nightsMap = {};
    future.forEach(function (s) {
      var l = nl(new Date(s.from.getTime() - 12 * 3600000));
      var k = l.toISOString().slice(0, 10);
      (nightsMap[k] = nightsMap[k] || []).push(s);
    });
    var nightsEl = document.getElementById('auroraNights');
    nightsEl.innerHTML = '';
    Object.keys(nightsMap).slice(0, 4).forEach(function (k) {
      var list = nightsMap[k];
      var top = list.slice().sort(function (a, b) { return b.v.level - a.v.level || b.kp - a.kp; })[0];
      var maxKp = Math.max.apply(null, list.map(function (s) { return s.kp; }));
      var darkCl = list.filter(function (s) { return s.dark && s.cloud != null; }).map(function (s) { return s.cloud; });
      var avgCl = darkCl.length ? Math.round(darkCl.reduce(function (a, b) { return a + b; }, 0) / darkCl.length) : null;
      var d = keyDate(k);
      var card = document.createElement('div');
      card.className = 'aurora-night ' + LEVELS[top.v.level].cls;
      card.innerHTML = '<p class="an-date"></p><p class="an-level"></p><p class="an-meta"></p>';
      var nx = new Date(d.getTime() + 86400000);
      card.querySelector('.an-date').textContent = 'Ночь с ' + d.getUTCDate() + (d.getUTCMonth() === nx.getUTCMonth() ? '' : ' ' + MONTHS_GEN[d.getUTCMonth()]) +
        ' на ' + nx.getUTCDate() + ' ' + MONTHS_GEN[nx.getUTCMonth()];
      card.querySelector('.an-level').textContent = LEVELS[top.v.level].name;
      card.querySelector('.an-meta').textContent = 'Kp до ' + maxKp.toFixed(1) + (avgCl == null ? '' : ' · облачность ' + avgCl + '%') +
        (top.v.level > 0 ? ' · лучше всего ' + hm(top.from) + '–' + hm(new Date(top.from.getTime() + 3 * 3600000)) : '');
      nightsEl.appendChild(card);
    });
    if (!nightsEl.children.length) nightsEl.innerHTML = '<p class="sky-note">Нет данных прогноза.</p>';

    // Столбики Kp
    var bars = document.getElementById('auroraBars');
    bars.innerHTML = '';
    future.forEach(function (s) {
      var b = document.createElement('div');
      b.className = 'ab ' + LEVELS[s.v.level].cls + (s.dark ? '' : ' light');
      b.style.setProperty('--h', Math.max(6, Math.min(100, s.kp / 9 * 100)) + '%');
      var l = nl(s.from);
      b.title = WD[l.getUTCDay()] + ' ' + hm(s.from) + ' · Kp ' + s.kp.toFixed(1) + (s.cloud == null ? '' : ' · облака ' + Math.round(s.cloud) + '%') + (s.dark ? '' : ' · светло');
      b.innerHTML = '<span class="ab-kp"></span><span class="ab-bar"></span><span class="ab-time"></span>';
      b.querySelector('.ab-kp').textContent = s.kp.toFixed(0);
      b.querySelector('.ab-time').textContent = (l.getUTCHours() === 0 || s === future[0] ? WD[l.getUTCDay()] + ' ' : '') + hm(s.from).slice(0, 2);
      bars.appendChild(b);
    });

    if (window.TWCGoal) window.TWCGoal('aurora_view', { level: LEVELS[vNow.level].name });
  }).catch(function () {
    set('auroraValue', 'Не удалось загрузить');
    set('auroraHint', 'Источник данных временно недоступен. Обновите страницу через пару минут.');
  });
})();
