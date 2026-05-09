import type { TypingStats } from '../utils/stats';
import type { HistoryPoint } from '../hooks/useTypingEngine';
import { WpmChart } from './WpmChart';
import { useHistory } from '../hooks/useHistory';

interface ResultsDisplayProps {
  stats: TypingStats;
  history: HistoryPoint[];
  onRestart: () => void;
  hideStats?: boolean;
  endReason?: 'sudden-death' | 'normal' | null;
}

export const ResultsDisplay = ({ stats, history, onRestart, hideStats, endReason }: ResultsDisplayProps) => {
  const { history: testHistory, clearHistory } = useHistory();
  const peakNetWpm = history.length > 0 ? Math.max(stats.netWpm, ...history.map((point) => point.wpm)) : stats.netWpm;
  const peakRawWpm = history.length > 0 ? Math.max(stats.rawWpm, ...history.map((point) => point.raw)) : stats.rawWpm;
  const averageNetWpm = history.length > 0 ? Math.round(history.reduce((sum, point) => sum + point.wpm, 0) / history.length) : stats.netWpm;
  const averageRawWpm = history.length > 0 ? Math.round(history.reduce((sum, point) => sum + point.raw, 0) / history.length) : stats.rawWpm;
  const sessionSeconds = history.length > 0 ? history[history.length - 1].second : 0;
  const charactersPerMinute = sessionSeconds > 0 ? Math.round((stats.totalTyped / sessionSeconds) * 60) : 0;
  const correctChars = stats.totalTyped - stats.errors;

  if (hideStats) {
    return (
      <div className="results-display glassmorphic">
        <div className="results-top">
          <div className="results-stats vertical">
            <div className="stat-group">
              <span className="stat-label">status</span>
              <span className="stat-value huge">Done</span>
            </div>
          </div>
          <div className="history-fact-info" style={{ color: 'var(--sub-color)', fontSize: '1.2rem', maxWidth: '500px', textAlign: 'center' }}>
            <p>You've completed the historical lesson. Your performance has been hidden to focus on the knowledge discovered.</p>
          </div>
        </div>
        
        <button className="restart-btn center-btn" onClick={onRestart} aria-label="Restart typing test">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="results-display glassmorphic">
      <div className="results-top">
        <div className="results-stats vertical">
          <div className="stat-group">
            <span className="stat-label">wpm</span>
            <span className="stat-value huge">{stats.netWpm}</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">acc</span>
            <span className="stat-value">{stats.accuracy}%</span>
          </div>
        </div>
        
        <div className="chart-wrapper">
          <WpmChart data={history} />
        </div>
      </div>
      
      {endReason === 'sudden-death' && (
        <div style={{ textAlign: 'center', color: 'var(--error-color)', fontSize: '0.95rem', marginBottom: '1rem', fontWeight: '500' }}>
          ⚡ Sudden Death: Test ended on first error
        </div>
      )}

      <div className="results-metrics-grid">
        <div className="metric-card">
          <span className="metric-label">net wpm</span>
          <span className="metric-value">{stats.netWpm}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">raw wpm</span>
          <span className="metric-value">{stats.rawWpm}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">accuracy</span>
          <span className="metric-value">{stats.accuracy}%</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">errors</span>
          <span className="metric-value">{stats.errors}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">typed</span>
          <span className="metric-value">{stats.totalTyped}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">correct</span>
          <span className="metric-value">{correctChars}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">peak net</span>
          <span className="metric-value">{peakNetWpm}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">peak raw</span>
          <span className="metric-value">{peakRawWpm}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">avg net</span>
          <span className="metric-value">{averageNetWpm}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">avg raw</span>
          <span className="metric-value">{averageRawWpm}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">time</span>
          <span className="metric-value">{sessionSeconds}s</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">cpm</span>
          <span className="metric-value">{charactersPerMinute}</span>
        </div>
      </div>
      
      <div className="results-stats horizontal">
        <div className="stat-group">
          <span className="stat-label">raw</span>
          <span className="stat-value small">{stats.rawWpm}</span>
        </div>
        <div className="stat-group">
          <span className="stat-label">characters</span>
          <span className="stat-value small">{stats.totalTyped - stats.errors}/{stats.errors}/0/{stats.totalTyped}</span>
        </div>
      </div>

      {testHistory.length > 0 && (
        <div className="history-section">
          <div className="history-header">
            <h3>Recent History</h3>
            <button className="clear-history-btn" onClick={clearHistory}>Clear</button>
          </div>
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>WPM</th>
                  <th>Acc</th>
                  <th>Mode</th>
                  <th>Vocab</th>
                </tr>
              </thead>
              <tbody>
                {testHistory.map((entry) => (
                  <tr key={entry.id}>
                    <td>{new Date(entry.timestamp).toLocaleDateString()}</td>
                    <td className="highlight-text">{entry.netWpm}</td>
                    <td>{entry.accuracy}%</td>
                    <td>{entry.mode}</td>
                    <td>{entry.vocabulary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <button className="restart-btn center-btn" onClick={onRestart} aria-label="Restart typing test">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
      </button>
    </div>
  );
};
