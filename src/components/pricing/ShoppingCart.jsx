import { useEffect, useState } from "react";
import { ShoppingCartProvider } from "../../context/ShoppingCartContext";
import RecurringServices from "./scroll-steps/RecurringServices";
import OneTimeServices from "./scroll-steps/OneTimeServices";
import CustomizeService from "./scroll-steps/CustomizeService";
import ContactInfo from "./scroll-steps/ContactInfo";
import Disclaimer from "./shopping-cart/Disclaimer";
import BundleDisclaimer from "./shopping-cart/BundleDisclaimer";
import YourQuote from "./shopping-cart/YourQuote";
import "../../styles/pricing/shopping-cart.css";

export default function ShoppingCart() {
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

  return (
    <ShoppingCartProvider>
      <div className="shopping-cart-container">
        <div className="cart-scrolling-side">
          {serviceType === "oneTime" && <OneTimeServices />}
          {serviceType === "recurring" && (
            <>
              <RecurringServices />
              <CustomizeService />
            </>
          )}
          <ContactInfo stepNumber={serviceType === "recurring" ? 3 : 2} />
        </div>

        <div className="cart-static-side">
          <div className="your-quote">
            <YourQuote />
          </div>

          <div className="disclaimer">
            {serviceType === "oneTime" ? <BundleDisclaimer /> : <Disclaimer />}
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
    </ShoppingCartProvider>
  );
}
