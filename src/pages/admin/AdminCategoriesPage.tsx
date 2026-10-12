import { useState, useEffect } from 'react';
import { getCategories, saveCategory, getSkills, addAuditLog } from '../../lib/storage';

interface Category {
  id: string;
  name: string;
  visible: boolean;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [skillCounts, setSkillCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const allCategories = getCategories() as Category[];
    const allSkills = getSkills() as any[];
    setCategories(allCategories);
    const counts: Record<string, number> = {};
    allSkills.forEach((s: any) => {
      const cat = s.category;
      if (cat) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    setSkillCounts(counts);
  }, []);

  const toggleVisibility = (id: string) => {
    const updated = categories.map(c => {
      if (c.id === id) {
        const newVisible = !c.visible;
        addAuditLog({ action: 'toggle-category', targetId: id, details: `Set visible to ${newVisible}` });
        return { ...c, visible: newVisible };
      }
      return c;
    });
    setCategories(updated);
    saveCategory(updated);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories.</p>
      ) : (
        <table className="w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Skill Count</th>
              <th className="text-left p-3">Visible</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} className="border-b">
                <td className="p-3">{cat.name}</td>
                <td className="p-3">{skillCounts[cat.name] || 0}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${cat.visible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {cat.visible ? 'Visible' : 'Hidden'}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggleVisibility(cat.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Toggle Visibility
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
