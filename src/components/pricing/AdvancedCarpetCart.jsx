import { useEffect, useState } from "react";
import { useShoppingCart } from "../../context/ShoppingCartContext";
import carpetCleaningPrices from "../../data/carpetCleaningPrices.json";

export default function AdvancedCarpetCart() {
  const { cartData, updateCartData } = useShoppingCart();
  const { pricing } = carpetCleaningPrices;
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
    
    const infoIcon = (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#FC8551" style={{ marginLeft: "6px", verticalAlign: "middle" }}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
      </svg>
    );

    return (
      <div className="accordion-section" style={{ marginBottom: "15px", border: "1px solid #e5e5e5", borderRadius: "2px", overflow: "hidden" }}>
        <div 
          className="accordion-header" 
          onClick={() => handleToggle(catKey)}
          style={{ 
            padding: "0 0 0 20px", 
            backgroundColor: expandedSection === catKey ? "#333333" : "#f4f4f4", 
            color: expandedSection === catKey ? "#fff" : "#333", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            cursor: "pointer", 
            fontWeight: "700",
            fontSize: "13px",
            height: "45px",
            transition: "background-color 0.3s ease, color 0.3s ease"
          }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            {catName} {infoIcon}
          </span>
          <div style={{ backgroundColor: "#FC8551", width: "30px", height: "30px", display: "flex", justifyContent: "center", alignItems: "center", marginRight: "10px", borderRadius: "3px" }}>
            <span style={{ color: "#fff", fontSize: "14px", transform: expandedSection === catKey ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
          </div>
        </div>
        <div 
          className="accordion-body" 
          style={{ 
            maxHeight: expandedSection === catKey ? "2000px" : "0", 
            overflow: "hidden", 
            transition: "max-height 0.4s ease-in-out",
            backgroundColor: "#fbfbfb" 
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
              <thead>
                <tr style={{ backgroundColor: "#58585a", color: "#fff", height: "45px" }}>
                  <th style={{ padding: "10px", textAlign: "left", width: "30%", borderRight: "1px solid #6c6c6c", borderBottom: "1px solid #444" }}></th>
                  {serviceColumns.map(svc => (
                    <th key={svc} style={{ padding: "10px", textTransform: "uppercase", fontSize: "12px", borderRight: "1px solid #6c6c6c", borderBottom: "1px solid #444" }}>
                      {svc} {svc !== "clean" && infoIcon}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {itemNames.map((itemName, idx) => (
                  <tr key={itemName} style={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#fff", borderBottom: "1px solid #e5e5e5" }}>
                    <td style={{ padding: "15px 20px", textAlign: "left", fontWeight: "600", color: "#333", borderRight: "1px solid #e5e5e5", fontSize: "14px" }}>
                      {itemName}
                    </td>
                    {serviceColumns.map(svc => {
                      const qty = cartData.advancedCarpet?.[catKey]?.[itemName]?.[svc] || 0;
                      return (
                        <td key={svc} style={{ padding: "15px 10px", borderRight: "1px solid #e5e5e5" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #d1d1d1", borderRadius: "3px", backgroundColor: "#fff", height: "35px" }}>
                            <button 
                              style={{ border: "none", background: "none", width: "35px", height: "100%", cursor: "pointer", fontSize: "18px", color: "#666", borderRight: "1px solid #eee" }}
                              onClick={() => handleCountChange(catKey, itemName, svc, -1)}
                            >
                              -
                            </button>
                            <span style={{ minWidth: "40px", fontSize: "14px", color: "#333" }}>{qty}</span>
                            <button 
                              style={{ border: "none", background: "none", width: "35px", height: "100%", cursor: "pointer", fontSize: "18px", color: "#666", borderLeft: "1px solid #eee" }}
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
            <div style={{ padding: "20px", fontSize: "12px", color: "#666", textAlign: "left" }}>
              Pricing based on standard room size up to 300 square feet. Minimums may apply.<br/><br/>
              <a href="#" style={{ color: "#333", textDecoration: "underline" }}>View Terms & Conditions</a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const formatPrice = (val) => `$${Number(val).toFixed(2)}`;

  const renderQuoteSummary = () => {
    const categories = ["carpet", "upholstery", "tile"];
    const summary = [];

    categories.forEach((cat) => {
      const items = cartData.advancedCarpet?.[cat];
      if (!items) return;

      const catAgg = {};
      let catSubtotal = 0;

      Object.entries(items).forEach(([itemName, services]) => {
        Object.entries(services).forEach(([serviceName, qty]) => {
          if (qty > 0) {
            const unitPrice = pricing[cat]?.[itemName]?.[serviceName] || 0;
            const lineTotal = unitPrice * qty;
            
            if (!catAgg[serviceName]) catAgg[serviceName] = { qty: 0, price: 0 };
            catAgg[serviceName].qty += qty;
            catAgg[serviceName].price += lineTotal;
            catSubtotal += lineTotal;
          }
        });
      });

      if (catSubtotal > 0) {
        summary.push({
          cat,
          services: catAgg,
          subtotal: catSubtotal
        });
      }
    });

    if (summary.length === 0) return null;

    return (
      <div style={{ marginBottom: "15px" }}>
        {summary.map(s => (
           <div key={s.cat} style={{ marginBottom: "10px" }}>
              <div style={{ backgroundColor: "#222", color: "#fff", padding: "10px 15px", fontWeight: "700", borderRadius: "3px", fontSize: "12px", textTransform: "uppercase" }}>
                {s.cat}
              </div>
              <div style={{ padding: "10px 15px" }}>
                {Object.entries(s.services).map(([svc, data]) => (
                  <div key={svc} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "12px" }}>
                    <span style={{ textTransform: "capitalize", color: "#333", width: "40%" }}>{svc === "clean" && s.cat === "tile" ? "Tile Clean" : svc}</span>
                    <div style={{ display: "flex", width: "60%", justifyContent: "space-between", color: "#555" }}>
                      <span>{data.qty}</span>
                      <span style={{ color: "#333" }}>{formatPrice(data.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 15px", backgroundColor: "#fff", borderRadius: "3px", fontWeight: "700", fontSize: "13px", color: "#333", border: "1px solid #eaeaea" }}>
                <span>SUBTOTAL</span>
                <span>{formatPrice(s.subtotal)}</span>
              </div>
           </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: "1250px", margin: "0 auto", padding: "20px", fontFamily: "'Inter', sans-serif" }}>
      <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: "36px", fontWeight: "900", color: "#111", margin: "0 0 10px 0" }}>What can we clean for you?</h2>
      <div style={{ width: "60px", height: "2px", backgroundColor: "#FC8551", marginBottom: "15px" }}></div>
      <p style={{ fontSize: "13px", fontWeight: "500", color: "#333", marginBottom: "30px" }}>
        Please select all items and services from the drop downs below for an accurate quote and any discount that may apply.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2.4fr 1fr", justifyContent: "space-between", gap: "25px" }}>
        
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ backgroundColor: "#f4f4f4", padding: "12px 15px", borderRadius: "3px" }}>
            <p style={{ margin: 0, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
              <span style={{ display: "flex", alignItems: "center" }}>
                <span style={{ color: "#FC8551", marginRight: "8px", fontSize: "14px" }}>📍</span> 
                ZIP: <span style={{ marginLeft: "4px" }}>{cartData.zipCode || "95110"}</span> <span style={{ fontWeight: "normal", fontSize: "11px", marginLeft: "6px", textDecoration: "underline", cursor: "pointer" }}>Change</span>
              </span>
              <span style={{ color: "#666", fontSize: "10px" }}>▼</span>
            </p>
          </div>
          <div style={{ backgroundColor: "#dcdcdc", padding: "12px 15px", borderRadius: "3px", textAlign: "center", fontSize: "12px", color: "#555", marginBottom: "10px" }}>
            1-800-STEEMER / (800) 783-3637
          </div>
          
          <h4 style={{ margin: "5px 0 5px 0", fontSize: "12px", fontWeight: "700" }}>ONLINE SPECIALS</h4>
          
          <div style={{ backgroundColor: "#f4f4f4", padding: "15px", borderRadius: "3px" }}>
            <p style={{ fontWeight: "600", fontSize: "12px", margin: "0 0 15px 0", lineHeight: "1.4" }}>3 Rooms of Carpet Cleaned for $199</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button style={{ backgroundColor: "#FC8551", border: "none", padding: "8px 20px", color: "#fff", fontWeight: "bold", borderRadius: "2px", cursor: "pointer", fontSize: "11px" }}>APPLY</button>
              <span style={{ fontSize: "10px", textDecoration: "underline", color: "#666", cursor: "pointer" }}>Disclaimer</span>
            </div>
          </div>
          
          <div style={{ backgroundColor: "#f4f4f4", padding: "15px", borderRadius: "3px" }}>
            <p style={{ fontWeight: "600", fontSize: "12px", margin: "0 0 15px 0" }}>$50 off Duct Cleaning</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button style={{ backgroundColor: "#FC8551", border: "none", padding: "8px 20px", color: "#fff", fontWeight: "bold", borderRadius: "2px", cursor: "pointer", fontSize: "11px" }}>APPLY</button>
              <span style={{ fontSize: "10px", textDecoration: "underline", color: "#666", cursor: "pointer" }}>Disclaimer</span>
            </div>
          </div>
        </div>

        {/* Middle Column */}
        <div>
          {renderTable("CARPET CLEANING", "carpet")}
          {renderTable("UPHOLSTERY CLEANING", "upholstery")}
          {renderTable("TILE & GROUT FLOOR CLEANING", "tile")}
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ backgroundColor: "#f4f4f4", padding: "15px", borderRadius: "3px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", paddingBottom: "10px", marginBottom: "15px" }}>
              <h4 style={{ margin: 0, fontSize: "13px", color: "#333" }}>YOUR QUOTE</h4>
              <span style={{ fontSize: "11px", textDecoration: "underline", cursor: "pointer", fontWeight: "600", color: "#111" }}>Clear</span>
            </div>
            
            {renderQuoteSummary()}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <span style={{ fontSize: "10px", color: "#666", lineHeight: "1.2" }}>ESTIMATED<br/>TOTAL:</span>
              <span style={{ fontSize: "24px", fontWeight: "800", color: "#333", lineHeight: "1" }}>{formatPrice(cartData.finalPrice || 0)}</span>
            </div>
          </div>

          <div style={{ backgroundColor: "#f4f4f4", padding: "15px", borderRadius: "3px" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#333" }}>Promo Code</h4>
            <div style={{ display: "flex", gap: "8px" }}>
              <input 
                type="text" 
                placeholder="Enter Code" 
                value={cartData.appliedPromo || ""}
                onChange={(e) => updateCartData("appliedPromo", e.target.value.toUpperCase())}
                style={{ flex: 1, padding: "8px", border: "1px solid #999", borderRadius: "2px", width: "100%", fontSize: "12px" }}
              />
              <button style={{ backgroundColor: "#FC8551", border: "none", padding: "0 15px", color: "#fff", fontWeight: "bold", borderRadius: "2px", cursor: "pointer", fontSize: "11px" }}>APPLY</button>
            </div>
          </div>

          <div style={{ backgroundColor: "#f4f4f4", padding: "15px", borderRadius: "3px" }}>
            <h4 style={{ margin: "0 0 15px 0", fontSize: "12px", lineHeight: "1.4", color: "#111", fontWeight: "700" }}>For a more accurate estimate, please check all that apply:</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label style={{ display: "flex", alignItems: "center", fontSize: "11px", gap: "10px", cursor: "pointer", color: "#333" }}>
                <input type="checkbox" style={{ width: "14px", height: "14px" }}/> I do not have parking nearby.
              </label>
              <label style={{ display: "flex", alignItems: "center", fontSize: "11px", gap: "10px", cursor: "pointer", color: "#333" }}>
                <input type="checkbox" style={{ width: "14px", height: "14px" }}/> Area is on 3rd floor or higher.
              </label>
              <label style={{ display: "flex", alignItems: "center", fontSize: "11px", gap: "10px", cursor: "pointer", color: "#333" }}>
                <input type="checkbox" style={{ width: "14px", height: "14px" }}/> I have guaranteed parking.
              </label>
            </div>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
             <button 
              onClick={() => { window.location.href = "/pricing/pro-services"; }}
              style={{ padding: "10px 20px", backgroundColor: "#fff", border: "1px solid #ccc", color: "#333", fontWeight: "bold", fontSize: "14px", cursor: "pointer", borderRadius: "3px" }}
            >
              Back
            </button>
            <button 
              onClick={() => { window.location.href = "/pricing/final-summary"; }}
              style={{ padding: "10px 30px", backgroundColor: "#FC8551", color: "#fff", fontWeight: "bold", fontSize: "14px", border: "none", cursor: "pointer", borderRadius: "3px" }}
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
