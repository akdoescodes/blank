import { INDUSTRIES } from '../data/site';
import { Glyph } from './Icons';
import { useReveal } from './useReveal';
import './Industries.css';

export default function Industries() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section industries">
      <div className="bg-grid industries__grid-bg" />

      <div className="shell reveal" ref={ref}>
        <header className="sec-head">
          <div>
            <span className="eyebrow">{INDUSTRIES.eyebrow}</span>
            <h2 className="display-2">{INDUSTRIES.title}</h2>
          </div>
          <p className="sec-head__lede">{INDUSTRIES.lede}</p>
        </header>

        <ul className="industries__grid">
          {INDUSTRIES.items.map((it) => (
            <li key={it.title} className="industry card card--hover">
              <span className="icon-tile industry__icon">
                <Glyph name={it.icon} />
              </span>
              <h3 className="industry__title">{it.title}</h3>
              <p className="industry__sub">{it.sub}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
