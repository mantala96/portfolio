const CMS_URL = import.meta.env.VITE_CMS_URL || 'http://localhost:3000'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// ─── Cache ────────────────────────────────────────────────────

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) return null
    return data as T
  } catch {
    return null
  }
}

function writeCache(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }))
  } catch {}
}

async function fetchWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = readCache<T>(key)
  if (cached !== null) {
    fetcher().then(fresh => writeCache(key, fresh)).catch(() => {})
    return cached
  }
  const data = await fetcher()
  writeCache(key, data)
  return data
}

// ─── Types ────────────────────────────────────────────────────

export interface MediaFile {
  id: string
  url: string
  filename: string
  mimeType: string
}

export interface Page {
  id: string
  title: string
  slug: string
  content: unknown
  createdAt: string
  updatedAt: string
}

export interface PersonalInfo {
  name: string
  role: string
  tagline: string
  bio: string
  email: string
  linkedin: string
  github: string
  resume?: MediaFile
}

export interface SkillGroup {
  id: string
  category: string
  items: { id: string; skill: string }[]
}

export interface Skills {
  groups: SkillGroup[]
}

export interface Project {
  id: string
  title: string
  description: string
  problem?: string
  solution?: string
  role?: string
  result?: string
  techStack?: { id: string; tech: string }[]
  githubUrl?: string
  liveUrl?: string
  featured?: boolean
  order?: number
}

export interface Experience {
  id: string
  role: string
  company: string
  startDate: string
  endDate?: string
  current?: boolean
  achievements?: { id: string; achievement: string }[]
  order?: number
}

// ─── Fetch helpers ────────────────────────────────────────────

export function fetchPersonalInfo(): Promise<PersonalInfo | null> {
  return fetchWithCache('cms:personal-info', async () => {
    try {
      const res = await fetch(`${CMS_URL}/api/globals/personal-info`)
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    }
  })
}

export function fetchSkills(): Promise<Skills | null> {
  return fetchWithCache('cms:skills', async () => {
    try {
      const res = await fetch(`${CMS_URL}/api/globals/skills`)
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    }
  })
}

export function fetchProjects(): Promise<Project[]> {
  return fetchWithCache('cms:projects', async () => {
    try {
      const res = await fetch(`${CMS_URL}/api/projects?sort=order&limit=100`)
      if (!res.ok) return []
      const data = await res.json()
      return data.docs ?? []
    } catch {
      return []
    }
  })
}

export function fetchExperience(): Promise<Experience[]> {
  return fetchWithCache('cms:experience', async () => {
    try {
      const res = await fetch(`${CMS_URL}/api/experience?sort=order&limit=100`)
      if (!res.ok) return []
      const data = await res.json()
      return data.docs ?? []
    } catch {
      return []
    }
  })
}

export async function fetchPageBySlug(slug: string): Promise<Page | null> {
  try {
    const res = await fetch(
      `${CMS_URL}/api/pages?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.docs?.[0] ?? null
  } catch {
    return null
  }
}
