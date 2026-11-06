/* Фон страницы: модульный куб из 27 блоков (Three.js).
   У каждой секции своя «формация» блоков: куб, у которого по скроллу поворачиваются слои, разлёт,
   кольцо, волна, кольца-шестерни, спиральная лестница и снова куб, который сам себя крутит. app.js пишет
   в window.SCENE номер формации (дробный), скорость скролла, указатель и тему; здесь каждый кадр
   блоки смешиваются между двумя соседними формациями — с задержкой по блокам, дугой и кувырком. */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const S = window.SCENE || (window.SCENE = { shape: 0, intro: 1, vel: 0, px: 0, py: 0, theme: 'ink' });
const canvas = document.querySelector('.gl');
const coarse = matchMedia('(pointer: coarse)').matches;

const TAU = Math.PI * 2;
const FOV = 35;
const CAM_Z = 16;
const N = 27;
const DELAY = 0.32;               // разброс задержек блоков при переходе между формациями

// Цвета блоков под тему секции (база и пять акцентных блоков)
const THEMES = {
  ink:   { base: '#ebe5da', accent: '#ff5b2e' },
  paper: { base: '#1d1d23', accent: '#ff4d1f' },
  blue:  { base: '#f5f4ff', accent: '#ffd84a' },
  coral: { base: '#f7f0e6', accent: '#1b120e' }
};

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const outExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt));

