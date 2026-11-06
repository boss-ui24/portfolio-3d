/* Данные портфолио: контакты, проекты, инструменты. Тексты интерфейса — в i18n.js.
   Поля с переводами задаются объектом { en, ru, az }. Пустые контакты на сайте не выводятся. */
window.PORTFOLIO = {
  handle: 'devbyfarhad',
  github: 'boss-ui24',
  city: { en: 'Baku', ru: 'Баку', az: 'Bakı' },
  timeZone: 'Asia/Baku',

  // Кнопка «Say hello» ведёт на email, если его нет — в Telegram, иначе на профиль GitHub
  email: '',          // например 'hello@example.com'
  telegram: '',       // ник без @
  linkedin: '',       // полная ссылка
  instagram: '',      // ник без @

  projects: [
    {
      title: { en: 'NAMI 波', ru: 'NAMI 波', az: 'NAMI 波' },
      kind: {
        en: 'Sushi bar website · 3D concept',
        ru: 'Сайт суши-бара · 3D-концепт',
        az: 'Suşi barı üçün sayt · 3D konsept'
      },
      features: {
        en: ['3D sushi generated in code — zero photos', 'Scroll-driven exploded view of a roll', 'AZ · RU · EN with a curtain transition', 'Cart with confetti, Swiper menu, custom cursor'],
        ru: ['3D-суши, собранные кодом — ноль фотографий', 'Разбор ролла на слои по скроллу', 'AZ · RU · EN со шторкой при смене языка', 'Корзина с конфетти, меню на Swiper, свой курсор'],
        az: ['Kodla yaradılmış 3D suşi — sıfır foto', 'Skroll ilə rolun qatlara ayrılması', 'AZ · RU · EN, dil dəyişəndə pərdə effekti', 'Konfettili səbət, Swiper menyu, xüsusi kursor']
      },
      stack: ['Three.js', 'GSAP', 'ScrollTrigger', 'SplitText', 'Lenis', 'Swiper'],
      year: 2026,
      live: 'https://boss-ui24.github.io/SUSHI/',
      code: 'https://github.com/boss-ui24/SUSHI',
      cover: 'assets/work/nami-1.jpg',
      coverMobile: 'assets/work/nami-m.jpg'
    },
    {
      title: { en: 'Teardown', ru: 'Разбор техники', az: 'Texnika anatomiyası' },
      kind: {
        en: 'Interactive exploded views · CSS 3D',
        ru: 'Интерактивные разнесённые виды · CSS 3D',
        az: 'İnteraktiv sökülmə görünüşləri · CSS 3D'
      },
      features: {
        en: ['4 devices, 39 parts — every one drawn in SVG', 'Custom CSS 3D engine, no WebGL', 'Interactive map of the M4 chip', 'Timeline of forty years of engineering'],
        ru: ['4 устройства, 39 деталей — каждая нарисована в SVG', 'Свой движок на CSS 3D, без WebGL', 'Интерактивная схема чипа M4', 'Лента «Сорок лет инженерии»'],
        az: ['4 cihaz, 39 detal — hər biri SVG ilə çəkilib', 'WebGL-siz, öz CSS 3D mühərriki', 'M4 çipinin interaktiv sxemi', '«Qırx illik mühəndislik» xronologiyası']
      },
      stack: ['CSS 3D', 'SVG', 'Motion', 'Vanilla JS'],
      year: 2026,
      live: 'https://boss-ui24.github.io/IOS/',
      code: 'https://github.com/boss-ui24/IOS',
      cover: 'assets/work/razbor-1.jpg',
      coverMobile: 'assets/work/razbor-m.jpg'
    }
  ],

  // Теги на вращающейся сфере. kind: accent | light | blue | outline (или без kind)
  tools: [
    { name: 'JavaScript', kind: 'accent' },
    { name: 'Three.js', kind: 'light' },
    { name: 'GSAP', kind: 'accent' },
    { name: 'WebGL', kind: 'blue' },
    { name: 'GLSL', kind: 'outline' },
    { name: 'HTML' },
    { name: 'CSS' },
    { name: 'ScrollTrigger' },
    { name: 'SplitText' },
    { name: 'Lenis', kind: 'outline' },
    { name: 'Swiper' },
    { name: 'Motion', kind: 'blue' },
    { name: 'Matter.js' },
    { name: 'SVG', kind: 'light' },
    { name: 'CSS 3D' },
    { name: 'Canvas' },
    { name: 'Git' },
    { name: 'GitHub Pages', kind: 'outline' },
    { name: 'i18n' },
    { name: 'Responsive', kind: 'light' }
  ],

  // Бегущие ленты между первым экраном и «Обо мне»
  marquee: ['Three.js', 'GSAP', 'WebGL', 'JavaScript', 'Motion', 'CSS 3D', 'GLSL', 'Lenis']
};
