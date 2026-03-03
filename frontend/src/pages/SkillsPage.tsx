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

  const groupedSkills = (() => {
    const source = context?.skills || [];
    const grouped = new Map<string, { category: string; items: string[] }>();

    source.forEach((skillGroup: any) => {
      const rawCategory = (skillGroup?.category || "").trim();
      const category = rawCategory || "Other";
      const categoryKey = category.toLowerCase();
      const existing = grouped.get(categoryKey);

      if (!existing) {
        grouped.set(categoryKey, { category, items: [] });
      }

      const bucket = grouped.get(categoryKey);
      if (!bucket) return;

      (skillGroup?.items || []).forEach((item: string) => {
        const cleaned = (item || "").trim();
        if (!cleaned) return;
        const hasItem = bucket.items.some((existingItem) => existingItem.toLowerCase() === cleaned.toLowerCase());
        if (!hasItem) {
          bucket.items.push(cleaned);
        }
      });
    });

    return Array.from(grouped.values());
  })();

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">🛠️ Technical Skills</h1>
        <div className="page-divider"></div>

        {groupedSkills.length > 0 ? (
          <div className="skills-grid">
            {groupedSkills.map((skillGroup, index: number) => (
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
