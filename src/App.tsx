import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollTop from './components/ScrollTop';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home';
import Careers from './pages/Careers';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
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
            {/* Anything else falls back to the homepage. */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <ScrollTop />
      </AuthProvider>
    </BrowserRouter>
  );
}
