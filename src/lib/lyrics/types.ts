/**
 * Core types for the Lyrics Engine
 */

export interface LyricLine {
  id: string;
  startTime: number; // in milliseconds
  endTime: number;   // in milliseconds
  text: string;
}

export interface LyricSearchResult {
  id: number;
  name: string;
  artistName: string;
  albumName: string;
  duration: number;
  instrumental: boolean;
  plainLyrics?: string;
  syncedLyrics?: string;
}

export type LyricFormat = 'LRC' | 'SRT' | 'TTML' | 'PLAIN';

export interface ParsedLyrics {
  lines: LyricLine[];
  format: LyricFormat;
  metadata?: {
    title?: string;
    artist?: string;
    album?: string;
  };
}

/**
 * Time conversion utilities
 */
export const timeUtils = {
  /**
   * Convert milliseconds to LRC format [mm:ss.xx]
   */
  msToLrcTime: (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}]`;
  },

  /**
   * Convert milliseconds to SRT format (HH:MM:SS,mmm)
   */
  msToSrtTime: (ms: number): string => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
  },

  /**
   * Convert milliseconds to TTML format (hh:mm:ss.mmm)
   */
  msToTtmlTime: (ms: number): string => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  },

  /**
   * Parse LRC time format [mm:ss.xx] to milliseconds
   */
  lrcTimeToMs: (timeStr: string): number => {
    const match = timeStr.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\]/);
    if (!match) return 0;
    
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    const centiseconds = parseInt(match[3].padEnd(3, '0').slice(0, 3), 10);
    
    return (minutes * 60000) + (seconds * 1000) + centiseconds;
  },

  /**
   * Parse SRT/TTML time format to milliseconds
   */
  timeToMs: (timeStr: string, isSrt: boolean = false): number => {
    // Handle both HH:MM:SS,mmm (SRT) and HH:MM:SS.mmm (TTML)
    const separator = isSrt ? ',' : '.';
    const parts = timeStr.split(':');
    if (parts.length !== 3) return 0;

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const secondsParts = parts[2].split(separator);
    const seconds = parseInt(secondsParts[0], 10);
    const ms = parseInt(secondsParts[1] || '0', 10);

    return (hours * 3600000) + (minutes * 60000) + (seconds * 1000) + ms;
  },

  /**
   * Format milliseconds for display (mm:ss)
   */
  msToDisplay: (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
