import Navbar from '@/components/Navbar';
import FloatingShapes from '@/components/FloatingShapes';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import Blogs from '@/components/sections/Blogs';
import Gallery from '@/components/sections/Gallery';
import Certificates from '@/components/sections/Certificates';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f3ee] overflow-hidden selection:bg-[#ed6094]/20">
      <FloatingShapes />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Blogs />
      <Gallery />
      <Certificates />
      <Contact />
      <Footer />
    </main>
  );
}
