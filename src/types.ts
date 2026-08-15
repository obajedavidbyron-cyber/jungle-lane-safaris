export interface SafariPackage {
  id: string;
  title: string;
  tag: 'Best Seller' | 'Family Friendly' | 'Luxury Choice' | 'Top Recommended' | 'Day Excursion';
  category: 'day' | 'multi' | 'luxury' | 'budget';
  durationDays: number;
  durationLabel: string;
  priceFromUSD: number;
  location: string;
  destinations: string[];
  imageUrl: string;
  shortDescription: string;
  keyHighlights: string[];
  dayByDay: {
    day: number;
    title: string;
    description: string;
    overnight?: string;
    meals?: string;
  }[];
  inclusions: string[];
  exclusions: string[];
}

export interface Destination {
  id: string;
  name: string;
  tagline: string;
  highlights: string[];
  description: string;
  imageUrl: string;
  bestTimeToVisit: string;
  famousFor: string;
  recommendedDuration: string;
}

export interface Testimonial {
  id: string;
  guestName: string;
  country: string;
  flagEmoji: string;
  rating: number;
  title: string;
  comment: string;
  safariTaken: string;
  date: string;
  avatarUrl: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  imageUrl: string;
  content: string;
}

export interface FilterState {
  destination: string;
  duration: string;
  travelStyle: string;
}

export interface CustomQuoteRequest {
  fullName: string;
  email: string;
  phone: string;
  travelDates: string;
  guestsCount: string;
  durationDays: string;
  preferredDestinations: string[];
  travelStyle: 'Budget' | 'Mid-Range' | 'Luxury' | 'Private Group';
  specialRequirements: string;
}

// ==========================================
// Analytics & Event Tracking Interfaces
// ==========================================

export type EventType =
  | 'destination_view'
  | 'package_view'
  | 'bookmark_itinerary'
  | 'external_click'
  | 'search_query'
  | 'filter_usage'
  | 'page_view'
  | 'quote_submit'
  | 'ai_itinerary_generate';

export type EntityType =
  | 'destination'
  | 'package'
  | 'partner_link'
  | 'directions'
  | 'phone'
  | 'whatsapp'
  | 'email'
  | 'search'
  | 'filter'
  | 'page';

export type DeviceType = 'Mobile' | 'Desktop' | 'Tablet';

export interface TravelEvent {
  id: string;
  eventType: EventType;
  entityId: string; // e.g. "Maasai Mara National Reserve", "Sarova Mara Lodge", "Lake Nakuru Day Trip"
  entityType: EntityType;
  timestamp: string;
  deviceType: DeviceType;
  sessionId: string;
  metadata?: {
    searchQuery?: string;
    filterType?: string;
    filterValue?: string;
    linkType?: 'WhatsApp' | 'Phone' | 'Directions/Map' | 'Partner Lodge' | 'Park Permits' | 'Airline' | 'Other';
    targetUrl?: string;
    pagePath?: string;
    price?: number;
    destinationCount?: number;
    travelStyle?: string;
  };
}

export interface AnalyticsKPIs {
  totalVisitors: number;
  totalPageViews: number;
  totalOutboundClicks: number;
  outboundConversionRate: number; // e.g. 24.5%
  totalItinerariesCreated: number;
  engagementRate: number; // e.g. 58.2%
  avgDestinationsViewedPerSession: number;
  totalSearches: number;
}

export interface TrafficTrendPoint {
  date: string; // "Aug 01" or "2026-08-01"
  visitors: number;
  pageViews: number;
  outboundClicks: number;
  itinerariesCreated: number;
}

export interface PopularAttractionItem {
  name: string;
  category: string;
  views: number;
  uniqueSessions: number;
  sharePercentage: number;
  type: 'destination' | 'package';
}

export interface DeviceBreakdownItem {
  device: DeviceType;
  count: number;
  percentage: number;
  color: string;
}

export interface SearchTermItem {
  term: string;
  count: number;
  category: 'wildlife' | 'destination' | 'duration' | 'budget' | 'general';
  lastSearchedAgo: string;
}

export interface FilterUsageItem {
  filterName: string;
  count: number;
  percentage: number;
}

export interface OutboundClickLog {
  id: string;
  entityName: string;
  linkType: 'WhatsApp' | 'Phone' | 'Directions/Map' | 'Partner Lodge' | 'Park Permits' | 'Airline' | 'Other';
  targetUrl: string;
  deviceType: DeviceType;
  timestamp: string;
  sessionId: string;
}

export type TimeRangeFilter = 'today' | '7d' | '30d' | 'peak_season' | 'all';

export interface AnalyticsInsightsResponse {
  timeRange: TimeRangeFilter;
  timeRangeLabel: string;
  kpis: AnalyticsKPIs;
  trafficTrends: TrafficTrendPoint[];
  popularAttractions: PopularAttractionItem[];
  deviceBreakdown: DeviceBreakdownItem[];
  topSearchTerms: SearchTermItem[];
  filterUsage: FilterUsageItem[];
  recentOutboundClicks: OutboundClickLog[];
  recentLiveEvents: TravelEvent[];
  totalEventsLogged: number;
}

// ==========================================
// Database Schema Interfaces (Firestore / Data Models)
// ==========================================

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
  average_rating: number;
  review_count: number;
  is_featured: boolean;
  tags: string[];
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

export interface AnalyticsEventDoc {
  event_id: string;
  user_id?: string;
  session_id: string;
  event_type: string;
  target_entity_id: string;
  metadata?: Record<string, any>;
  timestamp: string;
}


