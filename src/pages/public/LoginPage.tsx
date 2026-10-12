import { ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShellHeader from '../../components/ShellHeader';
import { setCurrentRole } from '../../lib/storage';

type Role = 'visitor' | 'member' | 'admin';
const roles: { id: Role; label: string; description: string }[] = [
  { id: 'visitor', label: 'Visitor', description: 'Read the public index, skills, and showcases.' },
  { id: 'member', label: 'Member', description: 'Contribute skills and manage your workspace.' },
  { id: 'admin', label: 'Admin', description: 'Review submissions and manage the catalogue.' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role>('visitor');
  const navigate = useNavigate();
  const enter = () => { setCurrentRole(selectedRole); navigate(selectedRole === 'visitor' ? '/skills' : selectedRole === 'member' ? '/dashboard' : '/admin'); };
  return <div className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50"><ShellHeader /><main className="mx-auto grid max-w-5xl gap-12 px-5 py-16 lg:grid-cols-[.75fr_1.25fr] lg:px-8 lg:py-24"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">Enter SkillCanvas</p><h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">Choose your workspace.</h1><p className="mt-6 max-w-sm text-sm leading-7 text-neutral-500">This demo uses role-based entry so you can explore the public directory or the contribution tools without a password.</p></div><div><div className="border-y border-neutral-200 dark:border-neutral-800">{roles.map((role) => <label key={role.id} className={`flex cursor-pointer items-center justify-between gap-6 border-b border-neutral-200 p-5 last:border-b-0 dark:border-neutral-800 ${selectedRole === role.id ? 'bg-white dark:bg-neutral-900' : ''}`}><input type="radio" name="role" value={role.id} checked={selectedRole === role.id} onChange={() => setSelectedRole(role.id)} className="sr-only" /><div><span className="font-semibold">{role.label}</span><p className="mt-1 text-sm text-neutral-500">{role.description}</p></div><span className={`flex h-5 w-5 items-center justify-center border ${selectedRole === role.id ? 'border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950' : 'border-neutral-300 dark:border-neutral-700'}`}>{selectedRole === role.id && <Check className="h-3.5 w-3.5" />}</span></label>)}</div><button onClick={enter} className="mt-6 flex min-h-12 w-full items-center justify-between bg-neutral-950 px-5 text-sm font-semibold text-white dark:bg-white dark:text-neutral-950">Enter workspace <ArrowRight className="h-4 w-4" /></button><p className="mt-5 text-xs text-neutral-500">No account or credentials are required for this demo.</p></div></main></div>;
}
