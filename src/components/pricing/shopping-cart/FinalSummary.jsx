import { useEffect, useState } from "react";
import "../../../styles/pricing/shopping-cart/final-summary.css";

export default function FinalSummary() {
  const [orderSummary, setOrderSummary] = useState(null);
  const [finalTotal, setFinalTotal] = useState(0);

  useEffect(() => {
    const storedOrder = sessionStorage.getItem("orderSummary");
    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);
      setOrderSummary(parsedOrder);

      let total = parsedOrder.activeServices.reduce((sum, service) => sum + service.price, 0);

      Object.values(parsedOrder.activeExtras).forEach((extras) => {
        total += extras.reduce((sum, extra) => sum + extra.price, 0);
      });

      total -= parsedOrder.bundleDiscount || 0;
      total -= parsedOrder.frequencyDiscount || 0;

      if (parsedOrder.initialCleaning) {
        total += parsedOrder.initialCleaning.price;
      }

      setFinalTotal(total);
    }
  }, []);

  if (!orderSummary) return <p>Loading order summary...</p>;

  const {
    activeServices,
    activeExtras,
    initialCleaning,
  } = orderSummary;

  const createLead = async () => {
    const endpoint = "https://allbright-app-production.up.railway.app/api/create-lead";

    // Get all data from sessionStorage
    const contactInfo = JSON.parse(sessionStorage.getItem("contactInfo") || "{}");
    const step1FormData = JSON.parse(sessionStorage.getItem("step1FormData") || "{}");
    const homeDetails = JSON.parse(sessionStorage.getItem("homeDetails") || "{}");
    const serviceType = sessionStorage.getItem("serviceType") || "N/A";

    // Parse names safely
    const fullName = contactInfo.fullName || "Unknown";
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "N/A";
    const lastName = nameParts.slice(1).join(" ") || "-";

    const customer = {
      first_name: firstName,
      last_name: lastName,
      email: step1FormData.email || "noemail@example.com",
      mobile_number: contactInfo.phoneNumber || "0000000000",
      notifications_enabled: true,
      addresses: [
        {
          street: contactInfo.address || "N/A",
          city: contactInfo.city || "N/A",
          state: contactInfo.state || "CA",
          zip: contactInfo.zip || "00000"
        }
      ]
    };

    const lead_source = step1FormData.source || "Website";

    const extrasText = Object.values(activeExtras)
      .flatMap((arr) => arr.map((extra) => extra.name))
      .join(", ") || "None";

    const noteLines = [
      `Appointment: ${contactInfo.appointment || "Not specified"}`,
      `Comments: ${contactInfo.comments || "None"}`,
      `House Type: ${step1FormData.houseType || "N/A"}`,
      `Service Type: ${serviceType}`,
      `Services: ${activeServices.map((s) => s.name).join(", ") || "N/A"}`,
      `Extras: ${extrasText}`,
      `Initial Cleaning: ${initialCleaning ? initialCleaning.name : "No"}`,
      `Home Details: ${JSON.stringify(homeDetails.counters || {})}`,
      `Total Estimated Price: $${finalTotal}`
    ];

    const payload = {
      customer,
      lead_source,
      note: noteLines.join("\n"),
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
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Lead creation failed");
    console.log("✅ Lead created:", data);
  };

  const handleNextClick = async () => {
    try {
      await createLead();
      window.location.href = "/pricing/thank-you";
    } catch (error) {
      alert("❌ Failed to create lead. Please try again.");
      console.error(error);
    }
  };

  return (
    <>
      <div className="final-summary">
        <div className="quote-container">
          <div className="quote-header">
            <p>FINAL SUMMARY</p>
          </div>

          {activeServices.map((service) => (
            <div key={service.id}>
              <div className="quote-line service-line">
                <div className="quote-service">
                  <p>{service.name}</p>
                  <p>${service.price.toFixed(2)}</p>
                </div>
              </div>

              {activeExtras[service.id]?.map((extra) => (
                <div key={extra.id} className="quote-line discount-line">
                  <div className="quote-service extras-line">
                    <p className="extra-text">+ {extra.name}</p>
                    <p className="extra-text">${extra.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {initialCleaning && (
            <div className="quote-line initial-cleaning-line">
              <div className="quote-service">
                <p>{initialCleaning.name}</p>
                <p>${initialCleaning.price.toFixed(2)}</p>
              </div>
            </div>
          )}

          <div className="quote-line total-line">
            <div className="quote-total">
              <p>Estimated Total</p>
              <p>${finalTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <a href="/pricing/shopping-cart">
          <button className="nav-button">Back</button>
        </a>
        <button className="nav-button" onClick={handleNextClick}>
          Confirm & Continue
        </button>
      </div>
    </>
  );
}
