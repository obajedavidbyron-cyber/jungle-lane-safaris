var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);

// server/analytics.ts
var AnalyticsStore = class {
  constructor() {
    this.events = [];
    this.events = [];
  }
  addEvent(event) {
    const newEvent = {
      id: event.id || `evt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: event.timestamp || (/* @__PURE__ */ new Date()).toISOString(),
      eventType: event.eventType,
      entityId: event.entityId,
      entityType: event.entityType,
      deviceType: event.deviceType || "Mobile",
      sessionId: event.sessionId || `sess_anon_${Math.random().toString(36).substring(2, 8)}`,
      metadata: event.metadata || {}
    };
    this.events.unshift(newEvent);
    if (this.events.length > 15e3) {
      this.events = this.events.slice(0, 15e3);
    }
    return newEvent;
  }
  getAllEvents() {
    return this.events;
  }
  clear() {
    this.events = [];
  }
  resetToZero() {
    this.events = [];
  }
  resetToSeed() {
    this.events = [];
    this.seedInitialData();
  }
  seedInitialData() {
    const destinations = [
      { name: "Maasai Mara National Reserve", category: "Savannah / Big 5", weight: 35 },
      { name: "Amboseli National Park", category: "Mt Kilimanjaro / Elephants", weight: 20 },
      { name: "Lake Nakuru National Park", category: "Flamingos / Rhinos", weight: 14 },
      { name: "Giraffe Centre Nairobi", category: "Sanctuary / Conservation", weight: 12 },
      { name: "Diani Beach & Coast", category: "Coastal / Marine", weight: 8 },
      { name: "Ol Pejeta Conservancy", category: "Rhino Sanctuary", weight: 6 },
      { name: "Hell's Gate National Park", category: "Geothermal / Cycling", weight: 5 },
      { name: "David Sheldrick Wildlife Trust", category: "Elephant Orphanage", weight: 4 },
      { name: "Tsavo West & East", category: "Red Elephants", weight: 4 },
      { name: "Lake Naivasha Crescent Island", category: "Walking Safari", weight: 3 }
    ];
    const searchKeywords = [
      { term: "Great Migration August dates", category: "wildlife", weight: 18 },
      { term: "Big 5 budget camping safari", category: "budget", weight: 15 },
      { term: "Hot air balloon safari Maasai Mara", category: "wildlife", weight: 14 },
      { term: "Amboseli Kilimanjaro view lodges", category: "destination", weight: 12 },
      { term: "Giraffe centre entry fees and timing", category: "destination", weight: 10 },
      { term: "3 day Maasai Mara private land cruiser", category: "duration", weight: 10 },
      { term: "Lake Nakuru flamingos and rhinos", category: "destination", weight: 8 },
      { term: "Family safari with toddlers Kenya", category: "general", weight: 7 },
      { term: "Solo traveler group join safari", category: "budget", weight: 6 },
      { term: "Luxury tented honeymoon safari", category: "budget", weight: 5 }
    ];
    const outboundPartners = [
      {
        entityName: "WhatsApp Safari Consultation",
        linkType: "WhatsApp",
        url: "https://wa.me/254700000000",
        weight: 42
      },
      {
        entityName: "Direct Phone Reservation Call",
        linkType: "Phone",
        url: "tel:+254700000000",
        weight: 18
      },
      {
        entityName: "Sarova Mara Game Camp Partner Lodge",
        linkType: "Partner Lodge",
        url: "https://www.sarovahotels.com/maracamp-masai-mara",
        weight: 12
      },
      {
        entityName: "Google Maps Directions to Giraffe Centre",
        linkType: "Directions/Map",
        url: "https://maps.google.com/?q=Giraffe+Centre+Nairobi",
        weight: 10
      },
      {
        entityName: "Mara Serena Safari Lodge Booking",
        linkType: "Partner Lodge",
        url: "https://www.serenahotels.com/mara-serena",
        weight: 8
      },
      {
        entityName: "Kenya Wildlife Service (KWS) Park Passes",
        linkType: "Park Permits",
        url: "https://kws.go.ke/ecitizen-park-fees",
        weight: 6
      },
      {
        entityName: "Safarilink Aviation Bush Flights",
        linkType: "Airline",
        url: "https://www.flysafarilink.com",
        weight: 4
      }
    ];
    const filterOptions = [
      { filter: "Duration: 3-5 Days", weight: 35 },
      { filter: "Travel Style: Mid-Range Lodges", weight: 28 },
      { filter: "Duration: 1 Day Excursion", weight: 16 },
      { filter: "Travel Style: Luxury Tented Camps", weight: 12 },
      { filter: "Travel Style: Budget Tented", weight: 9 }
    ];
    const devices = [
      { type: "Mobile", weight: 58 },
      { type: "Desktop", weight: 34 },
      { type: "Tablet", weight: 8 }
    ];
    const pickWeighted = (items) => {
      const totalWeight = items.reduce((acc, i) => acc + i.weight, 0);
      let rand = Math.random() * totalWeight;
      for (const item of items) {
        if (rand < item.weight) return item;
        rand -= item.weight;
      }
      return items[0];
    };
    const now = /* @__PURE__ */ new Date();
    const seededEvents = [];
    const daysToGenerate = 30;
    for (let d = daysToGenerate; d >= 0; d--) {
      const date = new Date(now.getTime() - d * 24 * 60 * 60 * 1e3);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseSessions = isWeekend ? 45 + Math.floor(Math.random() * 25) : 32 + Math.floor(Math.random() * 20);
      for (let s = 0; s < baseSessions; s++) {
        const sessionTime = new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1e3);
        if (sessionTime > now) continue;
        const sessionId = `sess_${sessionTime.getTime().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
        const dev = pickWeighted(devices).type;
        seededEvents.push({
          id: `evt_pv_${Math.random().toString(36).substring(2, 9)}`,
          eventType: "page_view",
          entityId: "Home",
          entityType: "page",
          timestamp: sessionTime.toISOString(),
          deviceType: dev,
          sessionId,
          metadata: { pagePath: "/" }
        });
        const destViewsCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < destViewsCount; i++) {
          const dest = pickWeighted(destinations);
          const viewTime = new Date(sessionTime.getTime() + (i + 1) * 35e3);
          if (viewTime <= now) {
            seededEvents.push({
              id: `evt_dest_${Math.random().toString(36).substring(2, 9)}`,
              eventType: "destination_view",
              entityId: dest.name,
              entityType: "destination",
              timestamp: viewTime.toISOString(),
              deviceType: dev,
              sessionId,
              metadata: { filterType: dest.category }
            });
          }
        }
        if (Math.random() < 0.6) {
          const kw = pickWeighted(searchKeywords);
          const searchTime = new Date(sessionTime.getTime() + 45e3);
          if (searchTime <= now) {
            seededEvents.push({
              id: `evt_srch_${Math.random().toString(36).substring(2, 9)}`,
              eventType: "search_query",
              entityId: kw.term,
              entityType: "search",
              timestamp: searchTime.toISOString(),
              deviceType: dev,
              sessionId,
              metadata: { searchQuery: kw.term, filterType: kw.category }
            });
          }
        }
        if (Math.random() < 0.45) {
          const flt = pickWeighted(filterOptions);
          const fltTime = new Date(sessionTime.getTime() + 6e4);
          if (fltTime <= now) {
            const [filterKey, filterVal] = flt.filter.split(": ");
            seededEvents.push({
              id: `evt_flt_${Math.random().toString(36).substring(2, 9)}`,
              eventType: "filter_usage",
              entityId: flt.filter,
              entityType: "filter",
              timestamp: fltTime.toISOString(),
              deviceType: dev,
              sessionId,
              metadata: { filterType: filterKey, filterValue: filterVal }
            });
          }
        }
        if (Math.random() < 0.35) {
          const isAI = Math.random() > 0.5;
          const itinTime = new Date(sessionTime.getTime() + 12e4);
          if (itinTime <= now) {
            seededEvents.push({
              id: `evt_itin_${Math.random().toString(36).substring(2, 9)}`,
              eventType: isAI ? "ai_itinerary_generate" : "bookmark_itinerary",
              entityId: isAI ? "Gemini AI Custom Safari" : "4-Day Maasai Mara & Lake Nakuru Safari",
              entityType: "package",
              timestamp: itinTime.toISOString(),
              deviceType: dev,
              sessionId,
              metadata: { travelStyle: "Mid-Range Lodges", destinationCount: 2 }
            });
          }
        }
        if (Math.random() < 0.28) {
          const partner = pickWeighted(outboundPartners);
          const clickTime = new Date(sessionTime.getTime() + 18e4);
          if (clickTime <= now) {
            seededEvents.push({
              id: `evt_out_${Math.random().toString(36).substring(2, 9)}`,
              eventType: "external_click",
              entityId: partner.entityName,
              entityType: partner.linkType === "WhatsApp" ? "whatsapp" : partner.linkType === "Phone" ? "phone" : partner.linkType === "Directions/Map" ? "directions" : "partner_link",
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
    seededEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    this.events = seededEvents;
  }
};
var analyticsStore = new AnalyticsStore();
function computeAnalyticsInsights(timeRange = "30d") {
  const allEvents = analyticsStore.getAllEvents();
  const now = /* @__PURE__ */ new Date();
  let startTime;
  let timeRangeLabel = "Last 30 Days";
  switch (timeRange) {
    case "today":
      startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      timeRangeLabel = "Today (Last 24 Hours)";
      break;
    case "7d":
      startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
      timeRangeLabel = "Last 7 Days";
      break;
    case "30d":
      startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
      timeRangeLabel = "Last 30 Days";
      break;
    case "peak_season":
      startTime = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1e3);
      timeRangeLabel = "Great Migration Peak Season (Jul - Oct)";
      break;
    case "all":
    default:
      startTime = /* @__PURE__ */ new Date(0);
      timeRangeLabel = "All Recorded Time";
      break;
  }
  const filteredEvents = allEvents.filter((evt) => new Date(evt.timestamp) >= startTime);
  const uniqueSessions = /* @__PURE__ */ new Set();
  const engagedSessions = /* @__PURE__ */ new Set();
  const outboundClickSessions = /* @__PURE__ */ new Set();
  let totalPageViews = 0;
  let totalDestinationViews = 0;
  let totalOutboundClicks = 0;
  let totalItinerariesCreated = 0;
  let totalSearches = 0;
  filteredEvents.forEach((evt) => {
    uniqueSessions.add(evt.sessionId);
    if (evt.eventType === "page_view" || evt.eventType === "destination_view" || evt.eventType === "package_view") {
      totalPageViews++;
    }
    if (evt.eventType === "destination_view") {
      totalDestinationViews++;
    }
    if (evt.eventType === "external_click") {
      totalOutboundClicks++;
      outboundClickSessions.add(evt.sessionId);
      engagedSessions.add(evt.sessionId);
    }
    if (evt.eventType === "bookmark_itinerary" || evt.eventType === "ai_itinerary_generate" || evt.eventType === "quote_submit") {
      totalItinerariesCreated++;
      engagedSessions.add(evt.sessionId);
    }
    if (evt.eventType === "search_query" || evt.eventType === "filter_usage") {
      totalSearches++;
      engagedSessions.add(evt.sessionId);
    }
  });
  const totalVisitors = uniqueSessions.size;
  const outboundConversionRate = totalVisitors > 0 ? Number((outboundClickSessions.size / totalVisitors * 100).toFixed(1)) : 0;
  const engagementRate = totalVisitors > 0 ? Number((engagedSessions.size / totalVisitors * 100).toFixed(1)) : 0;
  const avgDestinationsViewedPerSession = totalVisitors > 0 ? Number((totalDestinationViews / totalVisitors).toFixed(1)) : 0;
  const trendsMap = /* @__PURE__ */ new Map();
  const numDays = timeRange === "today" ? 1 : timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 30;
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1e3);
    const dateKey = timeRange === "today" ? `${d.getHours().toString().padStart(2, "0")}:00` : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    trendsMap.set(dateKey, { visitors: /* @__PURE__ */ new Set(), pageViews: 0, outboundClicks: 0, itinerariesCreated: 0 });
  }
  filteredEvents.forEach((evt) => {
    const d = new Date(evt.timestamp);
    const dateKey = timeRange === "today" ? `${d.getHours().toString().padStart(2, "0")}:00` : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    let entry = trendsMap.get(dateKey);
    if (!entry) {
      entry = { visitors: /* @__PURE__ */ new Set(), pageViews: 0, outboundClicks: 0, itinerariesCreated: 0 };
      trendsMap.set(dateKey, entry);
    }
    entry.visitors.add(evt.sessionId);
    if (evt.eventType === "page_view" || evt.eventType === "destination_view" || evt.eventType === "package_view") {
      entry.pageViews++;
    }
    if (evt.eventType === "external_click") {
      entry.outboundClicks++;
    }
    if (evt.eventType === "bookmark_itinerary" || evt.eventType === "ai_itinerary_generate" || evt.eventType === "quote_submit") {
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
  const destinationMap = /* @__PURE__ */ new Map();
  filteredEvents.forEach((evt) => {
    if (evt.eventType === "destination_view" || evt.eventType === "package_view") {
      const name = evt.entityId;
      const current = destinationMap.get(name) || {
        views: 0,
        sessions: /* @__PURE__ */ new Set(),
        category: evt.metadata?.filterType || (evt.eventType === "destination_view" ? "Kenya National Park" : "Safari Package"),
        type: evt.eventType === "destination_view" ? "destination" : "package"
      };
      current.views++;
      current.sessions.add(evt.sessionId);
      destinationMap.set(name, current);
    }
  });
  const totalAttractionViews = Array.from(destinationMap.values()).reduce((sum, item) => sum + item.views, 0);
  const popularAttractions = Array.from(destinationMap.entries()).map(([name, data]) => ({
    name,
    category: data.category,
    views: data.views,
    uniqueSessions: data.sessions.size,
    sharePercentage: totalAttractionViews > 0 ? Number((data.views / totalAttractionViews * 100).toFixed(1)) : 0,
    type: data.type
  })).sort((a, b) => b.views - a.views).slice(0, 10);
  const deviceCounts = { Mobile: 0, Desktop: 0, Tablet: 0 };
  const deviceSessions = {
    Mobile: /* @__PURE__ */ new Set(),
    Desktop: /* @__PURE__ */ new Set(),
    Tablet: /* @__PURE__ */ new Set()
  };
  filteredEvents.forEach((evt) => {
    const dev = evt.deviceType || "Mobile";
    deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
    deviceSessions[dev].add(evt.sessionId);
  });
  const totalDevSessions = deviceSessions.Mobile.size + deviceSessions.Desktop.size + deviceSessions.Tablet.size;
  const deviceBreakdown = [
    {
      device: "Mobile",
      count: deviceSessions.Mobile.size,
      percentage: totalDevSessions > 0 ? Number((deviceSessions.Mobile.size / totalDevSessions * 100).toFixed(1)) : 0,
      color: "#C86D51"
      // Warm Terracotta
    },
    {
      device: "Desktop",
      count: deviceSessions.Desktop.size,
      percentage: totalDevSessions > 0 ? Number((deviceSessions.Desktop.size / totalDevSessions * 100).toFixed(1)) : 0,
      color: "#3A4F41"
      // Safari Forest Green
    },
    {
      device: "Tablet",
      count: deviceSessions.Tablet.size,
      percentage: totalDevSessions > 0 ? Number((deviceSessions.Tablet.size / totalDevSessions * 100).toFixed(1)) : 0,
      color: "#E29578"
      // Sand Coral
    }
  ];
  const searchMap = /* @__PURE__ */ new Map();
  filteredEvents.forEach((evt) => {
    if (evt.eventType === "search_query") {
      const term = evt.entityId;
      const current = searchMap.get(term) || {
        count: 0,
        category: evt.metadata?.filterType || "wildlife",
        lastTime: new Date(evt.timestamp)
      };
      current.count++;
      if (new Date(evt.timestamp) > current.lastTime) {
        current.lastTime = new Date(evt.timestamp);
      }
      searchMap.set(term, current);
    }
  });
  const topSearchTerms = Array.from(searchMap.entries()).map(([term, data]) => {
    const diffMinutes = Math.floor((now.getTime() - data.lastTime.getTime()) / 6e4);
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
  }).sort((a, b) => b.count - a.count).slice(0, 10);
  const filterMap = /* @__PURE__ */ new Map();
  filteredEvents.forEach((evt) => {
    if (evt.eventType === "filter_usage") {
      const filterName = evt.entityId;
      filterMap.set(filterName, (filterMap.get(filterName) || 0) + 1);
    }
  });
  const totalFilterUses = Array.from(filterMap.values()).reduce((sum, c) => sum + c, 0);
  const filterUsage = Array.from(filterMap.entries()).map(([filterName, count]) => ({
    filterName,
    count,
    percentage: totalFilterUses > 0 ? Number((count / totalFilterUses * 100).toFixed(1)) : 0
  })).sort((a, b) => b.count - a.count).slice(0, 6);
  const recentOutboundClicks = filteredEvents.filter((evt) => evt.eventType === "external_click").slice(0, 50).map((evt) => ({
    id: evt.id,
    entityName: evt.entityId,
    linkType: evt.metadata?.linkType || "Other",
    targetUrl: evt.metadata?.targetUrl || "Direct External Link",
    deviceType: evt.deviceType,
    timestamp: evt.timestamp,
    sessionId: evt.sessionId
  }));
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

// server/db/validator.ts
var ValidationError = class extends Error {
  constructor(message, fieldErrors = {}) {
    super(message);
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;
  }
};
function sanitizeString(input) {
  if (typeof input !== "string") return "";
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/<[^>]*>?/gm, "").trim();
}
function sanitizeUrl(input) {
  if (typeof input !== "string") return "";
  const trimmed = input.trim();
  if (/^(https?:\/\/|mailto:|tel:|\/)/i.test(trimmed)) {
    return trimmed;
  }
  return "";
}
var VALID_CATEGORIES = ["Landmark", "Restaurant", "Nature", "Museum", "Activity"];
var VALID_ROLES = ["user", "admin"];
var DataValidator = class {
  /**
   * Validate & sanitize a User document
   */
  static validateUser(data) {
    const errors = {};
    if (!data.user_id || typeof data.user_id !== "string") {
      errors.user_id = "user_id is required and must be a valid string.";
    }
    if (!data.email || typeof data.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Valid email is required.";
    }
    if (!data.display_name || typeof data.display_name !== "string") {
      errors.display_name = "display_name is required.";
    }
    const role = VALID_ROLES.includes(data.role) ? data.role : "user";
    if (Object.keys(errors).length > 0) {
      throw new ValidationError("User validation failed", errors);
    }
    return {
      user_id: sanitizeString(data.user_id),
      email: sanitizeString(data.email).toLowerCase(),
      display_name: sanitizeString(data.display_name),
      profile_pic: data.profile_pic ? sanitizeUrl(data.profile_pic) : void 0,
      created_at: data.created_at || (/* @__PURE__ */ new Date()).toISOString(),
      role
    };
  }
  /**
   * Validate & sanitize a Destination / Attraction document
   */
  static validateDestination(data) {
    const errors = {};
    if (!data.attraction_id || typeof data.attraction_id !== "string") {
      errors.attraction_id = "attraction_id is required.";
    }
    if (!data.name || typeof data.name !== "string" || data.name.trim().length < 2) {
      errors.name = "name is required and must be at least 2 characters.";
    }
    let slug = typeof data.slug === "string" ? data.slug.trim().toLowerCase() : "";
    if (!slug && data.name) {
      slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    }
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      errors.slug = "Valid slug (letters, numbers, hyphens) is required.";
    }
    if (!data.category || !VALID_CATEGORIES.includes(data.category)) {
      errors.category = `category must be one of: ${VALID_CATEGORIES.join(", ")}.`;
    }
    if (!data.description || typeof data.description !== "string") {
      errors.description = "description is required.";
    }
    if (!data.location || typeof data.location !== "object") {
      errors.location = "location object is required.";
    } else {
      const lat = Number(data.location.latitude);
      const lng = Number(data.location.longitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        errors["location.latitude"] = "latitude must be a valid number between -90 and 90.";
      }
      if (isNaN(lng) || lng < -180 || lng > 180) {
        errors["location.longitude"] = "longitude must be a valid number between -180 and 180.";
      }
      if (!data.location.city || typeof data.location.city !== "string") {
        errors["location.city"] = "location.city is required.";
      }
      if (!data.location.country || typeof data.location.country !== "string") {
        errors["location.country"] = "location.country is required.";
      }
    }
    const images = Array.isArray(data.images) ? data.images.map((img) => sanitizeUrl(img)).filter(Boolean) : [];
    if (images.length === 0) {
      images.push("https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80");
    }
    const tags = Array.isArray(data.tags) ? data.tags.map((t) => sanitizeString(t).toLowerCase()).filter(Boolean) : [];
    const avgRating = Number(data.average_rating ?? 4.8);
    const validRating = isNaN(avgRating) ? 4.8 : Math.max(0, Math.min(5, Number(avgRating.toFixed(1))));
    const revCount = Number(data.review_count ?? 0);
    const validReviews = isNaN(revCount) ? 0 : Math.max(0, Math.floor(revCount));
    if (Object.keys(errors).length > 0) {
      throw new ValidationError("Destination validation failed", errors);
    }
    return {
      attraction_id: sanitizeString(data.attraction_id),
      name: sanitizeString(data.name),
      slug,
      category: data.category,
      description: sanitizeString(data.description),
      location: {
        city: sanitizeString(data.location.city),
        country: sanitizeString(data.location.country),
        latitude: Number(data.location.latitude),
        longitude: Number(data.location.longitude),
        address: data.location.address ? sanitizeString(data.location.address) : void 0
      },
      images,
      opening_hours: data.opening_hours ? sanitizeString(data.opening_hours) : void 0,
      website_url: data.website_url ? sanitizeUrl(data.website_url) : void 0,
      phone_number: data.phone_number ? sanitizeString(data.phone_number) : void 0,
      direct_directions_url: data.direct_directions_url ? sanitizeUrl(data.direct_directions_url) : void 0,
      average_rating: validRating,
      review_count: validReviews,
      is_featured: Boolean(data.is_featured),
      tags
    };
  }
  /**
   * Validate & sanitize an Itinerary document
   */
  static validateItinerary(data) {
    const errors = {};
    if (!data.itinerary_id || typeof data.itinerary_id !== "string") {
      errors.itinerary_id = "itinerary_id is required.";
    }
    if (!data.user_id || typeof data.user_id !== "string") {
      errors.user_id = "user_id is required.";
    }
    if (!data.title || typeof data.title !== "string" || data.title.trim().length < 2) {
      errors.title = "title is required and must be at least 2 characters.";
    }
    if (!Array.isArray(data.items)) {
      errors.items = "items must be an array.";
    }
    if (Object.keys(errors).length > 0) {
      throw new ValidationError("Itinerary validation failed", errors);
    }
    const items = (data.items || []).map((item, idx) => ({
      attraction_id: sanitizeString(item.attraction_id),
      day_number: Math.max(1, Math.floor(Number(item.day_number) || 1)),
      notes: item.notes ? sanitizeString(item.notes) : void 0,
      order: typeof item.order === "number" ? item.order : idx
    }));
    return {
      itinerary_id: sanitizeString(data.itinerary_id),
      user_id: sanitizeString(data.user_id),
      title: sanitizeString(data.title),
      is_public: Boolean(data.is_public),
      created_at: data.created_at || (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString(),
      items
    };
  }
  /**
   * Validate & sanitize an Analytics Event document
   */
  static validateAnalyticsEvent(data) {
    const errors = {};
    if (!data.event_id || typeof data.event_id !== "string") {
      errors.event_id = "event_id is required.";
    }
    if (!data.session_id || typeof data.session_id !== "string") {
      errors.session_id = "session_id is required.";
    }
    if (!data.event_type || typeof data.event_type !== "string") {
      errors.event_type = "event_type is required.";
    }
    if (!data.target_entity_id || typeof data.target_entity_id !== "string") {
      errors.target_entity_id = "target_entity_id is required.";
    }
    if (Object.keys(errors).length > 0) {
      throw new ValidationError("Analytics event validation failed", errors);
    }
    return {
      event_id: sanitizeString(data.event_id),
      user_id: data.user_id ? sanitizeString(data.user_id) : void 0,
      session_id: sanitizeString(data.session_id),
      event_type: sanitizeString(data.event_type),
      target_entity_id: sanitizeString(data.target_entity_id),
      metadata: typeof data.metadata === "object" && data.metadata !== null ? data.metadata : {},
      timestamp: data.timestamp || (/* @__PURE__ */ new Date()).toISOString()
    };
  }
};

// server/db/seedData.ts
var SEED_USERS = [
  {
    user_id: "usr_admin_01",
    email: "obajedavidbyron@gmail.com",
    display_name: "David Byron (Jungle Lane Admin)",
    profile_pic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    created_at: "2026-08-01T08:00:00.000Z",
    role: "admin"
  },
  {
    user_id: "usr_traveler_02",
    email: "sarah.watson@adventuretravel.com",
    display_name: "Sarah Watson",
    profile_pic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    created_at: "2026-08-05T14:30:00.000Z",
    role: "user"
  }
];
var SEED_DESTINATIONS = [
  {
    attraction_id: "attr_maasai_mara",
    name: "Maasai Mara National Reserve",
    slug: "maasai-mara-national-reserve",
    category: "Nature",
    description: "World-famous savanna wilderness renowned for the annual Great Migration of over two million wildebeest and zebras, dense lion prides, and sweeping golden grasslands along the Mara River.",
    location: {
      city: "Narok County",
      country: "Kenya",
      latitude: -1.4889,
      longitude: 35.1444,
      address: "Sekenani Gate, Maasai Mara National Reserve, Narok"
    },
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80"
    ],
    opening_hours: "Daily 06:00 AM \u2013 06:30 PM",
    website_url: "https://www.maasaimarakenyapark.com",
    phone_number: "+254 700 123 456",
    direct_directions_url: "https://maps.google.com/?q=-1.4889,35.1444",
    average_rating: 4.9,
    review_count: 3840,
    is_featured: true,
    tags: ["big-5", "wildlife", "great-migration", "photography", "family-friendly", "scenic"]
  },
  {
    attraction_id: "attr_amboseli",
    name: "Amboseli National Park",
    slug: "amboseli-national-park",
    category: "Nature",
    description: "Famed for giant free-ranging elephant herds set against the dramatic snow-capped backdrop of Mount Kilimanjaro, with observation hills offering 360-degree views of seasonal marshes and birdlife.",
    location: {
      city: "Kajiado County",
      country: "Kenya",
      latitude: -2.6527,
      longitude: 37.2606,
      address: "Kimana Gate, Amboseli National Park, Loitokitok"
    },
    images: [
      "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80"
    ],
    opening_hours: "Daily 06:00 AM \u2013 06:00 PM",
    website_url: "https://www.kws.go.ke/amboseli-national-park",
    phone_number: "+254 711 987 654",
    direct_directions_url: "https://maps.google.com/?q=-2.6527,37.2606",
    average_rating: 4.8,
    review_count: 2410,
    is_featured: true,
    tags: ["elephants", "kilimanjaro-views", "family-friendly", "scenic", "wildlife"]
  },
  {
    attraction_id: "attr_giraffe_centre",
    name: "Giraffe Centre & Karen Blixen Museum",
    slug: "giraffe-centre-karen-blixen",
    category: "Museum",
    description: "Non-profit conservation center protecting endangered Rothschild giraffes with raised feeding platforms, adjacent to the historic farmhouse estate of author Karen Blixen nestled under the Ngong Hills.",
    location: {
      city: "Nairobi",
      country: "Kenya",
      latitude: -1.3756,
      longitude: 36.7447,
      address: "Duma Road, Karen, Nairobi"
    },
    images: [
      "https://images.unsplash.com/photo-1574063413132-355dbfd83e21?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80"
    ],
    opening_hours: "Daily 09:00 AM \u2013 05:00 PM",
    website_url: "https://www.giraffecentre.org",
    phone_number: "+254 20 807 0804",
    direct_directions_url: "https://maps.google.com/?q=-1.3756,36.7447",
    average_rating: 4.8,
    review_count: 1920,
    is_featured: true,
    tags: ["family-friendly", "day-trip", "conservation", "educational", "photography"]
  },
  {
    attraction_id: "attr_carnivore_restaurant",
    name: "The Carnivore Restaurant Nairobi",
    slug: "carnivore-restaurant-nairobi",
    category: "Restaurant",
    description: "Iconic open-air charcoal barbecue feast venue where succulent meats are roasted over a huge charcoal pit on traditional Maasai swords and carved directly onto sizzling cast-iron plates.",
    location: {
      city: "Nairobi",
      country: "Kenya",
      latitude: -1.3283,
      longitude: 36.8041,
      address: "Langata Road, Nairobi"
    },
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
    ],
    opening_hours: "Daily 12:00 PM \u2013 11:00 PM",
    website_url: "https://www.tamarind.co.ke/carnivore",
    phone_number: "+254 733 611 608",
    direct_directions_url: "https://maps.google.com/?q=-1.3283,36.8041",
    average_rating: 4.7,
    review_count: 3150,
    is_featured: false,
    tags: ["dining", "culinary", "nyama-choma", "family-friendly"]
  },
  {
    attraction_id: "attr_fort_jesus",
    name: "Fort Jesus & UNESCO Old Town Mombasa",
    slug: "fort-jesus-old-town-mombasa",
    category: "Landmark",
    description: "16th-century Portuguese fortress overlooking the old port of Mombasa, representing a masterpiece of Renaissance military architecture and Swahili maritime trading heritage.",
    location: {
      city: "Mombasa",
      country: "Kenya",
      latitude: -4.0628,
      longitude: 39.6797,
      address: "Nkrumah Road, Old Town, Mombasa"
    },
    images: [
      "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80"
    ],
    opening_hours: "Daily 08:00 AM \u2013 06:00 PM",
    website_url: "https://whc.unesco.org/en/list/1295",
    phone_number: "+254 41 222 5934",
    direct_directions_url: "https://maps.google.com/?q=-4.0628,39.6797",
    average_rating: 4.6,
    review_count: 1420,
    is_featured: true,
    tags: ["unesco-heritage", "history", "coastal", "family-friendly", "photography"]
  },
  {
    attraction_id: "attr_diani_marine_dhow",
    name: "Diani Beach Marine Reserve & Dhow Safari",
    slug: "diani-beach-marine-reserve",
    category: "Activity",
    description: "Pristine turquoise Indian Ocean paradise with powder-white sands, coral reef snorkeling with green sea turtles and dolphins, kitesurfing, and sunset sailing on authentic wooden Swahili dhows.",
    location: {
      city: "Diani Beach",
      country: "Kenya",
      latitude: -4.2792,
      longitude: 39.5936,
      address: "Diani Beach Road, Kwale County"
    },
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    opening_hours: "Open 24/7 (Water Sports 07:00 AM \u2013 06:00 PM)",
    website_url: "https://www.dianibeach.com",
    phone_number: "+254 722 555 777",
    direct_directions_url: "https://maps.google.com/?q=-4.2792,39.5936",
    average_rating: 4.9,
    review_count: 2890,
    is_featured: true,
    tags: ["marine", "snorkeling", "beach", "sunset-cruise", "luxury", "free-access"]
  },
  {
    attraction_id: "attr_lake_nakuru",
    name: "Lake Nakuru National Park",
    slug: "lake-nakuru-national-park",
    category: "Nature",
    description: "Rift Valley alkaline sanctuary hosting both white and endangered black rhinos, Rothschild giraffes, lions, and thousands of flamingos lining the scenic lake shoreline beneath Baboon Cliff.",
    location: {
      city: "Nakuru",
      country: "Kenya",
      latitude: -0.3644,
      longitude: 36.0822,
      address: "Main Gate, Lake Nakuru National Park, Nakuru"
    },
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
    ],
    opening_hours: "Daily 06:00 AM \u2013 06:00 PM",
    website_url: "https://www.kws.go.ke/lake-nakuru-national-park",
    phone_number: "+254 51 221 7234",
    direct_directions_url: "https://maps.google.com/?q=-0.3644,36.0822",
    average_rating: 4.7,
    review_count: 1780,
    is_featured: false,
    tags: ["rhino-sanctuary", "birdwatching", "flamingos", "rift-valley", "wildlife"]
  }
];
var SEED_ITINERARIES = [
  {
    itinerary_id: "itin_classic_circuit_01",
    user_id: "usr_traveler_02",
    title: "5-Day Classic Big 5 & Great Rift Circuit",
    is_public: true,
    created_at: "2026-08-10T10:00:00.000Z",
    updated_at: "2026-08-10T12:00:00.000Z",
    items: [
      {
        attraction_id: "attr_giraffe_centre",
        day_number: 1,
        notes: "Morning arrival in Nairobi, giraffe feeding platform and lunch in Karen.",
        order: 0
      },
      {
        attraction_id: "attr_carnivore_restaurant",
        day_number: 1,
        notes: "Celebratory welcome dinner at the famous Carnivore open-pit barbecue.",
        order: 1
      },
      {
        attraction_id: "attr_lake_nakuru",
        day_number: 2,
        notes: "Scenic drive down the Great Rift Valley escarpment. Afternoon rhino and flamingo tracking.",
        order: 2
      },
      {
        attraction_id: "attr_maasai_mara",
        day_number: 3,
        notes: "Transfer to Maasai Mara, afternoon game drive seeking lion prides and cheetahs.",
        order: 3
      },
      {
        attraction_id: "attr_maasai_mara",
        day_number: 4,
        notes: "Full day safari with bush picnic lunch beside the Mara River migration crossing.",
        order: 4
      }
    ]
  },
  {
    itinerary_id: "itin_bush_to_beach_02",
    user_id: "usr_admin_01",
    title: "7-Day Bush to Beach Luxury Expedition",
    is_public: true,
    created_at: "2026-08-08T09:00:00.000Z",
    updated_at: "2026-08-08T09:00:00.000Z",
    items: [
      {
        attraction_id: "attr_amboseli",
        day_number: 1,
        notes: "Fly into Amboseli for Kilimanjaro sunset photography and elephant observation.",
        order: 0
      },
      {
        attraction_id: "attr_maasai_mara",
        day_number: 3,
        notes: "Charter flight to Maasai Mara luxury tented camp.",
        order: 1
      },
      {
        attraction_id: "attr_fort_jesus",
        day_number: 5,
        notes: "Coastal transfer to Mombasa, UNESCO Swahili heritage walk.",
        order: 2
      },
      {
        attraction_id: "attr_diani_marine_dhow",
        day_number: 6,
        notes: "Private wooden dhow coral reef snorkeling and sandbank seafood barbecue.",
        order: 3
      }
    ]
  }
];
var SEED_ANALYTICS_EVENTS = [
  {
    event_id: "evt_init_001",
    session_id: "sess_live_101",
    event_type: "page_view",
    target_entity_id: "destinations_explorer",
    metadata: {
      route_path: "/destinations",
      device_type: "Desktop"
    },
    timestamp: "2026-08-15T06:30:00.000Z"
  },
  {
    event_id: "evt_init_002",
    session_id: "sess_live_102",
    event_type: "search",
    target_entity_id: "search_bar",
    metadata: {
      search_term: "Maasai Mara migration",
      device_type: "Mobile"
    },
    timestamp: "2026-08-15T06:32:10.000Z"
  },
  {
    event_id: "evt_init_003",
    session_id: "sess_live_102",
    event_type: "page_view",
    target_entity_id: "attr_maasai_mara",
    metadata: {
      route_path: "/destinations/maasai-mara-national-reserve",
      device_type: "Mobile"
    },
    timestamp: "2026-08-15T06:32:30.000Z"
  },
  {
    event_id: "evt_init_004",
    session_id: "sess_live_103",
    event_type: "bookmark",
    target_entity_id: "itin_classic_circuit_01",
    metadata: {
      device_type: "Desktop"
    },
    timestamp: "2026-08-15T06:40:00.000Z"
  },
  {
    event_id: "evt_init_005",
    session_id: "sess_live_104",
    event_type: "outbound_click",
    target_entity_id: "attr_maasai_mara",
    metadata: {
      link_type: "Directions/Map",
      external_url: "https://maps.google.com/?q=-1.4889,35.1444",
      device_type: "Mobile"
    },
    timestamp: "2026-08-15T06:45:15.000Z"
  }
];

// server/db/store.ts
var DatabaseStore = class _DatabaseStore {
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.destinations = /* @__PURE__ */ new Map();
    this.itineraries = /* @__PURE__ */ new Map();
    this.analyticsEvents = [];
    this.seed();
  }
  static getInstance() {
    if (!_DatabaseStore.instance) {
      _DatabaseStore.instance = new _DatabaseStore();
    }
    return _DatabaseStore.instance;
  }
  /**
   * Seed the database with initial rich sample dataset
   */
  seed() {
    this.users.clear();
    this.destinations.clear();
    this.itineraries.clear();
    this.analyticsEvents = [];
    for (const u of SEED_USERS) {
      this.users.set(u.user_id, { ...u });
    }
    for (const d of SEED_DESTINATIONS) {
      this.destinations.set(d.attraction_id, { ...d });
    }
    for (const itin of SEED_ITINERARIES) {
      this.itineraries.set(itin.itinerary_id, {
        ...itin,
        items: [...itin.items]
      });
    }
    for (const ev of SEED_ANALYTICS_EVENTS) {
      this.analyticsEvents.push({ ...ev });
    }
  }
  /**
   * Reset database collections
   */
  resetToZero() {
    this.analyticsEvents = [];
  }
  // =========================================================================
  // DESTINATIONS / ATTRACTIONS CRUD & QUERY ENGINE
  // =========================================================================
  getAllDestinations(params) {
    let list = Array.from(this.destinations.values());
    if (!params) return list;
    if (params.category && params.category.trim() !== "" && params.category.toLowerCase() !== "all") {
      const cat = params.category.trim().toLowerCase();
      list = list.filter((d) => d.category.toLowerCase() === cat);
    }
    if (params.tag && params.tag.trim() !== "") {
      const tagQuery = params.tag.trim().toLowerCase();
      list = list.filter((d) => d.tags.some((t) => t.toLowerCase() === tagQuery));
    }
    if (typeof params.is_featured === "boolean") {
      list = list.filter((d) => d.is_featured === params.is_featured);
    }
    if (params.search && params.search.trim() !== "") {
      const term = params.search.trim().toLowerCase();
      list = list.filter((d) => {
        return d.name.toLowerCase().includes(term) || d.description.toLowerCase().includes(term) || d.location.city.toLowerCase().includes(term) || d.location.country.toLowerCase().includes(term) || d.tags.some((t) => t.toLowerCase().includes(term));
      });
    }
    const offset = params.offset || 0;
    const limit = params.limit || 50;
    return list.slice(offset, offset + limit);
  }
  getDestinationById(id) {
    return this.destinations.get(id) || null;
  }
  getDestinationBySlug(slug) {
    const cleanSlug = slug.trim().toLowerCase();
    for (const d of this.destinations.values()) {
      if (d.slug === cleanSlug) return d;
    }
    return null;
  }
  createDestination(input) {
    const id = input.attraction_id || `attr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const candidate = {
      ...input,
      attraction_id: id
    };
    const validated = DataValidator.validateDestination(candidate);
    if (this.getDestinationBySlug(validated.slug)) {
      validated.slug = `${validated.slug}-${Math.random().toString(36).substring(2, 5)}`;
    }
    this.destinations.set(validated.attraction_id, validated);
    return validated;
  }
  updateDestination(id, updates) {
    const existing = this.destinations.get(id);
    if (!existing) return null;
    const merged = {
      ...existing,
      ...updates,
      attraction_id: id,
      location: {
        ...existing.location,
        ...updates.location || {}
      }
    };
    const validated = DataValidator.validateDestination(merged);
    this.destinations.set(id, validated);
    return validated;
  }
  deleteDestination(id) {
    return this.destinations.delete(id);
  }
  // =========================================================================
  // ITINERARIES / SAVED SPOTS CRUD
  // =========================================================================
  getAllItineraries(onlyPublic = false) {
    const list = Array.from(this.itineraries.values());
    if (onlyPublic) {
      return list.filter((i) => i.is_public);
    }
    return list;
  }
  getUserItineraries(userId) {
    return Array.from(this.itineraries.values()).filter((i) => i.user_id === userId);
  }
  getItineraryById(id) {
    return this.itineraries.get(id) || null;
  }
  createItinerary(input) {
    const id = input.itinerary_id || `itin_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const candidate = {
      ...input,
      itinerary_id: id,
      created_at: input.created_at || (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString(),
      items: input.items || []
    };
    const validated = DataValidator.validateItinerary(candidate);
    this.itineraries.set(validated.itinerary_id, validated);
    return validated;
  }
  updateItinerary(id, updates) {
    const existing = this.itineraries.get(id);
    if (!existing) return null;
    const merged = {
      ...existing,
      ...updates,
      itinerary_id: id,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const validated = DataValidator.validateItinerary(merged);
    this.itineraries.set(id, validated);
    return validated;
  }
  addAttractionToItinerary(itineraryId, item) {
    const itinerary = this.itineraries.get(itineraryId);
    if (!itinerary) return null;
    const nextOrder = itinerary.items.length;
    const newItem = {
      attraction_id: sanitizeString(item.attraction_id),
      day_number: Math.max(1, Math.floor(Number(item.day_number) || 1)),
      notes: item.notes ? sanitizeString(item.notes) : void 0,
      order: nextOrder
    };
    itinerary.items.push(newItem);
    itinerary.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    this.itineraries.set(itineraryId, itinerary);
    return itinerary;
  }
  removeAttractionFromItinerary(itineraryId, attractionId) {
    const itinerary = this.itineraries.get(itineraryId);
    if (!itinerary) return null;
    itinerary.items = itinerary.items.filter((item) => item.attraction_id !== attractionId).map((item, idx) => ({ ...item, order: idx }));
    itinerary.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    this.itineraries.set(itineraryId, itinerary);
    return itinerary;
  }
  reorderItineraryItems(itineraryId, newItems) {
    const itinerary = this.itineraries.get(itineraryId);
    if (!itinerary) return null;
    itinerary.items = newItems.map((item, idx) => ({
      attraction_id: sanitizeString(item.attraction_id),
      day_number: Math.max(1, Math.floor(Number(item.day_number) || 1)),
      notes: item.notes ? sanitizeString(item.notes) : void 0,
      order: idx
    }));
    itinerary.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    this.itineraries.set(itineraryId, itinerary);
    return itinerary;
  }
  deleteItinerary(id) {
    return this.itineraries.delete(id);
  }
  // =========================================================================
  // USERS CRUD
  // =========================================================================
  getAllUsers() {
    return Array.from(this.users.values());
  }
  getUserById(id) {
    return this.users.get(id) || null;
  }
  getUserByEmail(email) {
    const clean = email.trim().toLowerCase();
    for (const u of this.users.values()) {
      if (u.email === clean) return u;
    }
    return null;
  }
  createUser(input) {
    const id = input.user_id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const candidate = {
      ...input,
      user_id: id
    };
    const validated = DataValidator.validateUser(candidate);
    this.users.set(validated.user_id, validated);
    return validated;
  }
  updateUser(id, updates) {
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
  deleteUser(id) {
    return this.users.delete(id);
  }
  // =========================================================================
  // ANALYTICS & TRAFFIC EVENTS LOGGING
  // =========================================================================
  logEvent(event) {
    const candidate = {
      event_id: event.event_id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      session_id: event.session_id || `sess_${Math.random().toString(36).substring(2, 9)}`,
      event_type: event.event_type || "page_view",
      target_entity_id: event.target_entity_id || "general",
      user_id: event.user_id,
      metadata: event.metadata || {},
      timestamp: event.timestamp || (/* @__PURE__ */ new Date()).toISOString()
    };
    const validated = DataValidator.validateAnalyticsEvent(candidate);
    this.analyticsEvents.push(validated);
    if (this.analyticsEvents.length > 5e4) {
      this.analyticsEvents.shift();
    }
    return validated;
  }
  getEvents(params) {
    let list = [...this.analyticsEvents];
    if (params?.eventType) {
      list = list.filter((e) => e.event_type === params.eventType);
    }
    if (params?.limit) {
      list = list.slice(-params.limit);
    }
    return list;
  }
  getDatabaseSummary() {
    return {
      destinationsCount: this.destinations.size,
      usersCount: this.users.size,
      itinerariesCount: this.itineraries.size,
      eventsCount: this.analyticsEvents.length
    };
  }
};
var dbStore = DatabaseStore.getInstance();

// server/services/destinationService.ts
var DestinationService = class {
  /**
   * Fetch all destinations with filtering by category, tag, search query, or featured status
   */
  static async getAll(params) {
    const list = dbStore.getAllDestinations(params);
    return {
      data: list,
      total: list.length
    };
  }
  /**
   * Fetch a single destination by ID or slug
   */
  static async getByIdOrSlug(idOrSlug) {
    const byId = dbStore.getDestinationById(idOrSlug);
    if (byId) return byId;
    return dbStore.getDestinationBySlug(idOrSlug);
  }
  /**
   * Search destinations by text keyword
   */
  static async search(query) {
    return dbStore.getAllDestinations({ search: query });
  }
  /**
   * Create a new destination (validates coordinates, category, etc.)
   */
  static async create(data) {
    return dbStore.createDestination(data);
  }
  /**
   * Update existing destination
   */
  static async update(id, updates) {
    return dbStore.updateDestination(id, updates);
  }
  /**
   * Delete destination
   */
  static async delete(id) {
    return dbStore.deleteDestination(id);
  }
};

// server/services/itineraryService.ts
var ItineraryService = class {
  /**
   * Fetch all public itineraries or all itineraries
   */
  static async getAll(onlyPublic = true) {
    return dbStore.getAllItineraries(onlyPublic);
  }
  /**
   * Fetch itineraries for a specific user
   */
  static async getByUserId(userId) {
    return dbStore.getUserItineraries(userId);
  }
  /**
   * Get single itinerary by ID
   */
  static async getById(id) {
    return dbStore.getItineraryById(id);
  }
  /**
   * Create a new itinerary
   */
  static async create(data) {
    return dbStore.createItinerary(data);
  }
  /**
   * Update itinerary metadata (title, is_public)
   */
  static async update(id, updates) {
    return dbStore.updateItinerary(id, updates);
  }
  /**
   * Add attraction to user saved list / itinerary
   */
  static async addAttraction(itineraryId, item) {
    return dbStore.addAttractionToItinerary(itineraryId, item);
  }
  /**
   * Remove attraction from itinerary
   */
  static async removeAttraction(itineraryId, attractionId) {
    return dbStore.removeAttractionFromItinerary(itineraryId, attractionId);
  }
  /**
   * Reorder itinerary items
   */
  static async reorderItems(itineraryId, items) {
    return dbStore.reorderItineraryItems(itineraryId, items);
  }
  /**
   * Delete itinerary
   */
  static async delete(id) {
    return dbStore.deleteItinerary(id);
  }
};

// server/services/userService.ts
var UserService = class {
  static async getAll() {
    return dbStore.getAllUsers();
  }
  static async getById(userId) {
    return dbStore.getUserById(userId);
  }
  static async getByEmail(email) {
    return dbStore.getUserByEmail(email);
  }
  static async create(data) {
    return dbStore.createUser(data);
  }
  static async update(userId, updates) {
    return dbStore.updateUser(userId, updates);
  }
  static async delete(userId) {
    return dbStore.deleteUser(userId);
  }
};

// server/services/analyticsService.ts
var AnalyticsService = class {
  /**
   * Log analytics and click events asynchronously without blocking UI rendering
   */
  static async logEvent(payload) {
    return dbStore.logEvent(payload);
  }
  /**
   * Query recent raw events
   */
  static async getRecentEvents(limit = 100, eventType) {
    return dbStore.getEvents({ limit, eventType });
  }
  /**
   * Reset events to zero
   */
  static async reset() {
    dbStore.resetToZero();
  }
  /**
   * Re-seed dataset
   */
  static async seed() {
    dbStore.seed();
  }
};

// server/security/headers.ts
function securityHeaders(req, res, next) {
  res.removeHeader("X-Powered-By");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), payment=()");
  res.setHeader("X-Download-Options", "noopen");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://images.unsplash.com https://*.unsplash.com https://*.google.com https://*.googleapis.com https://*.gstatic.com",
    "connect-src 'self' https: wss: ws:",
    "frame-ancestors *",
    "base-uri 'self'",
    "form-action 'self'"
  ].join("; ");
  res.setHeader("Content-Security-Policy", csp);
  if (req.path.startsWith("/api/")) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
  next();
}

// server/security/auditLog.ts
var SecurityAuditLogger = class {
  constructor() {
    this.events = [];
    this.MAX_EVENTS = 200;
    // Counter metrics
    this.stats = {
      totalBlocked: 0,
      rateLimitViolations: 0,
      bruteForceBlocks: 0,
      suspiciousPayloads: 0,
      unauthorizedAttempts: 0,
      lastAttack: null
    };
  }
  log(params) {
    const defaultSeverity = {
      AUTH_SUCCESS: "low",
      AUTH_FAILURE: "medium",
      BRUTE_FORCE_BLOCKED: "critical",
      RATE_LIMIT_EXCEEDED: "medium",
      UNAUTHORIZED_ACCESS: "high",
      SUSPICIOUS_PAYLOAD: "critical",
      SESSION_EXPIRED: "low",
      ADMIN_ACTION: "low"
    };
    const event = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      type: params.type,
      ip: params.ip || "unknown",
      path: params.path || "/",
      method: params.method || "GET",
      details: params.details,
      severity: params.severity || defaultSeverity[params.type] || "medium",
      userAgent: params.userAgent ? params.userAgent.substring(0, 100) : void 0
    };
    if (event.severity === "high" || event.severity === "critical") {
      this.stats.totalBlocked++;
      this.stats.lastAttack = event.timestamp;
    }
    if (params.type === "RATE_LIMIT_EXCEEDED") {
      this.stats.rateLimitViolations++;
      this.stats.totalBlocked++;
    } else if (params.type === "BRUTE_FORCE_BLOCKED") {
      this.stats.bruteForceBlocks++;
    } else if (params.type === "SUSPICIOUS_PAYLOAD") {
      this.stats.suspiciousPayloads++;
    } else if (params.type === "UNAUTHORIZED_ACCESS") {
      this.stats.unauthorizedAttempts++;
    }
    this.events.unshift(event);
    if (this.events.length > this.MAX_EVENTS) {
      this.events.pop();
    }
    return event;
  }
  getRecentEvents(limit = 50, typeFilter) {
    if (typeFilter) {
      return this.events.filter((e) => e.type === typeFilter).slice(0, limit);
    }
    return this.events.slice(0, limit);
  }
  getStats(activeSessionsCount = 0, trackedIPsCount = 0) {
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
  clearLogs() {
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
};
var securityAudit = new SecurityAuditLogger();

// server/security/rateLimiter.ts
var RateLimiter = class {
  constructor() {
    this.ipRecords = /* @__PURE__ */ new Map();
    this.authFailures = /* @__PURE__ */ new Map();
    setInterval(() => this.cleanup(), 5 * 60 * 1e3);
  }
  getClientIp(req) {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
      return forwarded.split(",")[0].trim();
    }
    return req.ip || req.socket.remoteAddress || "127.0.0.1";
  }
  getTrackedIPsCount() {
    return this.ipRecords.size + this.authFailures.size;
  }
  /**
   * General sliding window rate limiter
   */
  createMiddleware(options) {
    return (req, res, next) => {
      const ip = this.getClientIp(req);
      const now = Date.now();
      const key = `${options.name}:${ip}`;
      let record = this.ipRecords.get(key);
      if (!record || now > record.resetTime) {
        record = { count: 1, resetTime: now + options.windowMs };
        this.ipRecords.set(key, record);
      } else {
        record.count++;
      }
      const remaining = Math.max(0, options.maxRequests - record.count);
      res.setHeader("X-RateLimit-Limit", options.maxRequests);
      res.setHeader("X-RateLimit-Remaining", remaining);
      res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1e3));
      if (record.count > options.maxRequests) {
        securityAudit.log({
          type: "RATE_LIMIT_EXCEEDED",
          ip,
          path: req.originalUrl,
          method: req.method,
          details: `Rate limit of ${options.maxRequests} req / ${options.windowMs / 1e3}s exceeded on ${options.name}`,
          userAgent: req.headers["user-agent"]
        });
        const retryAfter = Math.ceil((record.resetTime - now) / 1e3);
        res.setHeader("Retry-After", retryAfter);
        return res.status(429).json({
          error: options.message || "Too many requests. Please slow down and try again shortly.",
          retryAfterSeconds: retryAfter
        });
      }
      next();
    };
  }
  /**
   * Brute-force protection for login attempts
   */
  checkAuthLockout(ip) {
    const record = this.authFailures.get(ip);
    if (!record) return { isLocked: false, remainingSeconds: 0 };
    const now = Date.now();
    if (now < record.lockedUntil) {
      const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1e3);
      return { isLocked: true, remainingSeconds };
    }
    if (now >= record.lockedUntil && record.lockedUntil > 0) {
      this.authFailures.delete(ip);
    }
    return { isLocked: false, remainingSeconds: 0 };
  }
  recordAuthFailure(ip, maxAttempts = 5, lockoutDurationMs = 15 * 60 * 1e3) {
    const now = Date.now();
    let record = this.authFailures.get(ip);
    if (!record) {
      record = { count: 1, lockedUntil: 0 };
    } else {
      record.count++;
    }
    if (record.count >= maxAttempts) {
      record.lockedUntil = now + lockoutDurationMs;
      securityAudit.log({
        type: "BRUTE_FORCE_BLOCKED",
        ip,
        path: "/api/auth/login",
        method: "POST",
        details: `IP locked out for ${lockoutDurationMs / 6e4} mins after ${record.count} consecutive failed login attempts`,
        severity: "critical"
      });
    }
    this.authFailures.set(ip, record);
    return record;
  }
  recordAuthSuccess(ip) {
    this.authFailures.delete(ip);
  }
  flushBlockedIPs() {
    this.authFailures.clear();
    this.ipRecords.clear();
  }
  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.ipRecords.entries()) {
      if (now > record.resetTime) {
        this.ipRecords.delete(key);
      }
    }
    for (const [ip, record] of this.authFailures.entries()) {
      if (now > record.lockedUntil && record.lockedUntil > 0) {
        this.authFailures.delete(ip);
      }
    }
  }
};
var rateLimiter = new RateLimiter();

