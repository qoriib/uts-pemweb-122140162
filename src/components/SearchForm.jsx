import { useEffect, useState } from "react";

const SUPPORTED_CURRENCIES = [
  { value: "usd", label: "USD" },
  { value: "eur", label: "EUR" },
  { value: "idr", label: "IDR" },
  { value: "sol", label: "SOL" },
];

const initialState = {
  keyword: "",
  minPrice: "",
  maxPrice: "",
  currency: "usd",
  positiveChangeOnly: false,
};

const SearchForm = ({
  onSubmit,
  defaultValues = initialState,
  isLoading = false,
}) => {
  const [formValues, setFormValues] = useState(initialState);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setFormValues((prev) => ({ ...prev, ...defaultValues }));
  }, [defaultValues]);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");

    const min = parseFloat(formValues.minPrice);
    const max = parseFloat(formValues.maxPrice);

    if (formValues.minPrice && formValues.maxPrice && min > max) {
      setFormError("Minimum price cannot be greater than maximum price.");
      return;
    }

    onSubmit({
      ...formValues,
      minPrice: formValues.minPrice ? Number(formValues.minPrice) : "",
      maxPrice: formValues.maxPrice ? Number(formValues.maxPrice) : "",
    });
  };

  const currencyLabel = formValues.currency.toUpperCase();

  return (
    <section className="card">
      <div className="card-body">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-12 col-md-6 col-lg-3">
            <label htmlFor="keyword" className="form-label">
              Search Coin
            </label>
            <input
              id="keyword"
              name="keyword"
              className="form-control"
              type="text"
              value={formValues.keyword}
              onChange={handleChange}
              placeholder="e.g. Bitcoin"
              pattern="^[A-Za-z0-9\\s-]{0,30}$"
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-2">
            <label htmlFor="minPrice" className="form-label">
              Min Price ({currencyLabel})
            </label>
            <input
              id="minPrice"
              name="minPrice"
              className="form-control"
              type="number"
              min="0"
              step="0.01"
              value={formValues.minPrice}
              onChange={handleChange}
              placeholder="0"
              inputMode="decimal"
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-2">
            <label htmlFor="maxPrice" className="form-label">
              Max Price ({currencyLabel})
            </label>
            <input
              id="maxPrice"
              name="maxPrice"
              className="form-control"
              type="number"
              min="0"
              step="0.01"
              value={formValues.maxPrice}
              onChange={handleChange}
              placeholder="No limit"
              inputMode="decimal"
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-2">
            <label htmlFor="currency" className="form-label">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              className="form-select"
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
          </div>
          <div className="col-12 col-lg-3">
            <div className="form-check mt-lg-4">
              <input
                id="positiveChangeOnly"
                name="positiveChangeOnly"
                className="form-check-input"
                type="checkbox"
                checked={formValues.positiveChangeOnly}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="positiveChangeOnly">
                Only show coins with positive 24h change
              </label>
            </div>
          </div>
          <div className="col-12 col-sm-auto">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? "Filtering…" : "Apply Filters"}
            </button>
          </div>
          {formError && (
            <div className="col-12">
              <div className="text-danger small" role="alert">
                {formError}
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default SearchForm;
