import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRedirect from "./components/AdminRedirect";
import { useRippleBackground } from "./hooks/useRippleBackground";

const AboutPage = lazy(() => import("./pages/AboutPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ExperiencePage = lazy(() => import("./pages/ExperiencePage"));
const SkillsPage = lazy(() => import("./pages/SkillsPage"));
const ReachoutPage = lazy(() => import("./pages/ReachoutPage"));
const SocialsPage = lazy(() => import("./pages/SocialsPage"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

function App() {
  const rippleRef = useRippleBackground();

  useEffect(() => {
    const preloadRoutes = () => {
      void import("./pages/AboutPage");
      void import("./pages/ProjectsPage");
      void import("./pages/ExperiencePage");
      void import("./pages/SkillsPage");
      void import("./pages/ReachoutPage");
      void import("./pages/SocialsPage");
      void import("./pages/AdminLogin");
      void import("./pages/AdminDashboard");
    };

    const requestIdle = (window as any).requestIdleCallback as
      | ((callback: () => void) => number)
      | undefined;

    const idleHandle = requestIdle
      ? requestIdle(preloadRoutes)
      : window.setTimeout(preloadRoutes, 1200);

    return () => {
      if (requestIdle && (window as any).cancelIdleCallback) {
        (window as any).cancelIdleCallback(idleHandle);
      } else {
        window.clearTimeout(idleHandle);
      }
    };
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <div className="app-layout">
          <div className="ripple-background" ref={rippleRef}></div>
          <Suspense fallback={<div className="loading">Loading page...</div>}>
            <Routes>
              {/* Admin routes (no sidebar) */}
              <Route path="/admin" element={<AdminRedirect />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* Main portfolio routes (with sidebar) */}
              <Route path="*" element={
                <>
                  <Sidebar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/projects" element={<ProjectsPage />} />
                      <Route path="/experience" element={<ExperiencePage />} />
                      <Route path="/skills" element={<SkillsPage />} />
                      <Route path="/reachout" element={<ReachoutPage />} />
                      <Route path="/socials" element={<SocialsPage />} />
                    </Routes>
                  </main>
                </>
              } />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
