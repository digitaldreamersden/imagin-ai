'use client';

import { useState, useEffect, useCallback } from 'react';
import { ImageGeneration } from '../types';

const STORAGE_KEY = 'image-generation-history';
const MAX_HISTORY = 5; // Reduced to prevent quota issues

export function useImageHistory() {
  const [history, setHistory] = useState<ImageGeneration[]>([]);

  // Load history from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ImageGeneration[];
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Error loading image history:', error);
    }
  }, []);

  // Add new image to history (max 5)
  const addImage = useCallback((image: ImageGeneration) => {
    setHistory((prev) => {
      const newHistory = [image, ...prev].slice(0, MAX_HISTORY);
      
      // Try to save with progressive reduction if quota exceeded
      let attempt = 0;
      let historyToSave = newHistory;
      const maxAttempts = 3;
      
      while (attempt < maxAttempts) {
        try {
          const dataToStore = JSON.stringify(historyToSave);
          sessionStorage.setItem(STORAGE_KEY, dataToStore);
          // Success - return the saved history
          return historyToSave;
        } catch (error) {
          if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            attempt++;
            // Progressively reduce the number of images
            if (historyToSave.length > 1) {
              // Keep only the most recent image(s)
              historyToSave = historyToSave.slice(0, Math.max(1, Math.floor(historyToSave.length / 2)));
              console.warn(`Quota exceeded. Reducing history to ${historyToSave.length} image(s).`);
            } else {
              // If even 1 image is too large, clear storage and keep only in memory
              console.warn('Quota exceeded. Clearing sessionStorage, keeping history in memory only.');
              try {
                sessionStorage.removeItem(STORAGE_KEY);
              } catch {
                // Ignore removal errors
              }
              // Return history without the new image if it's too large
              return prev;
            }
          } else {
            // Other error - just log and return new history
            console.error('Error saving image history:', error);
            return newHistory;
          }
        }
      }
      
      // If all attempts failed, return the reduced history
      return historyToSave;
    });
  }, []);

  // Get current history
  const getHistory = useCallback(() => {
    return history;
  }, [history]);

  // Delete a specific image from history
  const deleteImage = useCallback((imageId: string) => {
    setHistory((prev) => {
      const updatedHistory = prev.filter((img) => img.id !== imageId);
      try {
        if (updatedHistory.length > 0) {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error deleting image from history:', error);
      }
      return updatedHistory;
    });
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing image history:', error);
    }
  }, []);

  return {
    history,
    addImage,
    getHistory,
    deleteImage,
    clearHistory,
  };
}
