"use client";

import { ReactNode } from "react";

interface GridProps {
  children: ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

const gridCols = {
  1: "grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

const gridGaps = {
  sm: "gap-4 md:gap-6",
  md: "gap-6 md:gap-8",
  lg: "gap-8 md:gap-12",
};

export default function Grid({
  children,
  className = "",
  cols = 2,
  gap = "md",
}: GridProps) {
  return (
    <div className={`grid ${gridCols[cols]} ${gridGaps[gap]} ${className}`}>
      {children}
    </div>
  );
}
