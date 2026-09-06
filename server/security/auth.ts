import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { AdminSession } from './types';
import { securityAudit } from './auditLog';
import { rateLimiter } from './rateLimiter';

// Extend Express Request to include adminUser
declare global {
  namespace Express {
    interface Request {
      adminUser?: AdminSession;
    }
  }
}

// Secret for HMAC token signing (falls back to random bytes generated per server boot)
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'jungle2026';

// Authorized admin emails
const AUTHORIZED_ADMIN_EMAILS = [
  'obajedavidbyron@gmail.com',
  'admin@junglelanesafaris.com',
  'owner@junglelanesafaris.com'
];

// Active sessions stored in-memory
const activeSessions: Map<string, AdminSession> = new Map();

/**
 * Timing-safe string comparison to prevent side-channel timing attacks
 */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Compare against itself to maintain constant time
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Create a cryptographically signed HMAC-SHA256 token
 */
export function generateToken(payload: { email: string; name: string }): { token: string; session: AdminSession } {
  const nonce = crypto.randomBytes(16).toString('hex');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 hours

  const data = JSON.stringify({
    email: payload.email,
    name: payload.name,
    role: 'admin',
    iat: now.toISOString(),
    exp: expiresAt.toISOString(),
    nonce
  });

  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('hex');
  const token = Buffer.from(`${data}.${signature}`).toString('base64url');

  const session: AdminSession = {
    token,
    email: payload.email,
    name: payload.name,
    role: 'admin',
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    ip: ''
  };

  activeSessions.set(token, session);
  return { token, session };
}

/**
 * Verify signed token
 */
export function verifyToken(token: string): AdminSession | null {
  if (!token) return null;

  const session = activeSessions.get(token);
  if (!session) {
    // Attempt stateless verification of token signature
    try {
      const decoded = Buffer.from(token, 'base64url').toString('utf8');
      const parts = decoded.split('.');
      if (parts.length !== 2) return null;

      const [data, signature] = parts;
      const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('hex');

      if (!safeEqual(signature, expectedSig)) {
        return null;
      }

      const parsed = JSON.parse(data);
      if (new Date() > new Date(parsed.exp)) {
        return null;
      }

      const restoredSession: AdminSession = {
        token,
        email: parsed.email,
        name: parsed.name,
        role: 'admin',
        createdAt: parsed.iat,
        expiresAt: parsed.exp,
        ip: ''
      };
      activeSessions.set(token, restoredSession);
      return restoredSession;
    } catch {
      return null;
    }
  }

  // Check expiration
  if (new Date() > new Date(session.expiresAt)) {
    activeSessions.delete(token);
    return null;
  }

  return session;
}

/**
 * Authenticate Administrator credentials
 */
export function authenticateAdmin(
  email: string,
  passcode: string,
  ip: string
): { success: boolean; token?: string; session?: AdminSession; error?: string; remainingLockoutSeconds?: number } {
  // Check brute force lockout first
  const lockout = rateLimiter.checkAuthLockout(ip);
  if (lockout.isLocked) {
    securityAudit.log({
      type: 'BRUTE_FORCE_BLOCKED',
      ip,
      path: '/api/auth/login',
      method: 'POST',
      details: `Attempt blocked. IP is temporarily locked out (${lockout.remainingSeconds}s remaining).`,
      severity: 'critical'
    });
    return {
      success: false,
      error: `Security Lockout: Too many failed attempts. Please wait ${lockout.remainingSeconds} seconds.`,
      remainingLockoutSeconds: lockout.remainingSeconds
    };
  }

  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPasscode = (passcode || '').trim();

  const isEmailValid = AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail) || cleanEmail === 'admin';
  const isPasscodeValid = safeEqual(cleanPasscode, ADMIN_PASSWORD);

  if (!isEmailValid || !isPasscodeValid) {
    const record = rateLimiter.recordAuthFailure(ip, 5, 15 * 60 * 1000);
    securityAudit.log({
      type: 'AUTH_FAILURE',
      ip,
      path: '/api/auth/login',
      method: 'POST',
      details: `Failed admin login attempt with email: ${cleanEmail}. Failed attempts: ${record.count}`,
      severity: 'medium'
    });

    const attemptsLeft = Math.max(0, 5 - record.count);
    return {
      success: false,
      error: attemptsLeft > 0
        ? `Invalid credentials. ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining before temporary lockout.`
        : 'Account locked for 15 minutes due to multiple failed attempts.'
    };
  }

  // Success
  rateLimiter.recordAuthSuccess(ip);
  const adminName = cleanEmail.includes('obaje') ? 'David Byron Obaje' : 'System Administrator';
  const { token, session } = generateToken({ email: cleanEmail, name: adminName });
  session.ip = ip;

  securityAudit.log({
    type: 'AUTH_SUCCESS',
    ip,
    path: '/api/auth/login',
    method: 'POST',
    details: `Admin authenticated successfully: ${cleanEmail}`,
    severity: 'low'
  });

  return { success: true, token, session };
}

/**
 * Invalidate admin session
 */
export function invalidateSession(token: string): boolean {
  return activeSessions.delete(token);
}

export function getActiveSessionsCount(): number {
  return activeSessions.size;
}

/**
 * Express middleware to guard admin routes
 */
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const ip = rateLimiter.getClientIp(req);
  const authHeader = req.headers.authorization;
  const customHeader = req.headers['x-admin-token'] as string;

  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (customHeader) {
    token = customHeader.trim();
  }

  if (!token) {
    securityAudit.log({
      type: 'UNAUTHORIZED_ACCESS',
      ip,
      path: req.originalUrl,
      method: req.method,
      details: 'Missing Authorization token on protected route',
      severity: 'high'
    });
    return res.status(401).json({
      error: 'Unauthorized: Valid Administrator Bearer token is required to perform this action.'
    });
  }

  const session = verifyToken(token);
  if (!session) {
    securityAudit.log({
      type: 'UNAUTHORIZED_ACCESS',
      ip,
      path: req.originalUrl,
      method: req.method,
      details: 'Invalid or expired Authorization token supplied',
      severity: 'high'
    });
    return res.status(403).json({
      error: 'Forbidden: Session token has expired or is invalid. Please log in again.'
    });
  }

  req.adminUser = session;
  next();
}
