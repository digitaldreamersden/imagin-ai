import { StreamMessage, GenerationProgress, StreamCallbacks } from './types';
import { parseStreamLine, extractCompleteLines } from './parser';

/**
 * Processes a stream message and calls appropriate callbacks
 * @param message - The parsed stream message
 * @param callbacks - Callback functions for progress and completion
 * @returns Progress data if message is progress type, null otherwise
 */
export function processStreamMessage(
  message: StreamMessage | null,
  callbacks: StreamCallbacks
): GenerationProgress | null {
  if (!message) return null;

  if (message.type === 'progress') {
    const progressData: GenerationProgress = {
      progress: message.progress || 0,
      completed: message.completed,
      total: message.total,
    };
    callbacks.onProgress?.(progressData);
    return progressData;
  } else if (message.type === 'complete') {
    if (message.success && message.imageData) {
      callbacks.onComplete?.(message.imageData, null);
    } else {
      const errorMessage = message.error || 'Failed to generate image';
      callbacks.onComplete?.(null, errorMessage);
    }
  }

  return null;
}

/**
 * Processes a chunk of stream data
 * @param chunk - Raw chunk data from the stream
 * @param buffer - Accumulated buffer from previous chunks
 * @param decoder - TextDecoder instance
 * @param callbacks - Callback functions
 * @returns Object with updated buffer and extracted image data if complete
 */
export function processStreamChunk(
  chunk: Uint8Array | undefined,
  buffer: string,
  decoder: TextDecoder,
  callbacks: StreamCallbacks
): {
  updatedBuffer: string;
  imageData: string | null;
  error: string | null;
  progress: GenerationProgress | null;
} {
  if (!chunk) {
    return { updatedBuffer: buffer, imageData: null, error: null, progress: null };
  }

  buffer += decoder.decode(chunk, { stream: true });
  const { lines, remainingBuffer } = extractCompleteLines(buffer);

  let imageData: string | null = null;
  let error: string | null = null;
  let progress: GenerationProgress | null = null;

  for (const line of lines) {
    const message = parseStreamLine(line);
    if (message?.type === 'complete') {
      if (message.success && message.imageData) {
        imageData = message.imageData;
        // Call onComplete callback for early notification
        callbacks.onComplete?.(imageData, null);
      } else {
        error = message.error || 'Failed to generate image';
        // Call onComplete callback with error
        callbacks.onComplete?.(null, error);
      }
    } else {
      const progressData = processStreamMessage(message, callbacks);
      if (progressData) {
        progress = progressData;
      }
    }
  }

  return {
    updatedBuffer: remainingBuffer,
    imageData,
    error,
    progress,
  };
}
