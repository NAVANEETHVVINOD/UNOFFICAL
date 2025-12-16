/**
 * QR Code utilities for event check-in
 */

/**
 * Generate a unique QR code data string for an event
 */
export function generateEventQRData(eventId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `LINKER_EVENT:${eventId}:${timestamp}:${random}`;
}

/**
 * Parse QR code data to extract event ID
 */
export function parseEventQRData(qrData: string): { eventId: string; timestamp: number } | null {
  const parts = qrData.split(":");
  if (parts.length >= 3 && parts[0] === "LINKER_EVENT") {
    return {
      eventId: parts[1],
      timestamp: parseInt(parts[2], 10),
    };
  }
  return null;
}

/**
 * Generate QR code URL using a public QR code API
 * In production, you'd use a library like qrcode.react
 */
export function getQRCodeImageUrl(data: string, size: number = 200): string {
  const encoded = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`;
}

/**
 * Check if QR code is still valid (within 24 hours of event)
 */
export function isQRCodeValid(qrTimestamp: number, eventStartTime: Date): boolean {
  const now = Date.now();
  const eventTime = new Date(eventStartTime).getTime();
  
  // QR code is valid from 2 hours before event to 4 hours after
  const validFrom = eventTime - 2 * 60 * 60 * 1000;
  const validUntil = eventTime + 4 * 60 * 60 * 1000;
  
  return now >= validFrom && now <= validUntil;
}
