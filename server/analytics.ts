// Travel App Analytics Store & Insights Calculation Engine

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

export interface StoredEvent {
  id: string;
  eventType: EventType;
  entityId: string;
  entityType: EntityType;
  timestamp: string; // ISO string
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

export type TimeRangeFilter = 'today' | '7d' | '30d' | 'peak_season' | 'all';

// In-Memory Storage of Travel Events
class AnalyticsStore {
  private events: StoredEvent[] = [];

  constructor() {
    // Initialized with zero values, ready for clean live tracking
    this.events = [];
  }

  public addEvent(event: Omit<StoredEvent, 'id' | 'timestamp'> & { timestamp?: string; id?: string }): StoredEvent {
    const newEvent: StoredEvent = {
      id: event.id || `evt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: event.timestamp || new Date().toISOString(),
      eventType: event.eventType,
      entityId: event.entityId,
      entityType: event.entityType,
      deviceType: event.deviceType || 'Mobile',
      sessionId: event.sessionId || `sess_anon_${Math.random().toString(36).substring(2, 8)}`,
      metadata: event.metadata || {}
    };

    this.events.unshift(newEvent);
    // Keep max 15,000 events in memory
    if (this.events.length > 15000) {
      this.events = this.events.slice(0, 15000);
    }
    return newEvent;
  }

  public getAllEvents(): StoredEvent[] {
    return this.events;
  }

  public clear(): void {
    this.events = [];
  }

  public resetToZero(): void {
    this.events = [];
  }

  public resetToSeed(): void {
    this.events = [];
    this.seedInitialData();
  }

  private seedInitialData(): void {
    const destinations = [
      { name: 'Maasai Mara National Reserve', category: 'Savannah / Big 5', weight: 35 },
      { name: 'Amboseli National Park', category: 'Mt Kilimanjaro / Elephants', weight: 20 },
      { name: 'Lake Nakuru National Park', category: 'Flamingos / Rhinos', weight: 14 },
      { name: 'Giraffe Centre Nairobi', category: 'Sanctuary / Conservation', weight: 12 },
      { name: 'Diani Beach & Coast', category: 'Coastal / Marine', weight: 8 },
      { name: 'Ol Pejeta Conservancy', category: 'Rhino Sanctuary', weight: 6 },
      { name: 'Hell\'s Gate National Park', category: 'Geothermal / Cycling', weight: 5 },
      { name: 'David Sheldrick Wildlife Trust', category: 'Elephant Orphanage', weight: 4 },
      { name: 'Tsavo West & East', category: 'Red Elephants', weight: 4 },
      { name: 'Lake Naivasha Crescent Island', category: 'Walking Safari', weight: 3 }
    ];

    const searchKeywords = [
      { term: 'Great Migration August dates', category: 'wildlife', weight: 18 },
      { term: 'Big 5 budget camping safari', category: 'budget', weight: 15 },
      { term: 'Hot air balloon safari Maasai Mara', category: 'wildlife', weight: 14 },
      { term: 'Amboseli Kilimanjaro view lodges', category: 'destination', weight: 12 },
      { term: 'Giraffe centre entry fees and timing', category: 'destination', weight: 10 },
      { term: '3 day Maasai Mara private land cruiser', category: 'duration', weight: 10 },
      { term: 'Lake Nakuru flamingos and rhinos', category: 'destination', weight: 8 },
      { term: 'Family safari with toddlers Kenya', category: 'general', weight: 7 },
      { term: 'Solo traveler group join safari', category: 'budget', weight: 6 },
      { term: 'Luxury tented honeymoon safari', category: 'budget', weight: 5 }
    ];

    const outboundPartners = [
      {
        entityName: 'WhatsApp Safari Consultation',
        linkType: 'WhatsApp' as const,
        url: 'https://wa.me/254700000000',
        weight: 42
      },
      {
        entityName: 'Direct Phone Reservation Call',
        linkType: 'Phone' as const,
        url: 'tel:+254700000000',
        weight: 18
      },
      {
        entityName: 'Sarova Mara Game Camp Partner Lodge',
        linkType: 'Partner Lodge' as const,
        url: 'https://www.sarovahotels.com/maracamp-masai-mara',
        weight: 12
      },
      {
        entityName: 'Google Maps Directions to Giraffe Centre',
        linkType: 'Directions/Map' as const,
        url: 'https://maps.google.com/?q=Giraffe+Centre+Nairobi',
        weight: 10
      },
      {
        entityName: 'Mara Serena Safari Lodge Booking',
        linkType: 'Partner Lodge' as const,
        url: 'https://www.serenahotels.com/mara-serena',
        weight: 8
      },
      {
        entityName: 'Kenya Wildlife Service (KWS) Park Passes',
        linkType: 'Park Permits' as const,
        url: 'https://kws.go.ke/ecitizen-park-fees',
        weight: 6
      },
      {
        entityName: 'Safarilink Aviation Bush Flights',
        linkType: 'Airline' as const,
        url: 'https://www.flysafarilink.com',
        weight: 4
      }
    ];

    const filterOptions = [
      { filter: 'Duration: 3-5 Days', weight: 35 },
      { filter: 'Travel Style: Mid-Range Lodges', weight: 28 },
      { filter: 'Duration: 1 Day Excursion', weight: 16 },
      { filter: 'Travel Style: Luxury Tented Camps', weight: 12 },
      { filter: 'Travel Style: Budget Tented', weight: 9 }
    ];

    const devices: { type: DeviceType; weight: number }[] = [
      { type: 'Mobile', weight: 58 },
      { type: 'Desktop', weight: 34 },
      { type: 'Tablet', weight: 8 }
    ];

    const pickWeighted = <T extends { weight: number }>(items: T[]): T => {
      const totalWeight = items.reduce((acc, i) => acc + i.weight, 0);
      let rand = Math.random() * totalWeight;
      for (const item of items) {
        if (rand < item.weight) return item;
        rand -= item.weight;
      }
      return items[0];
    };

    const now = new Date();
    const seededEvents: StoredEvent[] = [];

    // Generate activity spread across the last 30 days + peak season dates
    const daysToGenerate = 30;

    for (let d = daysToGenerate; d >= 0; d--) {
      const date = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
      // Weekend/weekday multiplier
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseSessions = isWeekend ? 45 + Math.floor(Math.random() * 25) : 32 + Math.floor(Math.random() * 20);

      for (let s = 0; s < baseSessions; s++) {
        const sessionTime = new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000);
        if (sessionTime > now) continue;

        const sessionId = `sess_${sessionTime.getTime().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
        const dev = pickWeighted(devices).type;

        // 1. Landing Page View
        seededEvents.push({
          id: `evt_pv_${Math.random().toString(36).substring(2, 9)}`,
          eventType: 'page_view',
          entityId: 'Home',
          entityType: 'page',
          timestamp: sessionTime.toISOString(),
          deviceType: dev,
          sessionId,
          metadata: { pagePath: '/' }
        });

        // 2. Destination views per session (1 to 4 destinations)
        const destViewsCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < destViewsCount; i++) {
          const dest = pickWeighted(destinations);
          const viewTime = new Date(sessionTime.getTime() + (i + 1) * 35000);
          if (viewTime <= now) {
            seededEvents.push({
              id: `evt_dest_${Math.random().toString(36).substring(2, 9)}`,
              eventType: 'destination_view',
              entityId: dest.name,
              entityType: 'destination',
              timestamp: viewTime.toISOString(),
              deviceType: dev,
              sessionId,
              metadata: { filterType: dest.category }
            });
          }
        }

        // 3. Search queries (60% chance)
        if (Math.random() < 0.6) {
          const kw = pickWeighted(searchKeywords);
          const searchTime = new Date(sessionTime.getTime() + 45000);
          if (searchTime <= now) {
            seededEvents.push({
              id: `evt_srch_${Math.random().toString(36).substring(2, 9)}`,
              eventType: 'search_query',
              entityId: kw.term,
              entityType: 'search',
              timestamp: searchTime.toISOString(),
              deviceType: dev,
              sessionId,
              metadata: { searchQuery: kw.term, filterType: kw.category }
            });
          }
        }

        // 4. Filter usage (45% chance)
        if (Math.random() < 0.45) {
          const flt = pickWeighted(filterOptions);
          const fltTime = new Date(sessionTime.getTime() + 60000);
          if (fltTime <= now) {
            const [filterKey, filterVal] = flt.filter.split(': ');
            seededEvents.push({
              id: `evt_flt_${Math.random().toString(36).substring(2, 9)}`,
              eventType: 'filter_usage',
              entityId: flt.filter,
              entityType: 'filter',
              timestamp: fltTime.toISOString(),
              deviceType: dev,
              sessionId,
              metadata: { filterType: filterKey, filterValue: filterVal }
            });
          }
        }

        // 5. Itinerary building or booking intent (35% chance)
        if (Math.random() < 0.35) {
          const isAI = Math.random() > 0.5;
          const itinTime = new Date(sessionTime.getTime() + 120000);
          if (itinTime <= now) {
            seededEvents.push({
              id: `evt_itin_${Math.random().toString(36).substring(2, 9)}`,
              eventType: isAI ? 'ai_itinerary_generate' : 'bookmark_itinerary',
              entityId: isAI ? 'Gemini AI Custom Safari' : '4-Day Maasai Mara & Lake Nakuru Safari',
              entityType: 'package',
              timestamp: itinTime.toISOString(),
              deviceType: dev,
              sessionId,
              metadata: { travelStyle: 'Mid-Range Lodges', destinationCount: 2 }
            });
          }
        }

        // 6. Outbound referral clicks (28% conversion rate)
        if (Math.random() < 0.28) {
          const partner = pickWeighted(outboundPartners);
          const clickTime = new Date(sessionTime.getTime() + 180000);
          if (clickTime <= now) {
            seededEvents.push({
              id: `evt_out_${Math.random().toString(36).substring(2, 9)}`,
              eventType: 'external_click',
              entityId: partner.entityName,
              entityType: partner.linkType === 'WhatsApp' ? 'whatsapp' : partner.linkType === 'Phone' ? 'phone' : partner.linkType === 'Directions/Map' ? 'directions' : 'partner_link',
              timestamp: clickTime.toISOString(),
              deviceType: dev,
              sessionId,
              metadata: {
                linkType: partner.linkType,
                targetUrl: partner.url
              }
            });
          }
        }
      }
    }

