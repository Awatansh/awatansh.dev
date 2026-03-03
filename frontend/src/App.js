import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRedirect from "./components/AdminRedirect";
import { useRippleBackground } from "./hooks/useRippleBackground";
import BackgroundAudioPlayer from "./components/BackgroundAudioPlayer";
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
        const requestIdle = window.requestIdleCallback;
        const idleHandle = requestIdle
            ? requestIdle(preloadRoutes)
            : window.setTimeout(preloadRoutes, 1200);
        return () => {
            if (requestIdle && window.cancelIdleCallback) {
                window.cancelIdleCallback(idleHandle);
            }
            else {
                window.clearTimeout(idleHandle);
            }
        };
    }, []);
    return (_jsx(GoogleOAuthProvider, { clientId: GOOGLE_CLIENT_ID, children: _jsx(Router, { children: _jsxs("div", { className: "app-layout", children: [_jsx("div", { className: "ripple-background", ref: rippleRef }), _jsx(BackgroundAudioPlayer, {}), _jsx(Suspense, { fallback: _jsx("div", { className: "loading", children: "Loading page..." }), children: _jsxs(Routes, { children: [_jsx(Route, { path: "/admin", element: _jsx(AdminRedirect, {}) }), _jsx(Route, { path: "/admin/login", element: _jsx(AdminLogin, {}) }), _jsx(Route, { path: "/admin/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(AdminDashboard, {}) }) }), _jsx(Route, { path: "*", element: _jsxs(_Fragment, { children: [_jsx(Sidebar, {}), _jsx("main", { className: "main-content", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/about", element: _jsx(AboutPage, {}) }), _jsx(Route, { path: "/projects", element: _jsx(ProjectsPage, {}) }), _jsx(Route, { path: "/experience", element: _jsx(ExperiencePage, {}) }), _jsx(Route, { path: "/skills", element: _jsx(SkillsPage, {}) }), _jsx(Route, { path: "/reachout", element: _jsx(ReachoutPage, {}) }), _jsx(Route, { path: "/socials", element: _jsx(SocialsPage, {}) })] }) })] }) })] }) })] }) }) }));
}
export default App;
