import posthog from 'posthog-js'

/**
 * Utility functions for PostHog event tracking
 */

export const analytics = {
  /**
   * Track a custom event
   * @param eventName - Name of the event to track
   * @param properties - Additional properties to attach to the event
   */
  track: (eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && posthog) {
      posthog.capture(eventName, properties)
    }
  },

  /**
   * Identify a user
   * @param userId - Unique user identifier
   * @param properties - User properties
   */
  identify: (userId: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && posthog) {
      posthog.identify(userId, properties)
    }
  },

  /**
   * Reset user identification (useful for logout)
   */
  reset: () => {
    if (typeof window !== 'undefined' && posthog) {
      posthog.reset()
    }
  },

  /**
   * Set user properties
   * @param properties - Properties to set for the current user
   */
  setUserProperties: (properties: Record<string, any>) => {
    if (typeof window !== 'undefined' && posthog) {
      posthog.setPersonProperties(properties)
    }
  },

  /**
   * Track page view manually (if needed)
   * @param url - Optional URL to track
   */
  pageView: (url?: string) => {
    if (typeof window !== 'undefined' && posthog) {
      posthog.capture('$pageview', {
        $current_url: url || window.location.href,
      })
    }
  },
}

// Common event names for consistency
export const EVENTS = {
  // User actions
  SEARCH_PERFORMED: 'search_performed',
  BOOKING_INITIATED: 'booking_initiated',
  BOOKING_COMPLETED: 'booking_completed',
  BOOKING_CANCELLED: 'booking_cancelled',
  
  // Navigation
  REGION_VIEWED: 'region_viewed',
  EXPERIENCE_VIEWED: 'experience_viewed',
  DOMAIN_VIEWED: 'domain_viewed',
  
  // User authentication
  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',
  
  // Interactions
  NEWSLETTER_SUBSCRIBED: 'newsletter_subscribed',
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  FILTER_APPLIED: 'filter_applied',
  MAP_MARKER_CLICKED: 'map_marker_clicked',
  
  // Errors
  ERROR_OCCURRED: 'error_occurred',
} as const

export type EventName = typeof EVENTS[keyof typeof EVENTS]
