import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollTop from './components/ScrollTop';
import Home from './pages/Home';
import Careers from './pages/Careers';

/** Land at the top of each page on navigation, unless a section was requested. */
function ScrollToTopOnNavigate() {
  const { pathname, state } = useLocation();

  useEffect(() => {
    if ((state as { scrollTo?: string } | null)?.scrollTo) return;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, state]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTopOnNavigate />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/careers" element={<Careers />} />
          {/* Anything else falls back to the homepage. */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <ScrollTop />
    </BrowserRouter>
  );
}
