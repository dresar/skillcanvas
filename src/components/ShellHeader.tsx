import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Directory', to: '/skills' },
  { label: 'Showcases', to: '/showcases' },
  { label: 'Categories', to: '/categories' },
  { label: 'About', to: '/about' },
];

export default function ShellHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-sm font-semibold tracking-[-0.02em] text-neutral-950 dark:text-neutral-50"><span className="flex h-7 w-7 items-center justify-center border border-neutral-950 font-mono text-xs dark:border-neutral-50">S</span>SkillCanvas</Link>
        <nav className="hidden items-center gap-7 md:flex">{links.map((link) => <Link key={link.to} to={link.to} className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:text-neutral-950 dark:hover:text-white">{link.label}</Link>)}<Link to="/login" className="border border-neutral-950 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white dark:border-neutral-50 dark:text-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-950">Sign in</Link></nav>
        <button type="button" className="p-2 text-neutral-950 md:hidden dark:text-neutral-50" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
      {open && <nav className="border-t border-neutral-200 px-4 py-4 dark:border-neutral-800 md:hidden">{links.map((link) => <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="block border-b border-neutral-100 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-600 dark:border-neutral-900 dark:text-neutral-400">{link.label}</Link>)}<Link to="/login" onClick={() => setOpen(false)} className="mt-3 inline-block border border-neutral-950 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] dark:border-neutral-50">Sign in</Link></nav>}
    </header>
  );
}
