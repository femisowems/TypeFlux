import { useEffect, useRef, useState } from 'react';
import './App.css';
import { useTypingEngine } from './hooks/useTypingEngine';
import { useAppConfig } from './hooks/useAppConfig';
import { useSoundEngine } from './hooks/useSoundEngine';
import { themes } from './utils/themes';
import { Header } from './components/Header';
import { TypingArea } from './components/TypingArea';
import { ResultsDisplay } from './components/ResultsDisplay';
import { CommandPalette } from './components/CommandPalette';

function App() {
  const { config, setConfig } = useAppConfig();
  const { 
    phase, words, typedWords, timeLeft, timeElapsed, stats, 
    restart, wpmHistory, errorTrigger, ghostCharIndex 
  } = useTypingEngine(config);
  
  const { playClick } = useSoundEngine(config);
  const restartButtonRef = useRef<HTMLButtonElement>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    const themeStyles = themes[config.theme];
    if (themeStyles) {
      Object.entries(themeStyles).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
  }, [config.theme]);

  // Handle global sounds and shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette (Cmd+K)
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
         e.preventDefault();
         setIsPaletteOpen(true);
         return;
      }



      // Tab key logic
      if (e.key === 'Tab') {
         e.preventDefault();
         restartButtonRef.current?.focus();
         return;
      }

      // Enter key for restart
      if (e.key === 'Enter' && document.activeElement === restartButtonRef.current) {
         restart();
         restartButtonRef.current?.blur();
         return;
      }

      // Play click sound for typing characters (except command keys)
      if (phase !== 'finished' && !isPaletteOpen && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key.length === 1 || e.key === 'Backspace' || e.key === ' ') {
          playClick();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [restart, phase, isPaletteOpen, playClick]);

  const isZenActive = config.zenMode && phase === 'running';

  return (
    <div className={`app-container caret-${config.caretStyle} ${phase === 'running' ? 'focus-mode' : ''}`}>
      <CommandPalette 
        isOpen={isPaletteOpen} 
        onClose={() => setIsPaletteOpen(false)} 
        config={config}
        updateConfig={(updates) => {
          setConfig(updates);
          restart();
        }}
      />


      
      <Header 
        config={config}
        updateConfig={(updates) => {
          setConfig(updates);
          restart();
        }}
      />

      <main>
        {phase !== 'finished' ? (
          <>
            <div className={`stats-bar ${(phase === 'waiting' || isZenActive || config.vocabulary === 'history' || config.vocabulary === 'interview') ? 'hidden' : ''}`}>
               <div className="time">
                 {config.mode === 'infinite' ? timeElapsed : config.mode === 'time' ? timeLeft : timeElapsed}
               </div>
               {phase === 'running' && config.vocabulary !== 'history' && config.vocabulary !== 'interview' && (
                 <div className="live-stats">
                   {stats.netWpm} wpm
                 </div>
               )}
            </div>
            
            <TypingArea 
              words={words} 
              typedWords={typedWords} 
              errorTrigger={errorTrigger}
              ghostCharIndex={ghostCharIndex}
            />

            <div className="footer">
              <button 
                ref={restartButtonRef} 
                className="restart-btn"
                onClick={(e) => {
                   restart();
                   e.currentTarget.blur();
                }}
                aria-label="Restart typing test (Tab + Enter)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
              </button>
            </div>
          </>
        ) : (
          <ResultsDisplay 
            stats={stats} 
            history={wpmHistory} 
            onRestart={restart} 
            hideStats={config.vocabulary === 'history' || config.vocabulary === 'interview'}
          />
        )}
      </main>

      <div className="footer-meta">
        <div className="instructions">
          <span>tab</span> + <span>enter</span> to restart
          <span className="sep"> • </span>
          <span>cmd</span> + <span>k</span> for settings
        </div>
      </div>
    </div>
  );
}

export default App;
