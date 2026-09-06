import { Request, Response, NextFunction } from 'express';
import { securityAudit } from './auditLog';
import { rateLimiter } from './rateLimiter';

const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/gi,
  /vbscript\s*:/gi,
  /data\s*:\s*text\/html/gi,
  /on\w+\s*=/gi, // onerror=, onload=, onclick=
  /(?:union\s+all\s+select|union\s+select)/gi,
  /(?:drop\s+table|insert\s+into|delete\s+from)/gi,
  /<iframe\b[^>]*>/gi
];

function containsDangerousPattern(value: string): boolean {
  if (typeof value !== 'string') return false;
  return DANGEROUS_PATTERNS.some((pattern) => pattern.test(value));
}

function sanitizeString(value: string): string {
  if (typeof value !== 'string') return value;
  // Strip null bytes
  let cleaned = value.replace(/\0/g, '');
  // Neutralize raw script tags
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Strip javascript: pseudo-protocol
  cleaned = cleaned.replace(/javascript\s*:/gi, 'blocked:');
  return cleaned.trim();
}

function deepSanitize(obj: any, checkOnly: boolean = false): { hasAttack: boolean; sanitized: any } {
  if (obj === null || obj === undefined) {
    return { hasAttack: false, sanitized: obj };
  }

  if (typeof obj === 'string') {
    const isDangerous = containsDangerousPattern(obj);
    return {
      hasAttack: isDangerous,
      sanitized: sanitizeString(obj)
    };
  }

  if (Array.isArray(obj)) {
    let hasAttack = false;
    const sanitized = obj.map((item) => {
      const res = deepSanitize(item, checkOnly);
      if (res.hasAttack) hasAttack = true;
      return res.sanitized;
    });
    return { hasAttack, sanitized };
  }

  if (typeof obj === 'object') {
    let hasAttack = false;
    const sanitized: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      // Validate URLs specifically
      if (typeof val === 'string' && (key.toLowerCase().includes('url') || key.toLowerCase().includes('website'))) {
        const lower = val.trim().toLowerCase();
        if (lower && !lower.startsWith('http://') && !lower.startsWith('https://') && !lower.startsWith('/')) {
          hasAttack = true;
          sanitized[key] = '';
          continue;
        }
      }

      const res = deepSanitize(val, checkOnly);
      if (res.hasAttack) hasAttack = true;
      sanitized[key] = res.sanitized;
    }
    return { hasAttack, sanitized };
  }

  return { hasAttack: false, sanitized: obj };
}

/**
 * Express middleware that inspects and sanitizes all incoming requests
 */
export function requestSanitizer(req: Request, res: Response, next: NextFunction) {
  const ip = rateLimiter.getClientIp(req);

  // Check query parameters
  if (req.query && Object.keys(req.query).length > 0) {
    const { hasAttack, sanitized } = deepSanitize(req.query);
    if (hasAttack) {
      securityAudit.log({
        type: 'SUSPICIOUS_PAYLOAD',
        ip,
        path: req.originalUrl,
        method: req.method,
        details: 'Malicious pattern detected in query parameters',
        severity: 'critical'
      });
      return res.status(400).json({ error: 'Request rejected due to potentially malicious characters.' });
    }
    req.query = sanitized;
  }

  // Check and sanitize body
  if (req.body && typeof req.body === 'object') {
    const { hasAttack, sanitized } = deepSanitize(req.body);
    if (hasAttack) {
      securityAudit.log({
        type: 'SUSPICIOUS_PAYLOAD',
        ip,
        path: req.originalUrl,
        method: req.method,
        details: 'Malicious XSS or injection pattern detected and rejected in request body',
        severity: 'critical'
      });
      return res.status(400).json({ error: 'Request rejected: Potentially malicious script or injection payload detected.' });
    }
    req.body = sanitized;
  }

  next();
}
