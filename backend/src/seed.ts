import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/portfolio";

const seedData = {
  _id: "portfolio_data",
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
      endDate: null,
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
  ],
  updatedAt: new Date()
};

async function seedDatabase() {
  const client = new MongoClient(DATABASE_URL);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db();
    const collection = db.collection("portfolio_context");

    // Check if data already exists
    const existing = await collection.findOne({ _id: "portfolio_data" } as any);
    
    if (existing) {
      console.log("⚠️  Data already exists. Updating...");
      await collection.replaceOne({ _id: "portfolio_data" } as any, seedData as any);
      console.log("✅ Data updated successfully");
    } else {
      await collection.insertOne(seedData as any);
      console.log("✅ Seed data inserted successfully");
    }

    console.log("\\n📊 Current data:");
    console.log(`  Projects: ${seedData.projects.length}`);
    console.log(`  Skills: ${seedData.skills.length} categories`);
    console.log(`  Experience: ${seedData.experience.length} positions`);
    console.log(`  Education: ${seedData.education.length} entries`);
    console.log(`  Socials: ${seedData.socials.length} links`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("\\n🔒 Connection closed");
  }
}

seedDatabase().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
