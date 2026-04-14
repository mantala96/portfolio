import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchPageBySlug, type Page } from '../lib/cms'

export default function PageTemplate() {
  const { slug = 'home' } = useParams<{ slug: string }>()
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchPageBySlug(slug)
      .then((data) => {
        setPage(data)
        if (!data) setError('Page not found')
      })
      .catch(() => setError('Failed to load page'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <p>Loading…</p>
  if (error) return <p>{error}</p>

  return (
    <article>
      <h1>{page!.title}</h1>
      {/* Rich text from Payload's Lexical editor is a JSON node tree.
          Replace this placeholder with a proper Lexical renderer when needed.
          See: https://payloadcms.com/docs/rich-text/overview */}
      <div className="content">
        <pre>{JSON.stringify(page!.content, null, 2)}</pre>
      </div>
    </article>
  )
}
