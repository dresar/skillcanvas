import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShellHeader from '../../components/ShellHeader';

const roles = [
  { id: 'visitor', label: 'Visitor', description: 'Read-only access to skills and showcases.' },
  { id: 'member', label: 'Member', description: 'Can contribute and manage own skills.' },
  { id: 'admin', label: 'Admin', description: 'Full directory management privileges.' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('visitor');
  const navigate = useNavigate();

  const handleEnter = () => {
    localStorage.setItem('skillcanvas_role', selectedRole);
    if (selectedRole === 'visitor') navigate('/skills');
    else if (selectedRole === 'member') navigate('/dashboard');
    else navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-white">
      <ShellHeader />
      <main className="max-w-md mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Login</h1>
        <div className="space-y-4">
          {roles.map((role) => (
            <label
              key={role.id}
              className={`block border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedRole === role.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="role"
                value={role.id}
                checked={selectedRole === role.id}
                onChange={() => setSelectedRole(role.id)}
                className="sr-only"
              />
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-900">{role.label}</span>
                  <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedRole === role.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}
                />
              </div>
            </label>
          ))}
        </div>
        <button
          onClick={handleEnter}
          className="mt-8 w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          Enter Workspace
        </button>
      </main>
    </div>
  );
}
