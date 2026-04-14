const CMS_URL = import.meta.env.VITE_CMS_URL ?? 'http://localhost:3000'

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

export async function fetchPersonalInfo(): Promise<PersonalInfo | null> {
  try {
    const res = await fetch(`${CMS_URL}/api/globals/personal-info`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function fetchSkills(): Promise<Skills | null> {
  try {
    const res = await fetch(`${CMS_URL}/api/globals/skills`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${CMS_URL}/api/projects?sort=order&limit=100`)
    if (!res.ok) return []
    const data = await res.json()
    return data.docs ?? []
  } catch {
    return []
  }
}

export async function fetchExperience(): Promise<Experience[]> {
  try {
    const res = await fetch(`${CMS_URL}/api/experience?sort=order&limit=100`)
    if (!res.ok) return []
    const data = await res.json()
    return data.docs ?? []
  } catch {
    return []
  }
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
