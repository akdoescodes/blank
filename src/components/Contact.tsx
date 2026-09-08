import { useState, type FormEvent } from 'react';
import { CONTACT_SECTION } from '../data/site';
import { ArrowUpRight } from './Icons';
import { useReveal } from './useReveal';
import './Contact.css';

type Fields = { name: string; email: string; phone: string; brief: string; company: string };

const EMPTY: Fields = { name: '', email: '', phone: '', brief: '', company: '' };

export default function Contact() {
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [sent, setSent] = useState(false);
  const ref = useReveal<HTMLDivElement>();

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!values.name.trim()) next.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Please enter a valid work email.';
    if (values.phone.replace(/\D/g, '').length < 7) next.phone = 'Please enter a phone number.';
    if (!values.brief.trim()) next.brief = 'Tell us a little about the product.';

    setErrors(next);
    if (Object.keys(next).length) return;

    // No backend wired up yet — swap this for your form endpoint.
    setSent(true);
    setValues(EMPTY);
  };

  return (
    <section className="section contact" id="contact">
      <div className="bg-dots" />
      <div className="glow contact__glow" />

      <div className="shell reveal" ref={ref}>
        <header className="sec-head sec-head--center">
          <div>
            <span className="eyebrow eyebrow--solid">{CONTACT_SECTION.eyebrow}</span>
            <h2 className="display-2">{CONTACT_SECTION.title}</h2>
          </div>
          <p className="sec-head__lede">{CONTACT_SECTION.lede}</p>
        </header>

        <form className="form card" onSubmit={onSubmit} noValidate>
          <div className="form__row">
            <label className="field">
              <span className="field__label">
                Your name <em>*</em>
              </span>
              <input
                type="text"
                placeholder="Jane Doe"
                value={values.name}
                onChange={set('name')}
                aria-invalid={!!errors.name}
              />
              {errors.name && <span className="field__error">{errors.name}</span>}
            </label>

            <label className="field">
              <span className="field__label">
                Work email <em>*</em>
              </span>
              <input
                type="email"
                placeholder="jane@company.com"
                value={values.email}
                onChange={set('email')}
                aria-invalid={!!errors.email}
              />
              {errors.email && <span className="field__error">{errors.email}</span>}
            </label>
          </div>

          <label className="field">
            <span className="field__label">
              Phone <em>*</em>
            </span>
            <input
              type="tel"
              placeholder="+1 555 000 0000"
              value={values.phone}
              onChange={set('phone')}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <span className="field__error">{errors.phone}</span>}
          </label>

          <label className="field">
            <span className="field__label">
              What are you building? <em>*</em>
            </span>
            <textarea
              rows={5}
              placeholder="A short description of the product, the problem, or the codebase you need help with."
              value={values.brief}
              onChange={set('brief')}
              aria-invalid={!!errors.brief}
            />
            {errors.brief && <span className="field__error">{errors.brief}</span>}
          </label>

          <label className="field">
            <span className="field__label">Company</span>
            <input
              type="text"
              placeholder="Company name (optional)"
              value={values.company}
              onChange={set('company')}
            />
          </label>

          <button type="submit" className="btn btn--primary btn--block form__submit">
            {CONTACT_SECTION.submit} <ArrowUpRight width={18} height={18} />
          </button>

          <p className={`form__note${sent ? ' is-sent' : ''}`} role="status">
            {sent ? 'Thanks — we have your message and will reply within one business day.' : CONTACT_SECTION.note}
          </p>
        </form>
      </div>
    </section>
  );
}
