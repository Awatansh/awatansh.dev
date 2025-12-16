// Constants
export const TERMINAL_PROMPT = "awatansh.dev";
export const COMMANDS = {
    help: {
        name: "help",
        description: "List all available commands",
        usage: "help"
    },
    chat: {
        name: "chat",
        description: "Start a chat session with AI",
        usage: "chat"
    },
    ask: {
        name: "ask",
        description: "Ask me anything via AI",
        usage: 'ask "your question here"'
    },
    about: {
        name: "about",
        description: "About me",
        usage: "about"
    },
    projects: {
        name: "projects",
        description: "My projects",
        usage: "projects"
    },
    skills: {
        name: "skills",
        description: "My skills",
        usage: "skills"
    },
    experience: {
        name: "experience",
        description: "Work experience",
        usage: "experience"
    },
    reachout: {
        name: "reachout",
        description: "Send me a message",
        usage: "reachout"
    },
    contact: {
        name: "contact",
        description: "Contact information",
        usage: "contact"
    },
    socials: {
        name: "socials",
        description: "Social media links",
        usage: "socials"
    },
    resume: {
        name: "resume",
        description: "View resume",
        usage: "resume"
    },
    clear: {
        name: "clear",
        description: "Clear terminal",
        usage: "clear"
    },
    exit: {
        name: "exit",
        description: "Exit terminal",
        usage: "exit"
    },
    education: {
        name: "education",
        description: "Education",
        usage: "education"
    }
};
// Environment variables - works in both browser and Node
const getEnv = (key, defaultValue) => {
    // Browser (Vite)
    if (typeof process === "undefined") {
        const viteEnv = import.meta?.env?.[key];
        return viteEnv || defaultValue;
    }
    // Node
    return process.env[key] || defaultValue;
};
export const API_BASE_URL = getEnv("VITE_API_URL", "http://localhost:5000");
export const GEMINI_API_KEY = getEnv("VITE_GEMINI_API_KEY", "");
