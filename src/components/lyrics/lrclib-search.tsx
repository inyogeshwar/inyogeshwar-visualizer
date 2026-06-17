'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Music, User, Disc, Clock, Check, Loader2, AlertCircle } from 'lucide-react';
import type { LyricSearchResult } from '@/lib/lyrics/types';
import { searchLyrics } from '@/lib/lyrics/lrclib';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LrcLibSearchProps {
  onLyricsSelect: (lyrics: string, metadata?: { title?: string; artist?: string }) => void;
}

export function LrcLibSearch({ onLyricsSelect }: LrcLibSearchProps) {
  const [searchQuery, setSearchQuery] = useState({ trackName: '', artistName: '', albumName: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<LyricSearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trackName && !searchQuery.artistName) {
      setError('Please enter at least a track name or artist name');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await searchLyrics({
        trackName: searchQuery.trackName || undefined,
        artistName: searchQuery.artistName || undefined,
        albumName: searchQuery.albumName || undefined,
      });
      setResults(data);
      
      if (data.length === 0) {
        setError('No lyrics found. Try different search terms.');
      }
    } catch (err) {
      setError('Failed to fetch lyrics. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const handleSelectLyrics = (result: LyricSearchResult) => {
    setSelectedId(result.id);
    const lyrics = result.syncedLyrics || result.plainLyrics || '';
    if (lyrics) {
      onLyricsSelect(lyrics, {
        title: result.name,
        artist: result.artistName,
      });
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Search Form */}
      <div className="grid gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trackName" className="text-sm text-gray-300">
              Track Name *
            </Label>
            <div className="relative">
              <Music className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="trackName"
                value={searchQuery.trackName}
                onChange={(e) => setSearchQuery(prev => ({ ...prev, trackName: e.target.value }))}
                placeholder="Enter song title"
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="artistName" className="text-sm text-gray-300">
              Artist Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="artistName"
                value={searchQuery.artistName}
                onChange={(e) => setSearchQuery(prev => ({ ...prev, artistName: e.target.value }))}
                placeholder="Enter artist name"
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="albumName" className="text-sm text-gray-300">
              Album Name (Optional)
            </Label>
            <div className="relative">
              <Disc className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="albumName"
                value={searchQuery.albumName}
                onChange={(e) => setSearchQuery(prev => ({ ...prev, albumName: e.target.value }))}
                placeholder="Enter album name"
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search Lyrics
            </>
          )}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          <AlertCircle className="h-4 w-4" />
          {error}
        </motion.div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm text-gray-300">Search Results</Label>
          <ScrollArea className="h-[400px] rounded-xl border border-white/10 bg-white/5">
            <div className="p-2 space-y-2">
              <AnimatePresence>
                {results.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelectLyrics(result)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedId === result.id
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50'
                        : 'bg-white/5 hover:bg-white/10 border-white/10'
                    } border`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate">{result.name}</h4>
                        <p className="text-sm text-gray-400">{result.artistName}</p>
                        {result.albumName && (
                          <p className="text-xs text-gray-500 mt-1">{result.albumName}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          {formatDuration(result.duration)}
                        </div>
                        {result.syncedLyrics && (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                            Synced
                          </span>
                        )}
                        {selectedId === result.id && (
                          <Check className="h-5 w-5 text-green-400" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
