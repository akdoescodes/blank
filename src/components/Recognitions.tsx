import { RECOGNITION } from '../data/site';
import { Star } from './Icons';
import { useReveal } from './useReveal';
import './Recognitions.css';

function Badge({ kind }: { kind: 'businessfirms' | 'shopify' }) {
  if (kind === 'shopify') {
    return (
      <span className="badge__inner badge__inner--shopify">
        <svg viewBox="0 0 48 54" className="badge__bag" aria-hidden="true">
          <path
            d="M33.5 9.6c-.2 0-3.4.2-3.4.2s-2.7-2.6-3-2.9c-.3-.3-.9-.2-1.1-.1 0 0-.6.2-1.5.5-.9-2.6-2.5-5-5.3-5h-.3C18.1.9 17.1.4 16.2.4c-6.5 0-9.6 8.2-10.6 12.3l-4.6 1.4c-1.4.4-1.4.5-1.6 1.8L0 47.8l29.4 5.5 16-3.4S33.8 9.7 33.5 9.6ZM22.9 7.7l-2.5.8c0-1.9-.3-4.4-1.2-6 1.9.4 3.1 2.5 3.7 5.2Zm-5.1-4.5c1 2 1.2 4.7 1.2 6.3l-5.2 1.6c1-3.8 2.9-5.7 4-6.6.1-.1.2-.2 0-1.3Zm-2-1.8c.4 0 .8.1 1.2.4-1.5.7-3.2 2.5-3.9 6.2l-4.1 1.3C10.1 8.4 12.6 1.4 15.8 1.4Z"
            fill="currentColor"
          />
        </svg>
        <span className="badge__word">
          shopify
          <em>partners</em>
        </span>
      </span>
    );
  }

  return (
    <span className="badge__inner badge__inner--bf">
      <svg viewBox="0 0 100 110" className="badge__hex" aria-hidden="true">
        <path d="M50 2 95 27v56L50 108 5 83V27L50 2Z" fill="currentColor" />
      </svg>
      <span className="badge__bf">
        <span className="badge__verified">Verified</span>
        <strong>BusinessFirms</strong>
        <span className="badge__stars">
          {Array.from({ length: 4 }, (_, i) => (
            <Star key={i} width={9} height={9} />
          ))}
        </span>
      </span>
    </span>
  );
}

export default function Recognitions() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section section--tight recognitions">
      <div className="glow recognitions__glow" />

      <div className="shell reveal" ref={ref}>
        <header className="sec-head sec-head--center">
          <h2 className="display-2">{RECOGNITION.title}</h2>
          <p className="sec-head__lede">{RECOGNITION.lede}</p>
        </header>

        <ul className="recognitions__row">
          {RECOGNITION.items.map((b) => (
            <li key={b.title} className="badge" title={b.title}>
              <Badge kind={b.kind} />
              <span className="badge__caption">{b.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
