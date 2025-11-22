import { useShoppingCart } from "../../../context/ShoppingCartContext";
import "../../../styles/pricing/shopping-cart/final-summary.css";

export default function FinalSummary() {
  const shopping = useShoppingCart();

  if (!shopping || !shopping.cartData) {
    return <p>Loading...</p>;
  }

  const { cartData } = shopping;

  if (!cartData.priceBreakdown) {
    return (
      <div className="final-summary">
        <div className="quote-container">
          <div className="quote-header"><p>FINAL SUMMARY</p></div>
          <p className="no-services">No services selected yet</p>
        </div>
      </div>
    );
  }

  const { priceBreakdown } = cartData;

  const {
    serviceName,
    frequency,
    base,
    extrasList,
    discountAmount,
    final,
    additionalBlocks
  } = priceBreakdown;

  // ------------------------------------
  // RENDER BLOCK FUNCTION (same as YourQuote)
  // ------------------------------------
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

  // ------------------------------------
  // MAIN RETURN
  // ------------------------------------
  return (
    <>
      <div className="final-summary">
        <div className="quote-container">
          <div className="quote-header">
            <p>FINAL SUMMARY</p>
          </div>

          {renderBlock(
            serviceName,
            base,
            extrasList,
            discountAmount,
            final,
            frequency
          )}

          {additionalBlocks?.length > 0 &&
            additionalBlocks.map((block) =>
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
      </div>

      <div className="navigation-buttons">
        <a href="/pricing/shopping-cart">
          <button className="nav-button">Back</button>
        </a>

        <button
          className="nav-button"
          onClick={() => {
            window.location.href = "/thank-you";
          }}
        >
          Confirm
        </button>
      </div>
    </>
  );
}
