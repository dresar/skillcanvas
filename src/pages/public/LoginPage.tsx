import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const navigate = useNavigate();

  const enter = () => {
    setCurrentRole(selectedRole);
    navigate(selectedRole === 'visitor' ? '/skills' : selectedRole === 'member' ? '/dashboard' : '/admin');
  };

  const continueWithGoogle = async () => {
    setGoogleLoading(true);
    setAuthNotice(null);

    try {
      const neonBase = import.meta.env.VITE_NEON_AUTH_URL || ('https:' + '//ep-dry-shape-azrhjbfc.neonauth.c-3.ap-southeast-1.aws.neon.tech/neondb/auth');
      const response = await fetch(`${neonBase}/sign-in/social`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'google',
          callbackURL: window.location.origin + '/dashboard',
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.url) {
        window.location.href = data.url;
        return;
      }

      if (data?.code === 'INVALID_CALLBACKURL') {
        setAuthNotice(`Domain ${window.location.hostname} belum terdaftar di whitelist Trusted Domains Neon Auth. Silakan gunakan tombol masuk instan di bawah ini.`);
      } else {
        setAuthNotice(data?.message || 'Layanan OAuth Neon Auth memerlukan whitelist domain. Gunakan tombol masuk instan di bawah ini.');
      }
    } catch {
      setAuthNotice('Koneksi ke endpoint Neon Auth gagal. Silakan gunakan tombol masuk instan di bawah ini.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const quickSignInWithGoogle = () => {
    localStorage.setItem('googleUser', JSON.stringify({
      id: 'google-user-1',
      name: 'Eka Syarif Maulana',
      email: 'eka.ckp16799@gmail.com',
      picture: 'https:' + '//images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      provider: 'google',
    }));
    setCurrentRole('admin');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <ShellHeader />
      <main className="mx-auto max-w-5xl px-5 py-12 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
          <div>
            <div className="mb-6">
              <BackButton />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">Enter SkillCanvas</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">Choose your workspace.</h1>
            <p className="mt-6 max-w-sm text-sm leading-7 text-neutral-500">
              Sign in with Google or choose a role to explore the public directory and contribution tools.
            </p>
          </div>

          <div className="border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
            <div className="space-y-3">
              <button
                onClick={continueWithGoogle}
                disabled={googleLoading}
                className="flex min-h-12 w-full items-center justify-center gap-3 border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:hover:bg-neutral-800"
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Menghubungkan...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M23.49 12.27c0-.78-.07-1.53-.2-2.27H12v4.3h6.45a5.51 5.51 0 0 1-2.39 3.62v3h3.87c2.27-2.09 3.56-5.17 3.56-8.65Z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3A7.18 7.18 0 0 1 12 19.2a7.36 7.36 0 0 1-6.92-5.1H1.08v3.1A12 12 0 0 0 12 24Z" />
                      <path fill="#FBBC05" d="M5.08 14.1a7.2 7.2 0 0 1 0-4.2V6.8H1.08a12 12 0 0 0 0 10.4l4-3.1Z" />
                      <path fill="#EA4335" d="M12 4.77a6.54 6.54 0 0 1 4.61 1.8l3.45-3.45A11.98 11.98 0 0 0 1.08 6.8l4 3.1A7.36 7.36 0 0 1 12 4.77Z" />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              <button
                onClick={quickSignInWithGoogle}
                disabled={googleLoading}
                className="flex min-h-11 w-full items-center justify-center border border-neutral-200 px-5 text-xs font-semibold text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
              >
                Quick Sign In with Google (Demo Account)
              </button>
            </div>

            {authNotice && (
              <div className="mt-5 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200">
                <p className="leading-6">{authNotice}</p>
                <button
                  onClick={quickSignInWithGoogle}
                  className="mt-4 inline-flex min-h-10 items-center justify-center bg-neutral-950 px-4 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                >
                  Masuk Langsung dengan Akun Google
                </button>
              </div>
            )}

            <div className="my-8 flex items-center gap-3 text-center text-[10px] font-semibold tracking-[0.14em] text-neutral-400">
              <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
              <span className="whitespace-nowrap">OR CONTINUE WITH WORKSPACE ROLE</span>
              <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
            </div>

            <div className="border-y border-neutral-200 dark:border-neutral-800">
              {roles.map((role) => (
                <label
                  key={role.id}
                  className={`flex cursor-pointer items-center justify-between gap-6 border-b border-neutral-200 p-5 last:border-b-0 dark:border-neutral-800 ${selectedRole === role.id ? 'bg-neutral-50 dark:bg-neutral-800/60' : ''}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.id}
                    checked={selectedRole === role.id}
                    onChange={() => setSelectedRole(role.id)}
                    className="sr-only"
                  />
                  <div>
                    <span className="font-semibold">{role.label}</span>
                    <p className="mt-1 text-sm text-neutral-500">{role.description}</p>
                  </div>
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center border ${selectedRole === role.id ? 'border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950' : 'border-neutral-300 dark:border-neutral-700'}`}>
                    {selectedRole === role.id && <Check className="h-3.5 w-3.5" />}
                  </span>
                </label>
              ))}
            </div>

            <button
              onClick={enter}
              className="mt-6 flex min-h-12 w-full items-center justify-between bg-neutral-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              Enter workspace
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-5 text-center text-xs text-neutral-500">No account or credentials are required for this demo.</p>

            <div className="mt-6 flex items-center justify-center gap-2 border-t border-neutral-200 pt-5 text-[11px] font-medium text-neutral-500 dark:border-neutral-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Powered by Neon Auth (Google OAuth &amp; JWKS)
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
