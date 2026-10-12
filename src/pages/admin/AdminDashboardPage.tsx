import { useState, useEffect } from 'react';
import { getSkills, getRequests, getCategories, getAuditLog } from '../../lib/storage';

export default function AdminDashboardPage() {
  const [totalSkills, setTotalSkills] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [recentAudit, setRecentAudit] = useState<any[]>([]);

  useEffect(() => {
    const skills = getSkills() as any[];
    const requests = getRequests() as any[];
    const categories = getCategories() as any[];
    const auditLog = getAuditLog() as any[];
    setTotalSkills(skills.length);
    setPendingRequests(requests.filter((r: any) => r.status === 'pending').length);
    setTotalCategories(categories.length);
    setRecentAudit(auditLog.slice(-5).reverse());
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Skills</p>
          <p className="text-2xl font-semibold">{totalSkills}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Pending Requests</p>
          <p className="text-2xl font-semibold">{pendingRequests}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Categories</p>
          <p className="text-2xl font-semibold">{totalCategories}</p>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Audit Events</h2>
        {recentAudit.length === 0 ? (
          <p className="text-gray-500">No audit events.</p>
        ) : (
          <ul className="space-y-2">
            {recentAudit.map((event: any, idx: number) => (
              <li key={idx} className="bg-white rounded-lg shadow p-3 text-sm">
                <span className="font-medium">{event.action}</span> on {event.targetId} – {event.details}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
