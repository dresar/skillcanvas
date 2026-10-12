import { useEffect, useState } from 'react';
import BackButton from '../../components/BackButton';
import ShellHeader from '../../components/ShellHeader';
import { addAuditLog, getCategories, getSkills, saveCategory } from '../../lib/storage';

interface Category {
  id: string;
  name: string;
  visible: boolean;
}

interface Skill {
  category?: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [skillCounts, setSkillCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const allCategories = getCategories() as Category[];
    const allSkills = getSkills() as Skill[];
    const counts: Record<string, number> = {};

    allSkills.forEach(skill => {
      if (skill.category) {
        counts[skill.category] = (counts[skill.category] || 0) + 1;
      }
    });

    setCategories(allCategories);
    setSkillCounts(counts);
  }, []);

  const toggleVisibility = (id: string) => {
    const updated = categories.map(category => {
      if (category.id !== id) {
        return category;
      }

      const visible = !category.visible;

      addAuditLog({
        action: 'toggle-category',
        targetId: id,
        details: `Set visible to ${visible}`,
      });

      return { ...category, visible };
    });

    setCategories(updated);
    saveCategory(updated);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <ShellHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4"><BackButton /></div>
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Administration
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Categories
          </h1>
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
            Manage category visibility and review the number of skills assigned to each category.
          </p>
        </header>

        {categories.length === 0 ? (
          <div className="rounded-[8px] border border-neutral-200 bg-white p-6 text-sm text-neutral-500 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
            No categories.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[8px] border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <table className="w-full min-w-[680px] text-left">
              <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60">
                <tr>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    Name
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    Slug / ID
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    Skill Count
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    Visibility
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr
                    key={category.id}
                    className="border-b border-neutral-200 transition-colors last:border-0 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/40"
                  >
                    <td className="px-4 py-4 text-sm font-medium">{category.name}</td>
                    <td className="px-4 py-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                      {category.id}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {skillCounts[category.name] || 0}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-[4px] border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                          category.visible
                            ? 'border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300'
                            : 'border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-500'
                        }`}
                      >
                        {category.visible ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => toggleVisibility(category.id)}
                        className="rounded-[6px] border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 active:scale-[0.98] dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      >
                        Toggle Visibility
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
