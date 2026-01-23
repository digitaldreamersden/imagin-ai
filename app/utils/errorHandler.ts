/**
 * Handles errors from image generation and returns user-friendly error messages
 * @param error - The error that occurred
 * @returns An object with success: false and an error message
 */
export function handleImageGenerationError(
  error: unknown
): { success: false; error: string } {
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timed out after 30 seconds. Please try again.',
      };
    }
    if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
      return {
        success: false,
        error: 'Cannot connect to Ollama. Please ensure Ollama is running on localhost:11434',
      };
    }
    return {
      success: false,
      error: `Error generating image: ${error.message}`,
    };
  }
  return {
    success: false,
    error: 'An unknown error occurred while generating the image',
  };
}
