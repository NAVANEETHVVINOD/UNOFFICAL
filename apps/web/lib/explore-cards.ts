/**
 * Explore Page Card Definitions
 * Separated from component for testability
 */

import {
  Calendar,
  ShoppingBag,
  BookOpen,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface ExploreCard {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  hoverColor: string;
  path: string;
}

// Only 4 cards: Events, Marketplace, Collaborations, Resources
export const EXPLORE_CARDS: ExploreCard[] = [
  {
    id: 'events',
    label: 'Events',
    description: 'Discover campus events, workshops, and meetups happening around you.',
    icon: Calendar,
    color: 'bg-accent-coral',
    hoverColor: 'hover:border-accent-coral',
    path: '/events',
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    description: 'Buy, sell, and trade textbooks, gadgets, and more with students.',
    icon: ShoppingBag,
    color: 'bg-primary',
    hoverColor: 'hover:border-primary',
    path: '/marketplace',
  },
  {
    id: 'collabo',
    label: 'Collaborations',
    description: 'Find teammates for projects, hackathons, and study groups.',
    icon: Users,
    color: 'bg-accent-mint',
    hoverColor: 'hover:border-accent-mint',
    path: '/collabo',
  },
  {
    id: 'resources',
    label: 'Resources',
    description: 'Access notes, study guides, and academic materials shared by peers.',
    icon: BookOpen,
    color: 'bg-accent-purple',
    hoverColor: 'hover:border-accent-purple',
    path: '/resources',
  },
];

// Helper functions for testing
export const getExploreCardIds = (): string[] => EXPLORE_CARDS.map(c => c.id);
export const getExploreCardCount = (): number => EXPLORE_CARDS.length;
