/* sections.jsx — stats, services, estimator, process, pricing */

function Stats() {
  const data = [
    { n: 240, suf: '+', l: 'Lawns mowed this season' },
    { n: 4.9, dec: 1, suf: '/5', l: 'Average customer rating' },
    { n: 100, suf: '%', l: 'Electric, low-noise fleet' },
    { n: 24, suf: 'h', l: 'Typical quote turnaround' },
  ];
  return (
    <section className="stats">
      <div className="wrap">
        <div className="stats-inner">
          {data.map((s, i) => (
            <div className="stat reveal" key={i}>
              <div className="num"><CountUp to={s.n} suffix={s.suf} decimals={s.dec || 0} /></div>
              <div className="lbl">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SERVICES = [
  { ic: 'mow', tag: null, t: 'Mowing & Edging', d: 'Crisp, even cuts with clean edges along every walk, bed and driveway. Stripes optional, satisfaction guaranteed.' },
  { ic: 'spray', tag: null, t: 'Fertilizing & Weed Control', d: 'Season-smart feeding and targeted weed treatment that turns thin, patchy turf into thick Highlands Ranch green.' },
  { ic: 'mulch', tag: null, t: 'Mulching', d: 'Fresh mulch that locks in moisture, blocks weeds and makes your beds look pro. We haul in, spread and tidy up.' },
  { ic: 'snow', tag: 'Seasonal', t: 'Snow Removal', d: 'When winter hits the Front Range, we clear driveways and walks fast — so you never shovel at 6am again.' },
];

function Services() {
  return (
    <section className="section bg-cream" id="services">
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="eyebrow">What we do</span>
          <h2>Four services. One happy lawn.</h2>
          <p>Everything your yard needs across the year — handled by one local crew you can actually get on the phone.</p>
        </div>
        <div className="svc-grid">
          {SERVICES.map((s, i) => {
            const Icon = I[s.ic];
            return (
              <article className={cx('svc', 'reveal', 'reveal-d' + (i + 1))} key={i} onClick={() => document.getElementById('quote').scrollIntoView({ behavior: 'smooth' })}>
                {s.tag && <span className="svc-tag">{s.tag}</span>}
                <div className="svc-ic"><Icon /></div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
                <span className="more">Get this <I.arrow style={{ width: 15, height: 15 }} /></span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------ price estimator ------------ */
function Estimator() {
  const [size, setSize] = useState(6000);
  const [freq, setFreq] = useState('biweekly');

  const FREQS = [
    { id: 'weekly', label: 'Weekly', sub: 'best value', mult: 0.9, visits: 4 },
    { id: 'biweekly', label: 'Bi-weekly', sub: 'most popular', mult: 1.0, visits: 2 },
    { id: 'monthly', label: 'Monthly', sub: 'light upkeep', mult: 1.15, visits: 1 },
    { id: 'onetime', label: 'One-time', sub: 'just once', mult: 1.35, visits: 1 },
  ];
  const f = FREQS.find(x => x.id === freq);
  const base = 32 + (size / 1000) * 4.2;
  const perVisit = Math.round((base * f.mult) / 5) * 5;
  const monthly = freq === 'onetime' ? perVisit : perVisit * f.visits;

  const sizeLabel = size >= 19500 ? '20,000+ sq ft' : size.toLocaleString() + ' sq ft';
  const acre = (size / 43560).toFixed(2);

  return (
    <section className="section bg-soft" id="estimator">
      <div className="wrap">
        <div className="est reveal">
          <div className="est-grid">
            <div className="est-left">
              <span className="eyebrow" style={{ color: 'var(--lime-300)' }}>Instant estimate</span>
              <h2>Slide it. See your price.</h2>
              <p className="lead">No forms, no waiting. Drag the slider to your yard size and pick how often you'd like us out.</p>

              <div className="est-control">
                <div className="row">
                  <label>How big is your lawn?</label>
                  <span className="val">{sizeLabel}</span>
                </div>
                <input className="slider" type="range" min="1000" max="20000" step="500"
                  value={size} onChange={e => setSize(+e.target.value)} />
                <div className="est-ticks"><span>Small</span><span>Average</span><span>Large</span><span>Estate</span></div>
              </div>

              <div className="est-freq">
                {FREQS.map(x => (
                  <button key={x.id} className={cx(freq === x.id && 'on')} onClick={() => setFreq(x.id)}>
                    {x.label}<small>{x.sub}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="est-right">
              <span className="est-quote-label">Your estimate</span>
              <div className="est-price">
                <span className="amt">${perVisit}</span>
                <span className="per">/ visit</span>
              </div>
              <p className="est-note">Ballpark for a {sizeLabel} lawn (~{acre} acre){freq !== 'onetime' ? `, billed ${freq}.` : ', one-time service.'} Final price confirmed on your free on-site quote.</p>
              <div className="est-breakdown">
                <div className="b"><span>Lawn size</span><b>{sizeLabel}</b></div>
                <div className="b"><span>Visit frequency</span><b style={{ textTransform: 'capitalize' }}>{freq === 'onetime' ? 'One-time' : freq}</b></div>
                {freq !== 'onetime' && <div className="b"><span>Approx. monthly</span><b>${monthly}</b></div>}
              </div>
              <a className="btn btn-primary est-cta" href="#quote">Lock in this price <I.arrow /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------ how it works ------------ */
const STEPS = [
  { ic: 'chat', t: 'Tell us about it', d: 'Send a quick message or use the estimator. Tell us your address and what your yard needs.' },
  { ic: 'cal', t: 'Get a fast quote', d: 'We confirm a fair, flat price — usually within 24 hours — and lock in a day that works for you.' },
  { ic: 'mow', t: 'We swing in', d: 'Our electric crew shows up on time, does the work right, and cleans up like we were never there.' },
  { ic: 'heart', t: 'You relax', d: 'Come home to a sharp, fresh-cut lawn. Recurring? It just happens — no chasing, no reminders.' },
];

function Process() {
  return (
    <section className="section bg-paper" id="how">
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="eyebrow">How it works</span>
          <h2>Easy as peeling a banana.</h2>
          <p>From "my grass is getting wild" to "wow, that looks great" in four simple steps.</p>
        </div>
        <div className="proc-grid">
          {STEPS.map((s, i) => {
            const Icon = I[s.ic];
            return (
              <div className={cx('step', 'reveal', 'reveal-d' + (i + 1))} key={i}>
                <div className="step-num">{i + 1}</div>
                <div className="step-ic"><Icon /></div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------ pricing plans ------------ */
const PLANS = [
  { name: 'The Trim', desc: 'Keep it neat & simple', price: 39, per: '/ visit', feat: false,
    items: ['Professional mow + line trim', 'Crisp edging on walks & beds', 'Clippings cleaned & blown off', 'Flexible weekly or bi-weekly'] },
  { name: 'The Full Monkey', desc: 'Our most-loved package', price: 89, per: '/ visit', feat: true,
    items: ['Everything in The Trim', 'Seasonal fertilizing & weed control', 'Bed mulch refresh each season', 'Priority same-week scheduling', 'Free spot-treatments between visits'] },
  { name: 'The Estate', desc: 'Big yards, year-round', price: 149, per: '/ visit', feat: false,
    items: ['Everything in The Full Monkey', 'Large & multi-zone properties', 'Winter snow & ice removal', 'Dedicated account & seasonal plan'] },
];

function Pricing() {
  return (
    <section className="section bg-cream" id="pricing">
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="eyebrow">Simple pricing</span>
          <h2>Pick your level of pampering.</h2>
          <p>Flat, honest pricing with no surprise fees. Every plan includes free quotes and our 100% happy-lawn guarantee.</p>
        </div>
        <div className="price-grid">
          {PLANS.map((p, i) => (
            <div className={cx('plan', p.feat && 'feat', 'reveal', 'reveal-d' + (i + 1))} key={i}>
              <div className="plan-name">{p.name}</div>
              <div className="plan-desc">{p.desc}</div>
              <div className="plan-price"><span className="amt">${p.price}</span><span className="per">{p.per}</span></div>
              <ul>
                {p.items.map((it, j) => <li key={j}><I.check /> {it}</li>)}
              </ul>
              <a className={cx('btn', p.feat ? 'btn-primary' : 'btn-dark')} href="#quote">Choose {p.name.replace('The ', '')} <I.arrow /></a>
            </div>
          ))}
        </div>
        <p className="plan-foot reveal">Not sure which fits? <a href="#quote" style={{ color: 'var(--accent-deep)', fontWeight: 700 }}>Get a free custom quote →</a> Prices vary with lawn size; your estimate is confirmed on-site.</p>
      </div>
    </section>
  );
}

Object.assign(window, { Stats, Services, Estimator, Process, Pricing });
