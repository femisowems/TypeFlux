import { useState, useEffect, useCallback, useRef } from 'react';
import { generateWords } from '../utils/words';
import { calculateStats, type TypingStats } from '../utils/stats';
import type { AppConfig } from './useAppConfig';
import { useHistory } from './useHistory';

export type Phase = 'waiting' | 'running' | 'finished';

export interface HistoryPoint {
  second: number;
  wpm: number;
  raw: number;
}

export const useTypingEngine = (config: AppConfig) => {
  const [phase, setPhase] = useState<Phase>('waiting');
  const [words, setWords] = useState<string[]>([]);
  const [typedWords, setTypedWords] = useState<string[]>(['']);
  
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  const [errors, setErrors] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);

  const [wpmHistory, setWpmHistory] = useState<HistoryPoint[]>([]);
  const [errorTrigger, setErrorTrigger] = useState(0); 

  const timerRef = useRef<number | null>(null);
  const { saveResult } = useHistory();

  const activeStatsRef = useRef({ totalTyped, correctChars, errors });
  useEffect(() => {
    activeStatsRef.current = { totalTyped, correctChars, errors };
  }, [totalTyped, correctChars, errors]);

  const init = useCallback(() => {
    const count = config.mode === 'words' ? config.wordCount : 1000; 
    setWords(generateWords({
      count,
      vocabulary: config.vocabulary,
      numbers: config.numbers,
      punctuation: config.punctuation
    }));
    
    setPhase('waiting');
    setTypedWords(['']);
    setTimeElapsed(0);
    setErrors(0);
    setCorrectChars(0);
    setTotalTyped(0);
    setWpmHistory([]);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [config]);

  useEffect(() => {
    init();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [init]);



  const endTest = useCallback(() => {
    setPhase('finished');
    if (timerRef.current) clearInterval(timerRef.current);
    
    const statsAtEnd = calculateStats(
      activeStatsRef.current.totalTyped,
      activeStatsRef.current.correctChars,
      activeStatsRef.current.errors,
      timeElapsed
    );

    // Save to history
    saveResult(statsAtEnd, {
      vocabulary: config.vocabulary,
      mode: config.mode,
      duration: config.mode === 'time' ? config.duration : config.wordCount
    });
  }, [config, saveResult]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (phase === 'finished') return;
      
      const isAlphanumericOrPunc = e.key.length === 1;
      const isBackspace = e.key === 'Backspace';
      const isSpace = e.key === ' ';

      if (!isAlphanumericOrPunc && !isBackspace && !isSpace) return;
      
      if (phase === 'waiting') {
        setPhase('running');
        timerRef.current = window.setInterval(() => {
          setTimeElapsed((prev) => {
            const nextTime = prev + 1;
            
            const liveStats = calculateStats(
              activeStatsRef.current.totalTyped,
              activeStatsRef.current.correctChars,
              activeStatsRef.current.errors,
              nextTime
            );
            setWpmHistory(h => [...h, { second: nextTime, wpm: liveStats.netWpm, raw: liveStats.rawWpm }]);

            if (config.mode === 'time' && nextTime >= config.duration) {
              endTest();
            }
            return nextTime;
          });
        }, 1000);
      }

      setTypedWords((prev) => {
        const newTyped = [...prev];
        const currentWordIndex = newTyped.length - 1;
        const currentTypedWord = newTyped[currentWordIndex];
        const targetWord = words[currentWordIndex];

        if (isBackspace) {
          if (currentTypedWord.length > 0) {
            newTyped[currentWordIndex] = currentTypedWord.slice(0, -1);
          } else if (currentWordIndex > 0) {
            newTyped.pop();
          }
        } else if (isSpace) {
          if (currentTypedWord.length > 0) {
            if (config.mode === 'words' && currentWordIndex === config.wordCount - 1) {
               endTest();
            } else {
               newTyped.push('');
            }
          }
        } else {
          if (currentTypedWord.length < targetWord.length + 10) {
             const keyVal = e.key;
             newTyped[currentWordIndex] = currentTypedWord + keyVal;
             setTotalTyped((t) => t + 1);
             
             if (targetWord[currentTypedWord.length] === keyVal) {
               setCorrectChars((c) => c + 1);
             } else {
               setErrors((err) => err + 1);
               
               // Sudden Death Logic
               if (config.suddenDeath) {
                 endTest();
                 return newTyped;
               }

               if (currentTypedWord.length >= targetWord.length || keyVal !== targetWord[currentTypedWord.length]) {
                 setErrorTrigger(Date.now());
               }
             }
             
             if (config.mode === 'words' && currentWordIndex === config.wordCount - 1) {
                const finalWordTyped = newTyped[currentWordIndex];
                if (finalWordTyped.length === targetWord.length && targetWord.startsWith(finalWordTyped)) {
                   endTest();
                }
             }
          }
        }

        return newTyped;
      });
    },
    [phase, words, endTest, config]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const stats: TypingStats = calculateStats(
    totalTyped,
    correctChars,
    errors,
    timeElapsed
  );

  const timeLeft = config.mode === 'time' ? Math.max(0, config.duration - timeElapsed) : 0;
  
  // Ghost Logic
  const ghostCharIndex = config.ghostPace > 0 
    ? Math.floor((config.ghostPace * 5 * timeElapsed) / 60)
    : -1;

  return {
    phase,
    words,
    typedWords,
    timeLeft,
    timeElapsed,
    stats,
    restart: init,
    wpmHistory,
    errorTrigger,
    ghostCharIndex
  };
};
