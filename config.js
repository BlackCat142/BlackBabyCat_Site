// Конфигурационный файл со всеми ссылками и настройками
// Изменяйте значения здесь, чтобы обновить их во всём проекте

const CONFIG = {
  // === Основные ссылки на сайт ===
  site: {
    baseUrl: 'https://TheWitcheryCat.ru',
    canonicalBase: 'https://TheWitcheryCat.ru'
  },

  // === Социальные сети ===
  social: {
    vk: 'https://vk.com/TheWitcheryCat',
    vkArtist: 'https://vk.com/artist/thewitcherycat',
    telegram: 'https://t.me/TheWitcheryCat',
    youtube: 'https://www.youtube.com/@TheWitcheryCat',
    yandexMusic: 'https://music.yandex.ru/artist/16564725',
    genius: 'https://genius.com/TheWitcheryCat'
  },

  // === Стриминговые платформы (кнопки) ===
  streaming: {
    yandex: 'https://music.yandex.ru/artist/16564725',
    vk: 'https://vk.com/artist/thewitcherycat',
    youtube: 'https://www.youtube.com/@TheWitcheryCat'
  },

  // === Релизы и треки ===
  releases: {
    detkaRemix: {
      title: 'TheWitcheryCat feat. CodEK$ - Детка Remix',
      link: 'https://band.link/detka_remix',
      image: 'https://sun9-60.userapi.com/s/v1/ig2/P_o0takqAuN8glR3g_5NyH7igPK8q0aC-eSpvrqf4RIeP-or2xXFIkyEiirg39LW6JwnLzJofoxgz2cbc1A7d4Me.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2000x2000&from=bu&cs=2000x0',
      duration: '3:58'
    },
    cryIntoVoid: {
      title: 'Крик в никуда',
      link: 'https://vk.cc/cPycij',
      image: 'https://sun9-47.userapi.com/s/v1/ig2/CCQF2pAUuf3BN31-Pswkx3ih9FmZR9kNjUKiWVGA6E8O5Mtb_mPO6yx_WpeqKv9evHQK7BfSa7qTHJfwLT2iLJuu.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&cs=2560x0',
      duration: '4:12'
    },
    lastDrive: {
      title: 'ПОСЛЕДНИЙ ДРАЙВ В НИКУДА',
      link: 'https://band.link/tldtn',
      image: 'https://sun9-59.userapi.com/s/v1/ig2/hI6RndpG5SNtGXVn6FeFyqB0YUFoEUiecdRbApTbweGcE5N-8pS1Uvil9mSB1Yz7BTg8e4-OYIyH3bcJjZ15qpAw.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&cs=2560x0',
      duration: '3:45'
    }
  },

  // === Изображения ===
  images: {
    mainAvatar: 'https://sun9-67.userapi.com/s/v1/ig2/E_25I6AaaBX6H8Q8M88bbftus-JkSYy3VZjrdHEPyGRuIya4jdxaQO8fIMKJepnrhteKP9SNwWEKU6xWtQyUy7NL.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=64nx7i4nasnmWjmToTD4O-cgQgwqt2L8SR09hzdsCwc&cs=1280x0',
    gallery: [
      'https://sun9-67.userapi.com/s/v1/ig2/E_25I6AaaBX6H8Q8M88bbftus-JkSYy3VZjrdHEPyGRuIya4jdxaQO8fIMKJepnrhteKP9SNwWEKU6xWtQyUy7NL.jpg',
      'https://sun9-59.userapi.com/s/v1/ig2/hI6RndpG5SNtGXVn6FeFyqB0YUFoEUiecdRbApTbweGcE5N-8pS1Uvil9mSB1Yz7BTg8e4-OYIyH3bcJjZ15qpAw.jpg',
      'https://sun9-47.userapi.com/s/v1/ig2/CCQF2pAUuf3BN31-Pswkx3ih9FmZR9kNjUKiWVGA6E8O5Mtb_mPO6yx_WpeqKv9evHQK7BfSa7qTHJfwLT2iLJuu.jpg',
      'https://sun9-60.userapi.com/s/v1/ig2/P_o0takqAuN8glR3g_5NyH7igPK8q0aC-eSpvrqf4RIeP-or2xXFIkyEiirg39LW6JwnLzJofoxgz2cbc1A7d4Me.jpg'
    ],
    studioSession: 'https://music-bandlink.s3.yandex.net/img/bandlinks/vZms3_08XRcYon_370x370.jpeg'
  },

  // === CDN и внешние ресурсы ===
  cdn: {
    fontAwesome: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    vkBridge: 'https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js',
    youtubeEmbed: 'https://www.youtube.com/embed/',
    youtubePreconnect: 'https://www.youtube.com',
    ytimgPreconnect: 'https://i.ytimg.com',
    cloudflarePreconnect: 'https://cdnjs.cloudflare.com'
  },

  // === Метрика и аналитика ===
  analytics: {
    yandexMetrika: {
      tagScript: 'https://mc.yandex.ru/metrika/tag.js',
      counterId: '99999999',
      watchPixel: 'https://mc.yandex.ru/watch/99999999'
    }
  },

  // === Структура JSON-LD (Schema.org) ===
  schema: {
    context: 'https://schema.org',
    type: 'MusicGroup',
    name: 'TheWitcheryCat',
    url: 'https://TheWitcheryCat.ru',
    logo: 'https://sun9-67.userapi.com/s/v1/ig2/E_25I6AaaBX6H8Q8M88bbftus-JkSYy3VZjrdHEPyGRuIya4jdxaQO8fIMKJepnrhteKP9SNwWEKU6xWtQyUy7NL.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=64nx7i4nasnmWjmToTD4O-cgQgwqt2L8SR09hzdsCwc&cs=1280x0',
    sameAs: [
      'https://vk.com/TheWitcheryCat',
      'https://t.me/TheWitcheryCat',
      'https://www.youtube.com/@TheWitcheryCat',
      'https://music.yandex.ru/artist/16564725'
    ]
  },

  // === Названия страниц ===
  pages: {
    home: {
      title: 'TheWitcheryCat - Официальный сайт',
      ogUrl: 'https://TheWitcheryCat.ru',
      canonical: 'https://TheWitcheryCat.ru'
    },
    textpesen: {
      title: 'Тексты песен - TheWitcheryCat',
      ogUrl: 'https://TheWitcheryCat.ru/textpesen',
      canonical: 'https://TheWitcheryCat.ru/textpesen'
    },
    moon: {
      title: 'Лунный календарь - TheWitcheryCat',
      ogUrl: 'https://TheWitcheryCat.ru/moon.html',
      canonical: 'https://TheWitcheryCat.ru/moon.html'
    }
  },

  // === YouTube настройки ===
  youtube: {
    autoplay: true,
    relatedVideos: false, // rel=0
    modestBranding: true
  }
};

// Экспорт для использования в других файлах (если используется модульная система)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
