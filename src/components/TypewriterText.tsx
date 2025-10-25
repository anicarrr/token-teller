'use client';

import { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // milliseconds between words
  className?: string;
  onComplete?: () => void;
  onProgress?: (currentWordIndex: number, totalWords: number) => void;
  progressInterval?: number; // trigger onProgress every X words (default: 20)
}

export function TypewriterText({
  text,
  speed = 50,
  className = '',
  onComplete,
  onProgress,
  progressInterval = 20
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const previousTextRef = useRef('');
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setIsComplete(false);
      previousTextRef.current = '';
      hasStartedRef.current = false;
      return;
    }

    // Only restart animation if text actually changed
    if (text === previousTextRef.current && hasStartedRef.current) {
      return;
    }

    previousTextRef.current = text;
    hasStartedRef.current = true;

    const words = text.split(' ');
    let currentIndex = 0;
    setDisplayedText('');
    setIsComplete(false);

    const typeNextWord = () => {
      if (currentIndex < words.length) {
        const wordsToShow = words.slice(0, currentIndex + 1);
        setDisplayedText(wordsToShow.join(' '));
        currentIndex++;
        
        // Call onProgress callback every progressInterval words
        if (onProgress && currentIndex % progressInterval === 0) {
          onProgress(currentIndex, words.length);
        }
        
        if (currentIndex < words.length) {
          setTimeout(typeNextWord, speed);
        } else {
          setIsComplete(true);
          onComplete?.();
        }
      }
    };

    const initialTimer = setTimeout(typeNextWord, speed);
    
    return () => {
      clearTimeout(initialTimer);
    };
  }, [text, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && displayedText && (
        <span className="animate-pulse ml-1 text-primary">|</span>
      )}
    </span>
  );
}