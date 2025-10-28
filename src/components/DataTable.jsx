import {
  formatCurrencyValue,
  formatPercentageValue,
} from "../utils/formatters.js";

const getPriceChange24h = (coin) =>
  coin.price_change_percentage_24h_in_currency ??
  coin.price_change_percentage_24h ??
  0;

const DataTable = ({
  coins = [],
  onSelect = () => {},
  currency = "usd",
  isLoading = false,
  error = "",
}) => {
  const currencyLabel = currency.toUpperCase();

  return (
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h5 mb-3">Market Overview</h2>
        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            {error}
          </div>
        )}
        <div className="table-responsive" style={{ maxHeight: "70rem" }}>
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Coin</th>
                <th scope="col" className="text-end">
                  Price ({currencyLabel})
                </th>
                <th scope="col" className="text-end">
                  Market Cap
                </th>
                <th scope="col" className="text-end">
                  24h Change
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <div
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Loading market data…
                  </td>
                </tr>
              ) : coins.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No coins match the selected filters.
                  </td>
                </tr>
              ) : (
                coins.map((coin, index) => (
                  <tr
                    key={coin.id}
                    onClick={() => onSelect(coin)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelect(coin);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    style={{ cursor: "pointer" }}
                  >
                    <td>{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={coin.image}
                          alt=""
                          width="28"
                          height="28"
                          className="rounded-circle border"
                          loading="lazy"
                        />
                        <div>
                          <div className="fw-semibold">{coin.name}</div>
                          <div className="text-muted text-uppercase small">
                            {coin.symbol}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-end">
                      {formatCurrencyValue(coin.current_price, currency)}
                    </td>
                    <td className="text-end">
                      {formatCurrencyValue(coin.market_cap, currency)}
                    </td>
                    <td
                      className={`text-end fw-semibold ${
                        getPriceChange24h(coin) >= 0
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {formatPercentageValue(getPriceChange24h(coin))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default DataTable;
