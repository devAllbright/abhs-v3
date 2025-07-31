import { useEffect } from "react";
import { useShoppingCart } from "../../../context/ShoppingCartContext";
import "../../../styles/pricing/shopping-cart/scroll-steps/customize-service.css";

export default function CustomizeService() {
  const { addExtra, removeExtra, removeAllExtras, activeExtras, activeServices, services } = useShoppingCart();

  // Retrieve House Cleaning extras from context
  const extrasList = services.recurringServices.houseCleaning.extras;

  // Check if House Cleaning is active
  const houseCleaningService = activeServices.find((service) => service.id === "houseCleaning");

  // Check if House Cleaning has a selected frequency
  const isHouseCleaningActive = !!houseCleaningService;
  const hasFrequencySelected = houseCleaningService?.frequency;

  // Remove all extras if House Cleaning is deselected
  useEffect(() => {
    if (!isHouseCleaningActive) {
      removeAllExtras("houseCleaning");
    }
  }, [isHouseCleaningActive, removeAllExtras]);

  // Handle extra selection
  const handleExtraClick = (extra) => {
    if (!isHouseCleaningActive || !hasFrequencySelected) {
      alert("You must select House Cleaning and a frequency before choosing extras.");
      return;
    }

    const isActive = activeExtras["houseCleaning"]?.some((e) => e.id === extra.id);
    if (isActive) {
      removeExtra("houseCleaning", extra.name);
    } else {
      addExtra("houseCleaning", extra);
    }
  };

  return (
    <div className="scroll-customize-service">
      <div className="scroll-title">
        <p>2. Customize your Service</p>
      </div>

      <div className="extras-container">
        {extrasList.map((extra) => {
          const isActive = activeExtras["houseCleaning"]?.some((e) => e.id === extra.id);
          return (
            <button
              key={extra.id}
              className={`extra-element ${isActive ? "active-extra" : ""}`}
              onClick={() => handleExtraClick(extra)}
              disabled={!isHouseCleaningActive || !hasFrequencySelected} // Disable if House Cleaning or frequency is not selected
            >
              <div className="extra-img">
                <img src={extra.img} alt={extra.name} />
              </div>
              <div className="extra-name">
                <p>{extra.name} (+${extra.price})</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
