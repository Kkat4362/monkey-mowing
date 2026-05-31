/* hero.jsx — hero with 3 directions + live mowing animation */

/* parse "*word*" markers into highlighted segments */
function parseHL(text) {
  const out = [];
  const re = /\*([^*]+)\*/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ t: text.slice(last, m.index), hl: false });
    out.push({ t: m[1], hl: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ t: text.slice(last), hl: false });
  return out.length ? out : [{ t: text, hl: false }];
}

/* cute side-view push mower (faces right) */
function MowerSVG() {
  return (
    <svg viewBox="0 0 150 120" width="100%" aria-hidden="true">
      {/* handle */}
      <path d="M20 96 L70 40" stroke="#15401a" strokeWidth="7" strokeLinecap="round" fill="none"/>
      <path d="M16 92 L66 36" stroke="#15401a" strokeWidth="7" strokeLinecap="round" fill="none"/>
      <path d="M62 34 q8 -4 14 2" stroke="#15401a" strokeWidth="7" strokeLinecap="round" fill="none"/>
      {/* grass catcher */}
      <path d="M30 78 L18 60 q-6 -2 -8 6 l6 16 Z" fill="#2f7d10"/>
      {/* deck */}
      <rect x="62" y="74" width="64" height="22" rx="7" fill="#15401a"/>
      <rect x="74" y="58" width="34" height="20" rx="5" fill="#1d5524"/>
      <rect x="80" y="62" width="22" height="8" rx="3" fill="#54be1f"/>
      {/* wheels */}
      <circle cx="74" cy="98" r="13" fill="#0d2c12"/><circle cx="74" cy="98" r="5" fill="#54be1f"/>
      <circle cx="116" cy="98" r="13" fill="#0d2c12"/><circle cx="116" cy="98" r="5" fill="#54be1f"/>
      <rect x="118" y="80" width="9" height="14" rx="3" fill="#15401a"/>
    </svg>
  );
}

function MowerScene({ dir, play }) {
  const bladesRef = useRef([]);
  const mowerRef = useRef(null);
  const rafRef = useRef(0);
  const N = 44;

  const reduced = typeof window !== 'undefined' && window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduced) {
      bladesRef.current.forEach(b => b && (b.style.height = (30 + Math.random()*20) + '%'));
      return;
    }
    const fullH = bladesRef.current.map(() => 62 + Math.random() * 36); // % of grass-row height
    const cur = fullH.slice();
    let x = -22;            // mower center, in %
    let d = 1;
    const speed = 0.42 * (play === 'bananas' ? 1.5 : play === 'chill' ? 0.7 : 1);
    let lastT = performance.now();

    const loop = (now) => {
      const dt = Math.min(40, now - lastT); lastT = now;
      x += d * speed * (dt / 16.7);
      if (x > 118) { x = 118; d = -1; }
      if (x < -22) { x = -22; d = 1; }
      if (mowerRef.current) {
        mowerRef.current.style.left = x + '%';
        mowerRef.current.style.transform = `scaleX(${d > 0 ? 1 : -1})`;
      }
      const cutFront = x + (d > 0 ? 4 : -4);
      for (let i = 0; i < N; i++) {
        const bx = (i / (N - 1)) * 100;
        // regrow slowly
        cur[i] = Math.min(fullH[i], cur[i] + 0.18 * (dt / 16.7));
        // cut just behind the moving mower deck
        if (d > 0 && bx <= cutFront && bx > cutFront - 7) cur[i] = 16 + Math.random()*6;
        if (d < 0 && bx >= cutFront && bx < cutFront + 7) cur[i] = 16 + Math.random()*6;
        const el = bladesRef.current[i];
        if (el) el.style.height = cur[i] + '%';
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [play, reduced]);

  return (
    <div className="scene" data-hero={dir}>
      <div className="scene-card">
        <div className="scene-sky" />
        <div className="scene-sun bob" style={{ '--rot': '0deg' }} />
        <div className="scene-cloud" style={{ top: '14%', left: '12%', width: 64 }} />
        <div className="scene-cloud bob" style={{ top: '22%', left: '46%', width: 44, animationDelay: '1.2s' }} />
        <div className="lawn">
          {[1,2,3,4,5,6,7].map(i => (
            i % 2 ? <div key={i} className="stripe dark" style={{ left: (i*12.5)+'%' }} /> : null
          ))}
          <div className="grass-row">
            {Array.from({ length: N }).map((_, i) => (
              <div key={i} className="blade" ref={el => bladesRef.current[i] = el} style={{ height: '70%' }} />
            ))}
          </div>
          <div className="mower" ref={mowerRef} style={{ left: '-22%' }}>
            <MowerSVG />
          </div>
        </div>
      </div>

      <div className="scene-chip bob" style={{ top: '7%', left: '-7%', animationDelay: '.4s' }}>
        <div className="ic"><I.star /></div>
        <div><b>4.9 / 5</b><small>240+ happy lawns</small></div>
      </div>
      <div className="scene-chip bob" style={{ bottom: '8%', right: '-6%', animationDelay: '1.1s' }}>
        <div className="ic"><I.bolt /></div>
        <div><b>100% electric</b><small>quiet &amp; clean</small></div>
      </div>
    </div>
  );
}

