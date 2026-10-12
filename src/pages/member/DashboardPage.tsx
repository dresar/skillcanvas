import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, FileText, Heart, Plus, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFavorites, getRequests, getSkills } from '../../lib/storage';
import { Header } from '../../components/shell/Header';
import { Sidebar } from '../../components/shell/Sidebar';

type DashboardSkill = {
  id: string;
  name?: string;
  title?: string;
  status?: string;
  createdAt?: string;
};

type DashboardRequest = {
  id: string;
  skillName?: string;
  status?: string;
};

const statusLabel: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  in_review: 'In review',
  changes_requested: 'Changes requested',
  published: 'Published',
};

export default function DashboardPage() {
  const [skills, setSkills] = useState<DashboardSkill[]>([]);
  const [requests, setRequests] = useState<DashboardRequest[]>([]);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    setSkills(getSkills() as DashboardSkill[]);
    setRequests(getRequests() as DashboardRequest[]);
    setFavoriteCount(getFavorites().length);
  }, []);

  const inReview = useMemo(() => skills.filter((skill) => ['submitted', 'in_review'].includes(skill.status ?? '')).length, [skills]);
  const recentSubmissions = useMemo(
    () => [...skills].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()).slice(0, 5),
    [skills],
  );

  const stats = [
    { label: 'Skills in directory', value: skills.length, icon: FileText },
    { label: 'In review', value: inReview, icon: CheckCircle2 },
    { label: 'Saved favorites', value: favoriteCount, icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <Header />
      <div className="mx-auto flex max-w-[1440px]">
        <Sidebar role="member" />
        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">Member workspace</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">Overview</h1>
              <p className="mt-2 max-w-xl text-sm text-neutral-500 dark:text-neutral-400">Keep your contributions clear, current, and useful to the people who rely on them.</p>
            </div>
            <Link to="/dashboard/skills/new" className="inline-flex h-9 items-center gap-2 rounded-[6px] bg-neutral-900 px-3 text-sm font-medium text-white transition hover:bg-neutral-700 active:scale-[0.98] dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
              <Plus className="h-4 w-4" />
              Submit skill
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <Icon className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                <p className="mt-5 text-2xl font-semibold tabular-nums">{value}</p>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
              </div>
            ))}
          </div>
          <section className="mt-10 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
              <div>
                <h2 className="text-sm font-semibold">Recent submissions</h2>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">The latest changes in your workspace.</p>
              </div>
              <Link to="/dashboard/skills" className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">View all <ArrowUpRight className="h-3.5 w-3.5" /></Link>
            </div>
            {recentSubmissions.length === 0 ? (
              <div className="px-4 py-10 text-sm text-neutral-500 dark:text-neutral-400">No submissions yet. Start with a focused, well-documented skill.</div>
            ) : (
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {recentSubmissions.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between gap-4 px-4 py-3">
                    <span className="truncate text-sm font-medium">{skill.name ?? skill.title ?? skill.id}</span>
                    <span className="shrink-0 text-xs text-neutral-500 dark:text-neutral-400">{statusLabel[skill.status ?? ''] ?? skill.status ?? 'Uncategorized'}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="mt-4 border border-neutral-200 p-4 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Request queue</h2>
              <Link to="/dashboard/requests" className="text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">{requests.length} total</Link>
            </div>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Track ideas submitted for future directory coverage.</p>
          </section>
        </main>
      </div>
    </div>
  );
}
