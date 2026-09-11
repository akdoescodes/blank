import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

/** Sends signed-out visitors to /login, remembering where they were headed. */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <section className="section" style={{ minHeight: '60vh' }}>
        <div className="shell">
          <p style={{ color: 'var(--body)' }}>Checking your session…</p>
        </div>
      </section>
    );
  }

  if (!session) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  return <>{children}</>;
}
