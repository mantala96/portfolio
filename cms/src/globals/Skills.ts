import type { GlobalConfig } from 'payload'

export const Skills: GlobalConfig = {
  slug: 'skills',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Site Settings',
  },
  fields: [
    {
      name: 'groups',
      type: 'array',
      fields: [
        {
          name: 'category',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "Cloud", "DevOps", "Backend", "Tools"' },
        },
        {
          name: 'items',
          type: 'array',
          fields: [
            {
              name: 'skill',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
