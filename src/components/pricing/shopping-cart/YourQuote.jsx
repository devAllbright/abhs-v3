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

  // A helper to ensure formatting is uniform across all values
  const format = (value) => `$${Number(value)}`;

  const renderBlock = (
    label,
    basePrice,
    extrasList,
    discountAmount,
    finalPrice,
    frequencyLabel
  ) => (
    <>
      <div className="quote-line service-line">
        <div className="quote-service">
          <p>{label}</p>
          <p>{format(basePrice)}</p>
        </div>
      </div>

      {extrasList?.map((ex) => (
        <div key={ex.name} className="quote-line discount-line">
          <div className="quote-service extras-line">
            <p className="extra-text">+ {ex.name}</p>
            <p className="extra-text">{format(ex.price)}</p>
          </div>
        </div>
      ))}

      {discountAmount > 0 && (
        <div className="quote-line discount-line">
          <div className="quote-service extras-line">
            <p className="extra-text">- {frequencyLabel} Discount</p>
            <p className="extra-text">-${discountAmount}</p>
          </div>
        </div>
      )}

      <div className="quote-line subtotal-line">
        <div className="quote-total">
          <p>Estimated Total</p>
          <p>{format(finalPrice)}</p>
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
        
      {serviceName === "Carpet Cleaning" && (
        <div style={{ marginTop: "20px", padding: "15px", borderTop: "1px solid #ccc" }}>
          <p style={{ fontWeight: "bold", marginBottom: "10px" }}>Promo Code</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <input 
              type="text" 
              placeholder="Enter Code" 
              value={cartData.appliedPromo || ""}
              onChange={(e) => updateCartData("appliedPromo", e.target.value.toUpperCase())}
              style={{ padding: "10px", flex: 1, border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
          {discountAmount > 0 && cartData.appliedPromo && (
            <p style={{ color: "green", fontSize: "12px", marginTop: "5px" }}>Promo applied!</p>
          )}
        </div>
      )}
    </div>
  );
}
