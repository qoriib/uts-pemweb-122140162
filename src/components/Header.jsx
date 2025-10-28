import './Header.css';

const formatTimestamp = (timestamp) => {
  if (!timestamp) {
    return 'N/A';
  }
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: 'short',
  }).format(new Date(timestamp));
};

const Header = ({ onRefresh, lastUpdated = '', isRefreshing = false }) => (
  <header className="app-header">
    <div>
      <h1>CryptoTrackr</h1>
      <p className="subtitle">Realtime cryptocurrency tracker with portfolio tools</p>
      <p className="meta">
        <span>Last updated: {formatTimestamp(lastUpdated)}</span>
      </p>
    </div>
    <button
      type="button"
      className="refresh-button"
      onClick={onRefresh}
      disabled={isRefreshing}
      aria-live="polite"
    >
      {isRefreshing ? 'Refreshing…' : 'Refresh Data'}
    </button>
  </header>
);

export default Header;
