import { GenerateImageStreamParams } from './types';

const STREAM_API_URL = '/api/generate/stream';

/**
 * Initiates a streaming image generation request
 * @param params - Image generation parameters
 * @returns Response object or null if request fails
 */
export async function initiateStreamRequest(
  params: GenerateImageStreamParams
): Promise<Response | null> {
  try {
    const response = await fetch(STREAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate image');
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while initiating the request');
  }
}

/**
 * Gets the reader from a response body
 * @param response - Fetch response object
 * @returns ReadableStreamDefaultReader or null
 */
export function getStreamReader(
  response: Response
): ReadableStreamDefaultReader<Uint8Array> | null {
  return response.body?.getReader() || null;
}
