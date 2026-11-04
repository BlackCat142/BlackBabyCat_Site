// metrika.js — согласие на cookie и Яндекс.Метрика для всех страниц сайта.
//
// Как это работает (152-ФЗ):
// • пока посетитель не нажал «Принять», Метрика НЕ загружается и cookie аналитики не ставятся;
// • «Только необходимые» — Метрика не загружается вообще;
// • выбор хранится в localStorage (ключ twc-consent) и его можно изменить
//   на странице политики конфиденциальности (кнопка «Изменить настройки cookie»).
//
// Номер счётчика задаётся в config.js (analytics.yandexMetrika.counterId) или в админке.
// config.js должен быть подключён раньше этого файла.

(function () {
  var KEY = 'twc-consent';          // 'all' — аналитика разрешена, 'necessary' — только необходимые
  var CONSENT_VERSION = 1;          // увеличьте, если поменяется состав cookie — у всех спросят заново

  function readConsent() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var data = JSON.parse(raw);
        if (data && data.v === CONSENT_VERSION) return data.choice;
      }
      // Старая версия баннера: кнопка «Принять» уже была нажата
      if (localStorage.getItem('cookiesAccepted') === 'true') {
        saveConsent('all');
        localStorage.removeItem('cookiesAccepted');
        return 'all';
      }
    } catch (e) { /* localStorage недоступен — считаем, что выбора нет */ }
    return null;
  }

  function saveConsent(choice) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ choice: choice, v: CONSENT_VERSION, date: new Date().toISOString() }));
    } catch (e) { /* ignore */ }
  }

  var metrikaStarted = false;
  var counterId = 0;

  // ── Цели Метрики ──
  // В кабинете Метрики: Цели → Добавить цель → «JavaScript-событие» с идентификатором из списка:
  //   listen       — «Слушать» / ссылки на площадки и треки
  //   presave      — «Пре-сейв»
  //   lyrics_copy  — «Скопировать» текст песни
  //   social       — переход в VK, Telegram, YouTube, Genius
  //   email        — нажатие на почту
  //   tickets      — «Билеты»
  //   chat_open    — открыли чат-бота
  // Цели отправляются только если посетитель согласился на аналитику.
  var GOALS = [
    ['presave', '.release-presave'],
    ['lyrics_copy', '#copyLyricsBtn'],
    ['tickets', '.tickets-btn'],
    ['chat_open', '.chat-toggle-btn, #chat-toggle-btn'],
    ['email', 'a[href^="mailto:"]'],
    ['listen', '.release-listen, .release-platforms a, .portfolio-content a[target="_blank"], .media-link, .streaming-btn,' +
               ' a[href*="band.link"], a[href*="music.yandex"], a[href*="vk.com/artist"], a[href*="vk.cc"]'],
    ['social', '.social-links a, .footer-social a, a[href*="vk.com/"], a[href*="t.me/"], a[href*="youtube.com"], a[href*="genius.com"]']
  ];
  function reachGoal(name, params) {
    if (metrikaStarted && counterId && typeof window.ym === 'function') window.ym(counterId, 'reachGoal', name, params);
  }
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    for (var i = 0; i < GOALS.length; i++) {
      var hit = t.closest(GOALS[i][1]);
      if (hit) {
        reachGoal(GOALS[i][0], { page: location.pathname, link: hit.href || hit.id || hit.className });
        return;   // одна цель на клик — первая подходящая по списку
      }
    }
  }, true);
  window.TWCGoal = reachGoal;   // для ручного вызова из других скриптов
  function startMetrika() {
    if (metrikaStarted) return;
    // CONFIG объявлен через const, поэтому его нет в window — проверяем через typeof
    var id = typeof CONFIG !== 'undefined' && CONFIG.analytics && CONFIG.analytics.yandexMetrika
      ? Number(CONFIG.analytics.yandexMetrika.counterId)
      : 0;
    if (!id || id === 99999999) {
      console.warn('Яндекс.Метрика не подключена: укажите номер счётчика в config.js');
      return;
    }
    metrikaStarted = true;
    counterId = id;

    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
      k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

    ym(id, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true
    });
  }

  // Удаляет cookie Метрики (_ym_*), если посетитель отказался или отозвал согласие
  function deleteMetrikaCookies() {
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ym') !== 0) return;
      ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
      });
    });
  }

  function hideBanner(banner) {
    banner.classList.remove('cookie-notice-visible');
    setTimeout(function () { banner.style.display = 'none'; }, 300);
  }

  function showBanner() {
    var banner = document.getElementById('cookieNotice');
    if (!banner) return;
    banner.style.display = '';
    setTimeout(function () { banner.classList.add('cookie-notice-visible'); }, 50);
  }

  function initBanner() {
    var banner = document.getElementById('cookieNotice');
    if (!banner) return;
    var accept = document.getElementById('cookieAcceptBtn');
    var decline = document.getElementById('cookieDeclineBtn');

    if (accept) accept.addEventListener('click', function () {
      saveConsent('all');
      hideBanner(banner);
      startMetrika();
    });
    if (decline) decline.addEventListener('click', function () {
      saveConsent('necessary');
      deleteMetrikaCookies();
      hideBanner(banner);
    });

    if (!readConsent()) setTimeout(showBanner, 1000);
  }

  // Публичные функции: для кнопки «Изменить настройки cookie» в политике конфиденциальности
  window.TWCConsent = {
    get: readConsent,
    reset: function () {
      try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
      deleteMetrikaCookies();
      if (metrikaStarted) {
        // Уже загруженную Метрику на этой странице не выгрузить — перезагружаем страницу без неё
        location.reload();
        return;
      }
      showBanner();
    }
  };

  if (readConsent() === 'all') startMetrika();

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initBanner);
  else initBanner();
})();
