'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Save, Upload, FileText, Clock, X, 
  Play, Pause, SkipBack, SkipForward, Download,
  Copy, ClipboardPaste, Undo, Redo
} from 'lucide-react';
import type { LyricLine, ParsedLyrics } from '@/lib/lyrics/types';
import { timeUtils, generateId } from '@/lib/lyrics/types';
import { autoParseLyrics, exportToLRC, exportToSRT, exportToTTML } from '@/lib/lyrics/parser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LrcLibSearch } from './lrclib-search';
import { cn } from '@/lib/utils';

interface LyricsEditorProps {
  initialLyrics?: LyricLine[];
  audioDuration?: number;
  onLyricsChange?: (lines: LyricLine[]) => void;
}

export function LyricsEditor({ 
  initialLyrics = [], 
  audioDuration = 180000,
  onLyricsChange 
}: LyricsEditorProps) {
  const [lines, setLines] = useState<LyricLine[]>(initialLyrics);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [history, setHistory] = useState<LyricLine[][]>([initialLyrics]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [pasteText, setPasteText] = useState('');
  const [metadata, setMetadata] = useState<{ title?: string; artist?: string }>({});
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Add to history for undo/redo
  const addToHistory = useCallback((newLines: LyricLine[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, newLines];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setLines(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setLines(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // Notify parent of changes
  useEffect(() => {
    onLyricsChange?.(lines);
  }, [lines, onLyricsChange]);

  // Auto-save every 5 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem('lyrics-draft', JSON.stringify(lines));
    }, 5000);
    
    return () => clearInterval(saveInterval);
  }, [lines]);

  // Playback simulation
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= audioDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 100;
        });
      }, 100);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, audioDuration]);

  // Get current active line
  const getCurrentLine = useCallback(() => {
    return lines.find(line => 
      currentTime >= line.startTime && currentTime <= line.endTime
    );
  }, [lines, currentTime]);

  // Add new line
  const addLine = useCallback(() => {
    const lastLine = lines[lines.length - 1];
    const newStartTime = lastLine ? lastLine.endTime : 0;
    const newEndTime = newStartTime + 3000;

    const newLine: LyricLine = {
      id: generateId(),
      startTime: newStartTime,
      endTime: newEndTime,
      text: ''
    };

    const newLines = [...lines, newLine];
    setLines(newLines);
    addToHistory(newLines);
    setSelectedLineId(newLine.id);
  }, [lines, addToHistory]);

  // Delete line
  const deleteLine = useCallback((id: string) => {
    const newLines = lines.filter(line => line.id !== id);
    setLines(newLines);
    addToHistory(newLines);
    if (selectedLineId === id) {
      setSelectedLineId(null);
    }
  }, [lines, selectedLineId, addToHistory]);

  // Update line
  const updateLine = useCallback((id: string, updates: Partial<LyricLine>) => {
    const newLines = lines.map(line => 
      line.id === id ? { ...line, ...updates } : line
    );
    setLines(newLines);
  }, [lines]);

  // Commit update to history
  const commitUpdate = useCallback(() => {
    addToHistory(lines);
  }, [lines, addToHistory]);

  // Handle paste from text
  const handlePasteLyrics = useCallback(() => {
    if (!pasteText.trim()) return;
    
    const parsed = autoParseLyrics(pasteText, audioDuration);
    setLines(parsed.lines);
    addToHistory(parsed.lines);
    
    if (parsed.metadata) {
      setMetadata({
        title: parsed.metadata.title,
        artist: parsed.metadata.artist
      });
    }
    
    setPasteText('');
    setActiveTab('editor');
  }, [pasteText, audioDuration, addToHistory]);

  // Handle LRCLIB selection
  const handleLrclibSelect = useCallback((lyrics: string, metadata?: { title?: string; artist?: string }) => {
    const parsed = autoParseLyrics(lyrics, audioDuration);
    setLines(parsed.lines);
    addToHistory(parsed.lines);
    
    if (metadata) {
      setMetadata(metadata);
    }
    
    setActiveTab('editor');
  }, [audioDuration, addToHistory]);

  // Export functions
  const handleExport = useCallback((format: 'LRC' | 'SRT' | 'TTML') => {
    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'LRC':
        content = exportToLRC(lines, metadata);
        filename = `${metadata.title || 'lyrics'}.lrc`;
        mimeType = 'text/plain';
        break;
      case 'SRT':
        content = exportToSRT(lines);
        filename = `${metadata.title || 'lyrics'}.srt`;
        mimeType = 'text/srt';
        break;
      case 'TTML':
        content = exportToTTML(lines, metadata);
        filename = `${metadata.title || 'lyrics'}.ttml`;
        mimeType = 'application/ttml+xml';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [lines, metadata]);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>, format: 'LRC' | 'SRT' | 'TTML') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parsed = autoParseLyrics(content, audioDuration);
      setLines(parsed.lines);
      addToHistory(parsed.lines);
      
      if (parsed.metadata) {
        setMetadata({
          title: parsed.metadata.title,
          artist: parsed.metadata.artist
        });
      }
    };
    reader.readAsText(file);
  }, [audioDuration, addToHistory]);

  const currentLine = getCurrentLine();

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full bg-white/5 border border-white/10">
          <TabsTrigger value="search" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">
            <Search className="h-4 w-4 mr-2" />
            LRCLIB
          </TabsTrigger>
          <TabsTrigger value="paste" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">
            <ClipboardPaste className="h-4 w-4 mr-2" />
            Paste
          </TabsTrigger>
          <TabsTrigger value="upload" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="editor" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">
            <FileText className="h-4 w-4 mr-2" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="export" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">
            <Download className="h-4 w-4 mr-2" />
            Export
          </TabsTrigger>
        </TabsList>

        {/* LRCLIB Search */}
        <TabsContent value="search" className="mt-4">
          <LrcLibSearch onLyricsSelect={handleLrclibSelect} />
        </TabsContent>

        {/* Paste Lyrics */}
        <TabsContent value="paste" className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Paste your lyrics here</Label>
            <Textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste plain text, LRC, SRT, or TTML formatted lyrics..."
              className="min-h-[300px] bg-white/5 border-white/10 text-white placeholder:text-gray-500 resize-none"
            />
          </div>
          <Button
            onClick={handlePasteLyrics}
            disabled={!pasteText.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <ClipboardPaste className="mr-2 h-4 w-4" />
            Parse and Import
          </Button>
        </TabsContent>

        {/* Upload Files */}
        <TabsContent value="upload" className="mt-4">
          <div className="grid gap-4">
            {[
              { format: 'LRC' as const, label: 'LRC File', ext: '.lrc' },
              { format: 'SRT' as const, label: 'SRT File', ext: '.srt' },
              { format: 'TTML' as const, label: 'TTML File', ext: '.ttml' },
            ].map(({ format, label, ext }) => (
              <div key={format} className="relative">
                <input
                  type="file"
                  accept={ext}
                  onChange={(e) => handleFileUpload(e, format)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <FileText className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{label}</p>
                      <p className="text-xs text-gray-400">Upload {ext.toUpperCase()} file</p>
                    </div>
                  </div>
                  <Upload className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Editor */}
        <TabsContent value="editor" className="mt-4">
          <div className="space-y-4">
            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="space-y-2">
                <Label className="text-xs text-gray-400">Title</Label>
                <Input
                  value={metadata.title || ''}
                  onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="Song title"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-400">Artist</Label>
                <Input
                  value={metadata.artist || ''}
                  onChange={(e) => setMetadata(prev => ({ ...prev, artist: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="Artist name"
                />
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleUndo} disabled={historyIndex <= 0}>
                  <Undo className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
                  <Redo className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={addLine}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Line
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={isPlaying ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={isPlaying ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentTime(0)}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                <span className="text-xs text-gray-400 font-mono">
                  {timeUtils.msToDisplay(currentTime)} / {timeUtils.msToDisplay(audioDuration)}
                </span>
              </div>
            </div>

            {/* Timeline View */}
            <ScrollArea className="h-[400px] rounded-xl border border-white/10 bg-white/5">
              <div className="p-2 space-y-2">
                <AnimatePresence>
                  {lines.map((line, index) => {
                    const isActive = currentLine?.id === line.id;
                    const isSelected = selectedLineId === line.id;

                    return (
                      <motion.div
                        key={line.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.02 }}
                        className={cn(
                          'group flex items-center gap-2 p-3 rounded-lg border transition-all duration-200',
                          isActive && 'bg-green-500/20 border-green-500/50',
                          isSelected && !isActive && 'bg-purple-500/20 border-purple-500/50',
                          !isActive && !isSelected && 'bg-white/5 border-white/10 hover:bg-white/10'
                        )}
                        onClick={() => setSelectedLineId(line.id)}
                      >
                        {/* Index */}
                        <span className="text-xs text-gray-500 w-6">{index + 1}</span>

                        {/* Start Time */}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <Input
                            type="text"
                            value={timeUtils.msToDisplay(line.startTime)}
                            onChange={(e) => {
                              const parts = e.target.value.split(':');
                              if (parts.length === 2) {
                                const mins = parseInt(parts[0], 10) || 0;
                                const secs = parseFloat(parts[1]) || 0;
                                updateLine(line.id, { startTime: mins * 60000 + secs * 1000 });
                              }
                            }}
                            onBlur={commitUpdate}
                            className="w-20 h-7 text-xs bg-transparent border-0 text-gray-300 focus:ring-0"
                          />
                        </div>

                        {/* End Time */}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <Input
                            type="text"
                            value={timeUtils.msToDisplay(line.endTime)}
                            onChange={(e) => {
                              const parts = e.target.value.split(':');
                              if (parts.length === 2) {
                                const mins = parseInt(parts[0], 10) || 0;
                                const secs = parseFloat(parts[1]) || 0;
                                updateLine(line.id, { endTime: mins * 60000 + secs * 1000 });
                              }
                            }}
                            onBlur={commitUpdate}
                            className="w-20 h-7 text-xs bg-transparent border-0 text-gray-300 focus:ring-0"
                          />
                        </div>

                        {/* Lyric Text */}
                        <Input
                          value={line.text}
                          onChange={(e) => updateLine(line.id, { text: e.target.value })}
                          onBlur={commitUpdate}
                          placeholder="Enter lyric text..."
                          className="flex-1 h-7 text-sm bg-transparent border-0 text-white placeholder:text-gray-600 focus:ring-0"
                        />

                        {/* Actions */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLine(line.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {lines.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No lyrics yet</p>
                    <p className="text-sm">Import from LRCLIB, paste, or upload a file</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* Export */}
        <TabsContent value="export" className="mt-4">
          <div className="grid gap-4">
            {[
              { format: 'LRC' as const, label: 'LRC Format', desc: 'Standard karaoke format' },
              { format: 'SRT' as const, label: 'SRT Format', desc: 'Subtitle format' },
              { format: 'TTML' as const, label: 'TTML Format', desc: 'Timed Text Markup Language' },
            ].map(({ format, label, desc }) => (
              <Button
                key={format}
                onClick={() => handleExport(format)}
                variant="outline"
                className="flex items-center justify-between p-4 h-auto bg-white/5 border-white/10 hover:bg-white/10"
              >
                <div className="text-left">
                  <p className="font-medium text-white">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <Download className="h-5 w-5 text-gray-400" />
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview Panel */}
      {lines.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Live Preview</h4>
          <div className="text-center">
            {currentLine ? (
              <motion.p
                key={currentLine.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xl font-semibold text-white"
              >
                {currentLine.text}
              </motion.p>
            ) : (
              <p className="text-gray-500">No active line</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Search icon since we didn't import it
function Search({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
