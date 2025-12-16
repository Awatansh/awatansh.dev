import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { getContext } from "../utils/api";
const ProjectsPage = () => {
    const [context, setContext] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadContext = async () => {
            try {
                const ctx = await getContext();
                setContext(ctx);
            }
            catch (error) {
                console.error("Failed to load context:", error);
            }
            finally {
                setLoading(false);
            }
        };
        loadContext();
    }, []);
    if (loading) {
        return _jsx("div", { className: "page-container", children: _jsx("div", { className: "loading", children: "Loading..." }) });
    }
    return (_jsx("div", { className: "page-container", children: _jsxs("div", { className: "page-content", children: [_jsx("h1", { className: "page-title", children: "\uD83D\uDCBC My Projects" }), _jsx("div", { className: "page-divider" }), context?.projects && context.projects.length > 0 ? (_jsx("div", { className: "projects-grid", children: context.projects.map((project) => (_jsxs("div", { className: "project-card", children: [_jsx("div", { className: "project-header", children: _jsx("h2", { className: "project-title", children: project.title }) }), _jsx("p", { className: "project-description", children: project.description }), _jsx("div", { className: "project-tech", children: project.technologies.map((tech) => (_jsx("span", { className: "tech-badge", children: tech }, tech))) }), project.link && (_jsx("div", { className: "project-actions", children: _jsx("a", { href: project.link, target: "_blank", rel: "noopener noreferrer", className: "project-link", children: "View Project \u2192" }) }))] }, project.id))) })) : (_jsx("div", { className: "empty-state", children: _jsx("p", { children: "No projects to display yet." }) }))] }) }));
};
export default ProjectsPage;
