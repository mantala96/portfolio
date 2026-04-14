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
      connectionString: process.env.DATABASE_URL || '',
    },
    push: process.env.NODE_ENV !== 'production',
  }),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  serverURL: process.env.CMS_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  cors: [
    process.env.CMS_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    process.env.CMS_WEBSITE_URL || process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:5173',
  ],
  csrf: [
    process.env.CMS_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    process.env.CMS_WEBSITE_URL || process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:5173',
  ],
  upload: {
    limits: {
      fileSize: 10_000_000, // 10 MB
    },
  },
})
