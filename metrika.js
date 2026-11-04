// metrika.js — Яндекс.Метрика для всех страниц сайта.
// Номер счётчика задаётся в config.js (analytics.yandexMetrika.counterId) или в админке.
// config.js должен быть подключён раньше этого файла.

(function () {
  // CONFIG объявлен через const, поэтому его нет в window — проверяем через typeof
  var id = typeof CONFIG !== 'undefined' && CONFIG.analytics && CONFIG.analytics.yandexMetrika
    ? Number(CONFIG.analytics.yandexMetrika.counterId)
    : 0;
  if (!id || id === 99999999) {
    console.warn('Яндекс.Метрика не подключена: укажите номер счётчика в config.js');
    return;
  }

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
})();
