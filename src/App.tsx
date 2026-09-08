import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import Process from './components/Process';
import Work from './components/Work';
import Industries from './components/Industries';
import GlobalCoverage from './components/GlobalCoverage';
import Technologies from './components/Technologies';
import Engagement from './components/Engagement';
import Testimonials from './components/Testimonials';
import Faqs from './components/Faqs';
import Insights from './components/Insights';
import Recognitions from './components/Recognitions';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollTop from './components/ScrollTop';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
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
      </main>
      <Footer />
      <ScrollTop />
    </>
  );
}
