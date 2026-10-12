import { useParams, Link } from 'react-router-dom';
import { Copy, Check, Star, GitFork, Download, Bookmark } from 'lucide-react';
import { useState } from 'react';
import ShellHeader from '../../components/ShellHeader';
import SkillGrid from '../../components/SkillGrid';

const skillData = {
  id: '1',
  name: 'Design Assistant',
  version: '1.2.0',
  verified: true,
  description: 'Generates UI components from natural language prompts. Supports multiple design systems.',
  installCommand: 'skillcanvas install design-assistant',
  repository: 'https://github.com/example/design-assistant',
  license: 'MIT',
  lastUpdated: '2025-03-15',
  stars: 142,
  forks: 23,
  downloads: 890,
  supportedAgents: ['Antigravity', 'Claude Code', 'Cursor', 'Aider', 'Hermes'],
  limitations: ['Requires Node.js 18+', 'Only works with React projects', 'Limited to 10 requests per minute'],
  category: 'UI & Design',
  imageUrl: '',
};

const relatedSkills = [
  { id: '7', name: 'Icon Generator', description: 'Generates SVG icons from descriptions.', stars: 88, forks: 14, downloads: 410, category: 'UI & Design', verified: true, version: '1.3.0' },
  { id: '8', name: 'Refactor Agent', description: 'Suggests code refactoring improvements.', stars: 120, forks: 20, downloads: 600, category: 'Agentic Coding', verified: true, version: '2.1.0' },
  { id: '3', name: 'Test Generator', description: 'Creates unit tests from code.', stars: 76, forks: 8, downloads: 320, category: 'Testing', verified: false, version: '0.9.0' },
  { id: '4', name: 'Vuln Scanner', description: 'Scans dependencies for vulnerabilities.', stars: 210, forks: 45, downloads: 1200, category: 'Security', verified: true, version: '3.1.0' },
];

export default function SkillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);
  const [favorited, setFavorited] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(skillData.installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ShellHeader />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/skills" className="hover:underline">Skills</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{skillData.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{skillData.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">v{skillData.version}</span>
                  {skillData.verified && (
                    <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Verified</span>
                  )}
                </div>
                <p className="mt-3 text-gray-600">{skillData.description}</p>
              </div>
              <button
                onClick={() => setFavorited(!favorited)}
                className={`p-2 rounded-full border ${favorited ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-400'} hover:bg-gray-50`}
                aria-label="Bookmark"
              >
                <Bookmark className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy Install Command'}
              </button>
            </div>

            <div className="mt-8 aspect-video bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
              Preview
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Source Info</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Repository: <a href={skillData.repository} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{skillData.repository}</a></p>
                  <p>License: {skillData.license}</p>
                  <p>Last updated: {skillData.lastUpdated}</p>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Metrics</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><Star className="h-4 w-4" />{skillData.stars}</span>
                  <span className="flex items-center gap-1"><GitFork className="h-4 w-4" />{skillData.forks}</span>
                  <span className="flex items-center gap-1"><Download className="h-4 w-4" />{skillData.downloads}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Supported Agents</h3>
              <div className="flex flex-wrap gap-2">
                {skillData.supportedAgents.map((agent) => (
                  <span key={agent} className="rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{agent}</span>
                ))}
              </div>
            </div>

            <div className="mt-6 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Limitations / Notes</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {skillData.limitations.map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Related Skills</h2>
          <SkillGrid skills={relatedSkills} viewMode="grid" />
        </section>
      </main>
    </div>
  );
}
