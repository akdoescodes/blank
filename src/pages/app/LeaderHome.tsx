import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import {
  dateLabel,
  isOverdue,
  nameOf,
  progressOf,
  ROLE_LABEL,
  TASK_STATUS,
  timeOf,
  updateTask,
  type TaskStatus,
} from '../../lib/workspace';
import {
  AttendanceDot,
  Avatar,
  Empty,
  ErrorBar,
  Loading,
  MyAttendance,
  PageHead,
  Panel,
  PersonCell,
  PriorityBadge,
  Progress,
  ProjectBadge,
  Stat,
  todayRecord,
  useWorkspace,
} from './shared';

/** Team leader: their projects, their team, the tasks they hand out, their team's attendance. */
export default function LeaderHome() {
  const { user, profile } = useAuth();
  const { data, error, setError, busy, run } = useWorkspace();

  const derived = useMemo(() => {
    if (!data || !user) return null;
    const projects = data.projects.filter((p) => p.team_leader_id === user.id);
    const ids = new Set(projects.map((p) => p.id));
    const tasks = data.tasks.filter((t) => ids.has(t.project_id));
    const teamIds = new Set(data.memberships.filter((m) => ids.has(m.project_id)).map((m) => m.user_id));
    const team = data.people.filter((p) => teamIds.has(p.id));
    const open = tasks.filter((t) => t.status !== 'done');
    return {
      projects,
      tasks,
      team,
      open,
      review: tasks.filter((t) => t.status === 'review'),
      overdue: open.filter(isOverdue),
      present: team.filter((p) => todayRecord(data.attendance, p.id)).length,
    };
  }, [data, user]);

  if (!data || !derived) return error ? <ErrorBar message={error} onClose={() => setError('')} /> : <Loading />;

  const person = (id: string | null) => data.people.find((p) => p.id === id);
  const projectName = (id: string) => data.projects.find((p) => p.id === id)?.name ?? '';
  const attention = [...derived.review, ...derived.overdue.filter((t) => t.status !== 'review')];

  return (
    <>
      <PageHead
        eyebrow="Team leader"
        title={`Hi, ${profile?.full_name?.split(' ')[0] || 'there'}`}
        sub="Your projects, your team, and what needs a decision from you today."
      />

      <ErrorBar message={error} onClose={() => setError('')} />

      <ul className="ws-stats">
        <Stat label="My projects" value={derived.projects.length} />
        <Stat label="Team members" value={derived.team.length} />
        <Stat label="Open tasks" value={derived.open.length} />
        <Stat label="Waiting for review" value={derived.review.length} tone={derived.review.length ? 'warn' : undefined} />
        <Stat label="Team present today" value={`${derived.present}/${derived.team.length}`} tone="good" />
      </ul>

      <div className="ws-grid-side">
        <div className="ws-stack">
          {/* ── Projects ──────────────────────────────────────────────────── */}
          <Panel title="My projects">
            {derived.projects.length === 0 ? (
              <Empty>An admin has not assigned you a project yet.</Empty>
            ) : (
              <ul className="ws-cards">
                {derived.projects.map((p) => {
                  const prog = progressOf(p.id, data.tasks);
                  const members = data.memberships.filter((m) => m.project_id === p.id);
                  return (
                    <li key={p.id}>
                      <Link to={`/app/projects/${p.id}`} className="ws-card">
                        <span className="ws-card__top">
                          <span className="ws-card__name">{p.name}</span>
                          <ProjectBadge status={p.status} />
                        </span>
                        <Progress pct={prog.pct} />
                        <span className="ws-card__meta">
                          <span>
                            {prog.done}/{prog.total} tasks done
                          </span>
                          <span>Due {dateLabel(p.due_date)}</span>
                        </span>
                        <span className="ws-avatars">
                          {members.slice(0, 5).map((m) => (
                            <Avatar key={m.user_id} person={person(m.user_id)} size={28} />
                          ))}
                          {members.length === 0 && <span className="ws-muted">No team yet — add people</span>}
                          {members.length > 5 && <span className="ws-muted">+{members.length - 5}</span>}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          {/* ── Needs attention ───────────────────────────────────────────── */}
          <Panel title="Needs your attention">
            {attention.length === 0 ? (
              <Empty>Nothing waiting for review and nothing overdue.</Empty>
            ) : (
              <ul className="ws-tasklist">
                {attention.map((t) => (
                  <li key={t.id} className={isOverdue(t) ? 'is-overdue' : ''}>
                    <span className="ws-tasklist__main">
                      <span className="ws-tasklist__title">{t.title}</span>
                      <span className="ws-muted">
                        {projectName(t.project_id)} · {nameOf(person(t.assignee_id))}
                        {t.due_date && ` · due ${dateLabel(t.due_date)}`}
                      </span>
                    </span>
                    <PriorityBadge priority={t.priority} />
                    <select
                      className="ws-select"
                      value={t.status}
                      disabled={busy}
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
        </div>

        <div className="ws-stack">
          <MyAttendance attendance={data.attendance} run={run} busy={busy} />

          <Panel title="Team attendance today">
            {derived.team.length === 0 ? (
              <Empty>Add people to your projects to see their attendance.</Empty>
            ) : (
              <ul className="ws-people">
                {derived.team.map((p) => {
                  const rec = todayRecord(data.attendance, p.id);
                  return (
                    <li key={p.id}>
                      <PersonCell person={p} sub={rec ? `${ROLE_LABEL[p.role]} · in ${timeOf(rec.check_in)}` : ROLE_LABEL[p.role]} />
                      <AttendanceDot record={rec} />
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
