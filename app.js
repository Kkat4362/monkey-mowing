/* ===========================================================
   Austun's Pet Care — shared interactions
   =========================================================== */
(function () {
  'use strict';

  /* ---- nav: shrink on scroll + mobile toggle ---- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = document.querySelector('.nav-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('.nav-links a').forEach(a =>
      a.addEventListener('click', () => nav.classList.remove('open')));
  }

  /* ---- scroll reveal ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  // safety net: if IO never fires (some embedded/headless contexts), reveal all
  setTimeout(() => document.querySelectorAll('.reveal:not(.in)').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight + 200) el.classList.add('in');
  }), 1800);

  /* ---- count-up stats ---- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dec = (el.dataset.dec === '1');
      const dur = 1400; const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = (dec ? val.toFixed(1) : Math.round(val)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

  /* ---- year stamp ---- */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* ===========================================================
     PRICE ESTIMATOR
     =========================================================== */
  const est = document.querySelector('[data-estimator]');
  if (est) {
    const base = { walk: 22, sit: 28, board: 55 };       // starting prices
    const dur  = { walk: { 30: 1, 60: 1.7 }, sit: { 30: 1, 60: 1.6 } };
    let state = { service: 'walk', pets: 1, freq: 3, duration: 30, nights: 2 };

    const fmt = (n) => '$' + Math.round(n);

    function compute() {
      const s = state.service;
      let perVisit = base[s];
      if (s === 'walk' || s === 'sit') perVisit *= dur[s][state.duration];
      // extra pet: +$8 each beyond the first
      perVisit += (state.pets - 1) * 8;
      perVisit = Math.round(perVisit); // round first so per × count = total exactly
      let total, unitLabel, perLabel;
      if (s === 'board') {
        total = perVisit * state.nights;
        unitLabel = state.nights + (state.nights > 1 ? ' nights' : ' night');
        perLabel = fmt(perVisit) + ' / night';
      } else {
        total = perVisit * state.freq;
        unitLabel = state.freq + (state.freq > 1 ? ' visits / week' : ' visit / week');
        perLabel = fmt(perVisit) + ' / visit';
      }
      return { perVisit, total, unitLabel, perLabel };
    }

    function render() {
      const r = compute();
      const s = state.service;
      // toggle which controls show
      est.querySelectorAll('[data-when]').forEach(g => {
        const when = g.dataset.when.split(' ');
        g.style.display = when.includes(s) ? '' : 'none';
      });
      est.querySelector('[data-out-per]').textContent = r.perLabel;
      est.querySelector('[data-out-unit]').textContent = r.unitLabel;
      const totalEl = est.querySelector('[data-out-total]');
      // animate number
      animateMoney(totalEl, r.total);
    }

    let moneyRAF;
    function animateMoney(el, to) {
      cancelAnimationFrame(moneyRAF);
      const from = parseFloat(el.dataset.cur || '0');
      el.dataset.cur = to;
      const t0 = performance.now(); const dur = 450;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const v = from + (to - from) * (1 - Math.pow(1 - p, 3));
        el.textContent = '$' + Math.round(v);
        if (p < 1) moneyRAF = requestAnimationFrame(step);
      };
      moneyRAF = requestAnimationFrame(step);
    }

    // service segmented buttons
    est.querySelectorAll('[data-service]').forEach(btn => {
      btn.addEventListener('click', () => {
        est.querySelectorAll('[data-service]').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        state.service = btn.dataset.service;
        render();
      });
    });
    // generic stepper / segmented controls
    est.querySelectorAll('[data-pick]').forEach(group => {
      group.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          group.querySelectorAll('button').forEach(b => b.classList.remove('on'));
          btn.classList.add('on');
          const key = group.dataset.pick;
          state[key] = parseInt(btn.dataset.val, 10);
          render();
        });
      });
    });
    // steppers (pets, nights, freq)
    est.querySelectorAll('[data-step]').forEach(group => {
      const key = group.dataset.step;
      const out = group.querySelector('[data-step-val]');
      const min = parseInt(group.dataset.min, 10);
      const max = parseInt(group.dataset.max, 10);
      const sync = () => { out.textContent = state[key]; };
      group.querySelector('[data-dir="-"]').addEventListener('click', () => {
        state[key] = Math.max(min, state[key] - 1); sync(); render();
      });
      group.querySelector('[data-dir="+"]').addEventListener('click', () => {
        state[key] = Math.min(max, state[key] + 1); sync(); render();
      });
      sync();
    });
    render();
  }

  /* ===========================================================
     GALLERY LIGHTBOX
     =========================================================== */
  const lb = document.querySelector('[data-lightbox]');
  if (lb) {
    const imgWrap = lb.querySelector('[data-lb-img]');
    const cap = lb.querySelector('[data-lb-cap]');
    let items = [], idx = 0;

    function collect() {
      items = [...document.querySelectorAll('[data-gallery-item]')];
    }
    function show(i) {
      collect();
      idx = (i + items.length) % items.length;
      const it = items[idx];
      const slot = it.querySelector('image-slot');
      // clone the filled image-slot look by reading its rendered background
      imgWrap.innerHTML = '';
      const clone = it.cloneNode(true);
      clone.style.cssText = 'width:100%;height:100%;border-radius:20px;overflow:hidden';
      imgWrap.appendChild(clone);
      cap.textContent = it.dataset.cap || '';
    }
    document.querySelectorAll('[data-gallery-item]').forEach((it, i) => {
      it.addEventListener('click', () => { lb.classList.add('open'); show(i); document.body.style.overflow = 'hidden'; });
    });
    const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
    lb.querySelector('[data-lb-close]').addEventListener('click', close);
    lb.querySelector('[data-lb-next]').addEventListener('click', () => show(idx + 1));
    lb.querySelector('[data-lb-prev]').addEventListener('click', () => show(idx - 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'ArrowLeft') show(idx - 1);
    });
  }

  /* ===========================================================
     MULTI-STEP BOOKING FORM
     =========================================================== */
  const book = document.querySelector('[data-booking]');
  if (book) {
    const steps = [...book.querySelectorAll('[data-step-panel]')];
    const dots = [...book.querySelectorAll('[data-prog-dot]')];
    const bar = book.querySelector('[data-prog-bar]');
    const data = { service: '', pets: '', dates: '', name: '', phone: '', notes: '' };
    let cur = 0;

    function go(n) {
      cur = Math.max(0, Math.min(steps.length - 1, n));
      steps.forEach((s, i) => {
        s.classList.toggle('active', i === cur);
      });
      dots.forEach((d, i) => {
        d.classList.toggle('done', i < cur);
        d.classList.toggle('on', i === cur);
      });
      if (bar) bar.style.width = (cur / (steps.length - 1)) * 100 + '%';
      const panel = steps[cur];
      const focusEl = panel.querySelector('input, textarea, [data-choice]');
      if (focusEl && focusEl.tagName === 'INPUT') setTimeout(() => focusEl.focus(), 350);
    }

    // choice cards (service)
    book.querySelectorAll('[data-choice]').forEach(c => {
      c.addEventListener('click', () => {
        const group = c.dataset.group;
        book.querySelectorAll(`[data-choice][data-group="${group}"]`).forEach(x => x.classList.remove('sel'));
        c.classList.add('sel');
        data[group] = c.dataset.value;
        // auto-advance after a beat
        setTimeout(() => go(cur + 1), 300);
      });
    });

    book.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => {
      // simple validation on contact step
      const panel = steps[cur];
      const reqs = panel.querySelectorAll('[required]');
      let ok = true;
      reqs.forEach(r => {
        if (!r.value.trim()) { r.classList.add('err'); ok = false; }
        else r.classList.remove('err');
      });
      if (!ok) return;
      go(cur + 1);
    }));
    book.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', () => go(cur - 1)));

    // collect inputs
    book.querySelectorAll('input, textarea').forEach(inp => {
      inp.addEventListener('input', () => {
        if (inp.name) data[inp.name] = inp.value;
        inp.classList.remove('err');
      });
    });

    // submit -> summary
    const submit = book.querySelector('[data-submit]');
    if (submit) submit.addEventListener('click', () => {
      const panel = steps[cur];
      const reqs = panel.querySelectorAll('[required]');
      let ok = true;
      reqs.forEach(r => { if (!r.value.trim()) { r.classList.add('err'); ok = false; } });
      if (!ok) return;
      const map = { walk: 'Dog Walking', sit: 'Pet Sitting / Drop-ins', board: 'Overnight Boarding' };
      const s = book.querySelector('[data-sum-service]');
      if (s) s.textContent = map[data.service] || data.service || '—';
      const nm = book.querySelector('[data-sum-name]'); if (nm) nm.textContent = data.name || 'there';
      go(cur + 1);
    });

    go(0);
  }

  /* ---- soft parallax on hero blobs ---- */
  const blobs = document.querySelectorAll('[data-parallax]');
  if (blobs.length) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      blobs.forEach(b => {
        const sp = parseFloat(b.dataset.parallax) || 0.2;
        b.style.transform = `translateY(${y * sp}px)`;
      });
    }, { passive: true });
  }

})();
