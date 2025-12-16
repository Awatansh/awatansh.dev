import express from "express";
import { randomUUID } from "crypto";
import { getDatabase } from "../database.js";
import type { ContactSubmission } from "@portfolio/shared";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Submit contact form
router.post("/submit", async (req, res) => {
  try {
    const { name, designation, message, socialHandle } = req.body;

    if (!name || !designation || !message) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const id = randomUUID();
    const submission = {
      _id: id,
      name,
      designation,
      message,
      socialHandle: socialHandle || null,
      createdAt: new Date(),
      read: false
    };

    const db = getDatabase();
    await db.collection<any>("contacts").insertOne(submission as any);

    res.json({
      success: true,
      message: "Thanks for reaching out! I'll get back to you soon.",
      submissionId: id
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    res.status(500).json({ error: "Failed to submit contact form" });
  }
});

// Get all submissions (admin only)
router.get("/submissions", authMiddleware, async (req, res) => {
  try {
    const db = getDatabase();
    const submissions = await db
      .collection("contacts")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

// Mark as read
router.patch("/:id/read", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    const result = await db
      .collection<any>("contacts")
      .updateOne(
        { _id: id } as any,
        { $set: { read: true } }
      );

    if (result.matchedCount === 0) {
      res.status(404).json({ error: "Submission not found" });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating submission:", error);
    res.status(500).json({ error: "Failed to update submission" });
  }
});

// Delete submission (admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    const result = await db
      .collection("contacts")
      .deleteOne({ _id: id } as any);

    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Submission not found" });
      return;
    }

    res.json({ success: true, message: "Submission deleted" });
  } catch (error) {
    console.error("Error deleting submission:", error);
    res.status(500).json({ error: "Failed to delete submission" });
  }
});

export default router;
