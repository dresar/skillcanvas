import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is missing in environment');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function main() {
  console.log('Connecting to Neon PostgreSQL...');

  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      summary TEXT,
      skill_count INTEGER DEFAULT 0,
      is_visible BOOLEAN DEFAULT true
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      summary TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      category_ids JSONB DEFAULT '[]'::jsonb,
      tags JSONB DEFAULT '[]'::jsonb,
      install_command TEXT NOT NULL,
      license TEXT DEFAULT 'MIT',
      version TEXT DEFAULT '1.0.0',
      stars INTEGER DEFAULT 0,
      forks INTEGER DEFAULT 0,
      downloads INTEGER DEFAULT 0,
      preview_type TEXT DEFAULT 'svg',
      image_url TEXT,
      svg_preview TEXT,
      html_preview TEXT,
      status TEXT DEFAULT 'published',
      is_featured BOOLEAN DEFAULT false,
      owner_id TEXT DEFAULT 'user-demo',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS requests (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      source_url TEXT,
      category TEXT,
      notes TEXT,
      status TEXT DEFAULT 'submitted',
      submitter_id TEXT DEFAULT 'visitor',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      target_id TEXT,
      details TEXT,
      actor_id TEXT DEFAULT 'system',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT,
      display_name TEXT NOT NULL,
      role TEXT DEFAULT 'visitor',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  console.log('Tables verified and created successfully.');

  const existingSkills = await sql`SELECT count(*)::int as count FROM skills`;
  if (existingSkills[0].count === 0) {
    console.log('Seeding initial skills...');
    const seedSkills = [
      {
        id: 'antislop-ui',
        name: 'Antislop UI',
        slug: 'antislop-ui',
        summary: 'Compact, anti-slop interface components for modern web apps.',
        description: 'A curated set of UI primitives that enforce restraint and clarity. Includes buttons, inputs, modals, and layout helpers.',
        category: 'UI & Design Systems',
        category_ids: JSON.stringify(['cat-ui']),
        tags: JSON.stringify(['ui', 'components', 'design-system']),
        install_command: 'npm install antislop-ui',
        license: 'MIT',
        version: '1.2.0',
        stars: 1420,
        forks: 88,
        downloads: 3200,
        status: 'published',
        is_featured: true,
        preview_type: 'svg'
      },
      {
        id: 'claude-orchestrator',
        name: 'Claude Orchestrator',
        slug: 'claude-orchestrator',
        summary: 'Autonomous multi-agent orchestration for complex workflows.',
        description: 'Coordinates multiple Claude agents to solve tasks in parallel, with conflict resolution and progress tracking.',
        category: 'Agentic Coding',
        category_ids: JSON.stringify(['cat-coding']),
        tags: JSON.stringify(['agent', 'orchestration', 'multi-agent']),
        install_command: 'pip install claude-orchestrator',
        license: 'Apache-2.0',
        version: '0.9.0',
        stars: 1980,
        forks: 145,
        downloads: 5120,
        status: 'published',
        is_featured: true,
        preview_type: 'svg'
      },
      {
        id: 'aider-surgical-editor',
        name: 'Aider Surgical Editor',
        slug: 'aider-surgical-editor',
        summary: 'Precision code refactoring and AST manipulation tool.',
        description: 'Uses tree-sitter and language servers to perform surgical edits on source code without breaking existing logic.',
        category: 'Agentic Coding',
        category_ids: JSON.stringify(['cat-coding']),
        tags: JSON.stringify(['refactoring', 'ast', 'editor']),
        install_command: 'npm install -g aider-surgical-editor',
        license: 'MIT',
        version: '2.1.0',
        stars: 1240,
        forks: 92,
        downloads: 2890,
        status: 'published',
        is_featured: true,
        preview_type: 'svg'
      },
      {
        id: 'firebase-rules-auditor',
        name: 'Firebase Rules Auditor',
        slug: 'firebase-rules-auditor',
        summary: 'Security scanner for Firebase Realtime Database and Firestore rules.',
        description: 'Analyzes security rules for common misconfigurations, over-permissive access, and suggests hardened policies.',
        category: 'Security & Rules',
        category_ids: JSON.stringify(['cat-security']),
        tags: JSON.stringify(['firebase', 'security', 'audit']),
        install_command: 'npm install -g firebase-rules-auditor',
        license: 'MIT',
        version: '1.0.0',
        stars: 890,
        forks: 64,
        downloads: 1450,
        status: 'published',
        is_featured: true,
        preview_type: 'svg'
      },
      {
        id: 'biome-clean-code',
        name: 'Biome Clean Code',
        slug: 'biome-clean-code',
        summary: 'Automated code formatting and linting with Biome.',
        description: 'Integrates Biome to enforce consistent code style, remove dead imports, and apply safe auto-fixes.',
        category: 'Testing & QA',
        category_ids: JSON.stringify(['cat-testing']),
        tags: JSON.stringify(['linting', 'formatting', 'biome']),
        install_command: 'npm install -D biome-clean-code',
        license: 'MIT',
        version: '0.5.0',
        stars: 1650,
        forks: 110,
        downloads: 4100,
        status: 'published',
        is_featured: true,
        preview_type: 'svg'
      },
      {
        id: 'hermes-autonomous-agent',
        name: 'Hermes Autonomous Agent',
        slug: 'hermes-autonomous-agent',
        summary: 'Self-hosted agent for background jobs and scheduled tasks.',
        description: 'Runs as a daemon, executes cron-like workflows, and reports results via webhook or Slack.',
        category: 'Automation & Workflows',
        category_ids: JSON.stringify(['cat-automation']),
        tags: JSON.stringify(['automation', 'agent', 'scheduler']),
        install_command: 'docker pull hermes-autonomous-agent',
        license: 'AGPL-3.0',
        version: '3.2.1',
        stars: 1350,
        forks: 98,
        downloads: 3000,
        status: 'published',
        is_featured: true,
        preview_type: 'svg'
      },
      {
        id: 'dak-bigquery-ml',
        name: 'DAK BigQuery ML',
        slug: 'dak-bigquery-ml',
        summary: 'Machine learning pipelines directly inside BigQuery.',
        description: 'Enables training and inference of models using SQL, with automated feature engineering and evaluation.',
        category: 'Research & Data',
        category_ids: JSON.stringify(['cat-research']),
        tags: JSON.stringify(['bigquery', 'ml', 'data-science']),
        install_command: 'pip install dak-bigquery-ml',
        license: 'Apache-2.0',
        version: '0.8.0',
        stars: 940,
        forks: 72,
        downloads: 1800,
        status: 'published',
        is_featured: true,
        preview_type: 'svg'
      },
      {
        id: 'button-presisi-ui',
        name: 'Button Presisi UI',
        slug: 'button-presisi-ui',
        summary: 'Precision-engineered button component with accessibility built-in.',
        description: 'A single button component that supports multiple variants, sizes, loading states, and full ARIA compliance.',
        category: 'UI & Design Systems',
        category_ids: JSON.stringify(['cat-ui']),
        tags: JSON.stringify(['ui', 'button', 'accessibility']),
        install_command: 'npm install button-presisi-ui',
        license: 'MIT',
        version: '1.0.3',
        stars: 1100,
        forks: 85,
        downloads: 2500,
        status: 'published',
        is_featured: true,
        preview_type: 'svg'
      }
    ];

    for (const skill of seedSkills) {
      await sql`
        INSERT INTO skills (
          id, slug, name, summary, description, category, category_ids, tags,
          install_command, license, version, stars, forks, downloads, status, is_featured, preview_type
        ) VALUES (
          ${skill.id}, ${skill.slug}, ${skill.name}, ${skill.summary}, ${skill.description}, ${skill.category},
          ${skill.category_ids}::jsonb, ${skill.tags}::jsonb, ${skill.install_command}, ${skill.license},
          ${skill.version}, ${skill.stars}, ${skill.forks}, ${skill.downloads}, ${skill.status}, ${skill.is_featured}, ${skill.preview_type}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }
    console.log('Seeded', seedSkills.length, 'skills.');
  }

  const existingCategories = await sql`SELECT count(*)::int as count FROM categories`;
  if (existingCategories[0].count === 0) {
    console.log('Seeding initial categories...');
    const seedCategories = [
      { id: 'cat-ui', slug: 'ui-design', name: 'UI & Design Systems', summary: 'Restrained, compact, and anti-slop interface tools.', skill_count: 2 },
      { id: 'cat-coding', slug: 'agentic-coding', name: 'Agentic Coding', summary: 'Autonomous CLI workers, refactoring, and AST tools.', skill_count: 2 },
      { id: 'cat-testing', slug: 'testing-qa', name: 'Testing & QA', summary: 'Unit test generators, regression checks, and verification suites.', skill_count: 1 },
      { id: 'cat-security', slug: 'security-audit', name: 'Security & Rules', summary: 'Vulnerability scanners and database security auditors.', skill_count: 1 },
      { id: 'cat-automation', slug: 'automation-workflows', name: 'Automation & Workflows', summary: 'Background jobs, scheduled tasks, and autonomous pipelines.', skill_count: 1 },
      { id: 'cat-research', slug: 'research-data', name: 'Research & Data', summary: 'Knowledge graphs, MCP data engines, and deep analytics.', skill_count: 1 }
    ];

    for (const cat of seedCategories) {
      await sql`
        INSERT INTO categories (id, slug, name, summary, skill_count)
        VALUES (${cat.id}, ${cat.slug}, ${cat.name}, ${cat.summary}, ${cat.skill_count})
        ON CONFLICT (id) DO NOTHING;
      `;
    }
    console.log('Seeded', seedCategories.length, 'categories.');
  }

  console.log('Database migration & seeding completed successfully.');
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
