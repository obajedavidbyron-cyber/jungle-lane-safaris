import { dbStore } from '../db/store';
import { AnalyticsEventDoc } from '../db/types';

export class AnalyticsService {
  /**
   * Log analytics and click events asynchronously without blocking UI rendering
   */
  static async logEvent(payload: Partial<AnalyticsEventDoc>): Promise<AnalyticsEventDoc> {
    return dbStore.logEvent(payload);
  }

  /**
   * Query recent raw events
   */
  static async getRecentEvents(limit = 100, eventType?: string): Promise<AnalyticsEventDoc[]> {
    return dbStore.getEvents({ limit, eventType });
  }

  /**
   * Reset events to zero
   */
  static async reset(): Promise<void> {
    dbStore.resetToZero();
  }

  /**
   * Re-seed dataset
   */
  static async seed(): Promise<void> {
    dbStore.seed();
  }
}
