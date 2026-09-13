import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { BRAND, INSIGHTS, readTime, type ArticleBlock } from '../data/site';
import { ArrowUpRight } from '../components/Icons';
import SiteLink from '../components/SiteLink';
import './Article.css';

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2>{block.text}</h2>;
    case 'ul':
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'quote':
      return <blockquote>{block.text}</blockquote>;
    default:
      return <p>{block.text}</p>;
  }
}

/** Full article at /blog/:slug, from the same INSIGHTS.items as the cards. */
export default function Article() {
  const { slug } = useParams();
  const article = INSIGHTS.items.find((a) => a.slug === slug);

  useEffect(() => {
    if (article) document.title = `${article.title} — ${BRAND}`;
  }, [article]);

  if (!article) return <Navigate to="/" state={{ scrollTo: 'insights' }} replace />;

  const more = INSIGHTS.items.filter((a) => a.slug !== article.slug);
  const initials = article.author.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);

  return (
    <article className="art">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="section art-hero">
        <div className="bg-dots" />
        <div className="glow art-hero__glow" />

        <div className="shell art-hero__inner">
          <SiteLink to="#insights" className="art-back">
            <span aria-hidden="true">←</span> All articles
          </SiteLink>

          <span className="art-hero__category">{article.category}</span>
          <h1 className="art-hero__title">{article.title}</h1>
          <p className="art-hero__lede">{article.body}</p>

          <div className="art-byline">
            <span className="art-byline__avatar" aria-hidden="true">
              {initials}
            </span>
            <span className="art-byline__who">
              <span className="art-byline__name">{article.author.name}</span>
              <span className="art-byline__role">{article.author.role}</span>
            </span>
            <span className="art-byline__meta">
              <time>{article.date}</time>
              <span aria-hidden="true">·</span>
              <span>{readTime(article.content)}</span>
            </span>
          </div>
        </div>
      </header>

      <div className="shell">
        <figure className="art-cover">
          <img src={article.cover} alt="" />
        </figure>

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <div className="art-prose">
          {article.content.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        <aside className="art-cta card">
          <div>
            <h2 className="art-cta__title">Want a second opinion on your build?</h2>
            <p className="art-cta__body">
              Book a 30-minute technical call. You will talk to an engineer, not a salesperson.
            </p>
          </div>
          <SiteLink to="#contact" className="btn btn--primary">
            Talk to an Expert <ArrowUpRight />
          </SiteLink>
        </aside>
      </div>

      {/* ── More articles ───────────────────────────────────────────────── */}
      <section className="section art-more">
        <div className="shell">
          <h2 className="art-more__title">Keep reading</h2>
          <ul className="art-more__grid">
            {more.map((a) => (
              <li key={a.slug}>
                <Link to={`/blog/${a.slug}`} className="art-more__card card card--hover">
                  <img src={a.cover} alt="" loading="lazy" decoding="async" />
                  <span className="art-more__body">
                    <span className="art-more__category">{a.category}</span>
                    <span className="art-more__name">{a.title}</span>
                    <span className="art-more__meta">
                      {a.date} · {readTime(a.content)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
