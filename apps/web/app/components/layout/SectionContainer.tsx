"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { NotebookPage } from "../ui/NotebookUI";

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  withMargin?: boolean;
  withHeader?: boolean;
  withLines?: boolean;
  id?: string;
}

export default function SectionContainer({
  children,
  className = "",
  withMargin = true,
  withHeader = false,
  withLines = true,
  id,
}: SectionContainerProps) {
  return (
    <section id={id} className={`min-h-screen flex items-center ${className}`}>
      <NotebookPage
        withMargin={withMargin}
        withHeader={withHeader}
        withLines={withLines}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 py-20"
        >
          {children}
        </motion.div>
      </NotebookPage>
    </section>
  );
}
