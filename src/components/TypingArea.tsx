import { useRef, useEffect, useMemo } from 'react';
import { Word } from './Word';
import { Caret } from './Caret';
import { GhostCaret } from './GhostCaret';

interface TypingAreaProps {
  words: string[];
  typedWords: string[];
  errorTrigger: number;
  ghostCharIndex: number;
}

export const TypingArea = ({ words, typedWords, errorTrigger, ghostCharIndex }: TypingAreaProps) => {
  const activeWordIndex = typedWords.length - 1;
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Pre-calculate cumulative character offsets (including spaces)
  const wordOffsets = useMemo(() => {
    let current = 0;
    return words.map(word => {
      const offset = current;
      current += word.length + 1; // +1 for the space
      return offset;
    });
  }, [words]);

  // Smooth scroll
  useEffect(() => {
    const activeChar = document.getElementById('active-char');
    const container = document.getElementById('typing-area-wrapper');
    const wrapper = wrapperRef.current;

    if (activeChar && container && wrapper) {
       const charRect = activeChar.getBoundingClientRect();
       const containerRect = container.getBoundingClientRect();
       
       const relativeY = charRect.top - containerRect.top;
       
       if (relativeY > 60) {
         const currentTransform = wrapper.style.transform;
         let currentY = 0;
         if (currentTransform) {
           const match = currentTransform.match(/translateY\(([-\d.]+)px\)/);
           if (match) currentY = parseFloat(match[1]);
         }
         
         const newY = currentY - 56; // 48px line height + 8px gap
         wrapper.style.transform = `translateY(${newY}px)`;
       } else if (activeWordIndex === 0) {
         wrapper.style.transform = `translateY(0px)`;
       }
    }
  }, [typedWords, activeWordIndex]);

  return (
    <div className="typing-area" id="typing-area-wrapper">
      <div className="words-wrapper" ref={wrapperRef}>
        <Caret typedWords={typedWords} errorTrigger={errorTrigger} />
        {ghostCharIndex >= 0 && <GhostCaret ghostCharIndex={ghostCharIndex} />}
        
        {words.map((targetWord, idx) => {
          let visibilityClass = '';
          if (idx < activeWordIndex - 20) visibilityClass = 'hidden-past';
          else if (idx < activeWordIndex) visibilityClass = 'dimmed-past';
          else if (idx > activeWordIndex) visibilityClass = 'dimmed-future';
          
          return (
            <Word 
              key={`w-${idx}`}
              wordIndex={idx}
              targetWord={targetWord}
              typedWord={idx < typedWords.length ? typedWords[idx] : undefined}
              isActive={idx === activeWordIndex}
              visibilityClass={visibilityClass}
              startGlobalCharIndex={wordOffsets[idx]}
            />
          );
        })}
      </div>
    </div>
  );
};
