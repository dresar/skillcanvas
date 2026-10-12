import { FormEvent, useMemo, useState } from 'react';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ShellHeader from '../../components/ShellHeader';
import SkillCard from '../../components/skills/SkillCard';
import { getCategories, getFavorites, getSkills, toggleFavorite } from '../../lib/storage';

type RecordItem = Record<string, any>;

export default function HomePage() {
  const navigate = useNavigate();
  const skills = getSkills() as RecordItem[];
  const categories = getCategories() as RecordItem[];
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(() => new Set(getFavorites()));

  const featuredSkills = useMemo(
    () => skills.filter((skill) => skill.isFeatured || skill.status === 'published').slice(0, 8),
    [skills],
  );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (query) navigate(`/skills?search=${encodeURIComponent(query)}`);
  };

  const handleFavorite = (id: string) => {
    toggleFavorite(id);
    setFavorites(new Set(getFavorites()));
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <ShellHeader />
      <main>
        <section className="border-b border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:px-8 lg:py-28">
            <div>
              <p className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
                <Sparkles className="h-4 w-4" /> The skill index
              </p>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-7xl">Useful skills, clearly catalogued.</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-400">
                A considered directory of AI agent skills with source context, installation details, and the signals that help you choose what belongs in your stack.
              </p>
              <form onSubmit={handleSearch} className="mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row">
                <label className="flex min-h-12 flex-1 items-center gap-3 border border-neutral-300 bg-white px-4 dark:border-neutral-700 dark:bg-neutral-900">
                  <Search className="h-4 w-4 text-neutral-400" />
                  <span className="sr-only">Search skills</span>
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by name, use case, or tag"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                  />
                </label>
                <button type="submit" className="min-h-12 bg-neutral-950 px-7 text-sm font-semibold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200">
                  Search index
                </button>
              </form>
            </div>
            <div className="border-l border-neutral-300 pl-6 dark:border-neutral-700 lg:justify-self-end">
              <p className="max-w-xs text-sm leading-6 text-neutral-500 dark:text-neutral-400">No hype layer. Every entry is presented with enough detail to make a practical decision.</p>
              <div className="mt-10 grid max-w-xs grid-cols-2 gap-x-8 gap-y-6 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                <div><p className="text-3xl font-semibold tracking-tight">{skills.length}</p><p className="mt-1 text-xs uppercase tracking-wider text-neutral-500">Listed skills</p></div>
                <div><p className="text-3xl font-semibold tracking-tight">{categories.length}</p><p className="mt-1 text-xs uppercase tracking-wider text-neutral-500">Disciplines</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="flex items-end justify-between gap-4 border-b border-neutral-200 pb-4 dark:border-neutral-800">
            <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Browse the index</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Start with a discipline</h2></div>
            <Link to="/categories" className="hidden items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-950 dark:hover:text-white sm:flex">All categories <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {categories.slice(0, 8).map((category) => (
              <Link key={category.id} to={`/skills?category=${category.slug}`} className="border border-neutral-300 bg-white px-4 py-2 text-sm transition hover:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-white">
                {category.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
          <div className="flex items-end justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Editor&apos;s selection</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">A short list worth opening</h2></div><Link to="/skills" className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-950 dark:hover:text-white">View all <ArrowRight className="h-4 w-4" /></Link></div>
          {featuredSkills.length === 0 ? <p className="py-12 text-sm text-neutral-500">The index is waiting for its first published skill.</p> : <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} onFavoriteToggle={handleFavorite} />
            ))}
          </div>}
        </section>
      </main>
      <footer className="border-t border-neutral-200 dark:border-neutral-800"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-6 text-xs text-neutral-500 lg:px-8"><span>SkillCanvas / An open directory for useful work.</span><div className="flex gap-5"><Link to="/about" className="hover:text-neutral-950 dark:hover:text-white">About</Link><Link to="/showcases" className="hover:text-neutral-950 dark:hover:text-white">Showcases</Link><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-950 dark:hover:text-white">Source</a></div></div></footer>
    </div>
  );
}
