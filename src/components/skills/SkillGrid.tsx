import React from 'react';
import SkillCard, { normalizeSkill, SkillInput } from './SkillCard';

export interface SkillGridProps {
  skills: SkillInput[];
  viewMode?: 'grid' | 'table';
  onFavoriteToggle?: (id: string) => void;
}

const stat = (value: number) => value > 999 ? `${(value / 1000).toFixed(value > 9999 ? 0 : 1)}k` : String(value);

export function SkillGrid({ skills, viewMode = 'grid', onFavoriteToggle }: SkillGridProps) {
  const normalized = skills.map(normalizeSkill);
  if (viewMode === 'table') {
    return (
      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="min-w-full divide-y divide-neutral-200 text-left dark:divide-neutral-800">
          <thead className="bg-neutral-50 dark:bg-neutral-900">
            <tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
              <th className="px-4 py-3 font-normal">Skill</th><th className="px-4 py-3 font-normal">Category</th><th className="px-4 py-3 font-normal">Status</th><th className="px-4 py-3 font-normal">Signals</th><th className="px-4 py-3 font-normal">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-950">
            {normalized.map((skill) => (
              <tr key={skill.id} className="text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900">
                <td className="max-w-xs px-4 py-3"><a href={`/skills/${skill.slug}`} className="block truncate font-medium text-neutral-950 hover:underline dark:text-neutral-50">{skill.name}</a><span className="mt-1 block truncate text-xs text-neutral-500">{skill.summary}</span></td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-neutral-600 dark:text-neutral-400">{skill.category}</td>
                <td className="whitespace-nowrap px-4 py-3"><span className="border border-neutral-300 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] dark:border-neutral-700">{skill.verificationStatus}</span></td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-neutral-500">{stat(skill.stars)} stars · {stat(skill.downloads)} uses</td>
                <td className="whitespace-nowrap px-4 py-3"><button type="button" onClick={() => onFavoriteToggle?.(skill.id)} className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500 hover:text-neutral-950 dark:hover:text-white">{skill.isFavorited ? 'Saved' : 'Save'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{normalized.map((skill) => <SkillCard key={skill.id} skill={skill} onFavoriteToggle={onFavoriteToggle} />)}</div>;
}

export default SkillGrid;
