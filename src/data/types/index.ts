export type SkillStatus = 'draft' | 'submitted' | 'in_review' | 'published' | 'unlisted' | 'changes_requested' | 'rejected'
export type VerificationState = 'not_reviewed' | 'metadata_checked' | 'source_inspected' | 'preview_checked'
export type SkillType = 'ui_ux' | 'coding' | 'testing' | 'writing' | 'research' | 'security' | 'automation' | 'data' | 'other'
export type DataOrigin = 'demo' | 'manual' | 'github'
export type PreviewType = 'full_ui' | 'component' | 'code' | 'document' | 'diagram' | 'terminal_output' | 'workflow' | 'none'
export type DemoRole = 'visitor' | 'member' | 'admin'

export interface SkillImage {
  id: string
  url: string
  alt: string
  caption?: string
  width?: number
  height?: number
  sortOrder: number
  origin: 'local_demo' | 'external_url' | 'future_storage'
}

export interface SkillMetrics {
  stars?: number
  forks?: number
  openIssues?: number
  contributors?: number
  downloads?: number
  lastCheckedAt?: string
  source: DataOrigin
  isSample: boolean
}

export interface Skill {
  id: string
  slug: string
  name: string
  summary: string
  description: string
  type: SkillType
  categoryIds: string[]
  tags: string[]
  frameworkTags: string[]
  supportedAgents: string[]
  sourceUrl?: string
  repositoryFullName?: string
  sourcePath?: string
  installCommand?: string
  installFormat?: string
  license?: string
  licenseUrl?: string
  version?: string
  releaseUrl?: string
  commitSha?: string
  lastUpdatedAt?: string
  publishedAt?: string
  status: SkillStatus
  visibility: 'public' | 'unlisted' | 'private'
  verificationState: VerificationState
  previewType: PreviewType
  previewLabel?: string
  images: SkillImage[]
  metrics: SkillMetrics
  ownerId: string
  isFeatured: boolean
  relatedSkillIds: string[]
  limitations: string[]
  seoTitle?: string
  seoDescription?: string
  canonicalUrl?: string
  noIndex: boolean
  origin: DataOrigin
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  slug: string
  name: string
  summary: string
  parentId?: string
  skillCount: number
  isVisible: boolean
}

export interface SkillRequest {
  id: string
  skillName: string
  sourceUrl?: string
  categoryId: string
  useCase: string
  skillType: SkillType
  notes?: string
  submitterId: string
  status: 'submitted' | 'under_review' | 'added' | 'declined' | 'needs_info'
  reviewNote?: string
  createdAt: string
  updatedAt: string
}

export interface DemoUser {
  id: string
  displayName: string
  email: string
  role: Exclude<DemoRole, 'visitor'>
  avatarInitial: string
  createdAt: string
}

export interface DemoSession {
  userId: string
  role: Exclude<DemoRole, 'visitor'>
  displayName: string
  email: string
}

export interface Collection {
  id: string
  ownerUserId: string
  name: string
  description: string
  slug: string
  skillIds: string[]
  isPublic: boolean
  coverUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Favorite {
  userId: string
  skillId: string
  createdAt: string
}

export interface ActivityEvent {
  id: string
  actorId: string
  action: string
  entityType: string
  entityId: string
  details: string
  createdAt: string
}

export interface MediaAsset {
  id: string
  url: string
  altText: string
  caption?: string
  associatedSkillIds: string[]
  sourceType: 'local_demo' | 'external_url'
  width?: number
  height?: number
  createdAt: string
}

export interface Guide {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  category: string
  readingTime: number
  publishedAt?: string
  isSample: boolean
}
