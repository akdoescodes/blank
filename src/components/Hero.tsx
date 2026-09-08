import { HERO } from '../data/site';
import { ArrowUpRight } from './Icons';
import './Hero.css';

/**
 * Floating rounded-square field behind the headline.
 * Positions mirror nexasoftech.com; hues come from the home-hero.html palette
 * (teal / primary blue / green) in place of the original pink and orange.
 */
const BLOBS = [
  { l: '2%', t: '62%', s: 160, hue: 'a', d: 0 },
  { l: '3%', t: '14%', s: 260, hue: 'b', d: 1.4 },
  { l: '12%', t: '32%', s: 210, hue: 'c', d: 2.6 },
  { l: '25%', t: '0%', s: 130, hue: 'a', d: 0.8 },
  { l: '34%', t: '9%', s: 180, hue: 'b', d: 3.2 },
  { l: '35%', t: '46%', s: 200, hue: 'c', d: 1.9 },
  { l: '58%', t: '55%', s: 175, hue: 'a', d: 2.2 },
  { l: '68%', t: '2%', s: 145, hue: 'c', d: 0.4 },
  { l: '66%', t: '18%', s: 230, hue: 'b', d: 3.6 },
  { l: '84%', t: '30%', s: 200, hue: 'a', d: 1.1 },
  { l: '90%', t: '62%', s: 165, hue: 'b', d: 2.9 },
];

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__field" aria-hidden="true">
        {BLOBS.map((b, i) => (
          <span
            key={i}
            className={`hero__blob hero__blob--${b.hue}`}
            style={{
              left: b.l,
              top: b.t,
              width: b.s,
              height: b.s,
              animationDelay: `${b.d}s`,
            }}
          />
        ))}
      </div>

      <div className="hero__inner shell">
        <p className="hero__badge">
          <span className="hero__badge-dot" />
          {HERO.badge}
        </p>

        <h1 className="hero__title display-1">
          {HERO.titleTop}
          <br />
          <span className="text-gradient">{HERO.titleAccent}</span>
        </h1>

        <p className="hero__body">{HERO.body}</p>

        <a href="#contact" className="btn btn--primary btn--lg hero__cta">
          {HERO.cta} <ArrowUpRight width={18} height={18} />
        </a>

        <p className="hero__note">{HERO.note}</p>
      </div>
    </section>
  );
}
