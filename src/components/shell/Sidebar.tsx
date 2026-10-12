import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export interface SidebarProps { role: 'member' | 'admin'; }

const memberLinks = [{ label: 'Overview', to: '/dashboard' }, { label: 'My Skills', to: '/dashboard/skills' }, { label: 'Submit Skill', to: '/dashboard/skills/new' }, { label: 'Requests', to: '/dashboard/requests' }, { label: 'Favorites', to: '/dashboard/favorites' }];
const adminLinks = [{ label: 'Overview', to: '/admin' }, { label: 'Manage Skills', to: '/admin/skills' }, { label: 'Add Skill', to: '/admin/skills/new' }, { label: 'Review Requests', to: '/admin/requests' }, { label: 'Categories', to: '/admin/categories' }, { label: 'Audit Log', to: '/admin/audit-log' }, { label: 'Settings', to: '/admin/settings' }];

export function Sidebar({ role }: SidebarProps) {
  const links = role === 'member' ? memberLinks : adminLinks;
  return <aside className="flex h-full w-full flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 md:w-60"><div className="border-b border-neutral-200 p-5 dark:border-neutral-800"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">Workspace</p><h2 className="mt-2 text-sm font-semibold text-neutral-950 dark:text-neutral-50">{role === 'member' ? 'Member' : 'Admin'} console</h2></div><nav className="flex-1 space-y-1 p-3">{links.map((link) => <NavLink key={link.to} to={link.to} end={link.to === '/dashboard' || link.to === '/admin'} className={({ isActive }) => `block border-l-2 px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.13em] transition-colors ${isActive ? 'border-neutral-950 bg-neutral-100 text-neutral-950 dark:border-neutral-50 dark:bg-neutral-900 dark:text-neutral-50' : 'border-transparent text-neutral-500 hover:bg-neutral-50 hover:text-neutral-950 dark:hover:bg-neutral-900 dark:hover:text-neutral-50'}`}>{link.label}</NavLink>)}</nav><div className="space-y-3 border-t border-neutral-200 p-5 dark:border-neutral-800"><Link to="/" className="block font-mono text-[10px] uppercase tracking-[0.13em] text-neutral-500 hover:text-neutral-950 dark:hover:text-white">Public directory</Link><Link to="/login" className="block font-mono text-[10px] uppercase tracking-[0.13em] text-neutral-500 hover:text-neutral-950 dark:hover:text-white">Switch role</Link></div></aside>;
}

export default Sidebar;
