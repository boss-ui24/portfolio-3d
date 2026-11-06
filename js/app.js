/* devbyfarhad — портфолио v2.
   Всё, что не 3D: плавный скролл (Lenis), прелоадер, анимации текста (SplitText), секции с прокруткой
   (коробка услуг, горизонтальная лента работ, линия процесса), курсор, магнитные кнопки, смена языка
   со шторкой. Фоновая сцена (js/cube.js) читает window.SCENE, который заполняется здесь. */
(() => {
  'use strict';

  // Общее состояние для 3D-сцены: номер формации, повороты слоёв, скорость скролла, указатель, тема
  const S = (window.SCENE = {
    shape: 0, twistIntro: 0, twistScroll: 0, intro: 0,
    vel: 0, px: 0, py: 0, boost: 0,
    services: 0, work: 0, process: 0,
    heroRight: 0.55, theme: 'ink', ready: false
  });

  const root = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger || !window.SplitText) {   // CDN не ответил — показываем страницу без анимаций
    root.classList.remove('js', 'is-loading');
    document.querySelector('.loader')?.remove();
    return;
  }
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin);
  ScrollTrigger.config({ ignoreMobileResize: true });
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  const C = window.PORTFOLIO;
  const I = window.I18N;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const smooth = (t) => t * t * (3 - 2 * t);
  const pad2 = (n) => String(n).padStart(2, '0');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const THEME_COLOR = { ink: '#0e0e12', paper: '#eee8de', blue: '#2b36f0', coral: '#ff5b2e' };

  const ICON = {
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c1.2 6.6 5.4 10.8 12 12-6.6 1.2-10.8 5.4-12 12-1.2-6.6-5.4-10.8-12-12C6.6 10.8 10.8 6.6 12 0z"/></svg>',
    scribble: '<svg class="scribble" viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true"><path d="M152 10C112 0 44 4 16 24-8 42 16 70 74 74c56 4 118-6 122-34C199 16 150 4 92 10"/></svg>'
  };

  /* ---------- Контент из config.js ---------- */
  function render() {
    // Ленты: две одинаковые группы подряд, чтобы сдвиг на −50 % зацикливался без шва
    $$('[data-band]').forEach((track, n) => {
      const words = n ? [...C.marquee].reverse() : C.marquee;
      const group = words.concat(words).map((w) => `<span class="band__item">${w}${ICON.star}</span>`).join('');
      track.innerHTML = `<div class="band__group">${group}</div><div class="band__group">${group}</div>`;
    });

    // Карточки проектов встают перед карточкой-призывом
    const cta = $('.card--cta');
    C.projects.forEach((p, i) => {
      const card = document.createElement('article');
      card.className = 'card';
      const feats = p.features.en.map((_, k) => `<li data-cfg="projects.${i}.features" data-idx="${k}"></li>`).join('');
      card.innerHTML = `
        <a class="card__media" href="${p.live}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true" data-cursor="open">
          <picture>
            ${p.coverMobile ? `<source media="(max-width: 760px)" srcset="${p.coverMobile}">` : ''}
            <img src="${p.cover}" alt="" loading="lazy" decoding="async">
          </picture>
          <span class="card__num">${pad2(i + 1)}</span>
        </a>
        <div class="card__body">
          <div class="card__meta"><span data-cfg="projects.${i}.kind"></span><span>${p.year}</span></div>
          <h3 class="card__title"><a href="${p.live}" target="_blank" rel="noopener" data-cfg="projects.${i}.title"></a></h3>
          <ul class="card__features">${feats}</ul>
          <ul class="card__stack">${p.stack.map((s) => `<li>${s}</li>`).join('')}</ul>
          <div class="card__links">
            <a class="pill" href="${p.live}" target="_blank" rel="noopener"><span data-i18n="work.live">Live demo</span>${ICON.arrow}</a>
            ${p.code ? `<a class="pill pill--ghost" href="${p.code}" target="_blank" rel="noopener"><span data-i18n="work.code">Source code</span>${ICON.arrow}</a>` : ''}
          </div>
        </div>`;
      cta.before(card);
    });

    // Контакты: пустые поля пропускаем; первая ссылка — цель большой кнопки
    const links = [];
    if (C.email) links.push({ key: 'contact.email', href: `mailto:${C.email}` });
    if (C.telegram) links.push({ key: 'contact.telegram', href: `https://t.me/${C.telegram}` });
    links.push({ key: 'contact.github', href: `https://github.com/${C.github}` });
    if (C.linkedin) links.push({ key: 'contact.linkedin', href: C.linkedin });
    if (C.instagram) links.push({ key: 'contact.instagram', href: `https://instagram.com/${C.instagram}` });
    const ext = (h) => (h.startsWith('http') ? ' target="_blank" rel="noopener"' : '');
    $$('[data-socials]').forEach((ul) => {
      ul.innerHTML = links.map((l) => `<li><a class="social" href="${l.href}"${ext(l.href)}><span data-i18n="${l.key}"></span>${ICON.arrow}</a></li>`).join('');
    });
    const hello = $('[data-hello]');
    hello.href = links[0].href;
    if (!links[0].href.startsWith('http')) { hello.removeAttribute('target'); hello.removeAttribute('rel'); }

    $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  }

  // Текст по кругу на значке: два повтора фразы заполняют окружность
  function setBadge() {
    const s = I.t('hero.scroll');
    let up = s.toUpperCase();
    try { up = s.toLocaleUpperCase(I.lang); } catch (e) {}
    $('[data-badge-text]').textContent = `${up} • ${up} • `;
  }

  /* ---------- Плавный скролл ---------- */
  let lenis = null;
  function initScroll() {
    if (!reduce && window.Lenis) {
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.4 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
      lenis.stop();
    }

    // Якорные ссылки — через Lenis, с закрытием меню
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      const target = id === '#' || id === '#top' ? 0 : $(id);
      if (target === null) return;
      e.preventDefault();
      if (menuOpen) toggleMenu(false);
      scrollToTarget(target);
    });

    // Скорость скролла (px/с, сглаженная) — для куба, лент и сферы
    let lastY = window.scrollY;
    gsap.ticker.add((time, dt) => {
      const y = window.scrollY;
      const v = ((y - lastY) / Math.max(dt, 1)) * 1000;
      lastY = y;
      S.vel += (v - S.vel) * 0.15;
      if (Math.abs(S.vel) < 1) S.vel = 0;
    });

    window.addEventListener('pointermove', (e) => {
      S.px = (e.clientX / window.innerWidth) * 2 - 1;
      S.py = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }

  function scrollToTarget(target) {
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: reduce ? 'auto' : 'smooth' });
    } else {
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    }
  }

  /* ---------- Курсор и магнитные кнопки ---------- */
  function initCursor() {
    if (!fine) return;
    const cur = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = $('.cursor__label');
    root.classList.add('has-cursor');
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
    const dx = gsap.quickSetter(dot, 'x', 'px'), dy = gsap.quickSetter(dot, 'y', 'px');
    const rx = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' });
    const ry = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' });

    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      cur.classList.remove('is-hidden');
    }, { passive: true });
    document.addEventListener('pointerleave', () => cur.classList.add('is-hidden'));
    window.addEventListener('pointerdown', () => cur.classList.add('is-down'));
    window.addEventListener('pointerup', () => cur.classList.remove('is-down'));

    // Над ссылками кольцо растёт, над [data-cursor] — показывает подпись
    let state = '', key = '';
    document.addEventListener('pointerover', (e) => {
      const el = e.target.closest('[data-cursor], a, button');
      const k = el && el.dataset.cursor ? el.dataset.cursor : '';
      const next = !el ? '' : k ? 'is-label' : 'is-link';
      if (next === state && k === key) return;
      cur.classList.remove('is-label', 'is-link');
      if (next) cur.classList.add(next);
      label.textContent = k ? I.t('cursor.' + k) : '';
      state = next; key = k;
    });
  }

  function initMagnetic() {
    // Заливка кнопки растёт из точки, где курсор вошёл, и уходит туда, где вышел
    $$('.btn, .hello').forEach((el) => {
      const set = (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--x', `${e.clientX - r.left}px`);
        el.style.setProperty('--y', `${e.clientY - r.top}px`);
      };
      el.addEventListener('pointerenter', set);
      el.addEventListener('pointerleave', set);
    });
    if (!fine) return;
    $$('[data-magnetic]').forEach((el) => {
      const k = parseFloat(el.dataset.magnetic) || 0.3;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.35)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.35)' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * k);
        yTo((e.clientY - r.top - r.height / 2) * k);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ---------- Шапка, меню, прогресс ---------- */
  let menuOpen = false;
  let menuTl = null;
  const header = $('.header');
  const burger = $('.burger');
  const menu = $('#menu');

  function initHeader() {
    const progress = $('.progress'), bar = $('.progress__bar'), num = $('.progress__num');
    const LEN = 2 * Math.PI * 21;
    let atFooter = false;   // в подвале своя кнопка «Наверх», кольцо там прячется
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        header.classList.toggle('is-hidden', self.direction > 0 && y > 240 && !menuOpen);
        progress.classList.toggle('is-on', y > 160 && !atFooter);
        bar.style.strokeDashoffset = (LEN * (1 - self.progress)).toFixed(2);
        num.textContent = Math.round(self.progress * 100);
      }
    });
    ScrollTrigger.create({
      trigger: '.footer__row', start: 'top bottom',
      onToggle: (self) => { atFooter = self.isActive; progress.classList.toggle('is-on', !atFooter && window.scrollY > 160); }
    });
    progress.addEventListener('click', () => scrollToTarget(0));
    $('[data-totop]').addEventListener('click', () => scrollToTarget(0));

    menuTl = gsap.timeline({ paused: true })
      .set(menu, { visibility: 'visible' })
      .fromTo(menu, { clipPath: 'circle(0% at calc(100% - 44px) 38px)' }, { clipPath: 'circle(150% at calc(100% - 44px) 38px)', duration: 0.9, ease: 'expo.inOut' })
      .from('.menu__nav a', { yPercent: 110, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06 }, '-=0.45')
      .from('.menu__foot', { y: 20, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5');

    burger.addEventListener('click', () => toggleMenu(!menuOpen));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) toggleMenu(false); });
  }

  function toggleMenu(open) {
    menuOpen = open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', I.t(open ? 'menu.close' : 'menu.open'));
    header.classList.toggle('is-menu', open);
    header.classList.remove('is-hidden');
    menu.inert = !open;
    if (open) { menuTl.timeScale(1).play(); lenis && lenis.stop(); }
    else { menuTl.timeScale(1.7).reverse(); lenis && lenis.start(); }
  }

  /* ---------- Языки: шторка, подмена текста, пересборка анимаций текста ---------- */
  let switching = false;
  function initLang() {
    const box = $('.lang'), pill = $('.lang__pill');
    const btns = $$('[data-lang]', box);
    const mark = (instant) => {
      btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === I.lang)));
      const b = btns.find((x) => x.dataset.lang === I.lang);
      if (b) gsap.to(pill, { x: b.offsetLeft, width: b.offsetWidth, duration: instant ? 0 : 0.6, ease: 'expo.out' });
    };
    btns.forEach((b) => b.addEventListener('click', () => switchLang(b.dataset.lang)));
    mark(true);
    I.onChange(() => mark(false));
    document.fonts && document.fonts.ready.then(() => mark(true));
  }

  function switchLang(next) {
    if (switching || next === I.lang) return;
    switching = true;
    const curtain = $('.curtain'), word = $('.curtain__word');
    word.textContent = '';
    gsap.timeline({ onComplete: () => { switching = false; } })
      .set(curtain, { visibility: 'visible', yPercent: 100 })
      .to(curtain, { yPercent: 0, duration: 0.7, ease: 'expo.inOut' })
      .to(word, { duration: 0.7, scrambleText: { text: I.t('lang.name', next), chars: 'ƏÜÖĞŞÇİ01', speed: 0.6 } }, '-=0.25')
      .add(() => {
        textCtx && textCtx.revert();
        I.set(next);
        setBadge();
        buildText();
        ScrollTrigger.refresh();
        measureHero();
        heroTl.play(0);
      })
      .to(curtain, { yPercent: -100, duration: 0.8, ease: 'expo.inOut' }, '+=0.2')
      .set(curtain, { visibility: 'hidden' });
  }

  /* ---------- Секции: тема, формация куба, скролл-сцены ---------- */
  function initScenes() {
    const sections = $$('main > [data-theme]');
    const meta = $('meta[name="theme-color"]');
    const indNum = $('.indicator__num'), indName = $('.indicator__name');
    let current = null;

    const activate = (sec, k) => {
      if (current === sec) return;
      current = sec;
      const theme = sec.dataset.theme;
      document.body.dataset.theme = theme;
      S.theme = theme;
      if (meta) meta.content = THEME_COLOR[theme];
      indNum.textContent = pad2(k);
      gsap.to(indName, { duration: 0.8, scrambleText: { text: I.t(sec.dataset.name), chars: 'lowerCase', speed: 0.7 }, overwrite: true });
    };
    sections.forEach((sec, k) => ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 55%',
      onEnter: () => activate(sec, k),
      onEnterBack: () => activate(sec, k)
    }));
    I.onChange(() => { if (current) indName.textContent = I.t(current.dataset.name); });

    // Номер формации куба — сумма прогрессов «въезда» каждой следующей секции: 0 … 6 без скачков
    const shapeST = sections.slice(1).map((sec) => ScrollTrigger.create({ trigger: sec, start: 'top 82%', end: 'top 22%' }));
    gsap.ticker.add(() => {
      let s = 0;
      for (const st of shapeST) s += st.progress;
      S.shape = s;
    });

    // Первый экран: при скролле у куба поворачиваются слои
    ScrollTrigger.create({
      trigger: '.hero', start: 'top top', end: 'bottom top',
      onUpdate: (self) => { S.twistScroll = self.progress * 3; }
    });

    initBands();
    initServices();
    initWork();
    initTools();
    initProcess();
    anchor($('.about__slot'), 'aboutY');      // на телефоне куб «Обо мне» стоит над текстом, а не поверх него
    anchor($('.contact__title'), 'endY');     // финальный куб держится у заголовка контактов

    // Счётчики
    $$('[data-count]').forEach((el) => {
      const to = +el.dataset.count;
      const o = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: () => gsap.to(o, { v: to, duration: 2.2, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v); } })
      });
    });

    // Появление блоков снизу
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%', once: true,
      onEnter: (els) => gsap.fromTo(els, { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, ease: 'expo.out', stagger: 0.09, overwrite: true })
    });

    // Большая кнопка в контактах разгоняет куб
    const hello = $('[data-hello]');
    hello.addEventListener('pointerenter', () => gsap.to(S, { boost: 1, duration: 0.6, overwrite: 'auto' }));
    hello.addEventListener('pointerleave', () => gsap.to(S, { boost: 0, duration: 1.4, overwrite: 'auto' }));

    // Подвал: буквы выезжают снизу; после этого работает CSS-ховер
    const brand = SplitText.create('.footer__brand', { type: 'chars', charsClass: 'char' });
    gsap.from(brand.chars, {
      yPercent: 100, duration: 1.2, ease: 'expo.out', stagger: 0.035, clearProps: 'transform',
      scrollTrigger: { trigger: '.footer', start: 'top 92%', toggleActions: 'play none none reverse' }
    });
  }

  // Ленты крест-накрест: бегут сами, от скролла ускоряются и меняют направление, наклон меняется скроллом
  function initBands() {
    const tracks = $$('[data-band]');
    const setters = tracks.map((tr) => gsap.quickSetter(tr, 'xPercent'));
    gsap.set('.band--a', { yPercent: -50, rotate: -5 });
    gsap.set('.band--b', { yPercent: -50, rotate: 4 });
    const tilt = { trigger: '.bands', start: 'top bottom', end: 'bottom top', scrub: true };
    gsap.to('.band--a', { rotate: 4, ease: 'none', scrollTrigger: { ...tilt } });
    gsap.to('.band--b', { rotate: -5, ease: 'none', scrollTrigger: { ...tilt } });

    let pos = 0, speed = 1;
    gsap.ticker.add((time, dt) => {
      const target = (S.vel < -20 ? -1 : 1) * (1 + Math.min(Math.abs(S.vel) / 220, 9));
      speed += (target - speed) * 0.08;
      pos += ((dt / 1000) * speed) / 38;          // 38 с — полный круг в покое
      const f = ((pos % 1) + 1) % 1;
      setters.forEach((set, i) => set(+tracks[i].dataset.band > 0 ? -50 * f : -50 * (1 - f)));
    });
  }

  // Услуги: коробка из четырёх граней, поворот на 90° за каждую треть секции, с паузами на гранях
  function initServices() {
    const rot = $('.box__rot'), faces = $$('.face'), dots = $$('.dots i'), count = $('.services__count b');
    let target = 0, angle = 0, on = false, idx = -1;
    ScrollTrigger.create({
      trigger: '.services', start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => {
        S.services = self.progress;
        const x = self.progress * 3;
        const i = Math.min(Math.floor(x), 2);
        target = 90 * (i + smooth(clamp((x - i - 0.18) / 0.64, 0, 1)));
      }
    });
    ScrollTrigger.create({ trigger: '.services', start: 'top bottom', end: 'bottom top', onToggle: (self) => { on = self.isActive; } });
    gsap.ticker.add((time, dt) => {
      if (!on && Math.abs(target - angle) < 0.01) return;
      angle += (target - angle) * (1 - Math.exp(-(dt / 1000) * 7));
      rot.style.setProperty('--ry', (-angle).toFixed(2));
      faces.forEach((f, i) => {
        const a = ((i * 90 - angle) * Math.PI) / 180;
        f.style.setProperty('--shade', (1 - Math.max(Math.cos(a), 0)).toFixed(3));
      });
      const n = clamp(Math.round(angle / 90), 0, 3);
      if (n !== idx) {
        idx = n;
        dots.forEach((d, k) => d.classList.toggle('is-on', k === n));
        count.textContent = pad2(n + 1);
      }
    });
  }

  // Работы: высота секции = длина ленты; вертикальный скролл двигает ленту влево
  let workTween = null;
  function initWork() {
    const work = $('.work'), track = $('.work__track'), barFill = $('.work__bar i');
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const size = () => { work.style.height = `${dist() + window.innerHeight}px`; };
    size();
    ScrollTrigger.addEventListener('refreshInit', size);

    let on = false;
    workTween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: work, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true,
        onUpdate: (self) => { S.work = self.progress; barFill.style.transform = `scaleX(${self.progress})`; },
        onToggle: (self) => { on = self.isActive; }
      }
    });

    // Карточки чуть наклоняются от скорости и сами «проявляются», когда въезжают в кадр
    const cards = $$('.card');
    const skew = gsap.quickTo(cards, 'skewX', { duration: 0.6, ease: 'power3' });
    gsap.ticker.add(() => { if (on) skew(clamp(-S.vel / 320, -6, 6)); });

    cards.forEach((card) => {
      const media = $('.card__media', card), img = $('img', card);
      const st = () => ({ trigger: card, containerAnimation: workTween, start: 'left 88%', toggleActions: 'play none none reverse' });
      if (media) gsap.from(media, { clipPath: 'inset(0% 0% 0% 100%)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: st() });
      gsap.from(card.querySelectorAll('.card__body > *, .card--cta > *'), { x: 70, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.07, scrollTrigger: st() });
      if (img) gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: workTween, start: 'left right', end: 'right left', scrub: true } });
    });
    gsap.from('.work__hint, .work__sub', { y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: work, start: 'top 60%', toggleActions: 'play none none reverse' } });
  }

  // Формация куба встаёт у элемента страницы и едет вместе с ним:
  // сообщаем кубу, где на экране центр элемента (в долях высоты экрана)
  function anchor(el, key) {
    let center = null;
    const measure = () => {
      const r = el.getBoundingClientRect();
      center = r.height ? r.top + window.scrollY + r.height / 2 : null;   // элемент скрыт — формация стоит на своём месте
    };
    measure();
    ScrollTrigger.addEventListener('refresh', measure);
    gsap.ticker.add(() => { S[key] = center === null ? undefined : (center - window.scrollY) / window.innerHeight; });
  }

  // Инструменты: сфера тегов крутится, только пока секция на экране.
  // Кубу передаём, где центр сферы и какого она размера, — шестерни встают по бокам от неё
  function initTools() {
    const el = $('[data-sphere]');
    const sphere = TagSphere.create(el, C.tools);
    anchor(el, 'toolsY');
    const size = () => { S.toolsR = el.offsetWidth / 2 / window.innerHeight; };   // offsetWidth — без scale из анимации появления
    size();
    ScrollTrigger.addEventListener('refresh', size);
    ScrollTrigger.create({ trigger: '.tools', start: 'top bottom', end: 'bottom top', onToggle: (self) => sphere.setActive(self.isActive) });
    gsap.ticker.add((time, dt) => sphere.tick(Math.min(dt / 1000, 0.05), S.vel));
    gsap.from('.sphere', { scale: 0.4, rotate: -40, autoAlpha: 0, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.sphere', start: 'top 85%', toggleActions: 'play none none reverse' } });
    window.addEventListener('resize', () => sphere.measure());
  }

  // Процесс: линия заполняется скроллом, точка едет по ней, шаги «наливаются» цветом
  function initProcess() {
    const steps = $('.steps');
    gsap.fromTo('.steps__fill', { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: {
        trigger: steps, start: 'top 60%', end: 'bottom 60%', scrub: true,
        onUpdate: (self) => { steps.style.setProperty('--p', self.progress.toFixed(4)); S.process = self.progress; }
      }
    });
    $$('.step').forEach((st) => ScrollTrigger.create({
      trigger: st, start: 'top 62%',
      onEnter: () => st.classList.add('is-on'),
      onLeaveBack: () => st.classList.remove('is-on')
    }));
  }

  /* ---------- Анимации текста: пересобираются при смене языка ---------- */
  let textCtx = null;
  let heroTl = null;
  function buildText() {
    textCtx = gsap.context(() => {
      const hero = SplitText.create('.hero__line', { type: 'lines,chars', mask: 'lines' });
      const lead = SplitText.create('.hero__lead', { type: 'lines', mask: 'lines' });
      heroTl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
        .from(hero.chars, { yPercent: 120, rotate: 12, duration: 1.4, stagger: 0.022, transformOrigin: '0% 100%' }, 0)
        .from(lead.lines, { yPercent: 105, duration: 1.1, stagger: 0.08 }, 0.35)
        .from('.hero__top > *', { y: 18, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 0.2)
        .from('.hero .btn', { scale: 0.4, autoAlpha: 0, duration: 1.1, ease: 'back.out(1.7)' }, 0.6)
        .from('.badge', { scale: 0, rotate: -220, duration: 1.6, ease: 'back.out(1.4)' }, 0.5);

      // Заголовки секций: буквы поднимаются из-под маски строки
      $$('[data-split]').forEach((el) => {
        const sp = SplitText.create(el, { type: 'lines,words,chars', mask: 'lines' });
        gsap.from(sp.chars, {
          yPercent: 115, rotate: 8, duration: 1.2, ease: 'expo.out', stagger: 0.02,
          scrollTrigger: { trigger: el.closest('.services, .work') || el, start: 'top 82%', toggleActions: 'play none none reverse' }
        });
      });

      // «Обо мне»: слова проявляются по мере скролла
      const about = SplitText.create('.about__text', { type: 'words' });
      gsap.fromTo(about.words, { opacity: 0.13 }, {
        opacity: 1, ease: 'none', stagger: 0.08,
        scrollTrigger: { trigger: '.about__text', start: 'top 80%', end: 'bottom 50%', scrub: true }
      });

      // Контакты: буквы расходятся от центра, вокруг акцентного слова рисуется обводка
      const ct = SplitText.create('.contact__title', { type: 'lines,chars', mask: 'lines' });
      gsap.from(ct.chars, {
        yPercent: 120, duration: 1.3, ease: 'expo.out', stagger: { each: 0.02, from: 'center' },
        scrollTrigger: { trigger: '.contact__title', start: 'top 82%', toggleActions: 'play none none reverse' }
      });
      const em = $('.contact__title em');
      if (em) {
        em.insertAdjacentHTML('beforeend', ICON.scribble);
        gsap.fromTo(em.querySelector('.scribble path'), { drawSVG: '0%' }, {
          drawSVG: '100%', duration: 1.5, ease: 'power2.inOut', delay: 0.4,
          scrollTrigger: { trigger: '.contact__title', start: 'top 70%', toggleActions: 'play none none reverse' }
        });
      }
    });
  }

  // Где кончается заголовок первого экрана — куб встаёт правее (на десктопе)
  function measureHero() {
    let right = 0;
    $$('.hero__line').forEach((l) => { right = Math.max(right, l.getBoundingClientRect().right); });
    S.heroRight = right / window.innerWidth;
    // На телефоне куб встаёт в промежуток между статусом и заголовком — меряем его (в долях высоты экрана)
    const top = $('.hero__top').getBoundingClientRect().bottom + window.scrollY;
    const bottom = $('.hero__title').getBoundingClientRect().top + window.scrollY;
    S.heroGapY = (top + bottom) / 2 / window.innerHeight;
    S.heroGapH = Math.max(bottom - top, 0) / window.innerHeight;
    window.dispatchEvent(new Event('scene:layout'));
  }

  /* ---------- Мелочи: часы, роли ---------- */
  function initClock() {
    const els = $$('[data-clock]');
    let fmt;
    try { fmt = new Intl.DateTimeFormat('en-GB', { timeZone: C.timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }); } catch (e) { fmt = null; }
    const tick = () => {
      const s = fmt ? fmt.format(new Date()) : new Date().toTimeString().slice(0, 8);
      els.forEach((el) => { el.textContent = s; });
    };
    tick();
    setInterval(tick, 1000);
  }

  function initRoles() {
    const el = $('.hero__role');
    let i = 0;
    el.textContent = I.t('hero.roles')[0];
    const next = () => {
      const roles = I.t('hero.roles');
      i = (i + 1) % roles.length;
      gsap.to(el, { duration: 1.2, scrambleText: { text: roles[i], chars: '01</>_#*', speed: 0.5 } });
      gsap.delayedCall(3.4, next);
    };
    gsap.delayedCall(3.4, next);
    I.onChange(() => { i = 0; gsap.killTweensOf(el); el.textContent = I.t('hero.roles')[0]; });
  }

  /* ---------- Прелоадер ---------- */
  function startCounter() {
    const num = $('[data-loader-num]'), bar = $('[data-loader-bar]');
    const o = { v: 0 };
    return new Promise((resolve) => {
      gsap.to(o, {
        v: 100, duration: reduce ? 0.3 : 1.9, ease: 'power2.inOut',
        onUpdate: () => { num.textContent = Math.round(o.v); bar.style.transform = `scaleX(${o.v / 100})`; },
        onComplete: resolve
      });
    });
  }

  function exitLoader() {
    const loader = $('.loader');
    gsap.timeline({ onComplete: () => loader.remove() })
      .to('.loader__body', { yPercent: -40, autoAlpha: 0, duration: 0.7, ease: 'power3.in' })
      .to('.loader__cols i', { yPercent: -100, duration: 1.1, ease: 'expo.inOut', stagger: 0.07 }, 0.45)
      .add(() => {
        root.classList.remove('is-loading');
        lenis && lenis.start();
        heroTl.play(0);
        gsap.to(S, { intro: 1, duration: 2.6, ease: 'power2.out' });
        gsap.to(S, { twistIntro: 1, duration: 1.3, ease: 'power2.inOut', delay: 2 });
      }, 0.8);
  }

  /* ---------- Запуск ---------- */
  render();
  I.apply();
  setBadge();
  initScroll();
  initCursor();
  initMagnetic();
  initHeader();
  initLang();
  initScenes();
  initClock();
  initRoles();
  I.onChange(setBadge);

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const fontsReady = Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), wait(3500)]);
  const sceneReady = new Promise((resolve) => {
    if (S.ready) return resolve();
    window.addEventListener('scene:ready', resolve, { once: true });
    setTimeout(resolve, 7000);
  });
  const counted = startCounter();

  fontsReady.then(() => {
    buildText();
    ScrollTrigger.refresh();
    measureHero();
    ScrollTrigger.addEventListener('refresh', measureHero);
    return Promise.all([sceneReady, counted]);
  }).then(exitLoader);
})();
