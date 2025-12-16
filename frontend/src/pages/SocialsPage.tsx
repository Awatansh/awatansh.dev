import { useEffect, useState } from "react";
import { getContext } from "../utils/api";
import type { PortfolioContext } from "@portfolio/shared";

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

  // Map social names to logo filenames
  const logoMap: Record<string, string> = {
    'GitHub': 'github-logo.svg',
    'LinkedIn': 'linkedin-logo.svg',
    'Twitter': 'twitter-logo.svg',
    'X': 'twitter-logo.svg',
    'Instagram': 'instagram-logo.svg',
    'Facebook': 'facebook-logo.svg',
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
            {context.socials.map((social: any, index: number) => {
              const logoFile = logoMap[social.name] || 'default-logo.svg';
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
                      src={`/img/${logoFile}`} 
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
