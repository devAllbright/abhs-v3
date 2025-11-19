import { useEffect } from "react";
import { useShoppingCart } from "../../../context/ShoppingCartContext";
import "../../../styles/pricing/shopping-cart/scroll-steps/your-quote.css";

export default function YourQuote() {
  const { cartData, calculateTotal } = useShoppingCart();

  const {
    selectedService,
    selectedFrequency,
    squareFootage,
    condition,
    basePrice,
    extrasTotal,
    finalPrice,
    hadProServices
  } = cartData;

  useEffect(() => {
    if (!selectedService) return;
    calculateTotal();
  }, [
    selectedService,
    selectedFrequency,
    squareFootage,
    cartData.bedroomNumber,
    cartData.bathroomNumber,
    condition,
    cartData.extras,
    hadProServices
  ]);

  if (!selectedService) {
    return (
      <div className="quote-container">
        <div className="quote-header">
          <p>YOUR QUOTE</p>
        </div>
        <p className="no-services">No services selected yet</p>
      </div>
    );
  }

  if (!finalPrice || finalPrice <= 0) {
    return (
      <div className="quote-container">
        <div className="quote-header">
          <p>YOUR QUOTE</p>
        </div>
        <p className="no-services">
          We will calculate your quote as soon as you complete the details.
        </p>
      </div>
    );
  }

  return (
    <div className="quote-container">
      <div className="quote-header">
        <p>YOUR QUOTE</p>
      </div>

      {selectedService === "Maid Services" && (
        <>
          <div className="quote-line service-line">
            <div className="quote-service">
              <p>{selectedService}</p>
              <p>${basePrice.toFixed(2)}</p>
            </div>
          </div>

          {selectedFrequency && (
            <div className="quote-line subtotal-line">
              <div className="quote-total">
                <p>Frequency</p>
                <p>{selectedFrequency}</p>
              </div>
            </div>
          )}

          <div className="quote-line subtotal-line">
            <div className="quote-total">
              <p>Extras</p>
              <p>${extrasTotal.toFixed(2)}</p>
            </div>
          </div>

          {hadProServices === false && (
            <div className="quote-line subtotal-line">
              <div className="quote-total">
                <p>Includes Initial Cleaning</p>
                <p>Yes</p>
              </div>
            </div>
          )}

          <div className="quote-line total-line">
            <div className="quote-total">
              <p>Estimated Total</p>
              <p>${finalPrice.toFixed(2)}</p>
            </div>
          </div>
        </>
      )}

      {selectedService === "Professional Services" && (
        <>
          <div className="quote-line service-line">
            <div className="quote-service">
              <p>{selectedService}</p>
              <p>${basePrice.toFixed(2)}</p>
            </div>
          </div>

          <div className="quote-line subtotal-line">
            <div className="quote-total">
              <p>Condition</p>
              <p>{condition === "bad" ? "Bad" : "Normal"}</p>
            </div>
          </div>

          <div className="quote-line subtotal-line">
            <div className="quote-total">
              <p>Extras</p>
              <p>${extrasTotal.toFixed(2)}</p>
            </div>
          </div>

          <div className="quote-line total-line">
            <div className="quote-total">
              <p>Estimated Total</p>
              <p>${finalPrice.toFixed(2)}</p>
            </div>
          </div>
        </>
      )}

      {selectedService === "Carpet Cleaning" && (
        <>
          <div className="quote-line service-line">
            <div className="quote-service">
              <p>{selectedService}</p>
              <p>${basePrice.toFixed(2)}</p>
            </div>
          </div>

          {squareFootage && (
            <div className="quote-line subtotal-line">
              <div className="quote-total">
                <p>Square Footage</p>
                <p>{squareFootage} sq ft</p>
              </div>
            </div>
          )}

          <div className="quote-line subtotal-line">
            <div className="quote-total">
              <p>Extras</p>
              <p>${extrasTotal.toFixed(2)}</p>
            </div>
          </div>

          <div className="quote-line total-line">
            <div className="quote-total">
              <p>Estimated Total</p>
              <p>${finalPrice.toFixed(2)}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
