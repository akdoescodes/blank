import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BRAND } from '../../data/site';
import { useAuth } from '../../lib/auth';
import {
  addMember,
  createTask,
  dateLabel,
  deleteTask,
  isOverdue,
  nameOf,
  PRIORITIES,
  progressOf,
  PROJECT_STATUS,
  removeMember,
  ROLE_LABEL,
  TASK_STATUS,
  updateProject,
  updateTask,
  type Priority,
  type ProjectStatus,
  type TaskStatus,
} from '../../lib/workspace';
import ProjectForm from './ProjectForm';
import {
  AttendanceDot,
  Avatar,
  Empty,
  ErrorBar,
  Loading,
  Panel,
  PersonCell,
  PriorityBadge,
  Progress,
  ProjectBadge,
  todayRecord,
  useWorkspace,
} from './shared';
import './Portal.css';

/** One project, seen by an admin, its leader, or a team member — with the controls each is allowed. */
export default function ProjectPage() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const { data, error, setError, busy, run } = useWorkspace();
  const [editing, setEditing] = useState(false);
  const [newTask, setNewTask] = useState(false);
  const [adding, setAdding] = useState('');

  const project = data?.projects.find((p) => p.id === id);

  useEffect(() => {
    if (project) document.title = `${project.name} — ${BRAND}`;
  }, [project]);

  if (!data) {
    return <div className="ws">{error ? <ErrorBar message={error} onClose={() => setError('')} /> : <Loading />}</div>;
  }

  if (!project) {
    return (
      <div className="ws">
        <div className="ws-pending">
          <h1 className="ws-head__title">Project not found</h1>
          <p>It may have been deleted, or you are not on its team.</p>
          <Link to="/app" className="btn btn--primary">
            Back to your dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isAdmin = profile?.role === 'admin';
  const isLeader = project.team_leader_id === user?.id;
  const canManage = isAdmin || isLeader;

  const person = (pid: string | null) => data.people.find((p) => p.id === pid);
  const team = data.memberships.filter((m) => m.project_id === project.id).map((m) => person(m.user_id)).filter(Boolean) as NonNullable<ReturnType<typeof person>>[];
  const tasks = data.tasks.filter((t) => t.project_id === project.id);
  const prog = progressOf(project.id, data.tasks);
  const available = data.people.filter((p) => (p.role === 'employee' || p.role === 'intern') && !team.some((t) => t.id === p.id));
  const leader = person(project.team_leader_id);

  return (
    <div className="ws">
      <Link to="/app" className="ws-back">
        ← Dashboard
      </Link>

      <header className="ws-project">
        <div className="ws-project__main">
          <div className="ws-project__title">
            <h1>{project.name}</h1>
            <ProjectBadge status={project.status} />
          </div>
          {project.description && <p className="ws-project__desc">{project.description}</p>}
          <dl className="ws-project__facts">
            <div>
              <dt>Team leader</dt>
              <dd>{leader ? nameOf(leader) : 'Unassigned'}</dd>
            </div>
            <div>
              <dt>Start</dt>
              <dd>{dateLabel(project.start_date)}</dd>
            </div>
            <div>
              <dt>Due</dt>
              <dd>{dateLabel(project.due_date)}</dd>
            </div>
            <div>
              <dt>Team</dt>
              <dd>{team.length} people</dd>
            </div>
          </dl>
        </div>

        <div className="ws-project__side">
          <span className="ws-project__pct">{prog.pct}%</span>
          <Progress pct={prog.pct} />
          <span className="ws-muted">
            {prog.done} of {prog.total} tasks done
          </span>
          {isAdmin && (
            <button className="btn ws-btn-ghost" onClick={() => setEditing((v) => !v)}>
              {editing ? 'Close' : 'Edit project'}
            </button>
          )}
          {isLeader && !isAdmin && (
            <label className="ws-field">
              <span>Project status</span>
              <select
                value={project.status}
                disabled={busy}
                onChange={(e) => void run(() => updateProject(project.id, { status: e.target.value as ProjectStatus }))}
              >
                {PROJECT_STATUS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </header>

      <ErrorBar message={error} onClose={() => setError('')} />

      {editing && isAdmin && (
        <Panel title="Edit project">
          <ProjectForm
            leaders={data.people.filter((p) => p.role === 'team_leader')}
            initial={project}
            submitLabel="Save changes"
            busy={busy}
            onCancel={() => setEditing(false)}
            onSubmit={async (input) => {
              const ok = await run(() => updateProject(project.id, input));
              if (ok) setEditing(false);
              return ok;
            }}
          />
        </Panel>
      )}

      <div className="ws-grid-side ws-grid-side--flip">
        {/* ── Task board ──────────────────────────────────────────────────── */}
        <Panel
          title="Tasks"
          action={
            canManage && (
              <button className="btn btn--primary ws-btn-sm" onClick={() => setNewTask((v) => !v)} disabled={team.length === 0 && !newTask}>
                {newTask ? 'Close' : 'New task'}
              </button>
            )
          }
        >
          {canManage && team.length === 0 && <p className="ws-hint">Add people to the team before assigning tasks.</p>}

          {newTask && canManage && (
            <TaskForm
              team={team}
              busy={busy}
              onCancel={() => setNewTask(false)}
              onSubmit={async (input) => {
                const ok = await run(() => createTask({ project_id: project.id, ...input }));
                if (ok) setNewTask(false);
                return ok;
              }}
            />
          )}

          <div className="ws-board">
            {TASK_STATUS.map((col) => {
              const items = tasks.filter((t) => t.status === col.value);
              return (
                <section key={col.value} className={`ws-col ws-col--${col.value}`}>
                  <header>
                    {col.label} <span>{items.length}</span>
                  </header>
                  {items.length === 0 && <p className="ws-col__empty">Nothing here</p>}
                  {items.map((t) => {
                    const mine = t.assignee_id === user?.id;
                    const canStatus = canManage || mine;
                    return (
                      <article key={t.id} className={`ws-task${isOverdue(t) ? ' is-overdue' : ''}${mine ? ' is-mine' : ''}`}>
                        <span className="ws-task__title">{t.title}</span>
                        {t.description && <span className="ws-task__desc">{t.description}</span>}
                        <span className="ws-task__meta">
                          <PriorityBadge priority={t.priority} />
                          {t.due_date && <span className="ws-muted">Due {dateLabel(t.due_date)}</span>}
                        </span>

                        {canManage ? (
                          <select
                            className="ws-select"
                            value={t.assignee_id ?? ''}
                            disabled={busy}
                            aria-label="Assignee"
                            onChange={(e) => void run(() => updateTask(t.id, { assignee_id: e.target.value || null }))}
                          >
                            <option value="">Unassigned</option>
                            {team.map((m) => (
                              <option key={m.id} value={m.id}>
                                {nameOf(m)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="ws-task__who">
                            <Avatar person={person(t.assignee_id)} size={22} />
                            {t.assignee_id ? nameOf(person(t.assignee_id)) : 'Unassigned'}
                          </span>
                        )}

                        <span className="ws-task__actions">
                          {canStatus && (
                            <select
                              className="ws-select"
                              value={t.status}
                              disabled={busy}
                              aria-label="Status"
                              onChange={(e) => void run(() => updateTask(t.id, { status: e.target.value as TaskStatus }))}
                            >
                              {TASK_STATUS.map((s) => (
                                <option key={s.value} value={s.value}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                          )}
                          {canManage && (
                            <button
                              className="ws-icon-btn ws-icon-btn--danger"
                              disabled={busy}
                              onClick={() => window.confirm(`Delete task "${t.title}"?`) && void run(() => deleteTask(t.id))}
                            >
                              Delete
                            </button>
                          )}
                        </span>
                      </article>
                    );
                  })}
                </section>
              );
            })}
          </div>
        </Panel>

        {/* ── Team ────────────────────────────────────────────────────────── */}
        <Panel title={`Team (${team.length})`}>
          {canManage && (
            <div className="ws-add">
              <select className="ws-select" value={adding} onChange={(e) => setAdding(e.target.value)} disabled={busy || available.length === 0}>
                <option value="">{available.length ? 'Add an employee or intern…' : 'Everyone is already on this team'}</option>
                {available.map((p) => (
                  <option key={p.id} value={p.id}>
                    {nameOf(p)} · {ROLE_LABEL[p.role]}
                  </option>
                ))}
              </select>
              <button
                className="btn btn--primary ws-btn-sm"
                disabled={!adding || busy}
                onClick={async () => {
                  const ok = await run(() => addMember(project.id, adding));
                  if (ok) setAdding('');
                }}
              >
                Add
              </button>
            </div>
          )}

          {team.length === 0 ? (
            <Empty>No one on this team yet.</Empty>
          ) : (
            <ul className="ws-people">
              {team.map((m) => {
                const open = tasks.filter((t) => t.assignee_id === m.id && t.status !== 'done').length;
                return (
                  <li key={m.id}>
                    <PersonCell person={m} sub={`${ROLE_LABEL[m.role]} · ${open} open task${open === 1 ? '' : 's'}`} />
                    {canManage ? (
                      <span className="ws-people__end">
                        <AttendanceDot record={todayRecord(data.attendance, m.id)} />
                        <button
                          className="ws-icon-btn ws-icon-btn--danger"
                          disabled={busy}
                          onClick={() =>
                            window.confirm(`Remove ${nameOf(m)} from ${project.name}? Their open tasks here become unassigned.`) &&
                            void run(() => removeMember(project.id, m.id))
                          }
                        >
                          Remove
                        </button>
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

/* ── New task ───────────────────────────────────────────────────────────── */

function TaskForm({
  team,
  busy,
  onSubmit,
  onCancel,
}: {
  team: { id: string; full_name: string | null; email: string }[];
  busy: boolean;
  onSubmit: (input: { title: string; description: string | null; assignee_id: string | null; priority: Priority; due_date: string | null }) => Promise<boolean>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [due, setDue] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return setErr('Give the task a title.');
    setErr('');
    await onSubmit({ title: title.trim(), description: description.trim() || null, assignee_id: assignee || null, priority, due_date: due || null });
  };

  return (
    <form className="ws-form ws-form--inline" onSubmit={submit} noValidate>
      <div className="ws-form__grid">
        <label className="ws-field ws-field--wide">
          <span>Task</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Build the login screen" maxLength={200} autoFocus />
        </label>
        <label className="ws-field">
          <span>Assign to</span>
          <select value={assignee} onChange={(e) => setAssignee(e.target.value)}>
            <option value="">Unassigned</option>
            {team.map((m) => (
              <option key={m.id} value={m.id}>
                {m.full_name || m.email}
              </option>
            ))}
          </select>
        </label>
        <label className="ws-field">
          <span>Priority</span>
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="ws-field">
          <span>Due date</span>
          <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        </label>
        <label className="ws-field ws-field--wide">
          <span>Details</span>
          <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What done looks like." />
        </label>
      </div>
      {err && <p className="ws-form__error">{err}</p>}
      <div className="ws-form__actions">
        <button type="button" className="btn ws-btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy ? 'Saving…' : 'Create task'}
        </button>
      </div>
    </form>
  );
}
