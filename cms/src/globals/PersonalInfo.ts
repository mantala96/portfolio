import type { GlobalConfig } from 'payload'

export const PersonalInfo: GlobalConfig = {
  slug: 'personal-info',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Site Settings',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Michal',
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      defaultValue: 'DevOps Engineer',
      admin: { description: 'Your job title shown in the hero' },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: { description: 'Short value proposition, e.g. "Building scalable Kubernetes platforms"' },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: { description: 'About Me paragraph — keep it short and human' },
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'linkedin',
      type: 'text',
      admin: { description: 'Full LinkedIn profile URL' },
    },
    {
      name: 'github',
      type: 'text',
      admin: { description: 'Full GitHub profile URL' },
    },
    {
      name: 'resume',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Upload your CV as a PDF' },
    },
  ],
}
