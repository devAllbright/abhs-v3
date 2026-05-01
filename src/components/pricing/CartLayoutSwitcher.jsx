import { useShoppingCart } from "../../context/ShoppingCartContext";
import AdvancedCarpetCart from "./AdvancedCarpetCart";
import SelectedService from "./scroll-steps/SelectedService";
import CustomizeService from "./scroll-steps/CustomizeService";
import ContactInfo from "./scroll-steps/ContactInfo";
import Disclaimer from "./shopping-cart/Disclaimer";
import BundleDisclaimer from "./shopping-cart/BundleDisclaimer";
import YourQuote from "./shopping-cart/YourQuote";
import { useEffect, useState } from "react";

export default function CartLayoutSwitcher() {
  const { cartData } = useShoppingCart();
  const [serviceType, setServiceType] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("serviceType");
      if (stored) setServiceType(stored);
    }
  }, []);

  const handleNext = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/pricing/final-summary";
    }
  };

  // Switch to the fully customized layout for Carpet Cleaning
  if (cartData.selectedService === "Carpet Cleaning") {
    return <AdvancedCarpetCart />;
  }

  // Standard 2-column layout for everything else
  return (
    <>
      <div className="shopping-cart-container">
        <div className="cart-scrolling-side">
          <SelectedService />
          <CustomizeService />
          <ContactInfo />
        </div>

        <div className="cart-static-side">
          <div className="your-quote">
            <YourQuote />
          </div>

          <div className="disclaimer">
            {serviceType === "oneTimeMaids" ? (
              <BundleDisclaimer />
            ) : (
              <Disclaimer />
            )}
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <a href="/pricing/pro-services">
          <button className="nav-button">Back</button>
        </a>
        <button className="nav-button" onClick={handleNext}>
          Next
        </button>
      </div>
    </>
  );
}
