/**
 * Calculates typing statistics based on standard typing test formulas.
 */

export interface TypingStats {
  rawWpm: number;
  netWpm: number;
  accuracy: number;
  errors: number;
  totalTyped: number;
}

export const calculateStats = (
  typedCharacters: number,
  correctCharacters: number,
  errors: number,
  timeToCompleteSeconds: number
): TypingStats => {
  const timeInMinutes = timeToCompleteSeconds / 60;
  
  // Raw WPM: all typed characters / 5 / time
  const rawWpm = timeInMinutes > 0 ? Math.round((typedCharacters / 5) / timeInMinutes) : 0;
  
  // Net WPM: only correct characters / 5 / time
  let netWpm = timeInMinutes > 0 ? Math.round((correctCharacters / 5) / timeInMinutes) : 0;
  if (netWpm < 0) netWpm = 0;
  
  const accuracy = typedCharacters > 0 
    ? Math.round((correctCharacters / typedCharacters) * 100) 
    : 0;

  return {
    rawWpm,
    netWpm,
    accuracy,
    errors,
    totalTyped: typedCharacters
  };
};
