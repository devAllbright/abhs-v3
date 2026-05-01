import { useEffect, useState } from "react";
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

function MaidServicesBlock() {
  const { cartData, updateCartData } = useShoppingCart();
  const { globalExtras, serviceName } = maidServicesPrices;

  const frequencies = [
    { label: "Weekly", value: globalExtras.weeklyDiscount },
    { label: "Bi-Weekly", value: globalExtras.biMonthlyDiscount },
    { label: "Monthly", value: globalExtras.monthlyDiscount }
  ];

  // --------------------------
  // NEW: Initialize on mount
  // --------------------------
  useEffect(() => {
    // Only set defaults if nothing is selected
    if (!cartData.selectedFrequency) {
      updateCartData({
        selectedService: "Maid Services",
        selectedFrequency: "Weekly",
        discount: globalExtras.weeklyDiscount,
        condition: cartData.hadProServices ? "normal" : "bad",
      });
    } else {
      // Ensure correct service + condition when user returns to this step
      updateCartData({
        selectedService: "Maid Services",
        condition: cartData.hadProServices ? "normal" : "bad",
      });
    }
  }, []);

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


function ProfessionalServicesBlock() {
  const { cartData, updateCartData } = useShoppingCart();
  const { serviceName } = professionalServicesPrices;

  useEffect(() => {
    updateCartData({
      selectedService: "Professional Services",
      condition: cartData.hadProServices ? "normal" : "bad",
      selectedFrequency: "",
      discount: 0
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

function CarpetCleaningBlock() {
  const { cartData, updateCartData } = useShoppingCart();
  const { serviceName, pricing } = carpetCleaningPrices;
  const [expandedSection, setExpandedSection] = useState("carpet");

  useEffect(() => {
    updateCartData({
      selectedService: "Carpet Cleaning",
      condition: cartData.hadProServices ? "normal" : "bad",
      selectedFrequency: "",
      discount: 0
    });
  }, []);

  const handleToggle = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleCountChange = (cat, item, service, delta) => {
    const currentQty = cartData.advancedCarpet?.[cat]?.[item]?.[service] || 0;
    const newQty = Math.max(0, currentQty + delta);
    updateCartData(`advancedCarpet.${cat}.${item}.${service}`, newQty);
  };

  const renderTable = (catName, catKey) => {
    const items = pricing[catKey] || {};
    const itemNames = Object.keys(items);
    if (itemNames.length === 0) return null;

    const serviceColumns = Object.keys(items[itemNames[0]] || {});

    return (
      <div className="accordion-section" style={{ marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" }}>
        <div
          className="accordion-header"
          onClick={() => handleToggle(catKey)}
          style={{ padding: "15px", backgroundColor: "#000", color: "#fff", display: "flex", justifyContent: "space-between", cursor: "pointer", fontWeight: "bold" }}
        >
          <span>{catName}</span>
          <span style={{ color: "#f39c12" }}>{expandedSection === catKey ? "▲" : "▼"}</span>
        </div>
        {expandedSection === catKey && (
          <div className="accordion-body" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
              <thead>
                <tr style={{ backgroundColor: "#555", color: "#fff" }}>
                  <th style={{ padding: "10px", textAlign: "left" }}>Item</th>
                  {serviceColumns.map(svc => (
                    <th key={svc} style={{ padding: "10px", textTransform: "uppercase" }}>{svc}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {itemNames.map((itemName, idx) => (
                  <tr key={itemName} style={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#fff", borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "15px 10px", textAlign: "left", fontWeight: "bold", color: "#333" }}>{itemName}</td>
                    {serviceColumns.map(svc => {
                      const qty = cartData.advancedCarpet?.[catKey]?.[itemName]?.[svc] || 0;
                      return (
                        <td key={svc} style={{ padding: "10px" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#fff" }}>
                            <button
                              style={{ border: "none", background: "none", padding: "5px 10px", cursor: "pointer", fontSize: "16px" }}
                              onClick={() => handleCountChange(catKey, itemName, svc, -1)}
                            >
                              -
                            </button>
                            <span style={{ minWidth: "30px" }}>{qty}</span>
                            <button
                              style={{ border: "none", background: "none", padding: "5px 10px", cursor: "pointer", fontSize: "16px" }}
                              onClick={() => handleCountChange(catKey, itemName, svc, 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="scroll-choose-service">
      <div className="scroll-title"><p>What can we clean for you?</p></div>
      <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px" }}>
        Please select all items and services from the drop downs below for an accurate quote.
      </p>

      <div className="services-container" style={{ display: "block" }}>
        {renderTable("CARPET CLEANING", "carpet")}
        {renderTable("UPHOLSTERY CLEANING", "upholstery")}
        {renderTable("TILE & GROUT FLOOR CLEANING", "tile")}
      </div>
    </div>
  );
}

