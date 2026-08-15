import { dbStore } from '../db/store';
import { DestinationDoc, DestinationQueryParams } from '../db/types';

export class DestinationService {
  /**
   * Fetch all destinations with filtering by category, tag, search query, or featured status
   */
  static async getAll(params?: DestinationQueryParams): Promise<{ data: DestinationDoc[]; total: number }> {
    const list = dbStore.getAllDestinations(params);
    return {
      data: list,
      total: list.length
    };
  }

  /**
   * Fetch a single destination by ID or slug
   */
  static async getByIdOrSlug(idOrSlug: string): Promise<DestinationDoc | null> {
    const byId = dbStore.getDestinationById(idOrSlug);
    if (byId) return byId;
    return dbStore.getDestinationBySlug(idOrSlug);
  }

  /**
   * Search destinations by text keyword
   */
  static async search(query: string): Promise<DestinationDoc[]> {
    return dbStore.getAllDestinations({ search: query });
  }

  /**
   * Create a new destination (validates coordinates, category, etc.)
   */
  static async create(data: Partial<DestinationDoc>): Promise<DestinationDoc> {
    return dbStore.createDestination(data);
  }

  /**
   * Update existing destination
   */
  static async update(id: string, updates: Partial<DestinationDoc>): Promise<DestinationDoc | null> {
    return dbStore.updateDestination(id, updates);
  }

  /**
   * Delete destination
   */
  static async delete(id: string): Promise<boolean> {
    return dbStore.deleteDestination(id);
  }
}
