import { useState } from 'react';
import { TESTIMONIALS } from '../data/site';
import { ChevronLeft, ChevronRight, Star } from './Icons';
import { useReveal } from './useReveal';
import './Testimonials.css';

const PER_PAGE = 3;
const PAGES = Math.ceil(TESTIMONIALS.items.length / PER_PAGE);

export default function Testimonials() {
  const [page, setPage] = useState(0);
  const ref = useReveal<HTMLDivElement>();

  const go = (dir: number) => setPage((p) => (p + dir + PAGES) % PAGES);

  return (
    <section className="section quotes">
      <div className="quotes__rings" aria-hidden="true">
        <span /><span /><span /><span />
      </div>
      <div className="glow quotes__glow" />

      <div className="shell reveal" ref={ref}>
        <div className="quotes__head">
          <div className="quotes__head-text">
            <span className="quotes__mark" aria-hidden="true">
              &ldquo;
            </span>
            <span className="eyebrow">{TESTIMONIALS.eyebrow}</span>
            <h2 className="display-2">{TESTIMONIALS.title}</h2>
          </div>

          <div className="quotes__nav">
            <button onClick={() => go(-1)} aria-label="Previous testimonials">
              <ChevronLeft />
            </button>
            <button onClick={() => go(1)} aria-label="Next testimonials">
              <ChevronRight />
            </button>
          </div>
        </div>

        <div className="quotes__viewport">
          <div className="quotes__track" style={{ transform: `translateX(-${page * 100}%)` }}>
            {Array.from({ length: PAGES }, (_, p) => (
              <ul className="quotes__page" key={p}>
                {TESTIMONIALS.items.slice(p * PER_PAGE, p * PER_PAGE + PER_PAGE).map((t, i) => (
                  <li key={`${t.name}-${i}`} className="quote card">
                    <div className="quote__stars" aria-label="5 out of 5">
                      {Array.from({ length: 5 }, (_, s) => (
                        <Star key={s} />
                      ))}
                    </div>

                    <p className="quote__text">{t.quote}</p>

                    <footer className="quote__author">
                      <img className="quote__avatar" src={t.avatar} alt="" loading="lazy" decoding="async" />
                      <span>
                        <span className="quote__name">{t.name}</span>
                        <span className="quote__role">{t.role}</span>
                      </span>
                    </footer>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <div className="quotes__dots">
          {Array.from({ length: PAGES }, (_, p) => (
            <button
              key={p}
              className={p === page ? 'is-active' : ''}
              onClick={() => setPage(p)}
              aria-label={`Go to testimonial page ${p + 1}`}
              aria-current={p === page}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
