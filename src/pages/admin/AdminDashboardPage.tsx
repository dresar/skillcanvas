import { useEffect, useState } from 'react';
import { Activity, Boxes, ClipboardList, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAuditLog, getCategories, getRequests, getSkills } from '../../lib/storage';
import { Header } from '../../components/shell/Header';
import { Sidebar } from '../../components/shell/Sidebar';

type AuditEvent = {
  action?: string;
  targetId?: string;
  details?: string;
  timestamp?: string;
};

export default function AdminDashboardPage() {
  const [totalSkills, setTotalSkills] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [recentAudit, setRecentAudit] = useState<AuditEvent[]>([]);

  useEffect(() => {
    const requests = getRequests() as Array<{ status?: string }>;
    setTotalSkills(getSkills().length);
    setPendingRequests(requests.filter((request) => ['submitted', 'under_review', 'needs_info', 'pending'].includes(request.status ?? '')).length);
    setTotalCategories(getCategories().length);
    setRecentAudit((getAuditLog() as AuditEvent[]).slice(-5).reverse());
  }, []);

  const stats = [
    { label: 'Skills in directory', value: totalSkills, icon: Boxes, to: '/admin/skills' },
    { label: 'Requests needing review', value: pendingRequests, icon: ClipboardList, to: '/admin/requests' },
    { label: 'Visible categories', value: totalCategories, icon: Activity, to: '/admin/categories' },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <Header />
      <div className="mx-auto flex max-w-[1440px]">
        <Sidebar role="admin" />
        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">Directory operations</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">Admin overview</h1>
              <p className="mt-2 max-w-xl text-sm text-neutral-500 dark:text-neutral-400">A compact view of the queues and signals that keep SkillCanvas useful.</p>
            </div>
            <Link to="/admin/requests" className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-neutral-300 px-3 text-sm font-medium transition hover:border-neutral-500 active:scale-[0.98] dark:border-neutral-700 dark:hover:border-neutral-500">Review queue <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map(({ label, value, icon: Icon, to }) => (
              <Link key={label} to={to} className="border border-neutral-200 bg-neutral-50 p-4 transition hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600">
                <Icon className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                <p className="mt-5 text-2xl font-semibold tabular-nums">{value}</p>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
              </Link>
            ))}
          </div>
          <section className="mt-10 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
              <div>
                <h2 className="text-sm font-semibold">Recent audit activity</h2>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">The most recent directory changes.</p>
              </div>
              <Link to="/admin/audit-log" className="text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">Open audit log</Link>
            </div>
            {recentAudit.length === 0 ? (
              <div className="px-4 py-10 text-sm text-neutral-500 dark:text-neutral-400">No audit events recorded yet.</div>
            ) : (
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {recentAudit.map((event, index) => (
                  <div key={`${event.timestamp ?? event.targetId ?? 'event'}-${index}`} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                    <span><strong className="font-medium">{event.action ?? 'Updated'}</strong><span className="text-neutral-500 dark:text-neutral-400"> on {event.targetId ?? 'directory'}{event.details ? ` — ${event.details}` : ''}</span></span>
                    <time className="text-xs text-neutral-500 dark:text-neutral-400">{event.timestamp ? new Date(event.timestamp).toLocaleDateString() : 'Recently'}</time>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
