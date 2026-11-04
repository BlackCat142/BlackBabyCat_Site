// Конфигурационный файл со всеми ссылками, фото и данными сайта.
// Удобнее всего редактировать через админку: npm run admin (или admin.bat).
// Если правите вручную — после правки запустите npm run build, чтобы обновился HTML.

const CONFIG = {
  "site": {
    "baseUrl": "https://thewitcherycat.ru/"
  },
  "social": {
    "vk": "https://vk.com/TheWitcheryCat",
    "vkArtist": "https://vk.com/artist/thewitcherycat",
    "telegram": "https://t.me/TheWitcheryCat",
    "youtube": "https://www.youtube.com/@TheWitcheryCat",
    "yandexMusic": "https://music.yandex.ru/artist/25682569",
    "genius": "https://genius.com/TheWitcheryCat"
  },
  "streaming": {
    "yandex": "https://music.yandex.ru/artist/25682569",
    "vk": "https://vk.com/artist/thewitcherycat",
    "youtube": "https://www.youtube.com/@TheWitcheryCat"
  },
  "hero": {
    "avatar": "images/avatar.jpg",
    "badge": "НОВЫЙ ТРЕК: \"Психолог 23.10.2026\""
  },
  "images": {
    "aboutPhoto": "images/about-studio.jpg",
    "gallery": [
      {
        "src": "images/avatar.jpg",
        "alt": "Живой сет TheWitcheryCat"
      },
      {
        "src": "images/cover-posledniy-drayv.jpg",
        "alt": "Студийная работа"
      },
      {
        "src": "images/cover-krik-v-nikuda.jpg",
        "alt": "Фестивальное выступление"
      },
      {
        "src": "images/cover-detka-remix.jpg",
        "alt": "Аудитория на концерте"
      }
    ]
  },
  "releases": [
    {
      "title": "TheWitcheryCat feat. CodEK$ - Детка Remix",
      "shortTitle": "Детка Remix",
      "feat": "CodEK$",
      "year": "2025",
      "description": "Совместный трек с CodEK$, выпущенный в 2025 году",
      "link": "https://band.link/detka_remix",
      "image": "images/cover-detka-remix.jpg",
      "duration": "3:58"
    },
    {
      "title": "Крик в никуда",
      "shortTitle": "Крик в никуда",
      "feat": "",
      "year": "2025",
      "description": "Эмоциональный трек, исследующий темы внутренних переживаний",
      "link": "https://vk.cc/cPycij",
      "image": "images/cover-krik-v-nikuda.jpg",
      "duration": "4:12"
    },
    {
      "title": "ПОСЛЕДНИЙ ДРАЙВ В НИКУДА",
      "shortTitle": "ПОСЛЕДНИЙ ДРАЙВ В НИКУДА",
      "feat": "",
      "year": "2025",
      "description": "Последний релиз от SQAZLY Music в жанре Electronic",
      "link": "https://band.link/tldtn",
      "image": "images/cover-posledniy-drayv.jpg",
      "duration": "3:45"
    }
  ],
  "events": [
    {
      "date": "15 июня 2025",
      "venue": "Клуб Aurora",
      "description": "Живой сет с новыми треками",
      "city": "Норильск, Россия",
      "ticketsLink": "https://vk.com/TheWitcheryCat"
    },
    {
      "date": "22 июля 2025",
      "venue": "Фестиваль \"Северный Ритм\"",
      "description": "Специальное выступление с визуальным сопровождением",
      "city": "Красноярск, Россия",
      "ticketsLink": "https://vk.com/TheWitcheryCat"
    },
    {
      "date": "10 августа 2025",
      "venue": "Клуб Techno Factory",
      "description": "Коллаборация с местными артистами",
      "city": "Москва, Россия",
      "ticketsLink": "https://vk.com/TheWitcheryCat"
    }
  ],
  "videos": [],
  "analytics": {
    "yandexMetrika": {
      "counterId": "99999999"
    }
  },
  "cdn": {
    "fontAwesome": "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
    "vkBridge": "https://unpkg.com/@vkontakte/vk-bridge@2/dist/browser.min.js",
    "youtubeEmbed": "https://www.youtube.com/embed/",
    "youtubePreconnect": "https://www.youtube.com",
    "ytimgPreconnect": "https://i.ytimg.com",
    "cloudflarePreconnect": "https://cdnjs.cloudflare.com"
  },
  "pages": {
    "home": {
      "title": "TheWitcheryCat - Официальный сайт",
      "ogUrl": "https://thewitcherycat.ru/",
      "canonical": "https://thewitcherycat.ru/"
    },
    "textpesen": {
      "title": "Тексты песен - TheWitcheryCat",
      "ogUrl": "https://thewitcherycat.ru/textpesen.html",
      "canonical": "https://thewitcherycat.ru/textpesen.html"
    },
    "moon": {
      "title": "Лунный календарь - TheWitcheryCat",
      "ogUrl": "https://thewitcherycat.ru/moon.html",
      "canonical": "https://thewitcherycat.ru/moon.html"
    }
  },
  "youtube": {
    "autoplay": true,
    "relatedVideos": false,
    "modestBranding": true
  }
};

// Экспорт для Node.js (используется админкой)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
