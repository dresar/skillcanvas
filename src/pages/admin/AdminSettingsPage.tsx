import { useState, useEffect, type ChangeEvent } from 'react';
import { getSettings, saveSettings, resetDemoData, addAuditLog } from '../../lib/storage';

interface Settings {
  workingName: string;
  defaultTheme: 'light' | 'dark';
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({ workingName: '', defaultTheme: 'light' });

  useEffect(() => {
    const stored = getSettings() as Settings | null;
    if (stored) {
      setSettings(stored);
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    saveSettings(settings);
    addAuditLog({ action: 'update-settings', targetId: 'settings', details: 'Updated settings' });
  };

  const handleReset = () => {
    resetDemoData();
    addAuditLog({ action: 'reset-demo', targetId: 'demo', details: 'Reset demo data' });
    setSettings({ workingName: '', defaultTheme: 'light' });
  };

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Working Name</label>
          <input
            type="text"
            name="workingName"
            value={settings.workingName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Default Theme</label>
          <select
            name="defaultTheme"
            value={settings.defaultTheme}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Settings
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reset Demo Data
          </button>
        </div>
      </div>
    </div>
  );
}
