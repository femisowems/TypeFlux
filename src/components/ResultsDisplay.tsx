import type { TypingStats } from '../utils/stats';
import type { HistoryPoint } from '../hooks/useTypingEngine';
import { WpmChart } from './WpmChart';
import { useHistory } from '../hooks/useHistory';

interface ResultsDisplayProps {
  stats: TypingStats;
  history: HistoryPoint[];
  onRestart: () => void;
  hideStats?: boolean;
}

export const ResultsDisplay = ({ stats, history, onRestart, hideStats }: ResultsDisplayProps) => {
  const { history: testHistory, clearHistory } = useHistory();

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
