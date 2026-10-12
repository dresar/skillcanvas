import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import type { Category, Skill, SkillRequest, ActivityEvent } from '../data/types';

const databaseUrl = import.meta.env.VITE_NEON_DATABASE_URL as string | undefined;
const sql: NeonQueryFunction<false, false> | null = databaseUrl ? neon(databaseUrl) : null;

async function query<T>(strings: TemplateStringsArray, ...values: unknown[]): Promise<T[]> {
  if (!sql) return [];
  return sql(strings, ...values) as Promise<T[]>;
}

export async function listSkills(): Promise<Skill[]> {
  return query<Skill>`SELECT * FROM skills ORDER BY published_at DESC NULLS LAST, created_at DESC`;
}

export async function listCategories(): Promise<Category[]> {
  return query<Category>`SELECT * FROM categories ORDER BY name ASC`;
}

export async function listRequests(): Promise<SkillRequest[]> {
  return query<SkillRequest>`SELECT * FROM skill_requests ORDER BY created_at DESC`;
}

export async function listAuditLogs(): Promise<ActivityEvent[]> {
  return query<ActivityEvent>`SELECT * FROM audit_log ORDER BY created_at DESC`;
}

export async function getSkillBySlug(slug: string): Promise<Skill | null> {
  const rows = await query<Skill>`SELECT * FROM skills WHERE slug = ${slug} LIMIT 1`;
  return rows[0] ?? null;
}

export async function saveSkillRecord(skill: Partial<Skill> & Pick<Skill, 'id'>): Promise<void> {
  if (!sql) return;
  await sql`
    INSERT INTO skills (id, slug, name, summary, description, status, visibility, preview_type, updated_at)
    VALUES (${skill.id}, ${skill.slug ?? skill.id}, ${skill.name ?? ''}, ${skill.summary ?? ''}, ${skill.description ?? ''}, ${skill.status ?? 'draft'}, ${skill.visibility ?? 'private'}, ${skill.previewType ?? 'none'}, NOW())
    ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, summary = EXCLUDED.summary, description = EXCLUDED.description, status = EXCLUDED.status, visibility = EXCLUDED.visibility, preview_type = EXCLUDED.preview_type, updated_at = NOW()
  `;
}

export function isNeonConfigured(): boolean {
  return Boolean(databaseUrl);
}

export { sql };