// server/security/sanitizer.ts
var DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/gi,
  /vbscript\s*:/gi,
  /data\s*:\s*text\/html/gi,
  /on\w+\s*=/gi,
  // onerror=, onload=, onclick=
  /(?:union\s+all\s+select|union\s+select)/gi,
  /(?:drop\s+table|insert\s+into|delete\s+from)/gi,
  /<iframe\b[^>]*>/gi
];
function containsDangerousPattern(value) {
  if (typeof value !== "string") return false;
  return DANGEROUS_PATTERNS.some((pattern) => pattern.test(value));
}
function sanitizeString2(value) {
  if (typeof value !== "string") return value;
  let cleaned = value.replace(/\0/g, "");
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  cleaned = cleaned.replace(/javascript\s*:/gi, "blocked:");
  return cleaned.trim();
}
function deepSanitize(obj, checkOnly = false) {
  if (obj === null || obj === void 0) {
    return { hasAttack: false, sanitized: obj };
  }
  if (typeof obj === "string") {
    const isDangerous = containsDangerousPattern(obj);
    return {
      hasAttack: isDangerous,
      sanitized: sanitizeString2(obj)
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
  if (typeof obj === "object") {
    let hasAttack = false;
    const sanitized = {};
    for (const [key, val] of Object.entries(obj)) {
      if (typeof val === "string" && (key.toLowerCase().includes("url") || key.toLowerCase().includes("website"))) {
        const lower = val.trim().toLowerCase();
        if (lower && !lower.startsWith("http://") && !lower.startsWith("https://") && !lower.startsWith("/")) {
          hasAttack = true;
          sanitized[key] = "";
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
function requestSanitizer(req, res, next) {
  const ip = rateLimiter.getClientIp(req);
  if (req.query && Object.keys(req.query).length > 0) {
    const { hasAttack, sanitized } = deepSanitize(req.query);
    if (hasAttack) {
      securityAudit.log({
        type: "SUSPICIOUS_PAYLOAD",
        ip,
        path: req.originalUrl,
        method: req.method,
        details: "Malicious pattern detected in query parameters",
        severity: "critical"
      });
      return res.status(400).json({ error: "Request rejected due to potentially malicious characters." });
    }
    req.query = sanitized;
  }
  if (req.body && typeof req.body === "object") {
    const { hasAttack, sanitized } = deepSanitize(req.body);
    if (hasAttack) {
      securityAudit.log({
        type: "SUSPICIOUS_PAYLOAD",
        ip,
        path: req.originalUrl,
        method: req.method,
        details: "Malicious XSS or injection pattern detected and rejected in request body",
        severity: "critical"
      });
      return res.status(400).json({ error: "Request rejected: Potentially malicious script or injection payload detected." });
    }
    req.body = sanitized;
  }
  next();
}

// server/security/auth.ts
var import_crypto = __toESM(require("crypto"), 1);
var SESSION_SECRET = process.env.SESSION_SECRET || import_crypto.default.randomBytes(32).toString("hex");
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "jungle2026";
var AUTHORIZED_ADMIN_EMAILS = [
  "obajedavidbyron@gmail.com",
  "admin@junglelanesafaris.com",
  "owner@junglelanesafaris.com"
];
var activeSessions = /* @__PURE__ */ new Map();
function safeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    import_crypto.default.timingSafeEqual(bufA, bufA);
    return false;
  }
  return import_crypto.default.timingSafeEqual(bufA, bufB);
}
function generateToken(payload) {
  const nonce = import_crypto.default.randomBytes(16).toString("hex");
  const now = /* @__PURE__ */ new Date();
  const expiresAt = new Date(now.getTime() + 12 * 60 * 60 * 1e3);
  const data = JSON.stringify({
    email: payload.email,
    name: payload.name,
    role: "admin",
    iat: now.toISOString(),
    exp: expiresAt.toISOString(),
    nonce
  });
  const signature = import_crypto.default.createHmac("sha256", SESSION_SECRET).update(data).digest("hex");
  const token = Buffer.from(`${data}.${signature}`).toString("base64url");
  const session = {
    token,
    email: payload.email,
    name: payload.name,
    role: "admin",
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    ip: ""
  };
  activeSessions.set(token, session);
  return { token, session };
}
function verifyToken(token) {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) {
    try {
      const decoded = Buffer.from(token, "base64url").toString("utf8");
      const parts = decoded.split(".");
      if (parts.length !== 2) return null;
      const [data, signature] = parts;
      const expectedSig = import_crypto.default.createHmac("sha256", SESSION_SECRET).update(data).digest("hex");
      if (!safeEqual(signature, expectedSig)) {
        return null;
      }
      const parsed = JSON.parse(data);
      if (/* @__PURE__ */ new Date() > new Date(parsed.exp)) {
        return null;
      }
      const restoredSession = {
        token,
        email: parsed.email,
        name: parsed.name,
        role: "admin",
        createdAt: parsed.iat,
        expiresAt: parsed.exp,
        ip: ""
      };
      activeSessions.set(token, restoredSession);
      return restoredSession;
    } catch {
      return null;
    }
  }
  if (/* @__PURE__ */ new Date() > new Date(session.expiresAt)) {
    activeSessions.delete(token);
    return null;
  }
  return session;
}
function authenticateAdmin(email, passcode, ip) {
  const lockout = rateLimiter.checkAuthLockout(ip);
  if (lockout.isLocked) {
    securityAudit.log({
      type: "BRUTE_FORCE_BLOCKED",
      ip,
      path: "/api/auth/login",
      method: "POST",
      details: `Attempt blocked. IP is temporarily locked out (${lockout.remainingSeconds}s remaining).`,
      severity: "critical"
    });
    return {
      success: false,
      error: `Security Lockout: Too many failed attempts. Please wait ${lockout.remainingSeconds} seconds.`,
      remainingLockoutSeconds: lockout.remainingSeconds
    };
  }
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPasscode = (passcode || "").trim();
  const isEmailValid = AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail) || cleanEmail === "admin";
  const isPasscodeValid = safeEqual(cleanPasscode, ADMIN_PASSWORD);
  if (!isEmailValid || !isPasscodeValid) {
    const record = rateLimiter.recordAuthFailure(ip, 5, 15 * 60 * 1e3);
    securityAudit.log({
      type: "AUTH_FAILURE",
      ip,
      path: "/api/auth/login",
      method: "POST",
      details: `Failed admin login attempt with email: ${cleanEmail}. Failed attempts: ${record.count}`,
      severity: "medium"
    });
    const attemptsLeft = Math.max(0, 5 - record.count);
    return {
      success: false,
      error: attemptsLeft > 0 ? `Invalid credentials. ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} remaining before temporary lockout.` : "Account locked for 15 minutes due to multiple failed attempts."
    };
  }
  rateLimiter.recordAuthSuccess(ip);
  const adminName = cleanEmail.includes("obaje") ? "David Byron Obaje" : "System Administrator";
  const { token, session } = generateToken({ email: cleanEmail, name: adminName });
  session.ip = ip;
  securityAudit.log({
    type: "AUTH_SUCCESS",
    ip,
    path: "/api/auth/login",
    method: "POST",
    details: `Admin authenticated successfully: ${cleanEmail}`,
    severity: "low"
  });
  return { success: true, token, session };
}
function invalidateSession(token) {
  return activeSessions.delete(token);
}
function getActiveSessionsCount() {
  return activeSessions.size;
}
function requireAdminAuth(req, res, next) {
  const ip = rateLimiter.getClientIp(req);
  const authHeader = req.headers.authorization;
  const customHeader = req.headers["x-admin-token"];
  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  } else if (customHeader) {
    token = customHeader.trim();
  }
  if (!token) {
    securityAudit.log({
      type: "UNAUTHORIZED_ACCESS",
      ip,
      path: req.originalUrl,
      method: req.method,
      details: "Missing Authorization token on protected route",
      severity: "high"
    });
    return res.status(401).json({
      error: "Unauthorized: Valid Administrator Bearer token is required to perform this action."
    });
  }
  const session = verifyToken(token);
  if (!session) {
    securityAudit.log({
      type: "UNAUTHORIZED_ACCESS",
      ip,
      path: req.originalUrl,
      method: req.method,
      details: "Invalid or expired Authorization token supplied",
      severity: "high"
    });
    return res.status(403).json({
      error: "Forbidden: Session token has expired or is invalid. Please log in again."
    });
  }
  req.adminUser = session;
  next();
}

// server.ts
import_dotenv.default.config();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(securityHeaders);
  app.use(import_express.default.json({ limit: "256kb" }));
  app.use(import_express.default.urlencoded({ extended: true, limit: "256kb" }));
  app.use(requestSanitizer);
  const apiLimiter = rateLimiter.createMiddleware({
    windowMs: 60 * 1e3,
    maxRequests: 180,
    name: "api",
    message: "Rate limit exceeded. Too many requests to the safari service."
  });
  app.use("/api/", apiLimiter);
  const aiLimiter = rateLimiter.createMiddleware({
    windowMs: 60 * 1e3,
    maxRequests: 15,
    name: "ai-itinerary",
    message: "AI Safari Planner rate limit reached. Please wait a moment before generating another custom itinerary."
  });
  const authLimiter = rateLimiter.createMiddleware({
    windowMs: 15 * 60 * 1e3,
    maxRequests: 10,
    name: "auth-login",
    message: "Too many authentication requests. Please wait a few minutes before trying again."
  });
  const telemetryLimiter = rateLimiter.createMiddleware({
    windowMs: 60 * 1e3,
    maxRequests: 100,
    name: "telemetry",
    message: "Analytics event rate limit exceeded."
  });
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      brand: "Jungle Lane Safaris",
      security: "Shield Active",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.post("/api/auth/login", authLimiter, (req, res) => {
    const { email, passcode } = req.body;
    const ip = rateLimiter.getClientIp(req);
    if (!email || !passcode) {
      return res.status(400).json({ error: "Email and passcode are required." });
    }
    const result = authenticateAdmin(email, passcode, ip);
    if (!result.success) {
      return res.status(401).json({
        error: result.error,
        remainingLockoutSeconds: result.remainingLockoutSeconds
      });
    }
    return res.json({
      success: true,
      token: result.token,
      session: {
        email: result.session?.email,
        name: result.session?.name,
        role: result.session?.role,
        createdAt: result.session?.createdAt,
        expiresAt: result.session?.expiresAt
      }
    });
  });
  app.get("/api/auth/verify", (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7).trim() : req.headers["x-admin-token"];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    const session = verifyToken(token);
    if (!session) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    return res.json({
      success: true,
      session: {
        email: session.email,
        name: session.name,
        role: session.role,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt
      }
    });
  });
  app.post("/api/auth/logout", (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7).trim() : req.headers["x-admin-token"];
    if (token) {
      invalidateSession(token);
    }
    return res.json({ success: true, message: "Logged out successfully" });
  });
  app.get("/api/security/status", requireAdminAuth, (_req, res) => {
    const activeSessions2 = getActiveSessionsCount();
    const trackedIPs = rateLimiter.getTrackedIPsCount();
    const stats = securityAudit.getStats(activeSessions2, trackedIPs);
    return res.json({ success: true, stats });
  });
  app.get("/api/security/audit-log", requireAdminAuth, (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
    const typeFilter = req.query.type;
    const events = securityAudit.getRecentEvents(limit, typeFilter);
    return res.json({ success: true, events, total: events.length });
  });
  app.post("/api/security/flush-blocked-ips", requireAdminAuth, (req, res) => {
    rateLimiter.flushBlockedIPs();
    securityAudit.log({
      type: "ADMIN_ACTION",
      ip: rateLimiter.getClientIp(req),
      path: "/api/security/flush-blocked-ips",
      method: "POST",
      details: `Admin ${req.adminUser?.email} flushed blocked IP records and cleared rate limiters`,
      severity: "low"
    });
    return res.json({ success: true, message: "Blocked IP records and rate limit counters reset successfully." });
  });
  app.get("/api/db/status", (_req, res) => {
    const summary = dbStore.getDatabaseSummary();
    res.json({ success: true, database: "Firestore/In-Memory Hybrid DAL", ...summary });
  });
  app.post("/api/db/seed", requireAdminAuth, (_req, res) => {
    dbStore.seed();
    analyticsStore.resetToSeed();
    securityAudit.log({
      type: "ADMIN_ACTION",
      ip: rateLimiter.getClientIp(_req),
      path: "/api/db/seed",
      method: "POST",
      details: `Admin ${_req.adminUser?.email} re-seeded the database`,
      severity: "low"
    });
    res.json({ success: true, message: "Database successfully populated with rich Kenyan safari seed dataset." });
  });
  app.get("/api/destinations", async (req, res) => {
    try {
      const { category, tag, search, is_featured, limit, offset } = req.query;
      const result = await DestinationService.getAll({
        category,
        tag,
        search,
        is_featured: is_featured !== void 0 ? is_featured === "true" : void 0,
        limit: limit ? parseInt(limit, 10) : void 0,
        offset: offset ? parseInt(offset, 10) : void 0
      });
      return res.json({ success: true, ...result });
    } catch (err) {
      console.error("Error fetching destinations:", err);
      return res.status(500).json({ error: "Failed to fetch destinations" });
    }
  });
  app.get("/api/destinations/:idOrSlug", async (req, res) => {
    try {
      const destination = await DestinationService.getByIdOrSlug(req.params.idOrSlug);
      if (!destination) {
        return res.status(404).json({ error: "Destination not found" });
      }
      return res.json({ success: true, destination });
    } catch (err) {
      console.error("Error fetching destination:", err);
      return res.status(500).json({ error: "Failed to fetch destination" });
    }
  });
  app.post("/api/destinations", requireAdminAuth, async (req, res) => {
    try {
      const created = await DestinationService.create(req.body);
      securityAudit.log({
        type: "ADMIN_ACTION",
        ip: rateLimiter.getClientIp(req),
        path: "/api/destinations",
        method: "POST",
        details: `Admin ${req.adminUser?.email} created destination: ${created.name}`,
        severity: "low"
      });
      return res.status(201).json({ success: true, destination: created });
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message, fieldErrors: err.fieldErrors });
      }
      console.error("Error creating destination:", err);
      return res.status(500).json({ error: "Failed to create destination" });
    }
  });
  app.put("/api/destinations/:id", requireAdminAuth, async (req, res) => {
    try {
      const updated = await DestinationService.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Destination not found" });
      }
      securityAudit.log({
        type: "ADMIN_ACTION",
        ip: rateLimiter.getClientIp(req),
        path: `/api/destinations/${req.params.id}`,
        method: "PUT",
        details: `Admin ${req.adminUser?.email} updated destination: ${updated.name}`,
        severity: "low"
      });
      return res.json({ success: true, destination: updated });
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message, fieldErrors: err.fieldErrors });
      }
      console.error("Error updating destination:", err);
      return res.status(500).json({ error: "Failed to update destination" });
    }
  });
  app.delete("/api/destinations/:id", requireAdminAuth, async (req, res) => {
    try {
      const deleted = await DestinationService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Destination not found" });
      }
      securityAudit.log({
        type: "ADMIN_ACTION",
        ip: rateLimiter.getClientIp(req),
        path: `/api/destinations/${req.params.id}`,
        method: "DELETE",
        details: `Admin ${req.adminUser?.email} deleted destination id: ${req.params.id}`,
        severity: "low"
      });
      return res.json({ success: true, message: "Destination deleted successfully" });
    } catch (err) {
      console.error("Error deleting destination:", err);
      return res.status(500).json({ error: "Failed to delete destination" });
    }
  });
  app.get("/api/itineraries", async (req, res) => {
    try {
      const { userId, publicOnly } = req.query;
      let list;
      if (userId) {
        list = await ItineraryService.getByUserId(userId);
      } else {
        list = await ItineraryService.getAll(publicOnly === "true");
      }
      return res.json({ success: true, itineraries: list, total: list.length });
    } catch (err) {
      console.error("Error fetching itineraries:", err);
      return res.status(500).json({ error: "Failed to fetch itineraries" });
    }
  });
  app.get("/api/itineraries/:id", async (req, res) => {
    try {
      const itinerary = await ItineraryService.getById(req.params.id);
      if (!itinerary) {
        return res.status(404).json({ error: "Itinerary not found" });
      }
      return res.json({ success: true, itinerary });
    } catch (err) {
      console.error("Error fetching itinerary:", err);
      return res.status(500).json({ error: "Failed to fetch itinerary" });
    }
  });
  app.post("/api/itineraries", async (req, res) => {
    try {
      const created = await ItineraryService.create(req.body);
      return res.status(201).json({ success: true, itinerary: created });
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message, fieldErrors: err.fieldErrors });
      }
      console.error("Error creating itinerary:", err);
      return res.status(500).json({ error: "Failed to create itinerary" });
    }
  });
  app.put("/api/itineraries/:id", async (req, res) => {
    try {
      const updated = await ItineraryService.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Itinerary not found" });
      }
      return res.json({ success: true, itinerary: updated });
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message, fieldErrors: err.fieldErrors });
      }
      console.error("Error updating itinerary:", err);
      return res.status(500).json({ error: "Failed to update itinerary" });
    }
  });
  app.post("/api/itineraries/:id/items", async (req, res) => {
    try {
      const { attraction_id, day_number, notes } = req.body;
      if (!attraction_id) {
        return res.status(400).json({ error: "attraction_id is required" });
      }
      const updated = await ItineraryService.addAttraction(req.params.id, {
        attraction_id,
        day_number,
        notes
      });
      if (!updated) {
        return res.status(404).json({ error: "Itinerary not found" });
      }
      return res.json({ success: true, itinerary: updated });
    } catch (err) {
      console.error("Error adding attraction to itinerary:", err);
      return res.status(500).json({ error: "Failed to add attraction to itinerary" });
    }
  });
  app.delete("/api/itineraries/:id/items/:attractionId", async (req, res) => {
    try {
      const updated = await ItineraryService.removeAttraction(req.params.id, req.params.attractionId);
      if (!updated) {
        return res.status(404).json({ error: "Itinerary not found" });
      }
      return res.json({ success: true, itinerary: updated });
    } catch (err) {
      console.error("Error removing attraction from itinerary:", err);
      return res.status(500).json({ error: "Failed to remove attraction from itinerary" });
    }
  });
  app.put("/api/itineraries/:id/reorder", async (req, res) => {
    try {
      const { items } = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: "items array is required for reordering" });
      }
      const updated = await ItineraryService.reorderItems(req.params.id, items);
      if (!updated) {
        return res.status(404).json({ error: "Itinerary not found" });
      }
      return res.json({ success: true, itinerary: updated });
    } catch (err) {
      console.error("Error reordering itinerary items:", err);
      return res.status(500).json({ error: "Failed to reorder itinerary items" });
    }
  });
  app.delete("/api/itineraries/:id", requireAdminAuth, async (req, res) => {
    try {
      const deleted = await ItineraryService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Itinerary not found" });
      }
      securityAudit.log({
        type: "ADMIN_ACTION",
        ip: rateLimiter.getClientIp(req),
        path: `/api/itineraries/${req.params.id}`,
        method: "DELETE",
        details: `Admin ${req.adminUser?.email} deleted itinerary id: ${req.params.id}`,
        severity: "low"
      });
      return res.json({ success: true, message: "Itinerary deleted successfully" });
    } catch (err) {
      console.error("Error deleting itinerary:", err);
      return res.status(500).json({ error: "Failed to delete itinerary" });
    }
  });
  app.get("/api/users", requireAdminAuth, async (req, res) => {
    try {
      const users = await UserService.getAll();
      return res.json({ success: true, users });
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch users" });
    }
  });
  app.get("/api/users/:idOrEmail", requireAdminAuth, async (req, res) => {
    try {
      const param = req.params.idOrEmail;
      let user = await UserService.getById(param);
      if (!user) {
        user = await UserService.getByEmail(param);
      }
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json({ success: true, user });
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch user" });
    }
  });
  app.post("/api/users", requireAdminAuth, async (req, res) => {
    try {
      const user = await UserService.create(req.body);
      securityAudit.log({
        type: "ADMIN_ACTION",
        ip: rateLimiter.getClientIp(req),
        path: "/api/users",
        method: "POST",
        details: `Admin ${req.adminUser?.email} created user: ${user.email}`,
        severity: "low"
      });
      return res.status(201).json({ success: true, user });
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message, fieldErrors: err.fieldErrors });
      }
      return res.status(500).json({ error: "Failed to create user" });
    }
  });
  app.put("/api/users/:id", requireAdminAuth, async (req, res) => {
    try {
      const user = await UserService.update(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      securityAudit.log({
        type: "ADMIN_ACTION",
        ip: rateLimiter.getClientIp(req),
        path: `/api/users/${req.params.id}`,
        method: "PUT",
        details: `Admin ${req.adminUser?.email} updated user: ${user.email}`,
        severity: "low"
      });
      return res.json({ success: true, user });
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message, fieldErrors: err.fieldErrors });
      }
      return res.status(500).json({ error: "Failed to update user" });
    }
  });
  app.delete("/api/users/:id", requireAdminAuth, async (req, res) => {
    try {
      const deleted = await UserService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }
      securityAudit.log({
        type: "ADMIN_ACTION",
        ip: rateLimiter.getClientIp(req),
        path: `/api/users/${req.params.id}`,
        method: "DELETE",
        details: `Admin ${req.adminUser?.email} deleted user id: ${req.params.id}`,
        severity: "low"
      });
      return res.json({ success: true, message: "User deleted" });
    } catch (err) {
      return res.status(500).json({ error: "Failed to delete user" });
    }
  });
  app.post("/api/events", telemetryLimiter, async (req, res) => {
    try {
      const logged = await AnalyticsService.logEvent(req.body);
      analyticsStore.addEvent({
        eventType: logged.event_type,
        entityId: logged.target_entity_id,
        entityType: logged.metadata?.link_type ? "partner_link" : "destination",
        deviceType: logged.metadata?.device_type || "Mobile",
        sessionId: logged.session_id,
        metadata: logged.metadata || {}
      });
      return res.status(201).json({ success: true, event: logged });
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message, fieldErrors: err.fieldErrors });
      }
      return res.status(500).json({ error: "Failed to log event" });
    }
  });
  app.get("/api/events", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 100;
      const eventType = req.query.eventType;
      const events = await AnalyticsService.getRecentEvents(limit, eventType);
      return res.json({ success: true, events, total: events.length });
    } catch (err) {
      return res.status(500).json({ error: "Failed to query events" });
    }
  });
  app.post("/api/analytics/track", telemetryLimiter, (req, res) => {
    try {
      const { eventType, entityId, entityType, deviceType, sessionId, metadata } = req.body;
      if (!eventType || !entityId) {
        return res.status(400).json({ error: "eventType and entityId are required." });
      }
      const newEvent = analyticsStore.addEvent({
        eventType,
        entityId,
        entityType: entityType || "destination",
        deviceType: deviceType || "Mobile",
        sessionId: sessionId || `sess_${Date.now()}`,
        metadata: metadata || {}
      });
      dbStore.logEvent({
        session_id: sessionId || `sess_${Date.now()}`,
        event_type: eventType,
        target_entity_id: entityId,
        metadata: { ...metadata, device_type: deviceType }
      });
      return res.status(201).json({ success: true, eventId: newEvent.id });
    } catch (err) {
      console.error("Error logging travel event:", err);
      return res.status(500).json({ error: "Failed to record travel event" });
    }
  });
  app.get("/api/analytics/insights", (req, res) => {
    try {
      const timeRange = req.query.timeRange || "30d";
      const insights = computeAnalyticsInsights(timeRange);
      return res.json({ success: true, ...insights });
    } catch (err) {
      console.error("Error computing tourist analytics insights:", err);
      return res.status(500).json({ error: "Failed to compute insights" });
    }
  });
  app.get("/api/analytics/outbound-log", requireAdminAuth, (req, res) => {
    try {
      const timeRange = req.query.timeRange || "30d";
      const insights = computeAnalyticsInsights(timeRange);
      return res.json({
        success: true,
        outboundClicks: insights.recentOutboundClicks,
        total: insights.recentOutboundClicks.length
      });
    } catch (err) {
      console.error("Error fetching outbound log:", err);
      return res.status(500).json({ error: "Failed to fetch outbound referral log" });
    }
  });
  app.post("/api/analytics/seed-demo", requireAdminAuth, (req, res) => {
    try {
      const { entityName, linkType, targetUrl } = req.body;
      const demoEvent = analyticsStore.addEvent({
        eventType: "external_click",
        entityId: entityName || "Sarova Mara Game Camp Partner Lodge",
        entityType: "partner_link",
        deviceType: "Mobile",
        sessionId: `sess_demo_${Date.now().toString(36)}`,
        metadata: {
          linkType: linkType || "Partner Lodge",
          targetUrl: targetUrl || "https://www.sarovahotels.com/maracamp-masai-mara"
        }
      });
      return res.json({ success: true, message: "Demo event created", event: demoEvent });
    } catch (err) {
      return res.status(500).json({ error: "Failed to seed demo event" });
    }
  });
  app.post("/api/analytics/reset", requireAdminAuth, (_req, res) => {
    analyticsStore.resetToZero();
    securityAudit.log({
      type: "ADMIN_ACTION",
      ip: rateLimiter.getClientIp(_req),
      path: "/api/analytics/reset",
      method: "POST",
      details: `Admin ${_req.adminUser?.email} reset analytics counters`,
      severity: "low"
    });
    return res.json({ success: true, message: "Analytics dashboard reset to zero values. Ready for real-time live usage." });
  });
  app.post("/api/analytics/seed-dataset", requireAdminAuth, (_req, res) => {
    analyticsStore.resetToSeed();
    securityAudit.log({
      type: "ADMIN_ACTION",
      ip: rateLimiter.getClientIp(_req),
      path: "/api/analytics/seed-dataset",
      method: "POST",
      details: `Admin ${_req.adminUser?.email} seeded demo analytics dataset`,
      severity: "low"
    });
    return res.json({ success: true, message: "Analytics store populated with demo dataset." });
  });
  app.post("/api/ai-itinerary", aiLimiter, async (req, res) => {
    try {
      const { duration, destinations, style, pax, interests, budget } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({
          fallback: true,
          message: "API key not set, using pre-calculated tailor-made safari recommendation."
        });
      }
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const prompt = `You are the lead safari expert at Jungle Lane Safaris in Kenya.
Create a personalized, exciting, professional Day-by-Day East Africa Safari Itinerary proposal based on these preferences:
- Duration: ${duration || "3-5 Days"}
- Destinations: ${destinations?.join(", ") || "Maasai Mara, Lake Nakuru"}
- Travel Style: ${style || "Mid-Range"}
- Guests: ${pax || "2 Travelers"}
- Budget level: ${budget || "Standard"}
- Key Interests: ${interests?.join(", ") || "Big 5 Wildlife, Cultural Maasai Experience, Photography"}

Format the response strictly as valid JSON with the following structure:
{
  "title": "A catchy safari title",
  "summary": "Short 2-sentence description highlighting key wildlife and experience",
  "recommendedLodging": "Type of lodges/camps",
  "bestTime": "Recommended months",
  "highlights": ["Highlight 1", "Highlight 2", "Highlight 3", "Highlight 4"],
  "dayByDay": [
    {
      "day": 1,
      "title": "Day Title (e.g., Nairobi to Maasai Mara)",
      "description": "Detailed activities, game drives, and meals."
    }
  ],
  "inclusions": ["4x4 Land Cruiser safari vehicle with pop-up roof", "Professional English/Swahili speaking guide", "Park entrance fees", "Full board meals", "Airport transfers"],
  "exclusions": ["International flights", "Kenya Tourist Visa", "Personal tips & gratuities", "Luxury alcoholic drinks"]
}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7
        }
      });
      const jsonText = response.text;
      if (jsonText) {
        const parsed = JSON.parse(jsonText);
        return res.json({ success: true, itinerary: parsed });
      } else {
        throw new Error("No response text from Gemini");
      }
    } catch (err) {
      console.error("Error generating AI itinerary:", err);
      const { duration, destinations, style, pax } = req.body || {};
      const destList = Array.isArray(destinations) && destinations.length > 0 ? destinations : ["Maasai Mara National Reserve", "Lake Nakuru"];
      const fallbackProposal = {
        title: `Tailored ${duration || "4-Day"} ${destList[0]} Safari Adventure`,
        summary: `An exclusive Kenyan wildlife journey crafted for ${pax || "2 travelers"}, featuring premier game viewing across ${destList.join(" and ")} in a dedicated 4x4 Land Cruiser.`,
        recommendedLodging: style === "Luxury" ? "Luxury Safari Lodges & Private Tented Camps" : "Mid-Range Eco-Tented Camps & Lodges",
        bestTime: "Year-Round (Peak Migration: July \u2013 October)",
        highlights: [
          `Private 4x4 safari Land Cruiser with open pop-up roof for wildlife photography`,
          `Extensive game drives seeking the Big Five across ${destList[0]}`,
          `Experienced native Kenyan certified safari guide`,
          `Full board accommodation and Nairobi airport transfers included`
        ],
        dayByDay: [
          {
            day: 1,
            title: `Nairobi to ${destList[0]}`,
            description: `Scenic departure from Nairobi driving through the Great Rift Valley escarpment. Check-in, lunch at lodge, and late afternoon introductory game drive.`
          },
          {
            day: 2,
            title: `Full-Day Safari & Wildlife Tracking in ${destList[0]}`,
            description: `Sunrise and sunset game drives targeting lions, leopards, elephants, and plains game, with bush picnic lunch.`
          },
          {
            day: 3,
            title: destList.length > 1 ? `Transfer to ${destList[1]}` : `Deep Wilderness Exploration & Cultural Experience`,
            description: `Morning safari drive, cultural visit to local community boma, and sundowner views over the African savannah.`
          },
          {
            day: 4,
            title: `Final Morning Safari & Return to Nairobi`,
            description: `Early morning game drive to catch active wildlife, wholesome breakfast, and comfortable transfer back to Nairobi.`
          }
        ],
        inclusions: [
          "Private 4x4 Land Cruiser with pop-up roof and VHF radio",
          "Professional certified English/Swahili speaking driver-guide",
          "All park entrance and conservation fees",
          "Full-board meals and drinking water in safari vehicle",
          "Nairobi hotel or airport pick-up and drop-off"
        ],
        exclusions: [
          "International flights & Kenya entry visa",
          "Personal travel insurance",
          "Driver-guide tips & gratuities",
          "Premium alcoholic beverages and laundry"
        ]
      };
      return res.status(200).json({
        success: true,
        itinerary: fallbackProposal,
        note: "Pre-calculated bespoke proposal loaded."
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Jungle Lane Safaris server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
