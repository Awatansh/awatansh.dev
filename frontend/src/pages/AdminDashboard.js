import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getContactSubmissions, markAsRead, deleteSubmission, logout, getContext, updateContext } from "../utils/api";
const AdminDashboard = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState("inbox");
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [context, setContext] = useState(null);
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
            setSubmissions(data);
        }
        catch (error) {
            console.error("Failed to load submissions:", error);
            if (error.response?.status === 401) {
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminUser");
                navigate("/admin/login");
            }
        }
        finally {
            setLoading(false);
        }
    };
    const loadContext = async () => {
        try {
            const data = await getContext();
            console.log("[AdminDashboard] Context loaded:", data);
            setContext(data);
        }
        catch (error) {
            console.error("[AdminDashboard] Failed to load context:", error);
        }
    };
    const handleSave = async () => {
        if (!context)
            return;
        setSaving(true);
        try {
            await updateContext(context);
            alert("Content saved successfully!");
        }
        catch (error) {
            console.error("Failed to save:", error);
            alert("Failed to save changes. Please try again.");
        }
        finally {
            setSaving(false);
        }
    };
    // Project management
    const addProject = () => {
        if (!context)
            return;
        const newProject = {
            id: `project-${Date.now()}`,
            title: "New Project",
            description: "",
            technologies: [],
        };
        setContext({ ...context, projects: [...context.projects, newProject] });
    };
    const updateProject = (index, field, value) => {
        if (!context)
            return;
        const updated = [...context.projects];
        updated[index] = { ...updated[index], [field]: value };
        setContext({ ...context, projects: updated });
    };
    const deleteProject = (index) => {
        if (!context)
            return;
        setContext({ ...context, projects: context.projects.filter((_, i) => i !== index) });
    };
    // Experience management
    const addExperience = () => {
        if (!context)
            return;
        const newExp = {
            company: "New Company",
            position: "",
            startDate: "",
            description: "",
        };
        setContext({ ...context, experience: [...context.experience, newExp] });
    };
    const updateExperience = (index, field, value) => {
        if (!context)
            return;
        const updated = [...context.experience];
        updated[index] = { ...updated[index], [field]: value };
        setContext({ ...context, experience: updated });
    };
    const deleteExperience = (index) => {
        if (!context)
            return;
        setContext({ ...context, experience: context.experience.filter((_, i) => i !== index) });
    };
    // Education management
    const addEducation = () => {
        if (!context)
            return;
        const newEdu = {
            institution: "New Institution",
            degree: "",
            field: "",
            year: "",
        };
        setContext({ ...context, education: [...context.education, newEdu] });
    };
    const updateEducation = (index, field, value) => {
        if (!context)
            return;
        const updated = [...context.education];
        updated[index] = { ...updated[index], [field]: value };
        setContext({ ...context, education: updated });
    };
    const deleteEducation = (index) => {
        if (!context)
            return;
        setContext({ ...context, education: context.education.filter((_, i) => i !== index) });
    };
    // Skills management
    const updateSkillCategory = (index, value) => {
        if (!context)
            return;
        const updated = [...context.skills];
        updated[index] = { ...updated[index], category: value };
        setContext({ ...context, skills: updated });
    };
    const updateSkillItems = (index, value) => {
        if (!context)
            return;
        const updated = [...context.skills];
        updated[index] = { ...updated[index], items: value.split(",").map((s) => s.trim()) };
        setContext({ ...context, skills: updated });
    };
    // Socials management
    const addSocial = () => {
        if (!context)
            return;
        const newSocial = {
            name: "New Platform",
            url: "",
        };
        setContext({ ...context, socials: [...context.socials, newSocial] });
    };
    const updateSocial = (index, field, value) => {
        if (!context)
            return;
        const updated = [...context.socials];
        updated[index] = { ...updated[index], [field]: value };
        setContext({ ...context, socials: updated });
    };
    const deleteSocial = (index) => {
        if (!context)
            return;
        setContext({ ...context, socials: context.socials.filter((_, i) => i !== index) });
    };
    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            setSubmissions(submissions.map(s => s._id === id ? { ...s, read: true } : s));
            if (selectedMessage?._id === id) {
                setSelectedMessage({ ...selectedMessage, read: true });
            }
        }
        catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this message?"))
            return;
        try {
            await deleteSubmission(id);
            setSubmissions(submissions.filter(s => s._id !== id));
            if (selectedMessage?._id === id) {
                setSelectedMessage(null);
            }
        }
        catch (error) {
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
        }
        catch (error) {
            console.error("Logout error:", error);
        }
    };
    const unreadCount = submissions.filter(s => !s.read).length;
    const totalCount = submissions.length;
    if (loading || !context) {
        return (_jsxs("div", { className: "admin-loading", children: [_jsx("div", { className: "loading-spinner" }), _jsx("p", { children: "Loading dashboard..." })] }));
    }
    return (_jsxs("div", { className: "admin-dashboard-layout", children: [_jsxs("aside", { className: "admin-sidebar", children: [_jsxs("div", { className: "admin-brand", children: [_jsx("h2", { children: "\uD83D\uDCCA Admin Portal" }), _jsx("p", { className: "brand-subtitle", children: "Management Dashboard" })] }), _jsxs("nav", { className: "admin-nav", children: [_jsxs("button", { className: `nav-item ${activeSection === "inbox" ? "active" : ""}`, onClick: () => {
                                    setActiveSection("inbox");
                                    setSelectedMessage(null);
                                }, children: [_jsx("span", { className: "nav-icon", children: "\uD83D\uDCE8" }), _jsx("span", { className: "nav-label", children: "Inbox" }), unreadCount > 0 && _jsx("span", { className: "nav-badge", children: unreadCount })] }), _jsxs("button", { className: `nav-item ${activeSection === "about" ? "active" : ""}`, onClick: () => {
                                    console.log("[AdminDashboard] Switching to About section");
                                    setActiveSection("about");
                                }, children: [_jsx("span", { className: "nav-icon", children: "\uD83D\uDC4B" }), _jsx("span", { className: "nav-label", children: "About" })] }), _jsxs("button", { className: `nav-item ${activeSection === "projects" ? "active" : ""}`, onClick: () => {
                                    console.log("[AdminDashboard] Switching to Projects section");
                                    setActiveSection("projects");
                                }, children: [_jsx("span", { className: "nav-icon", children: "\uD83D\uDE80" }), _jsx("span", { className: "nav-label", children: "Projects" })] }), _jsxs("button", { className: `nav-item ${activeSection === "experience" ? "active" : ""}`, onClick: () => setActiveSection("experience"), children: [_jsx("span", { className: "nav-icon", children: "\uD83D\uDCBC" }), _jsx("span", { className: "nav-label", children: "Experience" })] }), _jsxs("button", { className: `nav-item ${activeSection === "education" ? "active" : ""}`, onClick: () => setActiveSection("education"), children: [_jsx("span", { className: "nav-icon", children: "\uD83C\uDF93" }), _jsx("span", { className: "nav-label", children: "Education" })] }), _jsxs("button", { className: `nav-item ${activeSection === "skills" ? "active" : ""}`, onClick: () => setActiveSection("skills"), children: [_jsx("span", { className: "nav-icon", children: "\u26A1" }), _jsx("span", { className: "nav-label", children: "Skills" })] }), _jsxs("button", { className: `nav-item ${activeSection === "socials" ? "active" : ""}`, onClick: () => setActiveSection("socials"), children: [_jsx("span", { className: "nav-icon", children: "\uD83D\uDD17" }), _jsx("span", { className: "nav-label", children: "Socials" })] })] }), _jsxs("div", { className: "admin-user", children: [_jsxs("div", { className: "user-info", children: [_jsx("div", { className: "user-avatar", children: adminUser.name?.charAt(0).toUpperCase() || "A" }), _jsxs("div", { className: "user-details", children: [_jsx("p", { className: "user-name", children: adminUser.name || "Admin" }), _jsx("p", { className: "user-email", children: adminUser.email })] })] }), _jsxs("button", { onClick: handleLogout, className: "logout-btn", title: "Logout", children: [_jsx("span", { className: "logout-icon", children: "\uD83D\uDEAA" }), _jsx("span", { className: "logout-text", children: "Logout" })] })] })] }), _jsxs("main", { className: "admin-main", children: [activeSection === "inbox" && (_jsxs("div", { className: "inbox-layout", children: [_jsxs("div", { className: "inbox-list", children: [_jsxs("div", { className: "inbox-header", children: [_jsx("h1", { children: "Messages" }), _jsxs("div", { className: "inbox-stats", children: [_jsxs("span", { className: "stat", children: [_jsx("strong", { children: unreadCount }), " unread"] }), _jsx("span", { className: "stat-divider", children: "\u2022" }), _jsxs("span", { className: "stat", children: [_jsx("strong", { children: totalCount }), " total"] })] })] }), submissions.length === 0 ? (_jsxs("div", { className: "empty-state", children: [_jsx("div", { className: "empty-icon", children: "\uD83D\uDCED" }), _jsx("h3", { children: "No messages yet" }), _jsx("p", { children: "Contact submissions will appear here" })] })) : (_jsx("div", { className: "message-list", children: submissions.map((submission) => (_jsx("div", { className: `message-item ${submission.read ? "read" : "unread"} ${selectedMessage?._id === submission._id ? "selected" : ""}`, onClick: () => {
                                                setSelectedMessage(submission);
                                                if (!submission.read) {
                                                    handleMarkAsRead(submission._id);
                                                }
                                            }, children: _jsxs("div", { className: "message-preview", children: [_jsxs("div", { className: "message-header-row", children: [_jsx("h3", { className: "message-name", children: submission.name }), !submission.read && _jsx("span", { className: "unread-dot" })] }), _jsx("p", { className: "message-designation", children: submission.designation }), _jsxs("p", { className: "message-excerpt", children: [submission.message.substring(0, 80), submission.message.length > 80 ? "..." : ""] }), _jsx("p", { className: "message-time", children: new Date(submission.createdAt).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        }) })] }) }, submission._id))) }))] }), _jsx("div", { className: "inbox-detail", children: selectedMessage ? (_jsxs("div", { className: "message-detail", children: [_jsxs("div", { className: "detail-header", children: [_jsxs("div", { className: "sender-info", children: [_jsx("div", { className: "sender-avatar", children: selectedMessage.name.charAt(0).toUpperCase() }), _jsxs("div", { children: [_jsx("h2", { children: selectedMessage.name }), _jsx("p", { className: "sender-designation", children: selectedMessage.designation })] })] }), _jsxs("div", { className: "message-meta", children: [_jsx("p", { className: "message-date", children: new Date(selectedMessage.createdAt).toLocaleString("en-US", {
                                                                weekday: "short",
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit"
                                                            }) }), _jsxs("div", { className: "message-actions", children: [selectedMessage.read && _jsx("span", { className: "read-badge", children: "\u2713 Read" }), _jsx("button", { onClick: () => handleDelete(selectedMessage._id), className: "delete-btn", title: "Delete message", children: "\uD83D\uDDD1\uFE0F Delete" })] })] })] }), _jsxs("div", { className: "detail-body", children: [_jsxs("div", { className: "message-content", children: [_jsx("h3", { children: "Message" }), _jsx("p", { children: selectedMessage.message })] }), _jsxs("div", { className: "contact-info", children: [_jsx("h3", { children: "Contact Information" }), _jsxs("div", { className: "contact-field", children: [_jsx("span", { className: "field-label", children: "Handle:" }), _jsx("span", { className: "field-value", children: selectedMessage.socialHandle })] })] })] })] })) : (_jsxs("div", { className: "empty-detail", children: [_jsx("div", { className: "empty-icon", children: "\u2709\uFE0F" }), _jsx("h3", { children: "Select a message" }), _jsx("p", { children: "Choose a message from the list to view its details" })] })) })] })), activeSection === "about" && (_jsxs("div", { className: "section-container", children: [_jsxs("div", { className: "section-header-bar", children: [_jsxs("div", { children: [_jsx("h1", { children: "\uD83D\uDC4B About Section" }), _jsx("p", { className: "section-subtitle", children: "Manage your bio and personal information" })] }), _jsx("button", { onClick: handleSave, className: "save-btn", disabled: saving, children: saving ? "Saving..." : "💾 Save Changes" })] }), _jsx("div", { className: "section-content", children: _jsxs("div", { className: "edit-card", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Bio / Resume Text" }), _jsx("textarea", { value: context.resume || "", onChange: (e) => setContext({ ...context, resume: e.target.value }), placeholder: "Write your bio here...", rows: 6 })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Tech Quote (Star Wars or tech-related)" }), _jsx("input", { value: context.quote || "", onChange: (e) => setContext({ ...context, quote: e.target.value }), placeholder: "I find your lack of bugs disturbing. \u2014 Darth Vader" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Resume Link (optional)" }), _jsx("input", { value: context.resumeLink || "", onChange: (e) => setContext({ ...context, resumeLink: e.target.value }), placeholder: "https://drive.google.com/...", type: "url" })] })] }) })] })), activeSection === "projects" && (_jsxs("div", { className: "section-container", children: [_jsxs("div", { className: "section-header-bar", children: [_jsxs("div", { children: [_jsx("h1", { children: "\uD83D\uDE80 Projects" }), _jsx("p", { className: "section-subtitle", children: "Manage your project portfolio" })] }), _jsxs("div", { className: "header-actions", children: [_jsx("button", { onClick: addProject, className: "add-btn-secondary", children: "+ Add Project" }), _jsx("button", { onClick: handleSave, className: "save-btn", disabled: saving, children: saving ? "Saving..." : "💾 Save Changes" })] })] }), _jsx("div", { className: "section-content", children: context.projects.map((project, index) => (_jsxs("div", { className: "edit-card", children: [_jsxs("div", { className: "card-header", children: [_jsx("h3", { children: project.title }), _jsx("button", { onClick: () => deleteProject(index), className: "delete-small-btn", children: "\uD83D\uDDD1\uFE0F" })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Project Title" }), _jsx("input", { value: project.title, onChange: (e) => updateProject(index, "title", e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Link (optional)" }), _jsx("input", { value: project.link || "", onChange: (e) => updateProject(index, "link", e.target.value), placeholder: "https://..." })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Description" }), _jsx("textarea", { value: project.description, onChange: (e) => updateProject(index, "description", e.target.value), rows: 3 })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Technologies (comma-separated)" }), _jsx("input", { value: project.technologies.join(", "), onChange: (e) => updateProject(index, "technologies", e.target.value.split(",").map(s => s.trim())), placeholder: "React, TypeScript, Node.js" })] })] }, project.id))) })] })), activeSection === "experience" && (_jsxs("div", { className: "section-container", children: [_jsxs("div", { className: "section-header-bar", children: [_jsxs("div", { children: [_jsx("h1", { children: "\uD83D\uDCBC Experience" }), _jsx("p", { className: "section-subtitle", children: "Manage work experience" })] }), _jsxs("div", { className: "header-actions", children: [_jsx("button", { onClick: addExperience, className: "add-btn-secondary", children: "+ Add Experience" }), _jsx("button", { onClick: handleSave, className: "save-btn", disabled: saving, children: saving ? "Saving..." : "💾 Save Changes" })] })] }), _jsx("div", { className: "section-content", children: context.experience.map((exp, index) => (_jsxs("div", { className: "edit-card", children: [_jsxs("div", { className: "card-header", children: [_jsx("h3", { children: exp.company }), _jsx("button", { onClick: () => deleteExperience(index), className: "delete-small-btn", children: "\uD83D\uDDD1\uFE0F" })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Company" }), _jsx("input", { value: exp.company, onChange: (e) => updateExperience(index, "company", e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Position" }), _jsx("input", { value: exp.position, onChange: (e) => updateExperience(index, "position", e.target.value) })] })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Start Date" }), _jsx("input", { value: exp.startDate, onChange: (e) => updateExperience(index, "startDate", e.target.value), placeholder: "Jan 2023" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "End Date (optional)" }), _jsx("input", { value: exp.endDate || "", onChange: (e) => updateExperience(index, "endDate", e.target.value), placeholder: "Present" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Description" }), _jsx("textarea", { value: exp.description, onChange: (e) => updateExperience(index, "description", e.target.value), rows: 3 })] })] }, index))) })] })), activeSection === "education" && (_jsxs("div", { className: "section-container", children: [_jsxs("div", { className: "section-header-bar", children: [_jsxs("div", { children: [_jsx("h1", { children: "\uD83C\uDF93 Education" }), _jsx("p", { className: "section-subtitle", children: "Manage educational background" })] }), _jsxs("div", { className: "header-actions", children: [_jsx("button", { onClick: addEducation, className: "add-btn-secondary", children: "+ Add Education" }), _jsx("button", { onClick: handleSave, className: "save-btn", disabled: saving, children: saving ? "Saving..." : "💾 Save Changes" })] })] }), _jsx("div", { className: "section-content", children: context.education.map((edu, index) => (_jsxs("div", { className: "edit-card", children: [_jsxs("div", { className: "card-header", children: [_jsx("h3", { children: edu.institution }), _jsx("button", { onClick: () => deleteEducation(index), className: "delete-small-btn", children: "\uD83D\uDDD1\uFE0F" })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Institution" }), _jsx("input", { value: edu.institution, onChange: (e) => updateEducation(index, "institution", e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Year" }), _jsx("input", { value: edu.year, onChange: (e) => updateEducation(index, "year", e.target.value), placeholder: "2020-2024" })] })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Degree" }), _jsx("input", { value: edu.degree, onChange: (e) => updateEducation(index, "degree", e.target.value), placeholder: "Bachelor of Science" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Field of Study" }), _jsx("input", { value: edu.field, onChange: (e) => updateEducation(index, "field", e.target.value), placeholder: "Computer Science" })] })] })] }, index))) })] })), activeSection === "skills" && (_jsxs("div", { className: "section-container", children: [_jsxs("div", { className: "section-header-bar", children: [_jsxs("div", { children: [_jsx("h1", { children: "\u26A1 Skills" }), _jsx("p", { className: "section-subtitle", children: "Manage your technical skills" })] }), _jsx("button", { onClick: handleSave, className: "save-btn", disabled: saving, children: saving ? "Saving..." : "💾 Save Changes" })] }), _jsx("div", { className: "section-content", children: context.skills.map((skill, index) => (_jsxs("div", { className: "edit-card", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Category" }), _jsx("input", { value: skill.category, onChange: (e) => updateSkillCategory(index, e.target.value), placeholder: "Languages" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Skills (comma-separated)" }), _jsx("input", { value: skill.items.join(", "), onChange: (e) => updateSkillItems(index, e.target.value), placeholder: "JavaScript, Python, TypeScript" })] })] }, index))) })] })), activeSection === "socials" && (_jsxs("div", { className: "section-container", children: [_jsxs("div", { className: "section-header-bar", children: [_jsxs("div", { children: [_jsx("h1", { children: "\uD83D\uDD17 Social Links" }), _jsx("p", { className: "section-subtitle", children: "Manage social media profiles" })] }), _jsxs("div", { className: "header-actions", children: [_jsx("button", { onClick: addSocial, className: "add-btn-secondary", children: "+ Add Social" }), _jsx("button", { onClick: handleSave, className: "save-btn", disabled: saving, children: saving ? "Saving..." : "💾 Save Changes" })] })] }), _jsx("div", { className: "section-content", children: context.socials.map((social, index) => (_jsxs("div", { className: "edit-card", children: [_jsxs("div", { className: "card-header", children: [_jsx("h3", { children: social.name }), _jsx("button", { onClick: () => deleteSocial(index), className: "delete-small-btn", children: "\uD83D\uDDD1\uFE0F" })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Platform Name" }), _jsx("input", { value: social.name, onChange: (e) => updateSocial(index, "name", e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "URL" }), _jsx("input", { value: social.url, onChange: (e) => updateSocial(index, "url", e.target.value), placeholder: "https://..." })] })] })] }, index))) })] }))] })] }));
};
export default AdminDashboard;
