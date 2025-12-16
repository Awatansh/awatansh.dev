import express from "express";
import { getDatabase } from "../database.js";
import type { PortfolioContext } from "@portfolio/shared";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Get portfolio context
router.get("/", async (req, res) => {
  try {
    const db = getDatabase();
    const contextDoc = await db
      .collection<any>("portfolio_context")
      .findOne({ _id: "portfolio_data" });

    if (!contextDoc) {
      // Return default context if not found
      res.json(getDefaultContext());
      return;
    }

    // Remove MongoDB's _id field
    const { _id, ...context } = contextDoc;
    res.json(context as PortfolioContext);
  } catch (error) {
    console.error("Error fetching context:", error);
    res.status(500).json({ error: "Failed to fetch context" });
  }
});

// Update context (admin only)
router.post("/update", authMiddleware, async (req, res) => {
  try {
    const contextUpdates = req.body;
    const db = getDatabase();

    await db
      .collection<any>("portfolio_context")
      .updateOne(
        { _id: "portfolio_data" },
        {
          $set: {
            ...contextUpdates,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );

    res.json({ success: true, message: "Context updated" });
  } catch (error) {
    console.error("Error updating context:", error);
    res.status(500).json({ error: "Failed to update context" });
  }
});

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

export default router;
