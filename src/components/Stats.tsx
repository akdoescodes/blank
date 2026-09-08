import { STATS } from '../data/site';
import { ArrowUpRight } from './Icons';
import { useCountUp, useReveal } from './useReveal';
import './Stats.css';

function StatCard({ value, label }: { value: number; label: string }) {
  const { ref, value: n } = useCountUp(value);
  return (
    <li className="stat card">
      <p className="stat__value">
        <span ref={ref}>{n}</span>
        <span className="stat__plus">+</span>
      </p>
      <p className="stat__label">{label}</p>
    </li>
  );
}

export default function Stats() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section section--tight stats">
      <div className="glow stats__glow" />
      <div className="shell reveal" ref={ref}>
        <div className="stats__head">
          <h2 className="display-2 stats__title">{STATS.title}</h2>
          <a href="#work" className="arrow-link">
            {STATS.link} <ArrowUpRight />
          </a>
        </div>

        <ul className="stats__grid">
          {STATS.items.map((s) => (
            <StatCard key={s.label} value={s.value} label={s.label} />
          ))}
        </ul>
      </div>
    </section>
  );
}
