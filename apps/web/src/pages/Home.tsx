import Layout from '../components/Layout';
import HeroSection from '../components/Home/HeroSection';
import ValueProposition from '../components/Home/ValueProposition';
import GuideShowcase from '../components/Home/GuideShowcase';
import AIDemo from '../components/Home/AIDemo';
import Testimonials from '../components/Home/Testimonials';
import FAQ from '../components/Home/FAQ';
import FinalCTA from '../components/Home/FinalCTA';

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <ValueProposition />
      <GuideShowcase />
      <AIDemo />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </Layout>
  );
}
