import type { LyricSearchResult, ParsedLyrics } from './types';

const LRCLIB_BASE_URL = 'https://lrclib.net/api';

/**
 * Search for lyrics by song title and/or artist
 */
export async function searchLyrics(query: {
  trackName?: string;
  artistName?: string;
  albumName?: string;
  duration?: number;
}): Promise<LyricSearchResult[]> {
  const params = new URLSearchParams();
  
  if (query.trackName) params.append('track_name', query.trackName);
  if (query.artistName) params.append('artist_name', query.artistName);
  if (query.albumName) params.append('album_name', query.albumName);
  if (query.duration) params.append('duration', query.duration.toString());
  
  const url = `${LRCLIB_BASE_URL}/search?${params.toString()}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`LRCLIB API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data as LyricSearchResult[];
  } catch (error) {
    console.error('Error searching lyrics:', error);
    throw error;
  }
}

/**
 * Get lyrics by ID
 */
export async function getLyricsById(id: number): Promise<LyricSearchResult | null> {
  try {
    const response = await fetch(`${LRCLIB_BASE_URL}/get/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`LRCLIB API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data as LyricSearchResult;
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    throw error;
  }
}

/**
 * Get synced lyrics for a song
 */
export async function getSyncedLyrics(query: {
  trackName: string;
  artistName?: string;
  albumName?: string;
  duration?: number;
}): Promise<string | null> {
  const params = new URLSearchParams();
  
  params.append('track_name', query.trackName);
  if (query.artistName) params.append('artist_name', query.artistName);
  if (query.albumName) params.append('album_name', query.albumName);
  if (query.duration) params.append('duration', query.duration.toString());
  
  const url = `${LRCLIB_BASE_URL}/get?${params.toString()}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`LRCLIB API error: ${response.status}`);
    }
    
    const data = await response.json();
    return (data as LyricSearchResult).syncedLyrics || (data as LyricSearchResult).plainLyrics || null;
  } catch (error) {
    console.error('Error fetching synced lyrics:', error);
    throw error;
  }
}

/**
 * Get plain lyrics for a song
 */
export async function getPlainLyrics(query: {
  trackName: string;
  artistName?: string;
  albumName?: string;
}): Promise<string | null> {
  const params = new URLSearchParams();
  
  params.append('track_name', query.trackName);
  if (query.artistName) params.append('artist_name', query.artistName);
  if (query.albumName) params.append('album_name', query.albumName);
  
  const url = `${LRCLIB_BASE_URL}/get?${params.toString()}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`LRCLIB API error: ${response.status}`);
    }
    
    const data = await response.json();
    return (data as LyricSearchResult).plainLyrics || null;
  } catch (error) {
    console.error('Error fetching plain lyrics:', error);
    throw error;
  }
}
