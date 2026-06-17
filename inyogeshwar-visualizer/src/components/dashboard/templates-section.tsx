"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Template {
  id: string
  name: string
  description: string
  preview: string
}

const templates: Template[] = [
  {
    id: "7clouds",
    name: "7Clouds",
    description: "Clean, modern lyrics display with gradient backgrounds",
    preview: "from-blue-500 to-purple-600",
  },
  {
    id: "scroll-lyrics",
    name: "Scroll Lyrics",
    description: "Smooth scrolling lyrics synchronized with audio",
    preview: "from-green-500 to-teal-600",
  },
  {
    id: "karaoke",
    name: "Karaoke",
    description: "Classic karaoke style with word-by-word highlighting",
    preview: "from-red-500 to-orange-600",
  },
  {
    id: "lofi-cover",
    name: "Lofi Cover Motion",
    description: "Chill lofi aesthetic with subtle animations",
    preview: "from-amber-500 to-pink-600",
  },
  {
    id: "apple-music",
    name: "Apple Music",
    description: "Apple Music inspired clean typography",
    preview: "from-indigo-500 to-purple-600",
  },
  {
    id: "spotify-canvas",
    name: "Spotify Canvas",
    description: "Spotify-style looping visual experience",
    preview: "from-emerald-500 to-cyan-600",
  },
]

interface TemplatesSectionProps {
  selectedTemplate?: string
  onTemplateSelect?: (templateId: string) => void
}

export function TemplatesSection({ selectedTemplate, onTemplateSelect }: TemplatesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTemplateSelect?.(template.id)}
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-xl border p-4 transition-all duration-300",
              selectedTemplate === template.id
                ? "border-purple-500/50 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
            )}
          >
            {/* Preview gradient */}
            <div className={cn("mb-3 h-20 w-full rounded-lg bg-gradient-to-br", template.preview)} />
            
            {/* Template info */}
            <div className="space-y-1">
              <h3 className="font-semibold text-white">{template.name}</h3>
              <p className="text-xs text-white/60">{template.description}</p>
            </div>

            {/* Selected indicator */}
            {selectedTemplate === template.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500"
              >
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
