import { useState, useEffect } from 'react';
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
    setEvents(allEvents.reverse());
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Audit Log</h1>
      {events.length === 0 ? (
        <p className="text-gray-500">No audit events.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Timestamp</th>
                <th className="text-left p-3">Action</th>
                <th className="text-left p-3">Target ID</th>
                <th className="text-left p-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-3 whitespace-nowrap">{new Date(event.timestamp).toLocaleString()}</td>
                  <td className="p-3">{event.action}</td>
                  <td className="p-3 font-mono text-xs">{event.targetId}</td>
                  <td className="p-3">{event.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
