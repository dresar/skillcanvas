import { useState, useEffect } from 'react';
import { getRequests, saveRequest, addAuditLog } from '../../lib/storage';

interface Request {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const allRequests = getRequests() as Request[];
    setRequests(allRequests);
  }, []);

  const updateStatus = (id: string, newStatus: string) => {
    const updated = requests.map(r => {
      if (r.id === id) {
        addAuditLog({ action: 'request-status', targetId: id, details: `Changed status to ${newStatus}` });
        return { ...r, status: newStatus };
      }
      return r;
    });
    setRequests(updated);
    saveRequest(updated);
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800',
      review: 'bg-blue-100 text-blue-800',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Skill Requests</h1>
      {requests.length === 0 ? (
        <p className="text-gray-500">No requests.</p>
      ) : (
        <table className="w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Description</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id} className="border-b">
                <td className="p-3">{req.name}</td>
                <td className="p-3 text-sm text-gray-600">{req.description}</td>
                <td className="p-3">{statusBadge(req.status)}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => updateStatus(req.id, 'approved')}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(req.id, 'declined')}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => updateStatus(req.id, 'review')}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Under Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
