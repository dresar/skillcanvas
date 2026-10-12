import { useEffect, useState } from 'react';
import ShellHeader from '../../components/ShellHeader';
import { addAuditLog, getRequests, saveRequest } from '../../lib/storage';

interface Request {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
}

const statuses = ['pending', 'approved', 'rejected', 'review'];

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    setRequests(getRequests() as Request[]);
  }, []);

  const updateStatus = (id: string, status: string) => {
    const updated = requests.map(request => {
      if (request.id !== id) {
        return request;
      }

      addAuditLog({
        action: 'request-status',
        targetId: id,
        details: `Changed status to ${status}`,
      });

      return { ...request, status };
    });

    setRequests(updated);
    saveRequest(updated);
  };

  const statusBadge = (status: string) => {
    const normalizedStatus = status === 'declined' ? 'rejected' : status;
    const style =
      normalizedStatus === 'approved'
        ? 'border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300'
        : normalizedStatus === 'rejected'
          ? 'border-neutral-400 text-neutral-800 dark:border-neutral-600 dark:text-neutral-200'
          : normalizedStatus === 'review'
            ? 'border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400'
            : 'border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-500';

    return (
      <span className={`inline-flex rounded-[4px] border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${style}`}>
        {normalizedStatus}
      </span>
    );
  };

  const formatDate = (value: string) => {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
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
            Skill Requests
          </h1>
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
            Review user-submitted skill requests and update their current status.
          </p>
        </header>

        {requests.length === 0 ? (
          <div className="rounded-[8px] border border-neutral-200 bg-white p-6 text-sm text-neutral-500 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
            No requests.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[8px] border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60">
                <tr>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    Name
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    Description
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    Created
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    Status
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    Update Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map(request => (
                  <tr
                    key={request.id}
                    className="border-b border-neutral-200 transition-colors last:border-0 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/40"
                  >
                    <td className="px-4 py-4 text-sm font-medium">{request.name}</td>
                    <td className="max-w-md px-4 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {request.description}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-4 py-4">{statusBadge(request.status)}</td>
                    <td className="px-4 py-4">
                      <select
                        aria-label={`Update status for ${request.name}`}
                        value={request.status === 'declined' ? 'rejected' : request.status}
                        onChange={event => updateStatus(request.id, event.target.value)}
                        className="rounded-[6px] border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 outline-none transition-colors focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:focus:border-neutral-100"
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
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
