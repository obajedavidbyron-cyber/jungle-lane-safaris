import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { analyticsStore, computeAnalyticsInsights, TimeRangeFilter } from "./server/analytics";
import { DestinationService } from "./server/services/destinationService";
import { ItineraryService } from "./server/services/itineraryService";
import { UserService } from "./server/services/userService";
import { AnalyticsService } from "./server/services/analyticsService";
import { dbStore } from "./server/db/store";
import { ValidationError } from "./server/db/validator";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", brand: "Jungle Lane Safaris" });
  });

  // ====================================================
  // Database Status & Diagnostics
  // ====================================================
  app.get("/api/db/status", (_req, res) => {
    const summary = dbStore.getDatabaseSummary();
    res.json({ success: true, database: "Firestore/In-Memory Hybrid DAL", ...summary });
  });

  app.post("/api/db/seed", (_req, res) => {
    dbStore.seed();
    analyticsStore.resetToSeed();
    res.json({ success: true, message: "Database successfully populated with rich Kenyan safari seed dataset." });
  });

  // ====================================================
  // 1. Destinations & Attractions CRUD API
  // ====================================================

  // GET /api/destinations - Fetch all with category/tag/search filtering
  app.get("/api/destinations", async (req, res) => {
    try {
      const { category, tag, search, is_featured, limit, offset } = req.query;
      const result = await DestinationService.getAll({
        category: category as string,
        tag: tag as string,
        search: search as string,
        is_featured: is_featured !== undefined ? is_featured === "true" : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        offset: offset ? parseInt(offset as string, 10) : undefined
      });
      return res.json({ success: true, ...result });
    } catch (err: any) {
      console.error("Error fetching destinations:", err);
      return res.status(500).json({ error: "Failed to fetch destinations" });
    }
  });

  // GET /api/destinations/:idOrSlug - Fetch single destination
  app.get("/api/destinations/:idOrSlug", async (req, res) => {
    try {
      const destination = await DestinationService.getByIdOrSlug(req.params.idOrSlug);
      if (!destination) {
        return res.status(404).json({ error: "Destination not found" });
      }
      return res.json({ success: true, destination });
    } catch (err: any) {
      console.error("Error fetching destination:", err);
      return res.status(500).json({ error: "Failed to fetch destination" });
    }
  });

  // POST /api/destinations - Create new destination with validation
  app.post("/api/destinations", async (req, res) => {
    try {
      const created = await DestinationService.create(req.body);
      return res.status(201).json({ success: true, destination: created });
    } catch (err: any) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message, fieldErrors: err.fieldErrors });
      }
      console.error("Error creating destination:", err);
      return res.status(500).json({ error: "Failed to create destination" });
    }
  });

  // PUT /api/destinations/:id - Update existing destination
  app.put("/api/destinations/:id", async (req, res) => {
    try {
      const updated = await DestinationService.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Destination not found" });
      }
      return res.json({ success: true, destination: updated });
    } catch (err: any) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message, fieldErrors: err.fieldErrors });
      }
      console.error("Error updating destination:", err);
      return res.status(500).json({ error: "Failed to update destination" });
    }
  });

  // DELETE /api/destinations/:id - Delete destination
  app.delete("/api/destinations/:id", async (req, res) => {
    try {
      const deleted = await DestinationService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Destination not found" });
      }
      return res.json({ success: true, message: "Destination deleted successfully" });
    } catch (err: any) {
      console.error("Error deleting destination:", err);
      return res.status(500).json({ error: "Failed to delete destination" });
    }
  });

  // ====================================================
  // 2. Itineraries & Saved Spots CRUD API
  // ====================================================

  // GET /api/itineraries - Fetch itineraries (by user or public)
  app.get("/api/itineraries", async (req, res) => {
    try {
      const { userId, publicOnly } = req.query;
      let list;
      if (userId) {
        list = await ItineraryService.getByUserId(userId as string);
      } else {
        list = await ItineraryService.getAll(publicOnly === "true");
      }
      return res.json({ success: true, itineraries: list, total: list.length });
    } catch (err: any) {
      console.error("Error fetching itineraries:", err);
      return res.status(500).json({ error: "Failed to fetch itineraries" });
    }
  });

  // GET /api/itineraries/:id - Get single itinerary
  app.get("/api/itineraries/:id", async (req, res) => {
    try {
      const itinerary = await ItineraryService.getById(req.params.id);
      if (!itinerary) {
        return res.status(404).json({ error: "Itinerary not found" });
      }
      return res.json({ success: true, itinerary });
    } catch (err: any) {
      console.error("Error fetching itinerary:", err);
      return res.status(500).json({ error: "Failed to fetch itinerary" });
    }
  });

  // POST /api/itineraries - Create itinerary
  app.post("/api/itineraries", async (req, res) => {
    try {
      const created = await ItineraryService.create(req.body);
      return res.status(201).json({ success: true, itinerary: created });
    } catch (err: any) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message, fieldErrors: err.fieldErrors });
      }
      console.error("Error creating itinerary:", err);
      return res.status(500).json({ error: "Failed to create itinerary" });
    }
  });

  // PUT /api/itineraries/:id - Update itinerary metadata
  app.put("/api/itineraries/:id", async (req, res) => {
    try {
      const updated = await ItineraryService.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Itinerary not found" });
      }
      return res.json({ success: true, itinerary: updated });
    } catch (err: any) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message, fieldErrors: err.fieldErrors });
      }
      console.error("Error updating itinerary:", err);
      return res.status(500).json({ error: "Failed to update itinerary" });
    }
  });

  // POST /api/itineraries/:id/items - Add attraction to itinerary
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
    } catch (err: any) {
      console.error("Error adding attraction to itinerary:", err);
      return res.status(500).json({ error: "Failed to add attraction to itinerary" });
    }
  });

  // DELETE /api/itineraries/:id/items/:attractionId - Remove attraction from itinerary
  app.delete("/api/itineraries/:id/items/:attractionId", async (req, res) => {
    try {
      const updated = await ItineraryService.removeAttraction(req.params.id, req.params.attractionId);
      if (!updated) {
        return res.status(404).json({ error: "Itinerary not found" });
      }
      return res.json({ success: true, itinerary: updated });
    } catch (err: any) {
      console.error("Error removing attraction from itinerary:", err);
      return res.status(500).json({ error: "Failed to remove attraction from itinerary" });
    }
  });

  // PUT /api/itineraries/:id/reorder - Reorder items in itinerary
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
    } catch (err: any) {
      console.error("Error reordering itinerary items:", err);
      return res.status(500).json({ error: "Failed to reorder itinerary items" });
    }
  });

  // DELETE /api/itineraries/:id - Delete itinerary
  app.delete("/api/itineraries/:id", async (req, res) => {
    try {
      const deleted = await ItineraryService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Itinerary not found" });
      }
      return res.json({ success: true, message: "Itinerary deleted successfully" });
    } catch (err: any) {
      console.error("Error deleting itinerary:", err);
      return res.status(500).json({ error: "Failed to delete itinerary" });
    }
  });

  // ====================================================
  // 3. Users API
  // ====================================================

  app.get("/api/users", async (req, res) => {
    try {
      const users = await UserService.getAll();
      return res.json({ success: true, users });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:idOrEmail", async (req, res) => {
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
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const user = await UserService.create(req.body);
      return res.status(201).json({ success: true, user });
    } catch (err: any) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message, fieldErrors: err.fieldErrors });
      }
      return res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const user = await UserService.update(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json({ success: true, user });
    } catch (err: any) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message, fieldErrors: err.fieldErrors });
      }
      return res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const deleted = await UserService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json({ success: true, message: "User deleted" });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // ====================================================
  // 4. Analytics & Telemetry Event API
  // ====================================================

  // Generic non-blocking event logging endpoint
  app.post("/api/events", async (req, res) => {
    try {
      const logged = await AnalyticsService.logEvent(req.body);
      
      // Also mirror to analyticsStore for live dashboard telemetry
      analyticsStore.addEvent({
        eventType: logged.event_type as any,
        entityId: logged.target_entity_id,
        entityType: (logged.metadata?.link_type ? "partner_link" : "destination") as any,
        deviceType: (logged.metadata?.device_type as any) || "Mobile",
        sessionId: logged.session_id,
        metadata: (logged.metadata as any) || {}
      });

      return res.status(201).json({ success: true, event: logged });
    } catch (err: any) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message, fieldErrors: err.fieldErrors });
      }
      return res.status(500).json({ error: "Failed to log event" });
    }
  });

  app.get("/api/events", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
      const eventType = req.query.eventType as string;
      const events = await AnalyticsService.getRecentEvents(limit, eventType);
      return res.json({ success: true, events, total: events.length });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to query events" });
    }
  });

  // POST /api/analytics/track - Log user travel interactions
  app.post("/api/analytics/track", (req, res) => {
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

      // Also mirror to DB store
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

  // ====================================================
  // 2. Tourist Insights Backend API
  // ====================================================

  // GET /api/analytics/insights - Calculate aggregated analytics & insights
  app.get("/api/analytics/insights", (req, res) => {
    try {
      const timeRange = (req.query.timeRange as TimeRangeFilter) || "30d";
      const insights = computeAnalyticsInsights(timeRange);
      return res.json({ success: true, ...insights });
    } catch (err) {
      console.error("Error computing tourist analytics insights:", err);
      return res.status(500).json({ error: "Failed to compute insights" });
    }
  });

  // GET /api/analytics/outbound-log - Real-time outbound link referral audit log
  app.get("/api/analytics/outbound-log", (req, res) => {
    try {
      const timeRange = (req.query.timeRange as TimeRangeFilter) || "30d";
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

  // POST /api/analytics/seed-demo - Simulate or trigger mock traffic for live testing
  app.post("/api/analytics/seed-demo", (req, res) => {
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

  // POST /api/analytics/reset - Reset dashboard analytics dataset to zero values ready for use
  app.post("/api/analytics/reset", (_req, res) => {
    analyticsStore.resetToZero();
    return res.json({ success: true, message: "Analytics dashboard reset to zero values. Ready for real-time live usage." });
  });

  // POST /api/analytics/seed-dataset - Optionally seed sample dataset for testing
  app.post("/api/analytics/seed-dataset", (_req, res) => {
    analyticsStore.resetToSeed();
    return res.json({ success: true, message: "Analytics store populated with demo dataset." });
  });

  // Gemini AI Custom Safari Generator Endpoint
  app.post("/api/ai-itinerary", async (req, res) => {
    try {
      const { duration, destinations, style, pax, interests, budget } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({
          fallback: true,
          message: "API key not set, using pre-calculated tailor-made safari recommendation."
        });
      }

      const ai = new GoogleGenAI({ apiKey });

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
  "estimatedPricePerPersonUSD": number (e.g. 850),
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
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const jsonText = response.text;
      if (jsonText) {
        const parsed = JSON.parse(jsonText);
        return res.json({ success: true, itinerary: parsed });
      } else {
        throw new Error("No response text from Gemini");
      }
    } catch (err: any) {
      console.error("Error generating AI itinerary:", err);
      return res.status(500).json({
        success: false,
        error: "Could not generate AI itinerary at this moment. Please try again or WhatsApp us directly!"
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Jungle Lane Safaris server running on http://localhost:${PORT}`);
  });
}

startServer();
