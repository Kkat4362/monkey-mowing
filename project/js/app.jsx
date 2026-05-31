/* app.jsx — root: tweaks, theme wiring, composition */
const { useState: useS, useEffect: useE } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#54be1f",
  "headline": "Lawn care that goes *bananas*.",
  "play": "playful",
  "fonts": "fredoka"
}/*EDITMODE-END*/;

const ACCENT_OPTS = ['#54be1f', '#3f9e16', '#74d83d', '#2f8a13', '#86c80f'];
const HEADLINES = [
  'Lawn care that goes *bananas*.',
  'Your lawn, *freshly* mowed.',
  'We mow. You *relax*.',
  'The *greenest* crew in Highlands Ranch.',
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [dir, setDir] = useS('sunny');

  useRevealObserver();

  // apply theme tweaks
  useE(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-deep', `color-mix(in oklab, ${t.accent}, #06210a 34%)`);
    root.setAttribute('data-fonts', t.fonts);
  }, [t.accent, t.fonts]);

  return (
    <React.Fragment>
      <Nav />
      <main>
        <Hero dir={dir} setDir={setDir} headline={t.headline} play={t.play} />
        <Stats />
        <Services />
        <Estimator />
        <Process />
        <Pricing />
        <BeforeAfter />
        <About />
        <FAQ />
        <QuoteForm />
      </main>
      <Footer />

      <TweaksPanel>
        <TweakSection label="Brand color" />
        <TweakColor label="Accent green" value={t.accent} options={ACCENT_OPTS} onChange={v => setTweak('accent', v)} />

        <TweakSection label="Hero headline" />
        <TweakSelect label="Preset" value={HEADLINES.includes(t.headline) ? t.headline : 'custom'}
          options={[...HEADLINES, 'custom']} onChange={v => v !== 'custom' && setTweak('headline', v)} />
        <TweakText label="Custom text" value={t.headline} onChange={v => setTweak('headline', v)} />
        <p style={{ margin: '2px 2px 0', fontSize: 11.5, color: '#8a978a', lineHeight: 1.4 }}>Wrap a word in *asterisks* to highlight it.</p>

        <TweakSection label="Personality" />
        <TweakRadio label="Playfulness" value={t.play} options={['chill', 'playful', 'bananas']} onChange={v => setTweak('play', v)} />

        <TweakSection label="Typography" />
        <TweakSelect label="Font pairing" value={t.fonts}
          options={['fredoka', 'baloo', 'grot']} onChange={v => setTweak('fonts', v)} />
        <p style={{ margin: '2px 2px 0', fontSize: 11.5, color: '#8a978a', lineHeight: 1.4 }}>fredoka · baloo · grot (Bricolage)</p>
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
