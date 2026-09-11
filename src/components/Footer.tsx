import { useState, type FormEvent } from 'react';
import { CONTACT, FOOTER, NEWSLETTER, SERVICE_LINKS } from '../data/site';
import { subscribeNewsletter } from '../lib/api';
import { Logo } from './Header';
import { ArrowUpRight, Mail, Social } from './Icons';
import SiteLink from './SiteLink';
import './Footer.css';

const SOCIALS = ['linkedin', 'facebook', 'x', 'instagram', 'youtube'] as const;

export default function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  const subscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    // Lands in the newsletter_subscribers table. A repeat signup counts as a
    // success — the API only rejects a genuine failure.
    setBusy(true);
    setNote('');
    try {
      await subscribeNewsletter(email);
      setDone(true);
      setNote('You are on the list.');
      setEmail('');
    } catch (err) {
      setNote(err instanceof Error ? err.message : 'Could not sign you up. Try again.');
    } finally {
      setBusy(false);
    }
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

          <div className="news__side">
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
              <button type="submit" className="btn news__btn" disabled={busy}>
                {busy ? 'Signing up…' : done ? 'Subscribed' : NEWSLETTER.cta} <ArrowUpRight />
              </button>
            </form>

            {note && (
              <p className={`news__note${done ? ' is-done' : ''}`} role="status">
                {note}
              </p>
            )}
          </div>
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
                  <SiteLink to="#top" aria-label={s}>
                    <Social name={s} />
                  </SiteLink>
                </li>
              ))}
            </ul>
          </div>

          <nav className="footer__nav" aria-label="Services">
            <h3>Services</h3>
            <ul>
              {SERVICE_LINKS.map((s) => (
                <li key={s}>
                  <SiteLink to="#services">{s}</SiteLink>
                </li>
              ))}
              <li>
                <SiteLink to="#services" className="footer__all">
                  All services <ArrowUpRight width={14} height={14} />
                </SiteLink>
              </li>
            </ul>
          </nav>

          <nav className="footer__nav" aria-label="Company">
            <h3>Company</h3>
            <ul>
              {FOOTER.company.map((c) => (
                <li key={c.label}>
                  <SiteLink to={c.to}>{c.label}</SiteLink>
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
                <SiteLink to="#top">{l}</SiteLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
