import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getContext } from "../utils/api";
const USE_SVG_ICONS = true;
const iconSize = 18;
const SvgNavIcon = ({ iconKey }) => {
    const commonProps = {
        viewBox: "0 0 24 24",
        width: iconSize,
        height: iconSize,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
    };
    switch (iconKey) {
        case "home":
            return (_jsxs("svg", { ...commonProps, children: [_jsx("path", { d: "M3 10.5 12 3l9 7.5" }), _jsx("path", { d: "M5 9.5V21h14V9.5" })] }));
        case "about":
            return (_jsxs("svg", { ...commonProps, children: [_jsx("circle", { cx: "12", cy: "8", r: "3" }), _jsx("path", { d: "M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" })] }));
        case "projects":
            return (_jsxs("svg", { ...commonProps, children: [_jsx("rect", { x: "3", y: "4", width: "18", height: "16", rx: "2" }), _jsx("path", { d: "M3 10h18" })] }));
        case "skills":
            return (_jsx("svg", { ...commonProps, children: _jsx("path", { d: "M10 3 4 14h6l-2 7 8-12h-6l2-6z" }) }));
        case "reachout":
            return (_jsxs("svg", { ...commonProps, children: [_jsx("rect", { x: "3", y: "5", width: "18", height: "14", rx: "2" }), _jsx("path", { d: "m4 7 8 6 8-6" })] }));
        case "experience":
            return (_jsxs("svg", { ...commonProps, children: [_jsx("rect", { x: "3", y: "7", width: "18", height: "12", rx: "2" }), _jsx("path", { d: "M8 7V5h8v2" })] }));
        case "socials":
            return (_jsxs("svg", { ...commonProps, children: [_jsx("circle", { cx: "6", cy: "12", r: "2" }), _jsx("circle", { cx: "18", cy: "6", r: "2" }), _jsx("circle", { cx: "18", cy: "18", r: "2" }), _jsx("path", { d: "M8 12h8" }), _jsx("path", { d: "M16.5 7.5 7.8 11" }), _jsx("path", { d: "M16.5 16.5 7.8 13" })] }));
        case "resume":
            return (_jsxs("svg", { ...commonProps, children: [_jsx("path", { d: "M7 3h8l4 4v14H7z" }), _jsx("path", { d: "M15 3v5h5" }), _jsx("path", { d: "M10 12h6" }), _jsx("path", { d: "M10 16h6" })] }));
        default:
            return null;
    }
};
const SidebarIcon = ({ icon, iconKey }) => {
    if (USE_SVG_ICONS) {
        return _jsx(SvgNavIcon, { iconKey: iconKey });
    }
    return icon;
};
const Sidebar = () => {
    const [context, setContext] = useState(null);
    useEffect(() => {
        const loadContext = async () => {
            try {
                const ctx = await getContext();
                setContext(ctx);
            }
            catch (error) {
                console.error("Failed to load context:", error);
            }
        };
        loadContext();
    }, []);
    const navItems = [
        { path: "/", label: "Home", icon: "🏠", iconKey: "home" },
        { path: "/about", label: "About", icon: "👋", iconKey: "about" },
        { path: "/projects", label: "Projects", icon: "📊", iconKey: "projects" },
        { path: "/skills", label: "Skills", icon: "⚡", iconKey: "skills" },
        { path: "/reachout", label: "Reach Out", icon: "📬", iconKey: "reachout" },
        { path: "/experience", label: "Experience", icon: "💼", iconKey: "experience" },
        { path: "/socials", label: "Socials", icon: "🔗", iconKey: "socials" },
    ];
    const resumeLink = context?.resumeLink || import.meta.env.VITE_RESUME_LINK;
    return (_jsxs("nav", { className: "sidebar", children: [_jsxs("div", { className: "sidebar-header", children: [_jsx("h2", { className: "sidebar-title", children: "awatansh.dev" }), _jsx("p", { className: "sidebar-subtitle", children: "Developer Portfolio" })] }), _jsxs("div", { className: "sidebar-nav", children: [navItems.map((item) => (_jsxs(NavLink, { to: item.path, title: item.label, className: ({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`, children: [_jsx("span", { className: "sidebar-icon", children: _jsx(SidebarIcon, { icon: item.icon, iconKey: item.iconKey }) }), _jsx("span", { className: "sidebar-label", children: item.label })] }, item.path))), resumeLink && resumeLink !== "https://drive.google.com/file/d/YOUR_ID/view" && (_jsxs("a", { href: resumeLink, target: "_blank", rel: "noopener noreferrer", title: "Resume", className: "sidebar-link sidebar-link-external", children: [_jsx("span", { className: "sidebar-icon", children: _jsx(SidebarIcon, { icon: "\uD83D\uDCC4", iconKey: "resume" }) }), _jsx("span", { className: "sidebar-label", children: "Resume" }), _jsx("span", { className: "sidebar-external-icon", children: "\u2197" })] }))] }), _jsxs("div", { className: "sidebar-footer", children: [_jsx("p", { className: "sidebar-hint", children: "\uD83D\uDD17 Connect with me:" }), _jsx("div", { className: "sidebar-social-links", children: context?.socials.map((social, index) => {
                            // Map social names to logo filenames
                            const logoMap = {
                                'GitHub': 'github-logo.svg',
                                'LinkedIn': 'linkedin-logo.svg',
                                'Twitter': 'twitter-logo.svg',
                                'X': 'twitter-logo.svg',
                                'Instagram': 'instagram-logo.svg',
                                'Facebook': 'facebook-logo.svg',
                            };
                            const logoFile = logoMap[social.name] || 'default-logo.svg';
                            return (_jsx("a", { href: social.url, target: "_blank", rel: "noopener noreferrer", className: "sidebar-social-link", title: social.name, children: _jsx("img", { src: `/img/${logoFile}`, alt: `${social.name} logo`, className: "social-logo", onError: (e) => {
                                        // Fallback to text if image not found
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement.textContent = social.name.charAt(0);
                                    } }) }, index));
                        }) })] })] }));
};
export default Sidebar;
