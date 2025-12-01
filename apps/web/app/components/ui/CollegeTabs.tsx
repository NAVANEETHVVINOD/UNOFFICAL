"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface CollegeTabsProps {
  slug: string;
}

export default function CollegeTabs({ slug }: CollegeTabsProps) {
  const pathname = usePathname();
  const baseUrl = `/colleges/${slug}`;

  const tabs = [
    { href: baseUrl, label: "Feed", exact: true },
    { href: `${baseUrl}/events`, label: "Events" },
    { href: `${baseUrl}/clubs`, label: "Clubs" },
    { href: `${baseUrl}/marketplace`, label: "Market" },
  ];

  return (
    <div className="flex overflow-x-auto gap-2 p-2 mb-6 no-scrollbar border-b-2 border-black/5">
      {tabs.map((tab) => {
        const isActive = tab.exact
          ? pathname === tab.href
          : pathname.startsWith(tab.href);

        return (
          <Link key={tab.href} href={tab.href}>
            <div
              className={`
                            px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all border-2
                            ${
                              isActive
                                ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-y-[-2px]"
                                : "bg-white text-gray-600 border-transparent hover:border-black hover:bg-gray-50"
                            }
                        `}
            >
              {tab.label}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
