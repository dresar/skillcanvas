import { useEffect, useState } from 'react';
import ShellHeader from '../../components/ShellHeader';
import { getAuditLog } from '../../lib/storage';

interface AuditEvent {
  timestamp: string;
  action: string;
  targetId: string;
  details: string;
}

export default function AdminAuditLogPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);

  useEffect(() => {
    const allEvents = getAuditLog() as AuditEvent[];
    setEvents([...allEvents].reverse());
  }, []);

  const formatTimestamp = (value: string) => {
    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
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
            Audit Log
          </h1>
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
            Review administrative activity and changes across SkillCanvas.
          </p>
        </header>

        {events.length === 0 ? (
          <div className="rounded-[8px] border border-neutral-200 bg-white p-6 text-sm text-neutral-500 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
            No audit events.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[8px] border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <table className="w-full min-w-[760px] text-left">
              <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60">
                <tr>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    Action
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    Target ID
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => (
                  <tr
                    key={`${event.timestamp}-${event.targetId}-${index}`}
                    className="border-b border-neutral-200 transition-colors last:border-0 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/40"
                  >
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                      {formatTimestamp(event.timestamp)}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-[4px] border border-neutral-300 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-700 dark:border-neutral-700 dark:text-neutral-300">
                        {event.action}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                      {event.targetId}
                    </td>
                    <td className="px-4 py-4 text-sm text-neutral-700 dark:text-neutral-300">
                      {event.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
