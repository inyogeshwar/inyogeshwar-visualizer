"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Select } from "@/components/ui/select"

interface VideoSize {
  id: string
  name: string
  aspectRatio: string
  dimensions: string
}

const videoSizes: VideoSize[] = [
  { id: "vertical", name: "Vertical", aspectRatio: "9:16", dimensions: "1080x1920" },
  { id: "square", name: "Square", aspectRatio: "1:1", dimensions: "1080x1080" },
  { id: "horizontal", name: "Horizontal", aspectRatio: "16:9", dimensions: "1920x1080" },
]

interface VideoPreviewProps {
  template?: string
  lyrics?: string
  artwork?: File | null
  backgroundImage?: File | null
  backgroundVideo?: File | null
  selectedSize?: string
  onSizeChange?: (size: string) => void
}

export function VideoPreview({
  template = "7clouds",
  lyrics = "",
  artwork,
  backgroundImage,
  backgroundVideo,
  selectedSize = "vertical",
  onSizeChange,
}: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(0)
  const previewRef = React.useRef<HTMLDivElement>(null)

  const currentSize = videoSizes.find((s) => s.id === selectedSize) || videoSizes[0]

  const getAspectRatioClass = () => {
    switch (selectedSize) {
      case "vertical":
        return "aspect-[9/16] max-h-[600px]"
      case "square":
        return "aspect-square max-h-[500px]"
      case "horizontal":
        return "aspect-video max-h-[400px]"
      default:
        return "aspect-[9/16]"
    }
  }

  const getTemplateStyle = () => {
    const styles: Record<string, string> = {
      "7clouds": "from-blue-900/80 to-purple-900/80",
      "scroll-lyrics": "from-green-900/80 to-teal-900/80",
      karaoke: "from-red-900/80 to-orange-900/80",
      "lofi-cover": "from-amber-900/80 to-pink-900/80",
      "apple-music": "from-indigo-900/80 to-purple-900/80",
      "spotify-canvas": "from-emerald-900/80 to-cyan-900/80",
    }
    return styles[template] || styles["7clouds"]
  }

  // Simulate playback
  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev >= 100 ? 0 : prev + 0.5))
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className="space-y-4">
      {/* Size selector */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white/90">Video Size</label>
        <div className="w-40">
          <Select value={selectedSize} onChange={onSizeChange}>
            {videoSizes.map((size) => (
              <option key={size.id} value={size.id}>
                {size.name} ({size.aspectRatio})
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Preview container */}
      <motion.div
        ref={previewRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br shadow-2xl",
          getTemplateStyle(),
          getAspectRatioClass()
        )}
      >
        {/* Background layer */}
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{
              backgroundImage: `url(${URL.createObjectURL(backgroundImage)})`,
            }}
          />
        )}

        {/* Video background layer */}
        {backgroundVideo && (
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-40"
            src={URL.createObjectURL(backgroundVideo)}
            autoPlay
            loop
            muted
            playsInline
          />
        )}

        {/* Content overlay */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-6">
          {/* Artwork */}
          {artwork ? (
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={URL.createObjectURL(artwork)}
              alt="Artwork"
              className="h-32 w-32 rounded-lg object-cover shadow-2xl sm:h-40 sm:w-40"
            />
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex h-32 w-32 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm sm:h-40 sm:w-40"
            >
              <span className="text-4xl">🎵</span>
            </motion.div>
          )}

          {/* Lyrics display */}
          {lyrics && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 max-w-[80%] text-center"
            >
              <p className="text-sm font-medium text-white/90 drop-shadow-lg sm:text-base">
                {lyrics.split("\n")[0] || "Your lyrics will appear here"}
              </p>
            </motion.div>
          )}
        </div>

        {/* Template-specific effects */}
        {template === "spotify-canvas" && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40" />
        )}

        {/* Play/Pause overlay */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100 focus:opacity-100"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            {isPlaying ? (
              <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="ml-1 h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </button>
      </motion.div>

      {/* Playback controls */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-white transition-colors hover:bg-purple-600"
          >
            {isPlaying ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="ml-0.5 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="flex-1 space-y-2">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${currentTime}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/50">
              <span>{Math.floor((currentTime / 100) * 180)}s</span>
              <span>180s</span>
            </div>
          </div>
        </div>

        {/* Size info */}
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-white/60">
          <span>{currentSize.name}</span>
          <span>{currentSize.dimensions}</span>
          <span>{currentSize.aspectRatio}</span>
        </div>
      </div>
    </div>
  )
}
