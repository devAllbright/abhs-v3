import { useState, useEffect } from "react";
import { useShoppingCart } from "../../context/ShoppingCartContext";
import "../../styles/pricing/home-details.css";

export default function StepHomeDetails() {
  const { cartData, updateCartData } = useShoppingCart();

  const [counters, setCounters] = useState({
    bedrooms: cartData.bedroomNumber || 1,
    fullBathrooms: cartData.bathroomNumber || 1,
    halfBathrooms: cartData.halfBathroomNumber || 0,
    otherRooms: cartData.otherRoomNumber || 0
  });

  const [squareFootage, setSquareFootage] = useState(
    Number(cartData.squareFootage) || 800
  );

  // -----------------------------------------
  // COUNTERS
  // -----------------------------------------
  const handleCounterChange = (field, delta) => {
    setCounters((prev) => {
      let newValue = prev[field] + delta;

      const limits = {
        bedrooms: { min: 1, max: 5 },
        fullBathrooms: { min: 1, max: 5 },
        halfBathrooms: { min: 0, max: 5 },
        otherRooms: { min: 0, max: 5 }
      };

      const { min, max } = limits[field];
      if (newValue < min) newValue = min;
      if (newValue > max) newValue = max;

      return { ...prev, [field]: newValue };
    });
  };

  // -----------------------------------------
  // SQFT INPUT — CORRECT BEHAVIOR
  // -----------------------------------------

  // Allow typing any number (no auto-correct here)
  const handleSqftChange = (e) => {
    let raw = e.target.value.replace(/\D/g, "");
    const value = raw === "" ? "" : Number(raw);
    setSquareFootage(value);
  };

  // Apply correction when leaving the field
  const handleSqftBlur = () => {
    let value = Number(squareFootage);

    if (!value || value < 800) value = 800;

    setSquareFootage(value);
  };

  // -----------------------------------------
  // SYNC WITH CONTEXT
  // -----------------------------------------
  useEffect(() => {
    updateCartData({
      livingRoomIncluded: true,
      kitchenIncluded: true,
      dinningRoomIncluded: true,
      bedroomNumber: counters.bedrooms,
      bathroomNumber: counters.fullBathrooms,
      halfBathroomNumber: counters.halfBathrooms,
      otherRoomNumber: counters.otherRooms,
      squareFootage: Number(squareFootage) || 800
    });
  }, [counters, squareFootage]);

  // -----------------------------------------
  // NEXT BUTTON VALIDATION
  // -----------------------------------------
  const handleNextClick = () => {
    if (squareFootage > 3600) {
      alert(
        "For homes larger than 3600 sq ft, please speak with our Personal Concierge for a custom quote."
      );
      window.location.href = "/";
      return;
    }

    window.location.href = "/pricing/pro-services";
  };

  return (
    <>
      <div className="details-container">

        {/* Included Rooms */}
        {["Living Room", "Kitchen", "Dinning Room"].map((room) => (
          <div key={room} className="detail-element active-detail">
            <div className="detail-img">
              <img
                src={`/shopping-cart/${room.toLowerCase().replace(" ", "-")}.png`}
                alt={room}
              />
            </div>
            <div className="detail-info">
              <div>
                <div className="detail-name">{room}</div>
                <div className="detail-counter">Included</div>
              </div>
            </div>
          </div>
        ))}

        {/* Square Footage Input */}
        <div className="detail-element active-detail">
          <div className="detail-img">
            <img src="/shopping-cart/square-footage.png" alt="Square Footage" />
          </div>
          <div className="detail-info">
            <div>
              <div className="detail-name">Square Footage</div>
              <div className="detail-counter">
                <input
                  className="sqft-input"
                  value={squareFootage}
                  onChange={handleSqftChange}
                  onBlur={handleSqftBlur}
                  min="0" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Counters */}
        {[
          { key: "bedrooms", label: "Bedroom(s)", img: "bedroom.png" },
          { key: "fullBathrooms", label: "Full Bathroom(s)", img: "full-bathroom.png" },
          { key: "halfBathrooms", label: "Half Bathroom(s)", img: "half-bathroom.png" },
          { key: "otherRooms", label: "Other Room(s)", img: "other-room.png" }
        ].map(({ key, label, img }) => (
          <div
            key={key}
            className={`detail-element ${counters[key] > 0 ? "active-detail" : ""}`}
          >
            <div className="detail-img">
              <img src={`/shopping-cart/${img}`} alt={label} />
            </div>
            <div className="detail-info">
              <div>
                <div className="detail-name">{label}</div>
                <div className="detail-counter">
                  <img
                    src={
                      counters[key] > 0
                        ? "/shopping-cart/remove.png"
                        : "/shopping-cart/colored-remove.png"
                    }
                    alt="Decrease"
                    onClick={() => handleCounterChange(key, -1)}
                  />
                  <span>{counters[key]}</span>
                  <img
                    src={
                      counters[key] > 0
                        ? "/shopping-cart/add.png"
                        : "/shopping-cart/colored-add.png"
                    }
                    alt="Increase"
                    onClick={() => handleCounterChange(key, 1)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

      </div>

      <div className="navigation-buttons">
        <a href="/pricing/home-type">
          <button className="nav-button">Back</button>
        </a>
        <button className="nav-button" onClick={handleNextClick}>
          Next
        </button>
      </div>
    </>
  );
}
