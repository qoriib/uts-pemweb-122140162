import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import Header from './components/Header.jsx';
import SearchForm from './components/SearchForm.jsx';
import DataTable from './components/DataTable.jsx';
import DetailCard from './components/DetailCard.jsx';
import PortfolioCalculator from './components/PortfolioCalculator.jsx';
import { coingeckoFetch } from './api/client.js';
import './App.css';

const defaultFilters = {
  keyword: '',
  minPrice: '',
  maxPrice: '',
  currency: 'usd',
  positiveChangeOnly: false,
};

const App = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  const [selectedCoinId, setSelectedCoinId] = useState('');
  const [coinDetail, setCoinDetail] = useState(null);
  const [chartPoints, setChartPoints] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  const fetchMarketData = async (currency) => {
    setLoading(true);
    setError('');
    try {
      const data = await coingeckoFetch('/coins/markets', {
        params: {
          vs_currency: currency,
          order: 'market_cap_desc',
          per_page: '100',
          page: '1',
          sparkline: 'false',
          price_change_percentage: '24h',
        },
      });
      setCoins(data);
      setSelectedCoinId((prev) => {
        if (prev && data.some((coin) => coin.id === prev)) {
          return prev;
        }
        return data[0]?.id || '';
      });
      const serverTimestamp = data.find((coin) => coin.last_updated)?.last_updated;
      setLastUpdated(serverTimestamp || new Date().toISOString());
      return data;
    } catch (fetchError) {
      if (fetchError?.name === 'AbortError') {
        return [];
      }
      setError(fetchError.message || 'An unexpected error occurred.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData(filters.currency);
  }, [filters.currency]);

  const fetchCoinDetail = async (coinId, currency, signal) => {
    setDetailLoading(true);
    setDetailError('');
    try {
      const [detailJson, chartJson] = await Promise.all([
        coingeckoFetch(`/coins/${coinId}`, {
          params: {
            localization: 'false',
            tickers: 'false',
            market_data: 'true',
            community_data: 'false',
            developer_data: 'false',
            sparkline: 'false',
            dex_pair_format: 'symbol',
          },
          signal,
        }),
        coingeckoFetch(`/coins/${coinId}/market_chart`, {
          params: {
            vs_currency: currency,
            days: '7',
          },
          signal,
        }),
      ]);

      const chartData = (chartJson?.prices || []).map(([timestamp, value]) => ({
        label: format(new Date(timestamp), 'MMM d'),
        value,
      }));

      setCoinDetail(detailJson);
      setChartPoints(chartData);
    } catch (fetchError) {
      if (fetchError?.name === 'AbortError') {
        return;
      }
      setDetailError(fetchError.message || 'An unexpected error occurred.');
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedCoinId) {
      return;
    }

    const controller = new AbortController();
    const { currency } = filters;

    setCoinDetail(null);
    setChartPoints([]);
    fetchCoinDetail(selectedCoinId, currency, controller.signal);

    return () => controller.abort();
  }, [selectedCoinId, filters.currency]);

  const handleFiltersSubmit = (nextFilters) => {
    setFilters(nextFilters);
  };

  const handleRefresh = async () => {
    await fetchMarketData(filters.currency);
    if (selectedCoinId) {
      await fetchCoinDetail(selectedCoinId, filters.currency);
    }
  };

  const get24hPriceChange = (coin) =>
    coin.price_change_percentage_24h_in_currency ??
    coin.price_change_percentage_24h ??
    0;

  const filteredCoins = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();
    const min = Number.isFinite(filters.minPrice) ? filters.minPrice : null;
    const max = Number.isFinite(filters.maxPrice) ? filters.maxPrice : null;
    const positiveOnly = filters.positiveChangeOnly;

    return coins
      .filter((coin) => {
        const matchesKeyword =
          keyword.length === 0 ||
          coin.name.toLowerCase().includes(keyword) ||
          coin.symbol.toLowerCase().includes(keyword);

        const matchesMin = min === null || coin.current_price >= min;
        const matchesMax = max === null || coin.current_price <= max;
        const matchesChange = !positiveOnly || get24hPriceChange(coin) > 0;
        return matchesKeyword && matchesMin && matchesMax && matchesChange;
      })
      .sort((a, b) => a.market_cap_rank - b.market_cap_rank);
  }, [coins, filters]);

  const handleSelectCoin = (coin) => {
    setSelectedCoinId(coin.id);
  };

  return (
    <div className="app">
      <Header onRefresh={handleRefresh} lastUpdated={lastUpdated} isRefreshing={loading} />

      <main>
        <SearchForm onSubmit={handleFiltersSubmit} defaultValues={filters} isLoading={loading} />

        <div className="content-grid">
          <div className="primary-pane">
            <DataTable
              coins={filteredCoins}
              onSelect={handleSelectCoin}
              currency={filters.currency}
              isLoading={loading}
              error={error}
            />
          </div>

          <div className="secondary-pane">
            <DetailCard
              coin={coinDetail}
              chartData={chartPoints}
              currency={filters.currency}
              isLoading={detailLoading}
              error={detailError}
            />
            <PortfolioCalculator coins={coins} currency={filters.currency} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