// Детерминированный ГПСЧ: разлёт и кувырки одинаковые при каждой загрузке
function mulberry(seed) {
  return () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ready() {
  if (S.ready) return;
  S.ready = true;
  canvas && canvas.classList.add('is-ready');
  window.dispatchEvent(new Event('scene:ready'));
}

try {
  start();
} catch (err) {
  console.warn('[cube] WebGL недоступен, фон отключён:', err);
  canvas && canvas.remove();
  ready();
}

function start() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.75 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.z = CAM_Z;

  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(6, 9, 10);
  const rim = new THREE.DirectionalLight(0xffffff, 0.7);
  rim.position.set(-9, -4, -6);
  scene.add(key, rim);

  const world = new THREE.Group();
  scene.add(world);

  /* ---------- Блоки ---------- */
  const AX = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) };
  const HOME = [];
  for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) HOME.push(new THREE.Vector3(x, y, z));
  const idx = (x, y, z) => (x + 1) * 9 + (y + 1) * 3 + (z + 1);
  const ACCENT = new Set([idx(1, 1, 1), idx(-1, 0, 1), idx(0, -1, 1), idx(1, 0, -1), idx(-1, 1, -1)]);

  const geo = new RoundedBoxGeometry(0.9, 0.9, 0.9, 4, 0.13);
  const mat = {
    base: new THREE.MeshPhysicalMaterial({ color: THEMES.ink.base, roughness: 0.34, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.18 }),
    accent: new THREE.MeshPhysicalMaterial({ color: THEMES.ink.accent, roughness: 0.3, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.14 })
  };
  const meshes = HOME.map((h, i) => {
    const m = new THREE.Mesh(geo, ACCENT.has(i) ? mat.accent : mat.base);
    world.add(m);
    return m;
  });

  // Случайные, но постоянные параметры каждого блока
  const rnd = mulberry(1907);
  const R = HOME.map((h) => ({
    delay: DELAY * (0.55 * rnd() + 0.45 * (h.y + 1) / 2),
    axis: new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(),
    spin: 0.35 + rnd() * 0.7,
    arc: (rnd() - 0.5) * 2,
    lift: (rnd() - 0.5) * 1.6,
    from: new THREE.Vector3(),
    fromQ: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(), rnd() * TAU),
    seed: [rnd(), rnd(), rnd()]
  }));

  const slot = () => HOME.map(() => ({ p: new THREE.Vector3(), q: new THREE.Quaternion(), s: 1 }));
  const A = slot(), B = slot();

  /* ---------- Размеры и раскладка ---------- */
  const view = { w: 0, h: 0, hw: 1, hh: 1, mobile: false };
  const L = {};

  function layout() {
    const { hw, hh } = view;
    if (view.mobile) {
      // Куб первого экрана — в промежутке между статусом и заголовком, по его высоте (меряет app.js)
      const gh = (S.heroGapH || 0.3) * 2 * hh;
      L.hero = { x: 0, y: S.heroGapY === undefined ? hh * 0.34 : (0.5 - S.heroGapY) * 2 * hh, s: clamp(gh * 0.22, hw * 0.14, hw * 0.27) };
      L.about = { x: 0, y: hh * 0.62, s: hw * 0.2 };
      L.ring = { x: 0, y: -hh * 0.02, r: hw * 0.98, cs: 0.42, tilt: 0.52 };
      L.floor = { y: -hh * 0.8, sx: (hw * 2.6) / 9, sz: 0.8, cs: 0.48, tilt: 0.7 };
      L.helix = { x: -hw * 0.813, r: hw * 0.12, h: (hh * 1.9) / 26, cs: 0.26, tilt: 0 };   // вьётся вокруг линии шагов в левом поле
      L.end = { x: 0, y: 0, s: hw * 0.26 };
    } else {
      // Куб первого экрана встаёт в свободное место справа от заголовка
      const right = clamp(S.heroRight || 0.55, 0.4, 0.74);
      const free = (1 - right) * 2 * hw;
      L.hero = { x: hw - free * 0.5, y: -hh * 0.02, s: Math.min(hh * 0.25, free / 6.4) };
      L.about = { x: hw * 0.64, y: hh * 0.02, s: Math.min(hh * 0.18, hw * 0.1) };
      L.ring = { x: 0, y: hh * 0.02, r: Math.min(hw * 0.7, hh * 1.4), cs: 0.72, tilt: 0.3 };
      L.floor = { y: -hh * 0.97, sx: (hw * 2.5) / 9, sz: 1.1, cs: 0.72, tilt: 0.55 };
      L.helix = { x: hw * 0.58, r: Math.min(hh * 0.42, hw * 0.24), h: (hh * 1.84) / 26, cs: 0.72, tilt: -0.1 };
      L.end = { x: 0, y: hh * 0.02, s: hh * 0.22 };
    }
    // Откуда блоки прилетают на старте
    const r2 = mulberry(77);
    R.forEach((r) => r.from.set((r2() - 0.5) * hw * 3, (r2() - 0.5) * hh * 3, -14 + r2() * 16));
  }

  function resize() {
    // В свёрнутой вкладке размеры бывают нулевыми — не даём им сломать раскладку
    const w = canvas.clientWidth || window.innerWidth || 1;
    const h = canvas.clientHeight || window.innerHeight || 1;
    if (w === view.w && h === view.h && L.hero) return;
    view.w = w; view.h = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    view.hh = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAM_Z;
    view.hw = view.hh * camera.aspect;
    view.mobile = camera.aspect < 0.8;
    layout();
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('scene:layout', layout);

  /* ---------- Формации ---------- */
  let spin = 0;                     // общий угол вращения: время + скорость скролла
  const eul = new THREE.Euler();
  const fq = new THREE.Quaternion(), mq = new THREE.Quaternion(), tq = new THREE.Quaternion();

  // Переводит формацию из своей системы в мировую: масштаб, поворот, сдвиг
  // Где на экране элемент страницы (app.js пишет S[key] в долях высоты экрана) → y в сцене, со сглаживанием
  const anchors = {};
  function anchorY(key, dt) {
    if (S[key] === undefined) return null;
    const target = (0.5 - S[key]) * 2 * view.hh;
    const prev = anchors[key];
    return (anchors[key] = dt && prev !== undefined ? damp(prev, target, 9, dt) : target);
  }

  function frame(out, x, y, z, rx, ry, rz, sc) {
    eul.set(rx, ry, rz, 'XYZ');
    fq.setFromEuler(eul);
    for (let i = 0; i < N; i++) {
      const o = out[i];
      o.p.multiplyScalar(sc).applyQuaternion(fq);
      o.p.x += x; o.p.y += y; o.p.z += z;
      o.q.premultiply(fq);
      o.s *= sc;
    }
  }

  // Куб с поворотами слоёв. tw — сколько ходов сделано (дробная часть — ход в процессе)
  const MOVES = [['y', 1, 1], ['x', 1, -1], ['z', 1, 1], ['y', -1, -1], ['x', -1, 1], ['z', -1, -1], ['y', 0, 1], ['x', 0, -1]];
  function twisted(out, tw) {
    for (let i = 0; i < N; i++) { out[i].p.copy(HOME[i]); out[i].q.identity(); out[i].s = 1; }
    for (let m = 0; m < MOVES.length; m++) {
      const f = tw - m;
      if (f <= 0) break;
      const [ax, layer, dir] = MOVES[m];
      mq.setFromAxisAngle(AX[ax], (dir * inOut(Math.min(f, 1)) * Math.PI) / 2);
      for (let i = 0; i < N; i++) {
        const o = out[i];
        if (Math.round(o.p[ax]) === layer) { o.p.applyQuaternion(mq); o.q.premultiply(mq); }
      }
    }
  }

  // 0 · Первый экран: куб, слои поворачиваются от скролла
  function fHero(out, t) {
    twisted(out, (S.twistIntro || 0) + (S.twistScroll || 0));
    const l = L.hero;
    frame(out, l.x, l.y + Math.sin(t * 0.9) * 0.12, 0, 0.52, spin + 0.65, 0.08, l.s);
  }

  // 1 · Обо мне: блоки разлетаются в решётку и кувыркаются каждый сам по себе
  function fAbout(out, t, dt) {
    const g = 1.8 + Math.sin(t * 0.7) * 0.14;
    for (let i = 0; i < N; i++) {
      const o = out[i], r = R[i];
      o.p.copy(HOME[i]).multiplyScalar(g);
      o.q.setFromAxisAngle(r.axis, t * r.spin);
      o.s = 0.8;
    }
    // На телефоне сбоку места нет: куб встаёт в пустое место над текстом и уезжает вместе с секцией
    const l = L.about;
    const y = view.mobile ? anchorY('aboutY', dt) ?? l.y : l.y;
    frame(out, l.x, y, 0, 0.42 + Math.sin(t * 0.3) * 0.1, spin * 0.7, 0.2, l.s);
  }

  // 2 · Услуги: наклонное кольцо вокруг коробки, крутится от скролла секции
  function fRing(out, t) {
    const l = L.ring;
    const turn = spin * 0.35 + (S.services || 0) * Math.PI;
    for (let i = 0; i < N; i++) {
      const o = out[i];
      const a = (i / N) * TAU + turn;
      o.p.set(Math.cos(a) * l.r, Math.sin(a * 3 + t) * 0.2, Math.sin(a) * l.r);
      tq.setFromAxisAngle(AX.x, t * 0.8 + i * 0.7);
      o.q.setFromAxisAngle(AX.y, -a).multiply(tq);
      o.s = l.cs;
    }
    frame(out, l.x, l.y, 0, l.tilt, 0, 0.06, 1);
  }

  // 3 · Работы: волна из трёх рядов внизу, едет вместе с лентой проектов
  function fFloor(out, t) {
    const l = L.floor, W = l.sx * 9;
    const shift = (S.work || 0) * W * 1.5;
    for (let i = 0; i < N; i++) {
      const o = out[i];
      const c = i % 9, row = (i / 9) | 0;
      let x = (c - 4) * l.sx + (row % 2) * l.sx * 0.5 - shift;
      x = (((x + W / 2) % W) + W) % W - W / 2;
      const z = (row - 1) * l.sz;
      o.p.set(x, Math.sin(x * 0.45 + t * 1.8 + row * 1.1) * 0.6, z);
      eul.set(Math.sin(t * 1.3 + i) * 0.35, x * 0.12, Math.cos(t + i) * 0.25, 'XYZ');
      o.q.setFromEuler(eul);
      o.s = l.cs;
    }
    frame(out, 0, l.y, 0, l.tilt, 0, 0, 1);
  }

  // 4 · Инструменты: две шестерни по бокам от сферы тегов, крутятся навстречу друг другу.
  // Если сбоку тесно (телефон, узкое окно) — уходят в пустые нижние углы сферы, наполовину за край экрана.
  // Центр и размер сферы берутся со страницы (app.js пишет toolsY/toolsR)
  const ge = new THREE.Euler(), gq = new THREE.Quaternion();
  function fGears(out, t, dt) {
    const { hh, hw } = view;
    const toolsY = anchorY('toolsY', dt) ?? 0;
    const half = Math.max(S.toolsR || 0.36, 0.1) * 2 * hh;   // половина ширины сферы
    const side = hw - half;                                    // свободное место сбоку от неё
    let r, gx, yl, yr;
    if (side > half * 0.8) {
      r = Math.min(side * 0.32, hh * 0.32); gx = half + side * 0.45; yl = -r * 0.35; yr = r * 0.35;
    } else {
      r = Math.min(half * 0.4, hw * 0.38); gx = Math.min(hw, half * 1.15); yl = yr = -half * 1.05;
    }
    const turn = spin * 0.5 + t * 0.15;
    for (let i = 0; i < N; i++) {
      const o = out[i];
      const left = i < 13;
      const n = left ? 13 : 14, j = left ? i : i - 13, dir = left ? 1 : -1;
      const a = (j / n) * TAU + dir * turn;
      ge.set(0.2, dir * 0.5, 0);           // шестерня развёрнута к сфере, чтобы были видны грани блоков
      gq.setFromEuler(ge);
      o.p.set(Math.cos(a) * r, Math.sin(a) * r, 0).applyQuaternion(gq);
      o.p.x -= dir * gx;
      o.p.y += toolsY + (left ? yl : yr);
      o.q.setFromAxisAngle(AX.z, a).premultiply(gq);
      o.s = r * 0.34;
    }
  }

  // 5 · Процесс: спиральная лестница, закручивается по мере прохождения шагов
  function fHelix(out, t) {
    const l = L.helix;
    const turn = spin * 0.4 + (S.process || 0) * TAU * 0.75;
    for (let i = 0; i < N; i++) {
      const o = out[i];
      const a = i * 0.55 + turn;
      o.p.set(Math.cos(a) * l.r, (i - 13) * l.h, Math.sin(a) * l.r);
      o.q.setFromAxisAngle(AX.y, -a);
      o.s = l.cs;
    }
    frame(out, l.x, 0, 0, 0.12, 0, l.tilt, 1);
  }

  // 6 · Контакты: снова куб, сам делает случайные ходы (наведение на кнопку ускоряет)
  const live = HOME.map((h) => ({ p: h.clone(), q: new THREE.Quaternion() }));
  const rndMove = mulberry(42);
  let move = null, last = null, wait = 0.4;
  function startMove() {
    let ax, layer;
    do {
      ax = ['x', 'y', 'z'][(rndMove() * 3) | 0];
      layer = ((rndMove() * 3) | 0) - 1;
    } while (last && last.ax === ax && last.layer === layer);
    const members = [];
    for (let i = 0; i < N; i++) if (Math.round(live[i].p[ax]) === layer) members.push(i);
    move = { ax, layer, dir: rndMove() < 0.5 ? 1 : -1, t: 0, members };
    last = move;
  }
  function stepLive(dt) {
    const speed = 1 + (S.boost || 0) * 1.8;
    if (!move) {
      wait -= dt * speed;
      if (wait <= 0) startMove();
      return;
    }
    move.t += (dt * speed) / 0.62;
    if (move.t < 1) return;
    mq.setFromAxisAngle(AX[move.ax], (move.dir * Math.PI) / 2);
    for (const i of move.members) {
      const o = live[i];
      o.p.applyQuaternion(mq);
      o.p.set(Math.round(o.p.x), Math.round(o.p.y), Math.round(o.p.z));
      o.q.premultiply(mq).normalize();
    }
    move = null;
    wait = 0.42;
  }
  function fEnd(out, t, dt) {
    for (let i = 0; i < N; i++) { out[i].p.copy(live[i].p); out[i].q.copy(live[i].q); out[i].s = 1; }
    if (move) {
      mq.setFromAxisAngle(AX[move.ax], (move.dir * inOut(Math.min(move.t, 1)) * Math.PI) / 2);
      for (const i of move.members) { out[i].p.applyQuaternion(mq); out[i].q.premultiply(mq); }
    }
    // Куб держится у заголовка контактов и уезжает вместе с ним (app.js пишет endY); l.y — сдвиг от заголовка
    const l = L.end;
    const y = (anchorY('endY', dt) ?? 0) + l.y;
    frame(out, l.x, y + Math.sin(t * 0.8) * 0.1, 0, 0.5, spin * 0.9 + 0.6, 0.12, l.s);
  }

  const FORMS = [fHero, fAbout, fRing, fFloor, fGears, fHelix, fEnd];
  const LAST = FORMS.length - 1;

  /* ---------- Тема ---------- */
  let theme = null;
  function setTheme(name) {
    theme = name;
    const th = THEMES[name] || THEMES.ink;
    const cb = new THREE.Color(th.base), ca = new THREE.Color(th.accent);
    gsap.to(mat.base.color, { r: cb.r, g: cb.g, b: cb.b, duration: 0.9, ease: 'power2.out', overwrite: true });
    gsap.to(mat.accent.color, { r: ca.r, g: ca.g, b: ca.b, duration: 0.9, ease: 'power2.out', overwrite: true });
  }

  /* ---------- Кадр ---------- */
  let shape = S.shape || 0;
  function tick(time, dtMs) {
    const dt = Math.min(dtMs / 1000, 1 / 20);
    const t = time;
    if (S.theme !== theme) setTheme(S.theme);

    // Скролл вниз разгоняет вращение, скролл вверх — крутит назад
    spin += dt * (0.22 + clamp((S.vel || 0) * 0.0011, -3, 3) + (S.boost || 0) * 1.4);
    shape = damp(shape, S.shape || 0, 3, dt);
    if (Math.abs(shape - S.shape) < 1e-4) shape = S.shape;
    if (shape > 4.5) stepLive(dt);

    const a = Math.min(Math.floor(shape), LAST);
    const f = shape - a;
    const b = Math.min(a + 1, LAST);
    const mixing = f > 1e-4 && b !== a;
    FORMS[a](A, t, dt);
    if (mixing) FORMS[b](B, t, dt);
    const intro = S.intro === undefined ? 1 : S.intro;

    for (let i = 0; i < N; i++) {
      const m = meshes[i], r = R[i], oa = A[i];
      let s;
      if (mixing) {
        const ob = B[i];
        const k = inOut(clamp((f - r.delay) / (1 - DELAY), 0, 1));
        const arc = Math.sin(Math.PI * k);
        m.position.lerpVectors(oa.p, ob.p, k);
        m.position.z += arc * r.arc * 2.6;
        m.position.y += arc * r.lift;
        m.quaternion.slerpQuaternions(oa.q, ob.q, k);
        if (arc > 1e-3) { tq.setFromAxisAngle(r.axis, arc * Math.PI * 0.9); m.quaternion.multiply(tq); }
        s = lerp(oa.s, ob.s, k);
      } else {
        m.position.copy(oa.p);
        m.quaternion.copy(oa.q);
        s = oa.s;
      }
      if (intro < 1) {
        const k = outExpo(clamp((intro - r.delay * 1.1) / 0.6, 0, 1));
        m.position.lerpVectors(r.from, m.position, k);
        tq.copy(r.fromQ).slerp(m.quaternion, k);
        m.quaternion.copy(tq);
        s *= clamp(k * 1.5, 0, 1);
      }
      m.scale.setScalar(Math.max(s, 1e-4));
    }

    // Лёгкий наклон всей сцены за указателем
    world.rotation.x = damp(world.rotation.x, (S.py || 0) * 0.12, 2.2, dt);
    world.rotation.y = damp(world.rotation.y, (S.px || 0) * 0.2, 2.2, dt);

    renderer.render(scene, camera);
  }

  setTheme(S.theme || 'ink');
  renderer.compile(scene, camera);
  tick(0, 16);
  ready();
  if (window.gsap) gsap.ticker.add(tick);
  else renderer.setAnimationLoop((ms) => tick(ms / 1000, 16));
}
