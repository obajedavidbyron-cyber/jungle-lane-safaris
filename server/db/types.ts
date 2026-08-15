export type UserRole = 'user' | 'admin';

export interface UserDoc {
  user_id: string;
  email: string;
  display_name: string;
  profile_pic?: string;
  created_at: string;
  role: UserRole;
}

export type DestinationCategory = 'Landmark' | 'Restaurant' | 'Nature' | 'Museum' | 'Activity';

export interface DestinationLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  address?: string;
}

export interface DestinationDoc {
  attraction_id: string;
  name: string;
  slug: string;
  category: DestinationCategory;
  description: string;
  location: DestinationLocation;
  images: string[];
  opening_hours?: string;
  website_url?: string;
  phone_number?: string;
  direct_directions_url?: string;
  average_rating: number; // 0 to 5
  review_count: number;
  is_featured: boolean;
  tags: string[]; // e.g. ["family-friendly", "free", "big-5", "wildlife", "photography"]
}

export interface ItineraryItem {
  attraction_id: string;
  day_number: number;
  notes?: string;
  order: number;
}

export interface ItineraryDoc {
  itinerary_id: string;
  user_id: string;
  title: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  items: ItineraryItem[];
}

export type AnalyticsEventType = 'page_view' | 'outbound_click' | 'bookmark' | 'search' | string;

export interface AnalyticsEventDoc {
  event_id: string;
  user_id?: string;
  session_id: string;
  event_type: AnalyticsEventType;
  target_entity_id: string;
  metadata?: {
    external_url?: string;
    search_term?: string;
    device_type?: 'Mobile' | 'Desktop' | 'Tablet' | string;
    route_path?: string;
    link_type?: string;
    filter_type?: string;
    filter_value?: string;
    [key: string]: any;
  };
  timestamp: string;
}

export interface DestinationQueryParams {
  category?: string;
  tag?: string;
  search?: string;
  is_featured?: boolean;
  limit?: number;
  offset?: number;
}

export interface DatabaseState {
  users: UserDoc[];
  destinations: DestinationDoc[];
  itineraries: ItineraryDoc[];
  analytics_events: AnalyticsEventDoc[];
}
