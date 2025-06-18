import { Layout } from '@/components/layout/Layout'
import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { About } from '@/components/sections/About'
import { KecamatanMap } from '@/components/sections/KecamatanMap'
import { ContactForm } from '@/components/sections/ContactForm'

export default function Home() {
  return (
    <Layout>
      <Hero />
      <About />
      <KecamatanMap />
      <Services />
      <ContactForm />
    </Layout>
  )
}
