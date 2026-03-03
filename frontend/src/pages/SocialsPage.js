import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { getContext } from "../utils/api";
const SocialsPage = () => {
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
    const logoMap = {
        github: "github-logo.svg",
        linkedin: "linkedin-logo.svg",
        twitter: "twitter-logo.svg",
        x: "twitter-logo.svg",
        instagram: "instagram-logo.svg",
        facebook: "facebook-logo.svg",
    };
    const getSocialIconSrc = (social) => {
        const configuredIcon = social.icon?.trim();
        if (configuredIcon) {
            if (configuredIcon.startsWith("http://") || configuredIcon.startsWith("https://") || configuredIcon.startsWith("/")) {
                return configuredIcon;
            }
            return configuredIcon.includes("/") ? `/${configuredIcon}` : `/img/${configuredIcon}`;
        }
        const logoFile = logoMap[social.name.trim().toLowerCase()] || "default-logo.svg";
        return `/img/${logoFile}`;
    };
    return (_jsx("div", { className: "page-container", children: _jsxs("div", { className: "page-content", children: [_jsx("h1", { className: "page-title", children: "\uD83C\uDF10 Connect With Me" }), _jsx("div", { className: "page-divider" }), _jsx("div", { className: "content-section", children: _jsx("p", { className: "section-description", children: "Feel free to connect with me on various platforms. I'm always open to interesting conversations and collaboration opportunities!" }) }), context?.socials && context.socials.length > 0 ? (_jsx("div", { className: "socials-grid", children: context.socials.map((social, index) => {
                        return (_jsxs("a", { href: social.url, target: "_blank", rel: "noopener noreferrer", className: "social-card", children: [_jsx("div", { className: "social-icon-wrapper", children: _jsx("img", { src: getSocialIconSrc(social), alt: `${social.name} logo`, className: "social-icon-img", onError: (e) => {
                                            e.currentTarget.style.display = 'none';
                                            const wrapper = e.currentTarget.parentElement;
                                            if (wrapper) {
                                                wrapper.innerHTML = `<div class="social-icon-fallback">${social.name.charAt(0)}</div>`;
                                            }
                                        } }) }), _jsx("h3", { className: "social-name", children: social.name }), _jsx("p", { className: "social-url", children: social.url })] }, index));
                    }) })) : (_jsx("div", { className: "empty-state", children: _jsx("p", { children: "No social links available yet." }) }))] }) }));
};
export default SocialsPage;
