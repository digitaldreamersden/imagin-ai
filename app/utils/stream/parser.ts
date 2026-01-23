import { StreamMessage } from './types';

/**
 * Parses a single line of JSON from the stream
 * @param line - A single line of JSON text
 * @returns Parsed StreamMessage or null if invalid
 */
export function parseStreamLine(line: string): StreamMessage | null {
  if (!line.trim()) return null;

  try {
    const data = JSON.parse(line);
    return data as StreamMessage;
  } catch (error) {
    console.warn('Failed to parse JSON line:', line.substring(0, 100), error);
    return null;
  }
}

/**
 * Processes a buffer of stream data and extracts complete lines
 * @param buffer - Accumulated buffer string
 * @returns Object with complete lines array and remaining buffer
 */
export function extractCompleteLines(buffer: string): {
  lines: string[];
  remainingBuffer: string;
} {
  const lines: string[] = [];
  let remainingBuffer = buffer;

  let newlineIndex;
  while ((newlineIndex = remainingBuffer.indexOf('\n')) !== -1) {
    const line = remainingBuffer.substring(0, newlineIndex);
    remainingBuffer = remainingBuffer.substring(newlineIndex + 1);
    
    if (line.trim()) {
      lines.push(line);
    }
  }

  return { lines, remainingBuffer };
}
