import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export interface SidebarProps {
  role: 'member' | 'admin';
}

const memberLinks = [
  { label: 'Overview', to: '/dashboard' },
  { label: 'My Skills', to: '/dashboard/skills' },
  { label: 'Submit Skill', to: '/dashboard/skills/new' },
  { label: 'Requests', to: '/dashboard/requests' },
  { label: 'Favorites', to: '/dashboard/favorites' },
];

const adminLinks = [
  { label: 'Overview', to: '/admin' },
  { label: 'Manage Skills', to: '/admin/skills' },
  { label: 'Add Skill', to: '/admin/skills/new' },
  { label: 'Review Requests', to: '/admin/requests' },
  { label: 'Categories', to: '/admin/categories' },
  { label: 'Audit Log', to: '/admin/audit-log' },
  { label: 'Settings', to: '/admin/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const links = role === 'member' ? memberLinks : adminLinks;

  return (
    <aside className="w-[232px] md:w-[248px] h-full border-r border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
          {role === 'member' ? 'Member' : 'Admin'}
        </h2>
        <span className="inline-block mt-1 text-xs text-neutral-500 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-600 rounded px-1.5 py-0.5">
          {role === 'member' ? 'Member' : 'Admin'}
        </span>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard' || link.to === '/admin'}
            className={({ isActive }) =>
              `block px-3 py-2 text-sm rounded-md transition-colors ${
                isActive
                  ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white font-medium'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 space-y-2">
        <Link
          to="/"
          className="block text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        >
          Public Directory
        </Link>
        <Link
          to="/login"
          className="block text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        >
          Logout / Switch Role
        </Link>
      </div>
    </aside>
  );
};

export { Sidebar };
