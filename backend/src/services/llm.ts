import axios from "axios";
// @ts-ignore - path mapping
import type { ChatRequest, ChatResponse, PortfolioContext } from "@portfolio/shared";

const GROQ_API_KEY = (process.env.GROQ_API_KEY || "").trim();
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const GROQ_BASE_URL = process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";

type LlmRole = "system" | "user" | "assistant";

interface GroqMessage {
  role: LlmRole;
  content: string;
}

interface GroqChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

async function callGroq(messages: GroqMessage[], maxTokens: number): Promise<string> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await axios.post<GroqChatResponse>(
        `${GROQ_BASE_URL}/chat/completions`,
        {
          model: GROQ_MODEL,
          messages,
          max_tokens: maxTokens,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      const content = response.data.choices?.[0]?.message?.content?.trim();
      if (!content) {
        throw new Error("Empty response from Groq");
      }

      return content;
    } catch (error: any) {
      lastError = error;
      const status = error?.response?.status;
      const retryable =
        status === 429 ||
        (typeof status === "number" && status >= 500) ||
        error?.code === "ECONNRESET" ||
        error?.code === "ETIMEDOUT";

      if (!retryable || attempt === 3) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }

  throw lastError;
}

export async function chat(request: ChatRequest): Promise<ChatResponse> {
  try {
    if (!GROQ_API_KEY) {
      return {
        response: "AI chat is currently unavailable. Please configure GROQ_API_KEY in your .env file to enable AI features. In the meantime, try using 'help', 'about', 'projects', or other commands!",
        context: request.context
      };
    }

    const response = await callGroq(
      [
        { role: "system", content: buildContextPrompt(request.context) },
        ...request.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      1000
    );

    return {
      response,
      context: request.context
    };
  } catch (error) {
    console.error("Groq API error:", error);
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
    if (!GROQ_API_KEY) {
      console.warn("Groq API key not configured. GROQ_API_KEY is not set");
      return "AI features are currently unavailable. Please configure GROQ_API_KEY in your .env file. Try using 'about', 'projects', 'skills', or 'experience' commands instead!";
    }

    console.log("Calling Groq API with question:", question.substring(0, 50) + "...");

    return await callGroq(
      [
        { role: "system", content: buildContextPrompt(context) },
        { role: "user", content: question },
      ],
      1000
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Groq API error:", errorMsg);
    if (error instanceof Error && error.stack) {
      console.error("Stack:", error.stack);
    }
    
    if (errorMsg.includes("429") || errorMsg.includes("503") || errorMsg.includes("overloaded")) {
      return "The AI service is temporarily busy. Please try again in a moment!";
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
    if (!GROQ_API_KEY) {
      return content;
    }

    const prompt = `As Awatansh, briefly explain this in 2-3 sentences, making it conversational and interesting:\n\n${content}`;

    return await callGroq(
      [
        { role: "system", content: buildContextPrompt(context) },
        { role: "user", content: prompt },
      ],
      500
    );
  } catch (error) {
    console.error("Groq API error:", error);
    return content; // Return original content on error
  }
}
