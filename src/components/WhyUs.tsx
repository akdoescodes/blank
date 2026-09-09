import { WHY } from '../data/site';
import { ArrowUpRight } from './Icons';
import { useReveal } from './useReveal';
import './WhyUs.css';

export default function WhyUs() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section why" id="why">
      <div className="bg-dots" />
      <div className="glow why__glow" />

      <div className="shell reveal" ref={ref}>
        <div className="why__layout">
          <div className="why__intro">
            <span className="eyebrow">{WHY.eyebrow}</span>
            <h2 className="display-2 why__title">{WHY.title}</h2>
            <p className="why__body">{WHY.body}</p>

            <ul className="why__pills">
              {WHY.pills.map((p) => (
                <li key={p} className="why__pill">
                  <span className="why__pill-dot" />
                  {p}
                </li>
              ))}
            </ul>

            <a href="#process" className="arrow-link arrow-link--lg why__cta">
              {WHY.cta} <ArrowUpRight width={18} height={18} />
            </a>
          </div>

          <ul className="why__points">
            {WHY.points.map((p) => (
              <li key={p.n} className="why-point">
                <span className="why-point__n">{p.n}</span>
                <div className="why-point__main">
                  <h3 className="why-point__title">{p.title}</h3>
                  <p className="why-point__body">{p.body}</p>
                </div>
                <ArrowUpRight className="why-point__arrow" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
