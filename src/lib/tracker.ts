import { TravelEvent, EventType, EntityType, DeviceType } from '../types';

// Helper to get or generate persistent session ID for the current browser session
function getSessionId(): string {
  try {
    let sessId = sessionStorage.getItem('jls_safari_session_id');
    if (!sessId) {
      sessId = `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('jls_safari_session_id', sessId);
    }
    return sessId;
  } catch {
    return `sess_temp_${Date.now()}`;
  }
}

// Detect device type based on user agent and screen dimensions
function getDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'Desktop';
  const width = window.innerWidth;
  const ua = navigator.userAgent.toLowerCase();
  
  if (/ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk/i.test(ua) || (width >= 768 && width <= 1024)) {
    return 'Tablet';
  }
  if (/mobi|android|touch|mini|windows\sce|palm/i.test(ua) || width < 768) {
    return 'Mobile';
  }
  return 'Desktop';
}

// Low-level tracking dispatcher
export function trackEvent(
  eventType: EventType,
  entityId: string,
  entityType: EntityType,
  metadata?: TravelEvent['metadata']
): void {
  try {
    const payload: Partial<TravelEvent> = {
      eventType,
      entityId,
      entityType,
      timestamp: new Date().toISOString(),
      deviceType: getDeviceType(),
      sessionId: getSessionId(),
      metadata: metadata || {}
    };

    const endpoint = '/api/analytics/track';
    const bodyStr = JSON.stringify(payload);

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([bodyStr], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
    } else {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyStr,
        keepalive: true
      }).catch(() => {
        // Silently swallow network anomalies for analytics
      });
    }
  } catch (err) {
    console.debug('Analytics tracking failed silently:', err);
  }
}

// Convenience Travel-Specific Trackers
export const tracker = {
  // Page / Route navigation
  pageView: (pageName: string) => {
    trackEvent('page_view', pageName, 'page', { pagePath: `/${pageName}` });
  },

  // Destination / Attraction view (e.g., Maasai Mara, Amboseli, Giraffe Centre)
  destinationView: (destinationName: string, metadata?: Record<string, any>) => {
    trackEvent('destination_view', destinationName, 'destination', metadata);
  },

  // Package / Safari Itinerary view
  packageView: (packageTitle: string, duration?: string, price?: number) => {
    trackEvent('package_view', packageTitle, 'package', {
      filterValue: duration,
      price
    });
  },

  // Bookmark / Save Itinerary spot
  bookmarkItinerary: (itineraryName: string, metadata?: Record<string, any>) => {
    trackEvent('bookmark_itinerary', itineraryName, 'package', metadata);
  },

  // Outbound link clicks (WhatsApp, Phone call, Partner lodge, Google Maps directions, etc.)
  outboundClick: (
    entityName: string,
    linkType: 'WhatsApp' | 'Phone' | 'Directions/Map' | 'Partner Lodge' | 'Park Permits' | 'Airline' | 'Other',
    targetUrl?: string,
    metadata?: Record<string, any>
  ) => {
    trackEvent('external_click', entityName, linkType === 'WhatsApp' ? 'whatsapp' : linkType === 'Phone' ? 'phone' : linkType === 'Directions/Map' ? 'directions' : 'partner_link', {
      linkType,
      targetUrl,
      ...metadata
    });
  },

  // Search queries in destination or package search bars
  search: (query: string, resultCount?: number) => {
    if (!query || query.trim().length === 0) return;
    trackEvent('search_query', query.trim(), 'search', {
      searchQuery: query.trim(),
      price: resultCount
    });
  },

  // Filter usage (Duration, Style, Category, Budget)
  filterUsage: (filterType: string, filterValue: string) => {
    trackEvent('filter_usage', `${filterType}: ${filterValue}`, 'filter', {
      filterType,
      filterValue
    });
  },

  // Custom Quote submitted
  quoteSubmit: (packageName?: string, destinationCount?: number, travelStyle?: string) => {
    trackEvent('quote_submit', packageName || 'Tailor-Made Custom Quote', 'package', {
      destinationCount,
      travelStyle
    });
  },

  // AI Itinerary generated
  aiItineraryGenerated: (destinations?: string[], style?: string) => {
    trackEvent('ai_itinerary_generate', 'Gemini AI Custom Safari', 'package', {
      destinationCount: destinations?.length,
      travelStyle: style
    });
  }
};
