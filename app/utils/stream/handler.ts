import { StreamCallbacks, GenerationProgress } from './types';
import { getStreamReader, initiateStreamRequest } from './fetcher';
import { processStreamChunk, processStreamMessage } from './processor';
import { parseStreamLine } from './parser';
import { GenerateImageStreamParams } from './types';

/**
 * Handles the complete streaming image generation process
 * @param params - Image generation parameters
 * @param callbacks - Callback functions for progress and completion
 * @returns Promise that resolves with image data or rejects with error
 */
export async function handleImageGenerationStream(
  params: GenerateImageStreamParams,
  callbacks: StreamCallbacks
): Promise<string> {
  const response = await initiateStreamRequest(params);

  if (!response) {
    throw new Error('Failed to initiate image generation');
  }

  const reader = getStreamReader(response);

  if (!reader) {
    throw new Error('Failed to start image generation stream');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let imageData: string | null = null;
  let error: string | null = null;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        // Process any remaining buffer
        if (buffer.trim()) {
          const message = parseStreamLine(buffer);
          if (message?.type === 'complete') {
            if (message.success && message.imageData) {
              imageData = message.imageData;
            } else {
              error = message.error || 'Failed to generate image';
            }
          }
        }
        break;
      }

      const result = processStreamChunk(value, buffer, decoder, callbacks);
      buffer = result.updatedBuffer;

      if (result.imageData) {
        imageData = result.imageData;
      }
      if (result.error) {
        error = result.error;
      }
    }
  } finally {
    reader.releaseLock();
  }

  if (error) {
    throw new Error(error);
  }

  if (!imageData) {
    throw new Error('No image data received from generation');
  }

  return imageData;
}
