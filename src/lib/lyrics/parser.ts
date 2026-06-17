import type { LyricLine, ParsedLyrics, LyricFormat } from './types';
import { generateId, timeUtils } from './types';

/**
 * Parse LRC format to internal structure
 */
export function parseLRC(content: string): ParsedLyrics {
  const lines: LyricLine[] = [];
  const metadata: ParsedLyrics['metadata'] = {};
  
  const rawLines = content.split('\n');
  
  // Extract metadata
  rawLines.forEach(line => {
    const metaMatch = line.match(/^\[(ar|ti|al):(.+)\]$/i);
    if (metaMatch) {
      const key = metaMatch[1].toLowerCase();
      const value = metaMatch[2].trim();
      if (key === 'ar') metadata.artist = value;
      if (key === 'ti') metadata.title = value;
      if (key === 'al') metadata.album = value;
    }
  });
  
  // Parse timed lyrics
  rawLines.forEach(line => {
    const timeMatches = [...line.matchAll(/\[(\d{2}:\d{2}\.\d{2,3})\]/g)];
    
    if (timeMatches.length > 0) {
      const text = line.replace(/\[\d{2}:\d{2}\.\d{2,3}\]/g, '').trim();
      
      if (text) {
        timeMatches.forEach((match, index) => {
          const startTime = timeUtils.lrcTimeToMs(match[0]);
          let endTime = 0;
          
          // Try to find next timestamp for end time
          const nextMatch = rawLines.join('\n').match(new RegExp(
            `\\[${match[1]}\\][^\\[]*\\[(\\d{2}:\\d{2}\\.\\d{2,3})\\]`
          ));
          
          if (nextMatch) {
            endTime = timeUtils.lrcTimeToMs(`[${nextMatch[1]}]`);
          } else {
            // Default: 3 seconds duration or until end of song
            endTime = startTime + 3000;
          }
          
          lines.push({
            id: generateId(),
            startTime,
            endTime,
            text
          });
        });
      }
    }
  });
  
  // Sort by start time
  lines.sort((a, b) => a.startTime - b.startTime);
  
  return { lines, format: 'LRC', metadata };
}

/**
 * Parse SRT format to internal structure
 */
export function parseSRT(content: string): ParsedLyrics {
  const lines: LyricLine[] = [];
  const blocks = content.trim().split(/\n\n+/);
  
  blocks.forEach(block => {
    const blockLines = block.split('\n');
    if (blockLines.length < 3) return;
    
    // Skip the index number (first line)
    const timeLine = blockLines[1];
    const textLines = blockLines.slice(2);
    
    const timeMatch = timeLine.match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
    
    if (timeMatch) {
      const startTime = timeUtils.timeToMs(timeMatch[1], true);
      const endTime = timeUtils.timeToMs(timeMatch[2], true);
      const text = textLines.join('\n').trim();
      
      lines.push({
        id: generateId(),
        startTime,
        endTime,
        text
      });
    }
  });
  
  return { lines, format: 'SRT' };
}

/**
 * Parse TTML format to internal structure
 */
export function parseTTML(content: string): ParsedLyrics {
  const lines: LyricLine[] = [];
  const metadata: ParsedLyrics['metadata'] = {};
  
  // Extract title if present
  const titleMatch = content.match(/<tt[^>]*xml:lang="([^"]+)"/);
  
  // Parse body elements
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) return { lines, format: 'TTML', metadata };
  
  const bodyContent = bodyMatch[1];
  
  // Find all <p> elements with begin/end times
  const pMatches = [...bodyContent.matchAll(/<p[^>]*begin="([^"]+)"[^>]*end="([^"]+)"[^>]*>([\s\S]*?)<\/p>/gi)];
  
  pMatches.forEach(match => {
    const startTime = timeUtils.timeToMs(match[1], false);
    const endTime = timeUtils.timeToMs(match[2], false);
    // Remove HTML tags from text
    const text = match[3].replace(/<[^>]*>/g, '').trim();
    
    if (text) {
      lines.push({
        id: generateId(),
        startTime,
        endTime,
        text
      });
    }
  });
  
  // Also handle self-closing p tags or different attribute order
  if (lines.length === 0) {
    const altMatches = [...bodyContent.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
    altMatches.forEach(match => {
      const pTag = match[0];
      const beginMatch = pTag.match(/begin="([^"]+)"/);
      const endMatch = pTag.match(/end="([^"]+)"/);
      
      if (beginMatch && endMatch) {
        const startTime = timeUtils.timeToMs(beginMatch[1], false);
        const endTime = timeUtils.timeToMs(endMatch[1], false);
        const text = match[1].replace(/<[^>]*>/g, '').trim();
        
        if (text) {
          lines.push({
            id: generateId(),
            startTime,
            endTime,
            text
          });
        }
      }
    });
  }
  
  return { lines, format: 'TTML', metadata };
}

