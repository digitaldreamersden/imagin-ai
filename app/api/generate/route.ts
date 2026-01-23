import { NextRequest, NextResponse } from 'next/server';
import { saveResponseLog } from '../../utils/logger';
import { extractImageData } from '../../utils/transform';
import { handleImageGenerationError } from '../../utils/errorHandler';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const TIMEOUT_MS = 30000; // 30 seconds

export async function POST(request: NextRequest) {
  try {
    const { prompt, model, width, height } = await request.json();

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
        stream: true, // Enable streaming for progress updates
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          success: false,
          error: `Ollama API error: ${response.status} ${response.statusText}. ${errorText}`,
        },
        { status: response.status }
      );
    }

    // Create a readable stream to process the response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let imageData: string | undefined;
    let allDataText = '';

    if (!reader) {
      return NextResponse.json(
        { success: false, error: 'No response body' },
        { status: 500 }
      );
    }

    // Process the stream
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (!line.trim()) continue;
        allDataText += line + '\n';

        try {
          const data = JSON.parse(line);
          
          // Check if this is the final response with the image
          if (data.done && data.image) {
            imageData = data.image;
          } else if (data.image) {
            // Also check for image in non-done responses
            imageData = data.image;
          }
        } catch {
          // Skip invalid JSON lines
          continue;
        }
      }
    }

    // Process any remaining buffer content
    if (buffer.trim()) {
      allDataText += buffer + '\n';
      try {
        const data = JSON.parse(buffer);
        if (data.done && data.image) {
          imageData = data.image;
        } else if (data.image) {
          imageData = data.image;
        }
      } catch {
        // Skip invalid JSON
      }
    }

    // Save the response text to a JSON log file
    await saveResponseLog(allDataText);

    // Use extractImageData utility for consistent extraction
    const extractedImage = extractImageData(allDataText);
    const finalImageData = extractedImage || imageData;

    if (finalImageData) {
      return NextResponse.json({
        success: true,
        imageData: finalImageData,
      });
    }

    return NextResponse.json({
      success: false,
      error: 'No image data found in Ollama response. Please check that the model supports image generation.',
    });
  } catch (error) {
    const errorResult = handleImageGenerationError(error);
    return NextResponse.json(errorResult, { status: 500 });
  }
}
