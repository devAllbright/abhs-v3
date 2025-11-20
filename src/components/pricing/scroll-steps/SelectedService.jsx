import { useEffect } from "react";

import { useShoppingCart } from "../../../context/ShoppingCartContext";
import maidServicesPrices from "../../../data/maidServicesPrices.json";
import professionalServicesPrices from "../../../data/professionalServicesPrices.json";
import carpetCleaningPrices from "../../../data/carpetCleaningPrices.json";
import "../../../styles/pricing/shopping-cart/scroll-steps/recurring-services.css";
import "../../../styles/pricing/shopping-cart/scroll-steps/one-time-services.css";

export default function SelectedService() {
  const { cartData } = useShoppingCart();
  const { selectedService } = cartData;

  if (!selectedService) return null;

  switch (selectedService) {
    case "Maid Services":
      return <MaidServicesBlock />;
    case "Professional Services":
      return <ProfessionalServicesBlock />;
    case "Carpet Cleaning":
      return <CarpetCleaningBlock />;
    default:
      return null;
  }
}

/* ========================================================================
   MAID SERVICES (Recurring)
======================================================================== */
function MaidServicesBlock() {
  const { cartData, updateCartData } = useShoppingCart();
  const { globalExtras, serviceName } = maidServicesPrices;

  const frequencies = [
    { label: "Weekly", value: globalExtras.weeklyDiscount },
    { label: "Bi-Weekly", value: globalExtras.biMonthlyDiscount },
    { label: "Monthly", value: globalExtras.monthlyDiscount },
  ];

  const selected = cartData.selectedFrequency || "Weekly";

  const handleFrequencyClick = (label) => {
    updateCartData({
      selectedService: "Maid Services",
      selectedFrequency: label,
      discount: frequencies.find((f) => f.label === label)?.value || 0,
      condition: cartData.hadProServices ? "normal" : "bad",
    });
  };

  return (
    <div className="scroll-choose-service">
      <div className="scroll-title"><p>Choose your Service</p></div>

      <div className="services-container">
        <button className="service active-service" disabled>
          {serviceName}
        </button>

        <div className="service-frequency">
          {frequencies.map(({ label, value }) => (
            <div key={label} className="frequency-element">
              <button
                className={`frequency-btn ${selected === label ? "active-frequency" : ""}`}
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

/* ========================================================================
   PROFESSIONAL SERVICES (One-Time)
======================================================================== */
function ProfessionalServicesBlock() {
  const { cartData, updateCartData } = useShoppingCart();
  const { serviceName } = professionalServicesPrices;

  useEffect(() => {
    updateCartData({
      selectedService: "Professional Services",
      condition: cartData.hadProServices ? "normal" : "bad",
      selectedFrequency: "",
      discount: 0,
    });
  }, []);

  return (
    <div className="scroll-choose-service">
      <div className="scroll-title"><p>Choose your Service</p></div>

      <div className="services-container">
        <button className="service active-service" disabled>
          {serviceName}
        </button>
      </div>
    </div>
  );
}

/* ========================================================================
   CARPET CLEANING
======================================================================== */
function CarpetCleaningBlock() {
  const { cartData, updateCartData } = useShoppingCart();
  const { serviceName } = carpetCleaningPrices;

  const sqft = cartData.squareFootage || 500;

  const adjustSqft = (value) => {
    if (value < 500) return 500;
    if (value > 2500) return 2500;
    return value;
  };

  const updateSqft = (value) => {
    const newValue = adjustSqft(value);
    updateCartData({
      selectedService: "Carpet Cleaning",
      squareFootage: newValue,
      condition: cartData.hadProServices ? "normal" : "bad",
      selectedFrequency: "",
      discount: 0,
    });
  };

  const handleInput = (e) => {
    const raw = parseInt(e.target.value.replace(/\D/g, ""), 10);
    updateSqft(raw || 500);
  };

  return (
    <div className="scroll-choose-service">
      <div className="scroll-title"><p>Choose your Service</p></div>

      <div className="services-container">
        <button className="service active-service" disabled>
          {serviceName}
        </button>

        <div className="service-frequency">
          <div className="frequency-element">
            <div className="sqft-control">
              <button className="frequency-btn" onClick={() => updateSqft(sqft - 100)}>
                -100
              </button>

              <input
                type="number"
                className="sqft-input"
                value={sqft}
                onChange={handleInput}
              />

              <button className="frequency-btn" onClick={() => updateSqft(sqft + 100)}>
                +100
              </button>
            </div>

            <p className="discount-text">Enter Sq Ft (500–2500)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
