import { TECH } from '../data/site';
import { TECH_ICONS } from './techIcons';
import { useReveal } from './useReveal';
import './Technologies.css';

function Pill({ name }: { name: string }) {
  const entry = TECH_ICONS[name];
  const Icon = entry?.Icon;

  return (
    <span className="tech-pill">
      {Icon && (
        <span className="tech-pill__mark" style={{ color: entry.color }}>
          <Icon aria-hidden="true" />
        </span>
      )}
      {name}
    </span>
  );
}

export default function Technologies() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section tech">
      <div className="glow tech__glow" />

      <div className="shell reveal" ref={ref}>
        <header className="sec-head">
          <div>
            <span className="eyebrow">{TECH.eyebrow}</span>
            <h2 className="display-2">{TECH.title}</h2>
          </div>
          <p className="sec-head__lede">{TECH.lede}</p>
        </header>
      </div>

      <div className="tech__rows">
        {TECH.rows.map((row, i) => (
          <div className="tech-row" key={row.label}>
            <div className="shell tech-row__inner">
              <p className="tech-row__label">{row.label}</p>

              <div className="marquee">
                <div
                  className={`marquee__track${i % 2 ? ' is-reverse' : ''}`}
                  style={{ animationDuration: `${18 + row.items.length * 2}s` }}
                >
                  {[0, 1].map((copy) => (
                    <div className="marquee__group" key={copy} aria-hidden={copy === 1}>
                      {row.items.map((t) => (
                        <Pill key={t} name={t} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
