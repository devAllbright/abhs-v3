import { useState } from "react";
import "../../../styles/pricing/shopping-cart/scroll-steps/create-deal.css";

export default function CreateDeal() {
  const [activeBundle, setActiveBundle] = useState(null);

  const maintenancePlans = [
    {
      name: "Standard Plan",
      services: ["House Cleaning (monthly)", "Carpet Cleaning (once a year)", "Window Washing (once a year)"],
    },
    {
      name: "Medium Plan",
      services: ["House Cleaning (bi-weekly)", "Carpet Cleaning (once a year)", "Window Washing (once a year)"],
    },
    {
      name: "Premium Plan",
      services: ["House Cleaning (weekly)", "Carpet Cleaning (once a year)", "Window Washing (once a year)"],
    },
    {
      name: "Custom Plan",
      services: ["Contact us and get a customized plan tailored to your needs."],
    },
  ];

  const toggleBundle = (bundle) => {
    setActiveBundle(activeBundle === bundle.name ? null : bundle.name);
  };

  return (
    <div className="scroll-create-deal">
      <div className="scroll-title">
        <p>3. Looking for a Maintenance Plan?</p>
      </div>

      <div className="bundles-container">
        {maintenancePlans.map((bundle) => (
          <button
            key={bundle.name}
            className={`bundle ${activeBundle === bundle.name ? "active-deal" : ""}`}
            onClick={() => toggleBundle(bundle)}
          >
            <div className="bundle-offer">
              <p>{bundle.name}</p>
              <p>{bundle.services.join(" + ")}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
