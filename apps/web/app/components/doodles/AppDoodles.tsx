"use client";

import { motion } from "framer-motion";

interface DoodleProps {
  className?: string;
  stroke?: string;
  fill?: string;
}

export const CalendarDoodle = ({
  className = "",
  stroke = "currentColor",
  fill = "none",
}: DoodleProps) => (
  <motion.svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    whileHover={{ scale: 1.1, rotate: -5 }}
  >
    <path
      d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={fill}
    />
    <path
      d="M16 2V6"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 2V6"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 10H21"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 14H8.01"
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 14H12.01"
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 14H16.01"
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 18H8.01"
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 18H12.01"
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 18H16.01"
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

export const GroupDoodle = ({
  className = "",
  stroke = "currentColor",
  fill = "none",
}: DoodleProps) => (
  <motion.svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    whileHover={{ scale: 1.1, rotate: 5 }}
  >
    <path
      d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={fill}
    />
    <path
      d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={fill}
    />
    <path
      d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11684 19.0078 7.005C19.0078 7.89316 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

export const ShoppingBagDoodle = ({
  className = "",
  stroke = "currentColor",
  fill = "none",
}: DoodleProps) => (
  <motion.svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    whileHover={{ scale: 1.1, y: -2 }}
  >
    <path
      d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={fill}
    />
    <path
      d="M3 6H21"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

export const ChatDoodle = ({
  className = "",
  stroke = "currentColor",
  fill = "none",
}: DoodleProps) => (
  <motion.svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    whileHover={{ scale: 1.1, rotate: 5 }}
  >
    <path
      d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={fill}
    />
  </motion.svg>
);

export const AwardDoodle = ({
  className = "",
  stroke = "currentColor",
  fill = "none",
}: DoodleProps) => (
  <motion.svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    whileHover={{ scale: 1.1, y: -2 }}
  >
    <circle
      cx="12"
      cy="8"
      r="7"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={fill}
    />
    <path
      d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

export const RocketDoodle = ({
  className = "",
  stroke = "currentColor",
  fill = "none",
}: DoodleProps) => (
  <motion.svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    whileHover={{ scale: 1.1, x: 2, y: -2 }}
  >
    <path
      d="M4.5 16.5C6.5 16.5 8 18 8 20C8 21.1 7.1 22 6 22C4.9 22 4 21.1 4 20C4 18 5.5 16.5 7.5 16.5Z"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 11L2 19"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 11L12 13"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 13L20 5"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 5L22 3"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 3L19 2"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 2L10 11"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

export const CheckDoodle = ({
  className = "",
  stroke = "currentColor",
}: DoodleProps) => (
  <motion.svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 0.5 }}
  >
    <path
      d="M20 6L9 17L4 12"
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

export const ArrowRightDoodle = ({
  className = "",
  stroke = "currentColor",
}: DoodleProps) => (
  <motion.svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5 12H19"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 5L19 12L12 19"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

export const MenuDoodle = ({
  className = "",
  stroke = "currentColor",
}: DoodleProps) => (
  <motion.svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 12H21"
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 6H21"
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 18H21"
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

export const XDoodle = ({
  className = "",
  stroke = "currentColor",
}: DoodleProps) => (
  <motion.svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M18 6L6 18"
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 6L18 18"
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

export const PlayDoodle = ({
  className = "",
  stroke = "currentColor",
  fill = "none",
}: DoodleProps) => (
  <motion.svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    whileHover={{ scale: 1.1 }}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke={stroke}
      strokeWidth="2"
      fill={fill}
    />
    <path
      d="M10 8L16 12L10 16V8Z"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={stroke}
    />
  </motion.svg>
);
