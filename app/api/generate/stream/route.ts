import { NextRequest } from 'next/server';
import { saveResponseLog } from '../../../utils/logger';
import { extractImageData } from '../../../utils/transform';

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
        stream: true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({
          success: false,
          error: `Ollama API error: ${response.status} ${response.statusText}. ${errorText}`,
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          controller.close();
          return;
        }

        let buffer = '';
        let imageData: string | undefined;
        let allDataText = '';

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
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
              
              // Save the response log
              await saveResponseLog(allDataText);
              
              // Use the extractImageData utility to ensure proper extraction
              const extractedImage = extractImageData(allDataText);
              
              // Use extracted image if available, otherwise use the one found during streaming
              const finalImageData = extractedImage || imageData;
              
              // Send final result
              if (finalImageData) {
                controller.enqueue(
                  new TextEncoder().encode(
                    JSON.stringify({
                      type: 'complete',
                      success: true,
                      imageData: finalImageData,
                    }) + '\n'
                  )
                );
              } else {
                console.error('No image data found. Total lines processed:', allDataText.split('\n').length);
                controller.enqueue(
                  new TextEncoder().encode(
                    JSON.stringify({
                      type: 'complete',
                      success: false,
                      error: 'No image data found in Ollama response.',
                    }) + '\n'
                  )
                );
              }
              controller.close();
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            
            // Process complete lines (ending with \n)
            let newlineIndex;
            while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
              const line = buffer.substring(0, newlineIndex);
              buffer = buffer.substring(newlineIndex + 1);
              
              if (!line.trim()) continue;
              allDataText += line + '\n';

              try {
                const data = JSON.parse(line);

                // Send progress updates
                if (data.completed !== undefined && data.total !== undefined) {
                  const progress = Math.round((data.completed / data.total) * 100);
                  controller.enqueue(
                    new TextEncoder().encode(
                      JSON.stringify({
                        type: 'progress',
                        completed: data.completed,
                        total: data.total,
                        progress,
                      }) + '\n'
                    )
                  );
                }

                // Check for image data - prioritize done:true responses
                if (data.done && data.image) {
                  imageData = data.image;
                } else if (data.image && !imageData) {
                  // Store image if we haven't found one yet
                  imageData = data.image;
                }
              } catch {
                // Skip invalid JSON lines
                continue;
              }
            }
          }
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
