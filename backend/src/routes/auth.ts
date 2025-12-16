import express from "express";
import { OAuth2Client } from "google-auth-library";
import { createSession, removeSession, authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google OAuth login
router.post("/google", async (req, res) => {
  const { credential } = req.body;
  
  if (!credential) {
    return res.status(400).json({ 
      success: false, 
      message: "Google credential is required" 
    });
  }

  try {
    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid Google token" 
      });
    }

    // Get allowed admin emails from environment variable
    const allowedEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map(e => e.trim().toLowerCase())
      .filter(e => e.length > 0);

    const userEmail = payload.email.toLowerCase();

    // Check if email is in allowed list
    if (!allowedEmails.includes(userEmail)) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized: Your email is not in the allowed list" 
      });
    }

    // Create session token
    const token = createSession(userEmail, payload.name || userEmail);
    
    res.json({ 
      success: true, 
      token,
      user: {
        email: payload.email,
        name: payload.name || payload.email
      },
      message: "Login successful" 
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(401).json({ 
      success: false, 
      message: "Failed to verify Google token" 
    });
  }
});

// Verify token
router.get("/verify", authMiddleware, (req: AuthRequest, res) => {
  res.json({ 
    authenticated: true,
    user: req.user 
  });
});

// Logout
router.post("/logout", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) {
    removeSession(token);
  }
  res.json({ success: true, message: "Logged out" });
});

export default router;
