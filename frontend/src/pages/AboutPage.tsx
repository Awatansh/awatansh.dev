import { useEffect, useState } from "react";
import { getContext } from "../utils/api";
import type { PortfolioContext } from "@portfolio/shared";

const AboutPage = () => {
  const [context, setContext] = useState<PortfolioContext | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[AboutPage] Component mounted");
    const loadContext = async () => {
      try {
        const ctx = await getContext();
        console.log("[AboutPage] Context loaded:", ctx);
        setContext(ctx);
      } catch (error) {
        console.error("[AboutPage] Failed to load context:", error);
      } finally {
        setLoading(false);
      }
    };
    loadContext();
  }, []);

  if (loading) {
    return <div className="page-container"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">👋 About Me</h1>
        <div className="page-divider"></div>

        <div className="content-section about-header">
          <div className="profile-section">
            <div className="profile-info">
              <h2 className="section-title">Hi, I'm Awatansh</h2>
              <p className="section-subtitle">Developer & AI Researcher</p>
              <blockquote className="tech-quote">
                <span className="quote-icon">"</span>
                {context?.quote || "I find your lack of bugs disturbing. — Darth Vader (probably)"}
                <span className="quote-icon">"</span>
              </blockquote>
              
              <div className="about-bio">
                <p>
                  {context?.resume || 
                    "Passionate full-stack developer and AI researcher with expertise in modern web technologies and machine learning."}
                </p>
                <p>
                  I build innovative solutions that blend creativity with technical excellence. 
                  When I'm not coding, you'll find me exploring new tech, contributing to open-source, 
                  or working on research projects.
                </p>
              </div>
              
              {context?.resumeLink && (
                <a href={context.resumeLink} target="_blank" rel="noopener noreferrer" className="resume-link">
                  <span>📄</span> View Resume
                </a>
              )}
            </div>
            
            <div className="profile-image-container">
              <img 
                src="/profile.jpg" 
                alt="Awatansh Singh" 
                className="profile-image"
                onLoad={() => {
                  console.log("[AboutPage] Profile image loaded successfully from /profile.jpg");
                }}
                onError={(e) => {
                  console.error("[AboutPage] Profile image failed to load:", e);
                  console.error("[AboutPage] Image src:", (e.target as HTMLImageElement).src);
                  console.error("[AboutPage] Current URL:", window.location.href);
                }}
              />
            </div>
          </div>

          <div className="about-highlights">
            <div className="highlight-card">
              <div className="highlight-icon">🚀</div>
              <h3>Full-Stack Development</h3>
              <p>Building scalable applications with modern frameworks</p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">🤖</div>
              <h3>AI & Machine Learning</h3>
              <p>Exploring cutting-edge AI technologies and research</p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">🌟</div>
              <h3>Open Source</h3>
              <p>Contributing to the community and sharing knowledge</p>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h2 className="section-title">🎯 What I Do</h2>
          <ul className="feature-list">
            <li>Design and develop full-stack web applications</li>
            <li>Research and implement AI/ML solutions</li>
            <li>Collaborate on open-source projects</li>
            <li>Write technical content and documentation</li>
            <li>Mentor aspiring developers</li>
          </ul>
        </div>

        {context?.education && context.education.length > 0 && (
          <div className="content-section">
            <h2 className="section-title">🎓 Education</h2>
            <div className="education-list">
              {context.education.map((edu, index) => (
                <div key={index} className="education-item">
                  <div className="education-header">
                    <h3 className="education-degree">{edu.degree} in {edu.field}</h3>
                    <span className="education-year">{edu.year}</span>
                  </div>
                  <p className="education-institution">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutPage;
