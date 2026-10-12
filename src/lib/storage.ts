import { initialSkills } from '../data/mock/skills';
import { categories as initialCategories } from '../data/mock/categories';

const STORAGE_KEYS = {
  skills: 'skillcanvas_skills',
  categories: 'skillcanvas_categories',
  requests: 'skillcanvas_requests',
  auditLog: 'skillcanvas_auditLog',
  settings: 'skillcanvas_settings',
  theme: 'skillcanvas_theme',
  favorites: 'skillcanvas_favorites',
  currentRole: 'skillcanvas_currentRole',
} as const;

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getSkills(): any[] {
  return getItem<any[]>(STORAGE_KEYS.skills, initialSkills);
}

export function saveSkill(skill: any): void {
  const skills = getSkills();
  const idx = skills.findIndex((s) => s.id === skill.id);
  if (idx >= 0) {
    skills[idx] = { ...skills[idx], ...skill };
  } else {
    skills.push(skill);
  }
  setItem(STORAGE_KEYS.skills, skills);
}

export function getSkillBySlug(slug: string): any {
  const skills = getSkills();
  return skills.find((s) => s.slug === slug) || null;
}

export function getSkillById(id: string): any {
  const skills = getSkills();
  return skills.find((s) => s.id === id) || null;
}

export function deleteSkill(id: string): void {
  const skills = getSkills().filter((s) => s.id !== id);
  setItem(STORAGE_KEYS.skills, skills);
}

export function getCategories(): any[] {
  return getItem<any[]>(STORAGE_KEYS.categories, initialCategories);
}

export function saveCategory(cat: any): void {
  const categories = getCategories();
  const idx = categories.findIndex((c) => c.id === cat.id);
  if (idx >= 0) {
    categories[idx] = { ...categories[idx], ...cat };
  } else {
    categories.push(cat);
  }
  setItem(STORAGE_KEYS.categories, categories);
}

export function getRequests(): any[] {
  return getItem<any[]>(STORAGE_KEYS.requests, []);
}

export function saveRequest(req: any): void {
  const requests = getRequests();
  const idx = requests.findIndex((r) => r.id === req.id);
  if (idx >= 0) {
    requests[idx] = { ...requests[idx], ...req };
  } else {
    requests.push(req);
  }
  setItem(STORAGE_KEYS.requests, requests);
}

export function addRequest(req: any): void {
  const requests = getRequests();
  requests.push(req);
  setItem(STORAGE_KEYS.requests, requests);
}

export function updateRequestStatus(id: string, status: string, note?: string): void {
  const requests = getRequests();
  const req = requests.find((r) => r.id === id);
  if (req) {
    req.status = status;
    if (note !== undefined) {
      req.note = note;
    }
    setItem(STORAGE_KEYS.requests, requests);
  }
}

export function getAuditLog(): any[] {
  return getItem<any[]>(STORAGE_KEYS.auditLog, []);
}

export function getAuditLogs(): any[] {
  return getAuditLog();
}

export function addAuditLog(entry: { action: string; targetId: string; details: string } | any): void {
  const logs = getAuditLog();
  logs.push({
    ...entry,
    timestamp: new Date().toISOString(),
  });
  setItem(STORAGE_KEYS.auditLog, logs);
}

export function getSettings(): { workingName: string; defaultTheme: string; itemsPerPage: number } {
  const defaults = { workingName: 'SkillCanvas', defaultTheme: 'light', itemsPerPage: 20 };
  return getItem(STORAGE_KEYS.settings, defaults);
}

export function saveSettings(settings: any): void {
  setItem(STORAGE_KEYS.settings, settings);
}

export function resetDemoData(): void {
  setItem(STORAGE_KEYS.skills, initialSkills);
  setItem(STORAGE_KEYS.categories, initialCategories);
  setItem(STORAGE_KEYS.requests, []);
  setItem(STORAGE_KEYS.auditLog, []);
  setItem(STORAGE_KEYS.settings, { workingName: 'SkillCanvas', defaultTheme: 'light', itemsPerPage: 20 });
  setItem(STORAGE_KEYS.theme, 'light');
  setItem(STORAGE_KEYS.favorites, []);
  setItem(STORAGE_KEYS.currentRole, 'visitor');
}

export function getTheme(): 'light' | 'dark' {
  return getItem<'light' | 'dark'>(STORAGE_KEYS.theme, 'light');
}

export function setTheme(theme: 'light' | 'dark'): void {
  setItem(STORAGE_KEYS.theme, theme);
}

export function getFavorites(): string[] {
  return getItem<string[]>(STORAGE_KEYS.favorites, []);
}

export function toggleFavorite(id: string): boolean {
  const favorites = getFavorites();
  const idx = favorites.indexOf(id);
  if (idx >= 0) {
    favorites.splice(idx, 1);
    setItem(STORAGE_KEYS.favorites, favorites);
    return false;
  } else {
    favorites.push(id);
    setItem(STORAGE_KEYS.favorites, favorites);
    return true;
  }
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

export function getCurrentRole(): 'visitor' | 'member' | 'admin' {
  return getItem<'visitor' | 'member' | 'admin'>(STORAGE_KEYS.currentRole, 'visitor');
}

export function setCurrentRole(role: 'visitor' | 'member' | 'admin'): void {
  setItem(STORAGE_KEYS.currentRole, role);
}
