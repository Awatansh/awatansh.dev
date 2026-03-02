import { useEffect, useState } from "react";
import { getContext } from "../utils/api";
import type { PortfolioContext, Social } from "@portfolio/shared";

const SocialsPage = () => {
  const [context, setContext] = useState<PortfolioContext | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContext = async () => {
      try {
        const ctx = await getContext();
        setContext(ctx);
      } catch (error) {
        console.error("Failed to load context:", error);
      } finally {
        setLoading(false);
      }
    };
    loadContext();
  }, []);

  if (loading) {
    return <div className="page-container"><div className="loading">Loading...</div></div>;
  }

  const logoMap: Record<string, string> = {
    github: "github-logo.svg",
    linkedin: "linkedin-logo.svg",
    twitter: "twitter-logo.svg",
    x: "twitter-logo.svg",
    instagram: "instagram-logo.svg",
    facebook: "facebook-logo.svg",
  };

  const getSocialIconSrc = (social: Social): string => {
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

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">🌐 Connect With Me</h1>
        <div className="page-divider"></div>

        <div className="content-section">
          <p className="section-description">
            Feel free to connect with me on various platforms. I'm always open to interesting
            conversations and collaboration opportunities!
          </p>
        </div>

        {context?.socials && context.socials.length > 0 ? (
          <div className="socials-grid">
            {context.socials.map((social, index: number) => {
              return (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-card"
                >
                  <div className="social-icon-wrapper">
                    <img 
                      src={getSocialIconSrc(social)}
                      alt={`${social.name} logo`}
                      className="social-icon-img"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const wrapper = e.currentTarget.parentElement;
                        if (wrapper) {
                          wrapper.innerHTML = `<div class="social-icon-fallback">${social.name.charAt(0)}</div>`;
                        }
                      }}
                    />
                  </div>
                  <h3 className="social-name">{social.name}</h3>
                  <p className="social-url">{social.url}</p>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p>No social links available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialsPage;
