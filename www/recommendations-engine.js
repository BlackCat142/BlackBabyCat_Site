// recommendations-engine.js - Движок генерации рекомендаций
window.MoonRecommendationEngine = (function() {
  'use strict';

  const KNOWLEDGE_BASE = {
    phases: {
      'new-moon': {
        energy: 'минимальная', focus: 'новые начинания',
        actions: ['загадывать желания', 'планировать', 'начинать проекты'],
        avoid: ['спешка', 'конфликты'],
        crystals: ['горный хрусталь', 'лунный камень', 'селенит'],
        herbs: ['лаванда', 'жасмин'], colors: ['белый', 'серебряный'],
        chakra: 'коронная', deity: 'Геката', tarot: 'Шут'
      },
      'waxing-crescent': {
        energy: 'растущая', focus: 'развитие',
        actions: ['учиться новому', 'привлекать ресурсы', 'строить планы'],
        avoid: ['распыление энергии', 'негативное окружение'],
        crystals: ['розовый кварц', 'цитрин'], herbs: ['мята', 'базилик'],
        colors: ['зелёный', 'розовый'], chakra: 'сердечная',
        deity: 'Фрейя', tarot: 'Маг'
      },
      'first-quarter': {
        energy: 'активная', focus: 'действие',
        actions: ['бороться за цели', 'преодолевать препятствия'],
        avoid: ['агрессия', 'импульсивность'],
        crystals: ['гранат', 'тигровый глаз'], herbs: ['крапива', 'имбирь'],
        colors: ['красный', 'оранжевый'], chakra: 'солнечное сплетение',
        deity: 'Марс', tarot: 'Колесница'
      },
      'waxing-gibbous': {
        energy: 'нарастающая', focus: 'совершенствование',
        actions: ['шлифовать детали', 'анализировать прогресс'],
        avoid: ['перфекционизм', 'сомнения'],
        crystals: ['аметист', 'сапфир'], herbs: ['шалфей', 'розмарин'],
        colors: ['синий', 'фиолетовый'], chakra: 'третий глаз',
        deity: 'Афина', tarot: 'Отшельник'
      },
      'full-moon': {
        energy: 'максимальная', focus: 'кульминация',
        actions: ['подводить итоги', 'праздновать', 'проводить ритуалы'],
        avoid: ['эмоциональные всплески', 'переутомление'],
        crystals: ['селенит', 'опал'], herbs: ['полынь', 'лавр'],
        colors: ['белый', 'золотой'], chakra: 'все чакры',
        deity: 'Артемида', tarot: 'Луна'
      },
      'waning-gibbous': {
        energy: 'убывающая', focus: 'благодарность',
        actions: ['делиться опытом', 'помогать другим', 'благодарить'],
        avoid: ['цепляние за прошлое', 'зависть'],
        crystals: ['бирюза', 'амазонит'], herbs: ['календула', 'одуванчик'],
        colors: ['голубой', 'жёлтый'], chakra: 'горловая',
        deity: 'Деметра', tarot: 'Звезда'
      },
      'last-quarter': {
        energy: 'спадающая', focus: 'очищение',
        actions: ['избавляться от ненужного', 'завершать дела'],
        avoid: ['начало нового', 'долги'],
        crystals: ['чёрный турмалин', 'гематит'], herbs: ['чеснок', 'можжевельник'],
        colors: ['чёрный', 'серый'], chakra: 'корневая',
        deity: 'Кали', tarot: 'Смерть'
      },
      'waning-crescent': {
        energy: 'восстановительная', focus: 'отдых',
        actions: ['отдыхать', 'медитировать', 'готовиться к новому'],
        avoid: ['напряжение', 'важные решения'],
        crystals: ['флюорит', 'агат'], herbs: ['валериана', 'липа'],
        colors: ['тёмно-синий', 'фиолетовый'], chakra: 'все чакры',
        deity: 'Персефона', tarot: 'Повешенный'
      }
    },
    weekdays: [
      { name: 'Воскресенье', planet: 'Солнце', energy: 'творчество' },
      { name: 'Понедельник', planet: 'Луна', energy: 'интуиция' },
      { name: 'Вторник', planet: 'Марс', energy: 'действие' },
      { name: 'Среда', planet: 'Меркурий', energy: 'общение' },
      { name: 'Четверг', planet: 'Юпитер', energy: 'рост' },
      { name: 'Пятница', planet: 'Венера', energy: 'любовь' },
      { name: 'Суббота', planet: 'Сатурн', energy: 'дисциплина' }
    ]
  };

  function getPhaseName(phase) {
    const names = {
      'new-moon': 'Новолуние 🌑', 'waxing-crescent': 'Растущая луна 🌒',
      'first-quarter': 'Первая четверть 🌓', 'waxing-gibbous': 'Прибывающая луна 🌔',
      'full-moon': 'Полнолуние 🌕', 'waning-gibbous': 'Убывающая луна 🌖',
      'last-quarter': 'Последняя четверть 🌗', 'waning-crescent': 'Стареющая луна 🌘'
    };
    return names[phase] || phase;
  }

  function generate(date, phase, moonSign) {
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    const phaseData = KNOWLEDGE_BASE.phases[phase];
    const weekdayData = KNOWLEDGE_BASE.weekdays[dayOfWeek];
    const seed = (dayOfWeek + dayOfMonth + month) % 3;

    if (!phaseData) return '<p>Загрузка...</p>';

    let r = '';
    r += `<div class="rec-section"><strong>🌙 Фаза:</strong> ${getPhaseName(phase)}</div>`;
    r += `<div class="rec-section"><strong>💫 Энергия:</strong> ${phaseData.energy}, ${weekdayData.energy}</div>`;
    r += `<div class="rec-section"><strong>✨ Благоприятно:</strong> ${phaseData.actions[seed % phaseData.actions.length]}</div>`;
    r += `<div class="rec-section"><strong>⚠️ Избегать:</strong> ${phaseData.avoid[seed % phaseData.avoid.length]}</div>`;
    r += `<div class="rec-section"><strong>💎 Кристалл:</strong> ${phaseData.crystals[seed % phaseData.crystals.length]}</div>`;
    r += `<div class="rec-section"><strong>🌿 Трава:</strong> ${phaseData.herbs[seed % phaseData.herbs.length]}</div>`;
    r += `<div class="rec-section"><strong>🎨 Цвет:</strong> ${phaseData.colors[seed % phaseData.colors.length]}</div>`;
    r += `<div class="rec-section"><strong>🧘 Чакра:</strong> ${phaseData.chakra}</div>`;
    r += `<div class="rec-section"><strong>🔮 Таро:</strong> ${phaseData.tarot}</div>`;
    r += `<div class="rec-section"><strong>👁️ Покровитель:</strong> ${phaseData.deity}</div>`;
    return r;
  }

  return { generate: generate, getPhaseName: getPhaseName };
})();
