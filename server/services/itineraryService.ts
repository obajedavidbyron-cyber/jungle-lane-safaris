import { dbStore } from '../db/store';
import { ItineraryDoc, ItineraryItem } from '../db/types';

export class ItineraryService {
  /**
   * Fetch all public itineraries or all itineraries
   */
  static async getAll(onlyPublic = true): Promise<ItineraryDoc[]> {
    return dbStore.getAllItineraries(onlyPublic);
  }

  /**
   * Fetch itineraries for a specific user
   */
  static async getByUserId(userId: string): Promise<ItineraryDoc[]> {
    return dbStore.getUserItineraries(userId);
  }

  /**
   * Get single itinerary by ID
   */
  static async getById(id: string): Promise<ItineraryDoc | null> {
    return dbStore.getItineraryById(id);
  }

  /**
   * Create a new itinerary
   */
  static async create(data: Partial<ItineraryDoc>): Promise<ItineraryDoc> {
    return dbStore.createItinerary(data);
  }

  /**
   * Update itinerary metadata (title, is_public)
   */
  static async update(id: string, updates: Partial<ItineraryDoc>): Promise<ItineraryDoc | null> {
    return dbStore.updateItinerary(id, updates);
  }

  /**
   * Add attraction to user saved list / itinerary
   */
  static async addAttraction(
    itineraryId: string,
    item: { attraction_id: string; day_number?: number; notes?: string }
  ): Promise<ItineraryDoc | null> {
    return dbStore.addAttractionToItinerary(itineraryId, item);
  }

  /**
   * Remove attraction from itinerary
   */
  static async removeAttraction(itineraryId: string, attractionId: string): Promise<ItineraryDoc | null> {
    return dbStore.removeAttractionFromItinerary(itineraryId, attractionId);
  }

  /**
   * Reorder itinerary items
   */
  static async reorderItems(
    itineraryId: string,
    items: ItineraryItem[]
  ): Promise<ItineraryDoc | null> {
    return dbStore.reorderItineraryItems(itineraryId, items);
  }

  /**
   * Delete itinerary
   */
  static async delete(id: string): Promise<boolean> {
    return dbStore.deleteItinerary(id);
  }
}
