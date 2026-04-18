// Умный чат-бот для TheWitcheryCat на базе Transformers.js
// Работает полностью в браузере без API

class WitcheryBot {
  constructor() {
    this.pipeline = null;
    this.isModelLoaded = false;
    this.chatHistory = [];
    this.botName = "Виртуальный ассистент TheWitcheryCat";
    
    // База знаний об артисте
    this.knowledgeBase = {
      name: "TheWitcheryCat",
      origin: "Норильск, Россия",
      style: "Рэп и хип-хоп в танцевальном стиле",
      tracks: [
        {
          title: "Детка Remix",
          feat: "CodEK$",
          link: CONFIG.releases.detkaRemix.link,
          duration: CONFIG.releases.detkaRemix.duration
        },
        {
          title: "Крик в никуда",
          link: CONFIG.releases.cryIntoVoid.link,
          duration: CONFIG.releases.cryIntoVoid.duration
        },
        {
          title: "ПОСЛЕДНИЙ ДРАЙВ В НИКУДА",
          link: CONFIG.releases.lastDrive.link,
          duration: CONFIG.releases.lastDrive.duration
        }
      ],
      social: {
        vk: CONFIG.social.vk,
        telegram: CONFIG.social.telegram,
        youtube: CONFIG.social.youtube,
        yandexMusic: CONFIG.social.yandexMusic
      },
      moonCalendar: "moon.html"
    };

    // Дружеские ответы на частые вопросы
    this.friendlyResponses = {
      greetings: [
        "Привет! 👋 Рад видеть тебя на сайте TheWitcheryCat!",
        "Хей! 🎵 Добро пожаловать в мир TheWitcheryCat!",
        "Приветствую! 😊 Готов погрузиться в музыку?",
        "Йо! 🎤 Отлично, что заглянул!"
      ],
      thanks: [
        "Всегда пожалуйста! 🙌",
        "Рад помочь! 😊",
        "Обращайся в любое время! 🎵",
        "Не за что! Музыка объединяет! 🎶"
      ],
      default: [
        "Интересный вопрос! Давай я помогу тебе разобраться.",
        "Хм, дай подумать... 🤔",
        "Отличный вопрос! Сейчас подскажу.",
        "Здорово, что интересуешься! Расскажу подробнее."
      ]
    };
  }

  // Инициализация модели
  async init() {
    try {
      console.log("Загрузка Transformers.js...");
      
      // Используем маленькую модель для быстрого запуска
      const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.14.0');
      
      console.log("Загрузка модели для ответов на вопросы...");
      // Используем небольшую модель для классификации намерений
      this.classifier = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
      
      this.isModelLoaded = true;
      console.log("✅ Бот готов к работе!");
      
      return true;
    } catch (error) {
      console.error("Ошибка загрузки модели:", error);
      this.isModelLoaded = false;
      return false;
    }
  }

