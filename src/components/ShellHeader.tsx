import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { getCurrentRole } from '../lib/storage';

const links = [
  { label: 'Directory', to: '/skills' },
  { label: 'Categories', to: '/categories' },
  { label: 'Showcases', to: '/showcases' },
  { label: 'About', to: '/about' },
];

const memberLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Upload Skill', to: '/dashboard/skills/new' },
  { label: 'Saved Skills', to: '/dashboard/favorites' },
];

const adminLinks = [
  { label: 'Admin Studio', to: '/admin/skills' },
  { label: 'Categories', to: '/admin/categories' },
  { label: 'Requests', to: '/admin/requests' },
  { label: 'Audit Log', to: '/admin/audit-log' },
  { label: 'Settings', to: '/admin/settings' },
];

type GoogleUser = {
  name?: string;
  email?: string;
  picture?: string;
  avatar?: string;
  image?: string;
};

function readGoogleUser(): GoogleUser | null {
  const storedUser = localStorage.getItem('googleUser');

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as GoogleUser;
  } catch {
    return null;
  }
}

export default function ShellHeader() {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [role, setRole] = useState(() => getCurrentRole());
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => readGoogleUser());

  const isSignedIn = role !== 'visitor' || Boolean(googleUser);
  const isAdmin = role === 'admin';
  const profileName = googleUser?.name || googleUser?.email || (isAdmin ? 'Administrator' : 'Member');
  const profileInitial = profileName.charAt(0).toUpperCase() || 'U';
  const profilePicture = googleUser?.picture || googleUser?.avatar || googleUser?.image;
  const accountLinks = isAdmin ? [...memberLinks, ...adminLinks] : memberLinks;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const closeMenus = () => {
    setOpen(false);
    setProfileOpen(false);
  };

  const signOut = () => {
    localStorage.setItem('skillcanvas_currentRole', 'visitor');
    localStorage.removeItem('googleUser');
    setRole('visitor');
    setGoogleUser(null);
    closeMenus();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/85 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={closeMenus}
          className="flex items-center gap-3 text-sm font-semibold tracking-[-0.02em] text-neutral-950 dark:text-neutral-50"
        >
          <span className="flex h-7 w-7 items-center justify-center border border-neutral-950 font-mono text-xs dark:border-neutral-50">
            S
          </span>
          SkillCanvas
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:text-neutral-950 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}

          {!isSignedIn ? (
            <Link
              to="/login"
              className="border border-neutral-950 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white dark:border-neutral-50 dark:text-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-950"
            >
              Sign in
            </Link>
          ) : (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                className="flex items-center gap-2 text-left"
                aria-expanded={profileOpen}
                aria-label="Open profile menu"
              >
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt={profileName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950 font-medium text-white dark:bg-neutral-50 dark:text-neutral-950">
                    {profileInitial}
                  </span>
                )}
                <span className="hidden lg:block">
                  <span className="block max-w-28 truncate text-xs font-medium text-neutral-950 dark:text-neutral-50">
                    {profileName}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">
                    {isAdmin ? 'ADMIN' : 'MEMBER'}
                  </span>
                </span>
                <ChevronDown
                  size={14}
                  className={`text-neutral-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-64 border border-neutral-200 bg-white p-2 shadow-xl dark:border-neutral-800 dark:bg-neutral-950">
                  <div className="border-b border-neutral-100 px-3 pb-3 pt-2 dark:border-neutral-800">
                    <p className="truncate text-sm font-medium text-neutral-950 dark:text-neutral-50">
                      {profileName}
                    </p>
                    {googleUser?.email && (
                      <p className="mt-1 truncate text-xs text-neutral-500">{googleUser.email}</p>
                    )}
                    <span className="mt-2 inline-flex rounded-full bg-neutral-100 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
                      {isAdmin ? 'ADMIN' : 'MEMBER'}
                    </span>
                  </div>

                  <div className="py-2">
                    {accountLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={closeMenus}
                        className="block px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-neutral-100 pt-2 dark:border-neutral-800">
                    <button
                      type="button"
                      onClick={signOut}
                      className="block w-full px-3 py-2 text-left text-sm text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>

        <button
          type="button"
          className="p-2 text-neutral-950 md:hidden dark:text-neutral-50"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-neutral-200 px-4 py-4 dark:border-neutral-800 md:hidden">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMenus}
              className="block border-b border-neutral-100 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-600 dark:border-neutral-900 dark:text-neutral-400"
            >
              {link.label}
            </Link>
          ))}

          {!isSignedIn ? (
            <Link
              to="/login"
              onClick={closeMenus}
              className="mt-4 inline-block border border-neutral-950 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-950 dark:border-neutral-50 dark:text-neutral-50"
            >
              Sign in
            </Link>
          ) : (
            <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
              <div className="mb-4 flex items-center gap-3">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt={profileName}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950 font-medium text-white dark:bg-neutral-50 dark:text-neutral-950">
                    {profileInitial}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-950 dark:text-neutral-50">
                    {profileName}
                  </p>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">
                    {isAdmin ? 'ADMIN' : 'MEMBER'}
                  </span>
                </div>
              </div>

              {accountLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMenus}
                  className="block border-b border-neutral-100 py-3 text-sm text-neutral-700 dark:border-neutral-900 dark:text-neutral-300"
                >
                  {link.label}
                </Link>
              ))}

              <button
                type="button"
                onClick={signOut}
                className="mt-3 block w-full py-3 text-left text-sm text-neutral-600 dark:text-neutral-400"
              >
                Sign out
              </button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
