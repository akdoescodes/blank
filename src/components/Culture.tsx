import { useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from 'react';
import { CULTURE } from '../data/site';
import { useReveal } from './useReveal';
import './Culture.css';

const COUNT = CULTURE.items.length;
const AUTO_MS = 4500;
const SWIPE_PX = 32;

/** One card, cycling through the four items — the phone layout below 560px. */
function CultureCarousel() {
  const [active, setActive] = useState(0);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % COUNT), AUTO_MS);
    return () => window.clearInterval(id);
    // Restart the clock on every manual pick, so a dot tap does not get
    // immediately overtaken by the next auto-advance.
  }, [active]);

  const go = (i: number) => setActive((i + COUNT) % COUNT);

  const onTouchStart = (e: ReactTouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: ReactTouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < SWIPE_PX) return;
    go(active + (dx < 0 ? 1 : -1));
  };

  return (
    <div className="culture__carousel">
      <div className="cult cult--carousel" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {CULTURE.items.map((c, i) => (
          <div key={c.title} className={`cult__slide${i === active ? ' is-active' : ''}`} aria-hidden={i !== active}>
            <img
              className="cult__img"
              src={c.img}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
            <div className="cult__scrim" />

            <div className="cult__body">
              <span className="cult__tag">{c.tag}</span>
              <h3 className="cult__title">{c.title}</h3>
              <p className="cult__text">{c.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="culture__dots" role="tablist" aria-label="Culture highlights">
        {CULTURE.items.map((c, i) => (
          <button
            key={c.title}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={c.title}
            className={`culture__dot${i === active ? ' is-active' : ''}`}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default function Culture() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section culture">
      <div className="glow culture__glow" />

      <div className="shell reveal" ref={ref}>
        <header className="sec-head">
          <div>
            <span className="eyebrow">{CULTURE.eyebrow}</span>
            <h2 className="display-2">{CULTURE.title}</h2>
          </div>
          <p className="sec-head__lede">{CULTURE.lede}</p>
        </header>

        {/* Tablet and up: all four cards side by side. CSS swaps this for the
            carousel below on phones — see the max-width: 560px block. */}
        <ul className="culture__grid">
          {CULTURE.items.map((c) => (
            <li key={c.title} className="cult">
              <img className="cult__img" src={c.img} alt="" loading="lazy" decoding="async" />
              <div className="cult__scrim" />

              <div className="cult__body">
                <span className="cult__tag">{c.tag}</span>
                <h3 className="cult__title">{c.title}</h3>
                <p className="cult__text">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <CultureCarousel />
      </div>
    </section>
  );
}
