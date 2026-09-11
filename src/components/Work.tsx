import { WORK } from '../data/site';
import { ArrowUpRight } from './Icons';
import { useReveal } from './useReveal';
import './Work.css';

/** Browser frame around the product screenshot. */
function Shot({ src, name }: { src: string; name: string }) {
  return (
    <figure className="shot">
      <span className="shot__bar" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <img src={src} alt={`${name} product interface`} loading="lazy" decoding="async" />
    </figure>
  );
}

export default function Work() {
  const ref = useReveal<HTMLDivElement>();
  const [lead, ...rest] = WORK.items;

  return (
    <section className="section work" id="work">
      <div className="bg-stripes" />
      <div className="glow work__glow" />

      <div className="shell reveal" ref={ref}>
        <header className="sec-head">
          <div>
            <span className="eyebrow">{WORK.eyebrow}</span>
            <h2 className="display-2">{WORK.title}</h2>
          </div>
          <p className="sec-head__lede">{WORK.lede}</p>
        </header>

        {/* ── Lead case study: media left, detail right ─────────────────── */}
        <article className="case case--lead card">
          <div className="case__media">
            <Shot src={lead.shot} name={lead.name} />
          </div>

          <div className="case__body">
            <ul className="case__tags">
              {lead.tags.map((t, i) => (
                <li key={t} className={`chip${i === 0 ? ' chip--accent' : ''}`}>
                  {t}
                </li>
              ))}
            </ul>

            <h3 className="case__title">{lead.tagline}</h3>
            <p className="case__text">{lead.body}</p>

            <ul className="case__metrics">
              {lead.metrics.map((m) => (
                <li key={m.label}>
                  <span className="case__metric-value">{m.value}</span>
                  <span className="case__metric-label">{m.label}</span>
                </li>
              ))}
            </ul>

            <footer className="case__foot">
              <span className="case__stack">{lead.stack}</span>
              <a href="#contact" className="arrow-link case__link">
                {lead.link} <ArrowUpRight />
              </a>
            </footer>
          </div>
        </article>

        {/* ── Secondary case studies ───────────────────────────────────── */}
        <div className="work__pair">
          {rest.map((p) => (
            <article key={p.name} className="case case--sm card">
              <div className="case__media">
                <Shot src={p.shot} name={p.name} />
              </div>

              <div className="case__body">
                <ul className="case__tags">
                  {p.tags.map((t) => (
                    <li key={t} className="chip chip--accent">
                      {t}
                    </li>
                  ))}
                </ul>

                <h3 className="case__title case__title--sm">{p.tagline}</h3>
                <p className="case__text">{p.body}</p>

                <ul className="case__metrics case__metrics--inline">
                  {p.metrics.map((m) => (
                    <li key={m.label}>
                      <span className="case__metric-value">{m.value}</span>
                      <span className="case__metric-label">{m.label}</span>
                    </li>
                  ))}
                </ul>

                <footer className="case__foot">
                  <span className="case__stack">{p.stack}</span>
                  <a href="#contact" className="arrow-link case__link">
                    {p.link} <ArrowUpRight />
                  </a>
                </footer>
              </div>
            </article>
          ))}
        </div>

        <a href="#contact" className="arrow-link arrow-link--lg arrow-link--center">
          {WORK.cta} <ArrowUpRight width={18} height={18} />
        </a>
      </div>
    </section>
  );
}
