import { useEffect, useRef, useState } from 'react';
import { ABOUT_LINKS, BRAND, MENU_FOOTNOTE, MENU_PROMO, MENU_SERVICES, NAV } from '../data/site';
import { ArrowUpRight, ChevronDown, Glyph } from './Icons';
import SiteLink from './SiteLink';
import './Header.css';

export const Logo = ({ light = false }: { light?: boolean }) => (
  <SiteLink to="#top" className={`logo${light ? ' logo--light' : ''}`} aria-label={`${BRAND} home`}>
    <svg className="logo__mark" viewBox="0 0 28 32" aria-hidden="true">
      <defs>
        <linearGradient id="lg-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(200 98% 39%)" />
          <stop offset="100%" stopColor="hsl(175 60% 35%)" />
        </linearGradient>
        <linearGradient id="lg-b" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(175 60% 35%)" />
          <stop offset="100%" stopColor="hsl(145 70% 42%)" />
        </linearGradient>
      </defs>
      <path d="M0 4a4 4 0 0 1 4-4h4v32H4a4 4 0 0 1-4-4V4Z" fill="url(#lg-a)" />
      <path d="M11 0h6a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4h-6V0Z" fill="url(#lg-b)" opacity=".9" />
    </svg>
    <span className="logo__word">{BRAND}</span>
  </SiteLink>
);

/** Services mega menu — 3x3 link grid, footnote row, and a promo rail. */
function ServicesMenu() {
  return (
    <div className="mega">
      <div className="mega__main">
        <ul className="mega__grid">
          {MENU_SERVICES.map((s) => (
            <li key={s.title}>
              <SiteLink to="#services" className="mega__link">
                <span className="mega__icon">
                  <Glyph name={s.icon} />
                </span>
                <span className="mega__label">{s.title}</span>
              </SiteLink>
            </li>
          ))}
        </ul>

        <footer className="mega__foot">
          <p>{MENU_FOOTNOTE}</p>
          <SiteLink to="#services" className="arrow-link">
            All services <ArrowUpRight />
          </SiteLink>
        </footer>
      </div>

      <aside className="mega__promo">
        <span className="mega__promo-eyebrow">{MENU_PROMO.eyebrow}</span>
        <h3 className="mega__promo-title">{MENU_PROMO.title}</h3>
        <p className="mega__promo-body">{MENU_PROMO.body}</p>
        <SiteLink to="#contact" className="btn btn--primary mega__promo-cta">
          {MENU_PROMO.cta} <ArrowUpRight />
        </SiteLink>
      </aside>
    </div>
  );
}

function AboutMenu() {
  return (
    <div className="submenu">
      <ul>
        {ABOUT_LINKS.map((a) => (
          <li key={a.title}>
            <SiteLink to={a.to}>
              <span className="submenu__title">{a.title}</span>
              <span className="submenu__body">{a.body}</span>
            </SiteLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close on Escape, and clean up any pending close timer on unmount.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(closeTimer.current);
    };
  }, []);

  /* A short close delay keeps the panel open while the pointer crosses the gap
     between the nav item and the panel itself. */
  const open = (label: string) => {
    window.clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 45);
  };

  return (
    <header
      className={`site-header${scrolled ? ' is-scrolled' : ''}${openMenu ? ' is-menu-open' : ''}`}
    >
      <div className="site-header__bar shell">
        <Logo />

        <nav className="nav" aria-label="Primary">
          {NAV.map((item) => {
            const menu = 'menu' in item ? item.menu : undefined;
            const isOpen = openMenu === item.label;

            return (
              <div
                key={item.label}
                className={`nav__item${menu ? ` has-menu nav__item--${menu}` : ''}${
                  isOpen ? ' is-open' : ''
                }`}
                onMouseEnter={() => menu && open(item.label)}
                onMouseLeave={() => menu && scheduleClose()}
              >
                <SiteLink
                  to={item.href}
                  className="nav__link"
                  aria-expanded={menu ? isOpen : undefined}
                  onFocus={() => menu && open(item.label)}
                >
                  {item.label}
                  {menu && <ChevronDown className="nav__caret" />}
                </SiteLink>

                {menu && (
                  <div className={`nav__panel nav__panel--${menu}`}>
                    {menu === 'services' ? <ServicesMenu /> : <AboutMenu />}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <SiteLink to="#contact" className="btn btn--primary site-header__cta">
          Talk to an Expert <ArrowUpRight />
        </SiteLink>

        <button
          className="burger"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className={`burger__box${mobileOpen ? ' is-open' : ''}`}>
            <i />
            <i />
            <i />
          </span>
        </button>
      </div>

      <div className={`mobile-nav${mobileOpen ? ' is-open' : ''}`}>
        <ul className="shell">
          {NAV.map((item) => {
            const menu = 'menu' in item ? item.menu : undefined;
            const subs: Array<{ title: string; to: string }> =
              menu === 'services'
                ? MENU_SERVICES.map((s) => ({ title: s.title, to: '#services' }))
                : menu === 'about'
                  ? ABOUT_LINKS.map((a) => ({ title: a.title, to: a.to }))
                  : [];

            return (
              <li key={item.label}>
                <SiteLink to={item.href} onClick={() => setMobileOpen(false)}>
                  {item.label}
                </SiteLink>
                {subs.length > 0 && (
                  <ul className="mobile-nav__sub">
                    {subs.map((sub) => (
                      <li key={sub.title}>
                        <SiteLink to={sub.to} onClick={() => setMobileOpen(false)}>
                          {sub.title}
                        </SiteLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
          <li>
            <SiteLink
              to="#contact"
              className="btn btn--primary btn--block"
              onClick={() => setMobileOpen(false)}
            >
              Talk to an Expert <ArrowUpRight />
            </SiteLink>
          </li>
        </ul>
      </div>
    </header>
  );
}
