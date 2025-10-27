import { useShoppingCart } from "../../../context/ShoppingCartContext";
import "../../../styles/pricing/shopping-cart/scroll-steps/your-quote.css";

export default function YourQuote() {
  const { activeServices, activeExtras, initialCleaning, frequencyDiscount, bundleDiscount, totalPrice } = useShoppingCart();

  return (
    <div className="quote-container">
      <div className="quote-header">
        <p>YOUR QUOTE</p>
      </div>

      {activeServices.length > 0 ? (
        activeServices.map((service) => (
          <div key={service.id}>
            <div className="quote-line service-line">
              <div className="quote-service">
                <p>{service.name}</p>
                <p>${service.price.toFixed(2)}</p>
              </div>
            </div>

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

      {initialCleaning && (
        <div className="quote-line initial-cleaning-line">
          <div className="quote-service">
            <p>{initialCleaning.name}</p>
            <p>${initialCleaning.price.toFixed(2)}</p>
          </div>
        </div>
      )}

      {frequencyDiscount > 0 && (
        <div className="quote-line discount-line">
          <div className="bundle-discount">
            <p>Frequency Discount</p>
            <p>- ${frequencyDiscount.toFixed(2)}</p>
          </div>
        </div>
      )}

      {bundleDiscount > 0 && (
        <div className="quote-line discount-line">
          <div className="bundle-discount">
            <p>Bundle Discount</p>
            <p>- ${bundleDiscount.toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="quote-line total-line">
        <div className="quote-total">
          <p>Estimated Total</p>
          <p>${totalPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
