import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { initDatabase, closeDatabase } from "./database.js";
import contactRoutes from "./routes/contact.js";
import contextRoutes from "./routes/context.js";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

console.log("Environment check:");
console.log("- PORT:", PORT);
console.log("- GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Set (starts with " + process.env.GEMINI_API_KEY.substring(0, 4) + "...)" : "Not Set");

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database
    await initDatabase();

    // Routes
    app.use("/api/contact", contactRoutes);
    app.use("/api/context", contextRoutes);
    app.use("/api/chat", chatRoutes);
    app.use("/api/auth", authRoutes);

    // Health check
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    });

    // Error handling
    app.use(
      (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        console.error("Error:", err);
        res.status(500).json({
          error: err.message || "Internal server error"
        });
      }
    );

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📁 Environment: ${process.env.NODE_ENV}`);
      console.log(`🗄️  Database: MongoDB`);
    });

    // Graceful shutdown
    const handleShutdown = async () => {
      console.log("\n⏹️  Shutting down...");
      server.close(async () => {
        await closeDatabase();
        console.log("Server closed");
        process.exit(0);
      });
      
      // Force exit after 3 seconds
      setTimeout(() => {
        process.exit(0);
      }, 3000);
    };

    process.on("SIGINT", handleShutdown);
    process.on("SIGTERM", handleShutdown);
    
    // Suppress batch job prompt on Windows
    if (process.stdin && process.stdin.isTTY === false) {
      process.stdin.on("data", (chunk) => {
        if (chunk.toString().includes("Y")) {
          process.exit(0);
        }
      });
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
