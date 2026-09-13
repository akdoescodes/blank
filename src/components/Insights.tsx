import { Link } from 'react-router-dom';
import { INSIGHTS, readTime } from '../data/site';
import { ArrowUpRight } from './Icons';
import { useReveal } from './useReveal';
import './Insights.css';

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
            <li key={a.slug} className="post card card--hover">
              <div className="post__media">
                <img className="post__img" src={a.cover} alt="" loading="lazy" decoding="async" />
                <span className="post__category">{a.category}</span>
              </div>

              <div className="post__body">
                <p className="post__meta">
                  <span>{a.date}</span>
                  <span className="post__dot">·</span>
                  <span>{readTime(a.content)}</span>
                </p>

                {/* Stretched over the whole card — see .post__cover. */}
                <h3 className="post__title">
                  <Link to={`/blog/${a.slug}`} className="post__cover">
                    {a.title}
                  </Link>
                </h3>
                <p className="post__excerpt">{a.body}</p>

                <span className="arrow-link post__link" aria-hidden="true">
                  Read the article <ArrowUpRight />
                </span>
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
