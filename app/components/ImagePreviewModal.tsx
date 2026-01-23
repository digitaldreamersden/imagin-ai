'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ImageGeneration } from '../types';

interface ImagePreviewModalProps {
  image: ImageGeneration | null;
  isOpen: boolean;
  onClose: () => void;
  showDetails?: boolean; // Condition to show details (for history images)
}

export default function ImagePreviewModal({
  image,
  isOpen,
  onClose,
  showDetails = false,
}: ImagePreviewModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !image || !mounted) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const imageSrc = image.imageData.startsWith('data:')
    ? image.imageData
    : `data:image/png;base64,${image.imageData}`;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <div
        className="relative max-w-7xl max-h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg transition-colors z-10"
          aria-label="Close image view"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-6">
          <div className="relative w-full max-h-[70vh] mb-4">
            <Image
              src={imageSrc}
              alt={image.prompt}
              width={image.width}
              height={image.height}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
              unoptimized
              style={{ height: 'auto', width: 'auto', maxHeight: '70vh' }}
            />
          </div>

          {/* Show details only when showDetails is true (for history images) */}
          {showDetails && (
            <div className="space-y-2 text-sm">
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {image.prompt}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                <span>Model: {image.model}</span>
                <span>Dimensions: {image.width} × {image.height}</span>
                <span>Generated: {formatDate(image.timestamp)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
