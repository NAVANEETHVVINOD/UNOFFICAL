export function logEvent(event: string, data?: any) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${event}`, data || "");
  }
  // In production, this would send data to Vercel Analytics, PostHog, etc.
}
