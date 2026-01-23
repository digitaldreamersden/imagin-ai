'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border',
    md: 'h-6 w-6 border-2',
    lg: 'h-12 w-12 border-2',
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`} role="status" aria-label="Loading">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-purple-500 border-t-transparent`}></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
