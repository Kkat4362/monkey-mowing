/* contact.jsx — nav, quote form, footer */

const NAV_LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#estimator', label: 'Estimate' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#about', label: 'About' },
  { href: '#faq', label: 'FAQ' },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { document.body.style.overflow = menu ? 'hidden' : ''; }, [menu]);

  return (
    <React.Fragment>
      <nav className={cx('nav', scrolled && 'scrolled')}>
        <div className="wrap nav-inner">
          <a className="nav-logo" href="#top"><img src="assets/logo-transparent.png" alt="Monkey Mowing" /></a>
          <div className="nav-links">
            {NAV_LINKS.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
          </div>
          <div className="nav-cta">
            <a className="nav-phone" href="tel:303-957-7700"><I.phone /> 303-957-7700</a>
            <a className="btn btn-primary" href="#quote" style={{ padding: '12px 22px', fontSize: 15.5 }}>Free quote</a>
            <button className="nav-burger" onClick={() => setMenu(true)} aria-label="Menu"><I.menu /></button>
          </div>
        </div>
      </nav>

      <div className={cx('msheet', menu && 'open')}>
        <div className="msheet-bg" onClick={() => setMenu(false)} />
        <div className="msheet-panel">
          <div className="msheet-top">
            <img src="assets/logo-transparent.png" alt="Monkey Mowing" style={{ height: 40 }} />
            <button className="nav-burger" onClick={() => setMenu(false)} aria-label="Close"><I.x /></button>
          </div>
          {NAV_LINKS.map(l => <a key={l.href} href={l.href} onClick={() => setMenu(false)}>{l.label}</a>)}
          <a href="#quote" onClick={() => setMenu(false)} style={{ color: 'var(--accent-deep)' }}>Get a free quote →</a>
          <a className="btn btn-dark" href="tel:303-957-7700" style={{ marginTop: 14, justifyContent: 'center' }}><I.phone /> 303-957-7700</a>
        </div>
      </div>
    </React.Fragment>
  );
}

/* ------------ quote form ------------ */
const SERVICE_OPTS = ['Mowing & edging', 'Fertilizing', 'Mulching', 'Snow removal', 'Not sure yet'];

