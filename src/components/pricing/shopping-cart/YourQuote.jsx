import { useShoppingCart } from "../../../context/ShoppingCartContext";
import recurringPrices from "../../../data/recurringPrices.json";
import "../../../styles/pricing/shopping-cart/scroll-steps/your-quote.css";

export default function YourQuote() {
  const { cartData } = useShoppingCart();
  const { selectedServiceType, selectedFrequency, squareFootage, extras } = cartData;
  const { serviceName, priceTiers, globalExtras } = recurringPrices;

  if (!selectedServiceType || !selectedFrequency || !squareFootage) {
    return (
      <div className="quote-container">
        <div className="quote-header">
          <p>YOUR QUOTE</p>
        </div>
        <p className="no-services">No services selected yet</p>
      </div>
    );
  }

  const selectedTier = priceTiers.find((tier) => tier.sqftRange === squareFootage);
  const basePrice = selectedTier ? selectedTier.minimum : 0;

  const activeExtras = Object.entries(extras)
    .filter(([_, isActive]) => isActive)
    .map(([key]) => ({
      name: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^\w/, (c) => c.toUpperCase()),
      price: globalExtras[`${key}Price`] || 0
    }));

  const discount =
    selectedFrequency === "Weekly"
      ? globalExtras.weeklyDiscount
      : selectedFrequency === "Bi-Weekly"
      ? globalExtras.biMonthlyDiscount
      : globalExtras.monthlyDiscount;

  const extrasTotal = activeExtras.reduce((sum, e) => sum + e.price, 0);
  const subtotal = basePrice + extrasTotal;
  const discountedTotal = subtotal * (1 - discount);
  const discountAmount = subtotal - discountedTotal;

  return (
    <div className="quote-container">
      <div className="quote-header">
        <p>YOUR QUOTE</p>
      </div>

      <div className="quote-line service-line">
        <div className="quote-service">
          <p>{serviceName}</p>
          <p>${basePrice.toFixed(2)}</p>
        </div>
      </div>

      {activeExtras.map((extra, i) => (
        <div key={i} className="quote-line discount-line">
          <div className="quote-service extras-line">
            <p className="extra-text">+ {extra.name}</p>
            <p className="extra-text">${extra.price.toFixed(2)}</p>
          </div>
        </div>
      ))}

      {discount > 0 && (
        <div className="quote-line discount-line">
          <div className="bundle-discount">
            <p>{selectedFrequency} Discount</p>
            <p>- ${discountAmount.toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="quote-line total-line">
        <div className="quote-total">
          <p>Estimated Total</p>
          <p>${discountedTotal.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
