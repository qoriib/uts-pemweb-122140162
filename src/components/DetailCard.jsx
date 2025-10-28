import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { createCurrencyFormatter } from '../utils/formatters.js';
import './DetailCard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const DetailCard = ({
  coin = null,
  chartData = [],
  currency = 'usd',
  isLoading = false,
  error = '',
}) => {
  if (isLoading) {
    return (
      <section className="detail-card">
        <h2>Coin Details</h2>
        <p className="info">Loading coin details…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="detail-card">
        <h2>Coin Details</h2>
        <p className="error" role="alert">{error}</p>
      </section>
    );
  }

  if (!coin) {
    return (
      <section className="detail-card empty">
        <h2>Coin Details</h2>
        <p>Select a cryptocurrency from the table to see detailed analytics.</p>
      </section>
    );
  }

  const formatCurrency = createCurrencyFormatter(currency, { maximumFractionDigits: 6 });
  const descriptions = coin.description || {};
  const shortDescription = descriptions.en
    ? descriptions.en.replace(/<[^>]+>/g, '').slice(0, 220)
    : 'No description available.';

  const chartProps = {
    data: {
      labels: chartData.map((entry) => entry.label),
      datasets: [
        {
          label: `${coin.name} price`,
          data: chartData.map((entry) => entry.value),
          fill: true,
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          borderColor: '#2196f3',
          tension: 0.3,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => formatCurrency(context.parsed.y),
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: (value) => formatCurrency(value),
          },
        },
      },
    },
  };

  return (
    <section className="detail-card">
      <h2>{coin.name} Overview</h2>
      <div className="detail-header">
        <img src={coin.image?.large || coin.image?.small || coin.image} alt="" width="48" height="48" />
        <div>
          <p className="price">{formatCurrency(coin.market_data?.current_price?.[currency] || 0)}</p>
          <p className="rank">Market Cap Rank #{coin.market_cap_rank || '—'}</p>
        </div>
      </div>

      <p className="description">{shortDescription}</p>

      <div className="metrics-grid">
        <div>
          <span className="label">24h High</span>
          <strong>{formatCurrency(coin.market_data?.high_24h?.[currency] || 0)}</strong>
        </div>
        <div>
          <span className="label">24h Low</span>
          <strong>{formatCurrency(coin.market_data?.low_24h?.[currency] || 0)}</strong>
        </div>
        <div>
          <span className="label">Circulating Supply</span>
          <strong>{coin.market_data?.circulating_supply?.toLocaleString() || '—'}</strong>
        </div>
        <div>
          <span className="label">Total Volume</span>
          <strong>{formatCurrency(coin.market_data?.total_volume?.[currency] || 0)}</strong>
        </div>
      </div>

      <div className="chart-block" aria-live="polite">
        <h3>7 Day Price Chart</h3>
        {chartData.length > 0 ? (
          <Line {...chartProps} />
        ) : (
          <p className="info">No chart data available.</p>
        )}
      </div>
    </section>
  );
};

export default DetailCard;
