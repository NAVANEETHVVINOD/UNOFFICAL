"use client";

import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

// Warning/Alert Icon
export const WarningIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
  </svg>
);

// Search/Magnifying Glass Icon
export const SearchIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="M21 21l-4.35-4.35"/>
  </svg>
);

// Checkmark Icon
export const CheckIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
  </svg>
);

// Heart Icon
export const HeartIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

// Comment/Chat Icon
export const CommentIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 6h-2V4c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v12l4-4h9v2H6l-4 4V4h14v2h1c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2h-5l-4 4v-4H3v-2h5v2l2-2h11V6z"/>
  </svg>
);

// Calendar/Event Icon
export const CalendarIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
  </svg>
);

// Location/Pin Icon
export const LocationIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

// User/Person Icon
export const UserIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

// Party/Celebration Icon
export const PartyIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 22l1-2 2 1-1 2-2-1zm4-4l1-2 2 1-1 2-2-1zm4-4l1-2 2 1-1 2-2-1zm4-4l1-2 2 1-1 2-2-1zm4-4l1-2 2 1-1 2-2-1zM7 2l2 1-1 2-2-1 1-2zm4 4l2 1-1 2-2-1 1-2zm4 4l2 1-1 2-2-1 1-2zm4 4l2 1-1 2-2-1 1-2z"/>
  </svg>
);

// Notes/Document Icon
export const NotesIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 12h8v2H8v-2zm0 4h8v2H8v-2z"/>
  </svg>
);

// Lock Icon
export const LockIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
  </svg>
);

// Clock/Time Icon
export const ClockIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
  </svg>
);

// Shopping/Cart Icon
export const ShoppingIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>
);

// Book/Study Icon
export const BookIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
  </svg>
);

// Message/Mail Icon
export const MessageIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

// Bolt/Lightning Icon
export const BoltIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>
  </svg>
);

// Close/X Icon
export const CloseIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

// Coffee Icon
export const CoffeeIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 21h18v-2H2v2zm18-10h-2V3H4v8H2v2h2v2h14v-2h2v-2zm-4 0H6V5h10v6z"/>
  </svg>
);

// Export all icons as a collection
export const Icons = {
  Warning: WarningIcon,
  Search: SearchIcon,
  Check: CheckIcon,
  Heart: HeartIcon,
  Comment: CommentIcon,
  Calendar: CalendarIcon,
  Location: LocationIcon,
  User: UserIcon,
  Party: PartyIcon,
  Notes: NotesIcon,
  Lock: LockIcon,
  Clock: ClockIcon,
  Shopping: ShoppingIcon,
  Book: BookIcon,
  Message: MessageIcon,
  Bolt: BoltIcon,
  Close: CloseIcon,
  Coffee: CoffeeIcon,
};

export default Icons;
