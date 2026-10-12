import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const navLinks = [{ label: 'Skills', to: '/skills' }, { label: 'Showcases', to: '/showcases' }, { label: 'Categories', to: '/categories' }, { label: 'About', to: '/about' }];

export function Header() {
  const location = useLocation();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [role, setRole] = useState<'visitor' | 'member' | 'admin'>(() => {
    const value = localStorage.getItem('currentRole');
    return value === 'member' || value === 'admin' ? value : 'visitor';
  });

  useEffect(() => { document.documentElement.classList.toggle('dark', dark); localStorage.setItem('theme', dark ? 'dark' : 'light'); }, [dark]);
  useEffect(() => { localStorage.setItem('currentRole', role); }, [role]);
  const action = role === 'visitor' ? { label: 'Sign in', to: '/login' } : role === 'member' ? { label: 'Workspace', to: '/dashboard' } : { label: 'Admin', to: '/admin' };

  return <header className="flex min-h-16 flex-wrap items-center gap-4 border-b border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950 md:px-6"><Link to="/" className="flex items-center gap-2 text-sm font-semibold text-neutral-950 dark:text-neutral-50"><span className="flex h-7 w-7 items-center justify-center border border-neutral-950 font-mono text-xs dark:border-neutral-50">S</span>SkillCanvas</Link><span className="border border-neutral-300 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-500 dark:border-neutral-700">v0.1</span><nav className="hidden items-center gap-5 md:flex">{navLinks.map((link) => <Link key={link.to} to={link.to} className={`font-mono text-[10px] uppercase tracking-[0.13em] transition-colors ${location.pathname.startsWith(link.to) ? 'text-neutral-950 dark:text-white' : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'}`}>{link.label}</Link>)}</nav><div className="ml-auto flex items-center gap-2"><button type="button" onClick={() => setDark((value) => !value)} className="p-2 text-neutral-500 hover:text-neutral-950 dark:hover:text-white" aria-label="Toggle theme">{dark ? <Sun size={16} /> : <Moon size={16} />}</button><select value={role} onChange={(event) => setRole(event.target.value as typeof role)} className="border border-neutral-300 bg-white px-2 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-neutral-700 outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"><option value="visitor">Visitor</option><option value="member">Member</option><option value="admin">Admin</option></select><Link to={action.to} className="hidden border border-neutral-950 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-950 hover:bg-neutral-950 hover:text-white dark:border-neutral-50 dark:text-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-950 sm:block">{action.label}</Link></div></header>;
}

export default Header;
