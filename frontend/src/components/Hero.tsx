import type { PersonalInfo } from '../lib/cms'

export default function Hero({ info }: { info: PersonalInfo | null }) {
  const name = info?.name || 'Michal'
  const role = info?.role || 'DevOps Engineer'
  const tagline = info?.tagline || 'Buduji škálovatelnou infrastrukturu a platformy na Kubernetes.'

  return (
    <section id="hero" className="hero">
      <div className="hero-bg" />
      <div className="container hero-content">
        <p className="hero-greeting">Ahoj, já jsem</p>
        <h1 className="hero-name">{name}</h1>
        <p className="hero-role">{role}</p>
        <p className="hero-tagline">{tagline}</p>
        <div className="hero-actions">
          <a href="#contact" className="btn btn-outline">
            Kontaktujte mě
          </a>
        </div>
      </div>
    </section>
  )
}
