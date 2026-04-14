import type { Experience as ExperienceType } from '../lib/cms'

export default function Experience({ experience }: { experience: ExperienceType[] }) {
  return (
    <section id="experience" className="section" style={{ background: 'var(--bg-2)' }}>
      <div className="container">
        <p className="section-label">Kariéra</p>
        <h2 className="section-title">Zkušenosti</h2>
        <p className="section-sub">
          Kde jsem působil a co jsem vytvořil.
        </p>

        {experience.length === 0 ? (
          <p className="empty-hint">Zkušenosti se zobrazí po přidání do CMS.</p>
        ) : (
          <div className="timeline">
            {experience.map((item) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-dot">
                  <div className="timeline-dot-inner" />
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="timeline-role">{item.role}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {item.current && <span className="timeline-current">Současnost</span>}
                      <span className="timeline-period">
                        {item.startDate} — {item.current ? 'Doposud' : (item.endDate || '?')}
                      </span>
                    </div>
                  </div>
                  <div className="timeline-company">{item.company}</div>
                  {item.achievements && item.achievements.length > 0 && (
                    <ul className="achievements">
                      {item.achievements.map(({ id, achievement }) => (
                        <li key={id} className="achievement-item">{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}