function QuoteForm() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', message: '' });
  const [services, setServices] = useState(['Mowing & edging']);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sent, setSent] = useState(false);

  const validate = (f) => {
    const e = {};
    if (!f.name.trim()) e.name = 'Please tell us your name';
    if (!f.phone.trim()) e.phone = 'We need a number to reach you';
    else if (f.phone.replace(/\D/g, '').length < 10) e.phone = 'That doesn\'t look like a full number';
    if (!f.email.trim()) e.email = 'An email helps us send your quote';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Hmm, check that email address';
    return e;
  };

  const set = (k, v) => {
    const next = { ...form, [k]: v };
    setForm(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k) => { setTouched({ ...touched, [k]: true }); setErrors(validate(form)); };

  const toggleSvc = (s) => setServices(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const submit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setTouched({ name: true, phone: true, email: true });
    if (Object.keys(errs).length === 0) setSent(true);
  };

  const fieldClass = (k) => cx('fr', errors[k] && touched[k] && 'err');

  return (
    <section className="section quote" id="quote">
      <div className="float bob" style={{ top: '12%', right: '6%', color: 'rgba(255,255,255,.07)' }}><I.leaf style={{ width: 120, height: 120 }} /></div>
      <div className="wrap">
        <div className="quote-grid">
          <div className="reveal">
            <span className="eyebrow" style={{ color: 'var(--lime-300)' }}>Free, no-pressure quote</span>
            <h2>Let's get your<br/>lawn looking great.</h2>
            <p className="lead">Tell us a little about your yard and we'll get back to you — usually within a day — with a friendly, flat-rate quote.</p>
            <div className="quote-contacts">
              <a className="qc" href="tel:303-957-7700">
                <div className="ic"><I.phone /></div>
                <div><small>Call or text</small><b>303-957-7700</b></div>
              </a>
              <a className="qc" href="mailto:sales@monkeymowing.com">
                <div className="ic"><I.mail /></div>
                <div><small>Email us</small><b>sales@monkeymowing.com</b></div>
              </a>
              <div className="qc">
                <div className="ic"><I.pin /></div>
                <div><small>Service area</small><b>Highlands Ranch &amp; nearby</b></div>
              </div>
            </div>
          </div>

          <div className="form-card reveal reveal-d1">
            {sent ? (
              <div className="form-success">
                <div className="check"><I.leafCheck /></div>
                <h3>Quote request sent! 🌱</h3>
                <p>Thanks, {form.name.split(' ')[0] || 'friend'}! Our crew will reach out within 24 hours at {form.phone || 'your number'}. Keep an eye on your phone.</p>
                <button className="btn btn-ghost" style={{ marginTop: 24 }} onClick={() => { setSent(false); setForm({ name:'', phone:'', email:'', address:'', message:'' }); setServices(['Mowing & edging']); setTouched({}); setErrors({}); }}>Send another</button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="fr-2">
                  <div className={fieldClass('name')}>
                    <label>Name <span className="req">*</span></label>
                    <input value={form.name} onChange={e => set('name', e.target.value)} onBlur={() => blur('name')} placeholder="Jane Banana" />
                    <div className="msg">{errors.name}</div>
                  </div>
                  <div className={fieldClass('phone')}>
                    <label>Phone <span className="req">*</span></label>
                    <input value={form.phone} onChange={e => set('phone', e.target.value)} onBlur={() => blur('phone')} placeholder="(303) 555-0199" inputMode="tel" />
                    <div className="msg">{errors.phone}</div>
                  </div>
                </div>
                <div className={fieldClass('email')}>
                  <label>Email <span className="req">*</span></label>
                  <input value={form.email} onChange={e => set('email', e.target.value)} onBlur={() => blur('email')} placeholder="jane@email.com" inputMode="email" />
                  <div className="msg">{errors.email}</div>
                </div>
                <div className="fr">
                  <label>Property address <span style={{ color: 'var(--muted)', fontWeight: 600 }}>(optional)</span></label>
                  <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Street, Highlands Ranch" />
                </div>
                <div className="fr">
                  <label>What do you need?</label>
                  <div className="chips">
                    {SERVICE_OPTS.map(s => (
                      <button type="button" key={s} className={cx('chip', services.includes(s) && 'on')} onClick={() => toggleSvc(s)}>
                        <I.check /> {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="fr">
                  <label>Anything else? <span style={{ color: 'var(--muted)', fontWeight: 600 }}>(optional)</span></label>
                  <textarea value={form.message} onChange={e => set('message', e.target.value)} placeholder="Gate code, dog in the yard, problem spots..." />
                </div>
                <button type="submit" className="btn btn-primary btn-lg form-submit">Send my free quote <I.arrow /></button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------ footer ------------ */
function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <img className="fl" src="assets/logo-light.png" alt="Monkey Mowing" />
            <p className="fdesc">Friendly, all-electric lawn care for Highlands Ranch and the neighborhoods around it. Mow less, monkey around more.</p>
          </div>
          <div>
            <h5>Services</h5>
            <ul>
              <li><a href="#services">Mowing &amp; edging</a></li>
              <li><a href="#services">Fertilizing</a></li>
              <li><a href="#services">Mulching</a></li>
              <li><a href="#services">Snow removal</a></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><a href="#about">About us</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#quote">Free quote</a></li>
            </ul>
          </div>
          <div>
            <h5>Get in touch</h5>
            <ul>
              <li><a href="tel:303-957-7700">303-957-7700</a></li>
              <li><a href="mailto:sales@monkeymowing.com">sales@monkeymowing.com</a></li>
              <li><a href="#quote">Highlands Ranch, CO</a></li>
            </ul>
            <div className="footer-social" style={{ marginTop: 18 }}>
              <a href="#quote" aria-label="Facebook"><I.fb /></a>
              <a href="#quote" aria-label="Instagram"><I.ig /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Monkey Mowing. All rights reserved.</span>
          <span>Made with 🍌 in Highlands Ranch, Colorado</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, QuoteForm, Footer });
