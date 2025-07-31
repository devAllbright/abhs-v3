import { useEffect, useState } from "react";
import "../../../styles/pricing/shopping-cart/final-summary.css";

export default function FinalSummary() {
  const [orderSummary, setOrderSummary] = useState(null);
  const [finalTotal, setFinalTotal] = useState(0);

  // Retrieve order summary from sessionStorage
  useEffect(() => {
    const storedOrder = sessionStorage.getItem("orderSummary");
    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);
      setOrderSummary(parsedOrder);

      // ✅ Recalculate total to ensure bundle discount is included
      let total = parsedOrder.activeServices.reduce((sum, service) => sum + service.price, 0);

      Object.values(parsedOrder.activeExtras).forEach((extras) => {
        total += extras.reduce((sum, extra) => sum + extra.price, 0);
      });

      total -= parsedOrder.bundleDiscount; // ✅ Apply bundle discount
      total -= parsedOrder.frequencyDiscount; // ✅ Apply frequency discount

      if (parsedOrder.initialCleaning) {
        total += parsedOrder.initialCleaning.price;
      }

      setFinalTotal(total);
    }
  }, []);

  if (!orderSummary) {
    return <p>Loading order summary...</p>;
  }

  const { activeServices, activeExtras, initialCleaning, frequencyDiscount, bundleDiscount } = orderSummary;

  return (
    <>
      <div className="final-summary">
        <div className="quote-container">
          <div className="quote-header">
            <p>FINAL SUMMARY</p>
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

                {/* Extras for Each Service */}
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

          {/* Frequency Discount Line */}
          {frequencyDiscount > 0 && (
            <div className="quote-line discount-line">
              <div className="bundle-discount">
                <p>Frequency Discount</p>
                <p>- ${frequencyDiscount.toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Bundle Discounts */}
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
              <p>${finalTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <a href="/pricing/shopping-cart">
          <button className="nav-button">Back</button>
        </a>
        <a href="/pricing/thank-you">
          <button className="nav-button">Confirm</button>
        </a>
      </div>
    </>
  );
}
