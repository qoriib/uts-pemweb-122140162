const FALLBACK_LARGE_THRESHOLD = 1;
const FALLBACK_SMALL_THRESHOLD = 0.01;

const getFractionDigits = (value) => {
  if (Number.isNaN(value)) {
    return { minimumFractionDigits: 0, maximumFractionDigits: 0 };
  }

  if (Math.abs(value) >= FALLBACK_LARGE_THRESHOLD) {
    return { minimumFractionDigits: 0, maximumFractionDigits: 2 };
  }

  if (Math.abs(value) >= FALLBACK_SMALL_THRESHOLD) {
    return { minimumFractionDigits: 0, maximumFractionDigits: 4 };
  }

  return { minimumFractionDigits: 0, maximumFractionDigits: 6 };
};

export const formatCurrencyValue = (value, currency, options = {}) => {
  if (value === null || value === undefined) {
    return '—';
  }

  const upperCurrency = currency?.toUpperCase() ?? '';
  const digits = {
    ...getFractionDigits(value),
    ...options,
  };

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: upperCurrency,
      ...digits,
    }).format(value);
  } catch {
    const formatted = Number(value).toLocaleString('en-US', digits);
    return `${formatted} ${upperCurrency}`;
  }
};

export const createCurrencyFormatter = (currency, options) => (value) =>
  formatCurrencyValue(value, currency, options);

export const formatPercentageValue = (value, options = {}) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }

  const formatted = Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  });

  return `${value > 0 ? '+' : ''}${formatted}%`;
};
