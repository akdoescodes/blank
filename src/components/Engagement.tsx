import { ENGAGE } from '../data/site';
import { useReveal } from './useReveal';
import './Engagement.css';

export default function Engagement() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section engage">
      <div className="glow engage__glow" />

      <div className="shell reveal" ref={ref}>
        <header className="sec-head">
          <div>
            <span className="eyebrow">{ENGAGE.eyebrow}</span>
            <h2 className="display-2">{ENGAGE.title}</h2>
          </div>
          <p className="sec-head__lede">{ENGAGE.lede}</p>
        </header>

        <ul className="engage__grid">
          {ENGAGE.items.map((m) => (
            <li key={m.title} className="model card card--hover">
              <span className="chip chip--accent model__tag">{m.tag}</span>

              <h3 className="model__title">{m.title}</h3>
              <p className="model__sub">{m.sub}</p>
              <p className="model__body">{m.body}</p>

              <ul className="model__features">
                {m.features.map((f) => (
                  <li key={f}>
                    <span className="model__bullet" />
                    {f}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
