import { useEffect, useState } from 'react';
import './SearchForm.css';

const SUPPORTED_CURRENCIES = [
  { value: 'usd', label: 'USD' },
  { value: 'eur', label: 'EUR' },
  { value: 'idr', label: 'IDR' },
  { value: 'sol', label: 'SOL' },
];

const initialState = {
  keyword: '',
  minPrice: '',
  maxPrice: '',
  currency: 'usd',
  positiveChangeOnly: false,
};

const SearchForm = ({ onSubmit, defaultValues = initialState, isLoading = false }) => {
  const [formValues, setFormValues] = useState(initialState);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setFormValues((prev) => ({ ...prev, ...defaultValues }));
  }, [defaultValues]);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError('');

    const min = parseFloat(formValues.minPrice);
    const max = parseFloat(formValues.maxPrice);

    if (formValues.minPrice && formValues.maxPrice && min > max) {
      setFormError('Minimum price cannot be greater than maximum price.');
      return;
    }

    onSubmit({
      ...formValues,
      minPrice: formValues.minPrice ? Number(formValues.minPrice) : '',
      maxPrice: formValues.maxPrice ? Number(formValues.maxPrice) : '',
    });
  };

  return (
    <section className="search-form-wrapper">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label htmlFor="keyword">
            Search Coin
            <input
              id="keyword"
              name="keyword"
              type="text"
              value={formValues.keyword}
              onChange={handleChange}
              placeholder="e.g. Bitcoin"
              pattern="^[A-Za-z0-9\\s-]{0,30}$"
            />
          </label>

          <label htmlFor="minPrice">
            Min Price (USD)
            <input
              id="minPrice"
              name="minPrice"
              type="number"
              min="0"
              step="0.01"
              value={formValues.minPrice}
              onChange={handleChange}
              placeholder="0"
              inputMode="decimal"
            />
          </label>

          <label htmlFor="maxPrice">
            Max Price (USD)
            <input
              id="maxPrice"
              name="maxPrice"
              type="number"
              min="0"
              step="0.01"
              value={formValues.maxPrice}
              onChange={handleChange}
              placeholder="No limit"
              inputMode="decimal"
            />
          </label>

          <label htmlFor="currency">
            Currency
            <select
              id="currency"
              name="currency"
              value={formValues.currency}
              onChange={handleChange}
              required
            >
              {SUPPORTED_CURRENCIES.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </label>

          <label className="checkbox-field" htmlFor="positiveChangeOnly">
            <input
              id="positiveChangeOnly"
              name="positiveChangeOnly"
              type="checkbox"
              checked={formValues.positiveChangeOnly}
              onChange={handleChange}
            />
            <span>Only show coins with positive 24h change</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary" disabled={isLoading}>
            {isLoading ? 'Filtering…' : 'Apply Filters'}
          </button>
          {formError && <p className="form-error" role="alert">{formError}</p>}
        </div>
      </form>
    </section>
  );
};

export default SearchForm;
