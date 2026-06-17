'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ZoomIn, ZoomOut, SkipBack } from 'lucide-react';
import type { LyricLine } from '@/lib/lyrics/types';
import { timeUtils } from '@/lib/lyrics/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LyricsTimelineProps {
  lines: LyricLine[];
  audioDuration?: number;
  currentTime?: number;
  onTimeChange?: (time: number) => void;
  onLineSelect?: (lineId: string) => void;
}

export function LyricsTimeline({
  lines,
  audioDuration = 180000,
  currentTime = 0,
  onTimeChange,
  onLineSelect
}: LyricsTimelineProps) {
  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Playback
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        onTimeChange?.(prev => {
          const newTime = prev + 100;
          if (newTime >= audioDuration) {
            setIsPlaying(false);
            return 0;
          }
          return newTime;
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
  }, [isPlaying, audioDuration, onTimeChange]);

  // Get current active line
  const getCurrentLine = useCallback(() => {
    return lines.find(line => 
      currentTime >= line.startTime && currentTime <= line.endTime
    );
  }, [lines, currentTime]);

  // Calculate position percentage
  const getPositionPercent = (time: number) => {
    return (time / audioDuration) * 100;
  };

  // Handle timeline click
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const newTime = Math.floor(percent * audioDuration);
    onTimeChange?.(newTime);
  };

  // Generate time markers
  const generateMarkers = () => {
    const markers = [];
    const interval = audioDuration > 300000 ? 60000 : 30000; // 1 min or 30 sec
    
    for (let i = 0; i <= audioDuration; i += interval) {
      markers.push(i);
    }
    
    return markers;
  };

  const markers = generateMarkers();
  const currentLine = getCurrentLine();

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={isPlaying ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className={isPlaying ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTimeChange?.(0)}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 font-mono">
            {timeUtils.msToDisplay(currentTime)} / {timeUtils.msToDisplay(audioDuration)}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            <span className="text-xs text-gray-400 w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(z => Math.min(2, z + 0.25))}
              disabled={zoom >= 2}
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Time Markers */}
        <div className="flex justify-between mb-2 px-2">
          {markers.map((time) => (
            <span key={time} className="text-xs text-gray-500 font-mono">
              {timeUtils.msToDisplay(time)}
            </span>
          ))}
        </div>

        {/* Timeline Track */}
        <div
          ref={containerRef}
          onClick={handleTimelineClick}
          className="relative h-16 rounded-lg bg-white/5 border border-white/10 cursor-pointer overflow-hidden"
          style={{ transform: `scaleX(${zoom})`, transformOrigin: 'left center' }}
        >
          {/* Grid Lines */}
          <div className="absolute inset-0 flex">
            {markers.map((time) => (
              <div
                key={time}
                className="border-l border-white/5 h-full"
                style={{ left: `${getPositionPercent(time)}%` }}
              />
            ))}
          </div>

          {/* Lyric Blocks */}
          <div className="absolute inset-0 px-2 py-3">
            {lines.map((line) => {
              const startPercent = getPositionPercent(line.startTime);
              const width = getPositionPercent(line.endTime - line.startTime);
              const isActive = currentLine?.id === line.id;

              return (
                <motion.div
                  key={line.id}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onLineSelect?.(line.id);
                    onTimeChange?.(line.startTime);
                  }}
                  className={cn(
                    'absolute top-1/2 -translate-y-1/2 h-10 rounded-md cursor-pointer transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30'
                      : 'bg-white/10 hover:bg-white/20'
                  )}
                  style={{
                    left: `${startPercent}%`,
                    width: `${width}%`,
                    minWidth: '2px'
                  }}
                >
                  <div className="h-full flex items-center px-2 overflow-hidden">
                    <span className={cn(
                      'text-xs truncate',
                      isActive ? 'text-white font-medium' : 'text-gray-400'
                    )}>
                      {line.text || 'Empty line'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
            style={{ left: `${getPositionPercent(currentTime)}%` }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* Current Line Display */}
      {currentLine && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-purple-400 font-medium">NOW PLAYING</span>
            <span className="text-xs text-gray-500">
              {timeUtils.msToDisplay(currentLine.startTime)} - {timeUtils.msToDisplay(currentLine.endTime)}
            </span>
          </div>
          <p className="text-lg font-semibold text-white">{currentLine.text}</p>
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-r from-purple-500 to-pink-500" />
          <span>Active Line</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white/10" />
          <span>Lyric Block</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-red-500" />
          <span>Playhead</span>
        </div>
      </div>
    </div>
  );
}
