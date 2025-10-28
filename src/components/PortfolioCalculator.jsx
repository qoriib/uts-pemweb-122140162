import { useEffect, useMemo, useState } from 'react';
import { createCurrencyFormatter } from '../utils/formatters.js';
import './PortfolioCalculator.css';

const PortfolioCalculator = ({ coins = [], currency = 'usd' }) => {
  const [selectedCoin, setSelectedCoin] = useState(coins[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [holdings, setHoldings] = useState([]);

  const formatCurrency = useMemo(
    () => createCurrencyFormatter(currency, { maximumFractionDigits: 6 }),
    [currency],
  );

  useEffect(() => {
    if (coins.length > 0) {
      setSelectedCoin(coins[0].id);
    } else {
      setSelectedCoin('');
    }
  }, [coins]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedCoin || !amount) {
      return;
    }

    const quantity = Number(amount);
    if (Number.isNaN(quantity) || quantity <= 0) {
      return;
    }

    setHoldings((prev) => {
      const existing = prev.find((entry) => entry.coinId === selectedCoin);
      if (existing) {
        return prev.map((entry) =>
          entry.coinId === selectedCoin
            ? { ...entry, amount: entry.amount + quantity }
            : entry,
        );
      }
      return [...prev, { coinId: selectedCoin, amount: quantity }];
    });
    setAmount('');
  };

  const handleReset = () => {
    setHoldings([]);
  };

  const holdingDetails = holdings.map((holding) => {
    const coin = coins.find((item) => item.id === holding.coinId);
    const currentPrice = coin?.current_price || 0;
    const currentValue = currentPrice * holding.amount;
    return {
      ...holding,
      name: coin?.name || holding.coinId,
      symbol: coin?.symbol?.toUpperCase() || '',
      currentPrice,
      currentValue,
    };
  });

  const totalValue = holdingDetails.reduce((acc, item) => acc + item.currentValue, 0);

  return (
    <section className="portfolio-calculator">
      <div className="portfolio-header">
        <h2>Portfolio Calculator</h2>
        <button type="button" onClick={handleReset} className="link-button">
          Reset Portfolio
        </button>
      </div>
      <form className="portfolio-form" onSubmit={handleSubmit}>
        <label htmlFor="portfolioCoin">
          Coin
          <select
            id="portfolioCoin"
            name="coin"
            required
            value={selectedCoin}
            onChange={(event) => setSelectedCoin(event.target.value)}
            disabled={coins.length === 0}
          >
            {coins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name} ({coin.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="portfolioAmount">
          Amount Owned
          <input
            id="portfolioAmount"
            name="amount"
            type="number"
            min="0"
            step="0.0001"
            required
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.0000"
            inputMode="decimal"
          />
        </label>

        <button type="submit" className="primary" disabled={coins.length === 0}>
          Add to Portfolio
        </button>
      </form>

      <div className="portfolio-summary">
        <p>
          Current portfolio value:{' '}
          <strong>{formatCurrency(totalValue || 0)}</strong>
        </p>
      </div>

      {coins.length === 0 ? (
        <p className="empty-state">Add filters or refresh the data to calculate your portfolio.</p>
      ) : holdingDetails.length > 0 ? (
        <div className="portfolio-table-scroll">
          <table className="portfolio-table">
            <thead>
              <tr>
                <th scope="col">Coin</th>
                <th scope="col" className="numeric">Amount</th>
                <th scope="col" className="numeric">Current Price</th>
                <th scope="col" className="numeric">Current Value</th>
              </tr>
            </thead>
            <tbody>
              {holdingDetails.map((item) => (
                <tr key={item.coinId}>
                  <td>
                    <strong>{item.name}</strong>
                    <span className="symbol">{item.symbol}</span>
                  </td>
                  <td className="numeric">{item.amount}</td>
                  <td className="numeric">{formatCurrency(item.currentPrice)}</td>
                  <td className="numeric">{formatCurrency(item.currentValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {coins.length > 0 && holdingDetails.length === 0 && (
        <p className="info">Add a coin and amount above to calculate your portfolio.</p>
      )}
    </section>
  );
};

export default PortfolioCalculator;
