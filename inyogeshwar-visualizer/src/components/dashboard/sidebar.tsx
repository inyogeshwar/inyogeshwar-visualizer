"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  LayoutDashboard, 
  Music2, 
  Image, 
  Type, 
  Palette, 
  Settings, 
  Upload,
  ChevronLeft,
  Menu
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "artwork", label: "Artwork", icon: <Image className="h-4 w-4" /> },
  { id: "audio", label: "Audio", icon: <Music2 className="h-4 w-4" /> },
  { id: "background", label: "Background", icon: <Image className="h-4 w-4" /> },
  { id: "lyrics", label: "Lyrics", icon: <Type className="h-4 w-4" /> },
  { id: "templates", label: "Templates", icon: <Palette className="h-4 w-4" /> },
  { id: "fonts", label: "Fonts", icon: <Type className="h-4 w-4" /> },
  { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
]

interface SidebarProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ 
  activeSection = "dashboard", 
  onSectionChange,
  collapsed = false,
  onToggle,
}: SidebarProps) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (isMobile && !collapsed) {
    return null
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 0 : isMobile ? 280 : 260 }}
      className={cn(
        "relative flex h-full flex-col border-r border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.01] backdrop-blur-xl",
        collapsed && "overflow-hidden"
      )}
    >
      {/* Header */}
      <div className={cn("flex h-16 items-center justify-between px-4", collapsed && "hidden")}>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <Music2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            InYogeshwar
          </span>
        </motion.div>
        
        {onToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 text-white/60 hover:text-white"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        )}
      </div>

      <Separator className={cn(collapsed && "hidden")} />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSectionChange?.(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                activeSection === item.id
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white shadow-lg shadow-purple-500/10"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <span className={cn("flex-shrink-0", activeSection === item.id && "text-purple-400")}>
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
              
              {activeSection === item.id && !collapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-purple-500"
                />
              )}
            </motion.button>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className={cn("border-t border-white/10 p-4", collapsed && "hidden")}>
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-white">Export Video</p>
              <p className="text-[10px] text-white/60">Render your creation</p>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
