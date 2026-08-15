import { DestinationDoc, ItineraryDoc, UserDoc, AnalyticsEventDoc, DestinationCategory, UserRole } from './types';

export class ValidationError extends Error {
  public fieldErrors: Record<string, string>;

  constructor(message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Basic XSS sanitizer: strips dangerous script/tag elements and trims whitespace
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>?/gm, '')
    .trim();
}

export function sanitizeUrl(input: unknown): string {
  if (typeof input !== 'string') return '';
  const trimmed = input.trim();
  if (/^(https?:\/\/|mailto:|tel:|\/)/i.test(trimmed)) {
    return trimmed;
  }
  return '';
}

export const VALID_CATEGORIES: DestinationCategory[] = ['Landmark', 'Restaurant', 'Nature', 'Museum', 'Activity'];
export const VALID_ROLES: UserRole[] = ['user', 'admin'];

export class DataValidator {
  /**
   * Validate & sanitize a User document
   */
  static validateUser(data: any): UserDoc {
    const errors: Record<string, string> = {};

    if (!data.user_id || typeof data.user_id !== 'string') {
      errors.user_id = 'user_id is required and must be a valid string.';
    }

    if (!data.email || typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Valid email is required.';
    }

    if (!data.display_name || typeof data.display_name !== 'string') {
      errors.display_name = 'display_name is required.';
    }

    const role: UserRole = VALID_ROLES.includes(data.role) ? data.role : 'user';

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('User validation failed', errors);
    }

    return {
      user_id: sanitizeString(data.user_id),
      email: sanitizeString(data.email).toLowerCase(),
      display_name: sanitizeString(data.display_name),
      profile_pic: data.profile_pic ? sanitizeUrl(data.profile_pic) : undefined,
      created_at: data.created_at || new Date().toISOString(),
      role
    };
  }

  /**
   * Validate & sanitize a Destination / Attraction document
   */
  static validateDestination(data: any): DestinationDoc {
    const errors: Record<string, string> = {};

    if (!data.attraction_id || typeof data.attraction_id !== 'string') {
      errors.attraction_id = 'attraction_id is required.';
    }

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
      errors.name = 'name is required and must be at least 2 characters.';
    }

    let slug = typeof data.slug === 'string' ? data.slug.trim().toLowerCase() : '';
    if (!slug && data.name) {
      slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      errors.slug = 'Valid slug (letters, numbers, hyphens) is required.';
    }

    if (!data.category || !VALID_CATEGORIES.includes(data.category)) {
      errors.category = `category must be one of: ${VALID_CATEGORIES.join(', ')}.`;
    }

    if (!data.description || typeof data.description !== 'string') {
      errors.description = 'description is required.';
    }

    // Location validation
    if (!data.location || typeof data.location !== 'object') {
      errors.location = 'location object is required.';
    } else {
      const lat = Number(data.location.latitude);
      const lng = Number(data.location.longitude);

      if (isNaN(lat) || lat < -90 || lat > 90) {
        errors['location.latitude'] = 'latitude must be a valid number between -90 and 90.';
      }
      if (isNaN(lng) || lng < -180 || lng > 180) {
        errors['location.longitude'] = 'longitude must be a valid number between -180 and 180.';
      }
      if (!data.location.city || typeof data.location.city !== 'string') {
        errors['location.city'] = 'location.city is required.';
      }
      if (!data.location.country || typeof data.location.country !== 'string') {
        errors['location.country'] = 'location.country is required.';
      }
    }

    // Images
    const images: string[] = Array.isArray(data.images)
      ? data.images.map((img: any) => sanitizeUrl(img)).filter(Boolean)
      : [];

    if (images.length === 0) {
      images.push('https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80');
    }

    // Tags
    const tags: string[] = Array.isArray(data.tags)
      ? data.tags.map((t: any) => sanitizeString(t).toLowerCase()).filter(Boolean)
      : [];

    // Ratings
    const avgRating = Number(data.average_rating ?? 4.8);
    const validRating = isNaN(avgRating) ? 4.8 : Math.max(0, Math.min(5, Number(avgRating.toFixed(1))));

    const revCount = Number(data.review_count ?? 0);
    const validReviews = isNaN(revCount) ? 0 : Math.max(0, Math.floor(revCount));

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Destination validation failed', errors);
    }

    return {
      attraction_id: sanitizeString(data.attraction_id),
      name: sanitizeString(data.name),
      slug,
      category: data.category as DestinationCategory,
      description: sanitizeString(data.description),
      location: {
        city: sanitizeString(data.location.city),
        country: sanitizeString(data.location.country),
        latitude: Number(data.location.latitude),
        longitude: Number(data.location.longitude),
        address: data.location.address ? sanitizeString(data.location.address) : undefined
      },
      images,
      opening_hours: data.opening_hours ? sanitizeString(data.opening_hours) : undefined,
      website_url: data.website_url ? sanitizeUrl(data.website_url) : undefined,
      phone_number: data.phone_number ? sanitizeString(data.phone_number) : undefined,
      direct_directions_url: data.direct_directions_url ? sanitizeUrl(data.direct_directions_url) : undefined,
      average_rating: validRating,
      review_count: validReviews,
      is_featured: Boolean(data.is_featured),
      tags
    };
  }

  /**
   * Validate & sanitize an Itinerary document
   */
  static validateItinerary(data: any): ItineraryDoc {
    const errors: Record<string, string> = {};

    if (!data.itinerary_id || typeof data.itinerary_id !== 'string') {
      errors.itinerary_id = 'itinerary_id is required.';
    }

    if (!data.user_id || typeof data.user_id !== 'string') {
      errors.user_id = 'user_id is required.';
    }

    if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 2) {
      errors.title = 'title is required and must be at least 2 characters.';
    }

    if (!Array.isArray(data.items)) {
      errors.items = 'items must be an array.';
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Itinerary validation failed', errors);
    }

    const items = (data.items || []).map((item: any, idx: number) => ({
      attraction_id: sanitizeString(item.attraction_id),
      day_number: Math.max(1, Math.floor(Number(item.day_number) || 1)),
      notes: item.notes ? sanitizeString(item.notes) : undefined,
      order: typeof item.order === 'number' ? item.order : idx
    }));

    return {
      itinerary_id: sanitizeString(data.itinerary_id),
      user_id: sanitizeString(data.user_id),
      title: sanitizeString(data.title),
      is_public: Boolean(data.is_public),
      created_at: data.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items
    };
  }

  /**
   * Validate & sanitize an Analytics Event document
   */
  static validateAnalyticsEvent(data: any): AnalyticsEventDoc {
    const errors: Record<string, string> = {};

    if (!data.event_id || typeof data.event_id !== 'string') {
      errors.event_id = 'event_id is required.';
    }

    if (!data.session_id || typeof data.session_id !== 'string') {
      errors.session_id = 'session_id is required.';
    }

    if (!data.event_type || typeof data.event_type !== 'string') {
      errors.event_type = 'event_type is required.';
    }

    if (!data.target_entity_id || typeof data.target_entity_id !== 'string') {
      errors.target_entity_id = 'target_entity_id is required.';
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Analytics event validation failed', errors);
    }

    return {
      event_id: sanitizeString(data.event_id),
      user_id: data.user_id ? sanitizeString(data.user_id) : undefined,
      session_id: sanitizeString(data.session_id),
      event_type: sanitizeString(data.event_type),
      target_entity_id: sanitizeString(data.target_entity_id),
      metadata: typeof data.metadata === 'object' && data.metadata !== null ? data.metadata : {},
      timestamp: data.timestamp || new Date().toISOString()
    };
  }
}
