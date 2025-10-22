import React, { useState } from "react";
import { useShoppingCart } from "../../../context/ShoppingCartContext";
import "../../../styles/pricing/shopping-cart/scroll-steps/recurring-services.css";

export default function RecurringServices() {
  const { activeServices, addService, removeService, services, setFrequencyDiscount } = useShoppingCart();

  const houseCleaning = services.recurringServices.houseCleaning;
  const { frequencies } = houseCleaning;

  const [isActive, setIsActive] = useState(
    activeServices.some((service) => service.id === "houseCleaning")
  );

  const [selectedFrequency, setSelectedFrequency] = useState(isActive ? "weekly" : "");

  const handleServiceClick = () => {
    if (isActive) {
      removeService("houseCleaning");
      setSelectedFrequency("");
      setFrequencyDiscount(0);
    } else {
      const discount = frequencies.weekly;
      addService({
        id: "houseCleaning",
        name: "House Cleaning",
        price: houseCleaning.price,
        discount,
        frequency: "weekly",
      });
      setSelectedFrequency("weekly");
      setFrequencyDiscount((houseCleaning.price * discount) / 100);
    }
    setIsActive(!isActive);
  };

  const handleFrequencyClick = (frequency) => {
    if (!isActive) return;

    setSelectedFrequency(frequency);

    removeService("houseCleaning");

    const discount = frequencies[frequency];
    addService({
      id: "houseCleaning",
      name: "House Cleaning",
      price: houseCleaning.price,
      discount,
      frequency,
    });

    setFrequencyDiscount((houseCleaning.price * discount) / 100); 
  };

  return (
    <div className="scroll-choose-service">
      <div className="scroll-title">
        <p>1. Choose your Service</p>
      </div>

      <div className="services-container">
        <button
          className={`service ${isActive ? "active-service" : ""}`}
          onClick={handleServiceClick}
        >
          House Cleaning
        </button>

        {isActive && (
          <div className="service-frequency">
            {Object.keys(frequencies).map((frequency) => (
              <div key={frequency} className="frequency-element">
                <button
                  className={`frequency-btn ${selectedFrequency === frequency ? "active-frequency" : ""}`}
                  onClick={() => handleFrequencyClick(frequency)}
                >
                  {frequency === "weekly" ? "Weekly" : frequency === "biWeekly" ? "Bi-Weekly" : "Monthly"}
                </button>
                <p className="discount-text">{frequencies[frequency]}% Discount</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