function Hero({ dir, setDir, headline, play }) {
  const segs = parseHL(headline);
  const dirs = [
    { id: 'sunny', label: 'Sunny', c: '#74d83d' },
    { id: 'forest', label: 'Bold', c: '#103016' },
    { id: 'pattern', label: 'Playful', c: '#9ae86a' },
  ];
  const sub = "Mowing, fertilizing, mulching & seasonal snow removal across Highlands Ranch — handled by a crew that actually shows up. All-electric equipment. Always-free quotes.";
  return (
    <header className="hero" data-hero={dir} id="top">
      {/* floating decor */}
      {play !== 'chill' && (
        <React.Fragment>
          <div className="float bob" style={{ top: '18%', left: '6%', '--rot': '-12deg', color: 'var(--lime-500)', animationDelay: '.2s' }}>
            <I.leaf style={{ width: 38, height: 38 }} />
          </div>
          <div className="float bob" style={{ top: '70%', left: '3%', '--rot': '14deg', color: 'var(--lime-400)', animationDelay: '1.4s' }}>
            <I.sparkle style={{ width: 26, height: 26 }} />
          </div>
          {play === 'bananas' && (
            <div className="float bob" style={{ top: '30%', right: '4%', '--rot': '8deg', color: 'var(--sun)', animationDelay: '.8s' }}>
              <I.sparkle style={{ width: 34, height: 34 }} />
            </div>
          )}
        </React.Fragment>
      )}

      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-pill reveal in">
              <span className="dot"><I.pin /></span>
              Proudly serving Highlands Ranch &amp; nearby
            </div>
            <h1>{segs.map((s, i) => s.hl ? <span key={i} className="sweep">{s.t}</span> : <React.Fragment key={i}>{s.t}</React.Fragment>)}</h1>
            <p className="hero-sub">{sub}</p>
            <div className="hero-actions">
              <a className="btn btn-primary btn-lg" href="#quote">Get my free quote <I.arrow /></a>
              <a className="btn btn-ghost btn-lg" href="#estimator">Estimate my price</a>
            </div>
            <div className="hero-trust">
              <span className="t"><I.bolt /> 100% electric, eco-friendly</span>
              <span className="t"><I.leafCheck /> Always-free quotes</span>
              <span className="t"><I.heart /> Locally owned</span>
            </div>
          </div>

          <MowerScene dir={dir} play={play} />
        </div>
      </div>

      <div className="hero-switch" role="tablist" aria-label="Hero style">
        <span style={{ alignSelf: 'center', fontWeight: 700, fontSize: 12, color: 'var(--muted)', padding: '0 4px 0 8px' }}>Style</span>
        {dirs.map(d => (
          <button key={d.id} className={cx(dir === d.id && 'on')} onClick={() => setDir(d.id)}>
            <span className="sw" style={{ background: d.c }} /> {d.label}
          </button>
        ))}
      </div>
    </header>
  );
}

Object.assign(window, { Hero, MowerScene, parseHL });
