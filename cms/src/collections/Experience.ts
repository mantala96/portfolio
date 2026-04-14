import type { CollectionConfig } from 'payload'

export const Experience: CollectionConfig = {
  slug: 'experience',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'role',
    defaultColumns: ['role', 'company', 'current', 'order'],
  },
  fields: [
    {
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'company',
      type: 'text',
      required: true,
    },
    {
      name: 'startDate',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Jan 2022"' },
    },
    {
      name: 'endDate',
      type: 'text',
      admin: { description: 'Leave empty if current' },
    },
    {
      name: 'current',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Check if this is your current job' },
    },
    {
      name: 'achievements',
      type: 'array',
      fields: [
        {
          name: 'achievement',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower number = shown first (most recent first)' },
    },
  ],
}
