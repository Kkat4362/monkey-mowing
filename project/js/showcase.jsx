/* showcase.jsx — before/after slider, about, FAQ */

/* stylized yard illustration (placeholder until real photos) */
function LawnArt({ variant }) {
  const after = variant === 'after';
  const stripes = [];
  for (let i = 0; i < 9; i++) {
    stripes.push(
      <rect key={i} x={-40 + i * 100} y="300" width="100" height="320"
        fill={i % 2 ? (after ? '#54be1f' : '#7a8a4a') : (after ? '#3f9e16' : '#6d7d3e')}
        transform="skewX(-8)" opacity={after ? 1 : .85} />
    );
  }
  // patchy spots + weeds for the "before"
  const patches = [];
  if (!after) {
    const spots = [[140,430,46],[330,520,60],[520,400,40],[650,500,54],[230,560,38],[430,440,30]];
    spots.forEach((s, i) => patches.push(<ellipse key={'p'+i} cx={s[0]} cy={s[1]} rx={s[2]} ry={s[2]*0.55} fill="#9a8a52" opacity=".7" />));
    const weeds = [[180,470],[400,540],[600,460],[300,420],[700,520]];
    weeds.forEach((w, i) => (
      patches.push(<g key={'w'+i} transform={`translate(${w[0]} ${w[1]})`}>
        <path d="M0 0 L-3 -26 M0 0 L0 -30 M0 0 L4 -24" stroke="#caa53e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <circle cx="0" cy="-30" r="5" fill="#ffd23f"/>
      </g>)
    ));
  }
  return (
    <svg viewBox="0 0 800 600" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={'sky'+variant} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={after ? '#bfe6ff' : '#cdd6da'} />
          <stop offset="1" stopColor={after ? '#eaf7ff' : '#e3e7e4'} />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill={`url(#sky${variant})`} />
      {after && <circle cx="660" cy="110" r="52" fill="#ffe27a" opacity=".9" />}
      {/* tree line / shrubs */}
      <ellipse cx="120" cy="300" rx="90" ry="70" fill={after ? '#2f7d10' : '#5f6a3c'} />
      <ellipse cx="690" cy="290" rx="110" ry="80" fill={after ? '#357f12' : '#646f40'} />
      {/* fence */}
      <g opacity={after ? .9 : .7}>
        {Array.from({length: 14}).map((_,i)=>(<rect key={i} x={40+i*55} y="270" width="14" height="60" rx="3" fill={after ? '#cdeac0' : '#b9bcab'} />))}
        <rect x="40" y="288" width="760" height="9" fill={after ? '#bfe0ad' : '#aeb19f'} />
      </g>
      {/* lawn base */}
      <rect x="0" y="300" width="800" height="300" fill={after ? '#4fa82a' : '#73803f'} />
      <g style={{ clipPath: 'inset(300px 0 0 0)' }}>{stripes}</g>
      {patches}
      {/* uneven top edge for before */}
      {!after && <path d="M0 305 q40 -14 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 V330 H0 Z" fill="#7a8a4a" opacity=".5" />}
    </svg>
  );
}

function BeforeAfter() {
  const [pct, setPct] = useState(52);
  const ref = useRef(null);
  const drag = useRef(false);

  const move = useCallback((clientX) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const p = Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100));
    setPct(p);
  }, []);

  useEffect(() => {
    const onMove = (e) => { if (!drag.current) return; move(e.touches ? e.touches[0].clientX : e.clientX); };
    const onUp = () => { drag.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [move]);

  const start = (e) => { drag.current = true; move(e.touches ? e.touches[0].clientX : e.clientX); };

  return (
    <section className="section bg-soft" id="gallery">
      <div className="wrap">
        <div className="ba-wrap">
          <div className="reveal">
            <span className="eyebrow">See the difference</span>
            <h2 style={{ fontSize: 'clamp(32px,4.6vw,52px)', marginTop: 16 }}>Drag to watch the<br/>jungle become a lawn.</h2>
            <p style={{ marginTop: 18, color: 'var(--muted)', fontSize: 19, lineHeight: 1.55, maxWidth: 420 }}>
              Tired, patchy and overgrown on the left. Thick, striped and edge-perfect on the right. Same yard — one visit from the Monkey Mowing crew.
            </p>
            <div style={{ display: 'flex', gap: 28, marginTop: 30, flexWrap: 'wrap' }}>
              <div><div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 34, color: 'var(--accent-deep)' }}><CountUp to={1} prefix="" suffix="-visit" />*</div><div style={{ color: 'var(--muted)', fontWeight: 600, fontSize: 14 }}>transformations</div></div>
              <div><div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 34, color: 'var(--accent-deep)' }}><CountUp to={100} suffix="%" /></div><div style={{ color: 'var(--muted)', fontWeight: 600, fontSize: 14 }}>happy-lawn guarantee</div></div>
            </div>
            <p style={{ marginTop: 18, fontSize: 12.5, color: 'var(--muted)' }}>*Illustrated preview — swap in your real before/after photos any time.</p>
          </div>

          <div className="ba" ref={ref} onMouseDown={start} onTouchStart={start}>
            <div className="ba-layer ba-after"><LawnArt variant="after" /></div>
            <div className="ba-layer ba-before" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}><LawnArt variant="before" /></div>
            <span className="ba-badge before">Before</span>
            <span className="ba-badge after">After</span>
            <div className="ba-handle" style={{ left: pct + '%' }}>
              <div className="ba-knob"><I.arrow style={{ width: 16, transform: 'scaleX(-1)' }} /><I.arrow style={{ width: 16, marginLeft: -4 }} /></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------ about ------------ */
