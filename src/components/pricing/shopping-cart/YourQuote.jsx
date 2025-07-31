import { useShoppingCart } from "../../../context/ShoppingCartContext";
import "../../../styles/pricing/shopping-cart/scroll-steps/your-quote.css";

export default function YourQuote() {
  const { activeServices, activeExtras, initialCleaning, frequencyDiscount, bundleDiscount, totalPrice } = useShoppingCart();

  return (
    <div className="quote-container">
      <div className="quote-header">
        <p>YOUR QUOTE</p>
      </div>

      {/* Service Lines */}
      {activeServices.length > 0 ? (
        activeServices.map((service) => (
          <div key={service.id}>
            <div className="quote-line service-line">
              <div className="quote-service">
                <p>{service.name}</p>
                <p>${service.price.toFixed(2)}</p>
              </div>
            </div>

            {/* ✅ Extras for Each Service - Ensure they are displayed correctly */}
            {activeExtras[service.id] && activeExtras[service.id].length > 0 && (
              activeExtras[service.id].map((extra) => (
                <div key={extra.id} className="quote-line discount-line">
                  <div className="quote-service extras-line">
                    <p className="extra-text">+ {extra.name}</p>
                    <p className="extra-text">${extra.price.toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        ))
      ) : (
        <p className="no-services">No services selected</p>
      )}

      {/* Initial Cleaning Line */}
      {initialCleaning && (
        <div className="quote-line initial-cleaning-line">
          <div className="quote-service">
            <p>{initialCleaning.name}</p>
            <p>${initialCleaning.price.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Frequency Discount Line - Now properly displayed */}
      {frequencyDiscount > 0 && (
        <div className="quote-line discount-line">
          <div className="bundle-discount">
            <p>Frequency Discount</p>
            <p>- ${frequencyDiscount.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Bundle Discount Line */}
      {bundleDiscount > 0 && (
        <div className="quote-line discount-line">
          <div className="bundle-discount">
            <p>Bundle Discount</p>
            <p>- ${bundleDiscount.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Total Line */}
      <div className="quote-line total-line">
        <div className="quote-total">
          <p>Estimated Total</p>
          <p>${totalPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
