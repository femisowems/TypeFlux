import { memo } from 'react';
import { Character } from './Character';

interface WordProps {
  targetWord: string;
  typedWord: string | undefined;
  isActive: boolean;
  wordIndex: number;
  visibilityClass: string;
  startGlobalCharIndex: number;
}

export const Word = memo(({ targetWord, typedWord, isActive, wordIndex, visibilityClass, startGlobalCharIndex }: WordProps) => {
  const characters = targetWord.split('');
  
  const extraChars = typedWord 
    ? typedWord.slice(targetWord.length).split('') 
    : [];

  const isErrorWord = typedWord !== undefined && !isActive && typedWord !== targetWord && typedWord.length >= targetWord.length;

  return (
    <div className={`word ${isErrorWord ? 'error-underline' : ''} ${visibilityClass}`} id={`word-${wordIndex}`}>
      {characters.map((char, idx) => {
        let isCorrect, isIncorrect;
        if (typedWord !== undefined && idx < typedWord.length) {
          isCorrect = typedWord[idx] === char;
          isIncorrect = typedWord[idx] !== char;
        }

        const isCurrentChar = isActive && (typedWord?.length || 0) === idx;
        const globalIdx = startGlobalCharIndex + idx;

        return (
          <span key={`char-${idx}`} id={isCurrentChar ? 'active-char' : `char-global-${globalIdx}`} className="char-wrapper">
             <Character 
               char={char} 
               isCorrect={isCorrect} 
               isIncorrect={isIncorrect} 
             />
          </span>
        );
      })}
      {extraChars.map((char, idx) => {
        const isCurrentChar = isActive && typedWord!.length === targetWord.length + idx;
        const globalIdx = startGlobalCharIndex + targetWord.length + idx;

        return (
          <span key={`extra-${idx}`} id={isCurrentChar ? 'active-char' : `char-global-${globalIdx}`} className="char-wrapper">
            <Character 
              char={char} 
              isExtra={true} 
            />
          </span>
        );
      })}
      
      {isActive && ((typedWord?.length || 0) >= targetWord.length + extraChars.length) && (
         <span id="active-char" className="char-wrapper"></span>
      )}
    </div>
  );
});

Word.displayName = 'Word';
