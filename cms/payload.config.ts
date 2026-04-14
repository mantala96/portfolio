import path from 'path'
import { fileURLToPath } from 'url'

import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Users } from './src/collections/Users'
import { Media } from './src/collections/Media'
import { Experience } from './src/collections/Experience'
import { PersonalInfo } from './src/globals/PersonalInfo'
import { Skills } from './src/globals/Skills'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ✅ Fail fast (prevents silent production bugs)
if (!process.env.PAYLOAD_SECRET) {
  throw new Error('❌ PAYLOAD_SECRET is missing')
}

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL is missing')
}

if (!process.env.CMS_SERVER_URL) {
  throw new Error('❌ CMS_SERVER_URL is missing')
}

// Optional but recommended
if (!process.env.CMS_WEBSITE_URL) {
  console.warn('⚠️ CMS_WEBSITE_URL is not set (CORS may fail)')
}

// ✅ Fix TypeScript: ensure string[]
const allowedOrigins: string[] = [
  process.env.CMS_SERVER_URL,
  process.env.CMS_WEBSITE_URL,
].filter((url): url is string => Boolean(url))

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [Users, Media, Experience],
  globals: [PersonalInfo, Skills],

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    push: process.env.NODE_ENV !== 'production',
  }),

  editor: lexicalEditor(),

  // ✅ MUST be stable across deployments
  secret: process.env.PAYLOAD_SECRET,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // ✅ Must exactly match your public backend URL
  serverURL: process.env.CMS_SERVER_URL,


  // ✅ Fixed TS + safe runtime behavior
  cors: allowedOrigins,
  csrf: allowedOrigins,

  upload: {
    limits: {
      fileSize: 10_000_000, // 10 MB
    },
  },
})