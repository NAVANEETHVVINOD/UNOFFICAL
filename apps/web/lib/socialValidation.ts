/**
 * Social Link URL Validation
 * Validates URLs for various social media platforms
 */

export type SocialPlatform = 
  | "instagram"
  | "linkedin"
  | "github"
  | "discord"
  | "whatsapp"
  | "twitter"
  | "website";

interface ValidationResult {
  isValid: boolean;
  error?: string;
  normalizedUrl?: string;
}

// Platform-specific URL patterns
const SOCIAL_PATTERNS: Record<SocialPlatform, RegExp> = {
  instagram: /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/,
  linkedin: /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9_-]+\/?$/,
  github: /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/,
  discord: /^https?:\/\/(www\.)?(discord\.(gg|com\/invite)|discordapp\.com\/invite)\/[a-zA-Z0-9]+\/?$/,
  whatsapp: /^https?:\/\/(wa\.me|api\.whatsapp\.com\/send\?phone=)\d+\/?$/,
  twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/?$/,
  website: /^https?:\/\/.+\..+/,
};

// Platform display names
export const PLATFORM_NAMES: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  github: "GitHub",
  discord: "Discord",
  whatsapp: "WhatsApp",
  twitter: "Twitter/X",
  website: "Website",
};

// Platform URL prefixes for autocomplete
export const PLATFORM_PREFIXES: Record<SocialPlatform, string> = {
  instagram: "https://instagram.com/",
  linkedin: "https://linkedin.com/in/",
  github: "https://github.com/",
  discord: "https://discord.gg/",
  whatsapp: "https://wa.me/",
  twitter: "https://twitter.com/",
  website: "https://",
};

/**
 * Validate a social media URL for a specific platform
 */
export function validateSocialUrl(
  url: string,
  platform: SocialPlatform
): ValidationResult {
  // Empty URL is valid (optional field)
  if (!url || url.trim() === "") {
    return { isValid: true };
  }

  const trimmedUrl = url.trim();

  // Check if URL has protocol, add https:// if missing
  let normalizedUrl = trimmedUrl;
  if (!normalizedUrl.match(/^https?:\/\//)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  // Validate against platform pattern
  const pattern = SOCIAL_PATTERNS[platform];
  if (!pattern.test(normalizedUrl)) {
    return {
      isValid: false,
      error: `Please enter a valid ${PLATFORM_NAMES[platform]} URL`,
    };
  }

  return {
    isValid: true,
    normalizedUrl,
  };
}

/**
 * Validate all social links at once
 */
export function validateAllSocialLinks(
  links: Partial<Record<SocialPlatform, string>>
): Record<SocialPlatform, ValidationResult> {
  const results: Record<SocialPlatform, ValidationResult> = {} as any;

  for (const platform of Object.keys(SOCIAL_PATTERNS) as SocialPlatform[]) {
    const url = links[platform];
    results[platform] = validateSocialUrl(url || "", platform);
  }

  return results;
}

/**
 * Check if any social link has validation errors
 */
export function hasValidationErrors(
  results: Record<SocialPlatform, ValidationResult>
): boolean {
  return Object.values(results).some((r) => !r.isValid);
}

/**
 * Extract username from social URL
 */
export function extractUsername(url: string, platform: SocialPlatform): string | null {
  if (!url) return null;

  try {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    const pathname = urlObj.pathname.replace(/^\/|\/$/g, "");

    switch (platform) {
      case "instagram":
      case "github":
      case "twitter":
        return pathname || null;
      case "linkedin":
        // Remove "in/" or "company/" prefix
        return pathname.replace(/^(in|company)\//, "") || null;
      case "discord":
        // Return invite code
        return pathname.replace(/^invite\//, "") || null;
      case "whatsapp":
        // Return phone number
        if (urlObj.hostname === "wa.me") {
          return pathname || null;
        }
        return urlObj.searchParams.get("phone") || null;
      default:
        return null;
    }
  } catch {
    return null;
  }
}

/**
 * Build social URL from username
 */
export function buildSocialUrl(username: string, platform: SocialPlatform): string {
  if (!username) return "";
  
  // Remove @ prefix if present
  const cleanUsername = username.replace(/^@/, "");
  
  return `${PLATFORM_PREFIXES[platform]}${cleanUsername}`;
}

/**
 * Get platform icon name (for lucide-react or similar)
 */
export function getPlatformIcon(platform: SocialPlatform): string {
  const icons: Record<SocialPlatform, string> = {
    instagram: "Instagram",
    linkedin: "Linkedin",
    github: "Github",
    discord: "MessageCircle",
    whatsapp: "MessageSquare",
    twitter: "Twitter",
    website: "Globe",
  };
  return icons[platform];
}
