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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const result = await submitContact(formData);
      setSubmitMessage(result.message || "Message sent successfully!");
      setFormData({ name: "", designation: "", message: "", socialHandle: "" });
    } catch (error) {
      setSubmitMessage("Failed to send message. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">✉️ Reach Out</h1>
        <div className="page-divider"></div>

        <div className="content-section">
          <p className="section-description">
            Have a question, project idea, or just want to connect? Fill out the form below
            and I'll get back to you as soon as possible!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="reachout-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Your Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="designation" className="form-label">
              Your Role/Title *
            </label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Software Engineer"
            />
          </div>

          <div className="form-group">
            <label htmlFor="socialHandle" className="form-label">
              How to reach you *
            </label>
            <input
              type="text"
              id="socialHandle"
              name="socialHandle"
              value={formData.socialHandle}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="email@example.com or @twitter"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">
              Your Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="form-textarea"
              rows={6}
              placeholder="Tell me about your project, question, or collaboration idea..."
            />
          </div>

          {submitMessage && (
            <div className={`form-message ${submitMessage.includes("Failed") ? "error" : "success"}`}>
              {submitMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="form-submit"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReachoutPage;
