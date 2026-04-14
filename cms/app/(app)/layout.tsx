import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CMS',
  description: 'Content Management System',
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  )
}
