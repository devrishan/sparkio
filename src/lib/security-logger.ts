/**
 * Security event logging utility
 * Logs security-critical events for monitoring and alerting
 */

export type SecurityEventType =
  | 'rate_limit_exceeded'
  | 'otp_lockout'
  | 'brute_force_attempt'
  | 'invalid_otp'
  | 'suspicious_activity';

export interface SecurityEventDetails {
  type: SecurityEventType;
  identifier?: string; // phone, IP, userId
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Log security event
 */
export function logSecurityEvent(
  type: SecurityEventType,
  details: Omit<SecurityEventDetails, 'type' | 'timestamp'> = {}
): void {
  const event: SecurityEventDetails = {
    type,
    ...details,
    timestamp: new Date(),
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.warn('[SECURITY]', JSON.stringify(event, null, 2));
  }

  // In production, send to logging service (Sentry, CloudWatch, etc.)
  // TODO: Integrate with production logging service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to external logging service
    // await sendToLoggingService(event);
  }
}

