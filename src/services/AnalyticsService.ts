/**
 * Analytics Service - Main export for analytics functionality
 * This file resolves broken imports by re-exporting RealAnalyticsService
 */

import { RealAnalyticsService } from './RealAnalyticsService';

// Export RealAnalyticsService as AnalyticsService for compatibility
export const AnalyticsService = RealAnalyticsService;
export default RealAnalyticsService;

// Re-export all types and interfaces from RealAnalyticsService
export * from './RealAnalyticsService';