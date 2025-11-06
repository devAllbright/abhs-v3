import { useEffect, useState } from "react";
import { useShoppingCart } from "../../../context/ShoppingCartContext";
import { calculateRecurringPrice, getTierBySqft } from "../../../helpers/recurringCalculations";
import recurringPrices from "../../../data/recurringPrices.json";
import "../../../styles/pricing/shopping-cart/scroll-steps/your-quote.css";

export default function YourQuote() {
  const { cartData } = useShoppingCart();
  const [quoteData, setQuoteData] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = JSON.parse(sessionStorage.getItem("cartData")) || {};
      const extras = stored.extras || {};
      const tier = getTierBySqft(Number(stored.squareFootage || 0));
      const total = calculateRecurringPrice({
        houseSize: Number(stored.squareFootage || 0),
        bedrooms: stored.bedroomNumber || 0,
        bathrooms: stored.bathroomNumber || 0,
        hadProServices: stored.hadProServices || false,
        extras
      });
      setQuoteData({ ...stored, tier, total, extras });
    }
  }, [cartData]);

  if (!quoteData)
    return (
      <div className="quote-container">
        <div className="quote-header">
          <p>YOUR QUOTE</p>
        </div>
        <p className="no-services">No services selected yet</p>
      </div>
    );

  const { hadProServices, selectedFrequency, extras = {}, tier, total } = quoteData;
  const { serviceName, globalExtras } = recurringPrices;

  const activeExtras = Object.entries(extras)
    .filter(([_, isActive]) => isActive || (typeof isActive === "number" && isActive > 0))
    .map(([key, value]) => ({
      key,
      name: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^\w/, (c) => c.toUpperCase()),
      price: globalExtras[`${key}Price`] * (typeof value === "number" ? value : 1)
    }));

  const cleaningExtras = hadProServices
    ? activeExtras.filter((e) => !["insideOven", "insideRefrigerator"].includes(e.key))
    : activeExtras.filter((e) => ["insideOven", "insideRefrigerator"].includes(e.key));

  const maidExtras = hadProServices
    ? cleaningExtras
    : activeExtras.filter((e) => !["insideOven", "insideRefrigerator"].includes(e.key));

  const discount =
    selectedFrequency === "Weekly"
      ? globalExtras.weeklyDiscount
      : selectedFrequency === "Bi-Weekly"
      ? globalExtras.biMonthlyDiscount
      : globalExtras.monthlyDiscount;

  const discountedTotal = total * (1 - discount);

  return (
    <div className="quote-container">
      <div className="quote-header">
        <p>YOUR QUOTE</p>
      </div>

      <div className="quote-line service-line">
        <div className="quote-service">
          <p>{serviceName}</p>
          <p>${hadProServices ? tier.minimum.toFixed(2) : tier.initialCleaning.toFixed(2)}</p>
        </div>
      </div>

      {maidExtras.map((extra, i) => (
        <div key={i} className="quote-line discount-line">
          <div className="quote-service extras-line">
            <p className="extra-text">+ {extra.name}</p>
            <p className="extra-text">${extra.price.toFixed(2)}</p>
          </div>
        </div>
      ))}

      {!hadProServices && (
        <div className="quote-line service-line">
          <div className="quote-service">
            <p>Initial Cleaning</p>
            <p>${tier.initialCleaning.toFixed(2)}</p>
          </div>
        </div>
      )}

      {!hadProServices &&
        cleaningExtras.map((extra, i) => (
          <div key={i} className="quote-line discount-line">
            <div className="quote-service extras-line">
              <p className="extra-text">+ {extra.name}</p>
              <p className="extra-text">${extra.price.toFixed(2)}</p>
            </div>
          </div>
        ))}

      {hadProServices && (
        <div className="quote-line total-line">
          <div className="quote-total">
            <p>Estimated Total</p>
            <p>${discountedTotal.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
