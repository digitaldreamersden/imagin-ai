import { OllamaResponse } from '../types';

/**
 * Transforms the streaming response text into image data
 * Parses newline-delimited JSON and extracts the base64 image
 * @param dataText - The raw response text from Ollama API
 * @returns The extracted image data or undefined if not found
 */
export function extractImageData(dataText: string): string | undefined {
  // Parse the streaming response (newline-delimited JSON)
  // Split by newlines and find the final response with done: true
  const lines = dataText.trim().split('\n');
  let imageData: string | undefined;

  // Process each line to find the one with the image
  for (const line of lines) {
    if (!line.trim()) continue;
    
    try {
      const data: OllamaResponse = JSON.parse(line);
      
      // Check if this is the final response with the image
      if (data.done && data.image) {
        imageData = data.image;
        break;
      }
      
      // Also check for image in non-done responses (in case format differs)
      if (data.image) {
        imageData = data.image;
      }
    } catch {
      // Skip invalid JSON lines
      continue;
    }
  }

  if (imageData) {
    // Ensure base64 data has proper prefix if missing
    if (!imageData.startsWith('data:')) {
      imageData = `data:image/png;base64,${imageData}`;
    }
    return imageData;
  }

  return undefined;
}
