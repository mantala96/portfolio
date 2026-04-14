import { useEffect, useState } from 'react'
import './index.css'

import {
  fetchPersonalInfo,
  fetchSkills,
  fetchExperience,
  type PersonalInfo,
  type Skills,
  type Experience,
} from './lib/cms'

import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import SkillsSection from './components/Skills'
import ExperienceSection from './components/Experience'
import Contact from './components/Contact'

export default function App() {
  const [info, setInfo] = useState<PersonalInfo | null>(null)
  const [skills, setSkills] = useState<Skills | null>(null)
  const [experience, setExperience] = useState<Experience[]>([])

  useEffect(() => {
    Promise.all([
      fetchPersonalInfo(),
      fetchSkills(),
      fetchExperience(),
    ]).then(([infoData, skillsData, experienceData]) => {
      setInfo(infoData)
      setSkills(skillsData)

      setExperience(experienceData)
    })
  }, [])

  return (
    <>
      <Nav />
      <main>
        <Hero info={info} />
        <About info={info} />
        <SkillsSection skills={skills} />
        <ExperienceSection experience={experience} />
        <Contact info={info} />
      </main>
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} {info?.name ?? 'Michal'}. Vytvořeno pomocí PayloadCMS + React.</p>
        </div>
      </footer>
    </>
  )
}
