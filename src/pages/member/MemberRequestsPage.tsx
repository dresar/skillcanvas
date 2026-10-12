import { useState, useEffect } from 'react';
import { getRequests, saveRequest, addAuditLog } from '../../lib/storage';

interface Request {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function MemberRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => {
    const allRequests = getRequests() as Request[];
    setRequests(allRequests);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allRequests = getRequests() as Request[];
    const newRequest: Request = {
      id: crypto.randomUUID(),
      name: form.name,
      description: form.description,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    allRequests.push(newRequest);
    saveRequest(allRequests);
    addAuditLog({ action: 'request', targetId: newRequest.id, details: `Submitted request for ${form.name}` });
    setForm({ name: '', description: '' });
    setRequests(allRequests);
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800',
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
      <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-lg shadow p-4 space-y-4">
        <h2 className="text-lg font-semibold">Submit New Request</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Skill Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} required />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Submit Request</button>
      </form>
      <div>
        <h2 className="text-lg font-semibold mb-3">Your Requests</h2>
        {requests.length === 0 ? (
          <p className="text-gray-500">No requests yet.</p>
        ) : (
          <table className="w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id} className="border-b">
                  <td className="p-3">{req.name}</td>
                  <td className="p-3">{statusBadge(req.status)}</td>
                  <td className="p-3">{new Date(req.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
