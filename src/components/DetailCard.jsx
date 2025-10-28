import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { createCurrencyFormatter } from "../utils/formatters.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const DetailCard = ({
  coin = null,
  chartData = [],
  currency = "usd",
  isLoading = false,
  error = "",
}) => {
  if (isLoading) {
    return (
      <section className="card">
        <div className="card-body">
          <h2 className="h5 mb-3">Coin Details</h2>
          <p className="text-muted mb-0">Loading coin details…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card">
        <div className="card-body">
          <h2 className="h5 mb-3">Coin Details</h2>
          <div className="alert alert-danger py-2 small mb-0" role="alert">
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (!coin) {
    return (
      <section className="card">
        <div className="card-body">
          <h2 className="h5 mb-3">Coin Details</h2>
          <p className="text-muted mb-0">
            Select a cryptocurrency from the table to see detailed analytics.
          </p>
        </div>
      </section>
    );
  }

  const formatCurrency = createCurrencyFormatter(currency, {
    maximumFractionDigits: 6,
  });
  const descriptions = coin.description || {};
  const shortDescription = descriptions.en
    ? descriptions.en.replace(/<[^>]+>/g, "").slice(0, 220)
    : "No description available.";

  const chartProps = {
    data: {
      labels: chartData.map((entry) => entry.label),
      datasets: [
        {
          label: `${coin.name} price`,
          data: chartData.map((entry) => entry.value),
          fill: true,
          backgroundColor: "rgba(33, 150, 243, 0.2)",
          borderColor: "#2196f3",
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
    <section className="card">
      <div className="card-body">
        <h2 className="h5 mb-3">{coin.name} Overview</h2>
        <div className="d-flex align-items-center gap-3 mb-3">
          <img
            src={coin.image?.large || coin.image?.small || coin.image}
            alt=""
            width="48"
            height="48"
            className="rounded-circle border"
          />
          <div>
            <p className="h4 mb-1">
              {formatCurrency(coin.market_data?.current_price?.[currency] || 0)}
            </p>
            <p className="text-muted mb-0">
              Market Cap Rank #{coin.market_cap_rank || "—"}
            </p>
          </div>
        </div>

        <p className="text-muted small">{shortDescription}</p>

        <div className="row row-cols-2 g-3">
          <div className="col">
            <div className="border rounded p-3 h-100">
              <span className="text-uppercase text-muted small">24h High</span>
              <div className="fw-semibold mt-1">
                {formatCurrency(coin.market_data?.high_24h?.[currency] || 0)}
              </div>
            </div>
          </div>
          <div className="col">
            <div className="border rounded p-3 h-100">
              <span className="text-uppercase text-muted small">24h Low</span>
              <div className="fw-semibold mt-1">
                {formatCurrency(coin.market_data?.low_24h?.[currency] || 0)}
              </div>
            </div>
          </div>
          <div className="col">
            <div className="border rounded p-3 h-100">
              <span className="text-uppercase text-muted small">
                Circulating Supply
              </span>
              <div className="fw-semibold mt-1">
                {coin.market_data?.circulating_supply?.toLocaleString() || "—"}
              </div>
            </div>
          </div>
          <div className="col">
            <div className="border rounded p-3 h-100">
              <span className="text-uppercase text-muted small">
                Total Volume
              </span>
              <div className="fw-semibold mt-1">
                {formatCurrency(
                  coin.market_data?.total_volume?.[currency] || 0
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-body">
            <h3 className="h6 mb-3">7 Day Price Chart</h3>
            {chartData.length > 0 ? (
              <Line {...chartProps} />
            ) : (
              <p className="text-muted small mb-0">No chart data available.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailCard;
