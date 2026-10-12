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

type Role = 'visitor' | 'member' | 'admin';
type Theme = 'light' | 'dark';
export type AppSettings = { workingName: string; defaultTheme: Theme; itemsPerPage: number };

const memory = new Map<string, unknown>();

function read<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined') return (memory.get(key) as T | undefined) ?? fallback;
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value) as T;
  } catch {
    return (memory.get(key) as T | undefined) ?? fallback;
  }
}

function write<T>(key: string, value: T): void {
  memory.set(key, value);
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('skillcanvas:storage', { detail: key }));
  } catch {
    return;
  }
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function getSkills(): any[] {
  const skills = read<any[]>(STORAGE_KEYS.skills, clone(initialSkills));
  return Array.isArray(skills) ? skills : clone(initialSkills);
}

export function saveSkill(skill: any): void {
  if (Array.isArray(skill)) {
    write(STORAGE_KEYS.skills, clone(skill));
    return;
  }
  const skills = getSkills();
  const index = skills.findIndex((item) => item?.id === skill?.id);
  if (index === -1) skills.push(clone(skill));
  else skills[index] = { ...skills[index], ...clone(skill) };
  write(STORAGE_KEYS.skills, skills);
}

export function upsertSkill(skill: any): void {
  saveSkill(skill);
}

export function deleteSkill(id: string): void {
  write(STORAGE_KEYS.skills, getSkills().filter((skill) => skill?.id !== id));
}

export function getSkillBySlug(slug: string): any {
  return getSkills().find((skill) => skill?.slug === slug) ?? null;
}

export function getSkillById(id: string): any {
  return getSkills().find((skill) => skill?.id === id) ?? null;
}

export function getCategories(): any[] {
  const items = read<any[]>(STORAGE_KEYS.categories, clone(initialCategories));
  return Array.isArray(items) ? items : clone(initialCategories);
}

export function saveCategory(category: any): void {
  if (Array.isArray(category)) {
    write(STORAGE_KEYS.categories, clone(category));
    return;
  }
  const categories = getCategories();
  const index = categories.findIndex((item) => item?.id === category?.id);
  if (index === -1) categories.push(clone(category));
  else categories[index] = { ...categories[index], ...clone(category) };
  write(STORAGE_KEYS.categories, categories);
}

export function getRequests(): any[] {
  const requests = read<any[]>(STORAGE_KEYS.requests, []);
  return Array.isArray(requests) ? requests : [];
}

export function saveRequest(request: any): void {
  if (Array.isArray(request)) {
    write(STORAGE_KEYS.requests, clone(request));
    return;
  }
  const requests = getRequests();
  const index = requests.findIndex((item) => item?.id === request?.id);
  if (index === -1) requests.push(clone(request));
  else requests[index] = { ...requests[index], ...clone(request) };
  write(STORAGE_KEYS.requests, requests);
}

export function addRequest(request: any): void {
  saveRequest(request);
}

export function updateRequestStatus(id: string, status: string, note?: string): void {
  const request = getRequests().find((item) => item?.id === id);
  if (request) saveRequest({ ...request, status, ...(note === undefined ? {} : { note, reviewNote: note }) });
}

export function getAuditLog(): any[] {
  const logs = read<any[]>(STORAGE_KEYS.auditLog, []);
  return Array.isArray(logs) ? logs : [];
}

export function getAuditLogs(): any[] {
  return getAuditLog();
}

export function addAuditLog(entry: Record<string, unknown>): void {
  write(STORAGE_KEYS.auditLog, [...getAuditLog(), { ...entry, timestamp: new Date().toISOString() }]);
}

export function getSettings(): AppSettings {
  const defaults: AppSettings = { workingName: 'SkillCanvas', defaultTheme: 'light', itemsPerPage: 20 };
  const settings = read<Partial<AppSettings>>(STORAGE_KEYS.settings, defaults);
  return { ...defaults, ...settings, defaultTheme: settings.defaultTheme === 'dark' ? 'dark' : 'light' };
}

export function saveSettings(settings: Partial<AppSettings>): void {
  write(STORAGE_KEYS.settings, { ...getSettings(), ...settings });
}

export function resetDemoData(): void {
  write(STORAGE_KEYS.skills, clone(initialSkills));
  write(STORAGE_KEYS.categories, clone(initialCategories));
  write(STORAGE_KEYS.requests, []);
  write(STORAGE_KEYS.auditLog, []);
  write(STORAGE_KEYS.settings, { workingName: 'SkillCanvas', defaultTheme: 'light', itemsPerPage: 20 });
  write(STORAGE_KEYS.theme, 'light');
  write(STORAGE_KEYS.favorites, []);
  write(STORAGE_KEYS.currentRole, 'visitor');
}

export function getTheme(): Theme {
  return read<Theme>(STORAGE_KEYS.theme, 'light') === 'dark' ? 'dark' : 'light';
}

export function setTheme(theme: Theme): void {
  write(STORAGE_KEYS.theme, theme);
}

export function getFavorites(): string[] {
  const favorites = read<string[]>(STORAGE_KEYS.favorites, []);
  return Array.isArray(favorites) ? favorites : [];
}

export function toggleFavorite(id: string): boolean {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);
  if (index === -1) favorites.push(id);
  else favorites.splice(index, 1);
  write(STORAGE_KEYS.favorites, favorites);
  return index === -1;
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

export function getCurrentRole(): Role {
  const role = read<Role>(STORAGE_KEYS.currentRole, 'visitor');
  return role === 'member' || role === 'admin' ? role : 'visitor';
}

export function setCurrentRole(role: Role): void {
  write(STORAGE_KEYS.currentRole, role);
}
