// Конфигурационный файл со всеми ссылками, фото и данными сайта.
// Удобнее всего редактировать через админку: npm run admin (или admin.bat).
// Если правите вручную — после правки запустите npm run build, чтобы обновился HTML.

const CONFIG = {
  "site": {
    "baseUrl": "https://thewitcherycat.ru/"
  },
  "artist": {
    "pseudonym": "TheWitcheryCat",
    "realName": "Данил Епанчин",
    "fullName": "Епанчин Данил Владимирович",
    "fullNameDirect": "Данил Владимирович Епанчин",
    "givenName": "Данил",
    "familyName": "Епанчин",
    "patronymic": "Владимирович"
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
    "avatar": "images/avatar2-jpg-mw1wscu6.jpg",
    "badge": "НОВЫЙ ТРЕК: \"Любовь как яд 27.11.2026\""
  },
  "images": {
    "aboutPhoto": "images/photo-mw1xg5g2.jpg",
    "gallery": [
      {
        "src": "images/jpg-mw1xguv4.jpg",
        "alt": "Живой сет TheWitcheryCat"
      },
      {
        "src": "images/1-mw1xjws3.jpg",
        "alt": "Студийная работа"
      }
    ]
  },
  "releases": [
    {
      "title": "TheWitcheryCat, MIKKY - Любовь как яд",
      "shortTitle": " Любовь как яд",
      "feat": "MIKKY",
      "year": "2026",
      "description": "Совместный трек с MIKKY , выпущенный в 2026 году",
      "link": "https://band.link/lv6bP",
      "image": "images/love-mw1wtsi1.jpg",
      "duration": ""
    },
    {
      "title": "TheWitcheryCat - Психолог",
      "shortTitle": "Психолог",
      "feat": "",
      "year": "2026",
      "description": "Трек «Психолог» от TheWitcheryCat. Мрачный альтернативный хип-хоп о выгорании, личной драме и пустоте за фасадом успеха.",
      "link": "https://band.link/k5YR8",
      "image": "images/photo-mw1x4uj4.jpg",
      "duration": "3:02"
    },
    {
      "title": "TheWitcheryCat - Норильск",
      "shortTitle": "Норильск",
      "feat": "",
      "year": "2026",
      "description": "Мрачный индустриальный хип-хоп о выгорании, северной вьюге и внутреннем преодолении. Трек-манифест человека, который находит силы забрать контроль над собственной судьбой. ",
      "link": "https://band.link/tldtn",
      "image": "images/thewitcherycat-mw1x6g31.jpg",
      "duration": "2:46"
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
  "videos": [
    {
      "youtubeId": "gxgsn3TbuGM",
      "title": "TheWitcheryCat - Психолог",
      "duration": "3:01"
    }
  ],
  "analytics": {
    "yandexMetrika": {
      "counterId": "108204562"
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
  },
  "stats": [
    {
      "number": "15+",
      "label": "Треков выпущено"
    },
    {
      "number": "300K+",
      "label": "Прослушиваний"
    },
    {
      "number": "4+",
      "label": "Коллаборации"
    }
  ]
};

// Экспорт для Node.js (используется админкой)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
