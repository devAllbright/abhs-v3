import { useEffect, useState } from "react";
import { useShoppingCart } from "../../../context/ShoppingCartContext";
import recurringPrices from "../../../data/recurringPrices.json";
import "../../../styles/pricing/shopping-cart/scroll-steps/recurring-services.css";

export default function RecurringServices() {
  const { cartData, updateCartData } = useShoppingCart();
  const { serviceName, globalExtras } = recurringPrices;

  const frequencies = [
    { label: "Weekly", value: globalExtras.weeklyDiscount },
    { label: "Bi-Weekly", value: globalExtras.biMonthlyDiscount },
    { label: "Monthly", value: globalExtras.monthlyDiscount },
  ];

  const isActive = true;

  const [selectedFrequency, setSelectedFrequency] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("frequency");
      return stored || cartData.selectedFrequency || "Weekly";
    }
    return cartData.selectedFrequency || "Weekly";
  });

  useEffect(() => {
    updateCartData({
      selectedServiceType: "recurring",
      selectedService: serviceName,
      selectedFrequency,
      discount:
        frequencies.find((f) => f.label === selectedFrequency)?.value || 0,
    });

    if (typeof window !== "undefined") {
      sessionStorage.setItem("frequency", selectedFrequency);
    }
  }, [selectedFrequency]);

  const handleFrequencyClick = (label) => {
    setSelectedFrequency(label);
  };

  return (
    <div className="scroll-choose-service">
      <div className="scroll-title">
        <p>1. Choose your Service</p>
      </div>

      <div className="services-container">
        <button className="service active-service" disabled>
          {serviceName}
        </button>

        <div className="service-frequency">
          {frequencies.map(({ label, value }) => (
            <div key={label} className="frequency-element">
              <button
                className={`frequency-btn ${
                  selectedFrequency === label ? "active-frequency" : ""
                }`}
                onClick={() => handleFrequencyClick(label)}
              >
                {label}
              </button>
              <p className="discount-text">{(value * 100).toFixed(0)}% Discount</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
