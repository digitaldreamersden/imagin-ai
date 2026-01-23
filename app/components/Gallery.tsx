'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageGeneration } from '../types';
import ImagePreviewModal from './ImagePreviewModal';

interface GalleryProps {
  history: ImageGeneration[];
  onImageSelect?: (image: ImageGeneration) => void;
  onDelete?: (imageId: string) => void;
}

export default function Gallery({ history, onImageSelect, onDelete }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImageGeneration | null>(null);

  if (history.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">No previous generations yet</p>
      </div>
    );
  }

  const handleImageClick = (image: ImageGeneration) => {
    setSelectedImage(image);
    if (onImageSelect) {
      onImageSelect(image);
    }
  };

  const handleDelete = (e: React.MouseEvent, imageId: string) => {
    e.stopPropagation(); // Prevent triggering the image click
    if (onDelete) {
      onDelete(imageId);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Previous Generations ({history.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((image) => (
            <div
              key={image.id}
              className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer"
              onClick={() => handleImageClick(image)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleImageClick(image);
                }
              }}
              aria-label={`View image: ${image.prompt.substring(0, 50)}...`}
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={image.imageData.startsWith('data:') ? image.imageData : `data:image/png;base64,${image.imageData}`}
                  alt={image.prompt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  unoptimized
                />
                <div className="absolute inset-0 transition-all duration-200 flex items-center justify-center">
                  <span className="text-white bg-black opacity-0 group-hover:opacity-100 text-sm font-medium p-4 rounded-lg">
                    Click to view
                  </span>
                </div>
                {/* Delete Button */}
                {onDelete && (
                  <button
                    onClick={(e) => handleDelete(e, image.id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    aria-label={`Delete image: ${image.prompt.substring(0, 50)}...`}
                    title="Delete image"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <div className="p-3 space-y-1">
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                  {image.prompt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{image.model}</span>
                  <span>{image.width}×{image.height}</span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {formatDate(image.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Preview Modal with details (for history images) */}
      <ImagePreviewModal
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        showDetails={true}
      />
    </>
  );
}
