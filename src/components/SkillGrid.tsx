import { Star, GitFork, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Skill {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  downloads: number;
  category: string;
  verified: boolean;
  version: string;
  imageUrl?: string;
}

interface SkillGridProps {
  skills: Skill[];
  viewMode: 'grid' | 'table';
  onFavoriteToggle?: (id: string) => void;
}

export default function SkillGrid({ skills, viewMode, onFavoriteToggle }: SkillGridProps) {
  if (viewMode === 'table') {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Name</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Category</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Stars</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Forks</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Downloads</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {skills.map((skill) => (
              <tr key={skill.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <Link to={`/skills/${skill.id}`} className="font-medium text-gray-900 hover:underline">
                    {skill.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-gray-600">{skill.category}</td>
                <td className="px-4 py-2 text-gray-600">{skill.stars}</td>
                <td className="px-4 py-2 text-gray-600">{skill.forks}</td>
                <td className="px-4 py-2 text-gray-600">{skill.downloads}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {skills.map((skill) => (
        <div key={skill.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <Link to={`/skills/${skill.id}`} className="block">
            <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400 text-xs">
              {skill.imageUrl ? (
                <img src={skill.imageUrl} alt={skill.name} className="w-full h-full object-cover rounded" />
              ) : (
                <span>No preview</span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 truncate">{skill.name}</h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{skill.description}</p>
            <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Star className="h-3 w-3" />{skill.stars}</span>
              <span className="flex items-center gap-1"><GitFork className="h-3 w-3" />{skill.forks}</span>
              <span className="flex items-center gap-1"><Download className="h-3 w-3" />{skill.downloads}</span>
            </div>
          </Link>
          {onFavoriteToggle && (
            <button
              onClick={(e) => { e.preventDefault(); onFavoriteToggle(skill.id); }}
              className="mt-2 text-xs text-blue-600 hover:underline"
            >
              Favorite
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
