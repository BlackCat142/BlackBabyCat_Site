# Конфигурационный файл проекта

Этот файл содержит все ссылки, URL и настройки проекта в одном месте.

## Как использовать

### Для HTML файлов:
1. Откройте `config.js`
2. Найдите нужную секцию (социальные сети, релизы, изображения и т.д.)
3. Измените значение
4. Обновите HTML файлы, заменив старые значения на новые из конфига

**Пример:**
```javascript
// В config.js измените:
social: {
  vk: 'https://vk.com/NEW_LINK'  // Новый ссылку
}

// Затем в HTML файлах замените:
// Было: <a href="https://vk.com/TheWitcheryCat">
// Стало: <a href="https://vk.com/NEW_LINK">
```

### Для JavaScript файлов:
Можно подключить `config.js` перед основными скриптами:
```html
<script src="config.js"></script>
<script src="script.js"></script>
```

Использовать в коде:
```javascript
// Вместо хардкода ссылок
const vkLink = CONFIG.social.vk;
const youtubeLink = CONFIG.social.youtube;
```

## Структура конфигурации

### 📱 Социальные сети (`CONFIG.social`)
- `vk` - ссылка на группу ВКонтакте
- `vkArtist` - ссылка на артиста ВКонтакте
- `telegram` - ссылка на Telegram канал
- `youtube` - ссылка на YouTube канал
- `yandexMusic` - ссылка на Яндекс.Музыку
- `genius` - ссылка на Genius

### 🎵 Релизы (`CONFIG.releases`)
Каждый релиз содержит:
- `title` - название
- `link` - ссылка на прослушивание
- `image` - обложка
- `duration` - длительность

Текущие релизы:
- `detkaRemix` - Детка Remix feat. CodEK$
- `cryIntoVoid` - Крик в никуда
- `lastDrive` - ПОСЛЕДНИЙ ДРАЙВ В НИКУДА

### 🖼️ Изображения (`CONFIG.images`)
- `mainAvatar` - основная аватарка
- `gallery` - массив изображений для галереи
- `studioSession` - изображение студийной сессии

### 🔗 CDN ресурсы (`CONFIG.cdn`)
- `fontAwesome` - иконки Font Awesome
- `vkBridge` - VK Bridge для мини-приложений
- `youtubeEmbed` - базовый URL для встраивания YouTube

### 📊 Аналитика (`CONFIG.analytics`)
- `yandexMetrika.counterId` - ID счётчика Яндекс.Метрики
- `yandexMetrika.tagScript` - скрипт метрики
- `yandexMetrika.watchPixel` - пиксель для noscript

### 🏷️ Schema.org (`CONFIG.schema`)
Настройки для JSON-LD разметки:
- `name` - название группы
- `url` - основной URL сайта
- `sameAs` - массив ссылок на социальные профили

### 📄 Страницы (`CONFIG.pages`)
Настройки для каждой страницы:
- `home` - главная страница
- `textpesen` - тексты песен
- `moon` - лунный календарь

Каждая страница имеет:
- `title` - заголовок
- `ogUrl` - URL для Open Graph
- `canonical` - канонический URL

## Быстрое обновление

При добавлении нового релиза:
1. Добавьте запись в `CONFIG.releases`
2. Скопируйте структуру существующего релиза
3. Заполните новыми данными
4. Обновите HTML в секции с релизами

## Советы

✅ **Хорошо:**
- Хранить все ссылки в одном месте
- Использовать понятные имена ключей
- Группировать связанные ссылки

❌ **Плохо:**
- Хардкодить ссылки в HTML/JS коде
- Дублировать одни и те же ссылки
- Использовать непонятные имена переменных

## Пример добавления нового релиза

```javascript
releases: {
  // ... существующие релизы
  newSingle: {
    title: 'Название сингла',
    link: 'https://band.link/new-single',
    image: 'https://example.com/image.jpg',
    duration: '3:30'
  }
}
```

Затем добавьте блок в HTML с использованием новых данных.
