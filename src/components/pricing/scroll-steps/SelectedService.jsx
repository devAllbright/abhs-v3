import { useState, useEffect } from "react";
import { useShoppingCart } from "../../../context/ShoppingCartContext";
import maidServicesPrices from "../../../data/maidServicesPrices.json";
import professionalServicesPrices from "../../../data/professionalServicesPrices.json";
import carpetCleaningPrices from "../../../data/carpetCleaningPrices.json";
import "../../../styles/pricing/shopping-cart/scroll-steps/recurring-services.css";
import "../../../styles/pricing/shopping-cart/scroll-steps/one-time-services.css";

export default function SelectedService() {
  const { cartData } = useShoppingCart();
  const selected = cartData.selectedService;

  if (!selected) return null;

  if (selected === "Maid Services") return <RecurringServiceSection />;
  if (selected === "Professional Services") return <OneTimeServiceSection />;
  if (selected === "Carpet Cleaning") return <CarpetServiceSection />;

  return null;
}

function RecurringServiceSection() {
  const { cartData, updateCartData } = useShoppingCart();
  const { serviceName, globalExtras } = maidServicesPrices;

  const frequencies = [
    { label: "Weekly", value: globalExtras.weeklyDiscount },
    { label: "Bi-Weekly", value: globalExtras.biMonthlyDiscount },
    { label: "Monthly", value: globalExtras.monthlyDiscount }
  ];

  const [selectedFrequency, setSelectedFrequency] = useState(
    cartData.selectedFrequency || "Weekly"
  );

  useEffect(() => {
    updateCartData({
      selectedService: serviceName,
      selectedFrequency
    });
  }, [selectedFrequency]);

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
                onClick={() => setSelectedFrequency(label)}
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

function OneTimeServiceSection() {
  const { cartData, updateCartData } = useShoppingCart();
  const { serviceName } = professionalServicesPrices;

  const isActive = cartData.selectedService === serviceName;

  const handleSelect = () => {
    updateCartData({
      selectedService: serviceName
    });
  };

  return (
    <div className="scroll-choose-service">
      <div className="scroll-title">
        <p>1. Choose your Service</p>
      </div>

      <div className="services-container">
        <button
          className={`service ${isActive ? "active-service" : ""}`}
          onClick={handleSelect}
        >
          {serviceName}
        </button>
      </div>
    </div>
  );
}

function CarpetServiceSection() {
  const { cartData, updateCartData } = useShoppingCart();
  const { serviceName } = carpetCleaningPrices;

  const [size, setSize] = useState(
    typeof cartData.squareFootage === "number" && cartData.squareFootage > 0
      ? cartData.squareFootage
      : 400
  );

  useEffect(() => {
    updateCartData({
      selectedService: serviceName,
      squareFootage: size
    });
  }, [size]);

  const changeSize = (delta) => {
    setSize((prev) => {
      const next = prev + delta;
      return next < 100 ? 100 : next;
    });
  };

  const handleInputChange = (e) => {
    const value = Number(e.target.value.replace(/\D/g, ""));
    if (!value) {
      setSize(0);
      return;
    }
    setSize(value);
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

        <div className="carpet-size-section">
          <div className="size-controls">
            <button onClick={() => changeSize(-100)}>-100</button>
            <input type="text" value={size} onChange={handleInputChange} />
            <button onClick={() => changeSize(100)}>+100</button>
          </div>
          <p className="sqft-label">{size} sq ft</p>
        </div>
      </div>
    </div>
  );
}
