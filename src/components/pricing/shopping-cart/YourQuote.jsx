import { useShoppingCart } from "../../../context/ShoppingCartContext";
import "../../../styles/pricing/shopping-cart/scroll-steps/your-quote.css";

export default function YourQuote() {
  const { cartData } = useShoppingCart();
  const { priceBreakdown } = cartData;

  if (!priceBreakdown) {
    return (
      <div className="quote-container">
        <div className="quote-header"><p>YOUR QUOTE</p></div>
        <p className="no-services">No services selected yet</p>
      </div>
    );
  }

  const {
    serviceName,
    frequency,
    base,
    extrasList,
    discountAmount,
    final,
    additionalBlocks
  } = priceBreakdown;

  const renderBlock = (label, basePrice, extrasList, discountAmount, finalPrice, frequencyLabel) => (
    <>
      <div className="quote-line service-line">
        <div className="quote-service">
          <p>{label}</p>
          <p>${Number(basePrice).toFixed(2)}</p>
        </div>
      </div>

      {extrasList?.map((ex) => (
        <div key={ex.name} className="quote-line discount-line">
          <div className="quote-service extras-line">
            <p className="extra-text">+ {ex.name}</p>
            <p className="extra-text">${Number(ex.price).toFixed(2)}</p>
          </div>
        </div>
      ))}

      {discountAmount > 0 && (
        <div className="quote-line discount-line">
          <div className="quote-service extras-line">
            <p className="extra-text">- {frequencyLabel} Discount</p>
            <p className="extra-text">-${Number(discountAmount).toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="quote-line subtotal-line">
        <div className="quote-total">
          <p>Estimated Total</p>
          <p>${Number(finalPrice).toFixed(2)}</p>
        </div>
      </div>
    </>
  );

  return (
    <div className="quote-container">
      <div className="quote-header"><p>YOUR QUOTE</p></div>

      {renderBlock(
        serviceName,
        base,
        extrasList,
        discountAmount,
        final,
        frequency
      )}

      {additionalBlocks?.length > 0 &&
        additionalBlocks.map((block, i) =>
          renderBlock(
            block.label,
            block.base,
            block.extrasList,
            0,
            block.final,
            ""
          )
        )}
    </div>
  );
}
