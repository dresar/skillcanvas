import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ShellHeader from '../../components/ShellHeader';
import { getCategories, getSkills } from '../../lib/storage';

type RecordItem = Record<string, any>;

export default function CategoriesPage() {
  const categories = getCategories() as RecordItem[];
  const skills = getSkills() as RecordItem[];
  const count = (category: RecordItem) => skills.filter((skill) => skill.categoryIds?.includes(category.id) || skill.category === category.name).length || category.skillCount || 0;
  return <div className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50"><ShellHeader /><main className="mx-auto max-w-7xl px-5 py-12 lg:px-8"><div className="border-b border-neutral-200 pb-8 dark:border-neutral-800"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">Organise your search</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Categories</h1><p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">Browse the index by the kind of work you need to get done.</p></div><div className="mt-8 grid gap-px border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3 dark:border-neutral-800 dark:bg-neutral-800">{categories.filter((category) => category.isVisible !== false).map((category, index) => <Link key={category.id} to={`/skills?category=${category.slug}`} className="group flex min-h-56 flex-col justify-between bg-neutral-50 p-6 dark:bg-neutral-950"><div><div className="flex items-center justify-between text-xs text-neutral-500"><span>0{index + 1}</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></div><h2 className="mt-12 text-xl font-semibold tracking-tight group-hover:underline">{category.name}</h2><p className="mt-2 text-sm leading-6 text-neutral-500">{category.summary}</p></div><p className="mt-8 border-t border-neutral-200 pt-4 text-xs uppercase tracking-wider text-neutral-500 dark:border-neutral-800">{count(category)} skills</p></Link>)}</div></main></div>;
}
