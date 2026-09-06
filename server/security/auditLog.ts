import { SecurityEvent, SecurityEventType, SecurityStats } from './types';

class SecurityAuditLogger {
  private events: SecurityEvent[] = [];
  private readonly MAX_EVENTS = 200;

  // Counter metrics
  private stats = {
    totalBlocked: 0,
    rateLimitViolations: 0,
    bruteForceBlocks: 0,
    suspiciousPayloads: 0,
    unauthorizedAttempts: 0,
    lastAttack: null as string | null
  };

  public log(params: {
    type: SecurityEventType;
    ip: string;
    path: string;
    method: string;
    details: string;
    severity?: SecurityEvent['severity'];
    userAgent?: string;
  }): SecurityEvent {
    const defaultSeverity: Record<SecurityEventType, SecurityEvent['severity']> = {
      AUTH_SUCCESS: 'low',
      AUTH_FAILURE: 'medium',
      BRUTE_FORCE_BLOCKED: 'critical',
      RATE_LIMIT_EXCEEDED: 'medium',
      UNAUTHORIZED_ACCESS: 'high',
      SUSPICIOUS_PAYLOAD: 'critical',
      SESSION_EXPIRED: 'low',
      ADMIN_ACTION: 'low'
    };

    const event: SecurityEvent = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      type: params.type,
      ip: params.ip || 'unknown',
      path: params.path || '/',
      method: params.method || 'GET',
      details: params.details,
      severity: params.severity || defaultSeverity[params.type] || 'medium',
      userAgent: params.userAgent ? params.userAgent.substring(0, 100) : undefined
    };

    // Update counters
    if (event.severity === 'high' || event.severity === 'critical') {
      this.stats.totalBlocked++;
      this.stats.lastAttack = event.timestamp;
    }

    if (params.type === 'RATE_LIMIT_EXCEEDED') {
      this.stats.rateLimitViolations++;
      this.stats.totalBlocked++;
    } else if (params.type === 'BRUTE_FORCE_BLOCKED') {
      this.stats.bruteForceBlocks++;
    } else if (params.type === 'SUSPICIOUS_PAYLOAD') {
      this.stats.suspiciousPayloads++;
    } else if (params.type === 'UNAUTHORIZED_ACCESS') {
      this.stats.unauthorizedAttempts++;
    }

    // Add to circular log
    this.events.unshift(event);
    if (this.events.length > this.MAX_EVENTS) {
      this.events.pop();
    }

    return event;
  }

  public getRecentEvents(limit: number = 50, typeFilter?: SecurityEventType): SecurityEvent[] {
    if (typeFilter) {
      return this.events.filter((e) => e.type === typeFilter).slice(0, limit);
    }
    return this.events.slice(0, limit);
  }

  public getStats(activeSessionsCount: number = 0, trackedIPsCount: number = 0): SecurityStats {
    // Health score starts at 100 and docks points if there are unresolved critical alerts
    const healthScore = Math.max(85, 100 - (this.stats.bruteForceBlocks > 0 ? 5 : 0) - (this.stats.suspiciousPayloads > 0 ? 5 : 0));

    return {
      firewallActive: true,
      totalBlockedAttacks: this.stats.totalBlocked,
      activeSessionsCount,
      rateLimitViolations: this.stats.rateLimitViolations,
      bruteForceBlocks: this.stats.bruteForceBlocks,
      suspiciousPayloadsBlocked: this.stats.suspiciousPayloads,
      unauthorizedAttempts: this.stats.unauthorizedAttempts,
      activeRateLimitTrackedIPs: trackedIPsCount,
      securityHealthScore: healthScore,
      lastAttackTimestamp: this.stats.lastAttack
    };
  }

  public clearLogs() {
    this.events = [];
    this.stats = {
      totalBlocked: 0,
      rateLimitViolations: 0,
      bruteForceBlocks: 0,
      suspiciousPayloads: 0,
      unauthorizedAttempts: 0,
      lastAttack: null
    };
  }
}

export const securityAudit = new SecurityAuditLogger();
