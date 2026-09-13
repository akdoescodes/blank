import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import {
  dateLabel,
  isOverdue,
  nameOf,
  progressOf,
  ROLE_LABEL,
  shiftDays,
  TASK_STATUS,
  updateTask,
  workDate,
  type TaskStatus,
} from '../../lib/workspace';
import {
  Avatar,
  Empty,
  ErrorBar,
  Loading,
  MyAttendance,
  PageHead,
  Panel,
  PriorityBadge,
  Progress,
  ProjectBadge,
  Stat,
  useWorkspace,
} from './shared';

/** Employee / intern: attendance, the tasks their leader gave them, their projects and teammates. */
export default function MemberHome() {
  const { user, profile } = useAuth();
  const { data, error, setError, busy, run } = useWorkspace();
  const [showDone, setShowDone] = useState(false);

  const derived = useMemo(() => {
    if (!data || !user) return null;
    const mine = data.tasks.filter((t) => t.assignee_id === user.id);
    const weekAgo = shiftDays(workDate(), -7);
    return {
      mine,
      open: mine.filter((t) => t.status !== 'done'),
      review: mine.filter((t) => t.status === 'review'),
      doneThisWeek: mine.filter((t) => t.status === 'done' && t.completed_at && t.completed_at.slice(0, 10) >= weekAgo).length,
      overdue: mine.filter(isOverdue).length,
    };
  }, [data, user]);

  if (!data || !derived || !profile) return error ? <ErrorBar message={error} onClose={() => setError('')} /> : <Loading />;

  const person = (id: string | null) => data.people.find((p) => p.id === id);
  const projectName = (id: string) => data.projects.find((p) => p.id === id)?.name ?? '';
  const order: TaskStatus[] = ['in_progress', 'todo', 'review', 'done'];
  const tasks = (showDone ? derived.mine : derived.open).slice().sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));

  return (
    <>
      <PageHead
        eyebrow={ROLE_LABEL[profile.role]}
        title={`Good to see you, ${profile.full_name?.split(' ')[0] || 'there'}`}
        sub="Check in, pick up your tasks, and see how your projects are moving."
      />

      <ErrorBar message={error} onClose={() => setError('')} />

      <ul className="ws-stats">
        <Stat label="Open tasks" value={derived.open.length} hint={derived.overdue ? `${derived.overdue} overdue` : undefined} tone={derived.overdue ? 'warn' : undefined} />
        <Stat label="In review" value={derived.review.length} />
        <Stat label="Done this week" value={derived.doneThisWeek} tone="good" />
        <Stat label="My projects" value={data.projects.length} />
      </ul>

      <div className="ws-grid-side">
        <div className="ws-stack">
          {/* ── Tasks ─────────────────────────────────────────────────────── */}
          <Panel
            title="My tasks"
            action={
              <label className="ws-toggle">
                <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} />
                Show done
              </label>
            }
          >
            {tasks.length === 0 ? (
              <Empty>{derived.mine.length ? 'All caught up — nothing open.' : 'Your team leader has not assigned you a task yet.'}</Empty>
            ) : (
              <ul className="ws-tasklist">
                {tasks.map((t) => (
                  <li key={t.id} className={`${isOverdue(t) ? 'is-overdue' : ''}${t.status === 'done' ? ' is-done' : ''}`}>
                    <span className="ws-tasklist__main">
                      <span className="ws-tasklist__title">{t.title}</span>
                      <span className="ws-muted">
                        <Link to={`/app/projects/${t.project_id}`} className="ws-link">
                          {projectName(t.project_id)}
                        </Link>
                        {t.due_date && ` · due ${dateLabel(t.due_date)}`}
                        {isOverdue(t) && ' · overdue'}
                      </span>
                      {t.description && <span className="ws-tasklist__desc">{t.description}</span>}
                    </span>
                    <PriorityBadge priority={t.priority} />
                    <select
                      className="ws-select"
                      value={t.status}
                      disabled={busy}
                      aria-label={`Status of ${t.title}`}
                      onChange={(e) => void run(() => updateTask(t.id, { status: e.target.value as TaskStatus }))}
                    >
                      {TASK_STATUS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* ── Projects ──────────────────────────────────────────────────── */}
          <Panel title="My projects">
            {data.projects.length === 0 ? (
              <Empty>You are not on a project team yet.</Empty>
            ) : (
              <ul className="ws-cards">
                {data.projects.map((p) => {
                  const prog = progressOf(p.id, data.tasks);
                  const team = data.memberships.filter((m) => m.project_id === p.id);
                  return (
                    <li key={p.id}>
                      <Link to={`/app/projects/${p.id}`} className="ws-card">
                        <span className="ws-card__top">
                          <span className="ws-card__name">{p.name}</span>
                          <ProjectBadge status={p.status} />
                        </span>
                        <Progress pct={prog.pct} />
                        <span className="ws-card__meta">
                          <span>Lead: {nameOf(person(p.team_leader_id))}</span>
                          <span>Due {dateLabel(p.due_date)}</span>
                        </span>
                        <span className="ws-avatars">
                          {team.slice(0, 6).map((m) => (
                            <Avatar key={m.user_id} person={person(m.user_id)} size={28} />
                          ))}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>

        <div className="ws-stack">
          <MyAttendance attendance={data.attendance} run={run} busy={busy} />
        </div>
      </div>
    </>
  );
}
