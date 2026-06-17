'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LyricLine } from '@/lib/lyrics/types';
import { cn } from '@/lib/utils';

interface LyricsPreviewProps {
  lines: LyricLine[];
  currentTime: number;
  template?: '7clouds' | 'scroll' | 'karaoke' | 'lofi' | 'apple' | 'spotify';
  fontSize?: 'sm' | 'md' | 'lg' | 'xl';
  fontFamily?: string;
  textColor?: string;
  highlightColor?: string;
}

export function LyricsPreview({
  lines,
  currentTime,
  template = '7clouds',
  fontSize = 'md',
  fontFamily,
  textColor = '#ffffff',
  highlightColor = '#a855f7'
}: LyricsPreviewProps) {
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);

  useEffect(() => {
    const index = lines.findIndex(
      line => currentTime >= line.startTime && currentTime <= line.endTime
    );
    setActiveLineIndex(index >= 0 ? index : null);
  }, [lines, currentTime]);

  const getFontSize = () => {
    switch (fontSize) {
      case 'sm': return 'text-sm';
      case 'md': return 'text-base';
      case 'lg': return 'text-lg';
      case 'xl': return 'text-xl';
      default: return 'text-base';
    }
  };

  // Template-specific rendering
  const renderTemplate = () => {
    switch (template) {
      case '7clouds':
        return render7Clouds();
      case 'scroll':
        return renderScroll();
      case 'karaoke':
        return renderKaraoke();
      case 'lofi':
        return renderLofi();
      case 'apple':
        return renderApple();
      case 'spotify':
        return renderSpotify();
      default:
        return render7Clouds();
    }
  };

  // 7Clouds Template - Centered with blur effect on inactive lines
  const render7Clouds = () => (
    <div className="flex flex-col items-center justify-center h-full px-8">
      <AnimatePresence mode="wait">
        {activeLineIndex !== null && (
          <motion.div
            key={activeLineIndex}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <p
              className={cn('font-bold text-3xl md:text-4xl drop-shadow-lg', getFontSize())}
              style={{ 
                color: highlightColor,
                fontFamily: fontFamily || 'inherit',
                textShadow: '0 0 30px rgba(168, 85, 247, 0.5)'
              }}
            >
              {lines[activeLineIndex].text}
            </p>
            {activeLineIndex > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="text-white/50 text-sm mt-4 blur-[1px]"
                style={{ fontFamily: fontFamily || 'inherit' }}
              >
                {lines[activeLineIndex - 1].text}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Scroll Template - Lines scroll vertically
  const renderScroll = () => (
    <div className="h-full overflow-hidden relative px-8">
      <div
        className="absolute left-0 right-0 transition-transform duration-300"
        style={{
          transform: `translateY(calc(50% - ${activeLineIndex !== null ? activeLineIndex * 60 : 0}px))`
        }}
      >
        {lines.map((line, index) => (
          <motion.p
            key={line.id}
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === activeLineIndex ? 1 : 0.3,
              scale: index === activeLineIndex ? 1.1 : 0.9,
              filter: index === activeLineIndex ? 'blur(0)' : 'blur(2px)'
            }}
            className={cn(
              'py-4 text-center font-medium transition-all duration-300',
              getFontSize()
            )}
            style={{
              color: index === activeLineIndex ? highlightColor : textColor,
              fontFamily: fontFamily || 'inherit'
            }}
          >
            {line.text}
          </motion.p>
        ))}
      </div>
    </div>
  );

  // Karaoke Template - Word-by-word highlight
  const renderKaraoke = () => {
    const activeLine = activeLineIndex !== null ? lines[activeLineIndex] : null;
    
    if (!activeLine) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Waiting for lyrics...</p>
        </div>
      );
    }

    const words = activeLine.text.split(' ');
    const wordDuration = (activeLine.endTime - activeLine.startTime) / words.length;
    const elapsedInLine = currentTime - activeLine.startTime;
    const currentWordIndex = Math.floor(elapsedInLine / wordDuration);

    return (
      <div className="flex flex-col items-center justify-center h-full px-8">
        <motion.p
          key={activeLine.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn('text-center font-bold', getFontSize())}
          style={{ fontFamily: fontFamily || 'inherit' }}
        >
          {words.map((word, index) => (
            <span
              key={index}
              className="inline-block mx-1 transition-colors duration-200"
              style={{
                color: index <= currentWordIndex ? highlightColor : textColor,
                filter: index <= currentWordIndex ? 'none' : 'blur(0.5px)'
              }}
            >
              {word}
            </span>
          ))}
        </motion.p>
      </div>
    );
  };

  // Lofi Template - Minimalist with soft glow
  const renderLofi = () => (
    <div className="flex flex-col items-center justify-center h-full px-8">
      <AnimatePresence mode="wait">
        {activeLineIndex !== null && (
          <motion.div
            key={activeLineIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl"
          >
            <p
              className={cn('font-light tracking-wide', getFontSize())}
              style={{
                color: textColor,
                fontFamily: fontFamily || 'serif',
                textShadow: `0 0 20px ${highlightColor}40`
              }}
            >
              {lines[activeLineIndex].text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Apple Music Template - Clean typography
  const renderApple = () => (
    <div className="h-full flex flex-col justify-center px-8">
      <div className="space-y-4">
        {lines.slice(Math.max(0, (activeLineIndex || 0) - 2), Math.min(lines.length, (activeLineIndex || 0) + 3)).map((line, index) => {
          const actualIndex = Math.max(0, (activeLineIndex || 0) - 2) + index;
          const isActive = actualIndex === activeLineIndex;
          
          return (
            <motion.p
              key={line.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: isActive ? 1 : 0.4,
                x: 0,
                scale: isActive ? 1.05 : 1
              }}
              transition={{ duration: 0.3 }}
              className={cn('font-semibold transition-all duration-300', getFontSize())}
              style={{
                color: isActive ? highlightColor : textColor,
                fontFamily: fontFamily || '-apple-system, BlinkMacSystemFont, sans-serif'
              }}
            >
              {line.text}
            </motion.p>
          );
        })}
      </div>
    </div>
  );

  // Spotify Canvas Template - Loop-friendly short format
  const renderSpotify = () => (
    <div className="h-full flex items-end justify-center pb-16 px-8">
      <AnimatePresence mode="wait">
        {activeLineIndex !== null && (
          <motion.div
            key={activeLineIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <p
              className={cn('font-bold text-center', getFontSize())}
              style={{
                color: textColor,
                fontFamily: fontFamily || 'Circular, -apple-system, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {lines[activeLineIndex].text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
      }}
    >
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Lyrics Content */}
      <div className="relative z-10 h-full">
        {renderTemplate()}
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <motion.div
          className="h-full"
          style={{ backgroundColor: highlightColor }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (currentTime / Math.max(...lines.map(l => l.endTime))) * 100)}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </div>
  );
}
