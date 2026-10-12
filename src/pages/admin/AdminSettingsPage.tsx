import { useEffect, useState, type ChangeEvent } from 'react';
import ShellHeader from '../../components/ShellHeader';
import { addAuditLog, getSettings, resetDemoData, saveSettings } from '../../lib/storage';

interface Settings {
  workingName: string;
  defaultTheme: 'light' | 'dark';
}

const initialSettings: Settings = {
  workingName: '',
  defaultTheme: 'light',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(initialSettings);

  useEffect(() => {
    const stored = getSettings() as Settings | null;

    if (stored) {
      setSettings(stored);
    }
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setSettings(previous => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = () => {
    saveSettings(settings);
    addAuditLog({
      action: 'update-settings',
      targetId: 'settings',
      details: 'Updated settings',
    });
  };

  const handleReset = () => {
    resetDemoData();
    addAuditLog({
      action: 'reset-demo',
      targetId: 'demo',
      details: 'Reset demo data',
    });
    setSettings(initialSettings);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <ShellHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Administration
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Settings
          </h1>
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
            Configure workspace preferences and manage demo data.
          </p>
        </header>

        <section className="max-w-2xl rounded-[8px] border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
          <form
            onSubmit={event => {
              event.preventDefault();
              handleSave();
            }}
            className="space-y-6"
          >
            <div>
              <label htmlFor="workingName" className="mb-2 block text-sm font-medium">
                Working Name
              </label>
              <input
                id="workingName"
                type="text"
                name="workingName"
                value={settings.workingName}
                onChange={handleChange}
                className="w-full rounded-[6px] border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:focus:border-neutral-100"
              />
            </div>

            <div>
              <label htmlFor="defaultTheme" className="mb-2 block text-sm font-medium">
                Default Theme
              </label>
              <select
                id="defaultTheme"
                name="defaultTheme"
                value={settings.defaultTheme}
                onChange={handleChange}
                className="w-full rounded-[6px] border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:focus:border-neutral-100"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800 sm:flex-row">
              <button
                type="submit"
                className="rounded-[6px] bg-neutral-950 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 active:scale-[0.98] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                Save Settings
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-[6px] border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 active:scale-[0.98] dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Reset Demo Data
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
