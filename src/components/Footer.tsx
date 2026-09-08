import { useState, type FormEvent } from 'react';
import { CONTACT, FOOTER, NEWSLETTER, SERVICE_LINKS } from '../data/site';
import { Logo } from './Header';
import { ArrowUpRight, Mail, Social } from './Icons';
import './Footer.css';

const SOCIALS = ['linkedin', 'facebook', 'x', 'instagram', 'youtube'] as const;

export default function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    // No backend wired up yet — point this at your list provider.
    setDone(true);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="shell footer__inner">
        {/* ── Newsletter ─────────────────────────────────────────────────── */}
        <div className="news">
          <div className="news__text">
            <span className="news__eyebrow">{NEWSLETTER.eyebrow}</span>
            <h2 className="news__title">{NEWSLETTER.title}</h2>
            <p className="news__body">{NEWSLETTER.body}</p>
          </div>

          <form className="news__form" onSubmit={subscribe}>
            <span className="news__icon">
              <Mail />
            </span>
            <input
              type="email"
              placeholder="you@company.com"
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn news__btn">
              {done ? 'Subscribed' : NEWSLETTER.cta} <ArrowUpRight />
            </button>
          </form>
        </div>

        <hr className="footer__rule" />

        {/* ── Columns ────────────────────────────────────────────────────── */}
        <div className="footer__cols">
          <div className="footer__brand">
            <Logo light />

            <ul className="footer__contact">
              <li>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </li>
              <li>
                <a href={`tel:${CONTACT.phone.replace(/[^\d+]/g, '')}`}>{CONTACT.phone}</a>
              </li>
              <li className="footer__address">{CONTACT.address}</li>
            </ul>

            <ul className="footer__social">
              {SOCIALS.map((s) => (
                <li key={s}>
                  <a href="#top" aria-label={s}>
                    <Social name={s} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav className="footer__nav" aria-label="Services">
            <h3>Services</h3>
            <ul>
              {SERVICE_LINKS.map((s) => (
                <li key={s}>
                  <a href="#services">{s}</a>
                </li>
              ))}
              <li>
                <a href="#services" className="footer__all">
                  All services <ArrowUpRight width={14} height={14} />
                </a>
              </li>
            </ul>
          </nav>

          <nav className="footer__nav" aria-label="Company">
            <h3>Company</h3>
            <ul>
              {FOOTER.company.map((c) => (
                <li key={c}>
                  <a href="#top">{c}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer__base">
          <p>{FOOTER.copyright}</p>
          <ul className="footer__legal">
            {FOOTER.legal.map((l) => (
              <li key={l}>
                <a href="#top">{l}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
