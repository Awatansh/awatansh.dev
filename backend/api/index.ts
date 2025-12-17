import express from 'express';
import cors from 'cors';
import { initDatabase } from '../src/database.js';
import contactRoutes from '../src/routes/contact.js';
import contextRoutes from '../src/routes/context.js';
import chatRoutes from '../src/routes/chat.js';
import authRoutes from '../src/routes/auth.js';

const app = express();

// Normalize frontend URL (remove trailing slash)
const frontendURL = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");

// Middleware
app.use(
  cors({
    origin: frontendURL,
    credentials: true
  })
);
app.use(express.json());

// Initialize database on first request
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initDatabase();
      dbInitialized = true;
    } catch (err) {
      console.error('Database initialization failed:', err);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }
  next();
});

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/context', contextRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;

