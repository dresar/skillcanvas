import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ShellHeader from '../../components/ShellHeader';
import SkillGrid from '../../components/SkillGrid';
import { Grid3X3, List, X } from 'lucide-react';

const allSkills = [
  { id: '1', name: 'Design Assistant', description: 'Generates UI components from prompts.', stars: 142, forks: 23, downloads: 890, category: 'UI & Design', verified: true, version: '1.2.0' },
  { id: '2', name: 'Code Reviewer', description: 'Automated code review for pull requests.', stars: 98, forks: 12, downloads: 450, category: 'Agentic Coding', verified: true, version: '2.0.1' },
  { id: '3', name: 'Test Generator', description: 'Creates unit tests from code.', stars: 76, forks: 8, downloads: 320, category: 'Testing', verified: false, version: '0.9.0' },
  { id: '4', name: 'Vuln Scanner', description: 'Scans dependencies for vulnerabilities.', stars: 210, forks: 45, downloads: 1200, category: 'Security', verified: true, version: '3.1.0' },
  { id: '5', name: 'Deploy Bot', description: 'Automates deployment pipelines.', stars: 55, forks: 5, downloads: 180, category: 'Automation', verified: false, version: '1.0.0' },
  { id: '6', name: 'Research Summarizer', description: 'Summarizes academic papers.', stars: 34, forks: 3, downloads: 95, category: 'Research', verified: false, version: '0.5.0' },
  { id: '7', name: 'Icon Generator', description: 'Generates SVG icons from descriptions.', stars: 88, forks: 14, downloads: 410, category: 'UI & Design', verified: true, version: '1.3.0' },
  { id: '8', name: 'Refactor Agent', description: 'Suggests code refactoring improvements.', stars: 120, forks: 20, downloads: 600, category: 'Agentic Coding', verified: true, version: '2.1.0' },
];

const categories = ['UI & Design', 'Agentic Coding', 'Testing', 'Security', 'Automation', 'Research'];
const types = ['Tool', 'Workflow', 'Plugin'];
const agents = ['Antigravity', 'Claude Code', 'Cursor', 'Aider', 'Hermes'];
const verifications = ['Verified', 'Unverified'];

export default function SkillsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [type, setType] = useState('');
  const [agent, setAgent] = useState('');
  const [verification, setVerification] = useState('');
  const [sort, setSort] = useState('stars');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredSkills = useMemo(() => {
    let result = allSkills.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (category && s.category !== category) return false;
      if (verification === 'Verified' && !s.verified) return false;
      if (verification === 'Unverified' && s.verified) return false;
      return true;
    });
    if (sort === 'stars') result.sort((a, b) => b.stars - a.stars);
    else if (sort === 'newest') result.sort((a, b) => (a.version > b.version ? -1 : 1));
    else if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [search, category, type, agent, verification, sort]);

  const activeFilters: { key: string; label: string; onRemove: () => void }[] = [];
  if (category) activeFilters.push({ key: 'category', label: `Category: ${category}`, onRemove: () => setCategory('') });
  if (type) activeFilters.push({ key: 'type', label: `Type: ${type}`, onRemove: () => setType('') });
  if (agent) activeFilters.push({ key: 'agent', label: `Agent: ${agent}`, onRemove: () => setAgent('') });
  if (verification) activeFilters.push({ key: 'verification', label: `Verification: ${verification}`, onRemove: () => setVerification('') });

  const clearAll = () => {
    setCategory('');
    setType('');
    setAgent('');
    setVerification('');
    setSearch('');
  };

  const handleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <ShellHeader />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore Agent Skills</h1>
        <div className="flex flex-wrap gap-4 items-end mb-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="">All Types</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={agent} onChange={(e) => setAgent(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="">All Agents</option>
            {agents.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={verification} onChange={(e) => setVerification(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="">All Verification</option>
            {verifications.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="stars">Most Stars</option>
            <option value="newest">Newest</option>
            <option value="name">Name</option>
          </select>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm flex items-center gap-1 hover:bg-gray-50"
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            {viewMode === 'grid' ? 'Table' : 'Grid'}
          </button>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            {activeFilters.map((f) => (
              <span key={f.key} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                {f.label}
                <button onClick={f.onRemove} className="hover:text-blue-900"><X className="h-3 w-3" /></button>
              </span>
            ))}
            <button onClick={clearAll} className="text-xs text-gray-500 hover:underline">Clear all</button>
          </div>
        )}

        <p className="text-sm text-gray-500 mb-4">Showing {filteredSkills.length} skills</p>

        {filteredSkills.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No skills match your filters.</p>
            <button onClick={clearAll} className="mt-2 text-blue-600 hover:underline">Reset filters</button>
          </div>
        ) : (
          <SkillGrid skills={filteredSkills} viewMode={viewMode} onFavoriteToggle={handleFavorite} />
        )}
      </main>
    </div>
  );
}
