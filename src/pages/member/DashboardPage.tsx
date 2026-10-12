import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, CheckCircle, Heart } from 'lucide-react';
import { getSkills, getRequests } from '../../lib/storage';

interface Skill {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

interface Request {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const allSkills = getSkills() as Skill[];
    const allRequests = getRequests() as Request[];
    setSkills(allSkills);
    setRequests(allRequests);
  }, []);

  const totalContributed = skills.length;
  const inReview = skills.filter(s => s.status === 'review').length;
  const favorites = skills.filter(s => s.status === 'favorited').length;

  const recentSubmissions = [...skills]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <FileText className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Total Contributed</p>
            <p className="text-xl font-semibold">{totalContributed}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <CheckCircle className="h-8 w-8 text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">In Review</p>
            <p className="text-xl font-semibold">{inReview}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <Heart className="h-8 w-8 text-red-500" />
          <div>
            <p className="text-sm text-gray-500">Favorites</p>
            <p className="text-xl font-semibold">{favorites}</p>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <Link
          to="/dashboard/skills/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Submit New Skill
        </Link>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Submissions</h2>
        {recentSubmissions.length === 0 ? (
          <p className="text-gray-500">No submissions yet.</p>
        ) : (
          <ul className="space-y-2">
            {recentSubmissions.map(skill => (
              <li key={skill.id} className="bg-white rounded-lg shadow p-3 flex justify-between items-center">
                <span className="font-medium">{skill.name}</span>
                <span className="text-sm text-gray-500">{skill.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
