import React, { useState, useMemo } from 'react';
import pricingData from '../data/pricing-june.json';

const PRICING = pricingData['pricing-june'];

export default function LocalPricingChart({ city, serviceTitle, serviceId = 'carpet_cleaning', basePrice, discountCode = '' }) {
  const servicePricing = PRICING[serviceId];

  // Dynamic sqft range options
  const sqFtOptions = useMemo(() => {
    if (!servicePricing) return [];
    if (serviceId === 'carpet_cleaning') {
      return ['Under 500', '501 - 800', '801 - 1200', '1201 - 1700', '1701 - 2300'];
    }
    if (servicePricing.per_sqft && servicePricing.per_sqft.ranges) {
      return servicePricing.per_sqft.ranges.map((r) => r.range);
    }
    return [];
  }, [serviceId, servicePricing]);

  const [sqFtRange, setSqFtRange] = useState(() => {
    if (serviceId === 'carpet_cleaning') return '801 - 1200';
    if (servicePricing?.per_sqft?.ranges) {
      const len = servicePricing.per_sqft.ranges.length;
      return servicePricing.per_sqft.ranges[Math.floor(len / 2)]?.range || '';
    }
    return '';
  });

  const layoutOptions = useMemo(() => {
    if (!servicePricing) return [];
    if (serviceId === 'move_in_ready' && servicePricing.per_room) {
      return Object.keys(servicePricing.per_room).map((key) => {
        const parts = key.split('_');
        const beds = parts[0];
        const baths = parts[2];
        const label = `${beds} Bed${Number(beds) > 1 ? 's' : ''}, ${baths} Bath${Number(baths) > 1 ? 's' : ''}`;
        return { key, label };
      });
    }
    return [];
  }, [serviceId, servicePricing]);

  const [selectedLayout, setSelectedLayout] = useState(() => {
    if (serviceId === 'move_in_ready' && servicePricing?.per_room) {
      return Object.keys(servicePricing.per_room)[0] || '';
    }
    return '';
  });

  // Sync state if serviceId changes
  const [prevServiceId, setPrevServiceId] = useState(serviceId);
  if (serviceId !== prevServiceId) {
    setPrevServiceId(serviceId);
    if (serviceId === 'carpet_cleaning') {
      setSqFtRange('801 - 1200');
      setSelectedLayout('');
    } else if (servicePricing?.per_sqft?.ranges) {
      const len = servicePricing.per_sqft.ranges.length;
      setSqFtRange(servicePricing.per_sqft.ranges[Math.floor(len / 2)]?.range || '');
      setSelectedLayout('');
    } else if (serviceId === 'move_in_ready' && servicePricing?.per_room) {
      setSqFtRange('');
      setSelectedLayout(Object.keys(servicePricing.per_room)[0] || '');
    } else {
      setSqFtRange('');
      setSelectedLayout('');
    }
  }

  // Compute calculated rate based on pricing-june.json
  const total = useMemo(() => {
    if (!servicePricing) return basePrice;

    const minPrice = servicePricing.minimum;

    // 1. If service has per_sqft ranges (deep_cleaning, home_detailing, one_time_maid_services, window_washing)
    if (servicePricing.per_sqft && servicePricing.per_sqft.ranges) {
      const rangeObj = servicePricing.per_sqft.ranges.find((r) => r.range === sqFtRange)
        || servicePricing.per_sqft.ranges[0];
      
      const baseRangePrice = rangeObj ? rangeObj.normal : minPrice;
      return Math.max(minPrice, baseRangePrice);
    }

    // 2. If service is carpet_cleaning
    if (serviceId === 'carpet_cleaning') {
      let sqft = 1000;
      if (sqFtRange === 'Under 500') sqft = 400;
      else if (sqFtRange === '501 - 800') sqft = 650;
      else if (sqFtRange === '801 - 1200') sqft = 1000;
      else if (sqFtRange === '1201 - 1700') sqft = 1450;
      else if (sqFtRange === '1701 - 2300') sqft = 2000;

      const rate = servicePricing.per_sqft?.conditions?.normal || 0.38;
      const calculated = sqft * rate;
      return Math.max(minPrice, calculated);
    }

    // 3. If service is move_in_ready
    if (serviceId === 'move_in_ready') {
      const baseRoomPrice = servicePricing.per_room?.[selectedLayout] || minPrice;
      return Math.max(minPrice, baseRoomPrice);
    }

    return basePrice;
  }, [serviceId, servicePricing, sqFtRange, selectedLayout, basePrice]);

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
        {sqFtOptions.length > 0 && (
          <div className="calculator-group">
            <label>Estimated Home Size (Sq. Ft.)</label>
            <div className="calculator-selector" style={{ gridTemplateColumns: `repeat(${sqFtOptions.length}, 1fr)` }}>
              {sqFtOptions.map((range) => (
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
        )}

        {/* Room Layout configurations (Move In Ready) */}
        {layoutOptions.length > 0 && (
          <div className="calculator-group">
            <label>Select Home Layout</label>
            <div className="calculator-selector" style={{ gridTemplateColumns: `repeat(${layoutOptions.length}, 1fr)` }}>
              {layoutOptions.map((layout) => (
                <button
                  key={layout.key}
                  type="button"
                  className={`selector-btn ${selectedLayout === layout.key ? 'is-active' : ''}`}
                  onClick={() => setSelectedLayout(layout.key)}
                >
                  {layout.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result Area */}
        <div className="local-pricing-chart__result-container" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', margin: '1.5rem 0' }}>
          <div className="local-pricing-chart__result" style={{ width: '100%' }}>
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

        {/* Disclaimer Area */}
        <div className="local-pricing-chart__disclaimer">
          <p>
            *Disclaimer: This is an estimated price based on standard conditions and is not an exact quote. Actual pricing may vary depending on soil level, layout complexities, and service details. You must call us or submit a service request for a final, firm quote.
          </p>
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
        }

        .local-pricing-chart__disclaimer {
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: 1px dashed #cbd5e1;
        }

        .local-pricing-chart__disclaimer p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.6;
          color: #64748b;
          font-style: italic;
          text-align: left;
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
