"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "./sidebar"
import { TopNav } from "./top-nav"
import { UploadFile } from "./upload-file"
import { LyricsSection } from "./lyrics-section"
import { TemplatesSection } from "./templates-section"
import { VideoPreview } from "./video-preview"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Image, Music, Type, Video, Palette, FileFont } from "lucide-react"

export default function CreatorDashboard() {
  const [activeSection, setActiveSection] = React.useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [selectedTemplate, setSelectedTemplate] = React.useState("7clouds")
  const [lyrics, setLyrics] = React.useState("")
  const [artwork, setArtwork] = React.useState<File | null>(null)
  const [audio, setAudio] = React.useState<File | null>(null)
  const [backgroundImage, setBackgroundImage] = React.useState<File | null>(null)
  const [backgroundVideo, setBackgroundVideo] = React.useState<File | null>(null)
  const [customFonts, setCustomFonts] = React.useState<File | null>(null)
  const [videoSize, setVideoSize] = React.useState("vertical")

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Projects", value: "12", change: "+2 this week" },
                { label: "Videos Rendered", value: "48", change: "+8 today" },
                { label: "Storage Used", value: "2.4 GB", change: "of 10 GB" },
                { label: "Templates", value: "6", change: "All available" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-5 backdrop-blur-sm"
                >
                  <p className="text-sm text-white/60">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-purple-400">{stat.change}</p>
                </motion.div>
              ))}
            </div>

            {/* Main upload sections */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6"
              >
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Image className="h-5 w-5 text-purple-400" />
                  Upload Artwork
                </h3>
                <UploadFile
                  label="Album/Single Artwork"
                  accept="image/*"
                  onFileSelect={setArtwork}
                  icon={<Image className="h-8 w-8" />}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6"
              >
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Music className="h-5 w-5 text-pink-400" />
                  Upload Audio
                </h3>
                <UploadFile
                  label="Audio Track (MP3, WAV, FLAC)"
                  accept="audio/*"
                  onFileSelect={setAudio}
                  icon={<Music className="h-8 w-8" />}
                />
              </motion.div>
            </div>

            {/* Background uploads */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6"
              >
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Image className="h-5 w-5 text-cyan-400" />
                  Background Image
                </h3>
                <UploadFile
                  label="Background Image (Optional)"
                  accept="image/*"
                  onFileSelect={setBackgroundImage}
                  icon={<Image className="h-8 w-8" />}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6"
              >
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Video className="h-5 w-5 text-orange-400" />
                  Background Video
                </h3>
                <UploadFile
                  label="Background Video (Optional)"
                  accept="video/*"
                  onFileSelect={setBackgroundVideo}
                  icon={<Video className="h-8 w-8" />}
                />
              </motion.div>
            </div>

            {/* Custom Fonts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6"
            >
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <FileFont className="h-5 w-5 text-green-400" />
                Custom Fonts
              </h3>
              <UploadFile
                label="Upload Custom Font Files (TTF, OTF, WOFF)"
                accept=".ttf,.otf,.woff,.woff2"
                onFileSelect={setCustomFonts}
                icon={<FileFont className="h-8 w-8" />}
              />
            </motion.div>

            {/* Lyrics Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6"
            >
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Type className="h-5 w-5 text-yellow-400" />
                Lyrics
              </h3>
              <LyricsSection onLyricsChange={setLyrics} />
            </motion.div>

            {/* Templates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6"
            >
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Palette className="h-5 w-5 text-indigo-400" />
                Templates
              </h3>
              <TemplatesSection
                selectedTemplate={selectedTemplate}
                onTemplateSelect={setSelectedTemplate}
              />
            </motion.div>
          </div>
        )

      case "artwork":
        return (
          <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-lg font-semibold text-white">Artwork</h3>
            <UploadFile
              label="Upload Album/Single Artwork"
              accept="image/*"
              onFileSelect={setArtwork}
              icon={<Image className="h-8 w-8" />}
            />
          </div>
        )

      case "audio":
        return (
          <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-lg font-semibold text-white">Audio</h3>
            <UploadFile
              label="Upload Audio Track"
              accept="audio/*"
              onFileSelect={setAudio}
              icon={<Music className="h-8 w-8" />}
            />
          </div>
        )

      case "background":
        return (
          <div className="space-y-6 rounded-xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-lg font-semibold text-white">Background</h3>
            <UploadFile
              label="Background Image"
              accept="image/*"
              onFileSelect={setBackgroundImage}
              icon={<Image className="h-8 w-8" />}
            />
            <UploadFile
              label="Background Video"
              accept="video/*"
              onFileSelect={setBackgroundVideo}
              icon={<Video className="h-8 w-8" />}
            />
          </div>
        )

      case "lyrics":
        return (
          <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-lg font-semibold text-white">Lyrics</h3>
            <LyricsSection onLyricsChange={setLyrics} />
          </div>
        )

      case "templates":
        return (
          <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-lg font-semibold text-white">Templates</h3>
            <TemplatesSection
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
            />
          </div>
        )

      case "fonts":
        return (
          <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-lg font-semibold text-white">Custom Fonts</h3>
            <UploadFile
              label="Upload Font Files"
              accept=".ttf,.otf,.woff,.woff2"
              onFileSelect={setCustomFonts}
              icon={<FileFont className="h-8 w-8" />}
            />
          </div>
        )

      case "settings":
        return (
          <div className="space-y-6 rounded-xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-lg font-semibold text-white">Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Auto-save projects</p>
                  <p className="text-xs text-white/50">Automatically save your work every 5 minutes</p>
                </div>
                <Button variant="outline" size="sm">Enabled</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Default video quality</p>
                  <p className="text-xs text-white/50">Choose output resolution</p>
                </div>
                <select className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
                  <option>1080p (Full HD)</option>
                  <option>4K (Ultra HD)</option>
                  <option>720p (HD)</option>
                </select>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#030014]">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation */}
        <TopNav title={activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} />

        {/* Content and Preview */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main content */}
          <ScrollArea className="flex-1 p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </ScrollArea>

          {/* Live Preview Panel - Right Side */}
          <motion.aside
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden w-[400px] flex-shrink-0 border-l border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.01] p-6 lg:block"
          >
            <div className="sticky top-24">
              <h3 className="mb-4 text-sm font-semibold text-white/90">Live Preview</h3>
              <VideoPreview
                template={selectedTemplate}
                lyrics={lyrics}
                artwork={artwork}
                backgroundImage={backgroundImage}
                backgroundVideo={backgroundVideo}
                selectedSize={videoSize}
                onSizeChange={setVideoSize}
              />

              {/* Export button */}
              <Button className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Video className="mr-2 h-4 w-4" />
                Export Video
              </Button>

              {/* Quick tips */}
              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <h4 className="mb-2 text-xs font-semibold text-white/70">Quick Tips</h4>
                <ul className="space-y-1 text-xs text-white/50">
                  <li>• Use high-resolution artwork for best results</li>
                  <li>• LRC files provide synchronized lyrics</li>
                  <li>• Preview before exporting final video</li>
                </ul>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  )
}
