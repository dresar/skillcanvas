import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getTheme } from './lib/storage';
import HomePage from './pages/public/HomePage';
import SkillsPage from './pages/public/SkillsPage';
import SkillDetailPage from './pages/public/SkillDetailPage';
import ShowcasesPage from './pages/public/ShowcasesPage';
import CategoriesPage from './pages/public/CategoriesPage';
import AboutPage from './pages/public/AboutPage';
import DashboardPage from './pages/member/DashboardPage';
import MemberSkillsPage from './pages/member/MemberSkillsPage';
import MemberSkillFormPage from './pages/member/MemberSkillFormPage';
import MemberRequestsPage from './pages/member/MemberRequestsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminSkillsPage from './pages/admin/AdminSkillsPage';
import AdminRequestsPage from './pages/admin/AdminRequestsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminAuditLogPage from './pages/admin/AdminAuditLogPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

function App() {
  useEffect(() => {
    const theme = getTheme();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/skills/:slug" element={<SkillDetailPage />} />
        <Route path="/showcases" element={<ShowcasesPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<div>Login Page (placeholder)</div>} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/skills" element={<MemberSkillsPage />} />
        <Route path="/dashboard/skills/new" element={<MemberSkillFormPage />} />
        <Route path="/dashboard/skills/:id/edit" element={<MemberSkillFormPage />} />
        <Route path="/dashboard/requests" element={<MemberRequestsPage />} />
        <Route path="/dashboard/favorites" element={<MemberSkillsPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/skills" element={<AdminSkillsPage />} />
        <Route path="/admin/skills/new" element={<MemberSkillFormPage />} />
        <Route path="/admin/skills/:id/edit" element={<MemberSkillFormPage />} />
        <Route path="/admin/requests" element={<AdminRequestsPage />} />
        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        <Route path="/admin/audit-log" element={<AdminAuditLogPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
