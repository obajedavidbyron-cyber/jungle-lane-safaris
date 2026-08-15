import {
  UserDoc,
  DestinationDoc,
  ItineraryDoc,
  AnalyticsEventDoc,
  DestinationQueryParams,
  DatabaseState
} from './types';
import { DataValidator, sanitizeString } from './validator';
import {
  SEED_USERS,
  SEED_DESTINATIONS,
  SEED_ITINERARIES,
  SEED_ANALYTICS_EVENTS
} from './seedData';

export class DatabaseStore {
  private static instance: DatabaseStore;

  private users: Map<string, UserDoc> = new Map();
  private destinations: Map<string, DestinationDoc> = new Map();
  private itineraries: Map<string, ItineraryDoc> = new Map();
  private analyticsEvents: AnalyticsEventDoc[] = [];

  private constructor() {
    this.seed();
  }

  public static getInstance(): DatabaseStore {
    if (!DatabaseStore.instance) {
      DatabaseStore.instance = new DatabaseStore();
    }
    return DatabaseStore.instance;
  }

  /**
   * Seed the database with initial rich sample dataset
   */
  public seed(): void {
    this.users.clear();
    this.destinations.clear();
    this.itineraries.clear();
    this.analyticsEvents = [];

    // Seed users
    for (const u of SEED_USERS) {
      this.users.set(u.user_id, { ...u });
    }

    // Seed destinations
    for (const d of SEED_DESTINATIONS) {
      this.destinations.set(d.attraction_id, { ...d });
    }

    // Seed itineraries
    for (const itin of SEED_ITINERARIES) {
      this.itineraries.set(itin.itinerary_id, {
        ...itin,
        items: [...itin.items]
      });
    }

    // Seed analytics
    for (const ev of SEED_ANALYTICS_EVENTS) {
      this.analyticsEvents.push({ ...ev });
    }
  }

  /**
   * Reset database collections
   */
  public resetToZero(): void {
    this.analyticsEvents = [];
  }

  // =========================================================================
  // DESTINATIONS / ATTRACTIONS CRUD & QUERY ENGINE
  // =========================================================================

  public getAllDestinations(params?: DestinationQueryParams): DestinationDoc[] {
    let list = Array.from(this.destinations.values());

    if (!params) return list;

    // Filter by category
    if (params.category && params.category.trim() !== '' && params.category.toLowerCase() !== 'all') {
      const cat = params.category.trim().toLowerCase();
      list = list.filter((d) => d.category.toLowerCase() === cat);
    }

    // Filter by tag
    if (params.tag && params.tag.trim() !== '') {
      const tagQuery = params.tag.trim().toLowerCase();
      list = list.filter((d) => d.tags.some((t) => t.toLowerCase() === tagQuery));
    }

    // Filter by is_featured
    if (typeof params.is_featured === 'boolean') {
      list = list.filter((d) => d.is_featured === params.is_featured);
    }

    // Search query in name, description, city, country, tags
    if (params.search && params.search.trim() !== '') {
      const term = params.search.trim().toLowerCase();
      list = list.filter((d) => {
        return (
          d.name.toLowerCase().includes(term) ||
          d.description.toLowerCase().includes(term) ||
          d.location.city.toLowerCase().includes(term) ||
          d.location.country.toLowerCase().includes(term) ||
          d.tags.some((t) => t.toLowerCase().includes(term))
        );
      });
    }

    // Pagination
    const offset = params.offset || 0;
    const limit = params.limit || 50;

    return list.slice(offset, offset + limit);
  }

  public getDestinationById(id: string): DestinationDoc | null {
    return this.destinations.get(id) || null;
  }

  public getDestinationBySlug(slug: string): DestinationDoc | null {
    const cleanSlug = slug.trim().toLowerCase();
    for (const d of this.destinations.values()) {
      if (d.slug === cleanSlug) return d;
    }
    return null;
  }

  public createDestination(input: Partial<DestinationDoc>): DestinationDoc {
    const id = input.attraction_id || `attr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const candidate = {
      ...input,
      attraction_id: id
    };

    const validated = DataValidator.validateDestination(candidate);

    // Check slug collision
    if (this.getDestinationBySlug(validated.slug)) {
      validated.slug = `${validated.slug}-${Math.random().toString(36).substring(2, 5)}`;
    }

    this.destinations.set(validated.attraction_id, validated);
    return validated;
  }

  public updateDestination(id: string, updates: Partial<DestinationDoc>): DestinationDoc | null {
    const existing = this.destinations.get(id);
    if (!existing) return null;

    const merged = {
      ...existing,
      ...updates,
      attraction_id: id,
      location: {
        ...existing.location,
        ...(updates.location || {})
      }
    };

    const validated = DataValidator.validateDestination(merged);
    this.destinations.set(id, validated);
    return validated;
  }

  public deleteDestination(id: string): boolean {
    return this.destinations.delete(id);
  }

  // =========================================================================
  // ITINERARIES / SAVED SPOTS CRUD
  // =========================================================================

  public getAllItineraries(onlyPublic = false): ItineraryDoc[] {
    const list = Array.from(this.itineraries.values());
    if (onlyPublic) {
      return list.filter((i) => i.is_public);
    }
    return list;
  }

  public getUserItineraries(userId: string): ItineraryDoc[] {
    return Array.from(this.itineraries.values()).filter((i) => i.user_id === userId);
  }

  public getItineraryById(id: string): ItineraryDoc | null {
    return this.itineraries.get(id) || null;
  }

  public createItinerary(input: Partial<ItineraryDoc>): ItineraryDoc {
    const id = input.itinerary_id || `itin_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const candidate = {
      ...input,
      itinerary_id: id,
      created_at: input.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: input.items || []
    };

    const validated = DataValidator.validateItinerary(candidate);
    this.itineraries.set(validated.itinerary_id, validated);
    return validated;
  }

