import { CULTURE } from '../data/site';
import { useReveal } from './useReveal';
import './Culture.css';

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
      </div>
    </section>
  );
}
