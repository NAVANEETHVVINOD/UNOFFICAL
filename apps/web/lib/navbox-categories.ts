/**
 * NavBox Category Definitions
 * Separated from component for testability
 */

import {
  Home,
  GraduationCap,
  Compass,
  MessageCircle,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface CategoryItem {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  pathTemplate: string; // Use template for dynamic paths
}

// Global variant: Home, College, Explore, Chat (4 items)
export const GLOBAL_CATEGORIES: CategoryItem[] = [
  { id: 'home', label: 'Home', icon: Home, color: 'bg-primary', pathTemplate: '/dashboard' },
  { id: 'college', label: 'College', icon: GraduationCap, color: 'bg-accent-coral', pathTemplate: '{{collegeHref}}' },
  { id: 'explore', label: 'Explore', icon: Compass, color: 'bg-accent-blue', pathTemplate: '/explore' },
  { id: 'chat', label: 'Chat', icon: MessageCircle, color: 'bg-accent-orange', pathTemplate: '/messages' },
];

// College variant: Home, College, Clubs (3 items)
export const COLLEGE_CATEGORIES: CategoryItem[] = [
  { id: 'home', label: 'Home', icon: Home, color: 'bg-primary', pathTemplate: '/dashboard' },
  { id: 'college', label: 'College', icon: GraduationCap, color: 'bg-accent-coral', pathTemplate: '{{collegeHref}}' },
  { id: 'clubs', label: 'Clubs', icon: Users, color: 'bg-accent-blue', pathTemplate: '/clubs' },
];

// Helper functions for testing
export const getGlobalCategoryIds = (): string[] => GLOBAL_CATEGORIES.map(c => c.id);
export const getCollegeCategoryIds = (): string[] => COLLEGE_CATEGORIES.map(c => c.id);

export const getGlobalCategoryCount = (): number => GLOBAL_CATEGORIES.length;
export const getCollegeCategoryCount = (): number => COLLEGE_CATEGORIES.length;

export type NavBoxVariant = 'global' | 'college';

export const getCategoriesForVariant = (variant: NavBoxVariant): CategoryItem[] => {
  return variant === 'college' ? COLLEGE_CATEGORIES : GLOBAL_CATEGORIES;
};

export const getCategoryIdsForVariant = (variant: NavBoxVariant): string[] => {
  return variant === 'college' ? getCollegeCategoryIds() : getGlobalCategoryIds();
};