  public updateItinerary(id: string, updates: Partial<ItineraryDoc>): ItineraryDoc | null {
    const existing = this.itineraries.get(id);
    if (!existing) return null;

    const merged = {
      ...existing,
      ...updates,
      itinerary_id: id,
      updated_at: new Date().toISOString()
    };

    const validated = DataValidator.validateItinerary(merged);
    this.itineraries.set(id, validated);
    return validated;
  }

  public addAttractionToItinerary(
    itineraryId: string,
    item: { attraction_id: string; day_number?: number; notes?: string }
  ): ItineraryDoc | null {
    const itinerary = this.itineraries.get(itineraryId);
    if (!itinerary) return null;

    const nextOrder = itinerary.items.length;
    const newItem = {
      attraction_id: sanitizeString(item.attraction_id),
      day_number: Math.max(1, Math.floor(Number(item.day_number) || 1)),
      notes: item.notes ? sanitizeString(item.notes) : undefined,
      order: nextOrder
    };

    itinerary.items.push(newItem);
    itinerary.updated_at = new Date().toISOString();
    this.itineraries.set(itineraryId, itinerary);
    return itinerary;
  }

  public removeAttractionFromItinerary(itineraryId: string, attractionId: string): ItineraryDoc | null {
    const itinerary = this.itineraries.get(itineraryId);
    if (!itinerary) return null;

    itinerary.items = itinerary.items
      .filter((item) => item.attraction_id !== attractionId)
      .map((item, idx) => ({ ...item, order: idx }));

    itinerary.updated_at = new Date().toISOString();
    this.itineraries.set(itineraryId, itinerary);
    return itinerary;
  }

  public reorderItineraryItems(
    itineraryId: string,
    newItems: Array<{ attraction_id: string; day_number: number; notes?: string; order: number }>
  ): ItineraryDoc | null {
    const itinerary = this.itineraries.get(itineraryId);
    if (!itinerary) return null;

    itinerary.items = newItems.map((item, idx) => ({
      attraction_id: sanitizeString(item.attraction_id),
      day_number: Math.max(1, Math.floor(Number(item.day_number) || 1)),
      notes: item.notes ? sanitizeString(item.notes) : undefined,
      order: idx
    }));

    itinerary.updated_at = new Date().toISOString();
    this.itineraries.set(itineraryId, itinerary);
    return itinerary;
  }

  public deleteItinerary(id: string): boolean {
    return this.itineraries.delete(id);
  }

  // =========================================================================
  // USERS CRUD
  // =========================================================================

  public getAllUsers(): UserDoc[] {
    return Array.from(this.users.values());
  }

  public getUserById(id: string): UserDoc | null {
    return this.users.get(id) || null;
  }

  public getUserByEmail(email: string): UserDoc | null {
    const clean = email.trim().toLowerCase();
    for (const u of this.users.values()) {
      if (u.email === clean) return u;
    }
    return null;
  }

  public createUser(input: Partial<UserDoc>): UserDoc {
    const id = input.user_id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const candidate = {
      ...input,
      user_id: id
    };

    const validated = DataValidator.validateUser(candidate);
    this.users.set(validated.user_id, validated);
    return validated;
  }

  public updateUser(id: string, updates: Partial<UserDoc>): UserDoc | null {
    const existing = this.users.get(id);
    if (!existing) return null;

    const merged = {
      ...existing,
      ...updates,
      user_id: id
    };

    const validated = DataValidator.validateUser(merged);
    this.users.set(id, validated);
    return validated;
  }

  public deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  // =========================================================================
  // ANALYTICS & TRAFFIC EVENTS LOGGING
  // =========================================================================

  public logEvent(event: Partial<AnalyticsEventDoc>): AnalyticsEventDoc {
    const candidate = {
      event_id: event.event_id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      session_id: event.session_id || `sess_${Math.random().toString(36).substring(2, 9)}`,
      event_type: event.event_type || 'page_view',
      target_entity_id: event.target_entity_id || 'general',
      user_id: event.user_id,
      metadata: event.metadata || {},
      timestamp: event.timestamp || new Date().toISOString()
    };

    const validated = DataValidator.validateAnalyticsEvent(candidate);
    this.analyticsEvents.push(validated);

    // Keep memory capped if events exceed 50,000
    if (this.analyticsEvents.length > 50000) {
      this.analyticsEvents.shift();
    }

    return validated;
  }

  public getEvents(params?: { limit?: number; eventType?: string }): AnalyticsEventDoc[] {
    let list = [...this.analyticsEvents];
    if (params?.eventType) {
      list = list.filter((e) => e.event_type === params.eventType);
    }
    if (params?.limit) {
      list = list.slice(-params.limit);
    }
    return list;
  }

  public getDatabaseSummary(): {
    destinationsCount: number;
    usersCount: number;
    itinerariesCount: number;
    eventsCount: number;
  } {
    return {
      destinationsCount: this.destinations.size,
      usersCount: this.users.size,
      itinerariesCount: this.itineraries.size,
      eventsCount: this.analyticsEvents.length
    };
  }
}

export const dbStore = DatabaseStore.getInstance();