/**
 * Parse plain text lyrics (no timestamps)
 * Assigns default timing based on line position
 */
export function parsePlainLyrics(content: string, estimatedDuration?: number): ParsedLyrics {
  const lines: LyricLine[] = [];
  const rawLines = content.split('\n').filter(line => line.trim() !== '');
  
  const totalLines = rawLines.length;
  const duration = estimatedDuration || (totalLines * 3000); // Default 3 seconds per line
  const avgDuration = duration / totalLines;
  
  rawLines.forEach((line, index) => {
    const startTime = Math.floor(index * avgDuration);
    const endTime = Math.floor((index + 1) * avgDuration);
    
    lines.push({
      id: generateId(),
      startTime,
      endTime,
      text: line.trim()
    });
  });
  
  return { lines, format: 'PLAIN' };
}

/**
 * Auto-detect format and parse
 */
export function autoParseLyrics(content: string, estimatedDuration?: number): ParsedLyrics {
  // Check for LRC format
  if (content.match(/\[\d{2}:\d{2}\.\d{2,3}\]/)) {
    return parseLRC(content);
  }
  
  // Check for SRT format
  if (content.match(/\d+\n\d{2}:\d{2}:\d{2},\d{3}\s*-->\s*\d{2}:\d{2}:\d{2},\d{3}/)) {
    return parseSRT(content);
  }
  
  // Check for TTML format
  if (content.includes('<ttml') || content.includes('<tt ') || content.includes('begin="')) {
    return parseTTML(content);
  }
  
  // Default to plain text
  return parsePlainLyrics(content, estimatedDuration);
}

/**
 * Export lyrics to LRC format
 */
export function exportToLRC(lines: LyricLine[], metadata?: ParsedLyrics['metadata']): string {
  let output = '';
  
  if (metadata?.artist) output += `[ar:${metadata.artist}]\n`;
  if (metadata?.title) output += `[ti:${metadata.title}]\n`;
  if (metadata?.album) output += `[al:${metadata.album}]\n`;
  output += '\n';
  
  lines.forEach(line => {
    output += `${timeUtils.msToLrcTime(line.startTime)}${line.text}\n`;
  });
  
  return output;
}

/**
 * Export lyrics to SRT format
 */
export function exportToSRT(lines: LyricLine[]): string {
  let output = '';
  
  lines.forEach((line, index) => {
    output += `${index + 1}\n`;
    output += `${timeUtils.msToSrtTime(line.startTime)} --> ${timeUtils.msToSrtTime(line.endTime)}\n`;
    output += `${line.text}\n\n`;
  });
  
  return output.trim();
}

/**
 * Export lyrics to TTML format
 */
export function exportToTTML(lines: LyricLine[], metadata?: ParsedLyrics['metadata']): string {
  let output = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  output += `<tt xmlns="http://www.w3.org/ns/ttml" xml:lang="en">\n`;
  output += `  <head>\n`;
  output += `    <metadata>\n`;
  if (metadata?.title) output += `      <title>${metadata.title}</title>\n`;
  if (metadata?.artist) output += `      <creator>${metadata.artist}</creator>\n`;
  output += `    </metadata>\n`;
  output += `  </head>\n`;
  output += `  <body>\n`;
  output += `    <div>\n`;
  
  lines.forEach(line => {
    output += `      <p begin="${timeUtils.msToTtmlTime(line.startTime)}" end="${timeUtils.msToTtmlTime(line.endTime)}">${line.text}</p>\n`;
  });
  
  output += `    </div>\n`;
  output += `  </body>\n`;
  output += `</tt>`;
  
  return output;
}
