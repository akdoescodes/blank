import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '../../lib/auth';
import {
  checkIn,
  checkOut,
  dateLabel,
  initials,
  labelOf,
  loadWorkspace,
  nameOf,
  PRIORITIES,
  PROJECT_STATUS,
  ROLE_LABEL,
  shiftDays,
  TASK_STATUS,
  timeOf,
  workDate,
  type Attendance,
  type Person,
  type Priority,
  type ProjectStatus,
  type Role,
  type TaskStatus,
  type Workspace,
} from '../../lib/workspace';

/* ── Data ───────────────────────────────────────────────────────────────── */

/** Loads the caller's slice of the workspace, with a reload and a busy wrapper. */
export function useWorkspace() {
  const [data, setData] = useState<Workspace | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    try {
      setData(await loadWorkspace());
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load the workspace.');
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  /** Runs a mutation, surfaces its error, then refreshes everything. */
  const run = useCallback(
    async (job: () => Promise<void>) => {
      setBusy(true);
      try {
        await job();
        setError('');
        await reload();
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'That did not work.');
        return false;
      } finally {
        setBusy(false);
      }
    },
    [reload]
  );

  return { data, error, setError, busy, reload, run };
}

/* ── Primitives ─────────────────────────────────────────────────────────── */

export function Avatar({ person, size = 32 }: { person?: Person; size?: number }) {
  return (
    <span className="ws-avatar" style={{ width: size, height: size, fontSize: size * 0.38 }} title={nameOf(person)}>
      {initials(person) || '?'}
    </span>
  );
}

export function PersonCell({ person, sub }: { person?: Person; sub?: ReactNode }) {
  return (
    <span className="ws-person">
      <Avatar person={person} />
      <span className="ws-person__text">
        <span className="ws-person__name">{nameOf(person)}</span>
        {sub !== undefined ? <span className="ws-person__sub">{sub}</span> : person && <span className="ws-person__sub">{person.email}</span>}
      </span>
    </span>
  );
}

export function Progress({ pct, label }: { pct: number; label?: string }) {
  return (
    <span className="ws-progress" aria-label={label ?? `${pct}% complete`}>
      <span className="ws-progress__bar">
        <span className="ws-progress__fill" style={{ width: `${pct}%` }} />
      </span>
      <span className="ws-progress__pct">{pct}%</span>
    </span>
  );
}

export const RoleBadge = ({ role }: { role: Role }) => <span className={`ws-badge ws-badge--role-${role}`}>{ROLE_LABEL[role]}</span>;

export const ProjectBadge = ({ status }: { status: ProjectStatus }) => (
  <span className={`ws-badge ws-badge--p-${status}`}>{labelOf(PROJECT_STATUS, status)}</span>
);

export const TaskBadge = ({ status }: { status: TaskStatus }) => (
  <span className={`ws-badge ws-badge--t-${status}`}>{labelOf(TASK_STATUS, status)}</span>
);

export const PriorityBadge = ({ priority }: { priority: Priority }) => (
  <span className={`ws-priority ws-priority--${priority}`}>{labelOf(PRIORITIES, priority)}</span>
);

export function Stat({ label, value, hint, tone }: { label: string; value: ReactNode; hint?: string; tone?: 'warn' | 'good' }) {
  return (
    <li className={`ws-stat${tone ? ` ws-stat--${tone}` : ''}`}>
      <span className="ws-stat__value">{value}</span>
      <span className="ws-stat__label">{label}</span>
      {hint && <span className="ws-stat__hint">{hint}</span>}
    </li>
  );
}