  // Анализ намерения пользователя
  async analyzeIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Простая классификация на основе ключевых слов
    const intents = {
      greeting: ['привет', 'здравствуй', 'хай', 'йо', 'hello', 'hi'],
      about: ['кто ты', 'расскажи о', 'биография', 'откуда', 'где из'],
      tracks: ['трек', 'песня', 'музыка', 'слушать', 'альбом', 'релиз'],
      social: ['вк', 'телеграм', 'youtube', 'соцсеть', 'подписаться'],
      moon: ['луна', 'календарь', 'фаза', 'лунный'],
      thanks: ['спасибо', 'благодарю', 'thank'],
      bye: ['пока', 'до свидания', 'увидимся']
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return intent;
      }
    }

    return 'general';
  }

  // Генерация ответа
  async generateResponse(message) {
    const intent = await this.analyzeIntent(message);
    
    let response = '';
    
    switch(intent) {
      case 'greeting':
        response = this.getRandomResponse(this.friendlyResponses.greetings) + 
                   ` Я ${this.botName}. Чем могу помочь? 🎵`;
        break;
        
      case 'about':
        response = `${this.knowledgeBase.name} — талантливый музыкант и продюсер из ${this.knowledgeBase.origin}! 🎤\n\n` +
                   `Создаёт уникальный звук, объединяющий ${this.knowledgeBase.style}.\n\n` +
                   `Хочешь послушать треки или узнать больше?`;
        break;
        
      case 'tracks':
        const trackList = this.knowledgeBase.tracks.map((t, i) => 
          `${i+1}. "${t.title}"${t.feat ? ` feat. ${t.feat}` : ''} (${t.duration})`
        ).join('\n');
        
        response = `🎵 Вот основные треки TheWitcheryCat:\n\n${trackList}\n\n` +
                   `Нажми на название трека в меню выше, чтобы послушать! Или я могу дать ссылку на конкретный трек. Какой тебя интересует?`;
        break;
        
      case 'social':
        response = `📱 Подписывайся на TheWitcheryCat в соцсетях:\n\n` +
                   `• ВКонтакте: ${this.knowledgeBase.social.vk}\n` +
                   `• Telegram: ${this.knowledgeBase.social.telegram}\n` +
                   `• YouTube: ${this.knowledgeBase.social.youtube}\n` +
                   `• Яндекс.Музыка: ${this.knowledgeBase.social.yandexMusic}\n\n` +
                   `Буду рад видеть тебя среди подписчиков! 😊`;
        break;
        
      case 'moon':
        response = `🌙 На сайте есть крутой лунный календарь с рекомендациями!\n\n` +
                   `Там можно узнать фазу луны и получить музыкальные рекомендации под настроение.\n\n` +
                   `Перейти к календарю: <a href="${this.knowledgeBase.moonCalendar}" style="color: #8b5cf6; text-decoration: underline;">Лунный календарь</a>`;
        break;
        
      case 'thanks':
        response = this.getRandomResponse(this.friendlyResponses.thanks);
        break;
        
      case 'bye':
        response = `До встречи! 👋 Заходи ещё, буду рад поболтать о музыке! 🎵`;
        break;
        
      default:
        // Пытаемся найти релевантную информацию
        response = this.handleGeneralQuery(message);
    }
    
    // Сохраняем в историю
    this.chatHistory.push({ role: 'user', content: message });
    this.chatHistory.push({ role: 'assistant', content: response });
    
    return response;
  }

  // Обработка общих запросов
  handleGeneralQuery(message) {
    const lowerMessage = message.toLowerCase();
    
    // Поиск по базе знаний
    if (lowerMessage.includes('норильск')) {
      return `Да, ${this.knowledgeBase.name} действительно из Норильска! 🏔️ Этот город вдохновляет на создание мощной музыки.`;
    }
    
    if (lowerMessage.includes('детка') || lowerMessage.includes('remix')) {
      const track = this.knowledgeBase.tracks[0];
      return `🎵 "${track.title}" — один из популярных треков! Длительность: ${track.duration}.\n\n` +
             `Ссылка: ${track.link}`;
    }
    
    if (lowerMessage.includes('крик') || lowerMessage.includes('никуда')) {
      const track = this.knowledgeBase.tracks[1];
      return `🎵 "${track.title}" — глубокий трек о поиске себя. Длительность: ${track.duration}.\n\n` +
             `Ссылка: ${track.link}`;
    }
    
    if (lowerMessage.includes('драйв') || lowerMessage.includes('последний')) {
      const track = this.knowledgeBase.tracks[2];
      return `🎵 "${track.title}" — энергичный трек для драйва! Длительность: ${track.duration}.\n\n` +
             `Ссылка: ${track.link}`;
    }
    
    if (lowerMessage.includes('рекоменд') || lowerMessage.includes('совет')) {
      return `✨ Могу посоветовать начать с "Детка Remix" — это отличный трек для знакомства с творчеством!\n\n` +
             `А если хочешь персональные рекомендации по настроению — загляни в лунный календарь! 🌙`;
    }
    
    // Ответ по умолчанию
    const defaultResponse = this.getRandomResponse(this.friendlyResponses.default);
    return `${defaultResponse}\n\n` +
           `Спроси меня о:\n` +
           `• Творчестве TheWitcheryCat 🎤\n` +
           `• Треках и релизах 🎵\n` +
           `• Соцсетях 📱\n` +
           `• Лунном календаре 🌙`;
  }

  // Случайный ответ из массива
  getRandomResponse(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Очистка истории
  clearHistory() {
    this.chatHistory = [];
  }
}

