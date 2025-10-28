const formatTimestamp = (timestamp) => {
  if (!timestamp) {
    return "N/A";
  }
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(new Date(timestamp));
};

const Header = ({ onRefresh, lastUpdated = "", isRefreshing = false }) => (
  <header className="card mb-4">
    <div className="card-body p-4">
      <div className="row gy-3 align-items-center">
        <div className="col-md">
          <h1 className="h3 mb-1">CryptoTrackr</h1>
          <p className="text-muted mb-2">
            Realtime cryptocurrency tracker with portfolio tools
          </p>
          <small className="text-muted">
            Last updated: {formatTimestamp(lastUpdated)}
          </small>
        </div>
        <div className="col-md-auto">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing && (
              <span className="spinner-border spinner-border-sm me-2" />
            )}
            {isRefreshing ? "Refreshing…" : "Refresh Data"}
          </button>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
