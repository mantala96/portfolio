import type { PersonalInfo } from '../lib/cms'

const STATS = [
  { icon: '☁️', label: 'Specializace', value: 'Kubernetes a Docker' },
  { icon: '🔧', label: 'Zaměření', value: 'DevOps & Infrastruktura' },
  { icon: '🚀', label: 'Přístup', value: 'Automatizace především' },
  { icon: '📍', label: 'Lokalita', value: 'Česká republika' },
]

export default function About({ info }: { info: PersonalInfo | null }) {
  const bio =
    info?.bio ||
    'Specializuji se na budování a správu cloud-native infrastruktury. Baví mě automatizace, spolehlivost a škálovatelné systémy. Rád řeším komplexní infrastrukturní výzvy a pomáhám týmům doručovat software rychleji.'

  return (
    <section id="about" className="section">
      <div className="container">
        <p className="section-label">O mně</p>
        <h2 className="section-title">Kdo jsem</h2>

        <div className="about-grid">
          <div className="about-text">
            <p>{bio}</p>
          </div>

          <div className="about-card">
            {STATS.map(({ icon, label, value }) => (
              <div key={label} className="about-stat">
                <div className="about-stat-icon">{icon}</div>
                <div>
                  <div className="about-stat-label">{label}</div>
                  <div className="about-stat-value">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}