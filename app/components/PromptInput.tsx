'use client';

import { useState, useCallback } from 'react';
import { ModelOption } from '../types';
import ModelSelector from './ModelSelector';
import ExamplePrompts from './ExamplePrompts';
import LoadingSpinner from './LoadingSpinner';
import ProgressBar from './ProgressBar';

interface PromptInputProps {
  onGenerate: (prompt: string, model: ModelOption, width: number, height: number) => Promise<void>;
  isLoading: boolean;
  progress?: { progress: number; completed?: number; total?: number } | null;
}

export default function PromptInput({ onGenerate, isLoading, progress }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<ModelOption>('x/z-image-turbo');
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!prompt.trim() || isLoading) return;
      await onGenerate(prompt.trim(), model, width, height);
    },
    [prompt, model, width, height, onGenerate, isLoading]
  );

  const handleExampleSelect = useCallback((examplePrompt: string) => {
    setPrompt(examplePrompt);
  }, []);

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            rows={6}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-y transition-colors"
            aria-label="Image generation prompt"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModelSelector value={model} onChange={setModel} disabled={isLoading} />

          <div>
            <label htmlFor="width" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Width
            </label>
            <input
              id="width"
              type="number"
              value={width}
              onChange={(e) => setWidth(Number.parseInt(e.target.value) || 1024)}
              min={256}
              max={2048}
              step={64}
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Image width in pixels"
            />
          </div>

          <div>
            <label htmlFor="height" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Height
            </label>
            <input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(Number.parseInt(e.target.value) || 1024)}
              min={256}
              max={2048}
              step={64}
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Image height in pixels"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!prompt.trim() || isLoading}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
          aria-label="Generate image"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Generating...</span>
            </>
          ) : (
            <span>Generate Image</span>
          )}
        </button>
        
        {/* Progress Bar */}
        {progress && (
          <div className="mt-4">
            <ProgressBar
              progress={progress.progress}
              completed={progress.completed}
              total={progress.total}
            />
          </div>
        )}
      </form>

      <ExamplePrompts onSelectPrompt={handleExampleSelect} />
    </div>
  );
}
