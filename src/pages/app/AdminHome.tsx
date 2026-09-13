import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import {
  createProject,
  dateLabel,
  deleteProject,
  isOverdue,
  isStaff,
  nameOf,
  progressOf,
  PROJECT_STATUS,
  ROLE_LABEL,
  setRole,
  timeOf,
  updateProject,
  type Role,
} from '../../lib/workspace';
import ProjectForm from './ProjectForm';
import {
  AttendanceDot,
  Empty,
  ErrorBar,
  Loading,
  PageHead,
  Panel,
  PersonCell,
  Progress,
  RoleBadge,
  Stat,
  todayRecord,
  useWorkspace,
} from './shared';

type PeopleFilter = 'all' | 'pending' | 'team_leader' | 'employee' | 'intern';

const ROLE_ORDER: Role[] = ['admin', 'team_leader', 'employee', 'intern', 'member'];

/** Admin: owns the top of the hierarchy — projects, leaders, roles, everyone's attendance. */
export default function AdminHome() {
  const { user, profile } = useAuth();
  const { data, error, setError, busy, run } = useWorkspace();
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState<PeopleFilter>('all');

  const derived = useMemo(() => {
    if (!data) return null;
    const staff = data.people.filter(isStaff);
    const leaders = data.people.filter((p) => p.role === 'team_leader');
    const present = staff.filter((p) => todayRecord(data.attendance, p.id)).length;
    const open = data.tasks.filter((t) => t.status !== 'done');
    return {
      staff,
      leaders,
      present,
      open,
      overdue: open.filter(isOverdue).length,
      active: data.projects.filter((p) => p.status === 'active').length,
      pending: data.people.filter((p) => p.role === 'member'),
    };
  }, [data]);

  if (!data || !derived) return error ? <ErrorBar message={error} onClose={() => setError('')} /> : <Loading />;

  const personById = (id: string | null) => data.people.find((p) => p.id === id);
  const teamSize = (projectId: string) => data.memberships.filter((m) => m.project_id === projectId).length;
  const projectCount = (userId: string) =>
    data.memberships.filter((m) => m.user_id === userId).length + data.projects.filter((p) => p.team_leader_id === userId).length;

  const people = data.people
    .filter((p) => (filter === 'all' ? true : filter === 'pending' ? p.role === 'member' : p.role === filter))
    .sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role) || nameOf(a).localeCompare(nameOf(b)));

  const changeRole = (id: string, role: Role, current: Role) => {
    const leading = data.projects.filter((p) => p.team_leader_id === id);
    if (current === 'team_leader' && role !== 'team_leader' && leading.length) {
      return setError(`${nameOf(personById(id))} still leads ${leading.length} project(s). Give those projects a new leader first.`);
    }
    const onTeams = data.memberships.some((m) => m.user_id === id);
    if ((current === 'employee' || current === 'intern') && !['employee', 'intern'].includes(role) && onTeams) {
      return setError(`${nameOf(personById(id))} is still on a project team. Remove them from their projects first.`);
    }
    void run(() => setRole(id, role));
  };

  return (
    <>
      <PageHead
        eyebrow="Admin"
        title={`Welcome back, ${profile?.full_name?.split(' ')[0] || 'admin'}`}
        sub="Every project, every team and everyone's attendance, in one place."
        actions={
          <>
            <Link to="/dashboard" className="btn ws-btn-ghost">
              Website inbox
            </Link>
            <button className="btn btn--primary" onClick={() => setCreating((v) => !v)}>
              {creating ? 'Close' : 'New project'}
            </button>
          </>
        }
      />

      <ErrorBar message={error} onClose={() => setError('')} />

      <ul className="ws-stats">
        <Stat label="Active projects" value={derived.active} hint={`${data.projects.length} total`} />
        <Stat label="Team members" value={derived.staff.length} hint={`${derived.leaders.length} team leaders`} />
        <Stat label="Present today" value={`${derived.present}/${derived.staff.length}`} tone="good" />
        <Stat label="Open tasks" value={derived.open.length} hint={derived.overdue ? `${derived.overdue} overdue` : 'none overdue'} tone={derived.overdue ? 'warn' : undefined} />
        <Stat label="Awaiting a role" value={derived.pending.length} tone={derived.pending.length ? 'warn' : undefined} />
      </ul>

      {creating && (
        <Panel title="New project">
          <ProjectForm
            leaders={derived.leaders}
            submitLabel="Create project"
            busy={busy}
            onCancel={() => setCreating(false)}
            onSubmit={async (input) => {
              const ok = await run(() => createProject(input));
              if (ok) setCreating(false);
              return ok;
            }}
          />
        </Panel>
      )}

      {/* ── Projects ────────────────────────────────────────────────────── */}
      <Panel title={`Projects (${data.projects.length})`}>
        {data.projects.length === 0 ? (
          <Empty>No projects yet. Create one and pick its team leader.</Empty>
        ) : (
          <div className="ws-table-wrap">
            <table className="ws-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Team leader</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Team</th>
                  <th>Due</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {data.projects.map((p) => {
                  const prog = progressOf(p.id, data.tasks);
                  return (
                    <tr key={p.id}>
                      <td>
                        <Link to={`/app/projects/${p.id}`} className="ws-link">
                          {p.name}
                        </Link>
                      </td>
                      <td>
                        <select
                          className="ws-select"
                          value={p.team_leader_id ?? ''}
                          disabled={busy}
                          onChange={(e) => void run(() => updateProject(p.id, { team_leader_id: e.target.value || null }))}
                        >
                          <option value="">Unassigned</option>
                          {derived.leaders.map((l) => (
                            <option key={l.id} value={l.id}>
                              {nameOf(l)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="ws-select"
                          value={p.status}
                          disabled={busy}
                          onChange={(e) => void run(() => updateProject(p.id, { status: e.target.value as typeof p.status }))}
                        >
                          {PROJECT_STATUS.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="ws-td-progress">
                        <Progress pct={prog.pct} />
                        <span className="ws-muted">
                          {prog.done}/{prog.total} tasks
                        </span>
                      </td>
                      <td>{teamSize(p.id)}</td>
                      <td>{dateLabel(p.due_date)}</td>
                      <td>
                        <button
                          className="ws-icon-btn ws-icon-btn--danger"
                          disabled={busy}
                          title="Delete project"
                          onClick={() => {
                            if (window.confirm(`Delete "${p.name}"? Its team and all its tasks are deleted too.`)) {
                              void run(() => deleteProject(p.id));
                            }
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <div className="ws-grid-2">
        {/* ── People & roles ─────────────────────────────────────────────── */}
        <Panel
          title="People and roles"
          action={
            <div className="ws-tabs" role="tablist">
              {(
                [
                  ['all', 'All'],
                  ['pending', `Awaiting role (${derived.pending.length})`],
                  ['team_leader', 'Leaders'],
                  ['employee', 'Employees'],
                  ['intern', 'Interns'],
                ] as [PeopleFilter, string][]
              ).map(([k, label]) => (
                <button key={k} role="tab" aria-selected={filter === k} className={filter === k ? 'is-active' : ''} onClick={() => setFilter(k)}>
                  {label}
                </button>
              ))}
            </div>
          }
        >
          {people.length === 0 ? (
            <Empty>No one here.</Empty>
          ) : (
            <ul className="ws-people">
              {people.map((p) => (
                <li key={p.id}>
                  <PersonCell person={p} />
                  <span className="ws-muted ws-people__count">
                    {p.role === 'member' ? '—' : `${projectCount(p.id)} project${projectCount(p.id) === 1 ? '' : 's'}`}
                  </span>
                  {p.id === user?.id ? (
                    <RoleBadge role={p.role} />
                  ) : (
                    <select className="ws-select" value={p.role} disabled={busy} onChange={(e) => changeRole(p.id, e.target.value as Role, p.role)}>
                      {ROLE_ORDER.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABEL[r]}
                        </option>
                      ))}
                    </select>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* ── Attendance today ──────────────────────────────────────────── */}
        <Panel title="Attendance today" action={<span className="ws-muted">{derived.present} of {derived.staff.length} in</span>}>
          {derived.staff.length === 0 ? (
            <Empty>No staff yet.</Empty>
          ) : (
            <ul className="ws-people">
              {derived.staff
                .filter((p) => p.role !== 'admin')
                .map((p) => {
                  const rec = todayRecord(data.attendance, p.id);
                  return (
                    <li key={p.id}>
                      <PersonCell person={p} sub={ROLE_LABEL[p.role]} />
                      <span className="ws-muted ws-people__count">
                        {rec ? `${timeOf(rec.check_in)} – ${timeOf(rec.check_out)}` : ''}
                      </span>
                      <AttendanceDot record={rec} />
                    </li>
                  );
                })}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
