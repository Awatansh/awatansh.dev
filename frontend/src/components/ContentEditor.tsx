import { useState, useEffect } from "react";
import { getContext, updateContext } from "../utils/api";
import type { PortfolioContext, Project, Experience, Education, Social } from "@portfolio/shared";

interface ContentEditorProps {
  onBack: () => void;
}

const ContentEditor = ({ onBack }: ContentEditorProps) => {
  const [context, setContext] = useState<PortfolioContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("projects");
  // Media upload functionality removed for Vercel compatibility

  useEffect(() => {
    loadContext();
  }, []);

  const loadContext = async () => {
    try {
      const data = await getContext();
      setContext(data);
    } catch (error) {
      console.error("Failed to load context:", error);
    } finally {
      setLoading(false);
    }
  };

  // Upload functions removed - using static files only

  const handleSave = async () => {
    if (!context) return;
    
    setSaving(true);
    try {
      await updateContext(context);
      alert("Content saved successfully!");
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const addProject = () => {
    if (!context) return;
    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: "New Project",
      description: "",
      technologies: []
    };
    setContext({ ...context, projects: [...context.projects, newProject] });
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    if (!context) return;
    const updated = [...context.projects];
    updated[index] = { ...updated[index], [field]: value };
    setContext({ ...context, projects: updated });
  };

  const deleteProject = (index: number) => {
    if (!context) return;
    if (!confirm("Delete this project?")) return;
    const updated = context.projects.filter((_, i) => i !== index);
    setContext({ ...context, projects: updated });
  };

  const addExperience = () => {
    if (!context) return;
    const newExp: Experience = {
      company: "Company Name",
      position: "Position",
      startDate: new Date().toISOString().split('T')[0],
      description: ""
    };
    setContext({ ...context, experience: [...context.experience, newExp] });
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    if (!context) return;
    const updated = [...context.experience];
    updated[index] = { ...updated[index], [field]: value };
    setContext({ ...context, experience: updated });
  };

  const deleteExperience = (index: number) => {
    if (!context) return;
    if (!confirm("Delete this experience?")) return;
    const updated = context.experience.filter((_, i) => i !== index);
    setContext({ ...context, experience: updated });
  };

  const addEducation = () => {
    if (!context) return;
    const newEdu: Education = {
      institution: "Institution",
      degree: "Degree",
      field: "Field of Study",
      year: new Date().getFullYear().toString()
    };
    setContext({ ...context, education: [...context.education, newEdu] });
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    if (!context) return;
    const updated = [...context.education];
    updated[index] = { ...updated[index], [field]: value };
    setContext({ ...context, education: updated });
  };

  const deleteEducation = (index: number) => {
    if (!context) return;
    if (!confirm("Delete this education entry?")) return;
    const updated = context.education.filter((_, i) => i !== index);
    setContext({ ...context, education: updated });
  };

  const addSocial = () => {
    if (!context) return;
    const newSocial: Social = {
      name: "Platform",
      url: "https://"
    };
    setContext({ ...context, socials: [...context.socials, newSocial] });
  };

  const updateSocial = (index: number, field: keyof Social, value: string) => {
    if (!context) return;
    const updated = [...context.socials];
    updated[index] = { ...updated[index], [field]: value };
    setContext({ ...context, socials: updated });
  };

  const deleteSocial = (index: number) => {
    if (!context) return;
    if (!confirm("Delete this social link?")) return;
    const updated = context.socials.filter((_, i) => i !== index);
    setContext({ ...context, socials: updated });
  };

  const updateSkillCategory = (index: number, value: string) => {
    if (!context) return;
    const updated = [...context.skills];
    updated[index] = { ...updated[index], category: value };
    setContext({ ...context, skills: updated });
  };

  const updateSkillItems = (index: number, value: string) => {
    if (!context) return;
    const updated = [...context.skills];
    updated[index] = { ...updated[index], items: value.split(',').map(s => s.trim()).filter(Boolean) };
    setContext({ ...context, skills: updated });
  };

  if (loading) {
    return (
      <div className="content-editor-loading">
        <div className="loading-spinner"></div>
        <p>Loading content...</p>
      </div>
    );
  }

  if (!context) return null;

  return (
    <div className="content-editor">
      <div className="editor-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h1>Edit Portfolio Content</h1>
        <button onClick={handleSave} disabled={saving} className="save-btn">
          {saving ? "Saving..." : "💾 Save Changes"}
        </button>
      </div>

      <div className="editor-nav">
        <button 
          className={activeSection === "about" ? "active" : ""}
          onClick={() => setActiveSection("about")}
        >
          👋 About
        </button>
        <button 
          className={activeSection === "projects" ? "active" : ""}
          onClick={() => setActiveSection("projects")}
        >
          🚀 Projects
        </button>
        <button 
          className={activeSection === "experience" ? "active" : ""}
          onClick={() => setActiveSection("experience")}
        >
          💼 Experience
        </button>
        <button 
          className={activeSection === "education" ? "active" : ""}
          onClick={() => setActiveSection("education")}
        >
          🎓 Education
        </button>
        <button 
          className={activeSection === "skills" ? "active" : ""}
          onClick={() => setActiveSection("skills")}
        >
          ⚡ Skills
        </button>
        <button 
          className={activeSection === "socials" ? "active" : ""}
          onClick={() => setActiveSection("socials")}
        >
          🔗 Socials
        </button>
        <button 
          className={activeSection === "media" ? "active" : ""}
          onClick={() => setActiveSection("media")}
        >
          🖼️ Media
        </button>
      </div>

      <div className="editor-content">
        {activeSection === "about" && (
          <div className="section-editor">
            <div className="section-header">
              <h2>About Section</h2>
            </div>
            <div className="edit-card">
              <div className="form-group">
                <label>Bio / Resume Text</label>
                <textarea 
                  value={context.resume || ""}
                  onChange={(e) => setContext({ ...context, resume: e.target.value })}
                  placeholder="Write your bio here..."
                  rows={6}
                />
              </div>
              <div className="form-group">
                <label>Tech Quote (Star Wars or tech-related)</label>
                <input 
                  value={context.quote || ""}
                  onChange={(e) => setContext({ ...context, quote: e.target.value })}
                  placeholder="I find your lack of bugs disturbing. — Darth Vader"
                />
              </div>
              <div className="form-group">
                <label>Resume Link (optional)</label>
                <input 
                  value={context.resumeLink || ""}
                  onChange={(e) => setContext({ ...context, resumeLink: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  type="url"
                />
              </div>
            </div>
          </div>
        )}
        
        {activeSection === "projects" && (
          <div className="section-editor">
            <div className="section-header">
              <h2>Projects</h2>
              <button onClick={addProject} className="add-btn">+ Add Project</button>
            </div>
            {context.projects.map((project, index) => (
              <div key={project.id} className="edit-card">
                <div className="card-header">
                  <h3>Project #{index + 1}</h3>
                  <button onClick={() => deleteProject(index)} className="delete-small-btn">🗑️</button>
                </div>
                <div className="form-group">
                  <label>Title</label>
                  <input 
                    value={project.title}
                    onChange={(e) => updateProject(index, "title", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    value={project.description}
                    onChange={(e) => updateProject(index, "description", e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="form-group">
                  <label>Link (optional)</label>
                  <input 
                    value={project.link || ""}
                    onChange={(e) => updateProject(index, "link", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="form-group">
                  <label>Technologies (comma-separated)</label>
                  <input 
                    value={project.technologies.join(", ")}
                    onChange={(e) => updateProject(index, "technologies", 
                      e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    )}
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === "experience" && (
          <div className="section-editor">
            <div className="section-header">
              <h2>Work Experience</h2>
              <button onClick={addExperience} className="add-btn">+ Add Experience</button>
            </div>
            {context.experience.map((exp, index) => (
              <div key={index} className="edit-card">
                <div className="card-header">
                  <h3>{exp.company}</h3>
                  <button onClick={() => deleteExperience(index)} className="delete-small-btn">🗑️</button>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Company</label>
                    <input 
                      value={exp.company}
                      onChange={(e) => updateExperience(index, "company", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Position</label>
                    <input 
                      value={exp.position}
                      onChange={(e) => updateExperience(index, "position", e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input 
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date (optional)</label>
                    <input 
                      type="date"
                      value={exp.endDate || ""}
                      onChange={(e) => updateExperience(index, "endDate", e.target.value || undefined)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    value={exp.description}
                    onChange={(e) => updateExperience(index, "description", e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === "education" && (
          <div className="section-editor">
            <div className="section-header">
              <h2>Education</h2>
              <button onClick={addEducation} className="add-btn">+ Add Education</button>
            </div>
            {context.education.map((edu, index) => (
              <div key={index} className="edit-card">
                <div className="card-header">
                  <h3>{edu.institution}</h3>
                  <button onClick={() => deleteEducation(index)} className="delete-small-btn">🗑️</button>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Institution</label>
                    <input 
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, "institution", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input 
                      value={edu.year}
                      onChange={(e) => updateEducation(index, "year", e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Degree</label>
                    <input 
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, "degree", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Field of Study</label>
                    <input 
                      value={edu.field}
                      onChange={(e) => updateEducation(index, "field", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === "skills" && (
          <div className="section-editor">
            <div className="section-header">
              <h2>Skills</h2>
            </div>
            {context.skills.map((skill, index) => (
              <div key={index} className="edit-card">
                <div className="form-group">
                  <label>Category</label>
                  <input 
                    value={skill.category}
                    onChange={(e) => updateSkillCategory(index, e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Skills (comma-separated)</label>
                  <input 
                    value={skill.items.join(", ")}
                    onChange={(e) => updateSkillItems(index, e.target.value)}
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === "socials" && (
          <div className="section-editor">
            <div className="section-header">
              <h2>Social Links</h2>
              <button onClick={addSocial} className="add-btn">+ Add Social</button>
            </div>
            {context.socials.map((social, index) => (
              <div key={index} className="edit-card">
                <div className="card-header">
                  <h3>{social.name}</h3>
                  <button onClick={() => deleteSocial(index)} className="delete-small-btn">🗑️</button>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Platform Name</label>
                    <input 
                      value={social.name}
                      onChange={(e) => updateSocial(index, "name", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>URL</label>
                    <input 
                      value={social.url}
                      onChange={(e) => updateSocial(index, "url", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === "media" && (
          <div className="section-editor">
            <div className="section-header">
              <h2>Media Upload Disabled</h2>
            </div>
            
            {/* Media upload disabled for Vercel deployment */}
            <div className="empty-state">
              <p>🚫 Media upload functionality disabled for Vercel deployment.</p>
              <p>Use static files in /frontend/public folder instead.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentEditor;
