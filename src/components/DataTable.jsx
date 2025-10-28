import { formatCurrencyValue, formatPercentageValue } from '../utils/formatters.js';
import './DataTable.css';

const getPriceChange24h = (coin) =>
  coin.price_change_percentage_24h_in_currency ??
  coin.price_change_percentage_24h ??
  0;

const DataTable = ({
  coins = [],
  onSelect = () => {},
  currency = 'usd',
  isLoading = false,
  error = '',
}) => {
  const currencyLabel = currency.toUpperCase();

  return (
    <section className="data-table-wrapper">
      <h2>Market Overview</h2>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="table-scroll">
        <table className="coin-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Coin</th>
              <th scope="col" className="numeric">Price ({currencyLabel})</th>
              <th scope="col" className="numeric">Market Cap</th>
              <th scope="col" className="numeric">24h Change</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="loading-cell">
                  <span className="spinner" aria-hidden="true" />
                  Loading market data…
                </td>
              </tr>
            ) : coins.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  No coins match the selected filters.
                </td>
              </tr>
            ) : (
              coins.map((coin, index) => (
                <tr
                  key={coin.id}
                  onClick={() => onSelect(coin)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onSelect(coin);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                >
                  <td data-label="Rank">{index + 1}</td>
                  <td className="coin-cell" data-label="Coin">
                    <img src={coin.image} alt="" width="24" height="24" loading="lazy" />
                    <div>
                      <strong>{coin.name}</strong>
                      <span>{coin.symbol.toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="numeric" data-label={`Price (${currencyLabel})`}>
                    {formatCurrencyValue(coin.current_price, currency)}
                  </td>
                  <td className="numeric" data-label="Market Cap">
                    {formatCurrencyValue(coin.market_cap, currency)}
                  </td>
                  <td
                    className={`numeric change ${
                      getPriceChange24h(coin) >= 0 ? 'positive' : 'negative'
                    }`}
                    data-label="24h Change"
                  >
                    {formatPercentageValue(getPriceChange24h(coin))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DataTable;
