import { useState, type FormEvent } from 'react';
import { nameOf, PROJECT_STATUS, type Person, type Project, type ProjectInput } from '../../lib/workspace';

/** Create or edit a project. Only admins see the leader, name and date fields. */
export default function ProjectForm({
  leaders,
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  busy,
}: {
  leaders: Person[];
  initial?: Project;
  submitLabel: string;
  onSubmit: (input: ProjectInput & { name: string }) => Promise<boolean>;
  onCancel: () => void;
  busy: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [leader, setLeader] = useState(initial?.team_leader_id ?? '');
  const [status, setStatus] = useState(initial?.status ?? 'planning');
  const [start, setStart] = useState(initial?.start_date ?? '');
  const [due, setDue] = useState(initial?.due_date ?? '');
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Give the project a name.');
    if (start && due && due < start) return setError('The due date is before the start date.');
    setError('');
    const ok = await onSubmit({
      name: name.trim(),
      description: description.trim() || null,
      team_leader_id: leader || null,
      status,
      start_date: start || null,
      due_date: due || null,
    });
    if (ok && !initial) {
      setName('');
      setDescription('');
      setLeader('');
      setStart('');
      setDue('');
    }
  };

  return (
    <form className="ws-form" onSubmit={submit} noValidate>
      <div className="ws-form__grid">
        <label className="ws-field ws-field--wide">
          <span>Project name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Nexora CRM v2" maxLength={120} />
        </label>

        <label className="ws-field">
          <span>Team leader</span>
          <select value={leader} onChange={(e) => setLeader(e.target.value)}>
            <option value="">Assign later</option>
            {leaders.map((l) => (
              <option key={l.id} value={l.id}>
                {nameOf(l)}
              </option>
            ))}
          </select>
          {leaders.length === 0 && <em>No one has the team leader role yet — set it under People.</em>}
        </label>

        <label className="ws-field">
          <span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as Project['status'])}>
            {PROJECT_STATUS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <label className="ws-field">
          <span>Start date</span>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>

        <label className="ws-field">
          <span>Due date</span>
          <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        </label>

        <label className="ws-field ws-field--wide">
          <span>Description</span>
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What this project delivers and for whom." />
        </label>
      </div>

      {error && <p className="ws-form__error">{error}</p>}

      <div className="ws-form__actions">
        <button type="button" className="btn ws-btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
