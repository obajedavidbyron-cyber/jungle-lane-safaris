export type SecurityEventType =
  | 'AUTH_SUCCESS'
  | 'AUTH_FAILURE'
  | 'BRUTE_FORCE_BLOCKED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'UNAUTHORIZED_ACCESS'
  | 'SUSPICIOUS_PAYLOAD'
  | 'SESSION_EXPIRED'
  | 'ADMIN_ACTION';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: SecurityEventType;
  ip: string;
  path: string;
  method: string;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userAgent?: string;
}

export interface AdminSession {
  token: string;
  email: string;
  name: string;
  role: 'admin';
  createdAt: string;
  expiresAt: string;
  ip: string;
}

export interface SecurityStats {
  firewallActive: boolean;
  totalBlockedAttacks: number;
  activeSessionsCount: number;
  rateLimitViolations: number;
  bruteForceBlocks: number;
  suspiciousPayloadsBlocked: number;
  unauthorizedAttempts: number;
  activeRateLimitTrackedIPs: number;
  securityHealthScore: number;
  lastAttackTimestamp: string | null;
}
