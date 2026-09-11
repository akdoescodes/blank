import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight } from '../components/Icons';
import { useAuth } from '../lib/auth';
import { useReveal } from '../components/useReveal';
import '../components/Contact.css'; // .form / .field / .field__error
import './Auth.css';

export type AuthMode = 'login' | 'signup' | 'forgot' | 'reset';

const COPY: Record<AuthMode, { eyebrow: string; title: string; lede: string; submit: string }> = {
  login: {
    eyebrow: 'Account',
    title: 'Sign in',
    lede: 'Sign in to read the enquiries and applications that came in through the site.',
    submit: 'Sign in',
  },
  signup: {
    eyebrow: 'Account',
    title: 'Create an account',
    lede: 'Your account starts as a member. An admin promotes it when you need the inbox.',
    submit: 'Create account',
  },
  forgot: {
    eyebrow: 'Account',
    title: 'Reset your password',
    lede: 'Enter your email and we will send you a link to set a new password.',
    submit: 'Send reset link',
  },
  reset: {
    eyebrow: 'Account',
    title: 'Choose a new password',
    lede: 'You followed the link from your inbox — pick a password and you are back in.',
    submit: 'Save password',
  },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Auth({ mode }: { mode: AuthMode }) {
  const { signIn, signUp, sendPasswordReset, updatePassword, session, loading, configured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useReveal<HTMLDivElement>();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const copy = COPY[mode];
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  useEffect(() => {
    document.title = `${copy.title} — Alikima`;
  }, [copy.title]);

  // Already signed in? There is nothing to do on the login or signup page.
  useEffect(() => {
    if (!loading && session && (mode === 'login' || mode === 'signup')) {
      navigate(from, { replace: true });
    }
  }, [loading, session, mode, from, navigate]);

  // Clear the state that does not belong to the new mode.
  useEffect(() => {
    setErrors({});
    setFormError('');
    setNotice('');
    setPassword('');
    setConfirm('');
  }, [mode]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    setNotice('');

    const next: Record<string, string> = {};
    if (mode === 'signup' && !fullName.trim()) next.fullName = 'Please enter your name.';
    if (mode !== 'reset' && !EMAIL_RE.test(email)) next.email = 'Please enter a valid email.';
    if (mode !== 'forgot' && password.length < 6) next.password = 'Use at least 6 characters.';
    if ((mode === 'signup' || mode === 'reset') && password !== confirm) {
      next.confirm = 'The two passwords do not match.';
    }

    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      if (mode === 'login') {
        await signIn({ email, password });
        navigate(from, { replace: true });
      } else if (mode === 'signup') {
        const { needsConfirmation } = await signUp({ email, password, fullName });
        if (needsConfirmation) {
          setNotice(`Account created. Confirm it from the link we sent to ${email}, then sign in.`);
          setPassword('');
          setConfirm('');
        } else {
          navigate(from, { replace: true });
        }
      } else if (mode === 'forgot') {
        await sendPasswordReset(email);
        setNotice(`If ${email} has an account, a reset link is on its way.`);
      } else {
        await updatePassword(password);
        setNotice('Password saved. Taking you to the dashboard…');
        window.setTimeout(() => navigate('/dashboard', { replace: true }), 900);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section auth">
      <div className="bg-dots" />
      <div className="glow auth__glow" />

      <div className="shell reveal" ref={ref}>
        <div className="auth__card card">
          <header className="auth__head">
            <span className="eyebrow eyebrow--solid">{copy.eyebrow}</span>
            <h1 className="auth__title">{copy.title}</h1>
            <p className="auth__lede">{copy.lede}</p>
          </header>

          {!configured && (
            <p className="auth__alert" role="alert">
              Supabase is not configured yet. Copy <code>.env.example</code> to <code>.env</code>, add your
              project URL and anon key, then restart the dev server.
            </p>
          )}

          <form className="form auth__form" onSubmit={onSubmit} noValidate>
            {mode === 'signup' && (
              <label className="field">
                <span className="field__label">
                  Full name <em>*</em>
                </span>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Priya Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  aria-invalid={!!errors.fullName}
                />
                {errors.fullName && <span className="field__error">{errors.fullName}</span>}
              </label>
            )}

            {mode !== 'reset' && (
              <label className="field">
                <span className="field__label">
                  Email <em>*</em>
                </span>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <span className="field__error">{errors.email}</span>}
              </label>
            )}

            {mode !== 'forgot' && (
              <label className="field">
                <span className="field__label">
                  {mode === 'reset' ? 'New password' : 'Password'} <em>*</em>
                </span>
                <input
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!errors.password}
                />
                {errors.password && <span className="field__error">{errors.password}</span>}
              </label>
            )}

            {(mode === 'signup' || mode === 'reset') && (
              <label className="field">
                <span className="field__label">
                  Confirm password <em>*</em>
                </span>
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Type it once more"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  aria-invalid={!!errors.confirm}
                />
                {errors.confirm && <span className="field__error">{errors.confirm}</span>}
              </label>
            )}

            <button type="submit" className="btn btn--primary btn--block form__submit" disabled={busy}>
              {busy ? 'Working…' : copy.submit} <ArrowUpRight width={18} height={18} />
            </button>

            {formError && (
              <p className="auth__alert" role="alert">
                {formError}
              </p>
            )}
            {notice && (
              <p className="form__note is-sent" role="status">
                {notice}
              </p>
            )}
          </form>

          <footer className="auth__foot">
            {mode === 'login' && (
              <>
                <Link to="/forgot-password">Forgot your password?</Link>
                <span>
                  No account yet? <Link to="/signup">Create one</Link>
                </span>
              </>
            )}
            {mode === 'signup' && (
              <span>
                Already have an account? <Link to="/login">Sign in</Link>
              </span>
            )}
            {(mode === 'forgot' || mode === 'reset') && (
              <span>
                <Link to="/login">Back to sign in</Link>
              </span>
            )}
          </footer>
        </div>
      </div>
    </section>
  );
}
