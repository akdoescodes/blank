import { SERVICES } from '../data/site';
import { ArrowUpRight, Glyph } from './Icons';
import { useReveal } from './useReveal';
import './Services.css';

export default function Services() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section services" id="services">
      <div className="bg-grid" />
      <div className="glow services__glow" />

      <div className="shell reveal" ref={ref}>
        <header className="sec-head">
          <div>
            <span className="eyebrow">{SERVICES.eyebrow}</span>
            <h2 className="display-2">{SERVICES.title}</h2>
          </div>
          <p className="sec-head__lede">{SERVICES.lede}</p>
        </header>

        <ul className="services__grid">
          {SERVICES.items.map((s, i) => (
            <li key={s.title} className="service card card--hover">
              <div className="service__head">
                <span className="icon-tile">
                  <Glyph name={s.icon} />
                </span>
                <span className="service__n">{String(i + 1).padStart(2, '0')}</span>
              </div>

              <h3 className="service__title">{s.title}</h3>
              <p className="service__body">{s.body}</p>

              <ul className="service__points">
                {s.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>

              <a href="#contact" className="arrow-link service__link">
                Learn more <ArrowUpRight />
              </a>
            </li>
          ))}
        </ul>

        <a href="#contact" className="arrow-link arrow-link--lg arrow-link--center">
          {SERVICES.cta} <ArrowUpRight width={18} height={18} />
        </a>
      </div>
    </section>
  );
}
