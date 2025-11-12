import { useShoppingCart } from "../../../context/ShoppingCartContext";
import { calculateRecurringPrice, getTierBySqft } from "../../../helpers";
import recurringPrices from "../../../data/recurringPrices.json";
import "../../../styles/pricing/shopping-cart/scroll-steps/your-quote.css";

export default function YourQuote() {
  const { cartData } = useShoppingCart();

  const {
    selectedServiceType,
    selectedFrequency,
    squareFootage,
    bedroomNumber,
    bathroomNumber,
    hadProServices,
    extras = {},
  } = cartData;

  if (!selectedServiceType || !squareFootage) {
    return (
      <div className="quote-container">
        <div className="quote-header">
          <p>YOUR QUOTE</p>
        </div>
        <p className="no-services">No services selected yet</p>
      </div>
    );
  }

  const { serviceName, globalExtras } = recurringPrices;
  const tier = getTierBySqft(recurringPrices, Number(squareFootage) || 0);
  if (!tier) return null;

  const activeExtras = Object.entries(extras)
    .filter(([_, v]) => (typeof v === "boolean" ? v : v > 0))
    .map(([key, value]) => ({
      key,
      name: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^\w/, (c) => c.toUpperCase()),
      price:
        (globalExtras[`${key}Price`] || 0) *
        (typeof value === "number" ? value : 1),
    }));

  const maidExtras = activeExtras.filter(
    (e) => !["insideOven", "insideRefrigerator"].includes(e.key)
  );
  const cleaningExtras = activeExtras.filter((e) =>
    ["insideOven", "insideRefrigerator"].includes(e.key)
  );

  const maidExtrasTotal = maidExtras.reduce((sum, e) => sum + e.price, 0);
  const cleaningExtrasTotal = cleaningExtras.reduce((sum, e) => sum + e.price, 0);

  const baseMaid = tier.minimum ?? 0;
  const baseInitial = tier.initialCleaning ?? 0;

  const discountValue =
    selectedFrequency === "Weekly"
      ? globalExtras.weeklyDiscount
      : selectedFrequency === "Bi-Weekly"
      ? globalExtras.biMonthlyDiscount
      : globalExtras.monthlyDiscount;

  const maidSubtotal =
    (baseMaid + maidExtrasTotal) * (1 - (discountValue || 0));
  const cleaningSubtotal = baseInitial + cleaningExtrasTotal;

  const discountLabel = `${selectedFrequency} Discount`;
  const discountAmount = (baseMaid + maidExtrasTotal) * (discountValue || 0);

  const finalTotal = maidSubtotal + cleaningSubtotal;

  return (
    <div className="quote-container">
      <div className="quote-header">
        <p>YOUR QUOTE</p>
      </div>

      {/* 🧩 Maid Services Section */}
      <div className="quote-line service-line">
        <div className="quote-service">
          <p>{serviceName}</p>
          <p>${baseMaid.toFixed(2)}</p>
        </div>
      </div>

      {maidExtras.map((extra) => (
        <div key={extra.key} className="quote-line discount-line">
          <div className="quote-service extras-line">
            <p className="extra-text">+ {extra.name}</p>
            <p className="extra-text">${extra.price.toFixed(2)}</p>
          </div>
        </div>
      ))}

      {discountValue > 0 && (
        <div className="quote-line discount-line">
          <div className="quote-service extras-line">
            <p className="extra-text">- {discountLabel}</p>
            <p className="extra-text">-${discountAmount.toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="quote-line subtotal-line">
        <div className="quote-total">
          <p>Subtotal (Maid Services)</p>
          <p>${maidSubtotal.toFixed(2)}</p>
        </div>
      </div>

      {/* 🧩 Initial Cleaning Section (if hadProServices = false) */}
      {!hadProServices && (
        <>
          <div className="quote-line service-line">
            <div className="quote-service">
              <p>Initial Cleaning</p>
              <p>${baseInitial.toFixed(2)}</p>
            </div>
          </div>

          {cleaningExtras.map((extra) => (
            <div key={extra.key} className="quote-line discount-line">
              <div className="quote-service extras-line">
                <p className="extra-text">+ {extra.name}</p>
                <p className="extra-text">${extra.price.toFixed(2)}</p>
              </div>
            </div>
          ))}

          <div className="quote-line subtotal-line">
            <div className="quote-total">
              <p>Subtotal (Initial Cleaning)</p>
              <p>${cleaningSubtotal.toFixed(2)}</p>
            </div>
          </div>
        </>
      )}

      {/* 🧩 Show Total only when hadProServices = true */}
      {hadProServices && (
        <div className="quote-line total-line">
          <div className="quote-total">
            <p>Estimated Total</p>
            <p>${maidSubtotal.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
