'use client';

import { motion } from 'framer-motion';

interface SplitTextProps {
  text: string;
  baseClass?: string;
  charClass?: string;
  isInView?: boolean;
  triggerOnce?: boolean;
  onAnimationComplete?: () => void;
}

export default function SplitText({
  text,
  baseClass = '',
  charClass = '',
  isInView = false,
  onAnimationComplete,
}: SplitTextProps) {
  // Split text into words, preserving spaces
  const words = text.split(' ');

  return (
    <>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className={baseClass} style={{ whiteSpace: 'nowrap' }}>
          {word.split('').map((char, charIndex) => {
            // Calculate a staggered delay based on total character position
            const totalIndex =
              words.slice(0, wordIndex).reduce((acc, w) => acc + w.length, 0) + charIndex;

            return (
              <motion.span
                key={`${wordIndex}-${charIndex}`}
                className={charClass}
                initial={{ y: '100%', opacity: 0 }}
                animate={
                  isInView
                    ? { y: '0%', opacity: 1 }
                    : { y: '100%', opacity: 0 }
                }
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: totalIndex * 0.02,
                }}
                onAnimationComplete={
                  // Fire callback only after the very last character finishes
                  totalIndex ===
                  words.reduce((acc, w) => acc + w.length, 0) - 1
                    ? onAnimationComplete
                    : undefined
                }
              >
                {char}
              </motion.span>
            );
          })}
          {/* Add a space after each word except the last */}
          {wordIndex < words.length - 1 && (
            <span className={charClass}>&nbsp;</span>
          )}
        </span>
      ))}
    </>
  );
}
