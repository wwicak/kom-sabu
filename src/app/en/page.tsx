import { Layout } from '@/components/layout/Layout'
import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { About } from '@/components/sections/About'
import { CulturalHeritage } from '@/components/sections/CulturalHeritage'
import { KecamatanMap } from '@/components/sections/KecamatanMap'
import { ContactForm } from '@/components/sections/ContactForm'

export default function EnglishHomePage() {
  return (
    <Layout>
      <Hero />
      <About />
      <CulturalHeritage />
      <KecamatanMap />
      <Services />
      <ContactForm />
    </Layout>
  )
}
