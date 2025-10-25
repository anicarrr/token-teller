'use client';

import { useState } from 'react';
import { Sparkles, Stars, Moon } from 'lucide-react';

interface MysticalImageLoaderProps {
  imageUrl?: string | null;
  alt: string;
  className?: string;
}

export function MysticalImageLoader({ imageUrl, alt, className = '' }: MysticalImageLoaderProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true); // Hide loader even on error
  };

  // Show loader when we have an imageUrl but image hasn't loaded yet
  const showLoader = imageUrl && !imageLoaded && !imageError;

  return (
    <div className={`relative ${className}`}>
      {showLoader && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-violet-900/20 rounded-lg border border-primary/20 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4 p-8">
            {/* Animated mystical symbols */}
            <div className="relative">
              <div className="animate-spin-slow">
                <Sparkles className="h-12 w-12 text-purple-400" />
              </div>
              <div className="absolute -top-2 -right-2 animate-pulse">
                <Stars className="h-6 w-6 text-gold-400" />
              </div>
              <div className="absolute -bottom-2 -left-2 animate-bounce">
                <Moon className="h-6 w-6 text-indigo-400" />
              </div>
            </div>

            {/* Mystical loading text */}
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-white animate-pulse">Channeling cosmic energies...</p>
              <div className="flex space-x-1 justify-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>

            {/* Mystical border animation */}
            <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-purple-500 via-indigo-500 to-violet-500 opacity-30 animate-pulse"></div>
          </div>
        </div>
      )}

      {imageUrl && !imageError ? (
        <img
          height={450}
          width={450}
          src={imageUrl || ''}
          alt={alt}
          className={`rounded-lg shadow-lg border border-primary/20 transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : (
        <img
          height={450}
          width={450}
          src={'stars.jpg'}
          alt={alt}
          className={`rounded-lg shadow-lg border border-primary/20 transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {imageError && (
        <div className="flex items-center justify-center bg-gradient-to-br from-purple-900/10 via-indigo-900/10 to-violet-900/10 rounded-lg border border-primary/20 p-8 min-h-[200px]">
          <div className="text-center space-y-2">
            <Sparkles className="h-8 w-8 text-purple-400 mx-auto opacity-50" />
            <p className="text-sm text-muted-foreground">The cosmic forces are still aligning...</p>
          </div>
        </div>
      )}
    </div>
  );
}
