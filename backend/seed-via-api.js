// Simple seed data script - run this after the server is started
// Usage: node seed-via-api.js

const API_URL = "http://localhost:5000/api";

const seedData = {
  resume: "Passionate full-stack developer and AI researcher with expertise in modern web technologies and machine learning.",
  projects: [
    {
      id: "1",
      title: "AI Chat Portfolio",
      description: "Interactive terminal-based portfolio with AI-powered chat using Gemini API",
      link: "https://github.com/awatansh/portfolio",
      technologies: ["React", "TypeScript", "Node.js", "MongoDB", "Gemini AI"]
    },
    {
      id: "2",
      title: "Task Management System",
      description: "Full-stack task management application with real-time updates",  
      link: "https://github.com/awatansh/task-manager",
      technologies: ["React", "Express", "PostgreSQL", "WebSockets"]
    }
  ],
  skills: [
    {
      category: "Frontend",
      items: ["React", "TypeScript", "Tailwind CSS", "Vite", "Next.js"]
    },
    {
      category: "Backend",
      items: ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs"]
    },
    {
      category: "AI/ML",
      items: ["Python", "TensorFlow", "PyTorch", "Gemini API", "OpenAI"]
    },
    {
      category: "Tools",
      items: ["Git", "Docker", "AWS", "CI/CD", "Jest", "Vitest"]
    }
  ],
  experience: [
    {
      company: "Tech Innovations Inc.",
      position: "Full Stack Developer",
      startDate: "2023",
      description: "Building scalable web applications with modern frameworks and cloud technologies"
    },
    {
      company: "AI Research Lab",
      position: "Research Assistant",
      startDate: "2022",
      endDate: "2023",
      description: "Conducted research on machine learning models and natural language processing"
    }
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      year: "2022"
    }
  ],
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/awatansh"
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/awatansh"
    },
    {
      name: "Twitter",
      url: "https://twitter.com/awatansh"
    }
  ]
};

async function seedViaAPI() {
  try {
    const response = await fetch(`${API_URL}/context/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(seedData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ Seed data uploaded successfully!");
    console.log(result);
    
    console.log("\n📊 Seeded:");
    console.log(`  Projects: ${seedData.projects.length}`);
    console.log(`  Skills: ${seedData.skills.length} categories`);
    console.log(`  Experience: ${seedData.experience.length} positions`);
    console.log(`  Education: ${seedData.education.length} entries`);
    console.log(`  Socials: ${seedData.socials.length} links`);

  } catch (error) {
    console.error("❌ Error seeding data:", error.message);
    console.log("\nMake sure the backend server is running on http://localhost:5000");
    process.exit(1);
  }
}

seedViaAPI();
