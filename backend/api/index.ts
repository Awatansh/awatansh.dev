import express from 'express';
import cors from 'cors';
import { initDatabase } from '../src/database.js';
import contactRoutes from '../src/routes/contact.js';
import contextRoutes from '../src/routes/context.js';
import chatRoutes from '../src/routes/chat.js';
import authRoutes from '../src/routes/auth.js';

const app = express();

console.log('API Handler initializing...');

// Normalize frontend URL (remove trailing slash)
const frontendURL = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
console.log('FRONTEND_URL:', frontendURL);

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
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (!dbInitialized) {
    try {
      console.log('Initializing database...');
      await initDatabase();
      dbInitialized = true;
      console.log('Database initialized');
    } catch (err) {
      console.error('Database initialization failed:', err);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }
  next();
});

// Routes - Vercel adds /api prefix, so we need it here
app.use('/api/contact', contactRoutes);
app.use('/api/context', contextRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all for debugging
app.all('*', (req, res) => {
  console.log(`Unmatched route: ${req.method} ${req.path}`);
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Express error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

export default app;

