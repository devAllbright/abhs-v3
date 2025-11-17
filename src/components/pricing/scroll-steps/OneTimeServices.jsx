import { useEffect, useState } from "react";
import { useShoppingCart } from "../../../context/ShoppingCartContext";
import oneTimePrices from "../../../data/professionalServicesPrices.json";
import "../../../styles/pricing/shopping-cart/scroll-steps/one-time-services.css";

export default function OneTimeServices() {
  const { cartData, updateCartData } = useShoppingCart();
  const { serviceName } = oneTimePrices; // should be "Professional Services"

  const [condition, setCondition] = useState(null);

  useEffect(() => {
    const homeDetailsRaw = sessionStorage.getItem("homeDetails");
    const homeDetails = homeDetailsRaw ? JSON.parse(homeDetailsRaw) : {};
    setCondition(homeDetails.condition || "YES");
  }, []);

  if (condition === null) return null;

  const activeService = cartData.selectedService || "";

  const handleServiceSelect = (selected) => {
    updateCartData({
      selectedServiceType: "oneTimeMaids",
      selectedService: selected,
      discount: 0, // one-time services don’t use frequency discounts
    });

    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedServiceType", "oneTimeMaids");
      sessionStorage.setItem("selectedService", selected);
    }
  };

  return (
    <div className="scroll-choose-service">
      <div className="scroll-title">
        <p>1. Choose your Service</p>
      </div>

      <div className="services-container">
        <button
          className={`service ${activeService === serviceName ? "active-service" : ""}`}
          onClick={() => handleServiceSelect(serviceName)}
        >
          {serviceName}
        </button>
      </div>
    </div>
  );
}
