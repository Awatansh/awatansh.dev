import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { getContext, updateContext } from "../utils/api";
const ContentEditor = ({ onBack }) => {
    const [context, setContext] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState("projects");
    // Media upload functionality removed for Vercel compatibility
    useEffect(() => {
        loadContext();
    }, []);
    const loadContext = async () => {
        try {
            const data = await getContext();
            setContext(data);
        }
        catch (error) {
            console.error("Failed to load context:", error);
        }
        finally {
            setLoading(false);
        }
    };
    // Upload functions removed - using static files only
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
    const addProject = () => {
        if (!context)
            return;
        const newProject = {
            id: `project-${Date.now()}`,
            title: "New Project",
            description: "",
            technologies: []
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
        if (!confirm("Delete this project?"))
            return;
        const updated = context.projects.filter((_, i) => i !== index);
        setContext({ ...context, projects: updated });
    };
    const addExperience = () => {
        if (!context)
            return;
        const newExp = {
            company: "Company Name",
            position: "Position",
            startDate: new Date().toISOString().split('T')[0],
            description: ""
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
        if (!confirm("Delete this experience?"))
            return;
        const updated = context.experience.filter((_, i) => i !== index);
        setContext({ ...context, experience: updated });
    };
    const addEducation = () => {
        if (!context)
            return;
        const newEdu = {
            institution: "Institution",
            degree: "Degree",
            field: "Field of Study",
            year: new Date().getFullYear().toString()
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
        if (!confirm("Delete this education entry?"))
            return;
        const updated = context.education.filter((_, i) => i !== index);
        setContext({ ...context, education: updated });
    };
    const addSocial = () => {
        if (!context)
            return;
        const newSocial = {
            name: "Platform",
            url: "https://"
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
        if (!confirm("Delete this social link?"))
            return;
        const updated = context.socials.filter((_, i) => i !== index);
        setContext({ ...context, socials: updated });
    };
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
        updated[index] = { ...updated[index], items: value.split(',').map(s => s.trim()).filter(Boolean) };
        setContext({ ...context, skills: updated });
    };
    if (loading) {
        return (_jsxs("div", { className: "content-editor-loading", children: [_jsx("div", { className: "loading-spinner" }), _jsx("p", { children: "Loading content..." })] }));
    }
    if (!context)
        return null;
    return (_jsxs("div", { className: "content-editor", children: [_jsxs("div", { className: "editor-header", children: [_jsx("button", { onClick: onBack, className: "back-btn", children: "\u2190 Back" }), _jsx("h1", { children: "Edit Portfolio Content" }), _jsx("button", { onClick: handleSave, disabled: saving, className: "save-btn", children: saving ? "Saving..." : "💾 Save Changes" })] }), _jsxs("div", { className: "editor-nav", children: [_jsx("button", { className: activeSection === "about" ? "active" : "", onClick: () => setActiveSection("about"), children: "\uD83D\uDC4B About" }), _jsx("button", { className: activeSection === "projects" ? "active" : "", onClick: () => setActiveSection("projects"), children: "\uD83D\uDE80 Projects" }), _jsx("button", { className: activeSection === "experience" ? "active" : "", onClick: () => setActiveSection("experience"), children: "\uD83D\uDCBC Experience" }), _jsx("button", { className: activeSection === "education" ? "active" : "", onClick: () => setActiveSection("education"), children: "\uD83C\uDF93 Education" }), _jsx("button", { className: activeSection === "skills" ? "active" : "", onClick: () => setActiveSection("skills"), children: "\u26A1 Skills" }), _jsx("button", { className: activeSection === "socials" ? "active" : "", onClick: () => setActiveSection("socials"), children: "\uD83D\uDD17 Socials" }), _jsx("button", { className: activeSection === "media" ? "active" : "", onClick: () => setActiveSection("media"), children: "\uD83D\uDDBC\uFE0F Media" })] }), _jsxs("div", { className: "editor-content", children: [activeSection === "about" && (_jsxs("div", { className: "section-editor", children: [_jsx("div", { className: "section-header", children: _jsx("h2", { children: "About Section" }) }), _jsxs("div", { className: "edit-card", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Bio / Resume Text" }), _jsx("textarea", { value: context.resume || "", onChange: (e) => setContext({ ...context, resume: e.target.value }), placeholder: "Write your bio here...", rows: 6 })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Tech Quote (Star Wars or tech-related)" }), _jsx("input", { value: context.quote || "", onChange: (e) => setContext({ ...context, quote: e.target.value }), placeholder: "I find your lack of bugs disturbing. \u2014 Darth Vader" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Resume Link (optional)" }), _jsx("input", { value: context.resumeLink || "", onChange: (e) => setContext({ ...context, resumeLink: e.target.value }), placeholder: "https://drive.google.com/...", type: "url" })] })] })] })), activeSection === "projects" && (_jsxs("div", { className: "section-editor", children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { children: "Projects" }), _jsx("button", { onClick: addProject, className: "add-btn", children: "+ Add Project" })] }), context.projects.map((project, index) => (_jsxs("div", { className: "edit-card", children: [_jsxs("div", { className: "card-header", children: [_jsxs("h3", { children: ["Project #", index + 1] }), _jsx("button", { onClick: () => deleteProject(index), className: "delete-small-btn", children: "\uD83D\uDDD1\uFE0F" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Title" }), _jsx("input", { value: project.title, onChange: (e) => updateProject(index, "title", e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Description" }), _jsx("textarea", { value: project.description, onChange: (e) => updateProject(index, "description", e.target.value), rows: 4 })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Link (optional)" }), _jsx("input", { value: project.link || "", onChange: (e) => updateProject(index, "link", e.target.value), placeholder: "https://..." })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Technologies (comma-separated)" }), _jsx("input", { value: project.technologies.join(", "), onChange: (e) => updateProject(index, "technologies", e.target.value.split(',').map(s => s.trim()).filter(Boolean)), placeholder: "React, Node.js, MongoDB" })] })] }, project.id)))] })), activeSection === "experience" && (_jsxs("div", { className: "section-editor", children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { children: "Work Experience" }), _jsx("button", { onClick: addExperience, className: "add-btn", children: "+ Add Experience" })] }), context.experience.map((exp, index) => (_jsxs("div", { className: "edit-card", children: [_jsxs("div", { className: "card-header", children: [_jsx("h3", { children: exp.company }), _jsx("button", { onClick: () => deleteExperience(index), className: "delete-small-btn", children: "\uD83D\uDDD1\uFE0F" })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Company" }), _jsx("input", { value: exp.company, onChange: (e) => updateExperience(index, "company", e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Position" }), _jsx("input", { value: exp.position, onChange: (e) => updateExperience(index, "position", e.target.value) })] })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Start Date" }), _jsx("input", { type: "date", value: exp.startDate, onChange: (e) => updateExperience(index, "startDate", e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "End Date (optional)" }), _jsx("input", { type: "date", value: exp.endDate || "", onChange: (e) => updateExperience(index, "endDate", e.target.value || undefined) })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Description" }), _jsx("textarea", { value: exp.description, onChange: (e) => updateExperience(index, "description", e.target.value), rows: 4 })] })] }, index)))] })), activeSection === "education" && (_jsxs("div", { className: "section-editor", children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { children: "Education" }), _jsx("button", { onClick: addEducation, className: "add-btn", children: "+ Add Education" })] }), context.education.map((edu, index) => (_jsxs("div", { className: "edit-card", children: [_jsxs("div", { className: "card-header", children: [_jsx("h3", { children: edu.institution }), _jsx("button", { onClick: () => deleteEducation(index), className: "delete-small-btn", children: "\uD83D\uDDD1\uFE0F" })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Institution" }), _jsx("input", { value: edu.institution, onChange: (e) => updateEducation(index, "institution", e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Year" }), _jsx("input", { value: edu.year, onChange: (e) => updateEducation(index, "year", e.target.value) })] })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Degree" }), _jsx("input", { value: edu.degree, onChange: (e) => updateEducation(index, "degree", e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Field of Study" }), _jsx("input", { value: edu.field, onChange: (e) => updateEducation(index, "field", e.target.value) })] })] })] }, index)))] })), activeSection === "skills" && (_jsxs("div", { className: "section-editor", children: [_jsx("div", { className: "section-header", children: _jsx("h2", { children: "Skills" }) }), context.skills.map((skill, index) => (_jsxs("div", { className: "edit-card", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Category" }), _jsx("input", { value: skill.category, onChange: (e) => updateSkillCategory(index, e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Skills (comma-separated)" }), _jsx("input", { value: skill.items.join(", "), onChange: (e) => updateSkillItems(index, e.target.value), placeholder: "React, Node.js, MongoDB" })] })] }, index)))] })), activeSection === "socials" && (_jsxs("div", { className: "section-editor", children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { children: "Social Links" }), _jsx("button", { onClick: addSocial, className: "add-btn", children: "+ Add Social" })] }), context.socials.map((social, index) => (_jsxs("div", { className: "edit-card", children: [_jsxs("div", { className: "card-header", children: [_jsx("h3", { children: social.name }), _jsx("button", { onClick: () => deleteSocial(index), className: "delete-small-btn", children: "\uD83D\uDDD1\uFE0F" })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Platform Name" }), _jsx("input", { value: social.name, onChange: (e) => updateSocial(index, "name", e.target.value) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "URL" }), _jsx("input", { value: social.url, onChange: (e) => updateSocial(index, "url", e.target.value), placeholder: "https://..." })] })] })] }, index)))] })), activeSection === "media" && (_jsxs("div", { className: "section-editor", children: [_jsx("div", { className: "section-header", children: _jsx("h2", { children: "Media Upload Disabled" }) }), _jsxs("div", { className: "empty-state", children: [_jsx("p", { children: "\uD83D\uDEAB Media upload functionality disabled for Vercel deployment." }), _jsx("p", { children: "Use static files in /frontend/public folder instead." })] })] }))] })] }));
};
export default ContentEditor;