    // Sort by timestamp descending
    seededEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    this.events = seededEvents;
  }
}

export const analyticsStore = new AnalyticsStore();

// Insights Calculation Service
export function computeAnalyticsInsights(timeRange: TimeRangeFilter = '30d') {
  const allEvents = analyticsStore.getAllEvents();
  const now = new Date();
  let startTime: Date;

  let timeRangeLabel = 'Last 30 Days';

  switch (timeRange) {
    case 'today':
      startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      timeRangeLabel = 'Today (Last 24 Hours)';
      break;
    case '7d':
      startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      timeRangeLabel = 'Last 7 Days';
      break;
    case '30d':
      startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      timeRangeLabel = 'Last 30 Days';
      break;
    case 'peak_season':
      // Peak Migration Season in Kenya (July - Oct) or past 90 days
      startTime = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      timeRangeLabel = 'Great Migration Peak Season (Jul - Oct)';
      break;
    case 'all':
    default:
      startTime = new Date(0);
      timeRangeLabel = 'All Recorded Time';
      break;
  }

  // Filter events by time range
  const filteredEvents = allEvents.filter((evt) => new Date(evt.timestamp) >= startTime);

  // 1. Session & KPI Aggregation
  const uniqueSessions = new Set<string>();
  const engagedSessions = new Set<string>();
  const outboundClickSessions = new Set<string>();

  let totalPageViews = 0;
  let totalDestinationViews = 0;
  let totalOutboundClicks = 0;
  let totalItinerariesCreated = 0;
  let totalSearches = 0;

  filteredEvents.forEach((evt) => {
    uniqueSessions.add(evt.sessionId);

    if (evt.eventType === 'page_view' || evt.eventType === 'destination_view' || evt.eventType === 'package_view') {
      totalPageViews++;
    }
    if (evt.eventType === 'destination_view') {
      totalDestinationViews++;
    }
    if (evt.eventType === 'external_click') {
      totalOutboundClicks++;
      outboundClickSessions.add(evt.sessionId);
      engagedSessions.add(evt.sessionId);
    }
    if (evt.eventType === 'bookmark_itinerary' || evt.eventType === 'ai_itinerary_generate' || evt.eventType === 'quote_submit') {
      totalItinerariesCreated++;
      engagedSessions.add(evt.sessionId);
    }
    if (evt.eventType === 'search_query' || evt.eventType === 'filter_usage') {
      totalSearches++;
      engagedSessions.add(evt.sessionId);
    }
  });

  const totalVisitors = uniqueSessions.size;
  const outboundConversionRate = totalVisitors > 0
    ? Number(((outboundClickSessions.size / totalVisitors) * 100).toFixed(1))
    : 0;
  const engagementRate = totalVisitors > 0
    ? Number(((engagedSessions.size / totalVisitors) * 100).toFixed(1))
    : 0;
  const avgDestinationsViewedPerSession = totalVisitors > 0
    ? Number((totalDestinationViews / totalVisitors).toFixed(1))
    : 0;

  // 2. Traffic Trends (Grouped by Date)
  const trendsMap = new Map<string, { visitors: Set<string>; pageViews: number; outboundClicks: number; itinerariesCreated: number }>();

  // Initialize dates depending on range
  const numDays = timeRange === 'today' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 30;
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateKey = timeRange === 'today'
      ? `${d.getHours().toString().padStart(2, '0')}:00`
      : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    trendsMap.set(dateKey, { visitors: new Set(), pageViews: 0, outboundClicks: 0, itinerariesCreated: 0 });
  }

  filteredEvents.forEach((evt) => {
    const d = new Date(evt.timestamp);
    const dateKey = timeRange === 'today'
      ? `${d.getHours().toString().padStart(2, '0')}:00`
      : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    let entry = trendsMap.get(dateKey);
    if (!entry) {
      entry = { visitors: new Set(), pageViews: 0, outboundClicks: 0, itinerariesCreated: 0 };
      trendsMap.set(dateKey, entry);
    }

    entry.visitors.add(evt.sessionId);
    if (evt.eventType === 'page_view' || evt.eventType === 'destination_view' || evt.eventType === 'package_view') {
      entry.pageViews++;
    }
    if (evt.eventType === 'external_click') {
      entry.outboundClicks++;
    }
    if (evt.eventType === 'bookmark_itinerary' || evt.eventType === 'ai_itinerary_generate' || evt.eventType === 'quote_submit') {
      entry.itinerariesCreated++;
    }
  });

  const trafficTrends = Array.from(trendsMap.entries()).map(([date, data]) => ({
    date,
    visitors: data.visitors.size,
    pageViews: data.pageViews,
    outboundClicks: data.outboundClicks,
    itinerariesCreated: data.itinerariesCreated
  }));

  // 3. Most Popular Attractions / Top Destination Pages (Bar Chart)
  const destinationMap = new Map<string, { views: number; sessions: Set<string>; category: string; type: 'destination' | 'package' }>();

  filteredEvents.forEach((evt) => {
    if (evt.eventType === 'destination_view' || evt.eventType === 'package_view') {
      const name = evt.entityId;
      const current = destinationMap.get(name) || {
        views: 0,
        sessions: new Set<string>(),
        category: evt.metadata?.filterType || (evt.eventType === 'destination_view' ? 'Kenya National Park' : 'Safari Package'),
        type: evt.eventType === 'destination_view' ? 'destination' : 'package'
      };
      current.views++;
      current.sessions.add(evt.sessionId);
      destinationMap.set(name, current);
    }
  });

  const totalAttractionViews = Array.from(destinationMap.values()).reduce((sum, item) => sum + item.views, 0);

  const popularAttractions = Array.from(destinationMap.entries())
    .map(([name, data]) => ({
      name,
      category: data.category,
      views: data.views,
      uniqueSessions: data.sessions.size,
      sharePercentage: totalAttractionViews > 0 ? Number(((data.views / totalAttractionViews) * 100).toFixed(1)) : 0,
      type: data.type
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // 4. Device Origin Breakdown (Donut Chart)
  const deviceCounts: Record<DeviceType, number> = { Mobile: 0, Desktop: 0, Tablet: 0 };
  const deviceSessions: Record<DeviceType, Set<string>> = {
    Mobile: new Set(),
    Desktop: new Set(),
    Tablet: new Set()
  };

  filteredEvents.forEach((evt) => {
    const dev = evt.deviceType || 'Mobile';
    deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
    deviceSessions[dev].add(evt.sessionId);
  });

  const totalDevSessions = deviceSessions.Mobile.size + deviceSessions.Desktop.size + deviceSessions.Tablet.size;
  const deviceBreakdown = [
    {
      device: 'Mobile' as DeviceType,
      count: deviceSessions.Mobile.size,
      percentage: totalDevSessions > 0 ? Number(((deviceSessions.Mobile.size / totalDevSessions) * 100).toFixed(1)) : 0,
      color: '#C86D51' // Warm Terracotta
    },
    {
      device: 'Desktop' as DeviceType,
      count: deviceSessions.Desktop.size,
      percentage: totalDevSessions > 0 ? Number(((deviceSessions.Desktop.size / totalDevSessions) * 100).toFixed(1)) : 0,
      color: '#3A4F41' // Safari Forest Green
    },
    {
      device: 'Tablet' as DeviceType,
      count: deviceSessions.Tablet.size,
      percentage: totalDevSessions > 0 ? Number(((deviceSessions.Tablet.size / totalDevSessions) * 100).toFixed(1)) : 0,
      color: '#E29578' // Sand Coral
    }
  ];

  // 5. Top Search Terms List
  const searchMap = new Map<string, { count: number; category: any; lastTime: Date }>();

  filteredEvents.forEach((evt) => {
    if (evt.eventType === 'search_query') {
      const term = evt.entityId;
      const current = searchMap.get(term) || {
        count: 0,
        category: (evt.metadata?.filterType as any) || 'wildlife',
        lastTime: new Date(evt.timestamp)
      };
      current.count++;
      if (new Date(evt.timestamp) > current.lastTime) {
        current.lastTime = new Date(evt.timestamp);
      }
      searchMap.set(term, current);
    }
  });

  const topSearchTerms = Array.from(searchMap.entries())
    .map(([term, data]) => {
      const diffMinutes = Math.floor((now.getTime() - data.lastTime.getTime()) / 60000);
      let lastSearchedAgo = `${diffMinutes}m ago`;
      if (diffMinutes >= 1440) {
        lastSearchedAgo = `${Math.floor(diffMinutes / 1440)}d ago`;
      } else if (diffMinutes >= 60) {
        lastSearchedAgo = `${Math.floor(diffMinutes / 60)}h ago`;
      }

      return {
        term,
        count: data.count,
        category: data.category,
        lastSearchedAgo
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // 6. Filter Usage Breakdown
  const filterMap = new Map<string, number>();
  filteredEvents.forEach((evt) => {
    if (evt.eventType === 'filter_usage') {
      const filterName = evt.entityId;
      filterMap.set(filterName, (filterMap.get(filterName) || 0) + 1);
    }
  });
  const totalFilterUses = Array.from(filterMap.values()).reduce((sum, c) => sum + c, 0);
  const filterUsage = Array.from(filterMap.entries())
    .map(([filterName, count]) => ({
      filterName,
      count,
      percentage: totalFilterUses > 0 ? Number(((count / totalFilterUses) * 100).toFixed(1)) : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // 7. Outbound Link Audit Table (Recent real-time outbound referrals)
  const recentOutboundClicks = filteredEvents
    .filter((evt) => evt.eventType === 'external_click')
    .slice(0, 50)
    .map((evt) => ({
      id: evt.id,
      entityName: evt.entityId,
      linkType: (evt.metadata?.linkType || 'Other') as any,
      targetUrl: evt.metadata?.targetUrl || 'Direct External Link',
      deviceType: evt.deviceType,
      timestamp: evt.timestamp,
      sessionId: evt.sessionId
    }));

  // 8. Live Events Feed
  const recentLiveEvents = filteredEvents.slice(0, 20);

  return {
    timeRange,
    timeRangeLabel,
    kpis: {
      totalVisitors,
      totalPageViews,
      totalOutboundClicks,
      outboundConversionRate,
      totalItinerariesCreated,
      engagementRate,
      avgDestinationsViewedPerSession,
      totalSearches
    },
    trafficTrends,
    popularAttractions,
    deviceBreakdown,
    topSearchTerms,
    filterUsage,
    recentOutboundClicks,
    recentLiveEvents,
    totalEventsLogged: filteredEvents.length
  };
}
