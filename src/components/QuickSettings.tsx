import React from 'react';
import type { AppConfig } from '../hooks/useAppConfig';

interface QuickSettingsProps {
  config: AppConfig;
  updateConfig: (updates: Partial<AppConfig>) => void;
}

export const QuickSettings: React.FC<QuickSettingsProps> = ({ config, updateConfig }) => {
  const timeOptions = [15, 30, 60, 120];
  const wordOptions = [10, 25, 50, 100];

  return (
    <div className="quick-settings">
      <div className="settings-group">
        <button 
          className={`settings-btn ${config.punctuation ? 'active' : ''}`}
          onClick={() => updateConfig({ punctuation: !config.punctuation })}
        >
          punctuation
        </button>
        <button 
          className={`settings-btn ${config.numbers ? 'active' : ''}`}
          onClick={() => updateConfig({ numbers: !config.numbers })}
        >
          numbers
        </button>
        <button 
          className={`settings-btn ${config.vocabulary === 'history' ? 'active' : ''}`}
          onClick={() => updateConfig({ vocabulary: 'history' })}
        >
          facts
        </button>
      </div>

      <div className="settings-divider" />

      <div className="settings-group">
        <button 
          className={`settings-btn ${config.mode === 'time' ? 'active' : ''}`}
          onClick={() => updateConfig({ mode: 'time' })}
        >
          time
        </button>
        <button 
          className={`settings-btn ${config.mode === 'words' ? 'active' : ''}`}
          onClick={() => updateConfig({ mode: 'words' })}
        >
          words
        </button>
      </div>

      <div className="settings-divider" />

      <div className="settings-group">
        {config.mode === 'time' ? (
          timeOptions.map((t) => (
            <button
              key={t}
              className={`settings-btn ${config.duration === t ? 'active' : ''}`}
              onClick={() => updateConfig({ duration: t })}
            >
              {t}
            </button>
          ))
        ) : (
          wordOptions.map((w) => (
            <button
              key={w}
              className={`settings-btn ${config.wordCount === w ? 'active' : ''}`}
              onClick={() => updateConfig({ wordCount: w })}
            >
              {w}
            </button>
          ))
        )}
      </div>

      <div className="settings-divider" />

      <div className="settings-group">
        <button 
          className={`settings-btn ${config.zenMode ? 'active' : ''}`}
          onClick={() => updateConfig({ zenMode: !config.zenMode })}
        >
          zen
        </button>
      </div>
    </div>
  );
};
