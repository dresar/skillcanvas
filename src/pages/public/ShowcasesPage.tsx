import { useState } from 'react';
import { Link } from 'react-router-dom';
import ShellHeader from '../../components/ShellHeader';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

const showcases = [
  { id: '1', title: 'Design Assistant Demo', description: 'See how Design Assistant generates UI components.', skillId: '1' },
  { id: '2', title: 'Code Reviewer Workflow', description: 'Automated code review in action.', skillId: '2' },
  { id: '3', title: 'Test Generator Preview', description: 'Unit test generation from code.', skillId: '3' },
  { id: '4', title: 'Vuln Scanner Dashboard', description: 'Vulnerability scanning results.', skillId: '4' },
  { id: '5', title: 'Deploy Bot Pipeline', description: 'Automated deployment steps.', skillId: '5' },
  { id: '6', title: 'Research Summarizer', description: 'Paper summarization interface.', skillId: '6' },
  { id: '7', title: 'Icon Generator Showcase', description: 'SVG icon generation from text.', skillId: '7' },
  { id: '8', title: 'Refactor Agent Demo', description: 'Code refactoring suggestions.', skillId: '8' },
];

export default function ShowcasesPage() {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const viewportWidth = viewport === 'desktop' ? '100%' : viewport === 'tablet' ? '768px' : '375px';

  return (
    <div className="min-h-screen bg-white">
      <ShellHeader />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Visual Showcases</h1>
        <p className="text-gray-600 mb-6">Interactive UI and workflow previews for AI skills.</p>

        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-2 rounded border ${viewport === 'desktop' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} hover:bg-gray-50`}
            aria-label="Desktop view"
          >
            <Monitor className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-2 rounded border ${viewport === 'tablet' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} hover:bg-gray-50`}
            aria-label="Tablet view"
          >
            <Tablet className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-2 rounded border ${viewport === 'mobile' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} hover:bg-gray-50`}
            aria-label="Mobile view"
          >
            <Smartphone className="h-5 w-5" />
          </button>
        </div>

        <div style={{ maxWidth: viewportWidth }} className="mx-auto transition-all">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {showcases.map((sc) => (
              <Link
                key={sc.id}
                to={`/skills/${sc.skillId}`}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400 text-xs">
                  Preview
                </div>
                <h3 className="font-semibold text-gray-900 truncate">{sc.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{sc.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
