import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getContext } from "../utils/api";
import type { PortfolioContext } from "@portfolio/shared";

const USE_SVG_ICONS = true;

type NavIconKey = "home" | "about" | "projects" | "skills" | "reachout" | "experience" | "socials" | "resume";

type NavItem = {
  path: string;
  label: string;
  icon: string;
  iconKey: NavIconKey;
};

const iconSize = 18;

const SvgNavIcon = ({ iconKey }: { iconKey: NavIconKey }) => {
  const commonProps = {
    viewBox: "0 0 24 24",
    width: iconSize,
    height: iconSize,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (iconKey) {
    case "home":
      return (
        <svg {...commonProps}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
        </svg>
      );
    case "about":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="3" />
          <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        </svg>
      );
    case "projects":
      return (
        <svg {...commonProps}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 10h18" />
        </svg>
      );
    case "skills":
      return (
        <svg {...commonProps}>
          <path d="M10 3 4 14h6l-2 7 8-12h-6l2-6z" />
        </svg>
      );
    case "reachout":
      return (
        <svg {...commonProps}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case "experience":
      return (
        <svg {...commonProps}>
          <rect x="3" y="7" width="18" height="12" rx="2" />
          <path d="M8 7V5h8v2" />
        </svg>
      );
    case "socials":
      return (
        <svg {...commonProps}>
          <circle cx="6" cy="12" r="2" />
          <circle cx="18" cy="6" r="2" />
          <circle cx="18" cy="18" r="2" />
          <path d="M8 12h8" />
          <path d="M16.5 7.5 7.8 11" />
          <path d="M16.5 16.5 7.8 13" />
        </svg>
      );
    case "resume":
      return (
        <svg {...commonProps}>
          <path d="M7 3h8l4 4v14H7z" />
          <path d="M15 3v5h5" />
          <path d="M10 12h6" />
          <path d="M10 16h6" />
        </svg>
      );
    default:
      return null;
  }
};

const SidebarIcon = ({ icon, iconKey }: { icon: string; iconKey: NavIconKey }) => {
  if (USE_SVG_ICONS) {
    return <SvgNavIcon iconKey={iconKey} />;
  }

  return icon;
};

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

  const navItems: NavItem[] = [
    { path: "/", label: "Home", icon: "🏠", iconKey: "home" },
    { path: "/about", label: "About", icon: "👋", iconKey: "about" },
    { path: "/projects", label: "Projects", icon: "📊", iconKey: "projects" },
    { path: "/skills", label: "Skills", icon: "⚡", iconKey: "skills" },
    { path: "/reachout", label: "Reach Out", icon: "📬", iconKey: "reachout" },
    { path: "/experience", label: "Experience", icon: "💼", iconKey: "experience" },
    { path: "/socials", label: "Socials", icon: "🔗", iconKey: "socials" },
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
            <span className="sidebar-icon"><SidebarIcon icon={item.icon} iconKey={item.iconKey} /></span>
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
            <span className="sidebar-icon"><SidebarIcon icon="📄" iconKey="resume" /></span>
            <span className="sidebar-label">Resume</span>
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
