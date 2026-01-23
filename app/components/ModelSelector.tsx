'use client';

import { ModelOption } from '../types';

interface ModelSelectorProps {
  value: ModelOption;
  onChange: (model: ModelOption) => void;
  disabled?: boolean;
}

export default function ModelSelector({ value, onChange, disabled = false }: ModelSelectorProps) {
  const models: { value: ModelOption; label: string }[] = [
    { value: 'x/z-image-turbo', label: 'Z-Image Turbo' },
  ];

  return (
    <div className="w-full">
      <label htmlFor="model-select" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        Model
      </label>
      <select
        id="model-select"
        value={value}
        onChange={(e) => onChange(e.target.value as ModelOption)}
        disabled={disabled}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Select image generation model"
      >
        {models.map((model) => (
          <option key={model.value} value={model.value}>
            {model.label}
          </option>
        ))}
      </select>
    </div>
  );
}
