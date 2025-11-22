import { useShoppingCart } from "../../../context/ShoppingCartContext";
import "../../../styles/pricing/shopping-cart/final-summary.css";

export default function FinalSummary() {
  const { cartData } = useShoppingCart();
  const { priceBreakdown } = cartData;

  // If cart not ready yet
  if (!priceBreakdown) return <p>Loading summary...</p>;

  const {
    serviceName,
    frequency,
    base,
    extrasList,
    discountAmount,
    final,
    additionalBlocks
  } = priceBreakdown;

  const finalTotal = final + (additionalBlocks?.reduce((sum, b) => sum + b.final, 0) || 0);

  // ---------------------------------------------------------
  // CREATE LEAD → send to Railway → Housecall Pro
  // ---------------------------------------------------------

  const createLead = async () => {
    const endpoint = "https://allbright-app-production.up.railway.app/api/create-lead";

    // Read stored customer info
    const contactInfo = JSON.parse(sessionStorage.getItem("contactInfo") || "{}");

    // Extract customer name
    const fullName = contactInfo.fullName || "Unknown";
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "N/A";
    const lastName = nameParts.slice(1).join(" ") || "-";

    // Build the LEAD payload for HCP
    const payload = {
      customer: {
        first_name: firstName,
        last_name: lastName,
        email: cartData.contactInfo.email || "noemail@example.com",
        mobile_number: contactInfo.phoneNumber || "0000000000",
        notifications_enabled: true,
        addresses: [
          {
            street: contactInfo.address || "N/A",
            city: contactInfo.city || "N/A",
            state: contactInfo.state || "CA",
            zip: cartData.zipCode || "00000"
          }
        ]
      },

      lead_source: cartData.contactInfo.source || "Website",

      note: [
        `Service: ${serviceName}`,
        `Frequency: ${frequency || "One-Time"}`,
        `Condition: ${cartData.condition}`,
        `House Type: ${cartData.houseType || "N/A"}`,
        `Square Footage: ${cartData.squareFootage || "N/A"}`,
        `Extras: ${extrasList.length > 0 ? extrasList.map(e => e.name).join(", ") : "None"}`,
        additionalBlocks?.length > 0 ? `Initial Cleaning Required: YES` : `Initial Cleaning Required: NO`,
        contactInfo.comments ? `Customer Comments: ${contactInfo.comments}` : null,
        `Total Estimated Price: $${finalTotal.toFixed(2)}`
      ]
        .filter(Boolean)
        .join("\n"),

      line_items: [
        {
          name: "Cleaning Quote",
          kind: "labor",
          quantity: 1,
          unit_price: finalTotal
        }
      ]
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Lead error:", data);
      throw new Error("Lead creation failed");
    }

    console.log("✅ Lead created:", data);
  };

  const handleNextClick = async () => {
    try {
      await createLead();
      window.location.href = "/thank-you";
    } catch (err) {
      alert("❌ Failed to create lead. Please try again.");
      console.error(err);
    }
  };

  // ---------------------------------------------------------
  // RENDER SUMMARY (matches YourQuote.jsx perfectly)
  // ---------------------------------------------------------

  return (
    <>
      <div className="final-summary">
        <div className="quote-container">
          <div className="quote-header">
            <p>FINAL SUMMARY</p>
          </div>

          {/* Main Service */}
          <div className="quote-line service-line">
            <div className="quote-service">
              <p>{serviceName}</p>
              <p>${base.toFixed(2)}</p>
            </div>
          </div>

          {/* Extras */}
          {extrasList?.map(ex => (
            <div key={ex.name} className="quote-line discount-line">
              <div className="quote-service extras-line">
                <p className="extra-text">+ {ex.name}</p>
                <p className="extra-text">${ex.price.toFixed(2)}</p>
              </div>
            </div>
          ))}

          {/* Discount */}
          {discountAmount > 0 && (
            <div className="quote-line discount-line">
              <div className="quote-service extras-line">
                <p className="extra-text">- {frequency} Discount</p>
                <p className="extra-text">-${discountAmount.toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Main total */}
          <div className="quote-line subtotal-line">
            <div className="quote-total">
              <p>Estimated Total</p>
              <p>${final.toFixed(2)}</p>
            </div>
          </div>

          {/* Initial Cleaning Block */}
          {additionalBlocks?.length > 0 &&
            additionalBlocks.map((block, i) => (
              <div key={i}>
                <div className="quote-line service-line">
                  <div className="quote-service">
                    <p>{block.label}</p>
                    <p>${block.base.toFixed(2)}</p>
                  </div>
                </div>

                {block.extrasList?.map(ex => (
                  <div key={ex.name} className="quote-line discount-line">
                    <div className="quote-service extras-line">
                      <p className="extra-text">+ {ex.name}</p>
                      <p className="extra-text">${ex.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                <div className="quote-line subtotal-line">
                  <div className="quote-total">
                    <p>Estimated Total</p>
                    <p>${block.final.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <a href="/pricing/shopping-cart">
          <button className="nav-button">Back</button>
        </a>
        <button className="nav-button" onClick={handleNextClick}>
          Confirm
        </button>
      </div>
    </>
  );
}