// Инициализация виджета чата
function initChatWidget() {
  const bot = new WitcheryBot();
  
  // Создаём HTML виджета
  const widgetHTML = `
    <div id="witchery-chat-widget" class="chat-widget">
      <button id="chat-toggle-btn" class="chat-toggle-btn" aria-label="Открыть чат">
        <i class="fas fa-comment-dots"></i>
      </button>
      
      <div id="chat-window" class="chat-window hidden">
        <div class="chat-header">
          <div class="chat-title">
            <i class="fas fa-robot"></i>
            <span>Ассистент TheWitcheryCat</span>
          </div>
          <button id="chat-close-btn" class="chat-close-btn" aria-label="Закрыть чат">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div id="chat-messages" class="chat-messages">
          <div class="message bot-message">
            <div class="message-content">
              Привет! 👋 Я виртуальный ассистент TheWitcheryCat. 
              Выбери тему, чтобы узнать больше! 🎵
            </div>
          </div>
        </div>
        
        <div class="chat-buttons-container">
          <button class="chat-option-btn" data-topic="about">
            <i class="fas fa-microphone-alt"></i>
            <span>Творчество 🎤</span>
          </button>
          <button class="chat-option-btn" data-topic="tracks">
            <i class="fas fa-music"></i>
            <span>Треки 🎵</span>
          </button>
          <button class="chat-option-btn" data-topic="social">
            <i class="fas fa-share-alt"></i>
            <span>Соцсети 📱</span>
          </button>
          <button class="chat-option-btn" data-topic="moon">
            <i class="fas fa-moon"></i>
            <span>Лунный календарь 🌙</span>
          </button>
        </div>
        
        <div id="chat-loading" class="chat-loading hidden">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Добавляем виджет в DOM
  document.body.insertAdjacentHTML('beforeend', widgetHTML);
  
  // Элементы
  const toggleBtn = document.getElementById('chat-toggle-btn');
  const closeBtn = document.getElementById('chat-close-btn');
  const chatWindow = document.getElementById('chat-window');
  const messagesContainer = document.getElementById('chat-messages');
  const loadingIndicator = document.getElementById('chat-loading');
  const optionBtns = document.querySelectorAll('.chat-option-btn');
  
  // Открытие/закрытие чата
  toggleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
  });
  
  closeBtn.addEventListener('click', () => {
    chatWindow.classList.add('hidden');
  });
  
  // Обработчик кнопок с темами
  optionBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const topic = btn.getAttribute('data-topic');
      const topicMessages = {
        about: 'расскажи о творчестве',
        tracks: 'расскажи про треки',
        social: 'расскажи про соцсети',
        moon: 'расскажи про лунный календарь'
      };
      
      // Добавляем сообщение от имени пользователя
      const userMsg = btn.querySelector('span').textContent;
      addMessage(userMsg, 'user');
      
      // Показываем индикатор загрузки
      loadingIndicator.classList.remove('hidden');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      // Получаем ответ от бота
      const response = await bot.generateResponse(topicMessages[topic]);
      
      // Скрываем индикатор и показываем ответ
      loadingIndicator.classList.add('hidden');
      addMessage(response, 'bot');
    });
  });
  
  // Функция добавления сообщения
  function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = content.replace(/\n/g, '<br>');
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  // Инициализация бота (фоновая загрузка)
  bot.init().then(() => {
    console.log('Чат-бот готов!');
  });
}

// Запуск после загрузки страницы
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatWidget);
} else {
  initChatWidget();
}
