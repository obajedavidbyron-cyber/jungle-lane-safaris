import { DestinationDoc, ItineraryDoc, ItineraryItem, UserDoc, AnalyticsEventDoc } from '../types';

const API_BASE = '/api';

/**
 * Retrieve admin authorization header if authenticated
 */
export function getAdminAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('jls_admin_auth_session');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.token) {
        return { Authorization: `Bearer ${parsed.token}` };
      }
    }
  } catch {}
  return {};
}

/**
 * Generate or retrieve persistent client session ID
 */
function getClientSessionId(): string {
  if (typeof window === 'undefined') return 'sess_server';
  let sid = sessionStorage.getItem('jls_session_id');
  if (!sid) {
    sid = `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    sessionStorage.setItem('jls_session_id', sid);
  }
  return sid;
}

/**
 * Detect client device category
 */
function detectDeviceType(): 'Mobile' | 'Desktop' | 'Tablet' {
  if (typeof window === 'undefined') return 'Desktop';
  const width = window.innerWidth;
  if (width < 640) return 'Mobile';
  if (width < 1024) return 'Tablet';
  return 'Desktop';
}

// =========================================================================
// 1. DESTINATIONS DATA ACCESS SERVICE
// =========================================================================

export const destinationApi = {
  /**
   * Fetch destinations with optional category, tag, search, or featured filtering
   */
  async fetchAll(params?: {
    category?: string;
    tag?: string;
    search?: string;
    is_featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ data: DestinationDoc[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.tag) query.set('tag', params.tag);
    if (params?.search) query.set('search', params.search);
    if (params?.is_featured !== undefined) query.set('is_featured', String(params.is_featured));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));

    const url = `${API_BASE}/destinations${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch destinations');
    return res.json();
  },

  /**
   * Fetch single destination by slug or attraction ID
   */
  async fetchBySlugOrId(idOrSlug: string): Promise<DestinationDoc | null> {
    const res = await fetch(`${API_BASE}/destinations/${encodeURIComponent(idOrSlug)}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch destination');
    const json = await res.json();
    return json.destination;
  },

  /**
   * Create new destination
   */
  async create(payload: Partial<DestinationDoc>): Promise<DestinationDoc> {
    const res = await fetch(`${API_BASE}/destinations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAdminAuthHeader()
      },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to create destination');
    }
    return json.destination;
  },

  /**
   * Update destination
   */
  async update(id: string, updates: Partial<DestinationDoc>): Promise<DestinationDoc> {
    const res = await fetch(`${API_BASE}/destinations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAdminAuthHeader()
      },
      body: JSON.stringify(updates)
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to update destination');
    }
    return json.destination;
  },

  /**
   * Delete destination
   */
  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/destinations/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAdminAuthHeader()
      }
    });
    return res.ok;
  }
};

// =========================================================================
// 2. ITINERARIES DATA ACCESS SERVICE
// =========================================================================

export const itineraryApi = {
  /**
   * Fetch user's saved itineraries or public ones
   */
  async fetchUserItineraries(userId: string): Promise<ItineraryDoc[]> {
    const res = await fetch(`${API_BASE}/itineraries?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('Failed to fetch user itineraries');
    const json = await res.json();
    return json.itineraries || [];
  },

  async fetchPublicItineraries(): Promise<ItineraryDoc[]> {
    const res = await fetch(`${API_BASE}/itineraries?publicOnly=true`);
    if (!res.ok) throw new Error('Failed to fetch public itineraries');
    const json = await res.json();
    return json.itineraries || [];
  },

  async fetchById(id: string): Promise<ItineraryDoc | null> {
    const res = await fetch(`${API_BASE}/itineraries/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch itinerary');
    const json = await res.json();
    return json.itinerary;
  },

  async create(payload: Partial<ItineraryDoc>): Promise<ItineraryDoc> {
    const res = await fetch(`${API_BASE}/itineraries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create itinerary');
    return json.itinerary;
  },

  async update(id: string, updates: Partial<ItineraryDoc>): Promise<ItineraryDoc> {
    const res = await fetch(`${API_BASE}/itineraries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update itinerary');
    return json.itinerary;
  },

  /**
   * Add attraction spot to itinerary
   */
  async addAttraction(
    itineraryId: string,
    item: { attraction_id: string; day_number?: number; notes?: string }
  ): Promise<ItineraryDoc> {
    const res = await fetch(`${API_BASE}/itineraries/${itineraryId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to add attraction to itinerary');
    return json.itinerary;
  },

  /**
   * Remove attraction from itinerary
   */
  async removeAttraction(itineraryId: string, attractionId: string): Promise<ItineraryDoc> {
    const res = await fetch(`${API_BASE}/itineraries/${itineraryId}/items/${attractionId}`, {
      method: 'DELETE'
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to remove attraction from itinerary');
    return json.itinerary;
  },

  /**
   * Reorder items in itinerary
   */
  async reorderItems(itineraryId: string, items: ItineraryItem[]): Promise<ItineraryDoc> {
    const res = await fetch(`${API_BASE}/itineraries/${itineraryId}/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to reorder itinerary items');
    return json.itinerary;
  },

  async delete(itineraryId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/itineraries/${itineraryId}`, {
      method: 'DELETE',
      headers: {
        ...getAdminAuthHeader()
      }
    });
    return res.ok;
  }
};

// =========================================================================
// 3. ASYNC NON-BLOCKING ANALYTICS LOGGING SERVICE
// =========================================================================

/**
 * Non-blocking event logger helper function
 * Employs navigator.sendBeacon or non-blocking fire-and-forget fetch
 */
export function logEvent(
  eventType: string,
  metadata: Record<string, any> = {},
  targetEntityId = 'general',
  userId?: string
): void {
  try {
    const payload: Partial<AnalyticsEventDoc> = {
      event_id: `evt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      session_id: getClientSessionId(),
      event_type: eventType,
      target_entity_id: targetEntityId,
      user_id: userId,
      metadata: {
        ...metadata,
        device_type: detectDeviceType(),
        route_path: typeof window !== 'undefined' ? window.location.pathname + window.location.hash : ''
      },
      timestamp: new Date().toISOString()
    };

    const serialized = JSON.stringify(payload);

    // Prefer navigator.sendBeacon for true non-blocking background transmission
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([serialized], { type: 'application/json' });
      const sent = navigator.sendBeacon('/api/events', blob);
      if (sent) return;
    }

    // Fallback: asynchronous background fetch
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: serialized,
      keepalive: true
    }).catch(() => {
      // Intentionally suppress logging failures to guarantee zero UI interruption
    });
  } catch {
    // Zero-impact safeguard
  }
}

// =========================================================================
// 4. USERS DATA ACCESS SERVICE (Admin Protected)
// =========================================================================

export const userApi = {
  async fetchAll(): Promise<UserDoc[]> {
    const res = await fetch(`${API_BASE}/users`, {
      headers: {
        ...getAdminAuthHeader()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    const json = await res.json();
    return json.users || [];
  },

  async fetchByIdOrEmail(idOrEmail: string): Promise<UserDoc | null> {
    const res = await fetch(`${API_BASE}/users/${encodeURIComponent(idOrEmail)}`, {
      headers: {
        ...getAdminAuthHeader()
      }
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch user');
    const json = await res.json();
    return json.user;
  },

  async create(payload: Partial<UserDoc>): Promise<UserDoc> {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAdminAuthHeader()
      },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create user');
    return json.user;
  },

  async update(id: string, updates: Partial<UserDoc>): Promise<UserDoc> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAdminAuthHeader()
      },
      body: JSON.stringify(updates)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update user');
    return json.user;
  },

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAdminAuthHeader()
      }
    });
    return res.ok;
  }
};

// =========================================================================
// 5. DATABASE SEEDING & STATUS SERVICE (Admin Protected)
// =========================================================================

export const databaseAdminApi = {
  async getStatus(): Promise<any> {
    const res = await fetch(`${API_BASE}/db/status`);
    if (!res.ok) throw new Error('Failed to get DB status');
    return res.json();
  },

  async seedDatabase(): Promise<any> {
    const res = await fetch(`${API_BASE}/db/seed`, {
      method: 'POST',
      headers: {
        ...getAdminAuthHeader()
      }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to seed database');
    }
    return res.json();
  }
};

// =========================================================================
// 6. AUTHENTICATION & SECURITY SHIELD API
// =========================================================================

export const authApi = {
  async login(email: string, passcode: string): Promise<{
    success: boolean;
    token?: string;
    expiresIn?: number;
    user?: { email: string; name: string; role: 'admin' };
    error?: string;
  }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, passcode })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Authentication failed');
    }
    return data;
  },

  async verify(token: string): Promise<{ valid: boolean; user?: any }> {
    const res = await fetch(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    return res.json();
  },

  async logout(token: string): Promise<void> {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    }).catch(() => {});
  }
};

export const securityApi = {
  async getStatus(): Promise<{
    success: boolean;
    status: {
      status: string;
      firewall: string;
      rateLimiter: string;
      xssSanitizer: string;
      tokenEngine: string;
      activeSessions: number;
      blockedIpsCount: number;
      securityEventsCount: number;
      summaryStats: Record<string, number>;
      timestamp: string;
    };
  }> {
    const res = await fetch(`${API_BASE}/security/status`, {
      headers: {
        ...getAdminAuthHeader()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch security status');
    return res.json();
  },

  async getAuditLog(limit = 100, type?: string): Promise<{
    success: boolean;
    events: Array<{
      id: string;
      timestamp: string;
      type: string;
      ip: string;
      path: string;
      method: string;
      details: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
    }>;
    total: number;
    summary: Record<string, number>;
  }> {
    const query = new URLSearchParams();
    if (limit) query.set('limit', String(limit));
    if (type) query.set('type', type);
    const res = await fetch(`${API_BASE}/security/audit-log?${query.toString()}`, {
      headers: {
        ...getAdminAuthHeader()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch security audit log');
    return res.json();
  },

  async flushBlockedIPs(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/security/flush-blocked-ips`, {
      method: 'POST',
      headers: {
        ...getAdminAuthHeader()
      }
    });
    if (!res.ok) throw new Error('Failed to flush blocked IPs');
    return res.json();
  }
};
