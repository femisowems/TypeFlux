import { useEffect, useState } from 'react';

export type TestMode = 'time' | 'words' | 'infinite';
export type CaretStyle = 'line' | 'block' | 'underline';
export type Vocabulary = 'paragraphs' | 'easy' | 'hard' | 'code' | 'react' | 'git' | 'css' | 'history' | 'interview' | 'bible';
export type Theme = 'carbon' | 'dracula' | 'matrix' | 'nord';
export type SoundType = 'blue' | 'brown' | 'red';

export interface AppConfig {
  mode: TestMode;
  duration: number; // 15, 30, 60, 120
  wordCount: number; // 10, 25, 50, 100
  punctuation: boolean;
  numbers: boolean;
  vocabulary: Vocabulary;
  caretStyle: CaretStyle;
  theme: Theme;
  
  // Phase 3
  zenMode: boolean;
  suddenDeath: boolean;
  ghostPace: number; // 0 for off, or target WPM
  soundEnabled: boolean;
  soundVolume: number;
  soundType: SoundType;
  hideStats: boolean;
}

export const defaultConfig: AppConfig = {
  mode: 'time',
  duration: 30,
  wordCount: 25,
  punctuation: false,
  numbers: false,
  vocabulary: 'paragraphs',
  caretStyle: 'line',
  theme: 'carbon',
  
  // Phase 3 Defaults
  zenMode: false,
  suddenDeath: false,
  ghostPace: 0,
  soundEnabled: true,
  soundVolume: 0.5,
  soundType: 'brown',
  hideStats: false
};

const profileConfigKey = (profileId: string) => `typeflux-profile-${profileId}-config`;

const readConfig = (profileId: string): AppConfig => {
  if (typeof window === 'undefined') return defaultConfig;
  const saved = localStorage.getItem(profileConfigKey(profileId));
  if (saved) {
    try { return { ...defaultConfig, ...JSON.parse(saved) }; }
    catch { return defaultConfig; }
  }
  return defaultConfig;
};

export const useAppConfig = (profileId: string) => {
  const [config, setConfigState] = useState<AppConfig>(() => {
    return readConfig(profileId);
  });

  useEffect(() => {
    setConfigState(readConfig(profileId));
  }, [profileId]);

  const setConfig = (updates: Partial<AppConfig>) => {
    setConfigState(prev => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(profileConfigKey(profileId), JSON.stringify(next));
      } catch (err) {
        // Handle quota exceeded or other localStorage errors gracefully
        if (err instanceof Error) {
          console.warn('Failed to save config to localStorage:', err.message);
        }
      }
      return next;
    });
  };

  return { config, setConfig };
};
