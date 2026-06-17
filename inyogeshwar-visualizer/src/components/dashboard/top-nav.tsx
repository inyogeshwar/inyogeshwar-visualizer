"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Bell, Search, User, ChevronDown, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TopNavProps {
  title?: string
}

export function TopNav({ title = "Dashboard" }: TopNavProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-[#030014]/80 px-6 backdrop-blur-xl"
    >
      {/* Left section */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold text-white">{title}</h1>
          <p className="text-xs text-white/50">Create stunning lyric videos</p>
        </div>
      </div>

      {/* Center - Search */}
      <div className="hidden flex-1 max-w-md items-center justify-center md:flex">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            type="search"
            placeholder="Search templates, projects..."
            className="pl-10 bg-white/5 border-white/10 text-sm"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* AI Assistant */}
        <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span className="text-xs">AI Assist</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-white/60 hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        {/* Separator */}
        <div className="mx-2 h-6 w-[1px] bg-white/10 hidden sm:block" />

        {/* User menu */}
        <Button variant="ghost" className="gap-2 text-white/80 hover:text-white hidden sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm">Creator</span>
          <ChevronDown className="h-4 w-4" />
        </Button>

        {/* Mobile user button */}
        <Button variant="ghost" size="icon" className="sm:hidden text-white/60 hover:text-white">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </motion.header>
  )
}
