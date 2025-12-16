import { COMMANDS, type PortfolioContext } from "@portfolio/shared";

export type CommandOutput = {
  type: "text" | "input" | "interactive" | "navigate";
  content: string;
  data?: Record<string, any>;
};

export async function executeCommand(
  input: string,
  context: PortfolioContext | null
): Promise<CommandOutput[]> {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const [command, ...args] = trimmed.split(" ");
  const lowerCommand = command.toLowerCase();

  // Help command
  if (lowerCommand === "help") {
    console.log("Executing help command");
    const outputs: CommandOutput[] = [];
    outputs.push({ type: "text", content: "\n📚 Command Reference\n", data: { style: "header" } });
    outputs.push({ type: "text", content: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n", data: { style: "muted" } });
    
    Object.values(COMMANDS).forEach((cmd: any) => {
      // Skip education command from help display
      if (cmd.name === "education") return;
      
      const outputItem: CommandOutput = { 
        type: "text", 
        content: "", 
        data: { 
          style: "help-row", 
          command: cmd.name,
          description: cmd.description
        } 
      };
      console.log("Generated help item:", outputItem);
      outputs.push(outputItem);
    });
    outputs.push({ type: "text", content: "\n" });
    return outputs;
  }

  // Admin command (Hidden)
  if (lowerCommand === "admin") {
    return [
      { type: "text", content: "\n🔒 Admin Access\n", data: { style: "header" } },
      { type: "text", content: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n", data: { style: "muted" } },
      { type: "text", content: "Admin panel is currently restricted.\n", data: { style: "description" } },
      { type: "text", content: "Access is limited to authorized personnel only.\n\n", data: { style: "description" } }
    ];
  }

  // About command
  if (lowerCommand === "about") {
    const outputs: CommandOutput[] = [];
    outputs.push({ type: "text", content: "\n👋 About Me\n", data: { style: "header" } });
    outputs.push({ type: "text", content: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n", data: { style: "muted" } });
    outputs.push({ type: "text", content: "Hi, I'm Awatansh\n", data: { style: "title" } });
    outputs.push({ type: "text", content: "Developer & AI Researcher\n\n", data: { style: "subtitle" } });
    outputs.push({ type: "text", content: "I build innovative solutions that blend creativity with technical excellence. \n", data: { style: "description" } });
    outputs.push({ type: "text", content: "When I'm not coding, you'll find me exploring new tech, contributing to \n", data: { style: "description" } });
    outputs.push({ type: "text", content: "open-source, or working on research projects.\n\n", data: { style: "description" } });
    outputs.push({ type: "text", content: "▸ Type ", data: { style: "description" } });
    outputs.push({ type: "text", content: "'projects'", data: { style: "tech" } });
    outputs.push({ type: "text", content: " to see my work\n", data: { style: "description" } });
    outputs.push({ type: "text", content: "▸ Type ", data: { style: "description" } });
    outputs.push({ type: "text", content: "'experience'", data: { style: "tech" } });
    outputs.push({ type: "text", content: " for my background\n", data: { style: "description" } });
    outputs.push({ type: "text", content: "▸ Type ", data: { style: "description" } });
    outputs.push({ type: "text", content: "'chat'", data: { style: "tech" } });
    outputs.push({ type: "text", content: " or ", data: { style: "description" } });
    outputs.push({ type: "text", content: "'ask'", data: { style: "tech" } });
    outputs.push({ type: "text", content: " to chat with me!\n\n", data: { style: "description" } });
    return outputs;
  }

  // Projects command
  if (lowerCommand === "projects" && context) {
    if (context.projects.length === 0) {
      return [{ type: "text", content: "\nNo projects added yet.\n" }];
    }
    const outputs: CommandOutput[] = [{ type: "text", content: "\n", data: { style: "header" } }];
    outputs.push({ type: "text", content: "💼 My Projects\n", data: { style: "header" } });
    outputs.push({ type: "text", content: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n", data: { style: "muted" } });
    
    context.projects.forEach((p: any, index: number) => {
      outputs.push({ type: "text", content: `\n┌─ ${index + 1}. ${p.title}\n`, data: { style: "title" } });
      outputs.push({ type: "text", content: `│\n`, data: { style: "muted" } });
      outputs.push({ type: "text", content: `│  ${p.description}\n`, data: { style: "description" } });
      outputs.push({ type: "text", content: `│\n`, data: { style: "muted" } });
      
      const techBadges = p.technologies.map((t: string) => `[${t}]`).join(" ");
      outputs.push({ type: "text", content: `│  🛠️  ${techBadges}\n`, data: { style: "tech" } });
      
      if (p.link) {
        outputs.push({ type: "text", content: `│\n`, data: { style: "muted" } });
        outputs.push({ type: "text", content: `│  🔗 View Project →\n`, data: { link: p.link, style: "link" } });
      }
      outputs.push({ type: "text", content: `└${'─'.repeat(50)}\n\n`, data: { style: "muted" } });
    });
    return outputs;
  }

  // Skills command
  if (lowerCommand === "skills" && context) {
    if (context.skills.length === 0) {
      return [{ type: "text", content: "\nNo skills added yet.\n" }];
    }
    const outputs: CommandOutput[] = [];
    outputs.push({ type: "text", content: "\n🛠️  Technical Skills\n", data: { style: "header" } });
    outputs.push({ type: "text", content: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n", data: { style: "muted" } });
    
    context.skills.forEach((s: any) => {
      outputs.push({ type: "text", content: `\n▸ ${s.category}\n`, data: { style: "subtitle" } });
      const skillBadges = s.items.map((item: string) => `[${item}]`).join(" ");
      outputs.push({ type: "text", content: `  ${skillBadges}\n`, data: { style: "tech" } });
    });
    outputs.push({ type: "text", content: "\n" });
    return outputs;
  }

  // Experience command
  if (lowerCommand === "experience" && context) {
    if (context.experience.length === 0) {
      return [{ type: "text", content: "\nNo experience added yet.\n" }];
    }
    const outputs: CommandOutput[] = [];
    outputs.push({ type: "text", content: "\n💼 Work Experience\n", data: { style: "header" } });
    outputs.push({ type: "text", content: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n", data: { style: "muted" } });
    
    context.experience.forEach((e: any, index: number) => {
      outputs.push({ type: "text", content: `\n◉ ${e.position}\n`, data: { style: "title" } });
      outputs.push({ type: "text", content: `  @ ${e.company}\n`, data: { style: "subtitle" } });
      outputs.push({ type: "text", content: `  📅 ${e.startDate}${e.endDate ? ` - ${e.endDate}` : " - Present"}\n\n`, data: { style: "date" } });
      outputs.push({ type: "text", content: `  ${e.description}\n`, data: { style: "description" } });
      if (index < context.experience.length - 1) {
        outputs.push({ type: "text", content: "\n  ┆\n", data: { style: "muted" } });
      }
    });
    outputs.push({ type: "text", content: "\n" });
    return outputs;
  }

  // Education command
  if (lowerCommand === "education" && context) {
    if (context.education.length === 0) {
      return [{ type: "text", content: "\nNo education added yet.\n" }];
    }
    const edu = "\n🎓 Education:\n\n" + context.education
      .map((e: any) => `  ${e.institution}\n  ${e.degree} in ${e.field} (${e.year})`)
      .join("\n\n") + "\n";
    return [{ type: "text", content: edu }];
  }

  // Contact command
  if (lowerCommand === "contact" && context) {
    const outputs: CommandOutput[] = [
      { type: "text", content: "\n📧 Contact Information:\n" },
      { type: "text", content: "\nEmail: (via form)\n" },
      { type: "text", content: "\n🔗 Social Links:\n" }
    ];
    context.socials.forEach((s: any) => {
      outputs.push({ type: "text", content: `  ${s.name}: ${s.url}\n`, data: { link: s.url } });
    });
    outputs.push({ type: "text", content: "\nUse 'reachout' to send a message!\n" });
    return outputs;
  }

  // Reachout command (navigate to page)
  if (lowerCommand === "reachout") {
    return [
      { type: "navigate", content: "/reachout", data: { path: "/reachout" } }
    ];
  }

  // Ask command
  if (lowerCommand === "ask") {
    const question = args.join(" ");
    if (!question) {
      return [{ type: "text", content: 'Usage: ask "your question"' }];
    }
    return [
      { type: "text", content: `Thinking about your question: "${question}"...` },
      { type: "text", content: "[API Call Pending]" }
    ];
  }

  // Chat command
  if (lowerCommand === "chat") {
    return [
      { type: "text", content: "Starting chat mode... (type 'exit' to quit)" },
      { type: "interactive", content: "chat", data: { mode: "chat" } }
    ];
  }

  // Socials command
  if (lowerCommand === "socials" && context) {
    if (context.socials.length === 0) {
      return [{ type: "text", content: "\nNo social links added yet.\n" }];
    }
    const outputs: CommandOutput[] = [{ type: "text", content: "\n🔗 Social Links:\n" }];
    context.socials.forEach((s: any) => {
      outputs.push({ type: "text", content: `  ${s.name}: ${s.url}\n`, data: { link: s.url } });
    });
    outputs.push({ type: "text", content: "" });
    return outputs;
  }

  // Resume command
  if (lowerCommand === "resume") {
    if (context?.resumeLink) {
      return [
        { type: "text", content: "\n📄 Resume:\n" },
        { type: "text", content: `View: ${context.resumeLink}\n`, data: { link: context.resumeLink } }
      ];
    }
    const resumeLink = import.meta.env.VITE_RESUME_LINK;
    if (resumeLink && resumeLink !== "https://drive.google.com/file/d/YOUR_GOOGLE_DRIVE_FILE_ID/view" && resumeLink !== "https://drive.google.com/file/d/YOUR_ID/view") {
      return [
        { type: "text", content: "\n📄 Resume:\n" },
        { type: "text", content: `View: ${resumeLink}\n`, data: { link: resumeLink } }
      ];
    }
    if (context?.resume) {
      return [
        { type: "text", content: "\n📄 Resume:\n" },
        { type: "text", content: context.resume + "\n" }
      ];
    }
    return [{ type: "text", content: "\nResume link not set. Add it via admin panel!\n" }];
  }

  // Clear command
  if (lowerCommand === "clear") {
    return [{ type: "text", content: "[CLEAR]" }];
  }

  // Exit command
  if (lowerCommand === "exit") {
    return [
      {
        type: "text",
        content: "Thanks for visiting! See you next time. 👋\n(Terminal is now read-only)"
      }
    ];
  }

  // Unknown command -> fall back to AI chat (ask)
  return [
    {
      type: "interactive",
      content: "[ASK_FALLBACK]",
      data: { mode: "askFallback", question: trimmed }
    }
  ];
}
