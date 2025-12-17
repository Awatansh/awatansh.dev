import { GoogleGenerativeAI } from "@google/generative-ai";
// @ts-ignore - path mapping
import type { ChatRequest, ChatResponse, PortfolioContext } from "@portfolio/shared";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
let genAI: GoogleGenerativeAI | null = null;

// Only initialize if API key exists and is not empty
if (GEMINI_API_KEY && GEMINI_API_KEY.trim() !== "") {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  } catch (error) {
    console.warn("Failed to initialize Gemini AI:", error);
    genAI = null;
  }
}

export async function chat(request: ChatRequest): Promise<ChatResponse> {
  try {
    // If no API key, return helpful fallback
    if (!genAI || !GEMINI_API_KEY) {
      return {
        response: "AI chat is currently unavailable. Please configure GEMINI_API_KEY in your .env file to enable AI features. In the meantime, try using 'help', 'about', 'projects', or other commands!",
        context: request.context
      };
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 1000,
      }
    });

    // Build context-aware system prompt
    const contextPrompt = buildContextPrompt(request.context);
    const conversationHistory = request.messages
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const fullPrompt = `${contextPrompt}\n\n${conversationHistory}\nassistant:`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();

    return {
      response,
      context: request.context
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      response: "Sorry, I encountered an error. Please try again or use other commands like 'help', 'about', or 'projects'.",
      context: request.context
    };
  }
}

export async function askQuestion(
  question: string,
  context: PortfolioContext
): Promise<string> {
  try {
    // If no API key, return helpful fallback
    if (!genAI || !GEMINI_API_KEY) {
      console.warn("Gemini API key not configured. GEMINI_API_KEY:", GEMINI_API_KEY ? "set but invalid" : "not set");
      return "AI features are currently unavailable. Please configure GEMINI_API_KEY in your .env file. Try using 'about', 'projects', 'skills', or 'experience' commands instead!";
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 1000,
      }
    });
    const contextPrompt = buildContextPrompt(context);
    const fullPrompt = `${contextPrompt}\n\nUser: ${question}\nAssistant:`;

    console.log("Calling Gemini API with question:", question.substring(0, 50) + "...");
    const result = await model.generateContent(fullPrompt);
    console.log("Gemini API response received");
    return result.response.text();
  } catch (error) {
    console.error("Gemini API error:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error) {
      console.error("Stack:", error.stack);
    }
    return "Sorry, I encountered an error processing your question. Please try other commands like 'help', 'about', or 'projects'.";
  }
}

function buildContextPrompt(context: PortfolioContext): string {
  return `You are Awatansh, a developer and researcher. Always respond in first person as yourself. 
Be concise, friendly, and professional. Provide insights from your experience and projects.

RESUME:
${context.resume}

PROJECTS:
${context.projects.map((p: any) => `- ${p.title}: ${p.description}`).join("\n")}

SKILLS:
${context.skills.map((s: any) => `${s.category}: ${s.items.join(", ")}`).join("\n")}

EXPERIENCE:
${context.experience
  .map((e: any) => `${e.company} - ${e.position}: ${e.description}`)
  .join("\n")}

When answering questions, reference relevant projects or experience from the above context.`;
}

export async function generateSummary(
  content: string,
  context: PortfolioContext
): Promise<string> {
  try {
    // If no API key, return content as-is
    if (!genAI || !GEMINI_API_KEY) {
      return content;
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 500,
      }
    });
    const prompt = `As Awatansh, briefly explain this in 2-3 sentences, making it conversational and interesting:\n\n${content}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return content; // Return original content on error
  }
}
