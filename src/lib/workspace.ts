/**
 * Workspace data: projects, teams, tasks and attendance (supabase/workspace.sql).
 *
 * Every dashboard loads the same thing through `loadWorkspace()`. Row level
 * security decides what comes back, so an admin receives everything, a team
 * leader receives their projects and people, and an employee receives only
 * their own world. The dashboards never filter for permission themselves —
 * they only shape what they were given.
 */
import type { Profile } from './auth';
import { requireSupabase } from './supabase';

export type Role = Profile['role'];
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export type Person = Pick<Profile, 'id' | 'email' | 'full_name' | 'role'>;

export type Project = {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  start_date: string | null;
  due_date: string | null;
  team_leader_id: string | null;
  created_at: string;
};

export type Membership = { project_id: string; user_id: string; added_at: string };

export type Task = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  assignee_id: string | null;
  status: TaskStatus;
  priority: Priority;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
};

export type Attendance = {
  id: string;
  user_id: string;
  work_date: string;
  check_in: string;
  check_out: string | null;
  status: 'present' | 'late';
};

export type Workspace = {
  people: Person[];
  projects: Project[];
  memberships: Membership[];
  tasks: Task[];
  attendance: Attendance[];
};

/* ── Labels ─────────────────────────────────────────────────────────────── */

export const ROLE_LABEL: Record<Role, string> = {
  admin: 'Admin',
  team_leader: 'Team leader',
  employee: 'Employee',
  intern: 'Intern',
  member: 'No access',
};

export const PROJECT_STATUS: { value: ProjectStatus; label: string }[] = [
  { value: 'planning', label: 'Planning' },
  { value: 'active', label: 'Active' },
  { value: 'on_hold', label: 'On hold' },
  { value: 'completed', label: 'Completed' },
];

export const TASK_STATUS: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'review', label: 'In review' },
  { value: 'done', label: 'Done' },
];

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export const labelOf = <T extends string>(list: { value: T; label: string }[], v: T) =>
  list.find((x) => x.value === v)?.label ?? v;

/* ── Dates ──────────────────────────────────────────────────────────────── */

/** The workspace runs on India time; matches public.work_today() in SQL. */
export const WORK_TZ = 'Asia/Kolkata';

/** yyyy-mm-dd for a date in the workspace timezone. */
export function workDate(d = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: WORK_TZ }).format(d);
}

export function shiftDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const timeOf = (ts: string | null) =>
  ts ? new Date(ts).toLocaleTimeString('en-IN', { timeZone: WORK_TZ, hour: '2-digit', minute: '2-digit' }) : '—';

export const dateLabel = (iso: string | null) =>
  iso ? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' }) : '—';

export const isOverdue = (t: Task) => !!t.due_date && t.status !== 'done' && t.due_date < workDate();

/* ── Derived ────────────────────────────────────────────────────────────── */

export const nameOf = (p: Person | undefined) => p?.full_name || p?.email || 'Unknown';

export function initials(p: Person | undefined): string {
  const src = nameOf(p).replace(/@.*/, '');
  return src
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}

/** Share of a project's tasks that are done, 0–100. No tasks reads as 0. */
export function progressOf(projectId: string, tasks: Task[]): { pct: number; done: number; total: number } {
  const mine = tasks.filter((t) => t.project_id === projectId);
  const done = mine.filter((t) => t.status === 'done').length;
  return { pct: mine.length ? Math.round((done / mine.length) * 100) : 0, done, total: mine.length };
}

export const isStaff = (p: Person) => p.role !== 'member';

/* ── Load ───────────────────────────────────────────────────────────────── */

const ATTENDANCE_DAYS = 45;

export async function loadWorkspace(): Promise<Workspace> {
  const db = requireSupabase();
  const since = shiftDays(workDate(), -ATTENDANCE_DAYS);

  const [people, projects, memberships, tasks, attendance] = await Promise.all([
    db.from('profiles').select('id, email, full_name, role').order('full_name', { ascending: true }),
    db.from('projects').select('*').order('created_at', { ascending: false }),
    db.from('project_members').select('project_id, user_id, added_at'),
    db.from('tasks').select('*').order('created_at', { ascending: false }),
    db.from('attendance').select('*').gte('work_date', since).order('work_date', { ascending: false }),
  ]);

  for (const r of [people, projects, memberships, tasks, attendance]) {
    if (r.error) throw new Error(r.error.message);
  }

  return {
    people: (people.data ?? []) as Person[],
    projects: (projects.data ?? []) as Project[],
    memberships: (memberships.data ?? []) as Membership[],
    tasks: (tasks.data ?? []) as Task[],
    attendance: (attendance.data ?? []) as Attendance[],
  };
}

/* ── Mutations ──────────────────────────────────────────────────────────── */
// The database triggers return readable messages ("only employees and interns
// can be added to a project team"), so errors are passed straight through.

function must<T>(r: { error: { message: string } | null; data?: T }): T {
  if (r.error) throw new Error(r.error.message);
  return r.data as T;
}

export type ProjectInput = Partial<Omit<Project, 'id' | 'created_at'>> & { name?: string };

export async function createProject(input: ProjectInput & { name: string }) {
  must(await requireSupabase().from('projects').insert(input));
}

export async function updateProject(id: string, patch: ProjectInput) {
  must(await requireSupabase().from('projects').update(patch).eq('id', id));
}

export async function deleteProject(id: string) {
  must(await requireSupabase().from('projects').delete().eq('id', id));
}

export async function addMember(projectId: string, userId: string) {
  must(await requireSupabase().from('project_members').insert({ project_id: projectId, user_id: userId }));
}

export async function removeMember(projectId: string, userId: string) {
  must(await requireSupabase().from('project_members').delete().eq('project_id', projectId).eq('user_id', userId));
}

export type TaskInput = {
  project_id: string;
  title: string;
  description?: string | null;
  assignee_id?: string | null;
  priority?: Priority;
  due_date?: string | null;
};

export async function createTask(input: TaskInput) {
  must(await requireSupabase().from('tasks').insert(input));
}

export async function updateTask(id: string, patch: Partial<Omit<Task, 'id' | 'project_id' | 'created_at'>>) {
  must(await requireSupabase().from('tasks').update(patch).eq('id', id));
}

export async function deleteTask(id: string) {
  must(await requireSupabase().from('tasks').delete().eq('id', id));
}

/** Time, date and user all come from the server; the body is intentionally empty. */
export async function checkIn() {
  must(await requireSupabase().from('attendance').insert({}));
}

export async function checkOut(attendanceId: string) {
  must(
    await requireSupabase()
      .from('attendance')
      .update({ check_out: new Date().toISOString() })
      .eq('id', attendanceId)
  );
}

export async function setRole(userId: string, role: Role) {
  must(await requireSupabase().from('profiles').update({ role }).eq('id', userId));
}
