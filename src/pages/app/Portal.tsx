import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../../data/site';
import { useAuth } from '../../lib/auth';
import AdminHome from './AdminHome';
import LeaderHome from './LeaderHome';
import MemberHome from './MemberHome';
import { Loading } from './shared';
import './Portal.css';

/** /app — one address, three dashboards, chosen by the signed-in user's role. */
export default function Portal() {
  const { profile, session, loading, user } = useAuth();

  useEffect(() => {
    document.title = `Workspace — ${BRAND}`;
  }, []);

  // The session resolves first; the profile (and its role) a moment later.
  if (loading || (session && !profile)) {
    return (
      <div className="ws">
        <Loading />
      </div>
    );
  }

  const role = profile?.role ?? 'member';

  return (
    <div className="ws">
      {role === 'admin' && <AdminHome />}
      {role === 'team_leader' && <LeaderHome />}
      {(role === 'employee' || role === 'intern') && <MemberHome />}
      {role === 'member' && (
        <div className="ws-pending">
          <span className="ws-head__eyebrow">Workspace</span>
          <h1 className="ws-head__title">Your access is pending</h1>
          <p>
            You are signed in as <strong>{user?.email}</strong>, but an admin has not given your account a role yet.
            Once they make you an employee, intern or team leader, your dashboard appears here.
          </p>
          <Link to="/" className="btn btn--primary">
            Back to the website
          </Link>
        </div>
      )}
    </div>
  );
}
