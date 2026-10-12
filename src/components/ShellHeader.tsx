import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function ShellHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
          SkillCanvas
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/skills" className="hover:text-gray-900">Skills</Link>
          <Link to="/showcases" className="hover:text-gray-900">Showcases</Link>
          <Link to="/categories" className="hover:text-gray-900">Categories</Link>
          <Link to="/about" className="hover:text-gray-900">About</Link>
          <Link to="/login" className="hover:text-gray-900">Login</Link>
        </nav>
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium text-gray-600">
            <Link to="/skills" onClick={() => setMenuOpen(false)}>Skills</Link>
            <Link to="/showcases" onClick={() => setMenuOpen(false)}>Showcases</Link>
            <Link to="/categories" onClick={() => setMenuOpen(false)}>Categories</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
