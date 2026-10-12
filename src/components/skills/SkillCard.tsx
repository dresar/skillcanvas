import React, { useState } from 'react';
import { Check, Copy, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export type SkillInput = Record<string, unknown>;

export interface SkillRecord {
  [key: string]: unknown;
  id: string;
  slug: string;
  name: string;
  summary: string;
  category: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  installCommand: string;
  imageUrl?: string;
  previewType?: string;
  isFavorited: boolean;
  stars: number;
  forks: number;
  downloads: number;
  version?: string;
  type?: string;
  tags: string[];
}

const categoryNames: Record<string, string> = {
  'cat-ui': 'UI & Design Systems',
  'cat-coding': 'Agentic Coding',
  'cat-testing': 'Testing & QA',
  'cat-security': 'Security & Rules',
  'cat-automation': 'Automation & Workflows',
  'cat-research': 'Research & Data',
};

const fallbackImages = [
  'https:' + '//images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  'https:' + '//images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
  'https:' + '//images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
  'https:' + '//images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
  'https:' + '//images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  'https:' + '//images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
  'https:' + '//images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
  'https:' + '//images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80',
  'https:' + '//images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
  'https:' + '//images.unsplash.com/photo-1534972195531-a756b1126975?auto=format&fit=crop&w=800&q=80',
];

const text = (value: unknown, fallback = '') => typeof value === 'string' ? value : fallback;
const number = (value: unknown) => typeof value === 'number' ? value : 0;
const record = (value: unknown): Record<string, unknown> => value && typeof value === 'object' ? value as Record<string, unknown> : {};

const fallbackImageFor = (id: string) => {
  const key = Array.from(id).reduce((total, character) => total + character.charCodeAt(0), 0);
  return fallbackImages[key % fallbackImages.length];
};

export function normalizeSkill(input: SkillInput): SkillRecord {
  const metrics = record(input.metrics);
  const images = Array.isArray(input.images) ? input.images : [];
  const firstImage = record(images[0]);
  const categoryIds = Array.isArray(input.categoryIds) ? input.categoryIds : [];
  const categoryValue = text(input.category) || categoryNames[text(categoryIds[0])] || text(categoryIds[0], 'Uncategorized');
  const verificationState = text(input.verificationState);
  const verified = input.verified === true || verificationState === 'source_inspected' || verificationState === 'preview_checked';
  const pending = verificationState === 'metadata_checked' || input.verificationStatus === 'pending';
  const id = text(input.id, text(input.slug, 'skill'));
  const name = text(input.name, text(input.title, 'Untitled skill'));
  const providedImageUrl = text(input.imageUrl, text(firstImage.url));
  const imageUrl = providedImageUrl && providedImageUrl !== '/demo/previews/preview.png'
    ? providedImageUrl
    : fallbackImageFor(id);

  return {
    id,
    slug: text(input.slug, id),
    name,
    summary: text(input.summary, text(input.description, 'A focused tool for practical agent workflows.')),
    category: categoryValue,
    verificationStatus: verified ? 'verified' : pending ? 'pending' : text(input.verificationStatus) === 'verified' ? 'verified' : 'unverified',
    installCommand: text(input.installCommand, `skillcanvas install ${text(input.slug, id)}`),
    imageUrl,
    previewType: text(input.previewType, text(input.type)),
    isFavorited: input.isFavorited === true,
    stars: number(input.stars) || number(metrics.stars),
    forks: number(input.forks) || number(metrics.forks),
    downloads: number(input.downloads) || number(metrics.downloads),
    version: text(input.version) || undefined,
    type: text(input.type) || undefined,
    tags: Array.isArray(input.tags) ? input.tags.filter((tag): tag is string => typeof tag === 'string') : [],
  };
}

function PreviewFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="relative aspect-[1.65] overflow-hidden border-b border-neutral-200 bg-neutral-100 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100" aria-label={`${label} preview`}>
      <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,#d4d4d4_1px,transparent_1px),linear-gradient(to_bottom,#d4d4d4_1px,transparent_1px)] [background-size:24px_24px] dark:opacity-20" />
      <svg viewBox="0 0 520 315" className="relative h-full w-full" fill="none" role="img" aria-label={`${label} interface preview`}>
        {children}
      </svg>
      <span className="absolute bottom-3 left-3 border border-neutral-300 bg-neutral-100/90 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] dark:border-neutral-700 dark:bg-neutral-950/90">{label}</span>
    </div>
  );
}

