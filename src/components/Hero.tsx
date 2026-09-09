import { useEffect, useMemo, useState } from 'react';
import { HERO } from '../data/site';
import { ArrowUpRight } from './Icons';
import SiteLink from './SiteLink';
import './Hero.css';

/* ── Rotating place name ────────────────────────────────────────────────── */
function Rotator() {
  const [i, setI] = useState(0);
  const longest = useMemo(
    () => HERO.places.reduce((a, b) => (b.length > a.length ? b : a), ''),
    []
  );

  useEffect(() => {
    const reduced =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % HERO.places.length), 2200);
    return () => window.clearInterval(id);
  }, []);

  return (
    /* The longest name is drawn as CSS generated content to reserve the width,
       so the line never jumps and the h1 text stays just one place name. */
    <span className="rotator" data-longest={longest}>
      <span key={i} className="rotator__word text-gradient">
        {HERO.places[i]}
      </span>
    </span>
  );
}

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__inner shell">
        <h1 className="hero__title">
          <span className="hero__lead">{HERO.titleLead}</span>
          <span className="hero__line2">
            {HERO.titlePrefix} <Rotator />
          </span>
        </h1>

        <div className="hero__actions">
          <SiteLink to="#contact" className="btn btn--primary btn--lg">
            {HERO.cta} <ArrowUpRight width={18} height={18} />
          </SiteLink>
          <p className="hero__note">{HERO.note}</p>
        </div>
      </div>
    </section>
  );
}
