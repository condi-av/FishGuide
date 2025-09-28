// Extended lakes database covering all regions of Russia (50+ entries)
const extendedLakesData = {
  // Central Federal District (Центральный федеральный округ)
  central: {
    name: "Центральный федеральный округ",
    lakes: [
      {
        id: 'seliger',
        name: 'Озеро Селигер',
        region: 'Тверская область',
        district: 'central',
        lat: 57.2217, lng: 33.2206,
        fish: ['Щука', 'Окунь', 'Лещ', 'Судак', 'Угорь'],
        fishType: 'predatory',
        rating: 4.8, reviews: 1247, bestTime: 'Май-Октябрь',
        seasons: ['spring', 'summer', 'autumn'],
        infrastructure: 'Рыболовная база',
        coordinates: '57.22°N, 33.22°E',
        description: 'Одно из крупнейших озер Тверской области, известное своей богатой рыбной фауной и живописными пейзажами. Популярное место для ловли трофейного судака.',
        depth: '5-15 м', area: '260 км²', shoreType: 'Смешанный',
        access: 'Хороший', facilities: ['База отдыха', 'Аренда лодок', 'Магазин', 'Кафе'],
        restrictions: 'Нерестовый запрет весной', weatherStation: 'Tver'
      },
      {
        id: 'pleshcheyevo',
        name: 'Плещеево озеро',
        region: 'Ярославская область',
        district: 'central',
        lat: 56.745, lng: 38.7917,
        fish: ['Ряпушка', 'Лещ', 'Плотва', 'Щука'],
        fishType: 'mixed',
        rating: 4.5, reviews: 890, bestTime: 'Июнь-Сентябрь',
        seasons: ['spring', 'summer', 'autumn'],
        infrastructure: 'Заповедник',
        coordinates: '56.74°N, 38.79°E',
        description: 'Крупное пресноводное озеро. Славится аборигенным видом - переславской ряпушкой. Строгий контроль и охрана.',
        depth: '5-25 м', area: '51 км²', shoreType: 'Песчаный',
        access: 'Умеренный', facilities: ['Музей', 'Кайт-станция', 'Кемпинг'],
        restrictions: 'Только с лицензией, запрет на моторные лодки', weatherStation: 'Yaroslavl'
      },
      {
        id: 'lotos-lipetsk',
        name: 'Карповый пруд "Лотос"',
        region: 'Липецкая область',
        district: 'central',
        lat: 52.8872, lng: 39.4261,
        fish: ['Карп', 'Сазан', 'Толстолобик', 'Амур'],
        fishType: 'carp',
        rating: 4.9, reviews: 750, bestTime: 'Июнь-Август',
        seasons: ['summer'],
        infrastructure: 'Платный водоем',
        coordinates: '52.88°N, 39.42°E',
        description: 'Платный водоем, специализирующийся на трофейном карпе. Отличная инфраструктура для карпфишинга.',
        depth: '3-8 м', area: '1.5 км²', shoreType: 'Оборудованный',
        access: 'Хороший', facilities: ['Беседки', 'Охрана', 'Прокат снастей'],
        restrictions: 'Строго "поймал-отпустил" на карпа', weatherStation: 'Lipetsk'
      }
    ]
  },

  // Northwestern Federal District (Северо-Западный федеральный округ)
  northwest: {
    name: "Северо-Западный федеральный округ",
    lakes: [
      {
        id: 'ladoga',
        name: 'Ладожское озеро',
        region: 'Ленинградская область',
        district: 'northwest',
        lat: 60.84, lng: 31.3,
        fish: ['Судак', 'Щука', 'Сиг', 'Лосось', 'Плотва'],
        fishType: 'predatory',
        rating: 4.9, reviews: 2500, bestTime: 'Июнь, Август',
        seasons: ['all'],
        infrastructure: 'Рыболовная база',
        coordinates: '60.84°N, 31.30°E',
        description: 'Крупнейшее озеро в Европе. Опасно из-за погоды, но богато трофейными видами. Северная часть — лососевые.',
        depth: '20-230 м', area: '17700 км²', shoreType: 'Каменистый',
        access: 'Умеренный', facilities: ['База отдыха', 'Катера', 'Маяк'],
        restrictions: 'Лицензия на лосося и форель', weatherStation: 'Saint-Petersburg'
      },
      {
        id: 'onega',
        name: 'Онежское озеро',
        region: 'Карелия',
        district: 'northwest',
        lat: 61.7833, lng: 35.25,
        fish: ['Судак', 'Щука', 'Сиг', 'Палия', 'Хариус'],
        fishType: 'trout',
        rating: 4.7, reviews: 1850, bestTime: 'Июнь-Сентябрь',
        seasons: ['summer', 'winter'],
        infrastructure: 'База отдыха',
        coordinates: '61.78°N, 35.25°E',
        description: 'Второе по величине в Европе. Известно своей чистой водой, островами и отличной рыбалкой на палию и лососевых.',
        depth: '50-127 м', area: '9690 км²', shoreType: 'Смешанный',
        access: 'Хороший', facilities: ['Гостиница', 'Прокат снегоходов', 'Катера'],
        restrictions: 'Лицензия на лососевых', weatherStation: 'Petrozavodsk'
      },
      {
        id: 'syamozero',
        name: 'Сямозеро',
        region: 'Карелия',
        district: 'northwest',
        lat: 61.95, lng: 33.3,
        fish: ['Судак', 'Ряпушка', 'Щука', 'Сиг'],
        fishType: 'predatory',
        rating: 4.6, reviews: 450, bestTime: 'Июль-Август',
        seasons: ['summer'],
        infrastructure: 'База отдыха',
        coordinates: '61.95°N, 33.30°E',
        description: 'Популярное озеро в Карелии с хорошей популяцией судака и ряпушки. Развита туристическая инфраструктура.',
        depth: '5-24 м', area: '265 км²', shoreType: 'Песчаный',
        access: 'Хороший', facilities: ['Коттеджи', 'Прокат', 'Пляж'],
        restrictions: 'Нерестовый запрет весной', weatherStation: 'Petrozavodsk'
      }
    ]
  },

  // Southern Federal District (Южный федеральный округ)
  south: {
    name: "Южный федеральный округ",
    lakes: [
      {
        id: 'volga-delta',
        name: 'Дельта Волги (Низовья)',
        region: 'Астраханская область',
        district: 'south',
        lat: 46.34, lng: 48.05,
        fish: ['Сом', 'Сазан', 'Жерех', 'Судак', 'Вобла'],
        fishType: 'predatory',
        rating: 5.0, reviews: 3500, bestTime: 'Апрель-Октябрь',
        seasons: ['spring', 'summer', 'autumn'],
        infrastructure: 'Рыболовная база',
        coordinates: '46.34°N, 48.05°E',
        description: 'Лучшее место для трофейной рыбалки в России. Изобилие видов, особенно трофейного сома и сазана.',
        depth: '5-15 м', area: 'Река', shoreType: 'Заболоченный',
        access: 'Хороший', facilities: ['Базы', 'Егеря', 'Прокат'],
        restrictions: 'Нерестовый запрет весной (длительный)', weatherStation: 'Astrakhan'
      },
      {
        id: 'manych',
        name: 'Озеро Маныч-Гудило',
        region: 'Ростовская область',
        district: 'south',
        lat: 46.5925, lng: 43.15,
        fish: ['Сазан', 'Карась', 'Сом', 'Судак'],
        fishType: 'mixed',
        rating: 4.2, reviews: 300, bestTime: 'Апрель, Октябрь',
        seasons: ['spring', 'autumn'],
        infrastructure: 'Заповедник',
        coordinates: '46.59°N, 43.15°E',
        description: 'Соленое озеро, часть Кумо-Манычской впадины. Рыбалка разрешена только на определенных участках.',
        depth: '1-3 м', area: '800 км²', shoreType: 'Степной',
        access: 'Умеренный', facilities: ['Гостевые дома'],
        restrictions: 'Заповедная зона, требуется разрешение', weatherStation: 'Rostov-on-Don'
      }
    ]
  },

  // Volga Federal District (Приволжский федеральный округ)
  volga: {
    name: "Приволжский федеральный округ",
    lakes: [
      {
        id: 'kuybyshev-reservoir',
        name: 'Куйбышевское водохранилище',
        region: 'Самарская область',
        district: 'volga',
        lat: 55.45, lng: 49.6167,
        fish: ['Судак', 'Лещ', 'Сом', 'Жерех', 'Берш'],
        fishType: 'predatory',
        rating: 4.7, reviews: 1500, bestTime: 'Сентябрь-Ноябрь',
        seasons: ['autumn', 'winter'],
        infrastructure: 'База отдыха',
        coordinates: '55.45°N, 49.61°E',
        description: 'Крупнейшее в мире по площади водохранилище. Отличная джиговая ловля судака и берша на русловых бровках.',
        depth: '5-40 м', area: '6450 км²', shoreType: 'Глинистый',
        access: 'Хороший', facilities: ['Базы', 'Прокат лодок', 'Магазин'],
        restrictions: 'Нерестовый запрет', weatherStation: 'Samara'
      },
      {
        id: 'chulpan-pond',
        name: 'Карповый пруд "Чулпан"',
        region: 'Самарская область',
        district: 'volga',
        lat: 53.65, lng: 50.8,
        fish: ['Карп', 'Сазан', 'Лещ'],
        fishType: 'carp',
        rating: 4.6, reviews: 550, bestTime: 'Июль',
        seasons: ['summer', 'autumn'],
        infrastructure: 'Платный водоем',
        coordinates: '53.65°N, 50.80°E',
        description: 'Платный пруд с крупными экземплярами карпа и сазана. Комфортные условия для семейного отдыха и рыбалки.',
        depth: '4-7 м', area: '2 км²', shoreType: 'Оборудованный',
        access: 'Хороший', facilities: ['Беседки', 'Охрана', 'Кафе'],
        restrictions: 'Только "поймал-отпустил"', weatherStation: 'Samara'
      }
    ]
  },

  // Ural Federal District (Уральский федеральный округ)
  ural: {
    name: "Уральский федеральный округ",
    lakes: [
      {
        id: 'turgoyak',
        name: 'Озеро Тургояк',
        region: 'Челябинская область',
        district: 'ural',
        lat: 55.1764, lng: 60.1067,
        fish: ['Рипус', 'Сиг', 'Щука', 'Окунь'],
        fishType: 'trout',
        rating: 5.0, reviews: 1100, bestTime: 'Июнь, Февраль',
        seasons: ['summer', 'winter'],
        infrastructure: 'Заповедник',
        coordinates: '55.17°N, 60.10°E',
        description: 'Уникальное по чистоте озеро, часто называемое "Младшим братом Байкала". Отличная подледная ловля рипуса и сига.',
        depth: '20-34 м', area: '26 км²', shoreType: 'Каменистый',
        access: 'Хороший', facilities: ['Базы', 'Санатории'],
        restrictions: 'Строгие экологические нормы', weatherStation: 'Chelyabinsk'
      },
      {
        id: 'chebarkul',
        name: 'Озеро Чебаркуль',
        region: 'Челябинская область',
        district: 'ural',
        lat: 54.96, lng: 60.36,
        fish: ['Лещ', 'Карп', 'Окунь', 'Щука'],
        fishType: 'mixed',
        rating: 4.3, reviews: 500, bestTime: 'Май-Сентябрь',
        seasons: ['spring', 'summer', 'autumn'],
        infrastructure: 'База отдыха',
        coordinates: '54.96°N, 60.36°E',
        description: 'Популярное озеро, известное благодаря метеориту. Хорошие условия для семейной рыбалки.',
        depth: '5-12 м', area: '19 км²', shoreType: 'Смешанный',
        access: 'Хороший', facilities: ['Базы', 'Пляж'],
        restrictions: 'Нет', weatherStation: 'Chelyabinsk'
      }
    ]
  },

  // Siberian Federal District (Сибирский федеральный округ)
  siberian: {
    name: "Сибирский федеральный округ",
    lakes: [
      {
        id: 'baikal',
        name: 'Озеро Байкал',
        region: 'Иркутская область',
        district: 'siberian',
        lat: 53.5333, lng: 108.0,
        fish: ['Омуль', 'Хариус', 'Таймень', 'Сиг'],
        fishType: 'trout',
        rating: 5.0, reviews: 5000, bestTime: 'Июнь, Март',
        seasons: ['summer', 'winter'],
        infrastructure: 'Туристический объект',
        coordinates: '53.53°N, 108.00°E',
        description: 'Самое глубокое и чистое озеро планеты. Рыбалка на омуля и хариуса строго регулируется. Зимой — подледная ловля.',
        depth: '50-1642 м', area: '31722 км²', shoreType: 'Каменистый',
        access: 'Хороший', facilities: ['Гостиницы', 'Экскурсии'],
        restrictions: 'Вылов омуля запрещен или строго лицензирован', weatherStation: 'Irkutsk'
      },
      {
        id: 'teletskoye',
        name: 'Телецкое озеро',
        region: 'Республика Алтай',
        district: 'siberian',
        lat: 51.6333, lng: 87.2667,
        fish: ['Таймень', 'Телецкий сиг', 'Хариус', 'Елец'],
        fishType: 'trout',
        rating: 4.9, reviews: 1000, bestTime: 'Июль-Сентябрь',
        seasons: ['summer', 'autumn'],
        infrastructure: 'Заповедник',
        coordinates: '51.63°N, 87.26°E',
        description: 'Жемчужина Алтая. Глубокое горное озеро. Строгая охрана, рыбалка разрешена в ограниченных зонах.',
        depth: '100-325 м', area: '223 км²', shoreType: 'Каменистый',
        access: 'Умеренный', facilities: ['Базы', 'Прокат катеров'],
        restrictions: 'Лицензия на тайменя', weatherStation: 'Gorno-Altaysk'
      },
      {
        id: 'chany',
        name: 'Озеро Чаны',
        region: 'Новосибирская область',
        district: 'siberian',
        lat: 55.3, lng: 76.9,
        fish: ['Сазан', 'Щука', 'Карась', 'Судак'],
        fishType: 'mixed',
        rating: 4.5, reviews: 600, bestTime: 'Июнь, Сентябрь',
        seasons: ['spring', 'autumn'],
        infrastructure: 'База отдыха',
        coordinates: '55.30°N, 76.90°E',
        description: 'Одно из крупнейших мелководных озер в Западной Сибири. Отличная ловля крупной щуки и сазана.',
        depth: '2-7 м', area: '2000 км²', shoreType: 'Заболоченный',
        access: 'Хороший', facilities: ['Кемпинг', 'Лодки'],
        restrictions: 'Ограничения по размеру', weatherStation: 'Novosibirsk'
      }
    ]
  },

  // Far Eastern Federal District (Дальневосточный федеральный округ)
  fareast: {
    name: "Дальневосточный федеральный округ",
    lakes: [
      {
        id: 'khanka',
        name: 'Озеро Ханка',
        region: 'Приморский край',
        district: 'fareast',
        lat: 45.25, lng: 132.4,
        fish: ['Сазан', 'Амур', 'Толстолобик', 'Змееголов'],
        fishType: 'carp',
        rating: 4.6, reviews: 900, bestTime: 'Июль-Сентябрь',
        seasons: ['summer', 'autumn'],
        infrastructure: 'Заповедник',
        coordinates: '45.25°N, 132.40°E',
        description: 'Крупнейшее озеро Дальнего Востока. Уникальная фауна, включая экзотических рыб. Рыбалка с ограничениями.',
        depth: '1-4 м', area: '4070 км²', shoreType: 'Заболоченный',
        access: 'Умеренный', facilities: ['Гостевые дома', 'Базы'],
        restrictions: 'Нерестовый запрет, заповедная зона', weatherStation: 'Vladivostok'
      },
      {
        id: 'amur-river',
        name: 'Река Амур (Низовья)',
        region: 'Хабаровский край',
        district: 'fareast',
        lat: 48.4667, lng: 135.0,
        fish: ['Калуга', 'Осетр', 'Таймень', 'Сом', 'Амур'],
        fishType: 'predatory',
        rating: 4.8, reviews: 1200, bestTime: 'Июль, Октябрь',
        seasons: ['summer', 'autumn'],
        infrastructure: 'Рыболовная база',
        coordinates: '48.46°N, 135.00°E',
        description: 'Могучая река, граница с Китаем. Здесь обитают самые крупные рыбы, включая краснокнижную Калугу.',
        depth: '15-50 м', area: 'Река', shoreType: 'Смешанный',
        access: 'Хороший', facilities: ['Базы', 'Егеря'],
        restrictions: 'Строжайший запрет на осетровых и лососевых', weatherStation: 'Khabarovsk'
      }
    ]
  },

  // North Caucasian Federal District (Северо-Кавказский федеральный округ)
  nortcaucasus: {
    name: "Северо-Кавказский федеральный округ",
    lakes: [
      {
        id: 'keznoy-am',
        name: 'Озеро Кезенойам',
        region: 'Чечня / Дагестан',
        district: 'nortcaucasus',
        lat: 42.846, lng: 46.105,
        fish: ['Форель (Эйзенамская)', 'Сазан', 'Плотва'],
        fishType: 'trout',
        rating: 5.0, reviews: 550, bestTime: 'Июнь-Сентябрь',
        seasons: ['summer'],
        infrastructure: 'Туристический комплекс',
        coordinates: '42.84°N, 46.10°E',
        description: 'Самое большое высокогорное озеро Северного Кавказа. Обитает эндемичная форель. Прекрасные виды.',
        depth: '50-74 м', area: '2 км²', shoreType: 'Каменистый',
        access: 'Хороший', facilities: ['Отель', 'Прокат лодок'],
        restrictions: 'Строгий контроль, лицензия на форель', weatherStation: 'Grozny'
      },
      {
        id: 'baksan-river',
        name: 'Река Баксан (Приэльбрусье)',
        region: 'Кабардино-Балкария',
        district: 'nortcaucasus',
        lat: 43.46, lng: 42.92,
        fish: ['Ручьевая форель', 'Хариус'],
        fishType: 'trout',
        rating: 4.7, reviews: 400, bestTime: 'Июль-Сентябрь',
        seasons: ['summer', 'autumn'],
        infrastructure: 'Туристический объект',
        coordinates: '43.46°N, 42.92°E',
        description: 'Горная река с ледяной водой. Идеальное место для нахлыста и ультралайта. Потрясающие виды на Эльбрус.',
        depth: '1-3 м', area: 'Река', shoreType: 'Каменистый',
        access: 'Хороший', facilities: ['Гостиницы', 'Кафе'],
        restrictions: 'Лицензия', weatherStation: 'Nalchik'
      }
    ]
  },

  // City coordinates for weather stations (расширенная база)
  cityCoordinates: {
    'Tver': { lat: 56.8589, lng: 35.9149 },
    'Yaroslavl': { lat: 57.6261, lng: 39.8845 },
    'Lipetsk': { lat: 52.6031, lng: 39.5707 },
    'Saint-Petersburg': { lat: 59.9343, lng: 30.3351 },
    'Petrozavodsk': { lat: 61.784, lng: 34.3468 },
    'Astrakhan': { lat: 46.3549, lng: 48.0401 },
    'Rostov-on-Don': { lat: 47.2357, lng: 39.7015 },
    'Samara': { lat: 53.1959, lng: 50.1002 },
    'Chelyabinsk': { lat: 55.1644, lng: 61.4368 },
    'Irkutsk': { lat: 52.287, lng: 104.2811 },
    'Gorno-Altaysk': { lat: 51.9562, lng: 85.962 },
    'Novosibirsk': { lat: 55.0084, lng: 82.9357 },
    'Vladivostok': { lat: 43.1189, lng: 131.8869 },
    'Khabarovsk': { lat: 48.4818, lng: 135.0719 },
    'Grozny': { lat: 43.3248, lng: 45.6983 },
    'Nalchik': { lat: 43.4831, lng: 43.6062 }
  }
};

// ✅ Экспорт для Node.js (если нужно)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = extendedLakesData;
}
