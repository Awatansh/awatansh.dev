import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { getContext } from "../utils/api";
const EducationPage = () => {
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
    return (_jsx("div", { className: "page-container", children: _jsxs("div", { className: "page-content", children: [_jsx("h1", { className: "page-title", children: "\uD83C\uDF93 Education" }), _jsx("div", { className: "page-divider" }), context?.education && context.education.length > 0 ? (_jsx("div", { className: "education-list", children: context.education.map((edu, index) => (_jsxs("div", { className: "education-card", children: [_jsxs("h2", { className: "education-degree", children: [edu.degree, " in ", edu.field] }), _jsx("h3", { className: "education-institution", children: edu.institution }), _jsxs("p", { className: "education-year", children: ["Graduated: ", edu.year] })] }, index))) })) : (_jsx("div", { className: "empty-state", children: _jsx("p", { children: "No education information to display yet." }) }))] }) }));
};
export default EducationPage;
