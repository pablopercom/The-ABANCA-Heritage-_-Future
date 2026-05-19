/* ─────────────────────────────────────────────────────────
   ABANCA · The History — Editorial Atlántico
   Sistema de interacciones compartido
   ───────────────────────────────────────────────────────── */

(() => {
  'use strict';

  document.documentElement.classList.add('js-ready');

  // ─── Curtain reveal ─────────────────────────────────────
  // Curtain reveal + hero entrance — fire on DOMContentLoaded so we don't
  // wait for slow Unsplash images. Window 'load' still does final niceties.
  function bootReveal() {
    const curtain = document.querySelector('.curtain');
    if (curtain) {
      setTimeout(() => curtain.classList.add('lift'), 200);
      setTimeout(() => { curtain.remove(); document.body.classList.add('curtain-done'); }, 2200);
    } else {
      document.body.classList.add('curtain-done');
    }
    document.querySelectorAll('[data-hero-in]').forEach(el => el.classList.add('in'));
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootReveal);
  } else {
    bootReveal();
  }

  // ─── Custom cursor with magnetic attraction ────────────
  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;
  if (!isTouch) {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let dx = mx, dy = my;          // dot pos (fast)
    let rx = mx, ry = my;          // ring pos (lerped)
    let magnet = null;

    window.addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
    });
    window.addEventListener('pointerdown', () => ring.classList.add('click'));
    window.addEventListener('pointerup', () => ring.classList.remove('click'));

    const magnetSel = 'a, button, [data-magnet], .btn, nav.top .menu-trigger';
    document.addEventListener('pointerover', (e) => {
      const el = e.target.closest(magnetSel);
      if (el) {
        magnet = el;
        ring.classList.add('magnet');
      }
    });
    document.addEventListener('pointerout', (e) => {
      const el = e.target.closest(magnetSel);
      if (el === magnet) {
        magnet = null;
        ring.classList.remove('magnet');
      }
    });

    function loop() {
      // Dot follows directly (fast)
      let tx = mx, ty = my;
      if (magnet) {
        // Lerp dot toward magnet center
        const r = magnet.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const pullX = (cx - mx) * 0.22;
        const pullY = (cy - my) * 0.22;
        tx = mx + pullX; ty = my + pullY;
        magnet.style.transform = `translate(${(mx - cx) * 0.08}px, ${(my - cy) * 0.08}px)`;
      } else {
        document.querySelectorAll('.magnet-shift').forEach(el => el.style.transform = '');
      }
      dx += (tx - dx) * 0.5;
      dy += (ty - dy) * 0.5;
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // Hide cursor over iframes / inputs
    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0'; ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1'; ring.style.opacity = '1';
    });
  }

  // ─── NAV: scrolled state + dropdown ─────────────────────
  const nav = document.querySelector('nav.top');
  const onNavScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();

  document.querySelectorAll('nav.top .menu-trigger').forEach(trigger => {
    const li = trigger.closest('li');
    if (!li) return;
    let timeout;
    const open = () => { clearTimeout(timeout); li.classList.add('open'); };
    const close = () => { timeout = setTimeout(() => li.classList.remove('open'), 200); };
    li.addEventListener('mouseenter', open);
    li.addEventListener('mouseleave', close);
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      li.classList.toggle('open');
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav.top li.open')) {
      document.querySelectorAll('nav.top li.open').forEach(li => li.classList.remove('open'));
    }
  });

  // ─── Reveal on scroll ──────────────────────────────────
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        if (e.target.dataset.revealOnce !== 'false') io.unobserve(e.target);
      } else if (e.target.dataset.revealOnce === 'false') {
        e.target.classList.remove('in');
      }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  document.querySelectorAll('.reveal, .reveal-fast, .reveal-mask, .reveal-left, .reveal-right, .reveal-scale').forEach(el => io.observe(el));

  const lineIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        lineIO.unobserve(e.target);
      }
    }
  }, { threshold: 0.4 });
  document.querySelectorAll('.draw-line').forEach(el => lineIO.observe(el));

  // ─── Counter on view ───────────────────────────────────
  const counterIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      const target = parseFloat(el.dataset.target);
      const dec = parseInt(el.dataset.decimals || '0', 10);
      const dur = parseInt(el.dataset.duration || '1800', 10);
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = target * eased;
        el.textContent = dec > 0
          ? v.toFixed(dec).replace('.', ',')
          : Math.round(v).toLocaleString('es-ES');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    }
  }, { threshold: 0.4 });
  document.querySelectorAll('.counter').forEach(c => counterIO.observe(c));

  // ─── Parallax layers (data-parallax="0.3") ─────────────
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  let parallaxTicking = false;
  function onParallaxScroll() {
    if (parallaxTicking) return;
    parallaxTicking = true;
    requestAnimationFrame(() => {
      const vh = window.innerHeight;
      parallaxEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        // Compute relative scroll from element center to viewport center
        const center = rect.top + rect.height / 2 - vh / 2;
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        const dx = parseFloat(el.dataset.parallaxX || '0');
        const dy = -center * speed;
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      });
      parallaxTicking = false;
    });
  }
  window.addEventListener('scroll', onParallaxScroll, { passive: true });
  window.addEventListener('resize', onParallaxScroll);
  onParallaxScroll();

  // ─── Ambient audio (procedural via Web Audio API) ──────
  // Brown noise + slow LFO = sea / wind feel. No external files needed.
  const audioToggle = document.querySelector('.audio-toggle');
  let audioCtx = null, audioOn = false, masterGain = null;
  function startAudio() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) { return; }
      // Brown noise buffer (4s loopable)
      const len = audioCtx.sampleRate * 4;
      const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        d[i] = last * 3.5;
      }
      // Source
      const src = audioCtx.createBufferSource();
      src.buffer = buf; src.loop = true;
      // Filter sweep (LFO opens a low-pass to simulate waves)
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      filter.Q.value = 1.2;
      const lfo = audioCtx.createOscillator();
      lfo.frequency.value = 0.12;
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 240;
      lfo.connect(lfoGain).connect(filter.frequency);
      // Master gain (fade in)
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0;
      src.connect(filter).connect(masterGain).connect(audioCtx.destination);
      src.start(); lfo.start();
      audioCtx.resume();
    } else {
      audioCtx.resume();
    }
    audioOn = true;
    if (masterGain) masterGain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 1.2);
  }
  function stopAudio() {
    if (!audioCtx || !masterGain) return;
    audioOn = false;
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.6);
  }
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      if (audioOn) {
        stopAudio();
        audioToggle.classList.remove('on');
        audioToggle.setAttribute('aria-pressed', 'false');
        const lbl = audioToggle.querySelector('.lbl');
        if (lbl) lbl.textContent = 'Sonido';
      } else {
        startAudio();
        audioToggle.classList.add('on');
        audioToggle.setAttribute('aria-pressed', 'true');
        const lbl = audioToggle.querySelector('.lbl');
        if (lbl) lbl.textContent = 'On';
      }
    });
  }

  // ─── Smooth scroll for in-page anchors ─────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    });
  });

  // ─── Nav: active section underline ─────────────────────
  const sections = Array.from(document.querySelectorAll('section[id], main[id]'));
  const navLinks = Array.from(document.querySelectorAll('nav.top a[href^="#"]'));
  function updateActiveNav() {
    const y = window.scrollY + 120;
    let active = null;
    for (const s of sections) {
      if (s.offsetTop <= y) active = s;
    }
    navLinks.forEach(l => l.classList.toggle('active', active && l.getAttribute('href') === '#' + active.id));
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

})();

document.querySelectorAll('.ph-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.ph-filters')
       .querySelectorAll('.ph-filter')
       .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
