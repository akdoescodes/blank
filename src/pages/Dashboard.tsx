import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  cvDownloadUrl,
  fetchStats,
  listInternApplications,
  listSubscribers,
  listWorkEnquiries,
  removeSubmission,
  setNotes,
  setStatus,
  STATUSES,
  toCsv,
  type InternApplication,
  type NewsletterSubscriber,
  type SubmissionStats,
  type SubmissionStatus,
  type WorkEnquiry,
} from '../lib/api';
import { useAuth } from '../lib/auth';
import './Dashboard.css';

type Tab = 'interns' | 'work' | 'list';

const TABS: { id: Tab; label: string }[] = [
  { id: 'interns', label: 'Intern applications' },
  { id: 'work', label: 'Work enquiries' },
  { id: 'list', label: 'Newsletter' },
];

const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

function download(filename: string, csv: string) {
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── One submission row ─────────────────────────────────────────────────── */

type RowProps = {
  kind: 'interns' | 'work';
  row: InternApplication | WorkEnquiry;
  onChanged: () => void;
  onError: (message: string) => void;
};

function Row({ kind, row, onChanged, onError }: RowProps) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(row.notes ?? '');
  const [saving, setSaving] = useState(false);
  const table = kind === 'interns' ? 'intern_applications' : 'work_enquiries';

  const intern = kind === 'interns' ? (row as InternApplication) : null;
  const work = kind === 'work' ? (row as WorkEnquiry) : null;
  const body = intern ? intern.message : work!.brief;

  const run = async (job: () => Promise<void>) => {
    setSaving(true);
    try {
      await job();
      onChanged();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'That did not work.');
    } finally {
      setSaving(false);
    }
  };

  const openCv = async () => {
    if (!intern?.cv_path) return;
    try {
      window.open(await cvDownloadUrl(intern.cv_path), '_blank', 'noopener');
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Could not open that CV.');
    }
  };

  return (
    <li className={`sub card${open ? ' is-open' : ''}`}>
      <button className="sub__head" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="sub__who">
          <span className="sub__name">{row.name}</span>
          <span className="sub__email">{row.email}</span>
        </span>

        <span className="sub__meta">
          {work?.company && <span className="sub__company">{work.company}</span>}
          {intern?.cv_path && <span className="sub__tag">CV</span>}
          <span className={`sub__status sub__status--${row.status}`}>{row.status}</span>
          <span className="sub__date">{when(row.created_at)}</span>
        </span>
      </button>

      {open && (
        <div className="sub__body">
          <p className="sub__text">{body}</p>

          <dl className="sub__facts">
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={`tel:${row.phone}`}>{row.phone}</a>
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${row.email}`}>{row.email}</a>
              </dd>
            </div>
            {intern?.role_applied && (
              <div>
                <dt>Role</dt>
                <dd>{intern.role_applied}</dd>
              </div>
            )}
            {work?.budget && (
              <div>
                <dt>Budget</dt>
                <dd>{work.budget}</dd>
              </div>
            )}
            <div>
              <dt>Source</dt>
              <dd>{row.source}</dd>
            </div>
          </dl>

          <div className="sub__actions">
            <label className="sub__select">
              <span>Status</span>
              <select
                value={row.status}
                disabled={saving}
                onChange={(e) => run(() => setStatus(table, row.id, e.target.value as SubmissionStatus))}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            {intern?.cv_path && (
              <button className="btn btn--ghost sub__btn" onClick={openCv}>
                Open CV{intern.cv_name ? ` — ${intern.cv_name}` : ''}
              </button>
            )}

            <button
              className="btn btn--ghost sub__btn sub__btn--danger"
              disabled={saving}
              onClick={() => {
                if (window.confirm(`Delete the submission from ${row.name}? This cannot be undone.`)) {
                  run(() => removeSubmission(table, row.id));
                }
              }}
            >
              Delete
            </button>
          </div>

          <div className="sub__note">
            <textarea
              rows={2}
              placeholder="Private note — only signed-in admins see this."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button
              className="btn btn--ghost sub__btn"
              disabled={saving || note === (row.notes ?? '')}
              onClick={() => run(() => setNotes(table, row.id, note))}
            >
              {saving ? 'Saving…' : 'Save note'}
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function Dashboard() {
  const { profile, user, isAdmin, signOut } = useAuth();

  const [tab, setTab] = useState<Tab>('interns');
  const [interns, setInterns] = useState<InternApplication[]>([]);
  const [work, setWork] = useState<WorkEnquiry[]>([]);
  const [list, setList] = useState<NewsletterSubscriber[]>([]);
  const [stats, setStats] = useState<SubmissionStats | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | SubmissionStatus>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Dashboard — Alikima';
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [a, w, n, s] = await Promise.all([
        listInternApplications(),
        listWorkEnquiries(),
        listSubscribers().catch(() => [] as NewsletterSubscriber[]),
        fetchStats(),
      ]);
      setInterns(a);
      setWork(w);
      setList(n);
      setStats(s);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your inbox.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const rows = tab === 'interns' ? interns : tab === 'work' ? work : [];

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== 'all' && r.status !== filter) return false;
      if (!q) return true;
      const text = tab === 'interns' ? (r as InternApplication).message : (r as WorkEnquiry).brief;
      const company = tab === 'work' ? ((r as WorkEnquiry).company ?? '') : '';
      return `${r.name} ${r.email} ${r.phone} ${company} ${text}`.toLowerCase().includes(q);
    });
  }, [rows, query, filter, tab]);

  const exportCsv = () => {
    if (tab === 'list') {
      download('newsletter.csv', toCsv(list, ['email', 'source', 'unsubscribed', 'created_at']));
      return;
    }
    const columns =
      tab === 'interns'
        ? ['created_at', 'name', 'email', 'phone', 'role_applied', 'status', 'cv_name', 'message', 'notes']
        : ['created_at', 'name', 'email', 'phone', 'company', 'status', 'brief', 'notes'];
    download(`${tab}.csv`, toCsv(visible as unknown as Record<string, unknown>[], columns));
  };

  const tiles = [
    { label: 'Applications', value: stats?.intern_total ?? interns.length },
    { label: 'New applications', value: stats?.intern_new ?? interns.filter((r) => r.status === 'new').length },
    { label: 'Enquiries', value: stats?.work_total ?? work.length },
    { label: 'New enquiries', value: stats?.work_new ?? work.filter((r) => r.status === 'new').length },
    { label: 'Subscribers', value: stats?.subscribers ?? list.length },
  ];

  return (
    <section className="section dash">
      <div className="bg-grid" />

      <div className="shell">
        <header className="dash__head">
          <div>
            <span className="eyebrow">Inbox</span>
            <h1 className="dash__title">Everything the site collected</h1>
            <p className="dash__lede">
              Signed in as {profile?.full_name || user?.email}
              {isAdmin ? ' · admin' : ' · member'}
            </p>
          </div>

          <div className="dash__head-actions">
            <button className="btn btn--ghost" onClick={() => void load()} disabled={loading}>
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
            <button className="btn btn--ghost" onClick={() => void signOut()}>
              Sign out
            </button>
          </div>
        </header>

        {!isAdmin && (
          <p className="dash__banner" role="status">
            Your account is a member, so you only see submissions tied to it. To read the whole inbox, run
            this once in the Supabase SQL editor:{' '}
            <code>select public.set_user_role('{user?.email}', 'admin');</code> then refresh.
          </p>
        )}

        {error && (
          <p className="dash__banner dash__banner--error" role="alert">
            {error}
          </p>
        )}

        <ul className="dash__tiles">
          {tiles.map((t) => (
            <li key={t.label} className="tile card">
              <p className="tile__value">{t.value}</p>
              <p className="tile__label">{t.label}</p>
            </li>
          ))}
        </ul>

        <div className="dash__bar">
          <div className="dash__tabs" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                className={`dash__tab${tab === t.id ? ' is-active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
                <span className="dash__count">
                  {t.id === 'interns' ? interns.length : t.id === 'work' ? work.length : list.length}
                </span>
              </button>
            ))}
          </div>

          <div className="dash__filters">
            {tab !== 'list' && (
              <>
                <input
                  type="search"
                  className="dash__search"
                  placeholder="Search name, email, message…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <select
                  className="dash__status"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | SubmissionStatus)}
                >
                  <option value="all">All statuses</option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </>
            )}
            <button className="btn btn--ghost" onClick={exportCsv}>
              Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <p className="dash__empty">Loading…</p>
        ) : tab === 'list' ? (
          list.length === 0 ? (
            <p className="dash__empty">Nobody has subscribed yet.</p>
          ) : (
            <ul className="subs">
              {list.map((s) => (
                <li key={s.id} className="sub card">
                  <div className="sub__head sub__head--plain">
                    <span className="sub__who">
                      <span className="sub__name">{s.email}</span>
                      <span className="sub__email">via {s.source}</span>
                    </span>
                    <span className="sub__meta">
                      {s.unsubscribed && <span className="sub__tag">unsubscribed</span>}
                      <span className="sub__date">{when(s.created_at)}</span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )
        ) : visible.length === 0 ? (
          <p className="dash__empty">
            {rows.length === 0
              ? 'Nothing here yet. Submissions from the site land in this list.'
              : 'No submission matches that search.'}
          </p>
        ) : (
          <ul className="subs">
            {visible.map((r) => (
              <Row
                key={r.id}
                kind={tab === 'interns' ? 'interns' : 'work'}
                row={r}
                onChanged={() => void load()}
                onError={setError}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
