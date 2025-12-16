import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  isAuthenticated?: boolean;
  user?: {
    email: string;
    name?: string;
  };
}

// Simple session-based authentication
// In production, replace with proper JWT or OAuth
const sessions = new Map<string, { email: string; name?: string; expiresAt: number }>();

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization?.replace("Bearer ", "");
  
  if (!authToken) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const session = sessions.get(authToken);
  
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(authToken);
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }

  req.isAuthenticated = true;
  req.user = { email: session.email, name: session.name };
  next();
}

export function createSession(email: string, name?: string): string {
  const token = generateToken();
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  sessions.set(token, { email, name, expiresAt });
  return token;
}

export function removeSession(token: string): void {
  sessions.delete(token);
}

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
