/**
 * Every read and write the site makes against Supabase lives here, so the
 * components stay about markup and the table names appear in exactly one file.
 *
 * Public forms insert WITHOUT `.select()` on purpose: the RLS policies in
 * supabase/schema.sql grant anonymous visitors INSERT but not SELECT, and
 * asking for the row back would turn a successful write into a permission error.
 */
import { CV_BUCKET, requireSupabase } from './supabase';

export type SubmissionStatus = 'new' | 'reviewing' | 'contacted' | 'archived';

export const STATUSES: SubmissionStatus[] = ['new', 'reviewing', 'contacted', 'archived'];

export type WorkEnquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  brief: string;
  budget: string | null;
  status: SubmissionStatus;
  source: string;
  notes: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
};

export type InternApplication = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role_applied: string | null;
  message: string;
  cv_path: string | null;
  cv_name: string | null;
  cv_size: number | null;
  portfolio_url: string | null;
  status: SubmissionStatus;
  source: string;
  notes: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  source: string;
  unsubscribed: boolean;
  created_at: string;
};

export type SubmissionStats = {
  work_total: number;
  work_new: number;
  intern_total: number;
  intern_new: number;
  subscribers: number;
};

/** Turns a Postgres error into something worth showing a visitor. */
function fail(error: { message: string; code?: string }, fallback: string): never {
  if (error.code === '23505') throw new Error('That email is already on the list.');
  if (error.code === '42501') throw new Error('That action is not permitted for your account.');
  throw new Error(error.message || fallback);
}

/* ── Public form submissions ────────────────────────────────────────────── */

export type WorkEnquiryInput = {
  name: string;
  email: string;
  phone: string;
  brief: string;
  company?: string;
};

/** Homepage "What are you building?" form. */
export async function submitWorkEnquiry(input: WorkEnquiryInput): Promise<void> {
  const db = requireSupabase();
  const { data: auth } = await db.auth.getUser();

  const { error } = await db.from('work_enquiries').insert({
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    brief: input.brief.trim(),
    company: input.company?.trim() || null,
    source: 'website',
    user_id: auth.user?.id ?? null,
  });

  if (error) fail(error, 'Could not send your enquiry.');
}

export type InternApplicationInput = {
  name: string;
  email: string;
  phone: string;
  message: string;
  roleApplied?: string;
  cv?: File | null;
};

/**
 * Careers page application. The CV goes into the private `applications` bucket
 * first; only its path is stored on the row.
 */
export async function submitInternApplication(input: InternApplicationInput): Promise<void> {
  const db = requireSupabase();
  const { data: auth } = await db.auth.getUser();

  let cvPath: string | null = null;

  if (input.cv) {
    // Keep the original name for the dashboard, but store under an unguessable
    // key so one applicant can never overwrite another's file.
    const safe = input.cv.name.replace(/[^\w.\-]+/g, '_').slice(-80);
    cvPath = `cv/${new Date().getFullYear()}/${crypto.randomUUID()}-${safe}`;

    const { error: uploadError } = await db.storage.from(CV_BUCKET).upload(cvPath, input.cv, {
      contentType: 'application/pdf',
      upsert: false,
    });

    if (uploadError) throw new Error(`Could not upload your CV: ${uploadError.message}`);
  }

  const { error } = await db.from('intern_applications').insert({
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    message: input.message.trim(),
    role_applied: input.roleApplied?.trim() || null,
    cv_path: cvPath,
    cv_name: input.cv?.name ?? null,
    cv_size: input.cv?.size ?? null,
    source: 'careers',
    user_id: auth.user?.id ?? null,
  });

  if (error) fail(error, 'Could not send your application.');
}

/** Footer newsletter. A repeat signup is a success, not an error. */
export async function subscribeNewsletter(email: string): Promise<void> {
  const db = requireSupabase();

  const { error } = await db
    .from('newsletter_subscribers')
    .insert({ email: email.trim().toLowerCase(), source: 'footer' });

  if (error && error.code !== '23505') fail(error, 'Could not sign you up.');
}

/* ── Dashboard reads (admin only, enforced by RLS) ──────────────────────── */

export async function listWorkEnquiries(): Promise<WorkEnquiry[]> {
  const db = requireSupabase();
  const { data, error } = await db
    .from('work_enquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) fail(error, 'Could not load enquiries.');
  return (data ?? []) as WorkEnquiry[];
}

export async function listInternApplications(): Promise<InternApplication[]> {
  const db = requireSupabase();
  const { data, error } = await db
    .from('intern_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) fail(error, 'Could not load applications.');
  return (data ?? []) as InternApplication[];
}

export async function listSubscribers(): Promise<NewsletterSubscriber[]> {
  const db = requireSupabase();
  const { data, error } = await db
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) fail(error, 'Could not load subscribers.');
  return (data ?? []) as NewsletterSubscriber[];
}

export async function fetchStats(): Promise<SubmissionStats | null> {
  const db = requireSupabase();
  const { data, error } = await db.rpc('submission_stats');
  if (error) return null; // tiles are a nicety; never block the dashboard on them
  return (Array.isArray(data) ? data[0] : data) as SubmissionStats;
}

/* ── Dashboard writes ───────────────────────────────────────────────────── */

type Table = 'work_enquiries' | 'intern_applications';

export async function setStatus(table: Table, id: string, status: SubmissionStatus): Promise<void> {
  const db = requireSupabase();
  const { error } = await db.from(table).update({ status }).eq('id', id);
  if (error) fail(error, 'Could not update the status.');
}

export async function setNotes(table: Table, id: string, notes: string): Promise<void> {
  const db = requireSupabase();
  const { error } = await db.from(table).update({ notes: notes.trim() || null }).eq('id', id);
  if (error) fail(error, 'Could not save your note.');
}

export async function removeSubmission(table: Table, id: string): Promise<void> {
  const db = requireSupabase();
  const { error } = await db.from(table).delete().eq('id', id);
  if (error) fail(error, 'Could not delete that row.');
}

/** Short-lived download link for a CV in the private bucket. */
export async function cvDownloadUrl(path: string, expiresInSeconds = 60): Promise<string> {
  const db = requireSupabase();
  const { data, error } = await db.storage.from(CV_BUCKET).createSignedUrl(path, expiresInSeconds);
  if (error || !data) throw new Error(error?.message ?? 'Could not create a download link.');
  return data.signedUrl;
}

/* ── CSV export ─────────────────────────────────────────────────────────── */

/** Quotes a value for CSV, and defuses the =/+/-/@ formula-injection prefixes. */
function csvCell(value: unknown): string {
  const raw = value == null ? '' : String(value);
  const safe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function toCsv(rows: Record<string, unknown>[], columns: string[]): string {
  const head = columns.map(csvCell).join(',');
  const body = rows.map((r) => columns.map((c) => csvCell(r[c])).join(','));
  return [head, ...body].join('\r\n');
}
