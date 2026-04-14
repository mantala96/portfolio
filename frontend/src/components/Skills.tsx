import type { Skills as SkillsType } from '../lib/cms'

const FALLBACK_GROUPS = [
  { id: '1', category: 'Cloud', items: [{ id: '1', skill: 'AWS' }, { id: '2', skill: 'GCP' }, { id: '3', skill: 'Azure' }] },
  { id: '2', category: 'DevOps', items: [{ id: '4', skill: 'Kubernetes' }, { id: '5', skill: 'Docker' }, { id: '6', skill: 'Terraform' }, { id: '7', skill: 'Helm' }] },
  { id: '3', category: 'CI/CD', items: [{ id: '8', skill: 'GitHub Actions' }, { id: '9', skill: 'Jenkins' }, { id: '10', skill: 'ArgoCD' }] },
  { id: '4', category: 'Monitoring', items: [{ id: '11', skill: 'Prometheus' }, { id: '12', skill: 'Grafana' }, { id: '13', skill: 'Loki' }] },
]

export default function Skills({ skills }: { skills: SkillsType | null }) {
  const groups = skills?.groups?.length ? skills.groups : FALLBACK_GROUPS

  return (
    <section id="skills" className="section">
      <div className="container">
        <p className="section-label">Tech stack</p>
        <h2 className="section-title">Dovednosti</h2>
        <p className="section-sub">
          Technologie a nástroje, se kterými pracuji na denní bázi.
        </p>

        <div className="skills-grid">
          {groups.map((group) => (
            <div key={group.id} className="skill-group">
              <div className="skill-group-title">{group.category}</div>
              <div className="skill-tags">
                {group.items.map(({ id, skill }) => (
                  <span key={id} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}