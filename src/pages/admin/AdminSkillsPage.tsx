import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, Trash2, Eye, EyeOff } from 'lucide-react';
import { getSkills, saveSkill, addAuditLog } from '../../lib/storage';

interface Skill {
  id: string;
  name: string;
  status: string;
  published: boolean;
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
    const updated = skills.map(s => {
      if (s.id === id) {
        const newPublished = !s.published;
        addAuditLog({ action: 'toggle-publish', targetId: id, details: `Set published to ${newPublished}` });
        return { ...s, published: newPublished };
      }
      return s;
    });
    setSkills(updated);
    saveSkill(updated);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    const updated = skills.filter(s => s.id !== deleteId);
    setSkills(updated);
    saveSkill(updated);
    addAuditLog({ action: 'delete', targetId: deleteId, details: `Deleted skill` });
    setDeleteId(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Skills</h1>
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
            to="/admin/skills/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            New Skill
          </Link>
        </div>
      </div>
      {skills.length === 0 ? (
        <p className="text-gray-500">No skills found.</p>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map(skill => (
            <div key={skill.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-1">{skill.name}</h3>
              <p className="text-sm text-gray-500 mb-2">Status: {skill.status}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePublished(skill.id)}
                  className="p-1 rounded hover:bg-gray-100"
                  title={skill.published ? 'Unlist' : 'Publish'}
                >
                  {skill.published ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
                </button>
                <Link to={`/admin/skills/${skill.id}/edit`} className="text-blue-600 hover:underline text-sm">Edit</Link>
                <button
                  onClick={() => setDeleteId(skill.id)}
                  className="p-1 rounded hover:bg-red-100 text-red-600"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table className="w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Published</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map(skill => (
              <tr key={skill.id} className="border-b">
                <td className="p-3">{skill.name}</td>
                <td className="p-3">{skill.status}</td>
                <td className="p-3">
                  <button
                    onClick={() => togglePublished(skill.id)}
                    className={`px-2 py-1 rounded text-xs font-medium ${skill.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {skill.published ? 'Published' : 'Unlisted'}
                  </button>
                </td>
                <td className="p-3 flex gap-2">
                  <Link to={`/admin/skills/${skill.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                  <button onClick={() => setDeleteId(skill.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this skill? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
