import { memo } from 'react';

interface CharacterProps {
  char: string;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  isExtra?: boolean;
}

export const Character = memo(({ char, isCorrect, isIncorrect, isExtra }: CharacterProps) => {
  let className = "char";
  if (isCorrect) className += " correct";
  else if (isIncorrect) className += " incorrect";
  else if (isExtra) className += " extra";

  return <span className={className}>{char}</span>;
});

Character.displayName = 'Character';
