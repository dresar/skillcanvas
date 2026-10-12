import { useMemo, useState } from 'react';
import { Grid3X3, List, Search, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ShellHeader from '../../components/ShellHeader';
import SkillGrid from '../../components/skills/SkillGrid';
import { getCategories, getFavorites, getSkills, toggleFavorite } from '../../lib/storage';

type RecordItem = Record<string, any>;

export default function SkillsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const skills = getSkills() as RecordItem[];
  const categories = getCategories() as RecordItem[];
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [type, setType] = useState('');
  const [agent, setAgent] = useState('');
  const [verification, setVerification] = useState('');
  const [sort, setSort] = useState('stars');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [favorites, setFavorites] = useState(() => new Set(getFavorites()));

  const types = useMemo(() => [...new Set(skills.map((skill) => skill.type).filter(Boolean))], [skills]);
  const agents = useMemo(() => [...new Set(skills.flatMap((skill) => skill.supportedAgents || []))], [skills]);
  const filteredSkills = useMemo(() => {
    const result = skills.filter((skill) => {
      const haystack = [skill.name, skill.summary, skill.description, ...(skill.tags || [])].join(' ').toLowerCase();
      const categoryMatch = !category || skill.categoryIds?.includes(category) || skill.category === category || categories.find((item) => item.slug === category && skill.categoryIds?.includes(item.id));
      const isVerified = Boolean(skill.verified) || skill.verificationState === 'source_inspected' || skill.verificationState === 'preview_checked';

      return (!search || haystack.includes(search.toLowerCase())) && categoryMatch && (!type || skill.type === type) && (!agent || skill.supportedAgents?.includes(agent)) && (!verification || (verification === 'Verified' ? isVerified : !isVerified));
    });

    return result.sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'newest' ? String(b.updatedAt || b.createdAt).localeCompare(String(a.updatedAt || a.createdAt)) : (b.metrics?.stars ?? b.stars ?? 0) - (a.metrics?.stars ?? a.stars ?? 0));
  }, [agent, categories, category, search, skills, sort, type, verification]);

  const setFilter = (name: string, value: string) => {
    if (name === 'category') setCategory(value);
    if (name === 'type') setType(value);
    if (name === 'agent') setAgent(value);
    if (name === 'verification') setVerification(value);

    const next = new URLSearchParams(searchParams);
    if (value) next.set(name, value);
    else next.delete(name);
    setSearchParams(next, { replace: true });
  };

  const clearAll = () => {
    setSearch('');
    setCategory('');
    setType('');
    setAgent('');
    setVerification('');
    setSearchParams({}, { replace: true });
  };

  const favorite = (id: string) => {
    toggleFavorite(id);
    setFavorites(new Set(getFavorites()));
  };

  const activeFilters = [
    { key: 'category', value: category, label: category },
    { key: 'type', value: type, label: type },
    { key: 'agent', value: agent, label: agent },
    { key: 'verification', value: verification, label: verification },
  ].filter((filter) => filter.value);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <ShellHeader />
      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="flex flex-col justify-between gap-6 border-b border-neutral-200 pb-8 md:flex-row md:items-end dark:border-neutral-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">The directory</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Explore skills</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">Search a focused index of tools, components, agents, and workflows.</p>
          </div>
          <p className="text-sm text-neutral-500">{filteredSkills.length} of {skills.length} entries</p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-[1fr_repeat(3,auto)]">
          <label className="flex min-h-11 items-center gap-3 border border-neutral-300 bg-white px-3 dark:border-neutral-700 dark:bg-neutral-900">
            <Search className="h-4 w-4 text-neutral-400" />
            <span className="sr-only">Search skills</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search names, descriptions, tags" className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400" />
          </label>
          <select value={category} onChange={(event) => setFilter('category', event.target.value)} className="min-h-11 border border-neutral-300 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-900">
            <option value="">All categories</option>
            {categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
          </select>
          <select value={type} onChange={(event) => setFilter('type', event.target.value)} className="min-h-11 border border-neutral-300 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-900">
            <option value="">All types</option>
            {types.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="min-h-11 border border-neutral-300 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-900">
            <option value="stars">Most starred</option>
            <option value="newest">Recently updated</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select value={agent} onChange={(event) => setFilter('agent', event.target.value)} className="min-h-9 border border-neutral-300 bg-white px-3 text-xs dark:border-neutral-700 dark:bg-neutral-900">
            <option value="">Any supported agent</option>
            {agents.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={verification} onChange={(event) => setFilter('verification', event.target.value)} className="min-h-9 border border-neutral-300 bg-white px-3 text-xs dark:border-neutral-700 dark:bg-neutral-900">
            <option value="">Any verification</option>
            <option value="Verified">Verified</option>
            <option value="Unverified">Unverified</option>
          </select>
          {activeFilters.map((filter) => (
            <button key={filter.key} onClick={() => setFilter(filter.key, '')} className="inline-flex items-center gap-1 border border-neutral-300 px-2 py-1 text-xs text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
              {filter.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          {activeFilters.length > 0 && <button onClick={clearAll} className="text-xs text-neutral-500 underline">Clear all</button>}
          <button onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')} className="ml-auto inline-flex items-center gap-2 border border-neutral-300 px-3 py-2 text-xs dark:border-neutral-700">
            {viewMode === 'grid' ? <List className="h-3.5 w-3.5" /> : <Grid3X3 className="h-3.5 w-3.5" />}
            {viewMode === 'grid' ? 'Table' : 'Grid'}
          </button>
        </div>

        {filteredSkills.length === 0 ? (
          <div className="border-y border-neutral-200 py-20 text-center dark:border-neutral-800">
            <p className="text-sm text-neutral-500">No entries match this combination of filters.</p>
            <button onClick={clearAll} className="mt-3 text-sm underline">Reset index</button>
          </div>
        ) : (
          <div className="mt-8">
            <SkillGrid skills={filteredSkills} viewMode={viewMode} onFavoriteToggle={favorite} />
          </div>
        )}
      </main>
    </div>
  );
}
