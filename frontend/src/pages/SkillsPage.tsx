import { useEffect, useState } from "react";
import { getContext } from "../utils/api";
import type { PortfolioContext } from "@portfolio/shared";

const SkillsPage = () => {
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
        <h1 className="page-title">🛠️ Technical Skills</h1>
        <div className="page-divider"></div>

        {context?.skills && context.skills.length > 0 ? (
          <div className="skills-grid">
            {context.skills.map((skillGroup: any, index: number) => (
              <div key={index} className="skill-category">
                <h2 className="skill-category-title">{skillGroup.category}</h2>
                <div className="skill-tags">
                  {skillGroup.items.map((skill: string) => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No skills to display yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsPage;
