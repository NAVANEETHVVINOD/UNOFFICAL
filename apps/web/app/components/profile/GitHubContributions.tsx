"use client";

import { Github } from "lucide-react";

interface GitHubContributionsProps {
  username?: string;
  contributions?: number;
  days?: number;
}

// Generate mock contribution data for display
const generateContributionGrid = () => {
  const weeks = 17; // ~4 months
  const days = 7;
  const grid: number[][] = [];
  
  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < days; d++) {
      // Random contribution level 0-4
      week.push(Math.floor(Math.random() * 5));
    }
    grid.push(week);
  }
  return grid;
};

const contributionColors = [
  "bg-neutral-100",      // 0 contributions
  "bg-accent-mint/30",   // 1-2 contributions
  "bg-accent-mint/50",   // 3-5 contributions
  "bg-accent-mint/70",   // 6-9 contributions
  "bg-accent-mint",      // 10+ contributions
];

export default function GitHubContributions({ username, contributions = 171, days = 120 }: GitHubContributionsProps) {
  if (!username) return null;

  const grid = generateContributionGrid();

  return (
    <div className="p-6 border-t border-ink/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Github className="w-5 h-5" />
          <span className="font-bold">Github</span>
        </div>
        <span className="text-sm text-neutral-500">
          {contributions} contributions in past {days} days
        </span>
      </div>
      
      {/* Contribution Grid */}
      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {grid.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((level, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 rounded-sm ${contributionColors[level]}`}
                  title={`${level} contributions`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-3 text-xs text-neutral-500">
        <span>Less</span>
        {contributionColors.map((color, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
