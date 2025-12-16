import { useEffect, useState } from "react";
import { getContext } from "../utils/api";
import type { PortfolioContext } from "@portfolio/shared";

const ExperiencePage = () => {
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
        <h1 className="page-title">💼 Work Experience</h1>
        <div className="page-divider"></div>

        {context?.experience && context.experience.length > 0 ? (
          <div className="timeline">
            {context.experience.map((exp: any, index: number) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h2 className="experience-position">{exp.position}</h2>
                  <h3 className="experience-company">@ {exp.company}</h3>
                  <p className="experience-date">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </p>
                  <p className="experience-description">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No experience to display yet.</p>
          </div>
        )}

        {context?.education && context.education.length > 0 && (
          <>
            <div className="section-divider"></div>
            <h1 className="page-title">🎓 Education</h1>
            <div className="page-divider"></div>
            <div className="education-list">
              {context.education.map((edu: any, index: number) => (
                <div key={index} className="education-item">
                  <div className="education-header">
                    <h3 className="education-degree">{edu.degree} in {edu.field}</h3>
                    <span className="education-year">{edu.year}</span>
                  </div>
                  <p className="education-institution">{edu.institution}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExperiencePage;