function SkillPreview({ skill }: { skill: SkillRecord }) {
  const id = skill.id.toLowerCase();
  const common = { stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  if (id === 'antislop-ui' || id === 'design-assistant' || id === '1') {
    return <PreviewFrame label="ui / primitives"><rect x="48" y="50" width="424" height="216" rx="10" fill="white" stroke="currentColor" strokeWidth="2" /><path d="M48 88h424M82 69h90" {...common} /><rect x="82" y="122" width="148" height="42" rx="6" fill="currentColor" /><rect x="248" y="122" width="148" height="42" rx="6" stroke="currentColor" strokeWidth="2" /><rect x="82" y="188" width="314" height="12" rx="6" fill="currentColor" opacity=".2" /><rect x="82" y="212" width="220" height="12" rx="6" fill="currentColor" opacity=".2" /></PreviewFrame>;
  }

  if (id === 'claude-orchestrator' || id === 'code-reviewer' || id === '2') {
    return <PreviewFrame label="agent / graph"><circle cx="260" cy="158" r="34" fill="currentColor" /><circle cx="112" cy="92" r="22" fill="white" stroke="currentColor" strokeWidth="2" /><circle cx="408" cy="92" r="22" fill="white" stroke="currentColor" strokeWidth="2" /><circle cx="112" cy="224" r="22" fill="white" stroke="currentColor" strokeWidth="2" /><circle cx="408" cy="224" r="22" fill="white" stroke="currentColor" strokeWidth="2" /><path d="M132 103l96 42M388 103l-96 42M132 213l96-42M388 213l-96-42" {...common} /><path d="M250 148h20M250 168h20" stroke="white" strokeWidth="3" strokeLinecap="round" /></PreviewFrame>;
  }

  if (id === 'aider-surgical-editor' || id === 'refactor-agent' || id === '8') {
    return <PreviewFrame label="code / patch"><rect x="54" y="48" width="412" height="220" rx="8" fill="white" stroke="currentColor" strokeWidth="2" /><path d="M54 82h412" {...common} /><circle cx="76" cy="65" r="4" fill="currentColor" /><circle cx="92" cy="65" r="4" fill="currentColor" opacity=".35" /><path d="M84 116h114M84 140h174M84 164h132M84 212h86" {...common} opacity=".45" /><path d="M302 112l16 16 28-34M302 178l16 16 28-34" {...common} /><path d="M370 106h52M370 172h52" {...common} opacity=".45" /></PreviewFrame>;
  }

  if (id === 'firebase-rules-auditor' || id === 'vuln-scanner' || id === '4') {
    return <PreviewFrame label="security / audit"><path d="M260 52l102 40v70c0 55-42 87-102 105-60-18-102-50-102-105V92l102-40z" fill="white" stroke="currentColor" strokeWidth="2" /><path d="M218 158l27 27 57-67" {...common} strokeWidth="6" /><path d="M206 226h108" {...common} opacity=".4" /></PreviewFrame>;
  }

  if (id === 'biome-clean-code' || id === 'test-generator' || id === '3') {
    return <PreviewFrame label="qa / checks"><path d="M76 86h368M76 122h266M76 158h306M76 194h232" {...common} opacity=".3" /><circle cx="394" cy="86" r="18" fill="currentColor" /><path d="M385 86l7 7 12-15" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="352" cy="122" r="18" fill="currentColor" /><path d="M343 122l7 7 12-15" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><rect x="76" y="228" width="368" height="12" rx="6" fill="currentColor" opacity=".15" /></PreviewFrame>;
  }

  if (id === 'hermes-autonomous-agent' || id === 'deploy-bot' || id === '5') {
    return <PreviewFrame label="workflow / queue"><rect x="74" y="98" width="108" height="86" rx="8" fill="white" stroke="currentColor" strokeWidth="2" /><rect x="206" y="98" width="108" height="86" rx="8" fill="currentColor" /><rect x="338" y="98" width="108" height="86" rx="8" fill="white" stroke="currentColor" strokeWidth="2" /><path d="M182 141h24M314 141h24M198 134l8 7-8 7M330 134l8 7-8 7" {...common} /><path d="M96 124h64M96 148h42M228 124h64M228 148h42M360 124h64M360 148h42" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity=".4" /></PreviewFrame>;
  }

  if (id === 'dak-bigquery-ml' || id === 'research-summarizer' || id === '6') {
    return <PreviewFrame label="data / model"><path d="M76 228l72-62 66 28 82-94 74 52 74-62" {...common} strokeWidth="4" /><path d="M76 228h368M76 228V72" {...common} opacity=".4" /><circle cx="148" cy="166" r="7" fill="currentColor" /><circle cx="214" cy="194" r="7" fill="currentColor" /><circle cx="296" cy="100" r="7" fill="currentColor" /><circle cx="370" cy="152" r="7" fill="currentColor" /><circle cx="444" cy="90" r="7" fill="currentColor" /></PreviewFrame>;
  }

  if (id === 'button-presisi-ui' || id === 'icon-generator' || id === '7') {
    return <PreviewFrame label="component / detail"><rect x="74" y="82" width="372" height="152" rx="8" fill="white" stroke="currentColor" strokeWidth="2" /><circle cx="142" cy="158" r="32" fill="currentColor" /><path d="M128 158h28M142 144v28" stroke="white" strokeWidth="4" strokeLinecap="round" /><rect x="202" y="126" width="164" height="18" rx="9" fill="currentColor" opacity=".2" /><rect x="202" y="158" width="116" height="18" rx="9" fill="currentColor" opacity=".2" /><path d="M394 120v76" {...common} opacity=".35" /></PreviewFrame>;
  }

  return <PreviewFrame label="skill / preview"><rect x="72" y="72" width="376" height="170" rx="10" fill="white" stroke="currentColor" strokeWidth="2" /><path d="M104 112h180M104 140h250M104 168h204" {...common} opacity=".35" /><circle cx="382" cy="174" r="26" fill="currentColor" /><path d="M370 174h24M382 162v24" stroke="white" strokeWidth="3" strokeLinecap="round" /></PreviewFrame>;
}

export interface SkillCardProps {
  skill: SkillInput;
  onFavoriteToggle?: (id: string) => void;
}

export function SkillCard({ skill: source, onFavoriteToggle }: SkillCardProps) {
  const skill = normalizeSkill(source);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(skill.installCommand);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-600">
      <Link to={`/skills/${skill.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100">
        {skill.imageUrl ? (
          <div className="relative aspect-[1.65] overflow-hidden border-b border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
            <img src={skill.imageUrl} alt="" className="h-full w-full object-cover" />
          </div>
        ) : (
          <SkillPreview skill={skill} />
        )}
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="min-w-0 truncate text-[15px] font-semibold tracking-[-0.01em] text-neutral-950 dark:text-neutral-50">{skill.name}</h3>
            {skill.version && <span className="shrink-0 font-mono text-[10px] text-neutral-500">v{skill.version}</span>}
          </div>
          <p className="line-clamp-2 min-h-10 text-xs leading-5 text-neutral-600 dark:text-neutral-400">{skill.summary}</p>
          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-neutral-500">
            <span className="border border-neutral-200 px-2 py-1 dark:border-neutral-800">{skill.category}</span>
            <span className="border border-neutral-200 px-2 py-1 dark:border-neutral-800">{skill.verificationStatus}</span>
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <button type="button" onClick={handleCopy} className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500 transition-colors hover:text-neutral-950 dark:hover:text-white" aria-label={`Copy install command for ${skill.name}`}>
          {copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied' : 'Install'}
        </button>
        <button type="button" onClick={() => onFavoriteToggle?.(skill.id)} className={`rounded-full p-1.5 transition-colors ${skill.isFavorited ? 'text-neutral-950 dark:text-white' : 'text-neutral-400 hover:text-neutral-950 dark:hover:text-white'}`} aria-label={`${skill.isFavorited ? 'Remove' : 'Add'} ${skill.name} favorite`}>
          <Heart size={16} fill={skill.isFavorited ? 'currentColor' : 'none'} />
        </button>
      </div>
    </article>
  );
}

export default SkillCard;
