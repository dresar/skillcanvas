import { Link } from 'react-router-dom';
import ShellHeader from '../../components/ShellHeader';

const categories = [
  { id: 'ui-design', name: 'UI & Design', summary: 'Tools for creating user interfaces and design assets.', count: 12 },
  { id: 'agentic-coding', name: 'Agentic Coding', summary: 'Autonomous coding assistants and code generation.', count: 8 },
  { id: 'testing', name: 'Testing', summary: 'Automated testing and quality assurance skills.', count: 5 },
  { id: 'security', name: 'Security', summary: 'Vulnerability scanning and security analysis.', count: 7 },
  { id: 'automation', name: 'Automation', summary: 'Workflow automation and deployment tools.', count: 6 },
  { id: 'research', name: 'Research', summary: 'Academic research and paper analysis skills.', count: 4 },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white">
      <ShellHeader />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Skill Categories</h1>
        <p className="text-gray-600 mb-8">Browse skills by domain and specialization.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/skills?category=${cat.id}`}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900">{cat.name}</h2>
              <p className="mt-2 text-sm text-gray-600">{cat.summary}</p>
              <span className="mt-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {cat.count} skills
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
