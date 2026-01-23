'use client';

import { useState, useCallback } from 'react';
import { ToastMessage } from './types';
import { useImageHistory } from './hooks/useImageHistory';
import { useStreamingImageGeneration } from './hooks/useStreamingImageGeneration';
import PromptInput from './components/PromptInput';
import ImageDisplay from './components/ImageDisplay';
import Gallery from './components/Gallery';
import { ToastContainer } from './components/Toast';

export default function Home() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const { history, addImage, deleteImage, clearHistory } = useImageHistory();

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const { currentImage, isLoading, progress, generateImage } = useStreamingImageGeneration({
    onSuccess: (image) => {
      addImage(image);
      showToast('Image generated successfully!', 'success');
    },
    onError: (error) => {
      showToast(error, 'error');
    },
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            AI Image Generator
          </h1>
          <p className="text-white/80 text-lg">
            Create stunning images with Ollama&apos;s local AI models
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-2xl p-6">
              <PromptInput 
                onGenerate={generateImage} 
                isLoading={isLoading}
                progress={progress}
              />
            </div>
          </div>

          {/* Right Column - Current Image */}
          <div className="space-y-6">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-2xl p-6">
              <ImageDisplay image={currentImage} />
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        {history.length > 0 && (
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Generation History
              </h2>
              <button
                onClick={clearHistory}
                className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                aria-label="Clear generation history"
              >
                Clear History
              </button>
            </div>
            <Gallery history={history} onDelete={deleteImage} />
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
