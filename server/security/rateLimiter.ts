import { Request, Response, NextFunction } from 'express';
import { securityAudit } from './auditLog';

interface RateLimitRecord {
  count: number;
  resetTime: number;
  failedAuthAttempts?: number;
  lockedUntil?: number;
}

export class RateLimiter {
  private ipRecords: Map<string, RateLimitRecord> = new Map();
  private authFailures: Map<string, { count: number; lockedUntil: number }> = new Map();

  constructor() {
    // Periodically clean expired IP records every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  public getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket.remoteAddress || '127.0.0.1';
  }

  public getTrackedIPsCount(): number {
    return this.ipRecords.size + this.authFailures.size;
  }

  /**
   * General sliding window rate limiter
   */
  public createMiddleware(options: {
    windowMs: number;
    maxRequests: number;
    name: string;
    message?: string;
  }) {
    return (req: Request, res: Response, next: NextFunction) => {
      const ip = this.getClientIp(req);
      const now = Date.now();
      const key = `${options.name}:${ip}`;

      let record = this.ipRecords.get(key);

      if (!record || now > record.resetTime) {
        record = { count: 1, resetTime: now + options.windowMs };
        this.ipRecords.set(key, record);
      } else {
        record.count++;
      }

      const remaining = Math.max(0, options.maxRequests - record.count);
      res.setHeader('X-RateLimit-Limit', options.maxRequests);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

      if (record.count > options.maxRequests) {
        securityAudit.log({
          type: 'RATE_LIMIT_EXCEEDED',
          ip,
          path: req.originalUrl,
          method: req.method,
          details: `Rate limit of ${options.maxRequests} req / ${options.windowMs / 1000}s exceeded on ${options.name}`,
          userAgent: req.headers['user-agent']
        });

        const retryAfter = Math.ceil((record.resetTime - now) / 1000);
        res.setHeader('Retry-After', retryAfter);
        return res.status(429).json({
          error: options.message || 'Too many requests. Please slow down and try again shortly.',
          retryAfterSeconds: retryAfter
        });
      }

      next();
    };
  }

  /**
   * Brute-force protection for login attempts
   */
  public checkAuthLockout(ip: string): { isLocked: boolean; remainingSeconds: number } {
    const record = this.authFailures.get(ip);
    if (!record) return { isLocked: false, remainingSeconds: 0 };

    const now = Date.now();
    if (now < record.lockedUntil) {
      const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return { isLocked: true, remainingSeconds };
    }

    if (now >= record.lockedUntil && record.lockedUntil > 0) {
      // Lockout expired, reset
      this.authFailures.delete(ip);
    }

    return { isLocked: false, remainingSeconds: 0 };
  }

  public recordAuthFailure(ip: string, maxAttempts: number = 5, lockoutDurationMs: number = 15 * 60 * 1000) {
    const now = Date.now();
    let record = this.authFailures.get(ip);

    if (!record) {
      record = { count: 1, lockedUntil: 0 };
    } else {
      record.count++;
    }

    if (record.count >= maxAttempts) {
      record.lockedUntil = now + lockoutDurationMs;
      securityAudit.log({
        type: 'BRUTE_FORCE_BLOCKED',
        ip,
        path: '/api/auth/login',
        method: 'POST',
        details: `IP locked out for ${lockoutDurationMs / 60000} mins after ${record.count} consecutive failed login attempts`,
        severity: 'critical'
      });
    }

    this.authFailures.set(ip, record);
    return record;
  }

  public recordAuthSuccess(ip: string) {
    this.authFailures.delete(ip);
  }

  public flushBlockedIPs() {
    this.authFailures.clear();
    this.ipRecords.clear();
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, record] of this.ipRecords.entries()) {
      if (now > record.resetTime) {
        this.ipRecords.delete(key);
      }
    }
    for (const [ip, record] of this.authFailures.entries()) {
      if (now > record.lockedUntil && record.lockedUntil > 0) {
        this.authFailures.delete(ip);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();
