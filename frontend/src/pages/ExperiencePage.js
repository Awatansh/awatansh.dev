import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { getContext } from "../utils/api";
const ExperiencePage = () => {
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
    return (_jsx("div", { className: "page-container", children: _jsxs("div", { className: "page-content", children: [_jsx("h1", { className: "page-title", children: "\uD83D\uDCBC Work Experience" }), _jsx("div", { className: "page-divider" }), context?.experience && context.experience.length > 0 ? (_jsx("div", { className: "timeline", children: context.experience.map((exp, index) => (_jsxs("div", { className: "timeline-item", children: [_jsx("div", { className: "timeline-marker" }), _jsxs("div", { className: "timeline-content", children: [_jsx("h2", { className: "experience-position", children: exp.position }), _jsxs("h3", { className: "experience-company", children: ["@ ", exp.company] }), _jsxs("p", { className: "experience-date", children: [exp.startDate, " - ", exp.endDate || "Present"] }), _jsx("p", { className: "experience-description", children: exp.description })] })] }, index))) })) : (_jsx("div", { className: "empty-state", children: _jsx("p", { children: "No experience to display yet." }) })), context?.education && context.education.length > 0 && (_jsxs(_Fragment, { children: [_jsx("div", { className: "section-divider" }), _jsx("h1", { className: "page-title", children: "\uD83C\uDF93 Education" }), _jsx("div", { className: "page-divider" }), _jsx("div", { className: "education-list", children: context.education.map((edu, index) => (_jsxs("div", { className: "education-item", children: [_jsxs("div", { className: "education-header", children: [_jsxs("h3", { className: "education-degree", children: [edu.degree, " in ", edu.field] }), _jsx("span", { className: "education-year", children: edu.year })] }), _jsx("p", { className: "education-institution", children: edu.institution })] }, index))) })] }))] }) }));
};
export default ExperiencePage;
