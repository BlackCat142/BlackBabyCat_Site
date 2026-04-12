# Инструкция по использованию config.js

## 🎯 Назначение

Файл `config.js` — это централизованное хранилище всех ссылок, названий и настроек для сайта. Теперь вы можете изменять ссылки в одном месте, и они автоматически обновятся на всём сайте.

## 📝 Как использовать

### 1. Откройте файл `config.js`

Найдите файл `config.js` в корне проекта и откройте его в любом текстовом редакторе.

### 2. Измените нужные значения

Все данные организованы в логические группы:

#### Социальные сети
```javascript
social: {
  vk: 'https://vk.com/TheWitcheryCat',        // ВКонтакте
  vkArtist: 'https://vk.com/artist/TheWitcheryCat',
  telegram: 'https://t.me/TheWitcheryCat',     // Telegram
  youtube: 'https://www.youtube.com/@TheWitcheryCat',
  yandexMusic: 'https://music.yandex.ru/artist/16564725',
  genius: 'https://genius.com/TheWitcheryCat'
}
```

#### Стриминговые платформы
```javascript
streaming: {
  yandex: 'https://music.yandex.ru/artist/16564725',
  vk: 'https://vk.com/artist/TheWitcheryCat',
  youtube: 'https://www.youtube.com/@TheWitcheryCat'
}
```

#### Релизы и треки
```javascript
releases: {
  detkaRemix: {
    title: 'TheWitcheryCat feat. CodEK$ - Детка Remix',
    link: 'https://band.link/detka_remix',
    image: 'ссылка_на_изображение',
    duration: '3:58'
  },
  cryIntoVoid: {
    title: 'Крик в никуда',
    link: 'https://vk.cc/cPycij',
    image: 'ссылка_на_изображение',
    duration: '4:12'
  }
}
```

#### Изображения
```javascript
images: {
  mainAvatar: 'ссылка_на_главное_фото',
  gallery: [
    'ссылка_1',
    'ссылка_2',
    ...
  ]
}
```

### 3. Сохраните файл

Просто сохраните изменения в `config.js`.

### 4. Обновите страницу в браузере

Откройте ваш сайт в браузере и обновите страницу (F5 или Ctrl+R). Все ссылки автоматически обновятся!

## 🔧 Технические детали

### Как это работает?

1. Файл `config.js` подключается в `index.html` перед `script.js`
2. При загрузке страницы скрипт считывает все элементы с атрибутами:
   - `data-config-link` — для ссылок
   - `data-config-text` — для текста
   - `data-config-image` — для изображений
3. Скрипт подставляет значения из объекта `CONFIG`

### Пример использования в HTML

```html
<!-- Ссылка из раздела social.vk -->
<a href="#" data-config-link="social.vk">ВКонтакте</a>

<!-- Текст из раздела releases.detkaRemix.title -->
<h3 data-config-text="releases.detkaRemix.title"></h3>

<!-- Изображение из раздела images.mainAvatar -->
<img src="#" data-config-image="images.mainAvatar" />
```

## ⚠️ Важно

- **Не меняйте структуру объекта CONFIG** — только значения внутри
- **Сохраняйте кавычки** вокруг строк
- **Проверяйте ссылки** на корректность (должны начинаться с `https://`)
- **Очищайте кэш браузера**, если изменения не применяются (Ctrl+Shift+R)

## 📁 Структура CONFIG

```
CONFIG
├── site              — Основные настройки сайта
├── social            — Социальные сети
├── streaming         — Стриминговые платформы
├── releases          — Релизы и треки
│   ├── detkaRemix
│   ├── cryIntoVoid
│   └── lastDrive
├── images            — Изображения
├── cdn               — CDN ресурсы
├── analytics         — Метрика и аналитика
├── schema            — Schema.org данные
├── pages             — Настройки страниц
└── youtube           — YouTube настройки
```

## 🎉 Готово!

Теперь для обновления ссылок достаточно изменить один файл `config.js` вместо поиска по всему коду!
