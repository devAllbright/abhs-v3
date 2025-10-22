import{ useEffect, useState } from "react";
import RecurringServices from "./scroll-steps/RecurringServices";
import OneTimeServices from "./scroll-steps/OneTimeServices";
import CustomizeService from "./scroll-steps/CustomizeService";
import ContactInfo from "./scroll-steps/ContactInfo";
import Disclaimer from "./shopping-cart/Disclaimer";
import BundleDisclaimer from "./shopping-cart/BundleDisclaimer";
import YourQuote from "./shopping-cart/YourQuote";
import "../../styles/pricing/shopping-cart.css";

export default function ShoppingCart() {
  const [serviceType, setServiceType] = useState(sessionStorage.getItem("serviceType") || "");

  const handleNext = () => {
    window.location.href = "/pricing/final-summary";
  };

  return (
    <>
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
        <a href="/pricing/service-type">
          <button className="nav-button">Back</button>
        </a>
        <button className="nav-button" onClick={handleNext}>
          Next
        </button>
      </div>
    </>
  );
}
