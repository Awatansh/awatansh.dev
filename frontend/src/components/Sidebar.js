import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getContext } from "../utils/api";
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
        { path: "/", label: "🏠 Home", icon: "💬" },
        { path: "/about", label: "👋 About", icon: "📄" },
        { path: "/projects", label: "💼 Projects", icon: "🚀" },
        { path: "/skills", label: "🛠️ Skills", icon: "⚡" },
        { path: "/reachout", label: "✉️ Reach Out", icon: "📬" },
        { path: "/experience", label: "💼 Experience", icon: "📊" },
        { path: "/socials", label: "🌐 Socials", icon: "🔗" },
    ];
    const resumeLink = context?.resumeLink || import.meta.env.VITE_RESUME_LINK;
    return (_jsxs("nav", { className: "sidebar", children: [_jsxs("div", { className: "sidebar-header", children: [_jsx("h2", { className: "sidebar-title", children: "awatansh.dev" }), _jsx("p", { className: "sidebar-subtitle", children: "Developer Portfolio" })] }), _jsxs("div", { className: "sidebar-nav", children: [navItems.map((item) => (_jsxs(NavLink, { to: item.path, className: ({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`, children: [_jsx("span", { className: "sidebar-icon", children: item.icon }), _jsx("span", { className: "sidebar-label", children: item.label })] }, item.path))), resumeLink && resumeLink !== "https://drive.google.com/file/d/YOUR_ID/view" && (_jsxs("a", { href: resumeLink, target: "_blank", rel: "noopener noreferrer", className: "sidebar-link sidebar-link-external", children: [_jsx("span", { className: "sidebar-icon", children: "\uD83D\uDCC4" }), _jsx("span", { className: "sidebar-label", children: "\uD83D\uDCDA Resume" }), _jsx("span", { className: "sidebar-external-icon", children: "\u2197" })] }))] }), _jsxs("div", { className: "sidebar-footer", children: [_jsx("p", { className: "sidebar-hint", children: "\uFFFD Connect with me:" }), _jsx("div", { className: "sidebar-social-links", children: context?.socials.map((social, index) => {
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
