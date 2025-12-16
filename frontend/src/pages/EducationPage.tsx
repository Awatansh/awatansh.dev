import { useEffect, useState } from "react";
import { getContext } from "../utils/api";
import type { PortfolioContext } from "@portfolio/shared";

const EducationPage = () => {
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
        <h1 className="page-title">🎓 Education</h1>
        <div className="page-divider"></div>

        {context?.education && context.education.length > 0 ? (
          <div className="education-list">
            {context.education.map((edu: any, index: number) => (
              <div key={index} className="education-card">
                <h2 className="education-degree">{edu.degree} in {edu.field}</h2>
                <h3 className="education-institution">{edu.institution}</h3>
                <p className="education-year">Graduated: {edu.year}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No education information to display yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationPage;
