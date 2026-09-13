import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollTop from './components/ScrollTop';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home';
import Careers from './pages/Careers';
import CaseStudy from './pages/CaseStudy';
import Article from './pages/Article';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Portal from './pages/app/Portal';
import ProjectPage from './pages/app/ProjectPage';
import { AuthProvider } from './lib/auth';

/** Land at the top of each page on navigation, unless a section was requested. */
function ScrollToTopOnNavigate() {
  const { pathname, state } = useLocation();

  useEffect(() => {
    if ((state as { scrollTo?: string } | null)?.scrollTo) return;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, state]);

  return null;
}

/** The marketing footer and scroll button stay off the internal tools. */
function SiteChrome() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/app') || pathname.startsWith('/dashboard')) return null;
  return (
    <>
      <Footer />
      <ScrollTop />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTopOnNavigate />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            <Route path="/blog/:slug" element={<Article />} />
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/signup" element={<Auth mode="signup" />} />
            <Route path="/forgot-password" element={<Auth mode="forgot" />} />
            {/* Supabase sends people here from the reset email. */}
            <Route path="/reset-password" element={<Auth mode="reset" />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            {/* Workspace: one dashboard per role, and a page per project. */}
            <Route
              path="/app"
              element={
                <RequireAuth>
                  <Portal />
                </RequireAuth>
              }
            />
            <Route
              path="/app/projects/:id"
              element={
                <RequireAuth>
                  <ProjectPage />
                </RequireAuth>
              }
            />
            {/* Anything else falls back to the homepage. */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <SiteChrome />
      </AuthProvider>
    </BrowserRouter>
  );
}
