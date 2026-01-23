'use client';

import { useState, useCallback } from 'react';
import { ImageGeneration, ModelOption } from '../types';
import { GenerationProgress, handleImageGenerationStream, StreamCallbacks } from '../utils/stream';

interface UseStreamingImageGenerationOptions {
  onSuccess?: (image: ImageGeneration) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: GenerationProgress) => void;
}

export function useStreamingImageGeneration(options?: UseStreamingImageGenerationOptions) {
  const [currentImage, setCurrentImage] = useState<ImageGeneration | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);

  const generateImage = useCallback(
    async (prompt: string, model: ModelOption, width: number, height: number) => {
      setIsLoading(true);
      setProgress(null);
      
      try {
        const callbacks: StreamCallbacks = {
          onProgress: (progressData) => {
            setProgress(progressData);
            options?.onProgress?.(progressData);
          },
          onComplete: (imageData, error) => {
            // Handle errors during streaming
            if (error) {
              options?.onError?.(error);
            }
            // Note: Success is handled after stream completes to avoid duplication
          },
        };

        const imageData = await handleImageGenerationStream(
          { prompt, model, width, height },
          callbacks
        );

        // Create image object from the received data
        const newImage: ImageGeneration = {
          id: Date.now().toString(),
          prompt,
          model,
          width,
          height,
          timestamp: Date.now(),
          imageData,
        };

        setCurrentImage(newImage);
        options?.onSuccess?.(newImage);
      } catch (error) {
        console.error('Error generating image:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
        options?.onError?.(errorMessage);
      } finally {
        setIsLoading(false);
        setProgress(null);
      }
    },
    [options]
  );

  return {
    currentImage,
    isLoading,
    progress,
    generateImage,
    setCurrentImage,
  };
}

// Export types for backward compatibility
export type { GenerationProgress };
