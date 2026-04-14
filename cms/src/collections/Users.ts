import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',

  admin: {
    useAsTitle: 'email',
  },

  auth: {
    cookies: {
      secure: true,       // ✅ required for HTTPS
      sameSite: 'None',   // ✅ required for cross-domain frontend
    },
  },

  fields: [],
}