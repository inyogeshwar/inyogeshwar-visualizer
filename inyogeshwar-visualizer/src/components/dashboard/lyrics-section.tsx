"use client"

import * as React from "react"
import { FileText, Music, Image, Video, Type } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { UploadFile } from "./upload-file"
import { motion } from "framer-motion"

interface LyricsSectionProps {
  onLyricsChange?: (lyrics: string) => void
}

export function LyricsSection({ onLyricsChange }: LyricsSectionProps) {
  const [lyrics, setLyrics] = React.useState("")
  const [isFetching, setIsFetching] = React.useState(false)

  const handleFetchFromLRCLIB = async () => {
    setIsFetching(true)
    // Simulated API call to LRCLIB
    setTimeout(() => {
      setLyrics("[00:00.00] Sample lyrics\n[00:05.00] From LRCLIB\n[00:10.00] Auto-fetched content")
      setIsFetching(false)
    }, 1500)
  }

  const handlePasteLyrics = () => {
    navigator.clipboard.readText().then((text) => {
      setLyrics(text)
      onLyricsChange?.(text)
    })
  }

  const handleLyricsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newLyrics = e.target.value
    setLyrics(newLyrics)
    onLyricsChange?.(newLyrics)
  }

  return (
    <Tabs defaultValue="paste" className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-4">
        <TabsTrigger value="fetch" className="text-xs">
          <FileText className="h-3 w-3 mr-1" />
          Fetch
        </TabsTrigger>
        <TabsTrigger value="lrc" className="text-xs">
          <FileText className="h-3 w-3 mr-1" />
          LRC
        </TabsTrigger>
        <TabsTrigger value="srt" className="text-xs">
          <FileText className="h-3 w-3 mr-1" />
          SRT
        </TabsTrigger>
        <TabsTrigger value="ttml" className="text-xs">
          <FileText className="h-3 w-3 mr-1" />
          TTML
        </TabsTrigger>
        <TabsTrigger value="paste" className="text-xs">
          <FileText className="h-3 w-3 mr-1" />
          Paste
        </TabsTrigger>
      </TabsList>

      <TabsContent value="fetch" className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-white/10 bg-white/5 p-6"
        >
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
              <Music className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Auto-Fetch from LRCLIB</h3>
              <p className="text-sm text-white/60 mt-1">
                Automatically fetch synchronized lyrics from LRCLIB database
              </p>
            </div>
            <Button
              onClick={handleFetchFromLRCLIB}
              disabled={isFetching}
              className="mt-2"
            >
              {isFetching ? "Fetching..." : "Fetch Lyrics"}
            </Button>
          </div>
        </motion.div>
      </TabsContent>

      <TabsContent value="lrc" className="space-y-4">
        <UploadFile
          label="Upload LRC File"
          accept=".lrc"
          icon={<FileText className="h-8 w-8" />}
        />
      </TabsContent>

      <TabsContent value="srt" className="space-y-4">
        <UploadFile
          label="Upload SRT File"
          accept=".srt"
          icon={<FileText className="h-8 w-8" />}
        />
      </TabsContent>

      <TabsContent value="ttml" className="space-y-4">
        <UploadFile
          label="Upload TTML File"
          accept=".ttml,.xml"
          icon={<FileText className="h-8 w-8" />}
        />
      </TabsContent>

      <TabsContent value="paste" className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white/90">Paste Lyrics</label>
            <Button variant="outline" size="sm" onClick={handlePasteLyrics}>
              Paste from Clipboard
            </Button>
          </div>
          <Textarea
            placeholder="Paste your lyrics here...&#10;&#10;Example:&#10;[Verse 1]&#10;This is the first line&#10;This is the second line"
            value={lyrics}
            onChange={handleLyricsChange}
            className="min-h-[300px] font-mono text-sm"
          />
          <p className="text-xs text-white/50">
            Support for plain text, LRC format, and other lyric formats
          </p>
        </motion.div>
      </TabsContent>
    </Tabs>
  )
}
