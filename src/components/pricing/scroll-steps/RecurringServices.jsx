import React, { useState } from "react";
import { useShoppingCart } from "../../../context/ShoppingCartContext";
import "../../../styles/pricing/shopping-cart/scroll-steps/recurring-services.css";

export default function RecurringServices() {
  const { activeServices, addService, removeService, services, setFrequencyDiscount } = useShoppingCart();

  // Get House Cleaning service details from context
  const houseCleaning = services.recurringServices.houseCleaning;
  const { frequencies } = houseCleaning;

  // Check if House Cleaning is currently active
  const [isActive, setIsActive] = useState(
    activeServices.some((service) => service.id === "houseCleaning")
  );

  // Track selected frequency
  const [selectedFrequency, setSelectedFrequency] = useState(isActive ? "weekly" : "");

  // Handle House Cleaning selection/deselection
  const handleServiceClick = () => {
    if (isActive) {
      removeService("houseCleaning");
      setSelectedFrequency(""); // Reset frequency selection
      setFrequencyDiscount(0); // Reset frequency discount
    } else {
      const discount = frequencies.weekly; // Default to Weekly
      addService({
        id: "houseCleaning",
        name: "House Cleaning",
        price: houseCleaning.price,
        discount,
        frequency: "weekly",
      });
      setSelectedFrequency("weekly");
      setFrequencyDiscount((houseCleaning.price * discount) / 100); // Store discount in context
    }
    setIsActive(!isActive);
  };

  // Handle frequency selection
  const handleFrequencyClick = (frequency) => {
    if (!isActive) return; // Prevent selection if House Cleaning is not active

    setSelectedFrequency(frequency);

    // Remove previous service entry and add the updated one with new discount
    removeService("houseCleaning");

    const discount = frequencies[frequency];
    addService({
      id: "houseCleaning",
      name: "House Cleaning",
      price: houseCleaning.price,
      discount,
      frequency,
    });

    setFrequencyDiscount((houseCleaning.price * discount) / 100); // Store discount in context
  };

  return (
    <div className="scroll-choose-service">
      <div className="scroll-title">
        <p>1. Choose your Service</p>
      </div>

      <div className="services-container">
        {/* House Cleaning Service Button */}
        <button
          className={`service ${isActive ? "active-service" : ""}`}
          onClick={handleServiceClick}
        >
          House Cleaning
        </button>

        {/* Frequency Selection - Only visible when House Cleaning is selected */}
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
