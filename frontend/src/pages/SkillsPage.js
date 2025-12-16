import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { getContext } from "../utils/api";
const SkillsPage = () => {
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
    return (_jsx("div", { className: "page-container", children: _jsxs("div", { className: "page-content", children: [_jsx("h1", { className: "page-title", children: "\uD83D\uDEE0\uFE0F Technical Skills" }), _jsx("div", { className: "page-divider" }), context?.skills && context.skills.length > 0 ? (_jsx("div", { className: "skills-grid", children: context.skills.map((skillGroup, index) => (_jsxs("div", { className: "skill-category", children: [_jsx("h2", { className: "skill-category-title", children: skillGroup.category }), _jsx("div", { className: "skill-tags", children: skillGroup.items.map((skill) => (_jsx("span", { className: "skill-tag", children: skill }, skill))) })] }, index))) })) : (_jsx("div", { className: "empty-state", children: _jsx("p", { children: "No skills to display yet." }) }))] }) }));
};
export default SkillsPage;
