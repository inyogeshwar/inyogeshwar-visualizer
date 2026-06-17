'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Image, Music, Type, FileVideo, 
  Mic2, Palette, Settings, Search, Bell, User,
  Sparkles, ChevronDown, Play, Pause,
  SkipBack, SkipForward, Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { LyricLine } from '@/lib/lyrics/types';
import { LyricsEditor, LyricsTimeline, LyricsPreview } from '@/components/lyrics';
import { UploadFile } from '@/components/dashboard/upload-file';

// Sidebar navigation items
const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Image, label: 'Artwork', id: 'artwork' },
  { icon: Music, label: 'Audio', id: 'audio' },
  { icon: FileVideo, label: 'Background', id: 'background' },
  { icon: Type, label: 'Fonts', id: 'fonts' },
  { icon: Mic2, label: 'Lyrics', id: 'lyrics', active: true },
  { icon: Palette, label: 'Templates', id: 'templates' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

// Template options
const templates = [
  { id: '7clouds', name: '7Clouds', description: 'Centered with blur effect' },
  { id: 'scroll', name: 'Scroll Lyrics', description: 'Vertical scrolling' },
  { id: 'karaoke', name: 'Karaoke', description: 'Word-by-word highlight' },
  { id: 'lofi', name: 'Lofi Cover', description: 'Minimalist aesthetic' },
  { id: 'apple', name: 'Apple Music', description: 'Clean typography' },
  { id: 'spotify', name: 'Spotify Canvas', description: 'Loop-friendly format' },
];

// Video size options
const videoSizes = [
  { id: 'vertical', name: 'Vertical', ratio: '9:16', resolution: '1080x1920' },
  { id: 'square', name: 'Square', ratio: '1:1', resolution: '1080x1080' },
  { id: 'horizontal', name: 'Horizontal', ratio: '16:9', resolution: '1920x1080' },
];

export default function LyricsEnginePage() {
  const [selectedTemplate, setSelectedTemplate] = useState('7clouds');
  const [selectedSize, setSelectedSize] = useState('vertical');
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [activePanel, setActivePanel] = useState<'editor' | 'timeline'>('editor');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Music className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">InYogeshwar</h1>
              <p className="text-xs text-gray-400">Visualizer</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 mx-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates, fonts, settings..."
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Assist
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>
            <Separator orientation="vertical" className="h-8 bg-white/10" />
            <Button variant="ghost" className="flex items-center gap-2 text-gray-400 hover:text-white">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-gray-950/50 backdrop-blur-xl p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
                  item.active
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <Separator className="my-6 bg-white/10" />

          {/* Quick Stats */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Artwork</span>
                <span className="text-green-400">✓ Ready</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Audio</span>
                <span className="text-green-400">✓ Ready</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Lyrics</span>
                <span className="text-yellow-400">● Editing</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Template</span>
                <span className="text-purple-400">{templates.find(t => t.id === selectedTemplate)?.name}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Lyrics Engine</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Import, edit, and sync your lyrics with precision
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActivePanel('editor')}
                    className={cn(
                      activePanel === 'editor' && 'bg-purple-500/20 border-purple-500/50 text-white'
                    )}
                  >
                    Editor
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActivePanel('timeline')}
                    className={cn(
                      activePanel === 'timeline' && 'bg-purple-500/20 border-purple-500/50 text-white'
                    )}
                  >
                    Timeline
                  </Button>
                </div>
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel - Editor/Timeline */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Editor or Timeline */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                    {activePanel === 'editor' ? (
                      <LyricsEditor
                        initialLyrics={lyrics}
                        audioDuration={180000}
                        onLyricsChange={setLyrics}
                      />
                    ) : (
                      <LyricsTimeline
                        lines={lyrics}
                        audioDuration={180000}
                        currentTime={currentTime}
                        onTimeChange={(time) => setCurrentTime(typeof time === 'function' ? time(currentTime) : time)}
                      />
                    )}
                  </div>

                  {/* Template Selection */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Choose Template</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={cn(
                            'p-4 rounded-xl border transition-all duration-200 text-left',
                            selectedTemplate === template.id
                              ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          )}
                        >
                          <p className="font-medium text-white text-sm">{template.name}</p>
                          <p className="text-xs text-gray-400 mt-1">{template.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Video Size Selection */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Output Size</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {videoSizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => setSelectedSize(size.id)}
                          className={cn(
                            'p-4 rounded-xl border transition-all duration-200 text-center',
                            selectedSize === size.id
                              ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          )}
                        >
                          <p className="font-medium text-white text-sm">{size.name}</p>
                          <p className="text-xs text-gray-400 mt-1">{size.ratio}</p>
                          <p className="text-xs text-gray-500">{size.resolution}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Right Panel - Live Preview */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Preview Container */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Live Preview</h3>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Video Preview Frame */}
                    <div
                      className={cn(
                        'relative mx-auto rounded-lg overflow-hidden shadow-2xl',
                        selectedSize === 'vertical' && 'aspect-[9/16] max-h-[600px]',
                        selectedSize === 'square' && 'aspect-square max-w-md',
                        selectedSize === 'horizontal' && 'aspect-video'
                      )}
                    >
                      <LyricsPreview
                        lines={lyrics}
                        currentTime={currentTime}
                        template={selectedTemplate as any}
                      />

                      {/* Playback Controls Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex items-center justify-center gap-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={() => setCurrentTime(Math.max(0, currentTime - 5000))}
                          >
                            <SkipBack className="h-5 w-5" />
                          </Button>
                          <Button
                            variant={isPlaying ? 'default' : 'outline'}
                            size="lg"
                            className={isPlaying ? 'bg-green-500 hover:bg-green-600' : 'border-white/30 text-white hover:bg-white/20'}
                            onClick={() => setIsPlaying(!isPlaying)}
                          >
                            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={() => setCurrentTime(Math.min(180000, currentTime + 5000))}
                          >
                            <SkipForward className="h-5 w-5" />
                          </Button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 flex items-center gap-3">
                          <span className="text-xs text-gray-400 font-mono">
                            {Math.floor(currentTime / 60000)}:{String(Math.floor((currentTime % 60000) / 1000)).padStart(2, '0')}
                          </span>
                          <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                              style={{ width: `${(currentTime / 180000) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 font-mono">3:00</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upload Section */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Upload</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <UploadFile
                        accept=".lrc,.srt,.ttml,.txt"
                        multiple={false}
                        className="h-24"
                      >
                        <div className="flex flex-col items-center justify-center text-center">
                          <Music className="h-6 w-6 text-purple-400 mb-2" />
                          <p className="text-sm font-medium text-white">Lyrics File</p>
                          <p className="text-xs text-gray-500">LRC, SRT, TTML</p>
                        </div>
                      </UploadFile>
                      <UploadFile
                        accept=".ttf,.otf,.woff,.woff2"
                        multiple={false}
                        className="h-24"
                      >
                        <div className="flex flex-col items-center justify-center text-center">
                          <Type className="h-6 w-6 text-pink-400 mb-2" />
                          <p className="text-sm font-medium text-white">Custom Font</p>
                          <p className="text-xs text-gray-500">TTF, OTF, WOFF</p>
                        </div>
                      </UploadFile>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
