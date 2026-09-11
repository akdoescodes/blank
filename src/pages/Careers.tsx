import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  CAREERS_APPLY,
  CAREERS_EMAIL,
  CAREERS_FAQS,
  CAREERS_FIT,
  CAREERS_HERO,
  CAREERS_HIRING,
  CAREERS_STATUS,
  CAREERS_WORK,
} from '../data/site';
import { submitInternApplication } from '../lib/api';
import { ArrowUpRight, Check, Close, Glyph, Plus, Upload } from '../components/Icons';
import { useReveal } from '../components/useReveal';
// This page reuses the accordion and form styling from the homepage sections.
import '../components/Faqs.css';
import '../components/Contact.css';
import './Careers.css';

const MAX_MB = 10;

/* ── Hero ───────────────────────────────────────────────────────────────── */
function CareersHero() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section careers-hero">
      <div className="bg-dots" />
      <div className="glow careers-hero__glow" />

      <div className="shell reveal" ref={ref}>
        <div className="careers-hero__layout">
          <div className="careers-hero__text">
            <span className="eyebrow">{CAREERS_HERO.eyebrow}</span>
            <h1 className="display-1 careers-hero__title">{CAREERS_HERO.title}</h1>
            <p className="careers-hero__body">{CAREERS_HERO.body}</p>

            <div className="careers-hero__actions">
              <a href="#apply" className="btn btn--primary btn--lg">
                {CAREERS_HERO.primary} <ArrowUpRight width={18} height={18} />
              </a>
              <a href="#hiring" className="arrow-link">
                {CAREERS_HERO.secondary} <ArrowUpRight />
              </a>
            </div>
          </div>

          {/* Orbit diagram: "You here" at the centre, the work around it. */}
          <div className="orbit" aria-hidden="true">
            <span className="orbit__ring orbit__ring--outer" />
            <span className="orbit__ring orbit__ring--inner" />
            <span className="orbit__dot orbit__dot--a" />
            <span className="orbit__dot orbit__dot--b" />

            <span className="orbit__centre">{CAREERS_HERO.centre}</span>
            {CAREERS_HERO.orbit.map((label, i) => (
              <span key={label} className={`orbit__chip orbit__chip--${i + 1}`}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Status + stats bar */}
        <div className="status card">
          <div className="status__lead">
            <h2 className="status__title">{CAREERS_STATUS.title}</h2>
            <p className="status__body">{CAREERS_STATUS.body}</p>
          </div>

          {CAREERS_STATUS.stats.map((s) => (
            <div key={s.value} className="status__stat">
              <p className="status__value">{s.value}</p>
              <p className="status__label">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── What the job gives you ─────────────────────────────────────────────── */
function TheWork() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section careers-work">
      <div className="bg-grid" />
      <div className="glow careers-work__glow" />

      <div className="shell reveal" ref={ref}>
        <header className="sec-head">
          <div>
            <span className="eyebrow">{CAREERS_WORK.eyebrow}</span>
            <h2 className="display-2">{CAREERS_WORK.title}</h2>
          </div>
          <p className="sec-head__lede">{CAREERS_WORK.lede}</p>
        </header>

        <ul className="perks">
          {CAREERS_WORK.items.map((it) => (
            <li key={it.title} className="perk card card--hover">
              <span className="icon-tile">
                <Glyph name={it.icon} />
              </span>
              <h3 className="perk__title">{it.title}</h3>
              <p className="perk__body">{it.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Fit ────────────────────────────────────────────────────────────────── */
function Fit() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section fit">
      <div className="glow fit__glow" />

      <div className="shell reveal" ref={ref}>
        <header className="sec-head sec-head--center">
          <div>
            <span className="eyebrow">{CAREERS_FIT.eyebrow}</span>
            <h2 className="display-2">{CAREERS_FIT.title}</h2>
          </div>
          <p className="sec-head__lede">{CAREERS_FIT.lede}</p>
        </header>

        <div className="fit__cols">
          <div className="fit-card fit-card--good card">
            <header>
              <span className="fit-card__icon">
                <Check />
              </span>
              <h3 className="fit-card__title">{CAREERS_FIT.good.title}</h3>
            </header>
            <ul>
              {CAREERS_FIT.good.items.map((t) => (
                <li key={t}>
                  <span className="fit-card__dot" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="fit-card fit-card--bad card">
            <header>
              <span className="fit-card__icon">
                <Close />
              </span>
              <h3 className="fit-card__title">{CAREERS_FIT.bad.title}</h3>
            </header>
            <ul>
              {CAREERS_FIT.bad.items.map((t) => (
                <li key={t}>
                  <span className="fit-card__dot" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Hiring process + roles ─────────────────────────────────────────────── */
function Hiring() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section hiring" id="hiring">
      <div className="glow hiring__glow" />

      <div className="shell reveal" ref={ref}>
        <header className="sec-head">
          <div>
            <span className="eyebrow">{CAREERS_HIRING.eyebrow}</span>
            <h2 className="display-2">{CAREERS_HIRING.title}</h2>
          </div>
          <p className="sec-head__lede">{CAREERS_HIRING.lede}</p>
        </header>

        <ol className="steps">
          {CAREERS_HIRING.steps.map((s) => (
            <li key={s.n} className="step card card--hover">
              <div className="step__head">
                <span className="step__n">{s.n}</span>
                <span className="step__rule" />
              </div>
              <h3 className="step__title">{s.title}</h3>
              <p className="step__body">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="roles card">
          <div className="roles__head">
            <div>
              <p className="roles__label">{CAREERS_HIRING.rolesTitle}</p>
              <p className="roles__body">{CAREERS_HIRING.rolesBody}</p>
            </div>
            <span className="roles__pill">
              <i />
              {CAREERS_HIRING.rolesPill}
            </span>
          </div>

          <ul className="roles__list">
            {CAREERS_HIRING.roles.map((r) => (
              <li key={r}>
                <a href="#apply">{r}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ── Open application form ──────────────────────────────────────────────── */
type Fields = { name: string; email: string; phone: string; message: string };
const EMPTY: Fields = { name: '', email: '', phone: '', message: '' };

function Apply() {
  const [values, setValues] = useState<Fields>(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields | 'file', string>>>({});
  const [dragOver, setDragOver] = useState(false);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const ref = useReveal<HTMLDivElement>();

  const set =
    (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [k]: e.target.value }));
      setErrors((x) => ({ ...x, [k]: undefined }));
    };

  const takeFile = (f: File | undefined) => {
    if (!f) return;
    if (f.type !== 'application/pdf') {
      setErrors((x) => ({ ...x, file: 'PDF only, please.' }));
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setErrors((x) => ({ ...x, file: `That file is over ${MAX_MB} MB.` }));
      return;
    }
    setFile(f);
    setErrors((x) => ({ ...x, file: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFailure('');
    const next: Partial<Record<keyof Fields | 'file', string>> = {};
    if (!values.name.trim()) next.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Please enter a valid email.';
    if (values.phone.replace(/\D/g, '').length < 7) next.phone = 'Please enter a phone number.';
    if (!file) next.file = 'Please attach your CV as a PDF.';
    if (!values.message.trim()) next.message = 'Tell us a little about what you have built.';

    setErrors(next);
    if (Object.keys(next).length) return;

    // The CV goes to the private "applications" bucket, the rest to the
    // intern_applications table; /dashboard reads both back.
    setBusy(true);
    try {
      await submitInternApplication({ ...values, cv: file });
      setSent(true);
      setValues(EMPTY);
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch (err) {
      setFailure(err instanceof Error ? err.message : 'Could not send that. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section apply" id="apply">
      <div className="bg-dots" />
      <div className="glow apply__glow" />

      <div className="shell reveal" ref={ref}>
        <header className="sec-head sec-head--center">
          <div>
            <span className="eyebrow eyebrow--solid">{CAREERS_APPLY.eyebrow}</span>
            <h2 className="display-2">{CAREERS_APPLY.title}</h2>
          </div>
          <p className="sec-head__lede">{CAREERS_APPLY.lede}</p>
        </header>

        <form className="form card" onSubmit={onSubmit} noValidate>
          <div className="form__row">
            <label className="field">
              <span className="field__label">
                Full name <em>*</em>
              </span>
              <input
                type="text"
                placeholder="Priya Sharma"
                value={values.name}
                onChange={set('name')}
                aria-invalid={!!errors.name}
              />
              {errors.name && <span className="field__error">{errors.name}</span>}
            </label>

            <label className="field">
              <span className="field__label">
                Your email <em>*</em>
              </span>
              <input
                type="email"
                placeholder="priya@example.com"
                value={values.email}
                onChange={set('email')}
                aria-invalid={!!errors.email}
              />
              {errors.email && <span className="field__error">{errors.email}</span>}
            </label>
          </div>

          <label className="field">
            <span className="field__label">
              Your phone <em>*</em>
            </span>
            <input
              type="tel"
              placeholder="+91 99258 76005"
              value={values.phone}
              onChange={set('phone')}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <span className="field__error">{errors.phone}</span>}
          </label>

          {/* Attachment dropzone */}
          <div className="field">
            <span className="field__label">
              Attachment <em>*</em>
            </span>

            <div
              className={`drop${dragOver ? ' is-over' : ''}${file ? ' has-file' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                takeFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={CAREERS_APPLY.dropTitle}
            >
              <span className="drop__icon">
                <Upload />
              </span>
              <p className="drop__title">{file ? file.name : CAREERS_APPLY.dropTitle}</p>
              <p className="drop__note">
                {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB — click to replace` : CAREERS_APPLY.dropNote}
              </p>

              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                className="drop__input"
                onChange={(e) => takeFile(e.target.files?.[0])}
              />
            </div>
            {errors.file && <span className="field__error">{errors.file}</span>}
          </div>

          <label className="field">
            <span className="field__label">
              Message <em>*</em>
            </span>
            <textarea
              rows={5}
              placeholder="Tell us what you have built and why you want to join."
              value={values.message}
              onChange={set('message')}
              aria-invalid={!!errors.message}
            />
            {errors.message && <span className="field__error">{errors.message}</span>}
          </label>

          <button type="submit" className="btn btn--primary btn--block form__submit" disabled={busy}>
            {busy ? 'Sending…' : CAREERS_APPLY.submit} <ArrowUpRight width={18} height={18} />
          </button>

          {failure && (
            <p className="form__note is-error" role="alert">
              {failure}
            </p>
          )}
          {sent && (
            <p className="form__note is-sent" role="status">
              Thanks — your application is in. We reply within five working days, either way.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

/* ── Candidate questions ────────────────────────────────────────────────── */
function CandidateFaqs() {
  const [open, setOpen] = useState<number | null>(0);
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="section faqs">
      <div className="glow faqs__glow" />

      <div className="shell reveal" ref={ref}>
        <div className="faqs__layout">
          <div className="faqs__intro">
            <span className="eyebrow">{CAREERS_FAQS.eyebrow}</span>
            <h2 className="display-2">{CAREERS_FAQS.title}</h2>
            <p className="faqs__lede">
              Anything else, write to{' '}
              <a className="careers-mail" href={`mailto:${CAREERS_EMAIL}`}>
                {CAREERS_EMAIL}
              </a>{' '}
              and you will get a straight answer.
            </p>
          </div>

          <ul className="faqs__list">
            {CAREERS_FAQS.items.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q} className={`faq${isOpen ? ' is-open' : ''}`}>
                  <button
                    className="faq__q"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`careers-faq-${i}`}
                    id={`careers-faq-btn-${i}`}
                  >
                    <span>{f.q}</span>
                    <span className="faq__toggle">
                      <Plus />
                    </span>
                  </button>

                  <div
                    className="faq__panel"
                    id={`careers-faq-${i}`}
                    role="region"
                    aria-labelledby={`careers-faq-btn-${i}`}
                  >
                    <div className="faq__panel-inner">
                      <p>{f.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function Careers() {
  useEffect(() => {
    document.title = `Careers — ${CAREERS_HERO.title}`;
  }, []);

  return (
    <>
      <CareersHero />
      <TheWork />
      <Fit />
      <Hiring />
      <Apply />
      <CandidateFaqs />
    </>
  );
}
