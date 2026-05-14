import { useState, useCallback, useEffect } from 'react';
import type { TypingStats } from '../utils/stats';

export interface HistoryEntry extends TypingStats {
  id: string;
  timestamp: number;
  vocabulary: string;
  mode: string;
  duration: number;
}

const profileHistoryKey = (profileId: string) => `typeflux-profile-${profileId}-history`;

const readHistory = (profileId: string): HistoryEntry[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(profileHistoryKey(profileId));
  if (saved) {
    try { return JSON.parse(saved); }
    catch { return []; }
  }
  return [];
};

export const useHistory = (profileId: string) => {
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    return readHistory(profileId);
  });

  useEffect(() => {
    setHistory(readHistory(profileId));
  }, [profileId]);

  const saveResult = useCallback((stats: TypingStats, context: { vocabulary: string, mode: string, duration: number }) => {
    const entry: HistoryEntry = {
      ...stats,
      id: Math.random().toString(36).substring(2, 11),
      timestamp: Date.now(),
      ...context
    };

    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 50); // Keep last 50 for better history tracking
      try {
        localStorage.setItem(profileHistoryKey(profileId), JSON.stringify(next));
      } catch (err) {
        // Handle quota exceeded or other localStorage errors gracefully
        if (err instanceof Error) {
          console.warn('Failed to save test result to history:', err.message);
        }
      }
      return next;
    });
  }, [profileId]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(profileHistoryKey(profileId));
    } catch (err) {
      if (err instanceof Error) {
        console.warn('Failed to clear history from localStorage:', err.message);
      }
    }
  }, [profileId]);

  return { history, saveResult, clearHistory };
};