export function Panel({ title, action, children, className = '' }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`ws-panel ${className}`}>
      <header className="ws-panel__head">
        <h2>{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

export const Empty = ({ children }: { children: ReactNode }) => <p className="ws-empty">{children}</p>;

export function ErrorBar({ message, onClose }: { message: string; onClose: () => void }) {
  if (!message) return null;
  return (
    <p className="ws-error" role="alert">
      {message}
      <button onClick={onClose} aria-label="Dismiss">
        ×
      </button>
    </p>
  );
}

export function PageHead({ eyebrow, title, sub, actions }: { eyebrow: string; title: string; sub?: string; actions?: ReactNode }) {
  return (
    <header className="ws-head">
      <div>
        <span className="ws-head__eyebrow">{eyebrow}</span>
        <h1 className="ws-head__title">{title}</h1>
        {sub && <p className="ws-head__sub">{sub}</p>}
      </div>
      {actions && <div className="ws-head__actions">{actions}</div>}
    </header>
  );
}

export function Loading() {
  return (
    <div className="ws-loading" role="status">
      <span className="ws-spinner" /> Loading your workspace…
    </div>
  );
}

/* ── Attendance ─────────────────────────────────────────────────────────── */

/** Today's status for one person, from the records already loaded. */
export function todayRecord(attendance: Attendance[], userId: string) {
  const today = workDate();
  return attendance.find((a) => a.user_id === userId && a.work_date === today);
}

export function AttendanceDot({ record }: { record?: Attendance }) {
  const state = !record ? 'absent' : record.check_out ? 'out' : record.status;
  const label = { absent: 'Not checked in', out: 'Checked out', present: 'Present', late: 'Late' }[state];
  return (
    <span className={`ws-dot ws-dot--${state}`} title={label}>
      <i />
      {label}
    </span>
  );
}

/** Check-in / check-out card plus the last two weeks, for the signed-in user. */
export function MyAttendance({ attendance, run, busy }: { attendance: Attendance[]; run: (j: () => Promise<void>) => Promise<boolean>; busy: boolean }) {
  const { user } = useAuth();
  if (!user) return null;

  const mine = attendance.filter((a) => a.user_id === user.id);
  const today = todayRecord(mine, user.id);
  const monthPrefix = workDate().slice(0, 7);
  const thisMonth = mine.filter((a) => a.work_date.startsWith(monthPrefix));
  const days = Array.from({ length: 14 }, (_, i) => shiftDays(workDate(), -13 + i));

  const now = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' });

  return (
    <section className="ws-panel ws-attend">
      <header className="ws-panel__head">
        <h2>My attendance</h2>
        <span className="ws-muted">{now}</span>
      </header>

      <div className="ws-attend__today">
        <div className="ws-attend__times">
          <div>
            <span className="ws-attend__k">Checked in</span>
            <span className="ws-attend__v">{timeOf(today?.check_in ?? null)}</span>
          </div>
          <div>
            <span className="ws-attend__k">Checked out</span>
            <span className="ws-attend__v">{timeOf(today?.check_out ?? null)}</span>
          </div>
          <div>
            <span className="ws-attend__k">Status</span>
            <span className="ws-attend__v">
              <AttendanceDot record={today} />
            </span>
          </div>
        </div>

        {!today && (
          <button className="btn btn--primary" disabled={busy} onClick={() => void run(checkIn)}>
            Check in
          </button>
        )}
        {today && !today.check_out && (
          <button className="btn ws-btn-dark" disabled={busy} onClick={() => void run(() => checkOut(today.id))}>
            Check out
          </button>
        )}
        {today?.check_out && <span className="ws-attend__done">Day complete</span>}
      </div>

      <div className="ws-attend__month">
        <span>
          <strong>{thisMonth.length}</strong> {thisMonth.length === 1 ? 'day' : 'days'} present this month
        </span>
        <span>
          <strong>{thisMonth.filter((a) => a.status === 'late').length}</strong> late
        </span>
      </div>

      <ol className="ws-attend__strip" aria-label="Last 14 days">
        {days.map((d) => {
          const rec = mine.find((a) => a.work_date === d);
          const state = rec ? rec.status : 'absent';
          return (
            <li key={d} className={`ws-day ws-day--${state}`} title={`${dateLabel(d)}: ${rec ? `${rec.status}, in ${timeOf(rec.check_in)}` : 'no record'}`}>
              <span>{new Date(`${d}T00:00:00Z`).getUTCDate()}</span>
            </li>
          );
        })}
      </ol>
      <p className="ws-muted ws-attend__legend">
        <i className="ws-day--present" /> present <i className="ws-day--late" /> late <i className="ws-day--absent" /> no record
      </p>
    </section>
  );
}
