
import type { AppConfig } from '../hooks/useAppConfig';
import { QuickSettings } from './QuickSettings';

interface HeaderProps {
  config: AppConfig;
  updateConfig: (updates: Partial<AppConfig>) => void;
}

export const Header = ({ config, updateConfig }: HeaderProps) => {
  return (
    <header>
      <div className="logo" onClick={() => window.location.reload()} style={{ cursor: 'pointer' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 14 10 14 10 20" />
          <polyline points="20 10 14 10 14 4" />
          <line x1="14" y1="10" x2="21" y2="3" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
        TypeFlux
      </div>
      <div className="nav">
        <QuickSettings config={config} updateConfig={updateConfig} />
      </div>
    </header>
  );
};
