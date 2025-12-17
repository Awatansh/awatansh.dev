import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export interface AuthRequest extends Request {
  isAuthenticated?: boolean;
  user?: {
    email: string;
    name?: string;
  };
}

// JWT-based authentication (stateless - works with serverless)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface TokenPayload {
  email: string;
  name?: string;
  iat: number;
  exp: number;
}

// Simple JWT implementation (no external deps)
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function createJWT(payload: TokenPayload): string {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = base64UrlEncode(
    crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${body}`)
      .digest()
      .toString()
  );
  return `${header}.${body}.${signature}`;
}

function verifyJWT(token: string): TokenPayload | null {
  try {
    const [header, body, signature] = token.split(".");
    
    // Verify signature
    const expectedSignature = base64UrlEncode(
      crypto
        .createHmac("sha256", JWT_SECRET)
        .update(`${header}.${body}`)
        .digest()
        .toString()
    );
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    // Parse and validate payload
    const payload = JSON.parse(Buffer.from(body, "base64").toString()) as TokenPayload;
    
    if (payload.exp < Date.now()) {
      return null; // Token expired
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}

export { verifyJWT };

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization?.replace("Bearer ", "");
  
  if (!authToken) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const payload = verifyJWT(authToken);
  
  if (!payload) {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }

  req.isAuthenticated = true;
  req.user = { email: payload.email, name: payload.name };
  next();
}

export function createSession(email: string, name?: string): string {
  const payload: TokenPayload = {
    email,
    name,
    iat: Date.now(),
    exp: Date.now() + TOKEN_EXPIRY
  };
  
  return createJWT(payload);
}

export function removeSession(token: string): void {
  // JWT tokens are stateless - nothing to remove
  // Token becomes invalid when it expires
}
