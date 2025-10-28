import axios from 'axios';

const defaultBaseUrl =
  (import.meta.env.VITE_COINGECKO_API_BASE_URL ?? 'https://api.coingecko.com/api/v3').replace(/\/+$/, '');

const apiKey = import.meta.env.VITE_COINGECKO_API_KEY?.trim();
const isProEndpoint = defaultBaseUrl.includes('pro-api.coingecko.com');
const keyHeaderName = isProEndpoint ? 'x-cg-pro-api-key' : 'x-cg-demo-api-key';
const client = axios.create({
  baseURL: defaultBaseUrl,
  headers: apiKey
    ? {
        [keyHeaderName]: apiKey,
      }
    : undefined,
});

export const coingeckoFetch = async (path, { params, signal } = {}) => {
  const safePath = path.startsWith('/') ? path.slice(1) : path;

  try {
    const response = await client.get(safePath || '', { params, signal });
    return response.data;
  } catch (error) {
    if ((axios.isCancel && axios.isCancel(error)) || error.code === 'ERR_CANCELED') {
      throw error;
    }

    const status = error.response?.status;
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch CoinGecko data';

    const wrappedError = new Error(message);
    if (status) {
      wrappedError.status = status;
    }
    throw wrappedError;
  }
};

export const getCoingeckoConfig = () => ({
  baseUrl: defaultBaseUrl,
  isPro: isProEndpoint,
  hasApiKey: Boolean(apiKey),
});
