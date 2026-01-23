'use client';

interface ProgressBarProps {
  progress: number; // 0-100
  completed?: number;
  total?: number;
}

export default function ProgressBar({ progress, completed, total }: ProgressBarProps) {
  if (progress <= 0) return null;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">Generating image...</span>
        <span className="text-gray-600 dark:text-gray-400 font-medium">
          {progress}%
          {completed !== undefined && total !== undefined && (
            <span className="ml-1 text-gray-500 dark:text-gray-500">
              ({completed}/{total})
            </span>
          )}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-purple-600 to-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
