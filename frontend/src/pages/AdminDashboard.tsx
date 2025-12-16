import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getContactSubmissions, 
  markAsRead, 
  deleteSubmission, 
  logout,
  getContext,
  updateContext
} from "../utils/api";
import type { PortfolioContext, Project, Experience, Education, Social } from "@portfolio/shared";

interface ContactSubmission {
  _id: string;
  name: string;
  designation: string;
  message: string;
  socialHandle: string;
  read?: boolean;
  createdAt: string;
}

type AdminSection = "inbox" | "about" | "projects" | "experience" | "education" | "skills" | "socials";

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<AdminSection>("inbox");
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null);
  const [context, setContext] = useState<PortfolioContext | null>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  useEffect(() => {
    console.log("[AdminDashboard] Component mounted, activeSection:", activeSection);
    loadSubmissions();
    loadContext();
  }, []);

  const loadSubmissions = async () => {
    try {
      const data = await getContactSubmissions();
      setSubmissions(data as any);
    } catch (error) {
      console.error("Failed to load submissions:", error);
      if ((error as any).response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadContext = async () => {
    try {
      const data = await getContext();
      console.log("[AdminDashboard] Context loaded:", data);
      setContext(data);
    } catch (error) {
      console.error("[AdminDashboard] Failed to load context:", error);
    }
  };

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

  // Project management
  const addProject = () => {
    if (!context) return;
    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: "New Project",
      description: "",
      technologies: [],
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
    setContext({ ...context, projects: context.projects.filter((_, i) => i !== index) });
  };

  // Experience management
  const addExperience = () => {
    if (!context) return;
    const newExp: Experience = {
      company: "New Company",
      position: "",
      startDate: "",
      description: "",
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
    setContext({ ...context, experience: context.experience.filter((_, i) => i !== index) });
  };

  // Education management
  const addEducation = () => {
    if (!context) return;
    const newEdu: Education = {
      institution: "New Institution",
      degree: "",
      field: "",
      year: "",
    };
    setContext({ ...context, education: [...context.education, newEdu] });
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    if (!context) return;
    const updated = [...context.education];
    updated[index] = { ...updated[index], [field]: value };
    setContext({ ...context, education: updated });
  };

  const deleteEducation = (index: number) => {
    if (!context) return;
    setContext({ ...context, education: context.education.filter((_, i) => i !== index) });
  };

  // Skills management
  const updateSkillCategory = (index: number, value: string) => {
    if (!context) return;
    const updated = [...context.skills];
    updated[index] = { ...updated[index], category: value };
    setContext({ ...context, skills: updated });
  };

  const updateSkillItems = (index: number, value: string) => {
    if (!context) return;
    const updated = [...context.skills];
    updated[index] = { ...updated[index], items: value.split(",").map((s) => s.trim()) };
    setContext({ ...context, skills: updated });
  };

  // Socials management
  const addSocial = () => {
    if (!context) return;
    const newSocial: Social = {
      name: "New Platform",
      url: "",
    };
    setContext({ ...context, socials: [...context.socials, newSocial] });
  };

  const updateSocial = (index: number, field: keyof Social, value: any) => {
    if (!context) return;
    const updated = [...context.socials];
    updated[index] = { ...updated[index], [field]: value };
    setContext({ ...context, socials: updated });
  };

  const deleteSocial = (index: number) => {
    if (!context) return;
    setContext({ ...context, socials: context.socials.filter((_, i) => i !== index) });
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setSubmissions(submissions.map(s => 
        s._id === id ? { ...s, read: true } : s
      ));
      if (selectedMessage?._id === id) {
        setSelectedMessage({ ...selectedMessage, read: true });
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      await deleteSubmission(id);
      setSubmissions(submissions.filter(s => s._id !== id));
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
      alert("Failed to delete message. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const unreadCount = submissions.filter(s => !s.read).length;
  const totalCount = submissions.length;

  if (loading || !context) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>📊 Admin Portal</h2>
          <p className="brand-subtitle">Management Dashboard</p>
        </div>

        <nav className="admin-nav">
          <button
            className={`nav-item ${activeSection === "inbox" ? "active" : ""}`}
            onClick={() => {
              setActiveSection("inbox");
              setSelectedMessage(null);
            }}
          >
            <span className="nav-icon">📨</span>
            <span className="nav-label">Inbox</span>
            {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
          </button>

          <button
            className={`nav-item ${activeSection === "about" ? "active" : ""}`}
            onClick={() => {
              console.log("[AdminDashboard] Switching to About section");
              setActiveSection("about");
            }}
          >
            <span className="nav-icon">👋</span>
            <span className="nav-label">About</span>
          </button>
          
          <button
            className={`nav-item ${activeSection === "projects" ? "active" : ""}`}
            onClick={() => {
              console.log("[AdminDashboard] Switching to Projects section");
              setActiveSection("projects");
            }}
          >
            <span className="nav-icon">🚀</span>
            <span className="nav-label">Projects</span>
          </button>

          <button
            className={`nav-item ${activeSection === "experience" ? "active" : ""}`}
            onClick={() => setActiveSection("experience")}
          >
            <span className="nav-icon">💼</span>
            <span className="nav-label">Experience</span>
          </button>

          <button
            className={`nav-item ${activeSection === "education" ? "active" : ""}`}
            onClick={() => setActiveSection("education")}
          >
            <span className="nav-icon">🎓</span>
            <span className="nav-label">Education</span>
          </button>

          <button
            className={`nav-item ${activeSection === "skills" ? "active" : ""}`}
            onClick={() => setActiveSection("skills")}
          >
            <span className="nav-icon">⚡</span>
            <span className="nav-label">Skills</span>
          </button>

          <button
            className={`nav-item ${activeSection === "socials" ? "active" : ""}`}
            onClick={() => setActiveSection("socials")}
          >
            <span className="nav-icon">🔗</span>
            <span className="nav-label">Socials</span>
          </button>
        </nav>

        <div className="admin-user">
          <div className="user-info">
            <div className="user-avatar">
              {adminUser.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="user-details">
              <p className="user-name">{adminUser.name || "Admin"}</p>
              <p className="user-email">{adminUser.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn" title="Logout">
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {activeSection === "inbox" && (
          <div className="inbox-layout">
            {/* Inbox List */}
            <div className="inbox-list">
              <div className="inbox-header">
                <h1>Messages</h1>
                <div className="inbox-stats">
                  <span className="stat">
                    <strong>{unreadCount}</strong> unread
                  </span>
                  <span className="stat-divider">•</span>
                  <span className="stat">
                    <strong>{totalCount}</strong> total
                  </span>
                </div>
              </div>

              {submissions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>No messages yet</h3>
                  <p>Contact submissions will appear here</p>
                </div>
              ) : (
                <div className="message-list">
                  {submissions.map((submission) => (
                    <div
                      key={submission._id}
                      className={`message-item ${submission.read ? "read" : "unread"} ${
                        selectedMessage?._id === submission._id ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedMessage(submission);
                        if (!submission.read) {
                          handleMarkAsRead(submission._id);
                        }
                      }}
                    >
                      <div className="message-preview">
                        <div className="message-header-row">
                          <h3 className="message-name">{submission.name}</h3>
                          {!submission.read && <span className="unread-dot"></span>}
                        </div>
                        <p className="message-designation">{submission.designation}</p>
                        <p className="message-excerpt">
                          {submission.message.substring(0, 80)}
                          {submission.message.length > 80 ? "..." : ""}
                        </p>
                        <p className="message-time">
                          {new Date(submission.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message Detail View */}
            <div className="inbox-detail">
              {selectedMessage ? (
                <div className="message-detail">
                  <div className="detail-header">
                    <div className="sender-info">
                      <div className="sender-avatar">
                        {selectedMessage.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2>{selectedMessage.name}</h2>
                        <p className="sender-designation">{selectedMessage.designation}</p>
                      </div>
                    </div>
                    <div className="message-meta">
                      <p className="message-date">
                        {new Date(selectedMessage.createdAt).toLocaleString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                      <div className="message-actions">
                        {selectedMessage.read && <span className="read-badge">✓ Read</span>}
                        <button 
                          onClick={() => handleDelete(selectedMessage._id)}
                          className="delete-btn"
                          title="Delete message"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="detail-body">
                    <div className="message-content">
                      <h3>Message</h3>
                      <p>{selectedMessage.message}</p>
                    </div>

                    <div className="contact-info">
                      <h3>Contact Information</h3>
                      <div className="contact-field">
                        <span className="field-label">Handle:</span>
                        <span className="field-value">{selectedMessage.socialHandle}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-detail">
                  <div className="empty-icon">✉️</div>
                  <h3>Select a message</h3>
                  <p>Choose a message from the list to view its details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === "about" && (
          <div className="section-container">
            <div className="section-header-bar">
              <div>
                <h1>👋 About Section</h1>
                <p className="section-subtitle">Manage your bio and personal information</p>
              </div>
              <button onClick={handleSave} className="save-btn" disabled={saving}>
                {saving ? "Saving..." : "💾 Save Changes"}
              </button>
            </div>

            <div className="section-content">
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
          </div>
        )}

        {activeSection === "projects" && (
          <div className="section-container">
            <div className="section-header-bar">
              <div>
                <h1>🚀 Projects</h1>
                <p className="section-subtitle">Manage your project portfolio</p>
              </div>
              <div className="header-actions">
                <button onClick={addProject} className="add-btn-secondary">+ Add Project</button>
                <button onClick={handleSave} className="save-btn" disabled={saving}>
                  {saving ? "Saving..." : "💾 Save Changes"}
                </button>
              </div>
            </div>

            <div className="section-content">
              {context.projects.map((project, index) => (
                <div key={project.id} className="edit-card">
                  <div className="card-header">
                    <h3>{project.title}</h3>
                    <button onClick={() => deleteProject(index)} className="delete-small-btn">🗑️</button>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Project Title</label>
                      <input 
                        value={project.title}
                        onChange={(e) => updateProject(index, "title", e.target.value)}
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
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      value={project.description}
                      onChange={(e) => updateProject(index, "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="form-group">
                    <label>Technologies (comma-separated)</label>
                    <input 
                      value={project.technologies.join(", ")}
                      onChange={(e) => updateProject(index, "technologies", e.target.value.split(",").map(s => s.trim()))}
                      placeholder="React, TypeScript, Node.js"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "experience" && (
          <div className="section-container">
            <div className="section-header-bar">
              <div>
                <h1>💼 Experience</h1>
                <p className="section-subtitle">Manage work experience</p>
              </div>
              <div className="header-actions">
                <button onClick={addExperience} className="add-btn-secondary">+ Add Experience</button>
                <button onClick={handleSave} className="save-btn" disabled={saving}>
                  {saving ? "Saving..." : "💾 Save Changes"}
                </button>
              </div>
            </div>

            <div className="section-content">
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
                        value={exp.startDate}
                        onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                        placeholder="Jan 2023"
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date (optional)</label>
                      <input 
                        value={exp.endDate || ""}
                        onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                        placeholder="Present"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      value={exp.description}
                      onChange={(e) => updateExperience(index, "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "education" && (
          <div className="section-container">
            <div className="section-header-bar">
              <div>
                <h1>🎓 Education</h1>
                <p className="section-subtitle">Manage educational background</p>
              </div>
              <div className="header-actions">
                <button onClick={addEducation} className="add-btn-secondary">+ Add Education</button>
                <button onClick={handleSave} className="save-btn" disabled={saving}>
                  {saving ? "Saving..." : "💾 Save Changes"}
                </button>
              </div>
            </div>

            <div className="section-content">
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
                        placeholder="2020-2024"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Degree</label>
                      <input 
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, "degree", e.target.value)}
                        placeholder="Bachelor of Science"
                      />
                    </div>
                    <div className="form-group">
                      <label>Field of Study</label>
                      <input 
                        value={edu.field}
                        onChange={(e) => updateEducation(index, "field", e.target.value)}
                        placeholder="Computer Science"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "skills" && (
          <div className="section-container">
            <div className="section-header-bar">
              <div>
                <h1>⚡ Skills</h1>
                <p className="section-subtitle">Manage your technical skills</p>
              </div>
              <button onClick={handleSave} className="save-btn" disabled={saving}>
                {saving ? "Saving..." : "💾 Save Changes"}
              </button>
            </div>

            <div className="section-content">
              {context.skills.map((skill, index) => (
                <div key={index} className="edit-card">
                  <div className="form-group">
                    <label>Category</label>
                    <input 
                      value={skill.category}
                      onChange={(e) => updateSkillCategory(index, e.target.value)}
                      placeholder="Languages"
                    />
                  </div>
                  <div className="form-group">
                    <label>Skills (comma-separated)</label>
                    <input 
                      value={skill.items.join(", ")}
                      onChange={(e) => updateSkillItems(index, e.target.value)}
                      placeholder="JavaScript, Python, TypeScript"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "socials" && (
          <div className="section-container">
            <div className="section-header-bar">
              <div>
                <h1>🔗 Social Links</h1>
                <p className="section-subtitle">Manage social media profiles</p>
              </div>
              <div className="header-actions">
                <button onClick={addSocial} className="add-btn-secondary">+ Add Social</button>
                <button onClick={handleSave} className="save-btn" disabled={saving}>
                  {saving ? "Saving..." : "💾 Save Changes"}
                </button>
              </div>
            </div>

            <div className="section-content">
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
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
