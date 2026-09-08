import { useState } from 'react';
import { FAQS } from '../data/site';
import { Plus } from './Icons';
import { useReveal } from './useReveal';
import './Faqs.css';

export default function Faqs() {
  const [open, setOpen] = useState<number | null>(0);
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section faqs" id="faqs">
      <div className="glow faqs__glow" />

      <div className="shell reveal" ref={ref}>
        <div className="faqs__layout">
          <div className="faqs__intro">
            <span className="eyebrow">{FAQS.eyebrow}</span>
            <h2 className="display-2">{FAQS.title}</h2>
            <p className="faqs__lede">{FAQS.lede}</p>
          </div>

          <ul className="faqs__list">
            {FAQS.items.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q} className={`faq${isOpen ? ' is-open' : ''}`}>
                  <button
                    className="faq__q"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-btn-${i}`}
                  >
                    <span>{f.q}</span>
                    <span className="faq__toggle">
                      <Plus />
                    </span>
                  </button>

                  {/* Grid 0fr -> 1fr keeps the reveal animatable at natural height. */}
                  <div
                    className="faq__panel"
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-btn-${i}`}
                  >
                    <div className="faq__panel-inner">
                      <p>{f.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
