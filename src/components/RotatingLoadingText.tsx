'use client';

import { useState, useEffect } from 'react';

const LOADING_PHRASES = [
  'Consulting the cosmic forces...',
  'Reading the stars alignment...',
  'Analyzing your celestial patterns...',
  'Channeling ancient wisdom...',
  'Interpreting the mystical energies...',
  'Connecting with the universe...',
  'Decoding your spiritual blueprint...',
  'Unveiling hidden truths...',
  'Gathering cosmic insights...',
  'Harmonizing with celestial vibrations...'
];

interface RotatingLoadingTextProps {
  className?: string;
  interval?: number; // milliseconds between phrase changes
}

export function RotatingLoadingText({ className = '', interval = 2500 }: RotatingLoadingTextProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const changePhrase = () => {
      // Start fade out
      setIsVisible(false);

      // After fade out completes, change phrase and fade in
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * LOADING_PHRASES.length);
        setCurrentPhraseIndex(randomIndex);
        setIsVisible(true);
      }, 300); // Half of the transition duration
    };

    const intervalId = setInterval(changePhrase, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return (
    <span className={`transition-opacity duration-600 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}>
      {LOADING_PHRASES[currentPhraseIndex]}
    </span>
  );
}
