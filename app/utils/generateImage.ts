'use server';

import { GenerateImageParams } from '../types';
import { saveResponseLog } from './logger';
import { extractImageData } from './transform';
import { handleImageGenerationError } from './errorHandler';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const TIMEOUT_MS = 30000; // 30 seconds

export async function generateImage(
  params: GenerateImageParams
): Promise<{ success: boolean; imageData?: string; error?: string }> {
  const { prompt, model, width, height } = params;

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        width,
        height,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Ollama API error: ${response.status} ${response.statusText}. ${errorText}`,
      };
    }

    // Get the response text first (can only read response body once)
    const dataText = await response.text();
    
    // Save the response text to a JSON log file
    await saveResponseLog(dataText);

    // Extract image data from the response
    const imageData = extractImageData(dataText);

    if (imageData) {
      return {
        success: true,
        imageData,
      };
    }

    return {
      success: false,
      error: 'No image data found in Ollama response. Please check that the model supports image generation.',
    };
  } catch (error) {
    return handleImageGenerationError(error);
  }
}
