'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageGeneration } from '../types';
import ImagePreviewModal from './ImagePreviewModal';

interface ImageDisplayProps {
  image: ImageGeneration | null;
}

export default function ImageDisplay({ image }: ImageDisplayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!image) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
        <p className="text-gray-500 dark:text-gray-400">No image generated yet</p>
      </div>
    );
  }

  const handleDownload = () => {
    try {
      // Convert base64 to blob
      const base64Data = image.imageData.replace(/^data:image\/\w+;base64,/, '');
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${image.timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <>
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="relative group cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <Image
            src={image.imageData.startsWith('data:') ? image.imageData : `data:image/png;base64,${image.imageData}`}
            alt={image.prompt}
            width={image.width}
            height={image.height}
            className="w-full h-auto transition-transform duration-200 group-hover:scale-105"
            unoptimized
            style={{ height: 'auto' }}
          />
          <div className="absolute inset-0 transition-all duration-200 flex items-center justify-center">
            <span className="text-white bg-black opacity-0 group-hover:opacity-100 text-sm font-medium p-4 rounded-lg">
              Click to zoom
            </span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Generated Image
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">{image.prompt}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Model:</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">{image.model}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Dimensions:</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {image.width} × {image.height}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Generated:</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {formatDate(image.timestamp)}
              </p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <button
                onClick={handleDownload}
                className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                aria-label="Download image"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal (without details, as they're shown in the card below) */}
      <ImagePreviewModal
        image={image}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showDetails={false}
      />
    </>
  );
}
