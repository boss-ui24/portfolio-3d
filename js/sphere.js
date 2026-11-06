/* Сфера инструментов: теги лежат на сфере Фибоначчи и вращаются сами, от скролла и перетаскиванием.
   Без CSS 3D: каждый кадр точки поворачиваются в JS и проецируются в 2D (сдвиг, масштаб, прозрачность). */
window.TagSphere = (() => {
  'use strict';

  function create(el, items) {
    const N = items.length;
    const tags = items.map((it) => {
      const t = document.createElement('span');
      t.className = 'tag' + (it.kind ? ' tag--' + it.kind : '');
      t.textContent = it.name;
      el.appendChild(t);
      return t;
    });
    const pts = items.map((_, i) => {
      const k = i + 0.5;
      const phi = Math.acos(1 - (2 * k) / N);
      const th = Math.PI * (1 + Math.sqrt(5)) * k;
      return [Math.cos(th) * Math.sin(phi), Math.cos(phi), Math.sin(th) * Math.sin(phi)];
    });

    let yaw = 0, pitch = -0.35;     // текущий поворот
    let vYaw = 0.4, vPitch = 0;     // угловая скорость, рад/с
    let R = 0, active = false, drag = null;

    const measure = () => { R = el.clientWidth * 0.4; };
    measure();
    window.addEventListener('resize', measure);

    el.addEventListener('pointerdown', (e) => {
      drag = { x: e.clientX, y: e.clientY, t: performance.now() };
      el.setPointerCapture(e.pointerId);
      el.classList.add('is-drag');
    });
    el.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const now = performance.now();
      const dt = Math.max(now - drag.t, 8) / 1000;
      const ax = (e.clientX - drag.x) * 0.008, ay = (e.clientY - drag.y) * 0.008;
      yaw += ax; pitch -= ay;
      vYaw = ax / dt; vPitch = -ay / dt;        // скорость броска
      drag.x = e.clientX; drag.y = e.clientY; drag.t = now;
    });
    const end = () => { if (drag) { drag = null; el.classList.remove('is-drag'); } };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);

    function tick(dt, vel) {
      if (!active || !R) return;
      if (!drag) {
        // После броска скорость плавно возвращается к базовой; скролл вниз крутит быстрее, вверх — назад
        const base = 0.4 + Math.max(-2.5, Math.min(2.5, vel * 0.0014));
        const k = Math.min(dt * 1.6, 1);
        vYaw += (base - vYaw) * k;
        vPitch += (0 - vPitch) * k;
        yaw += vYaw * dt;
        pitch += vPitch * dt;
      }
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      for (let i = 0; i < N; i++) {
        const [x0, y0, z0] = pts[i];
        const x1 = x0 * cy + z0 * sy, z1 = -x0 * sy + z0 * cy;
        const y2 = y0 * cp - z1 * sp, z2 = y0 * sp + z1 * cp;
        const depth = (z2 + 1) / 2;               // 0 — сзади, 1 — спереди
        const s = 0.5 + depth * 0.62;
        const t = tags[i];
        t.style.transform = `translate(-50%, -50%) translate3d(${(x1 * R).toFixed(1)}px, ${(y2 * R).toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
        t.style.opacity = (0.22 + depth * 0.78).toFixed(3);
        t.style.zIndex = String(Math.round(depth * 100));
      }
    }

    return {
      tick,
      measure,
      setActive(v) { active = v; if (v) measure(); }
    };
  }

  return { create };
})();
