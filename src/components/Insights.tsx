import { INSIGHTS } from '../data/site';
import { ArrowUpRight } from './Icons';
import { useReveal } from './useReveal';
import './Insights.css';

/** Abstract article cover — stands in for the original photography. */
function Cover({ hue }: { hue: number }) {
  return (
    <div className="cover" style={{ ['--cover-hue' as string]: hue }} aria-hidden="true">
      <span className="cover__glow" />
      <svg className="cover__art" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
        <g className="cover__lines">
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M -20 ${20 + i * 20} Q 160 ${i * 20 - 10} 340 ${40 + i * 18}`} />
          ))}
        </g>
        <g className="cover__nodes">
          {[
            [70, 58],
            [148, 92],
            [232, 62],
            [196, 132],
            [96, 124],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === 1 ? 7 : 4} />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default function Insights() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section insights" id="insights">
      <div className="glow insights__glow" />

      <div className="shell reveal" ref={ref}>
        <header className="sec-head">
          <div>
            <span className="eyebrow">{INSIGHTS.eyebrow}</span>
            <h2 className="display-2">{INSIGHTS.title}</h2>
          </div>
          <p className="sec-head__lede">{INSIGHTS.lede}</p>
        </header>

        <ul className="insights__grid">
          {INSIGHTS.items.map((a) => (
            <li key={a.title} className="post card card--hover">
              <div className="post__media">
                <Cover hue={a.hue} />
                <span className="post__category">{a.category}</span>
              </div>

              <div className="post__body">
                <p className="post__meta">
                  <span>{a.date}</span>
                  <span className="post__dot">·</span>
                  <span>{a.read}</span>
                </p>

                <h3 className="post__title">{a.title}</h3>
                <p className="post__excerpt">{a.body}</p>

                <a href="#contact" className="arrow-link post__link">
                  Read the article <ArrowUpRight />
                </a>
              </div>
            </li>
          ))}
        </ul>

        <a href="#insights" className="arrow-link arrow-link--lg arrow-link--center">
          {INSIGHTS.cta} <ArrowUpRight width={18} height={18} />
        </a>
      </div>
    </section>
  );
}