function About() {
  const points = [
    { ic: 'bolt', t: 'Quiet, all-electric fleet', d: 'No fumes, no gas-mower roar at 7am. Better for your kids, pets and the Front Range air.' },
    { ic: 'heart', t: 'Local & owner-operated', d: 'We live here too. You get the same friendly faces every visit — not a rotating crew of strangers.' },
    { ic: 'shield', t: 'Happy-lawn guarantee', d: "Not thrilled with a cut? We come back and make it right. No drama, no charge." },
  ];
  return (
    <section className="section bg-paper" id="about">
      <div className="wrap">
        <div className="about-grid">
          <div className="about-media reveal">
            <div className="about-card">
              <img src="assets/logo-transparent.png" alt="Monkey Mowing" />
            </div>
            <div className="about-quote">"They treat my yard like it's <span>their own backyard.</span>"</div>
          </div>
          <div className="reveal reveal-d1">
            <span className="eyebrow">Our story</span>
            <h2 style={{ fontSize: 'clamp(32px,4.6vw,52px)', marginTop: 16 }}>A little cheeky.<br/>Seriously good at grass.</h2>
            <p style={{ marginTop: 18, color: 'var(--muted)', fontSize: 18, lineHeight: 1.6 }}>
              Monkey Mowing started with one mower, one trailer and a simple promise: show up, do great work, and make lawn care actually pleasant. Today we keep yards across Highlands Ranch looking sharp all year — with electric equipment and a crew that genuinely cares.
            </p>
            <div className="about-points">
              {points.map((p, i) => {
                const Icon = I[p.ic];
                return (
                  <div className="about-point" key={i}>
                    <div className="ic"><Icon /></div>
                    <div><h4>{p.t}</h4><p>{p.d}</p></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------ FAQ ------------ */
const FAQS = [
  { q: 'What areas do you serve?', a: 'We cover Highlands Ranch and the surrounding neighborhoods. Not sure if you\'re in range? Send your address — if we can\'t reach you, we\'ll point you to someone great who can.' },
  { q: 'How much does it cost?', a: 'Most weekly or bi-weekly mows land between $39 and $89 per visit depending on lawn size and what you need. Use the instant estimator above for a ballpark, then we confirm a flat price with a free on-site quote.' },
  { q: 'Are quotes really free?', a: 'Always. We\'ll look at your lawn, talk through what you want, and give you an honest flat price with zero obligation and zero pressure.' },
  { q: 'Is the equipment really all-electric?', a: 'Yep. Our mowers and trimmers are battery-powered — that means no fumes, far less noise, and a smaller footprint on the air your family breathes.' },
  { q: 'Do I need to be home for service?', a: 'Nope. Once we have access to the yard, we handle everything and send a quick note when we\'re done. Recurring plans just run on autopilot.' },
  { q: 'What about snow in winter?', a: 'Our Estate and add-on plans include driveway and walkway snow removal, so the same crew that mows your lawn keeps you dug out all winter.' },
];

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section bg-cream" id="faq">
      <div className="wrap">
        <div className="faq-grid">
          <div className="reveal">
            <span className="eyebrow">Good to know</span>
            <h2 style={{ fontSize: 'clamp(32px,4.6vw,50px)', marginTop: 16 }}>Questions,<br/>answered.</h2>
            <p style={{ marginTop: 18, color: 'var(--muted)', fontSize: 18, lineHeight: 1.6, maxWidth: 360 }}>
              Still curious about something? Give us a shout — real humans answer the phone.
            </p>
            <a className="btn btn-dark" style={{ marginTop: 26 }} href="tel:303-957-7700"><I.phone /> 303-957-7700</a>
          </div>
          <div className="faq-list">
            {FAQS.map((f, i) => (
              <div className={cx('faq-item', open === i && 'open')} key={i}>
                <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                  {f.q}<span className="faq-ic"><I.plus /></span>
                </button>
                <div className="faq-a" style={{ maxHeight: open === i ? 260 : 0 }}>
                  <div className="faq-a-inner">{f.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { BeforeAfter, About, FAQ, LawnArt });
