import { useEffect, useMemo, useState } from "react";
import { createCurrencyFormatter } from "../utils/formatters.js";

const PortfolioCalculator = ({ coins = [], currency = "usd" }) => {
  const [selectedCoin, setSelectedCoin] = useState(coins[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [holdings, setHoldings] = useState([]);

  const formatCurrency = useMemo(
    () => createCurrencyFormatter(currency, { maximumFractionDigits: 6 }),
    [currency]
  );

  useEffect(() => {
    if (coins.length > 0) {
      setSelectedCoin(coins[0].id);
    } else {
      setSelectedCoin("");
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
            : entry
        );
      }
      return [...prev, { coinId: selectedCoin, amount: quantity }];
    });
    setAmount("");
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
      symbol: coin?.symbol?.toUpperCase() || "",
      currentPrice,
      currentValue,
    };
  });

  const totalValue = holdingDetails.reduce(
    (acc, item) => acc + item.currentValue,
    0
  );

  return (
    <section className="card">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
          <h2 className="h5 mb-0">Portfolio Calculator</h2>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
          >
            Reset
          </button>
        </div>
        <form className="row g-3 align-items-end" onSubmit={handleSubmit}>
          <div className="col-12 col-sm-6">
            <label htmlFor="portfolioCoin" className="form-label">
              Coin
            </label>
            <select
              id="portfolioCoin"
              name="coin"
              className="form-select"
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
          </div>

          <div className="col-12 col-sm-6">
            <label htmlFor="portfolioAmount" className="form-label">
              Amount Owned
            </label>
            <input
              id="portfolioAmount"
              name="amount"
              className="form-control"
              type="number"
              min="0"
              step="0.0001"
              required
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.0000"
              inputMode="decimal"
            />
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={coins.length === 0}
            >
              Add to Portfolio
            </button>
          </div>
        </form>

        <div className="alert alert-secondary mt-4 mb-3" role="status">
          Current portfolio value:{" "}
          <strong>{formatCurrency(totalValue || 0)}</strong>
        </div>

        {coins.length === 0 ? (
          <p className="text-muted mb-0">
            Add filters or refresh the data to calculate your portfolio.
          </p>
        ) : holdingDetails.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-sm align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Coin</th>
                  <th scope="col" className="text-end">
                    Amount
                  </th>
                  <th scope="col" className="text-end">
                    Current Price
                  </th>
                  <th scope="col" className="text-end">
                    Current Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {holdingDetails.map((item) => (
                  <tr key={item.coinId}>
                    <td>
                      <div className="fw-semibold">{item.name}</div>
                      <div className="text-muted text-uppercase small">
                        {item.symbol}
                      </div>
                    </td>
                    <td className="text-end">{item.amount}</td>
                    <td className="text-end">
                      {formatCurrency(item.currentPrice)}
                    </td>
                    <td className="text-end">
                      {formatCurrency(item.currentValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted mb-0">
            Add a coin and amount above to calculate your portfolio.
          </p>
        )}
      </div>
    </section>
  );
};

export default PortfolioCalculator;
