import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

const Header: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      return 'dark';
    }
    return 'light';
  });

  const [role, setRole] = useState<'visitor' | 'member' | 'admin'>(() => {
    const stored = localStorage.getItem('currentRole');
    if (stored === 'member' || stored === 'admin') return stored;
    return 'visitor';
  });

  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('currentRole', role);
  }, [role]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as 'visitor' | 'member' | 'admin');
  };

  const actionLink = () => {
    if (role === 'visitor') return { label: 'Sign In', to: '/login' };
    if (role === 'member') return { label: 'My Workspace', to: '/dashboard' };
    return { label: 'Admin Portal', to: '/admin' };
  };

  const navLinks = [
    { label: 'Skills', to: '/skills' },
    { label: 'Showcases', to: '/showcases' },
    { label: 'Categories', to: '/categories' },
    { label: 'About', to: '/about' },
  ];

  return (
    <header className="h-14 md:h-16 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex items-center px-4 md:px-6">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-lg font-bold text-neutral-900 dark:text-white">
          SkillCanvas
        </Link>
        <span className="text-xs text-neutral-500 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-600 rounded px-1.5 py-0.5">
          v0.1
        </span>
        <nav className="hidden md:flex space-x-4 ml-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium ${
                location.pathname.startsWith(link.to)
                  ? 'text-neutral-900 dark:text-white'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center space-x-4 ml-auto">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <select
          value={role}
          onChange={handleRoleChange}
          className="text-sm border border-neutral-300 dark:border-neutral-600 rounded-md px-2 py-1 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
        >
          <option value="visitor">Visitor</option>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <Link
          to={actionLink().to}
          className="text-sm font-medium text-neutral-900 dark:text-white bg-neutral-200 dark:bg-neutral-700 px-3 py-1.5 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600"
        >
          {actionLink().label}
        </Link>
      </div>
    </header>
  );
};

export { Header };
