const defaultBaseUrl =
  (import.meta.env.VITE_COINGECKO_API_BASE_URL ?? 'https://api.coingecko.com/api/v3').replace(/\/+$/, '');

const apiKey = import.meta.env.VITE_COINGECKO_API_KEY?.trim();

const isProEndpoint = defaultBaseUrl.includes('pro-api.coingecko.com');
const keyHeaderName = isProEndpoint ? 'x-cg-pro-api-key' : 'x-cg-demo-api-key';

const buildUrl = (path, params = {}) => {
  const safePath = path.startsWith('/') ? path.slice(1) : path;
  const url = new URL(`${defaultBaseUrl}/${safePath}`);
  const searchParams = new URLSearchParams(url.search);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null) {
          searchParams.append(key, String(item));
        }
      });
    } else {
      searchParams.append(key, String(value));
    }
  });

  url.search = searchParams.toString();
  return url.toString();
};

export const coingeckoFetch = async (path, { params, signal } = {}) => {
  const url = buildUrl(path, params);

  const headers = apiKey
    ? {
        [keyHeaderName]: apiKey,
      }
    : undefined;

  const response = await fetch(url, { headers, signal });

  if (!response.ok) {
    let message = `Failed to fetch CoinGecko data (${response.status})`;

    try {
      const errorBody = await response.json();
      if (errorBody?.error) {
        message = errorBody.error;
      } else if (errorBody?.message) {
        message = errorBody.message;
      }
    } catch {
      const text = await response.text().catch(() => '');
      if (text) {
        message = text;
      }
    }

    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.json();
};

export const getCoingeckoConfig = () => ({
  baseUrl: defaultBaseUrl,
  isPro: isProEndpoint,
  hasApiKey: Boolean(apiKey),
});
