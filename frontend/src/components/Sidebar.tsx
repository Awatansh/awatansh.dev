import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getContext } from "../utils/api";
import type { PortfolioContext } from "@portfolio/shared";

const Sidebar = () => {
  const [context, setContext] = useState<PortfolioContext | null>(null);

  useEffect(() => {
    const loadContext = async () => {
      try {
        const ctx = await getContext();
        setContext(ctx);
      } catch (error) {
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

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">awatansh.dev</h2>
        <p className="sidebar-subtitle">Developer Portfolio</p>
      </div>

      <div className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={item.label}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
        
        {resumeLink && resumeLink !== "https://drive.google.com/file/d/YOUR_ID/view" && (
          <a
            href={resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            title="Resume"
            className="sidebar-link sidebar-link-external"
          >
            <span className="sidebar-icon">📄</span>
            <span className="sidebar-label">📚 Resume</span>
            <span className="sidebar-external-icon">↗</span>
          </a>
        )}
      </div>

      <div className="sidebar-footer">
        <p className="sidebar-hint">🔗 Connect with me:</p>
        <div className="sidebar-social-links">
          {context?.socials.map((social, index) => {
            // Map social names to logo filenames
            const logoMap: Record<string, string> = {
              'GitHub': 'github-logo.svg',
              'LinkedIn': 'linkedin-logo.svg',
              'Twitter': 'twitter-logo.svg',
              'X': 'twitter-logo.svg',
              'Instagram': 'instagram-logo.svg',
              'Facebook': 'facebook-logo.svg',
            };
            
            const logoFile = logoMap[social.name] || 'default-logo.svg';
            
            return (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-social-link"
                title={social.name}
              >
                <img 
                  src={`/img/${logoFile}`} 
                  alt={`${social.name} logo`}
                  className="social-logo"
                  onError={(e) => {
                    // Fallback to text if image not found
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.textContent = social.name.charAt(0);
                  }}
                />
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
