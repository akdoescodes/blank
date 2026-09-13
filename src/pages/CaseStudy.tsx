import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { BRAND, WORK } from '../data/site';
import { ArrowUpRight } from '../components/Icons';
import SiteLink from '../components/SiteLink';
import { Shot } from '../components/Work';
import { useReveal } from '../components/useReveal';
import '../components/Work.css'; // .shot, .chip
import './CaseStudy.css';

/** Full case study at /work/:slug, built from the same WORK.items as the cards. */
export default function CaseStudy() {
  const { slug } = useParams();
  const index = WORK.items.findIndex((w) => w.slug === slug);
  const item = WORK.items[index];

  const heroRef = useReveal<HTMLDivElement>();
  const bodyRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    if (item) document.title = `${item.name} case study — ${BRAND}`;
  }, [item]);

  // Unknown slug: back to the Work section rather than a blank page.
  if (!item) return <Navigate to="/" state={{ scrollTo: 'work' }} replace />;

  const { detail } = item;
  const next = WORK.items[(index + 1) % WORK.items.length];

  const facts = [
    { label: 'Client', value: detail.client },
    { label: 'Industry', value: detail.industry },
    { label: 'Region', value: detail.region },
  ];

  return (
    <>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <section className="section cs-hero">
        <div className="bg-dots" />
        <div className="glow cs-hero__glow" />

        <div className="shell reveal" ref={heroRef}>
          <SiteLink to="#work" className="cs-back">
            <span aria-hidden="true">←</span> All work
          </SiteLink>

          <ul className="cs-hero__tags">
            {item.tags.map((t) => (
              <li key={t} className="chip chip--accent">
                {t}
              </li>
            ))}
          </ul>

          <h1 className="cs-hero__title">{item.name}</h1>
          <p className="cs-hero__tagline">{item.tagline}</p>
          <p className="cs-hero__summary">{detail.summary}</p>

          <dl className="cs-facts">
            {facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
            <div className="cs-facts__wide">
              <dt>What we delivered</dt>
              <dd>{detail.services.join(' · ')}</dd>
            </div>
          </dl>

          <div className="cs-shot">
            <Shot src={item.shot} name={item.name} />
          </div>
        </div>
      </section>

      <div className="reveal" ref={bodyRef}>
        {/* ── Results ───────────────────────────────────────────────────── */}
        <section className="section section--tight cs-results">
          <div className="shell">
            <ul className="cs-results__grid">
              {detail.results.map((r) => (
                <li key={r.label} className="cs-result">
                  <span className="cs-result__value">{r.value}</span>
                  <span className="cs-result__label">{r.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Challenge ─────────────────────────────────────────────────── */}
        <section className="section cs-split">
          <div className="shell cs-split__inner">
            <div>
              <span className="eyebrow">The challenge</span>
              <h2 className="cs-h2">What was in the way.</h2>
            </div>
            <p className="cs-prose">{detail.challenge}</p>
          </div>
        </section>

        {/* ── Approach ──────────────────────────────────────────────────── */}
        <section className="section cs-approach">
          <div className="glow cs-approach__glow" />
          <div className="shell">
            <header className="sec-head">
              <div>
                <span className="eyebrow">Our approach</span>
                <h2 className="display-2">How we built it.</h2>
              </div>
            </header>

            <ol className="cs-steps">
              {detail.approach.map((s, i) => (
                <li key={s.title} className="cs-step card">
                  <span className="cs-step__n">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="cs-step__title">{s.title}</h3>
                  <p className="cs-step__body">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────────────────── */}
        <section className="section cs-features">
          <div className="shell">
            <header className="sec-head">
              <div>
                <span className="eyebrow">Inside the product</span>
                <h2 className="display-2">What it does.</h2>
              </div>
            </header>

            <ul className="cs-feature-grid">
              {detail.features.map((f) => (
                <li key={f.title} className="cs-feature">
                  <span className="cs-feature__dot" aria-hidden="true" />
                  <h3 className="cs-feature__title">{f.title}</h3>
                  <p className="cs-feature__body">{f.body}</p>
                </li>
              ))}
            </ul>

            <div className="cs-stack">
              <span className="cs-stack__label">Built with</span>
              <ul>
                {detail.stack.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Next + CTA ────────────────────────────────────────────────── */}
        <section className="section cs-next">
          <div className="shell cs-next__inner">
            <Link to={`/work/${next.slug}`} className="cs-next__card card card--hover">
              <span className="cs-next__eyebrow">Next case study</span>
              <span className="cs-next__name">{next.name}</span>
              <span className="cs-next__tagline">{next.tagline}</span>
              <span className="arrow-link">
                Read it <ArrowUpRight />
              </span>
            </Link>

            <div className="cs-cta card">
              <h2 className="cs-cta__title">Building something like this?</h2>
              <p className="cs-cta__body">
                Tell us what you are working on. You will talk to an engineer, not a salesperson.
              </p>
              <SiteLink to="#contact" className="btn btn--primary">
                Talk to an Expert <ArrowUpRight />
              </SiteLink>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
