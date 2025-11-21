"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface NotebookPageProps {
  children: ReactNode
  className?: string
  withMargin?: boolean
  withHeader?: boolean
  withLines?: boolean
  lineSpacing?: number
}

export function NotebookPage({
  children,
  className = "",
  withMargin = true,
  withHeader = false,
  withLines = true,
  lineSpacing = 32
}: NotebookPageProps) {
  return (
    <div className={`relative min-h-screen bg-white ${className}`}>
      {/* Paper texture and lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              transparent,
              transparent ${lineSpacing - 1}px,
              var(--sky-light) ${lineSpacing}px
            )
          `,
          opacity: 0.3
        }}
      />

      {/* Red margin line */}
      {withMargin && (
        <motion.div
          className="absolute left-4 md:left-16 top-0 bottom-0 w-0.5 bg-sunshine-red/30"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 0.5 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      )}

      {/* Page header with three holes */}
      {withHeader && (
        <div className="absolute left-4 top-4 flex flex-col gap-8">
          <div className="w-8 h-8 rounded-full border-2 border-gray-200 bg-white shadow-inner" />
          <div className="w-8 h-8 rounded-full border-2 border-gray-200 bg-white shadow-inner" />
          <div className="w-8 h-8 rounded-full border-2 border-gray-200 bg-white shadow-inner" />
        </div>
      )}

      {/* Content */}
      <div className={`relative z-10 ${withMargin ? 'pl-8 md:pl-24' : ''} p-4 md:p-8`}>
        {children}
      </div>
    </div>
  )
}

interface NotebookCardProps {
  children: ReactNode
  className?: string
  rotate?: number
}

export function NotebookCard({
  children,
  className = "",
  rotate = 0
}: NotebookCardProps) {
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 ${className}`}
      style={{
        transform: `rotate(${rotate}deg)`
      }}
      whileHover={{
        scale: 1.02,
        rotate: rotate + 2,
        transition: { duration: 0.2 }
      }}
    >
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  )
}

interface NotebookTitleProps {
  children: ReactNode
  className?: string
}

export function NotebookTitle({ children, className = "" }: NotebookTitleProps) {
  return (
    <motion.h2
      className={`font-hand text-4xl md:text-5xl text-sky-600 mb-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.h2>
  )
}

interface NotebookTextProps {
  children: ReactNode
  className?: string
  withAnimation?: boolean
}

export function NotebookText({
  children,
  className = "",
  withAnimation = true
}: NotebookTextProps) {
  return (
    <motion.p
      className={`font-patrick text-xl text-gray-600 leading-relaxed ${className}`}
      initial={withAnimation ? { opacity: 0, y: 20 } : undefined}
      whileInView={withAnimation ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {children}
    </motion.p>
  )
}

interface NotebookButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  variant?: "primary" | "secondary"
}

export function NotebookButton({
  children,
  className = "",
  onClick,
  variant = "primary"
}: NotebookButtonProps) {
  const baseClasses = "doodle-button font-hand text-xl px-8 py-3 transition-all"
  const variantClasses = {
    primary: "bg-sky-500 hover:bg-sky-600 text-white",
    secondary: "bg-sunshine-orange hover:bg-sunshine-red text-white"
  }

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}