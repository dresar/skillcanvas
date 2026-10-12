import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, Plus, Edit } from 'lucide-react';
import { getSkills } from '../../lib/storage';

interface Skill {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

export default function MemberSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    const allSkills = getSkills() as Skill[];
    setSkills(allSkills);
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Skills</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded border ${viewMode === 'grid' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            aria-label="Grid view"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded border ${viewMode === 'table' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            aria-label="Table view"
          >
            <List className="h-4 w-4" />
          </button>
          <Link
            to="/dashboard/skills/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Submit New Skill
          </Link>
        </div>
      </div>
      {skills.length === 0 ? (
        <p className="text-gray-500">No skills submitted yet.</p>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map(skill => (
            <div key={skill.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-1">{skill.name}</h3>
              <p className="text-sm text-gray-500 mb-2">Status: {skill.status}</p>
              <Link
                to={`/dashboard/skills/${skill.id}/edit`}
                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
              >
                <Edit className="h-3 w-3" />
                Edit
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <table className="w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map(skill => (
              <tr key={skill.id} className="border-b">
                <td className="p-3">{skill.name}</td>
                <td className="p-3">{skill.status}</td>
                <td className="p-3">
                  <Link
                    to={`/dashboard/skills/${skill.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
