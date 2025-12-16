import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { getContext } from "../utils/api";
const AboutPage = () => {
    const [context, setContext] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        console.log("[AboutPage] Component mounted");
        const loadContext = async () => {
            try {
                const ctx = await getContext();
                console.log("[AboutPage] Context loaded:", ctx);
                setContext(ctx);
            }
            catch (error) {
                console.error("[AboutPage] Failed to load context:", error);
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
    return (_jsx("div", { className: "page-container", children: _jsxs("div", { className: "page-content", children: [_jsx("h1", { className: "page-title", children: "\uD83D\uDC4B About Me" }), _jsx("div", { className: "page-divider" }), _jsxs("div", { className: "content-section about-header", children: [_jsxs("div", { className: "profile-section", children: [_jsxs("div", { className: "profile-info", children: [_jsx("h2", { className: "section-title", children: "Hi, I'm Awatansh" }), _jsx("p", { className: "section-subtitle", children: "Developer & AI Researcher" }), _jsxs("blockquote", { className: "tech-quote", children: [_jsx("span", { className: "quote-icon", children: "\"" }), context?.quote || "I find your lack of bugs disturbing. — Darth Vader (probably)", _jsx("span", { className: "quote-icon", children: "\"" })] }), _jsxs("div", { className: "about-bio", children: [_jsx("p", { children: context?.resume ||
                                                        "Passionate full-stack developer and AI researcher with expertise in modern web technologies and machine learning." }), _jsx("p", { children: "I build innovative solutions that blend creativity with technical excellence. When I'm not coding, you'll find me exploring new tech, contributing to open-source, or working on research projects." })] }), context?.resumeLink && (_jsxs("a", { href: context.resumeLink, target: "_blank", rel: "noopener noreferrer", className: "resume-link", children: [_jsx("span", { children: "\uD83D\uDCC4" }), " View Resume"] }))] }), _jsx("div", { className: "profile-image-container", children: _jsx("img", { src: "/profile.jpg", alt: "Awatansh Singh", className: "profile-image", onLoad: () => {
                                            console.log("[AboutPage] Profile image loaded successfully from /profile.jpg");
                                        }, onError: (e) => {
                                            console.error("[AboutPage] Profile image failed to load:", e);
                                            console.error("[AboutPage] Image src:", e.target.src);
                                            console.error("[AboutPage] Current URL:", window.location.href);
                                        } }) })] }), _jsxs("div", { className: "about-highlights", children: [_jsxs("div", { className: "highlight-card", children: [_jsx("div", { className: "highlight-icon", children: "\uD83D\uDE80" }), _jsx("h3", { children: "Full-Stack Development" }), _jsx("p", { children: "Building scalable applications with modern frameworks" })] }), _jsxs("div", { className: "highlight-card", children: [_jsx("div", { className: "highlight-icon", children: "\uD83E\uDD16" }), _jsx("h3", { children: "AI & Machine Learning" }), _jsx("p", { children: "Exploring cutting-edge AI technologies and research" })] }), _jsxs("div", { className: "highlight-card", children: [_jsx("div", { className: "highlight-icon", children: "\uD83C\uDF1F" }), _jsx("h3", { children: "Open Source" }), _jsx("p", { children: "Contributing to the community and sharing knowledge" })] })] })] }), _jsxs("div", { className: "content-section", children: [_jsx("h2", { className: "section-title", children: "\uD83C\uDFAF What I Do" }), _jsxs("ul", { className: "feature-list", children: [_jsx("li", { children: "Design and develop full-stack web applications" }), _jsx("li", { children: "Research and implement AI/ML solutions" }), _jsx("li", { children: "Collaborate on open-source projects" }), _jsx("li", { children: "Write technical content and documentation" }), _jsx("li", { children: "Mentor aspiring developers" })] })] }), context?.education && context.education.length > 0 && (_jsxs("div", { className: "content-section", children: [_jsx("h2", { className: "section-title", children: "\uD83C\uDF93 Education" }), _jsx("div", { className: "education-list", children: context.education.map((edu, index) => (_jsxs("div", { className: "education-item", children: [_jsxs("div", { className: "education-header", children: [_jsxs("h3", { className: "education-degree", children: [edu.degree, " in ", edu.field] }), _jsx("span", { className: "education-year", children: edu.year })] }), _jsx("p", { className: "education-institution", children: edu.institution })] }, index))) })] }))] }) }));
};
export default AboutPage;
