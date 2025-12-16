/**
 * Karma/Reputation System
 * Awards points for positive actions and tracks user levels
 */

// Karma point values for different actions
export const KARMA_ACTIONS = {
  // Content creation
  CREATE_POST: 5,
  CREATE_LISTING: 3,
  UPLOAD_NOTE: 10,
  
  // Engagement received
  RECEIVE_LIKE: 2,
  RECEIVE_COMMENT: 3,
  RECEIVE_SAVE: 2,
  NOTE_DOWNLOAD: 1,
  
  // Event participation
  RSVP_EVENT: 2,
  ATTEND_EVENT: 10,
  CHECK_IN_EVENT: 15,
  
  // Club activity
  JOIN_CLUB: 5,
  
  // Social
  PROFILE_COMPLETE: 20,
  FIRST_POST: 10,
  FIRST_EVENT: 10,
} as const;

// Level thresholds
export const LEVEL_THRESHOLDS = [
  { level: 1, minKarma: 0, title: "Freshman" },
  { level: 2, minKarma: 50, title: "Sophomore" },
  { level: 3, minKarma: 150, title: "Junior" },
  { level: 4, minKarma: 300, title: "Senior" },
  { level: 5, minKarma: 500, title: "Graduate" },
  { level: 6, minKarma: 800, title: "Alumni Star" },
  { level: 7, minKarma: 1200, title: "Campus Legend" },
  { level: 8, minKarma: 2000, title: "Hall of Fame" },
  { level: 9, minKarma: 3500, title: "Campus Icon" },
  { level: 10, minKarma: 5000, title: "LINKER Elite" },
];

// Badge definitions
export const BADGES = [
  { id: "first_post", name: "First Words", description: "Created your first post", icon: "✍️", karmaRequired: 0 },
  { id: "social_butterfly", name: "Social Butterfly", description: "Joined 5 clubs", icon: "🦋", karmaRequired: 0 },
  { id: "event_goer", name: "Event Goer", description: "Attended 5 events", icon: "🎉", karmaRequired: 0 },
  { id: "karma_50", name: "Rising Star", description: "Earned 50 karma", icon: "⭐", karmaRequired: 50 },
  { id: "karma_150", name: "Campus Regular", description: "Earned 150 karma", icon: "🌟", karmaRequired: 150 },
  { id: "karma_500", name: "Campus Celebrity", description: "Earned 500 karma", icon: "💫", karmaRequired: 500 },
  { id: "karma_1000", name: "Campus Legend", description: "Earned 1000 karma", icon: "🏆", karmaRequired: 1000 },
  { id: "note_master", name: "Note Master", description: "Uploaded 10 notes", icon: "📚", karmaRequired: 0 },
  { id: "helper", name: "Helpful Hand", description: "Received 50 likes on posts", icon: "🤝", karmaRequired: 0 },
  { id: "verified", name: "Verified Student", description: "Completed profile verification", icon: "✅", karmaRequired: 0 },
];

/**
 * Calculate user level from karma points
 */
export function calculateLevel(karma: number): { level: number; title: string; progress: number; nextLevel: typeof LEVEL_THRESHOLDS[0] | null } {
  let currentLevel = LEVEL_THRESHOLDS[0];
  let nextLevel: typeof LEVEL_THRESHOLDS[0] | null = LEVEL_THRESHOLDS[1];
  
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (karma >= LEVEL_THRESHOLDS[i].minKarma) {
      currentLevel = LEVEL_THRESHOLDS[i];
      nextLevel = LEVEL_THRESHOLDS[i + 1] || null;
      break;
    }
  }
  
  // Calculate progress to next level
  let progress = 100;
  if (nextLevel) {
    const currentMin = currentLevel.minKarma;
    const nextMin = nextLevel.minKarma;
    progress = Math.min(100, Math.round(((karma - currentMin) / (nextMin - currentMin)) * 100));
  }
  
  return {
    level: currentLevel.level,
    title: currentLevel.title,
    progress,
    nextLevel,
  };
}

/**
 * Get badges earned based on karma
 */
export function getEarnedBadges(karma: number, stats?: { posts?: number; clubs?: number; events?: number; notes?: number; likesReceived?: number }): typeof BADGES {
  return BADGES.filter(badge => {
    // Karma-based badges
    if (badge.karmaRequired > 0) {
      return karma >= badge.karmaRequired;
    }
    
    // Activity-based badges (would need stats from backend)
    if (stats) {
      if (badge.id === "first_post" && stats.posts && stats.posts > 0) return true;
      if (badge.id === "social_butterfly" && stats.clubs && stats.clubs >= 5) return true;
      if (badge.id === "event_goer" && stats.events && stats.events >= 5) return true;
      if (badge.id === "note_master" && stats.notes && stats.notes >= 10) return true;
      if (badge.id === "helper" && stats.likesReceived && stats.likesReceived >= 50) return true;
    }
    
    return false;
  });
}

/**
 * Format karma number for display
 */
export function formatKarma(karma: number): string {
  if (karma >= 1000) {
    return `${(karma / 1000).toFixed(1)}k`;
  }
  return karma.toString();
}


/**
 * Karma notification types
 */
export type KarmaNotificationType = 
  | "LIKE_RECEIVED"
  | "COMMENT_RECEIVED"
  | "SAVE_RECEIVED"
  | "NOTE_DOWNLOADED"
  | "LEVEL_UP"
  | "BADGE_EARNED";

export interface KarmaNotification {
  type: KarmaNotificationType;
  points: number;
  message: string;
  badge?: typeof BADGES[0];
  newLevel?: typeof LEVEL_THRESHOLDS[0];
}

/**
 * Generate karma notification message
 */
export function generateKarmaNotification(
  type: KarmaNotificationType,
  points: number,
  actorName?: string,
  contentType?: string
): KarmaNotification {
  const messages: Record<KarmaNotificationType, string> = {
    LIKE_RECEIVED: `${actorName || "Someone"} liked your ${contentType || "post"}! +${points} karma`,
    COMMENT_RECEIVED: `${actorName || "Someone"} commented on your ${contentType || "post"}! +${points} karma`,
    SAVE_RECEIVED: `${actorName || "Someone"} saved your ${contentType || "post"}! +${points} karma`,
    NOTE_DOWNLOADED: `Your note was downloaded! +${points} karma`,
    LEVEL_UP: `Congratulations! You've reached a new level! +${points} karma`,
    BADGE_EARNED: `You've earned a new badge! +${points} karma`,
  };

  return {
    type,
    points,
    message: messages[type],
  };
}

/**
 * Check if user leveled up after karma change
 */
export function checkLevelUp(oldKarma: number, newKarma: number): typeof LEVEL_THRESHOLDS[0] | null {
  const oldLevel = calculateLevel(oldKarma);
  const newLevel = calculateLevel(newKarma);
  
  if (newLevel.level > oldLevel.level) {
    return LEVEL_THRESHOLDS.find(l => l.level === newLevel.level) || null;
  }
  
  return null;
}

/**
 * Check if user earned new badges after karma change
 */
export function checkNewBadges(
  oldKarma: number, 
  newKarma: number,
  stats?: { posts?: number; clubs?: number; events?: number; notes?: number; likesReceived?: number }
): typeof BADGES {
  const oldBadges = getEarnedBadges(oldKarma, stats);
  const newBadges = getEarnedBadges(newKarma, stats);
  
  // Return badges that are in newBadges but not in oldBadges
  return newBadges.filter(newBadge => 
    !oldBadges.some(oldBadge => oldBadge.id === newBadge.id)
  );
}
