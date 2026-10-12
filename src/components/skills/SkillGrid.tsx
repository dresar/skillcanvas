import React from 'react';
import { SkillCard, Skill } from './SkillCard';

export interface SkillGridProps {
  skills: Skill[];
  viewMode?: 'grid' | 'table';
  onFavoriteToggle?: (id: string) => void;
}

const SkillGrid: React.FC<SkillGridProps> = ({ skills, viewMode = 'grid', onFavoriteToggle }) => {
  if (viewMode === 'table') {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead className="bg-neutral-50 dark:bg-neutral-800">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Thumbnail</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Category</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Stars/Downloads</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Install Command</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
            {skills.map((skill) => (
              <tr key={skill.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="w-10 h-10 rounded overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    {skill.imageUrl ? (
                      <img src={skill.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-neutral-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-white">{skill.title}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">-</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">{skill.category}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">-</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400 font-mono">{skill.installCommand}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onFavoriteToggle?.(skill.id)}
                    className={`p-1 rounded ${
                      skill.isFavorited ? 'text-red-500' : 'text-neutral-400 hover:text-red-400'
                    }`}
                  >
                    <svg className="w-4 h-4" fill={skill.isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} onFavoriteToggle={onFavoriteToggle} />
      ))}
    </div>
  );
};

export { SkillGrid };
