// extended-lakes-data.js
// Расширенная база данных озер России для каталога
const extendedLakesData = {
    // Центральный федеральный округ
    central: {
        name: "Центральный федеральный округ",
        lakes: [
            {
                id: 'seliger',
                name: 'Озеро Селигер',
                region: 'Тверская область',
                district: 'central',
                lat: 57.2217,
                lng: 33.2206,
                // Обновленный список рыб
                fish: ['Щука', 'Окунь', 'Судак', 'Лещ', 'Карп', 'Плотва', 'Карась', 'Налим'],
                fishType: 'pike', // Основной трофейный вид
                rating: 4.8,
                reviews: 1247,
                bestTime: 'Май-Октябрь',
                seasons: ['spring', 'summer', 'autumn'],
                infrastructure: 'Рыболовная база',
                description: 'Одно из крупнейших озер Тверской области, известное своей богатой рыбной фауной и живописными пейзажами.',
                depth: '5-15 м',
                area: '260 км²',
                shoreType: 'Смешанный',
                access: 'Хороший',
                facilities: ['База отдыха', 'Аренда лодок', 'Магазин', 'Кафе'],
                restrictions: 'Нерестовый запрет весной',
                weatherStation: 'Tver'
            },
            {
                id: 'plesheevo',
                name: 'Озеро Плещеево',
                region: 'Ярославская область',
                district: 'central',
                lat: 56.77,
                lng: 38.78,
                fish: ['Налим', 'Лещ', 'Плотва', 'Окунь', 'Сиг'],
                fishType: 'whitefish', 
                rating: 4.5,
                reviews: 512,
                bestTime: 'Зима-Весна',
                seasons: ['winter', 'spring'],
                infrastructure: 'Национальный парк',
                description: 'Глубокое, проточное озеро, известное своей реликтовой рыбой – переславской ряпушкой (разновидность сига). Строгие ограничения на лов.',
                depth: '15-25 м',
                area: '50 км²',
                shoreType: 'Песчаный',
                access: 'Ограниченный',
                facilities: ['Музей', 'Экотропы'],
                restrictions: 'Строгий запрет на лов ряпушки. Лицензионный лов.',
                weatherStation: 'Yaroslavl'
            }
        ]
    },

    // Северо-Западный федеральный округ
    northwest: {
        name: "Северо-Западный федеральный округ",
        lakes: [
            {
                id: 'ladoga',
                name: 'Ладожское озеро',
                region: 'Ленинградская область',
                district: 'northwest',
                lat: 60.50,
                lng: 31.50,
                fish: ['Щука', 'Окунь', 'Судак', 'Сиг', 'Форель (озерная)', 'Налим', 'Лещ', 'Плотва'],
                fishType: 'trout',
                rating: 4.9,
                reviews: 3500,
                bestTime: 'Май-Сентябрь',
                seasons: ['spring', 'summer', 'autumn', 'winter'],
                infrastructure: 'Порты, базы',
                description: 'Крупнейшее озеро Европы. Огромные глубины и сильные ветры. Здесь водятся настоящие трофеи.',
                depth: '20-230 м',
                area: '17.7 тыс. км²',
                shoreType: 'Скалы, песок',
                access: 'Сложный (нужна лодка)',
                facilities: ['Марины', 'Метеостанции'],
                restrictions: 'Ограничения на вылов ценных пород',
                weatherStation: 'SaintPetersburg'
            },
            {
                id: 'onega',
                name: 'Онежское озеро',
                region: 'Республика Карелия',
                district: 'northwest',
                lat: 61.50,
                lng: 35.50,
                fish: ['Форель (озерная)', 'Сиг', 'Щука', 'Судак', 'Налим', 'Окунь'],
                fishType: 'trout',
                rating: 4.7,
                reviews: 1800,
                bestTime: 'Июнь-Август',
                seasons: ['summer', 'autumn', 'winter'],
                infrastructure: 'Базы отдыха',
                description: 'Второе по величине озеро в Европе. Известно своей чистой водой и ловлей крупной озерной форели.',
                depth: '50-127 м',
                area: '9.7 тыс. км²',
                shoreType: 'Каменистый',
                access: 'Хороший',
                facilities: ['Кемпинги', 'Аренда катеров'],
                restrictions: 'Строгий контроль за лицензионным ловом',
                weatherStation: 'Petrozavodsk'
            }
        ]
    },

    // Приволжский федеральный округ
    volga: {
        name: "Приволжский федеральный округ",
        lakes: [
            {
                id: 'baskunchak',
                name: 'Озеро Баскунчак',
                region: 'Астраханская область',
                district: 'volga',
                lat: 47.1683,
                lng: 46.8533,
                fish: ['Нет рыбы (соленое)', 'Нет рыбы'],
                fishType: 'none',
                rating: 3.5,
                reviews: 80,
                bestTime: 'Всегда',
                seasons: ['summer', 'autumn'],
                infrastructure: 'Санаторий',
                description: 'Соленое озеро, где рыбалка невозможна, но стоит посетить из-за уникальных пейзажей. Отличный пример того, что не все водоемы рыбные! 😉',
                depth: 'Менее 1 м',
                area: '106 км²',
                shoreType: 'Соль, глина',
                access: 'Хороший',
                facilities: ['Парковка', 'Магазин соли'],
                restrictions: 'Охраняемая территория',
                weatherStation: 'Astrakhan'
            },
            {
                id: 'kaban',
                name: 'Озера Кабан',
                region: 'Республика Татарстан',
                district: 'volga',
                lat: 55.7600,
                lng: 49.1200,
                fish: ['Карп', 'Лещ', 'Плотва', 'Карась', 'Щука', 'Окунь'],
                fishType: 'carp',
                rating: 4.2,
                reviews: 210,
                bestTime: 'Июль-Сентябрь',
                seasons: ['spring', 'summer', 'autumn'],
                infrastructure: 'Городская черта',
                description: 'Система озер в черте Казани. Удобная транспортная доступность, но сильный прессинг рыбаков. Хорош для ловли мирной рыбы.',
                depth: '3-10 м',
                area: '2 км²',
                shoreType: 'Благоустроенный',
                access: 'Отличный',
                facilities: ['Набережная', 'Кафе'],
                restrictions: 'Ограничения по месту лова',
                weatherStation: 'Kazan'
            }
        ]
    },

    // Сибирский федеральный округ
    siberia: {
        name: "Сибирский федеральный округ",
        lakes: [
            {
                id: 'baikal',
                name: 'Озеро Байкал',
                region: 'Иркутская область',
                district: 'siberia',
                lat: 53.50,
                lng: 108.00,
                fish: ['Сиг', 'Форель (озерная)', 'Налим', 'Пескарь'],
                fishType: 'whitefish',
                rating: 5.0,
                reviews: 5000,
                bestTime: 'Весь год',
                seasons: ['spring', 'summer', 'autumn', 'winter'],
                infrastructure: 'Туристические базы',
                description: 'Самое глубокое и чистое озеро планеты. Уникальная фауна, лицензионный и спортивный лов.',
                depth: '300-1642 м',
                area: '31.7 тыс. км²',
                shoreType: 'Скала, галька',
                access: 'Сложный',
                facilities: ['Научные станции', 'Турбазы'],
                restrictions: 'Строжайший контроль и лицензии',
                weatherStation: 'Irkutsk'
            },
            {
                id: 'chany',
                name: 'Озеро Чаны',
                region: 'Новосибирская область',
                district: 'siberia',
                lat: 55.40,
                lng: 77.50,
                fish: ['Щука', 'Окунь', 'Лещ', 'Карась', 'Сазан', 'Плотва', 'Густера'],
                fishType: 'pike',
                rating: 4.3,
                reviews: 650,
                bestTime: 'Май, Сентябрь',
                seasons: ['spring', 'autumn'],
                infrastructure: 'База отдыха',
                description: 'Крупнейшее мелководное озеро Западной Сибири. Идеально для ловли трофейной щуки и окуня. Сильные ветра.',
                depth: '1-3 м',
                area: '1.5-2.5 тыс. км²',
                shoreType: 'Илистый',
                access: 'Средний',
                facilities: ['Домики для проживания', 'Аренда лодок'],
                restrictions: 'Нерестовый запрет весной',
                weatherStation: 'Novosibirsk'
            }
        ]
    }
};

// Координаты для привязки к городам (оставлено для полноты, как в оригинале)
const cityCoordinates = {
    'Moscow': { lat: 55.7558, lng: 37.6173 },
    'SaintPetersburg': { lat: 59.9343, lng: 30.3351 },
    'Novosibirsk': { lat: 55.0084, lng: 82.9357 },
    'Yekaterinburg': { lat: 56.8389, lng: 60.6057 },
    'Kazan': { lat: 55.8304, lng: 49.0661 },
    'Irkutsk': { lat: 52.2833, lng: 104.2833 },
    'Tver': { lat: 56.8600, lng: 35.9100 },
    'Petrozavodsk': { lat: 61.7800, lng: 34.3500 },
    'Astrakhan': { lat: 46.3500, lng: 48.0400 },
    'Yaroslavl': { lat: 57.6264, lng: 39.8844 }
};
