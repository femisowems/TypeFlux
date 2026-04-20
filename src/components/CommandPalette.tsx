import { useEffect, useState, useRef, useMemo } from 'react';
import type { AppConfig, Vocabulary, SoundType } from '../hooks/useAppConfig';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  updateConfig: (c: Partial<AppConfig>) => void;
}

export const CommandPalette = ({ isOpen, onClose, config, updateConfig }: CommandPaletteProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo(() => [
    // Modes
    { id: 'm-time', label: 'Mode: Time', category: 'Mode', action: () => updateConfig({ mode: 'time' }) },
    { id: 'm-words', label: 'Mode: Words', category: 'Mode', action: () => updateConfig({ mode: 'words' }) },
    
    // Time Durations
    { id: 't-15', label: 'Time: 15s', category: 'Duration', action: () => updateConfig({ mode: 'time', duration: 15 }) },
    { id: 't-30', label: 'Time: 30s', category: 'Duration', action: () => updateConfig({ mode: 'time', duration: 30 }) },
    { id: 't-60', label: 'Time: 60s', category: 'Duration', action: () => updateConfig({ mode: 'time', duration: 60 }) },
    { id: 't-120', label: 'Time: 120s', category: 'Duration', action: () => updateConfig({ mode: 'time', duration: 120 }) },
    
    // Word Counts
    { id: 'w-10', label: 'Words: 10', category: 'Duration', action: () => updateConfig({ mode: 'words', wordCount: 10 }) },
    { id: 'w-25', label: 'Words: 25', category: 'Duration', action: () => updateConfig({ mode: 'words', wordCount: 25 }) },
    { id: 'w-50', label: 'Words: 50', category: 'Duration', action: () => updateConfig({ mode: 'words', wordCount: 50 }) },
    { id: 'w-100', label: 'Words: 100', category: 'Duration', action: () => updateConfig({ mode: 'words', wordCount: 100 }) },
    
    // Vocabulary
    ...(['paragraphs', 'easy', 'hard', 'code', 'react', 'git', 'css'] as Vocabulary[]).map(v => ({
      id: `voc-${v}`, label: `Vocabulary: ${v.charAt(0).toUpperCase() + v.slice(1)}`, category: 'Difficulty', action: () => updateConfig({ vocabulary: v })
    })),
    
    // Toggles
    { id: 'tog-punc', label: `Toggle: Punctuation (${config.punctuation ? 'ON' : 'OFF'})`, category: 'Difficulty', action: () => updateConfig({ punctuation: !config.punctuation }) },
    { id: 'tog-num', label: `Toggle: Numbers (${config.numbers ? 'ON' : 'OFF'})`, category: 'Difficulty', action: () => updateConfig({ numbers: !config.numbers }) },
    { id: 'tog-zen', label: `Toggle: Zen Mode (${config.zenMode ? 'ON' : 'OFF'})`, category: 'Difficulty', action: () => updateConfig({ zenMode: !config.zenMode }) },
    { id: 'tog-death', label: `Toggle: Sudden Death (${config.suddenDeath ? 'ON' : 'OFF'})`, category: 'Difficulty', action: () => updateConfig({ suddenDeath: !config.suddenDeath }) },
    
    // Ghost Race
    { id: 'gh-off', label: 'Ghost: Off', category: 'Pacing', action: () => updateConfig({ ghostPace: 0 }) },
    ...[40, 60, 80, 100, 120].map(p => ({
      id: `gh-${p}`, label: `Ghost Pace: ${p} WPM`, category: 'Pacing', action: () => updateConfig({ ghostPace: p })
    })),

    // Sound
    { id: 'snd-tog', label: `Sound: ${config.soundEnabled ? 'ON' : 'OFF'}`, category: 'Sound', action: () => updateConfig({ soundEnabled: !config.soundEnabled }) },
    ...(['blue', 'brown', 'red'] as SoundType[]).map(s => ({
      id: `snd-${s}`, label: `Sound Switch: ${s.charAt(0).toUpperCase() + s.slice(1)}`, category: 'Sound', action: () => updateConfig({ soundType: s })
    })),

    // Appearance
    { id: 'car-line', label: 'Caret: Line', category: 'Appearance', action: () => updateConfig({ caretStyle: 'line' }) },
    { id: 'car-block', label: 'Caret: Block', category: 'Appearance', action: () => updateConfig({ caretStyle: 'block' }) },
    { id: 'car-under', label: 'Caret: Underline', category: 'Appearance', action: () => updateConfig({ caretStyle: 'underline' }) },
    
    { id: 'th-carbon', label: 'Theme: Carbon', category: 'Appearance', action: () => updateConfig({ theme: 'carbon' }) },
    { id: 'th-dracula', label: 'Theme: Dracula', category: 'Appearance', action: () => updateConfig({ theme: 'dracula' }) },
    { id: 'th-matrix', label: 'Theme: Matrix', category: 'Appearance', action: () => updateConfig({ theme: 'matrix' }) },
    { id: 'th-nord', label: 'Theme: Nord', category: 'Appearance', action: () => updateConfig({ theme: 'nord' }) },
  ], [config, updateConfig]);

  const filteredCommands = useMemo(() => {
    if (!query) return commands;
    const lowerQuery = query.toLowerCase();
    return commands.filter(c => c.label.toLowerCase().includes(lowerQuery) || c.category.toLowerCase().includes(lowerQuery));
  }, [query, commands]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredCommands.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
        onClose();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="command-palette-backdrop" onClick={onClose}>
      <div className="command-palette-modal" onClick={(e) => e.stopPropagation()}>
        <div className="command-header">
           <input 
             ref={inputRef}
             type="text" 
             placeholder="Type a command or search..." 
             className="command-input"
             value={query}
             onChange={(e) => setQuery(e.target.value)}
           />
        </div>
        <div className="command-list">
          {filteredCommands.length > 0 ? filteredCommands.map((cmd, idx) => (
            <div 
              key={cmd.id} 
              className={`command-item ${idx === selectedIndex ? 'selected' : ''}`}
              onClick={() => {
                cmd.action();
                onClose();
              }}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
               <div className="command-text">
                 <span className="command-cat">{cmd.category}</span>
                 <span>{cmd.label}</span>
               </div>
               {idx === selectedIndex && <span className="command-shortcut">↵</span>}
            </div>
          )) : (
            <div className="command-empty">No results found.</div>
          )}
        </div>
      </div>
    </div>
  );
};
