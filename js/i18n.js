/* Переводы интерфейса: EN · RU · AZ.
   data-i18n — текст, data-i18n-html — разметка (акценты <em>), data-i18n-attr="attr:key;attr:key",
   data-cfg="projects.0.kind" — поле из config.js (объект { en, ru, az }), data-idx — элемент массива. */
window.I18N = (() => {
  'use strict';

  const dict = {
    en: {
      'meta.title': 'devbyfarhad — Creative Frontend Developer',
      'meta.desc': 'Portfolio of devbyfarhad, a creative frontend developer from Baku: 3D, motion and multilingual websites.',
      'a11y.skip': 'Skip to content',
      'lang.name': 'English',
      'nav.intro': 'Intro', 'nav.about': 'About', 'nav.services': 'Services', 'nav.work': 'Work',
      'nav.tools': 'Toolbox', 'nav.process': 'Process', 'nav.contact': 'Contact',
      'menu.open': 'Open menu', 'menu.close': 'Close menu',
      'status': 'Open to projects',
      'loader.tag': 'Portfolio 2026',

      'hero.roles': ['Creative Frontend Developer', 'Three.js & WebGL', 'GSAP motion design', 'Interactive 3D web'],
      'hero.l1': 'Turning ideas',
      'hero.l2': 'into <em>reality</em>',
      'hero.l3': 'through code.',
      'hero.lead': 'Frontend developer from Baku. I build fast, multilingual websites with 3D scenes and motion that people actually remember.',
      'hero.cta': 'See my work',
      'hero.scroll': 'Scroll to explore',
      'hero.time': 'Local time',

      'about.text': 'Hi, I’m Farhad — a frontend developer who turns ideas into <em>living</em> interfaces. I combine clean code, real-time 3D and motion design to build websites that feel like products, not pages: fast, responsive, multilingual and full of small details people notice.',
      'about.s1': 'animation & 3D libraries in production',
      'about.s2': 'languages in my interfaces — AZ · RU · EN',
      'about.s3': 'the bar for every animation',
      'about.s4': 'public repositories on GitHub',

      'services.title': 'What I <em>do</em>',
      'services.hint': 'Scroll — the cube turns',
      'services.s1.t': '3D & WebGL',
      'services.s1.d': 'Interactive Three.js scenes, procedural models built in code, custom shaders and particle systems — 3D that runs smoothly right in the browser.',
      'services.s2.t': 'Motion & interaction',
      'services.s2.d': 'Scroll storytelling with GSAP, page transitions, micro-interactions and smooth scrolling. Animation with a purpose, not noise.',
      'services.s3.t': 'Websites & landing pages',
      'services.s3.d': 'Promo sites, landing pages and portfolios from scratch: semantic HTML, modern CSS and vanilla JavaScript — ready for GitHub Pages or any hosting.',
      'services.s4.t': 'Multilingual & responsive',
      'services.s4.d': 'Interfaces in Azerbaijani, Russian and English, tuned for every screen — with fonts that support every glyph, Ə included.',

      'work.title': 'Selected <em>work</em>',
      'work.sub': 'Real projects with live demos and source code.',
      'work.hint': 'Keep scrolling',
      'work.live': 'Live demo', 'work.code': 'Source code',
      'work.cta.title': 'Your project could be next',
      'work.cta.text': 'Let’s build something people will want to share.',
      'work.cta.btn': 'Start a project',

      'tools.title': 'My <em>toolbox</em>',
      'tools.hint': 'Grab the sphere and spin it',

      'process.title': 'How I <em>work</em>',
      'process.1.t': 'Discover',
      'process.1.d': 'We talk through goals, audience and references. I collect the brief and propose a concept with a clear scope.',
      'process.1.k': 'Brief · Goals · References',
      'process.2.t': 'Design',
      'process.2.d': 'Moodboard, structure and a motion concept. Before writing code we agree on the key screens and how they move.',
      'process.2.k': 'Moodboard · Structure · Motion',
      'process.3.t': 'Develop',
      'process.3.d': 'Clean, modular code with 3D and animation built in. Regular previews, so you see progress every few days.',
      'process.3.k': 'Code · 3D · Animation',
      'process.4.t': 'Launch',
      'process.4.d': 'Testing on real devices, performance tuning, SEO basics and deployment — plus support after launch.',
      'process.4.k': 'Testing · Speed · Deploy',

      'contact.title': 'Have an idea?<br>Let’s make it <em>real</em>.',
      'contact.text': 'Open to freelance projects and collaborations. Tell me about your idea — I’ll reply with a plan.',
      'contact.btn': 'Say hello',
      'contact.email': 'Email', 'contact.telegram': 'Telegram', 'contact.github': 'GitHub',
      'contact.linkedin': 'LinkedIn', 'contact.instagram': 'Instagram',

      'footer.built': 'Built with Three.js, GSAP & Lenis',
      'footer.top': 'Back to top',

      'cursor.open': 'Open', 'cursor.drag': 'Drag'
    },

    ru: {
      'meta.title': 'devbyfarhad — креативный фронтенд-разработчик',
      'meta.desc': 'Портфолио devbyfarhad, креативного фронтенд-разработчика из Баку: 3D, анимация и многоязычные сайты.',
      'a11y.skip': 'К содержимому',
      'lang.name': 'Русский',
      'nav.intro': 'Интро', 'nav.about': 'Обо мне', 'nav.services': 'Услуги', 'nav.work': 'Работы',
      'nav.tools': 'Инструменты', 'nav.process': 'Процесс', 'nav.contact': 'Контакты',
      'menu.open': 'Открыть меню', 'menu.close': 'Закрыть меню',
      'status': 'Открыт к проектам',
      'loader.tag': 'Портфолио 2026',

      'hero.roles': ['Креативный фронтенд-разработчик', 'Three.js и WebGL', 'Моушн на GSAP', 'Интерактивный 3D-веб'],
      'hero.l1': 'Превращаю идеи',
      'hero.l2': 'в <em>реальность</em>',
      'hero.l3': 'с помощью кода.',
      'hero.lead': 'Фронтенд-разработчик из Баку. Делаю быстрые многоязычные сайты с 3D-сценами и анимацией, которые по-настоящему запоминаются.',
      'hero.cta': 'Смотреть работы',
      'hero.scroll': 'Листайте вниз',
      'hero.time': 'Местное время',

      'about.text': 'Привет, я Фархад — фронтенд-разработчик, который превращает идеи в <em>живые</em> интерфейсы. Соединяю чистый код, 3D в реальном времени и моушн-дизайн, чтобы сайт ощущался продуктом, а не страницей: быстрым, адаптивным, многоязычным и полным деталей, которые замечают люди.',
      'about.s1': 'библиотек анимации и 3D в боевых проектах',
      'about.s2': 'языка в моих интерфейсах — AZ · RU · EN',
      'about.s3': 'планка для каждой анимации',
      'about.s4': 'публичных репозитория на GitHub',

      'services.title': 'Что я <em>делаю</em>',
      'services.hint': 'Листайте — куб повернётся',
      'services.s1.t': '3D и WebGL',
      'services.s1.d': 'Интерактивные сцены на Three.js, процедурные модели из кода, свои шейдеры и системы частиц — 3D, которое плавно работает прямо в браузере.',
      'services.s2.t': 'Анимация и интерактив',
      'services.s2.d': 'Скролл-сторителлинг на GSAP, переходы, микровзаимодействия и плавный скролл. Анимация со смыслом, а не ради шума.',
      'services.s3.t': 'Сайты и лендинги',
      'services.s3.d': 'Промо-сайты, лендинги и портфолио с нуля: семантичный HTML, современный CSS и чистый JavaScript — готово для GitHub Pages или любого хостинга.',
      'services.s4.t': 'Мультиязычность и адаптив',
      'services.s4.d': 'Интерфейсы на азербайджанском, русском и английском под любой экран — со шрифтами, где есть каждый символ, включая Ə.',

      'work.title': 'Избранные <em>работы</em>',
      'work.sub': 'Реальные проекты с живыми демо и исходным кодом.',
      'work.hint': 'Листайте дальше',
      'work.live': 'Живое демо', 'work.code': 'Исходный код',
      'work.cta.title': 'Следующим может быть ваш проект',
      'work.cta.text': 'Давайте сделаем то, чем захочется поделиться.',
      'work.cta.btn': 'Обсудить проект',

      'tools.title': 'Мои <em>инструменты</em>',
      'tools.hint': 'Хватайте сферу и крутите',

      'process.title': 'Как я <em>работаю</em>',
      'process.1.t': 'Знакомство',
      'process.1.d': 'Обсуждаем цели, аудиторию и референсы. Собираю бриф и предлагаю концепцию с понятными рамками.',
      'process.1.k': 'Бриф · Цели · Референсы',
      'process.2.t': 'Дизайн',
      'process.2.d': 'Мудборд, структура и концепция анимации. До кода договариваемся о ключевых экранах и о том, как они двигаются.',
      'process.2.k': 'Мудборд · Структура · Моушн',
      'process.3.t': 'Разработка',
      'process.3.d': 'Чистый модульный код со встроенными 3D и анимацией. Регулярные превью — прогресс видно каждые несколько дней.',
      'process.3.k': 'Код · 3D · Анимация',
      'process.4.t': 'Запуск',
      'process.4.d': 'Тесты на реальных устройствах, оптимизация, базовое SEO и публикация — и поддержка после запуска.',
      'process.4.k': 'Тесты · Скорость · Деплой',

      'contact.title': 'Есть идея?<br>Давайте сделаем её <em>реальной</em>.',
      'contact.text': 'Открыт для фриланс-проектов и коллабораций. Расскажите об идее — отвечу с планом.',
      'contact.btn': 'Написать',
      'contact.email': 'Почта', 'contact.telegram': 'Telegram', 'contact.github': 'GitHub',
      'contact.linkedin': 'LinkedIn', 'contact.instagram': 'Instagram',

      'footer.built': 'Сделано на Three.js, GSAP и Lenis',
      'footer.top': 'Наверх',

      'cursor.open': 'Открыть', 'cursor.drag': 'Тяни'
    },

    az: {
      'meta.title': 'devbyfarhad — kreativ frontend developer',
      'meta.desc': 'devbyfarhad portfoliosu: Bakıdan kreativ frontend developer — 3D, animasiya və çoxdilli saytlar.',
      'a11y.skip': 'Məzmuna keç',
      'lang.name': 'Azərbaycanca',
      'nav.intro': 'Giriş', 'nav.about': 'Haqqımda', 'nav.services': 'Xidmətlər', 'nav.work': 'İşlər',
      'nav.tools': 'Alətlər', 'nav.process': 'Proses', 'nav.contact': 'Əlaqə',
      'menu.open': 'Menyunu aç', 'menu.close': 'Menyunu bağla',
      'status': 'Layihələrə açığam',
      'loader.tag': 'Portfolio 2026',

      'hero.roles': ['Kreativ frontend developer', 'Three.js və WebGL', 'GSAP ilə motion dizayn', 'İnteraktiv 3D veb'],
      'hero.l1': 'İdeyaları kodla',
      'hero.l2': '<em>reallığa</em>',
      'hero.l3': 'çevirirəm.',
      'hero.lead': 'Bakıdan frontend developer. 3D səhnələr və yadda qalan animasiyalarla sürətli, çoxdilli saytlar yaradıram.',
      'hero.cta': 'İşlərimə baxın',
      'hero.scroll': 'Aşağı sürüşdürün',
      'hero.time': 'Yerli vaxt',

      'about.text': 'Salam, mən Fərhadam — ideyaları <em>canlı</em> interfeyslərə çevirən frontend developerəm. Təmiz kodu, real vaxtda 3D-ni və motion dizaynı birləşdirərək səhifə deyil, məhsul kimi hiss olunan saytlar qururam: sürətli, adaptiv, çoxdilli və insanların fərq etdiyi kiçik detallarla dolu.',
      'about.s1': 'animasiya və 3D kitabxanası real layihələrdə',
      'about.s2': 'dil interfeyslərimdə — AZ · RU · EN',
      'about.s3': 'hər animasiya üçün hədəf',
      'about.s4': 'GitHub-da açıq repozitori',

      'services.title': 'Nə <em>edirəm</em>',
      'services.hint': 'Sürüşdürün — kub dönəcək',
      'services.s1.t': '3D və WebGL',
      'services.s1.d': 'İnteraktiv Three.js səhnələri, kodla qurulan prosedur modellər, xüsusi şeyderlər və hissəcik sistemləri — birbaşa brauzerdə rəvan işləyən 3D.',
      'services.s2.t': 'Animasiya və interaktivlik',
      'services.s2.d': 'GSAP ilə skroll hekayələri, keçidlər, mikro-interaksiyalar və hamar skroll. Səs-küy üçün yox, məqsədli animasiya.',
      'services.s3.t': 'Saytlar və lendinqlər',
      'services.s3.d': 'Sıfırdan promo-saytlar, lendinqlər və portfoliolar: semantik HTML, müasir CSS və təmiz JavaScript — GitHub Pages və ya istənilən hostinq üçün hazır.',
      'services.s4.t': 'Çoxdilli və adaptiv',
      'services.s4.d': 'Azərbaycan, rus və ingilis dillərində, hər ekrana uyğun interfeyslər — hər simvolu, o cümlədən Ə hərfini dəstəkləyən şriftlərlə.',

      'work.title': 'Seçilmiş <em>işlər</em>',
      'work.sub': 'Canlı demo və mənbə kodu olan real layihələr.',
      'work.hint': 'Sürüşdürməyə davam edin',
      'work.live': 'Canlı demo', 'work.code': 'Mənbə kodu',
      'work.cta.title': 'Növbəti layihə sizinki ola bilər',
      'work.cta.text': 'Gəlin insanların paylaşmaq istəyəcəyi bir şey yaradaq.',
      'work.cta.btn': 'Layihəni müzakirə et',

      'tools.title': 'Mənim <em>alətlərim</em>',
      'tools.hint': 'Sferanı tutub fırladın',

      'process.title': 'Necə <em>işləyirəm</em>',
      'process.1.t': 'Tanışlıq',
      'process.1.d': 'Məqsədləri, auditoriyanı və nümunələri müzakirə edirik. Brifi toplayıram və aydın çərçivəli konsepsiya təklif edirəm.',
      'process.1.k': 'Brif · Məqsədlər · Nümunələr',
      'process.2.t': 'Dizayn',
      'process.2.d': 'Mudbord, struktur və animasiya konsepsiyası. Kod yazmazdan əvvəl əsas ekranları və onların necə hərəkət edəcəyini razılaşdırırıq.',
      'process.2.k': 'Mudbord · Struktur · Motion',
      'process.3.t': 'Hazırlama',
      'process.3.d': '3D və animasiya daxil olmaqla təmiz, modul kod. Müntəzəm preview-lar sayəsində irəliləyişi bir neçə gündən bir görürsünüz.',
      'process.3.k': 'Kod · 3D · Animasiya',
      'process.4.t': 'Buraxılış',
      'process.4.d': 'Real cihazlarda test, performans optimizasiyası, SEO əsasları və yerləşdirmə — buraxılışdan sonra dəstək də.',
      'process.4.k': 'Test · Sürət · Deploy',

      'contact.title': 'İdeyanız var?<br>Gəlin onu <em>reallaşdıraq</em>.',
      'contact.text': 'Frilans layihələrə və əməkdaşlığa açığam. İdeyanızdan danışın — plan ilə cavab verəcəyəm.',
      'contact.btn': 'Salam yaz',
      'contact.email': 'E-poçt', 'contact.telegram': 'Telegram', 'contact.github': 'GitHub',
      'contact.linkedin': 'LinkedIn', 'contact.instagram': 'Instagram',

      'footer.built': 'Three.js, GSAP və Lenis ilə hazırlanıb',
      'footer.top': 'Yuxarı',

      'cursor.open': 'Aç', 'cursor.drag': 'Sürüklə'
    }
  };

  const LANGS = ['en', 'ru', 'az'];
  let lang = LANGS.includes(document.documentElement.lang) ? document.documentElement.lang : 'en';
  const listeners = [];

  const t = (key, l = lang) => {
    const v = dict[l][key];
    return v !== undefined ? v : (dict.en[key] !== undefined ? dict.en[key] : key);
  };
  // Объект { en, ru, az } из config.js → значение текущего языка
  const pick = (obj) => (obj && typeof obj === 'object' && !Array.isArray(obj) && 'en' in obj ? (obj[lang] !== undefined ? obj[lang] : obj.en) : obj);
  const cfg = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), window.PORTFOLIO);

  function apply(root = document) {
    root.querySelectorAll('[data-i18n]').forEach((el) => {
      const v = t(el.dataset.i18n);
      el.textContent = v;
      if (el.hasAttribute('data-text')) el.dataset.text = v;
    });
    root.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(';').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });
    root.querySelectorAll('[data-cfg]').forEach((el) => {
      let v = pick(cfg(el.dataset.cfg));
      if (Array.isArray(v) && el.dataset.idx !== undefined) v = v[+el.dataset.idx];
      if (v != null) el.textContent = v;
    });
    document.documentElement.lang = lang;
    document.title = t('meta.title');
  }

  function set(next) {
    if (!dict[next] || next === lang) return;
    lang = next;
    try { localStorage.setItem('dbf-lang', next); } catch (e) {}
    apply();
    listeners.forEach((fn) => fn(next));
  }

  return {
    LANGS, t, pick, apply, set,
    get lang() { return lang; },
    onChange: (fn) => listeners.push(fn)
  };
})();
