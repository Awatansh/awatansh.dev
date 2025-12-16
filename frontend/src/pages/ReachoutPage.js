import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { submitContact } from "../utils/api";
const ReachoutPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        message: "",
        socialHandle: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage("");
        try {
            const result = await submitContact(formData);
            setSubmitMessage(result.message || "Message sent successfully!");
            setFormData({ name: "", designation: "", message: "", socialHandle: "" });
        }
        catch (error) {
            setSubmitMessage("Failed to send message. Please try again.");
            console.error(error);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx("div", { className: "page-container", children: _jsxs("div", { className: "page-content", children: [_jsx("h1", { className: "page-title", children: "\u2709\uFE0F Reach Out" }), _jsx("div", { className: "page-divider" }), _jsx("div", { className: "content-section", children: _jsx("p", { className: "section-description", children: "Have a question, project idea, or just want to connect? Fill out the form below and I'll get back to you as soon as possible!" }) }), _jsxs("form", { onSubmit: handleSubmit, className: "reachout-form", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "name", className: "form-label", children: "Your Name *" }), _jsx("input", { type: "text", id: "name", name: "name", value: formData.name, onChange: handleChange, required: true, className: "form-input", placeholder: "John Doe" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "designation", className: "form-label", children: "Your Role/Title *" }), _jsx("input", { type: "text", id: "designation", name: "designation", value: formData.designation, onChange: handleChange, required: true, className: "form-input", placeholder: "Software Engineer" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "socialHandle", className: "form-label", children: "How to reach you *" }), _jsx("input", { type: "text", id: "socialHandle", name: "socialHandle", value: formData.socialHandle, onChange: handleChange, required: true, className: "form-input", placeholder: "email@example.com or @twitter" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "message", className: "form-label", children: "Your Message *" }), _jsx("textarea", { id: "message", name: "message", value: formData.message, onChange: handleChange, required: true, className: "form-textarea", rows: 6, placeholder: "Tell me about your project, question, or collaboration idea..." })] }), submitMessage && (_jsx("div", { className: `form-message ${submitMessage.includes("Failed") ? "error" : "success"}`, children: submitMessage })), _jsx("button", { type: "submit", disabled: isSubmitting, className: "form-submit", children: isSubmitting ? "Sending..." : "Send Message" })] })] }) }));
};
export default ReachoutPage;
