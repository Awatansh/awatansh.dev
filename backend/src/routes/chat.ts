import express from "express";
import { chat, askQuestion, generateSummary } from "../services/gemini.js";
import { getDatabase } from "../database.js";
import type { PortfolioContext } from "@portfolio/shared";

const router = express.Router();

// Get portfolio context
async function getPortfolioContext(): Promise<PortfolioContext> {
  const db = getDatabase();
  const contextDoc = await db
    .collection<any>("portfolio_context")
    .findOne({ _id: "portfolio_data" } as any);

  if (!contextDoc) {
    return getDefaultContext();
  }

  const { _id, updatedAt, ...context } = contextDoc;
  return (context as any) || getDefaultContext();
}

function getDefaultContext(): PortfolioContext {
  return {
    resume: "Awaiting resume information...",
    projects: [],
    skills: [],
    experience: [],
    education: [],
    socials: []
  };
}

// Chat endpoint
router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Invalid request format" });
      return;
    }

    const context = await getPortfolioContext();
    const response = await chat({ messages, context });

    res.json(response);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

// Ask endpoint
router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      res.status(400).json({ error: "Question is required" });
      return;
    }

    const context = await getPortfolioContext();
    const response = await askQuestion(question, context);

    res.json({ response });
  } catch (error) {
    console.error("Ask error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

export default router;
