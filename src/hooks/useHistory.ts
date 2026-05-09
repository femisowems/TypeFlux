import { useState, useCallback } from 'react';
import type { TypingStats } from '../utils/stats';

export interface HistoryEntry extends TypingStats {
  id: string;
  timestamp: number;
  vocabulary: string;
  mode: string;
  duration: number;
}

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('typeflux-history');
    if (saved) {
      try { return JSON.parse(saved); }
      catch { return []; }
    }
    return [];
  });

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
        localStorage.setItem('typeflux-history', JSON.stringify(next));
      } catch (err) {
        // Handle quota exceeded or other localStorage errors gracefully
        if (err instanceof Error) {
          console.warn('Failed to save test result to history:', err.message);
        }
      }
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem('typeflux-history');
    } catch (err) {
      if (err instanceof Error) {
        console.warn('Failed to clear history from localStorage:', err.message);
      }
    }
  }, []);

  return { history, saveResult, clearHistory };
};
