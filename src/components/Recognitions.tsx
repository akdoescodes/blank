import { SiShopify } from 'react-icons/si';
import { RECOGNITION } from '../data/site';
import { Star } from './Icons';
import { useReveal } from './useReveal';
import './Recognitions.css';

type BadgeItem = (typeof RECOGNITION.items)[number];

function Badge({ item }: { item: BadgeItem }) {
  // A supplied artwork file wins over the drawn fallbacks below. Drop the real
  // badge in public/img/ and set `logo` on the item in src/data/site.ts.
  if ('logo' in item && item.logo) {
    return (
      <span className="badge__inner">
        <img className="badge__img" src={item.logo} alt={item.title} loading="lazy" />
      </span>
    );
  }

  if (item.kind === 'shopify') {
    return (
      <span className="badge__inner badge__inner--shopify">
        {/* The official Shopify mark, via Simple Icons. */}
        <SiShopify className="badge__bag" aria-hidden="true" />
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
              <Badge item={b} />
              <span className="badge__caption">{b.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
