import { useShoppingCart } from "../../../context/ShoppingCartContext";
import { calculateRecurringPrice, getTierBySqft } from "../../../helpers/recurringCalculations";
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
    extras = {}
  } = cartData;

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

  const { serviceName, globalExtras } = recurringPrices;
  const tier = getTierBySqft(Number(squareFootage) || 0);

  const baseCalcTotal = calculateRecurringPrice({
    houseSize: Number(squareFootage) || 0,
    bedrooms: bedroomNumber || 0,
    bathrooms: bathroomNumber || 0,
    hadProServices: !!hadProServices,
    extras
  });

  const activeExtras = Object.entries(extras)
    .filter(([_, value]) => {
      if (typeof value === "boolean") return value === true;
      if (typeof value === "number") return value > 0;
      return false;
    })
    .map(([key, value]) => ({
      key,
      name: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^\w/, (c) => c.toUpperCase()),
      price:
        (globalExtras[`${key}Price`] || 0) *
        (typeof value === "number" ? value : 1)
    }));

  const maidExtras = activeExtras.filter(
    (e) => !["insideOven", "insideRefrigerator"].includes(e.key)
  );
  const cleaningExtras = activeExtras.filter((e) =>
    ["insideOven", "insideRefrigerator"].includes(e.key)
  );

  const maidExtrasTotal = maidExtras.reduce((sum, e) => sum + e.price, 0);
  const cleaningExtrasTotal = cleaningExtras.reduce((sum, e) => sum + e.price, 0);

  const baseMaid = tier.minimum;
  const baseInitial = tier.initialCleaning;

  const maidSubtotal = baseMaid + maidExtrasTotal;
  const cleaningSubtotal = baseInitial + cleaningExtrasTotal;

  const discount =
    selectedFrequency === "Weekly"
      ? globalExtras.weeklyDiscount
      : selectedFrequency === "Bi-Weekly"
      ? globalExtras.biMonthlyDiscount
      : globalExtras.monthlyDiscount;

  let finalTotal;
  if (hadProServices) {
    finalTotal = maidSubtotal * (1 - (discount || 0));
  } else {
    finalTotal = maidSubtotal * (1 - (discount || 0)) + cleaningSubtotal;
  }

  return (
    <div className="quote-container">
      <div className="quote-header">
        <p>YOUR QUOTE</p>
      </div>

      <div className="quote-line service-line">
        <div className="quote-service">
          <p>{serviceName}</p>
          <p>${tier.minimum.toFixed(2)}</p>
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

      {!hadProServices && (
        <>
          <div className="quote-line service-line">
            <div className="quote-service">
              <p>Initial Cleaning</p>
              <p>${tier.initialCleaning.toFixed(2)}</p>
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
        </>
      )}

      {hadProServices && (
        <div className="quote-line total-line">
          <div className="quote-total">
            <p>Estimated Total</p>
            <p>${finalTotal.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
