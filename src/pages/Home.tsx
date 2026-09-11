import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Culture from '../components/Culture';
import Services from '../components/Services';
import WhyUs from '../components/WhyUs';
import Process from '../components/Process';
import Work from '../components/Work';
import Industries from '../components/Industries';
import GlobalCoverage from '../components/GlobalCoverage';
import Technologies from '../components/Technologies';
import Engagement from '../components/Engagement';
import Testimonials from '../components/Testimonials';
import Faqs from '../components/Faqs';
import Insights from '../components/Insights';
import Recognitions from '../components/Recognitions';
import Contact from '../components/Contact';

export default function Home() {
  const location = useLocation();

  /* Arriving from another page with a section in mind (e.g. "Services" pressed
     while on /careers): scroll to it once this page has rendered. */
  useEffect(() => {
    const id = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!id) return;
    const el = document.getElementById(id);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth' }));
  }, [location.state]);

  return (
    <>
      <Hero />
      <Culture />
      <Services />
      <WhyUs />
      <Process />
      <Work />
      <Industries />
      <GlobalCoverage />
      <Technologies />
      <Engagement />
      <Testimonials />
      <Faqs />
      <Insights />
      <Recognitions />
      <Contact />
    </>
  );
}
