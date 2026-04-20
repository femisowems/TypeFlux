export type ThemeKey = 'carbon' | 'dracula' | 'matrix' | 'nord';

export const themes: Record<ThemeKey, Record<string, string>> = {
  carbon: {
    '--bg-color': '#323437',
    '--main-color': '#e2b714',
    '--caret-color': '#e2b714',
    '--sub-color': '#646669',
    '--text-color': '#d1d0c5',
    '--error-color': '#ca4754',
    '--error-extra-color': '#7e2a33',
  },
  dracula: {
    '--bg-color': '#282a36',
    '--main-color': '#ff79c6',
    '--caret-color': '#ff79c6',
    '--sub-color': '#6272a4',
    '--text-color': '#f8f8f2',
    '--error-color': '#ff5555',
    '--error-extra-color': '#bd2c40',
  },
  matrix: {
    '--bg-color': '#000000',
    '--main-color': '#00ff41',
    '--caret-color': '#00ff41',
    '--sub-color': '#003b00',
    '--text-color': '#008f11',
    '--error-color': '#ff0000',
    '--error-extra-color': '#8f0000',
  },
  nord: {
    '--bg-color': '#2e3440',
    '--main-color': '#88c0d0',
    '--caret-color': '#88c0d0',
    '--sub-color': '#4c566a',
    '--text-color': '#d8dee9',
    '--error-color': '#bf616a',
    '--error-extra-color': '#7b3e45',
  }
};
