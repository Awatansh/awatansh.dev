import { useEffect, useState } from "react";
import { getContext } from "../utils/api";
import type { PortfolioContext } from "@portfolio/shared";

const ProjectsPage = () => {
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

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">💼 My Projects</h1>
        <div className="page-divider"></div>

        {context?.projects && context.projects.length > 0 ? (
          <div className="projects-grid">
            {context.projects.map((project: any) => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h2 className="project-title">{project.title}</h2>
                </div>
                
                <p className="project-description">{project.description}</p>
                
                <div className="project-tech">
                  {project.technologies.map((tech: string) => (
                    <span key={tech} className="tech-badge">{tech}</span>
                  ))}
                </div>
                
                {project.link && (
                  <div className="project-actions">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      View Project →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No projects to display yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
