import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Grid, List, Trash2 } from 'lucide-react';
import ShellHeader from '../../components/ShellHeader';
import { addAuditLog, getSkills, saveSkill } from '../../lib/storage';

interface Skill {
  id: string;
  name: string;
  status: string;
  published: boolean;
  imageUrl?: string;
  category?: string;
}

function PreviewPattern() {
  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="none"
      className="h-full w-full"
      role="img"
      aria-label="Skill preview"
    >
      <defs>
        <linearGradient id="skill-preview-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4d4d4" />
          <stop offset="100%" stopColor="#737373" />
        </linearGradient>
        <pattern id="skill-preview-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M0 32L32 0M-8 8L8 -8M24 40L40 24" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="400" height="240" fill="url(#skill-preview-gradient)" />
      <rect width="400" height="240" fill="url(#skill-preview-pattern)" />
      <circle cx="315" cy="55" r="54" fill="#ffffff" fillOpacity="0.16" />
      <circle cx="84" cy="188" r="74" fill="#171717" fillOpacity="0.12" />
      <path d="M0 192C80 152 122 224 202 181C277 141 322 179 400 130V240H0Z" fill="#171717" fillOpacity="0.14" />
    </svg>
  );
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const allSkills = getSkills() as Skill[];
    setSkills(allSkills);
  }, []);

  const togglePublished = (id: string) => {
    const updated = skills.map(skill => {
      if (skill.id === id) {
        const newPublished = !skill.published;
        addAuditLog({
          action: 'toggle-publish',
          targetId: id,
          details: `Set published to ${newPublished}`,
        });
        return { ...skill, published: newPublished };
      }
      return skill;
    });

    setSkills(updated);
    saveSkill(updated);
  };

  const confirmDelete = () => {
    if (!deleteId) return;

    const updated = skills.filter(skill => skill.id !== deleteId);
    setSkills(updated);
    saveSkill(updated);
    addAuditLog({
      action: 'delete',
      targetId: deleteId,
      details: 'Deleted skill',
    });
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <ShellHeader />
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="mb-10 flex flex-col gap-6 border-b border-neutral-200 pb-8 dark:border-neutral-800 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-neutral-500">
              ADMIN STUDIO / REPOSITORY
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Manage Skills</h1>
            <p className="mt-3 max-w-2xl text-sm text-neutral-500 dark:text-neutral-400">
              Curate, publish, inspect, and maintain agent skills across the index.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-[6px] border border-neutral-300 p-1 dark:border-neutral-700">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center gap-2 rounded-[4px] px-3 py-2 text-xs font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                    : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950 dark:hover:bg-neutral-900 dark:hover:text-neutral-50'
                }`}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
              >
                <Grid className="h-3.5 w-3.5" />
                Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`inline-flex items-center gap-2 rounded-[4px] px-3 py-2 text-xs font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                    : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950 dark:hover:bg-neutral-900 dark:hover:text-neutral-50'
                }`}
                aria-label="Table view"
                aria-pressed={viewMode === 'table'}
              >
                <List className="h-3.5 w-3.5" />
                Table
              </button>
            </div>

            <Link
              to="/admin/skills/new"
              className="inline-flex items-center gap-2 rounded-[6px] bg-neutral-950 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              + New Skill
            </Link>
          </div>
        </section>

        {skills.length === 0 ? (
          <div className="border border-dashed border-neutral-300 px-6 py-16 text-center dark:border-neutral-700">
            <p className="text-sm text-neutral-500">No skills found.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {skills.map(skill => (
              <article
                key={skill.id}
                className="overflow-hidden border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="aspect-[1.65] w-full overflow-hidden border-b border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
                  {skill.imageUrl ? (
                    <img src={skill.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <PreviewPattern />
                  )}
                </div>

                <div className="p-4">
                  <p className="mb-2 truncate text-[10px] uppercase tracking-wider text-neutral-500">
                    {skill.category || 'Agent Skill'}
                  </p>
                  <h2 className="truncate text-sm font-semibold">{skill.name}</h2>
                  <div className="mt-3">
                    <span
                      className={`inline-flex border px-2 py-0.5 font-mono text-[9px] uppercase ${
                        skill.published
                          ? 'border-green-300 text-green-700 dark:border-green-800 dark:text-green-400'
                          : 'border-yellow-300 text-yellow-700 dark:border-yellow-800 dark:text-yellow-400'
                      }`}
                    >
                      {skill.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-2.5 text-xs dark:border-neutral-800">
                  <Link
                    to={`/admin/skills/${skill.id}/edit`}
                    className="font-medium text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50"
                  >
                    Edit
                  </Link>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => togglePublished(skill.id)}
                      className="text-neutral-500 transition-colors hover:text-neutral-950 dark:hover:text-neutral-50"
                      title={skill.published ? 'Unlist' : 'Publish'}
                      aria-label={skill.published ? `Unlist ${skill.name}` : `Publish ${skill.name}`}
                    >
                      {skill.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(skill.id)}
                      className="text-neutral-500 transition-colors hover:text-red-600 dark:hover:text-red-400"
                      title="Delete"
                      aria-label={`Delete ${skill.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <table className="w-full min-w-[640px] text-left">
              <thead className="border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Name</th>
                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Category</th>
                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                  <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.map(skill => (
                  <tr key={skill.id} className="border-b border-neutral-200 last:border-0 dark:border-neutral-800">
                    <td className="px-5 py-4 text-sm font-medium">{skill.name}</td>
                    <td className="px-5 py-4 text-xs uppercase tracking-wider text-neutral-500">
                      {skill.category || 'Agent Skill'}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex border px-2 py-0.5 font-mono text-[9px] uppercase ${
                          skill.published
                            ? 'border-green-300 text-green-700 dark:border-green-800 dark:text-green-400'
                            : 'border-yellow-300 text-yellow-700 dark:border-yellow-800 dark:text-yellow-400'
                        }`}
                      >
                        {skill.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end items-center gap-4">
                        <Link
                          to={`/admin/skills/${skill.id}/edit`}
                          className="text-xs font-medium text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => togglePublished(skill.id)}
                          className="text-neutral-500 transition-colors hover:text-neutral-950 dark:hover:text-neutral-50"
                          title={skill.published ? 'Unlist' : 'Publish'}
                          aria-label={skill.published ? `Unlist ${skill.name}` : `Publish ${skill.name}`}
                        >
                          {skill.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(skill.id)}
                          className="text-neutral-500 transition-colors hover:text-red-600 dark:hover:text-red-400"
                          title="Delete"
                          aria-label={`Delete ${skill.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {deleteId && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 px-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            <div className="w-full max-w-md border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
              <h2 id="delete-dialog-title" className="text-lg font-semibold">
                Delete skill?
              </h2>
              <p className="mt-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                This action permanently removes the skill from the repository and cannot be undone.
              </p>
              <div className="mt-7 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  className="rounded-[6px] border border-neutral-300 px-4 py-2 text-xs font-semibold transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="rounded-[6px] bg-neutral-950 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
