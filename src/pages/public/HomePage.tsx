import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ShellHeader from '../../components/ShellHeader';
import SkillGrid from '../../components/SkillGrid';

const categories = [
  { id: 'ui-design', label: 'UI & Design' },
  { id: 'agentic-coding', label: 'Agentic Coding' },
  { id: 'testing', label: 'Testing' },
  { id: 'security', label: 'Security' },
  { id: 'automation', label: 'Automation' },
  { id: 'research', label: 'Research' },
];

const featuredSkills = [
  { id: '1', name: 'Design Assistant', description: 'Generates UI components from prompts.', stars: 142, forks: 23, downloads: 890, category: 'UI & Design', verified: true, version: '1.2.0' },
  { id: '2', name: 'Code Reviewer', description: 'Automated code review for pull requests.', stars: 98, forks: 12, downloads: 450, category: 'Agentic Coding', verified: true, version: '2.0.1' },
  { id: '3', name: 'Test Generator', description: 'Creates unit tests from code.', stars: 76, forks: 8, downloads: 320, category: 'Testing', verified: false, version: '0.9.0' },
  { id: '4', name: 'Vuln Scanner', description: 'Scans dependencies for vulnerabilities.', stars: 210, forks: 45, downloads: 1200, category: 'Security', verified: true, version: '3.1.0' },
  { id: '5', name: 'Deploy Bot', description: 'Automates deployment pipelines.', stars: 55, forks: 5, downloads: 180, category: 'Automation', verified: false, version: '1.0.0' },
  { id: '6', name: 'Research Summarizer', description: 'Summarizes academic papers.', stars: 34, forks: 3, downloads: 95, category: 'Research', verified: false, version: '0.5.0' },
  { id: '7', name: 'Icon Generator', description: 'Generates SVG icons from descriptions.', stars: 88, forks: 14, downloads: 410, category: 'UI & Design', verified: true, version: '1.3.0' },
  { id: '8', name: 'Refactor Agent', description: 'Suggests code refactoring improvements.', stars: 120, forks: 20, downloads: 600, category: 'Agentic Coding', verified: true, version: '2.1.0' },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/skills?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ShellHeader />
      <main>
        <section className="py-16 px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Curated AI Agent Skills Directory
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Discover high-quality, editorially vetted AI agent skills. No fluff, no AI clichés — just tools that work.
          </p>
          <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </section>

        <section className="px-4 pb-8">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/skills?category=${cat.id}`}
                className="rounded-full border border-gray-300 px-4 py-1 text-sm text-gray-700 hover:bg-gray-100"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Skills</h2>
            <SkillGrid skills={featuredSkills} viewMode="grid" />
          </div>
        </section>

        <section className="px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Showcase Spotlight</h2>
            <div className="border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2 aspect-video bg-gray-100 rounded flex items-center justify-center text-gray-400">
                Preview
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-xl font-semibold text-gray-900">Design Assistant Showcase</h3>
                <p className="mt-2 text-gray-600">See how Design Assistant generates complete UI components from natural language prompts.</p>
                <Link
                  to="/showcases"
                  className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  View Showcase
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-gray-200 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 justify-center text-sm text-gray-500">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">GitHub</a>
          <Link to="/about" className="hover:text-gray-700">About</Link>
          <Link to="/categories" className="hover:text-gray-700">Categories</Link>
          <a href="#" className="hover:text-gray-700">Anti-Slop Principles</a>
        </div>
      </footer>
    </div>
  );
}
