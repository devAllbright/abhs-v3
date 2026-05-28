import React, { useState, useMemo } from 'react';

const BEDROOM_INCREMENT = 25;
const BATHROOM_INCREMENT = 25;

export default function LocalPricingChart({ city, serviceTitle, basePrice, discountCode = '' }) {
  const [sqFtRange, setSqFtRange] = useState('1500-2500');
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [includeEcoProducts, setIncludeEcoProducts] = useState(true);

  // Compute calculated rate
  const total = useMemo(() => {
    // Base adjustment by sq ft range
    let sqFtAdjustment = 0;
    if (sqFtRange === '900-1500') sqFtAdjustment = -30;
    if (sqFtRange === '2500-3500') sqFtAdjustment = 60;
    if (sqFtRange === '3500+') sqFtAdjustment = 120;

    const extraBedrooms = Math.max(0, bedrooms - 2) * BEDROOM_INCREMENT;
    const extraBathrooms = Math.max(0, bathrooms - 1.5) * BATHROOM_INCREMENT;
    const ecoFee = includeEcoProducts ? 0 : -10; // eco products are default and free/discounted

    const calculated = basePrice + sqFtAdjustment + extraBedrooms + extraBathrooms + ecoFee;
    return Math.max(basePrice - 40, calculated);
  }, [basePrice, sqFtRange, bedrooms, bathrooms, includeEcoProducts]);

  return (
    <div className="local-pricing-chart">
      <div className="local-pricing-chart__calculator">
        <h3 className="local-pricing-chart__calc-title">
          Interactive pricing for <span>{city}</span>
        </h3>
        <p className="local-pricing-chart__calc-subtitle">
          Estimate your customized {serviceTitle} rate below.
        </p>

        {/* Home Size Selector */}
        <div className="calculator-group">
          <label>Estimated Home Size (Sq. Ft.)</label>
          <div className="calculator-selector">
            {['900-1500', '1500-2500', '2500-3500', '3500+'].map((range) => (
              <button
                key={range}
                type="button"
                className={`selector-btn ${sqFtRange === range ? 'is-active' : ''}`}
                onClick={() => setSqFtRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="calculator-row">
          <div className="calculator-group">
            <label>Bedrooms</label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(Number(e.target.value))}
              className="calculator-select"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} Bed{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="calculator-group">
            <label>Bathrooms</label>
            <select
              value={bathrooms}
              onChange={(e) => setBathrooms(Number(e.target.value))}
              className="calculator-select"
            >
              {[1, 1.5, 2, 2.5, 3, 3.5, 4].map((num) => (
                <option key={num} value={num}>
                  {num} Bath{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Addons */}
        <div className="calculator-checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeEcoProducts}
              onChange={(e) => setIncludeEcoProducts(e.target.checked)}
            />
            <span>Use Eco-Friendly green cleaning formulas (Recommended)</span>
          </label>
        </div>

        {/* Result Area */}
        <div className="local-pricing-chart__result">
          <div className="result-price">
            <span className="price-tag">${total}</span>
            <span className="price-period">Est. Total</span>
          </div>
          {discountCode && (
            <div className="discount-notice">
              🎉 Use code <strong>{discountCode}</strong> at booking for local savings!
            </div>
          )}
        </div>
      </div>

      <style>{`
        .local-pricing-chart {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 3.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
          width: 100%;
          max-width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: 'Lato', sans-serif;
        }

        .local-pricing-chart__calculator {
          display: flex;
          flex-direction: column;
          height: 100%;
          flex-grow: 1;
        }

        .local-pricing-chart__calc-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
          text-align: center;
        }

        .local-pricing-chart__calc-title span {
          color: #299c36;
        }

        .local-pricing-chart__calc-subtitle {
          font-size: 1.3rem;
          color: #64748b;
          text-align: center;
          margin: 0 0 2.5rem 0;
        }

        .calculator-group {
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .calculator-group label {
          font-size: 1.25rem;
          font-weight: 700;
          color: #475569;
        }

        .calculator-selector {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }

        .selector-btn {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem 0.6rem;
          font-size: 1.15rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .selector-btn:hover {
          background: #e2e8f0;
        }

        .selector-btn.is-active {
          background: #299c36;
          border-color: #299c36;
          color: white;
        }

        .calculator-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .calculator-select {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          font-size: 1.25rem;
          color: #1e293b;
          outline: none;
          cursor: pointer;
          font-family: inherit;
        }

        .calculator-checkbox-group {
          margin-top: 2rem;
          margin-bottom: 2.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          cursor: pointer;
          font-size: 1.2rem;
          color: #475569;
          user-select: none;
        }

        .checkbox-label input {
          width: 22px;
          height: 22px;
          accent-color: #299c36;
          cursor: pointer;
        }

        .local-pricing-chart__result {
          background: #f8fafc;
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid #f1f5f9;
          text-align: center;
          margin-top: auto;
        }

        .result-price {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0.6rem;
          margin-bottom: 0.75rem;
        }

        .price-tag {
          font-size: 3.5rem;
          font-weight: 800;
          color: #299c36;
        }

        .price-period {
          font-size: 1.3rem;
          color: #64748b;
          font-weight: 600;
        }

        .discount-notice {
          font-size: 1.1rem;
          color: #16a34a;
          background: rgba(22, 163, 74, 0.08);
          padding: 0.6rem 1.2rem;
          border-radius: 9999px;
          display: inline-block;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
